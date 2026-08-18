'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 'faculty-appraisal-portal',
    name: 'Faculty Appraisal Portal',
    category: 'Web Application',
    tagline: 'Full-stack MERN platform automating faculty self-appraisal workflows across four roles: Admin, Faculty, HOD, and Principal. Includes JWT authentication, RBAC security, file uploads, and PDF generation.',
    stack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'JWT', 'Puppeteer', 'bcrypt'],
    architecture: 'React client → Express/Node API → JWT and RBAC middleware → MongoDB persistence. Multer handles uploads, while Puppeteer generates role-specific appraisal PDFs.',
    image: '/project-faculty.svg',
    year: 'Project',
    repoLink: '',
    liveLink: '',
  },
  {
    id: 'pediatric-vaccination-management',
    name: 'Pediatric Vaccination Management System',
    category: 'Healthcare / AI Platform',
    tagline: 'Full-stack pediatric vaccination platform for dual-schedule UIP/IAP tracking using atomic Firestore batch writes and an AI-driven Smart Availability assistant.',
    stack: ['Next.js 15', 'TypeScript', 'Firebase Firestore', 'Gemini 2.5 Flash', 'Genkit', 'Zod'],
    architecture: 'Next.js application → typed Zod validation → atomic Firestore batch writes → UIP/IAP schedule state. Genkit and Gemini power the Smart Availability assistant.',
    image: '/project-vaccination.svg',
    year: 'Project',
    repoLink: '',
    liveLink: '',
  },
  {
    id: 'target-x-crispr-analysis',
    name: 'Target-X: CRISPR Target Analysis',
    category: 'AI / Bioinformatics Platform',
    tagline: 'AI-powered platform automating CRISPR target analysis with a gRNA ranking engine evaluating on-target efficiency and off-target risk metrics.',
    stack: ['React', 'Flask', 'Machine Learning', 'REST APIs'],
    architecture: 'React interface → Flask REST API → gRNA ranking engine → machine-learning scoring for on-target efficiency and off-target risk metrics.',
    image: '/project-targetx.svg',
    year: 'Project',
    repoLink: '',
    liveLink: '',
  },
];

type Project = (typeof PROJECTS)[number];

// ─── Cube geometry ─────────────────────────────────────────────────────────────
// Scene 0 = intro, scenes 1–3 = projects
const SCENE_COUNT = PROJECTS.length + 1;

// Which of the 6 cube faces is front-facing at each scroll stop
function faceAtStop(i: number): number {
  if (i < 6) return i;
  return 1 + ((i - 2) % 4);
}

// CSS 3D transforms for a 16:9 rectangular prism (depth = width).
// Side faces use --cw/2; top/bottom use --ch/2 so the box seals correctly.
const FACE_TRANSFORMS: string[] = [
  'rotateX(-90deg) translateZ(calc(var(--ch) / 2))',
  'translateZ(calc(var(--cw) / 2))',
  'rotateY(90deg) translateZ(calc(var(--cw) / 2))',
  'rotateY(180deg) translateZ(calc(var(--cw) / 2))',
  'rotateY(-90deg) translateZ(calc(var(--cw) / 2))',
  'rotateX(90deg) translateZ(calc(var(--ch) / 2))',
];

// Scroll stops: rotation state at each scene index
function buildStops(n: number): { rx: number; ry: number }[] {
  const base = [
    { rx: 90,  ry: 0 },
    { rx: 0,   ry: 0 },
    { rx: 0,   ry: -90 },
    { rx: 0,   ry: -180 },
    { rx: 0,   ry: -270 },
    { rx: -90, ry: -360 },
  ];
  const out = base.slice(0, Math.min(n, 6));
  for (let i = 6; i < n; i++) {
    out.push({ rx: 0, ry: -360 - (i - 6) * 90 });
  }
  return out;
}

const STOPS = buildStops(SCENE_COUNT);

const easeIO = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

function getCubeTransform(progress: number): { rx: number; ry: number } {
  const t = progress * (SCENE_COUNT - 1);
  const i = Math.min(Math.floor(t), SCENE_COUNT - 2);
  const f = easeIO(t - i);
  const a = STOPS[i];
  const b = STOPS[i + 1];
  return { rx: a.rx + (b.rx - a.rx) * f, ry: a.ry + (b.ry - a.ry) * f };
}

// Must use the SAME segmentation as getCubeTransform above (SCENE_COUNT - 1
// segments, not SCENE_COUNT). The two previously disagreed, which left the text
// card describing a different project than the one shown on the cube's
// front-facing image across ~24% of the scroll range — the "mismatched cards"
// bug. Rounding (rather than flooring) swaps the card at the rotation midpoint,
// which is exactly when the next face turns to camera.
function sceneFromProgress(progress: number): number {
  const t = progress * (SCENE_COUNT - 1);
  return Math.max(0, Math.min(SCENE_COUNT - 1, Math.round(t)));
}

// Compute which project image belongs on each face, pre-loading nearby stops
const SWAP_RADIUS = 3;

function deriveFaceImages(stopIdx: number): (number | null)[] {
  const images: (number | null)[] = Array(6).fill(null);
  for (let offset = -SWAP_RADIUS; offset <= SWAP_RADIUS; offset++) {
    const si = stopIdx + offset;
    if (si < 0 || si >= SCENE_COUNT) continue;
    const fi = faceAtStop(si);
    const pi = si - 1; // scene 0 is intro (no project image)
    if (pi >= 0 && pi < PROJECTS.length) {
      images[fi] = pi;
    }
  }
  return images;
}

// ─── Background canvas — tiny drifting particles ──────────────────────────────
function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let w = 0;
    let h = 0;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    interface Dot {
      x: number; y: number;
      vx: number; vy: number;
      r: number;
      a: number;
      aMin: number;
      aMax: number;
      aDir: number;
      aSpd: number;
    }

    const COUNT = 160;
    const make = (): Dot => {
      const isStar = Math.random() < 0.25;
      const aMax = isStar ? 0.12 + Math.random() * 0.1 : 0.04 + Math.random() * 0.06;
      const aMin = aMax * 0.15;
      return {
        x: Math.random() * (w || window.innerWidth),
        y: Math.random() * (h || window.innerHeight),
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.14 - 0.025, // slight upward float
        r: isStar ? 0.75 + Math.random() * 0.9 : 0.35 + Math.random() * 0.55,
        a: aMin + Math.random() * (aMax - aMin),
        aMin,
        aMax,
        aDir: Math.random() < 0.5 ? 1 : -1,
        aSpd: 0.00025 + Math.random() * 0.0005,
      };
    };

    const dots: Dot[] = Array.from({ length: COUNT }, make);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      ctx.clearRect(0, 0, w, h);

      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;

        if (d.x < -2) d.x = w + 2;
        else if (d.x > w + 2) d.x = -2;
        if (d.y < -2) d.y = h + 2;
        else if (d.y > h + 2) d.y = -2;

        d.a += d.aSpd * d.aDir;
        if (d.a >= d.aMax) { d.a = d.aMax; d.aDir = -1; }
        else if (d.a <= d.aMin) { d.a = d.aMin; d.aDir = 1; }

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${d.a.toFixed(3)})`;
        ctx.fill();
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

function ProjectActions({ project, align = 'left' }: { project: Project; align?: 'left' | 'right' }) {
  const [expanded, setExpanded] = useState(false);
  const panelId = `architecture-${project.id}-${useId().replace(/:/g, '')}`;
  const right = align === 'right';
  const actionStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    border: '1px solid rgba(255,255,255,0.14)',
    color: 'rgba(255,255,255,0.58)',
    background: 'transparent',
    fontFamily: 'Satoshi, system-ui, sans-serif',
    fontSize: '0.5rem',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    padding: '0.52rem 0.72rem',
    textDecoration: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={{ marginTop: '1.1rem', textAlign: right ? 'right' : 'left' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: right ? 'flex-end' : 'flex-start', gap: '0.4rem' }}>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          aria-label={`${expanded ? 'Hide' : 'View'} architecture for ${project.name}`}
          onClick={() => setExpanded((value) => !value)}
          style={actionStyle}
        >
          {expanded ? 'Hide Architecture' : 'View Architecture'}
          <span aria-hidden>{expanded ? '−' : '+'}</span>
        </button>
        {project.repoLink ? (
          <a href={project.repoLink} target="_blank" rel="noopener noreferrer" style={actionStyle}>
            GitHub Repo <ArrowUpRight size={9} />
          </a>
        ) : (
          <span style={{ ...actionStyle, color: 'rgba(255,255,255,0.22)', cursor: 'default' }}>Repo Link Pending</span>
        )}
        {project.liveLink ? (
          <a href={project.liveLink} target="_blank" rel="noopener noreferrer" style={actionStyle}>
            Live Demo <ArrowUpRight size={9} />
          </a>
        ) : (
          <span style={{ ...actionStyle, color: 'rgba(255,255,255,0.22)', cursor: 'default' }}>Live Link Pending</span>
        )}
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={panelId}
            role="region"
            aria-label={`${project.name} architecture`}
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden', marginTop: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.8rem' }}
          >
            <p style={{ fontFamily: 'Satoshi, system-ui, sans-serif', fontSize: '0.48rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '0.45rem' }}>
              Architecture
            </p>
            <p style={{ fontFamily: 'Satoshi, system-ui, sans-serif', fontSize: '0.68rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.46)' }}>
              {project.architecture}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function ProjectCard({ project, align }: { project: Project; align: 'left' | 'right' }) {
  const right = align === 'right';
  return (
    <div
      style={{
        padding: '1.75rem 1.5rem',
        background: 'rgba(12,12,12,0.92)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        borderLeft: right ? 'none' : '1px solid rgba(255,255,255,0.07)',
        borderRight: right ? '1px solid rgba(255,255,255,0.07)' : 'none',
      }}
    >
      {/* Accent line */}
      <div
        style={{
          width: '2rem',
          height: '1px',
          background: 'rgba(255,255,255,0.5)',
          marginBottom: '1.1rem',
          marginLeft: right ? 'auto' : 0,
        }}
      />

      {/* Category · year */}
      <p
        style={{
          fontFamily: 'Satoshi, system-ui, sans-serif',
          fontSize: '0.5rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.28)',
          marginBottom: '0.75rem',
          textAlign: right ? 'right' : 'left',
        }}
      >
        {project.category}&nbsp;·&nbsp;{project.year}
      </p>

      {/* Name */}
      <h3
        style={{
          fontFamily: 'Satoshi, system-ui, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)',
          letterSpacing: '-0.04em',
          lineHeight: 0.88,
          color: 'rgba(255,255,255,0.92)',
          marginBottom: '0.9rem',
          textAlign: right ? 'right' : 'left',
        }}
      >
        {project.name}
      </h3>

      {/* Tagline */}
      <p
        style={{
          fontFamily: 'Satoshi, system-ui, sans-serif',
          fontSize: '0.73rem',
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.32)',
          marginBottom: '1rem',
          textAlign: right ? 'right' : 'left',
        }}
      >
        {project.tagline}
      </p>

      {/* Stack pills */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.35rem',
          marginBottom: '1.2rem',
          justifyContent: right ? 'flex-end' : 'flex-start',
        }}
      >
        {project.stack.map((t) => (
          <span
            key={t}
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.28)',
              fontFamily: 'Satoshi, system-ui, sans-serif',
              fontSize: '0.48rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '0.18rem 0.5rem',
            }}
          >
            {t}
          </span>
        ))}
      </div>

      <ProjectActions project={project} align={align} />
    </div>
  );
}

// ─── Mobile card ──────────────────────────────────────────────────────────────
// Phones get a plain, natively-scrolling list instead of the desktop cube. The
// cube costs SCENE_COUNT × 100vh of scroll-jacked height (21 screen-heights to
// get past this one section) and runs heavy 3-D transforms — miserable on touch.
function MobileProjectCard({ project, index }: { project: Project; index: number }) {
  const num = String(index + 1).padStart(2, '0');
  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        borderRadius: '14px',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.022)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Media */}
      <div style={{ position: 'relative', aspectRatio: '16 / 10', overflow: 'hidden' }}>
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover"
          quality={72}
          sizes="100vw"
          loading="lazy"
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.55) 38%, rgba(10,10,10,0.10) 100%)',
          }}
        />
        <span
          style={{
            position: 'absolute',
            top: '0.8rem',
            left: '0.95rem',
            fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
            fontSize: '0.55rem',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.55)',
          }}
        >
          {num}
        </span>

        <div style={{ position: 'absolute', left: '0.95rem', right: '0.95rem', bottom: '0.8rem' }}>
          <p
            style={{
              fontFamily: 'Satoshi, system-ui, sans-serif',
              fontSize: '0.5rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '0.4rem',
            }}
          >
            {project.category}&nbsp;·&nbsp;{project.year}
          </p>
          <h3
            style={{
              fontFamily: 'Satoshi, system-ui, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(1.5rem, 6.5vw, 2rem)',
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              color: 'rgba(255,255,255,0.96)',
            }}
          >
            {project.name}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '1rem 1.1rem 1.15rem' }}>
        <p
          style={{
            fontFamily: 'Satoshi, system-ui, sans-serif',
            fontSize: '0.78rem',
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.42)',
            marginBottom: '0.9rem',
          }}
        >
          {project.tagline}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
          {project.stack.map((t) => (
            <span
              key={t}
              style={{
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.35)',
                fontFamily: 'Satoshi, system-ui, sans-serif',
                fontSize: '0.5rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                padding: '0.2rem 0.5rem',
                borderRadius: '2px',
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <ProjectActions project={project} align="left" />
      </div>
    </motion.article>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);

  // Direct DOM refs for HUD — avoids React re-renders on every scroll frame
  const hudPctRef = useRef<HTMLDivElement>(null);
  const hudFillRef = useRef<HTMLDivElement>(null);
  const hudSceneRef = useRef<HTMLDivElement>(null);
  const captionNumRef = useRef<HTMLDivElement>(null);
  const captionLabelRef = useRef<HTMLDivElement>(null);

  const [activeScene, setActiveScene] = useState(0);
  const activeSceneRef = useRef(0);
  const [faceImages, setFaceImages] = useState<(number | null)[]>(() => deriveFaceImages(0));

  useEffect(() => {
    if (!sectionRef.current || !cubeRef.current) return;
    // Desktop only — mobile renders a plain scrolling list, so there is no cube
    // to drive and no scroll-jacked height to scrub against.
    if (window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      // A little smoothing instead of `true` (=0): catches up over ~0.35s so a
      // flung scroll settles into place rather than snapping through scenes.
      scrub: 0.35,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const p = self.progress;

        // Cube rotation — direct DOM write, no React state
        const { rx, ry } = getCubeTransform(p);
        cubeRef.current!.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;

        // HUD percentage
        const pct = Math.round(p * 100);
        if (hudPctRef.current) {
          hudPctRef.current.textContent = String(pct).padStart(3, '0') + '%';
        }
        if (hudFillRef.current) {
          hudFillRef.current.style.width = `${pct}%`;
        }

        // Scene transition (fires only when crossing a scene boundary)
        const newScene = sceneFromProgress(p);
        if (newScene !== activeSceneRef.current) {
          activeSceneRef.current = newScene;

          const label =
            newScene === 0 ? 'OVERVIEW' : PROJECTS[newScene - 1].category.toUpperCase();

          if (hudSceneRef.current) hudSceneRef.current.textContent = label;
          if (captionNumRef.current) {
            captionNumRef.current.textContent = String(newScene).padStart(2, '0');
          }
          if (captionLabelRef.current) captionLabelRef.current.textContent = label;

          setActiveScene(newScene);
          setFaceImages(deriveFaceImages(newScene));
        }
      },
    });

    return () => trigger.kill();
  }, []);

  const project = activeScene > 0 ? PROJECTS[activeScene - 1] : null;
  // Odd scenes → left card, even scenes → right card
  const isRight = activeScene > 0 && activeScene % 2 === 0;

  return (
    <section
      ref={sectionRef}
      id="work"
      data-theme="dark"
      className="projects-section"
      // Height lives in CSS (see globals.css): the tall scroll-jacked track only
      // applies at md+. Doing it here in JS would need a post-mount media check,
      // which flashes the wrong layout on first paint / risks hydration mismatch.
      style={
        {
          '--scene-vh': `${SCENE_COUNT * 100}vh`,
          background: '#0A0A0A',
          position: 'relative',
        } as React.CSSProperties
      }
    >
      {/* ── Sticky viewport — desktop only ──────────────────────────────────── */}
      <div
        data-cursor="view"
        className="projects-motion-desktop hidden md:block"
        style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}
      >

        {/* ── Background layer — no filter:blur so preserve-3d cube stays sharp ── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <BackgroundCanvas />

          {/* Ambient orb 1 — top-left. Pure radial-gradient, no filter:blur. */}
          <motion.div
            aria-hidden
            style={{
              position: 'absolute',
              top: '-20%',
              left: '-15%',
              width: '75vw',
              height: '75vw',
              background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.032) 0%, rgba(255,255,255,0.01) 40%, transparent 70%)',
            }}
            animate={{ x: [0, 40, -25, 0], y: [0, 30, -40, 0] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Ambient orb 2 — bottom-right */}
          <motion.div
            aria-hidden
            style={{
              position: 'absolute',
              bottom: '-25%',
              right: '-18%',
              width: '70vw',
              height: '70vw',
              background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.022) 0%, rgba(255,255,255,0.007) 45%, transparent 70%)',
            }}
            animate={{ x: [0, -35, 20, 0], y: [0, -25, 35, 0] }}
            transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Section label — top left */}
        <div className="absolute top-7 left-8 z-20 flex items-center gap-3">
          <span
            className="text-[0.52rem] tracking-[0.25em] uppercase font-medium"
            style={{ fontFamily: 'Satoshi, system-ui, sans-serif', color: 'rgba(255,255,255,0.18)' }}
          >
            02 / Work
          </span>
          <div style={{ width: '2rem', height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <span
            className="text-[0.52rem] tracking-[0.25em] uppercase font-medium"
            style={{ fontFamily: 'Satoshi, system-ui, sans-serif', color: 'rgba(255,255,255,0.1)' }}
          >
            {PROJECTS.length} Projects
          </span>
        </div>

        {/* HUD — top right */}
        <div className="absolute top-7 right-8 z-20 text-right">
          <div
            ref={hudPctRef}
            style={{
              fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
              fontSize: '0.58rem',
              letterSpacing: '0.18em',
              color: 'rgba(255,255,255,0.22)',
            }}
          >
            000%
          </div>
          <div
            style={{
              width: '6rem',
              height: '1px',
              background: 'rgba(255,255,255,0.08)',
              marginTop: '0.4rem',
              marginLeft: 'auto',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              ref={hudFillRef}
              style={{
                position: 'absolute',
                inset: '0 auto 0 0',
                width: '0%',
                background: 'rgba(255,255,255,0.55)',
              }}
            />
          </div>
          <div
            ref={hudSceneRef}
            style={{
              fontFamily: 'Satoshi, system-ui, sans-serif',
              fontSize: '0.45rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.18)',
              marginTop: '0.3rem',
            }}
          >
            OVERVIEW
          </div>
        </div>

        {/* Nav dots — left (hidden on small screens) */}
        <div className="absolute left-7 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-2">
          {Array.from({ length: SCENE_COUNT }, (_, i) => (
            <div
              key={i}
              style={{
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                background: i === activeScene ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.18)',
                transform: i === activeScene ? 'scale(1.6)' : 'scale(1)',
                transition: 'background 0.3s, transform 0.3s',
              }}
            />
          ))}
        </div>

        {/* ── 3-D cube ─────────────────────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '1100px',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <div
            ref={cubeRef}
            style={
              {
                // 16:9 prism — depth equals width so all 4 side faces are 16:9
                '--cw': 'min(72vw, 700px)',
                '--ch': 'calc(var(--cw) * 9 / 16)',
                width: 'var(--cw)',
                height: 'var(--ch)',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transform: 'rotateX(90deg) rotateY(0deg)',
                flexShrink: 0,
              } as React.CSSProperties
            }
          >
            {([0, 1, 2, 3, 4, 5] as const).map((fi) => {
              // Top (0) & bottom (5) cap the box — they must be square (width × width)
              // so the prism seals without gaps. Side faces use inset:0 (16:9).
              const isCapFace = fi === 0 || fi === 5;
              return (
                <div
                  key={fi}
                  style={{
                    position: 'absolute',
                    overflow: 'hidden',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: FACE_TRANSFORMS[fi],
                    background: `
                      repeating-linear-gradient(0deg,   rgba(255,255,255,0.025) 0, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 48px),
                      repeating-linear-gradient(90deg,  rgba(255,255,255,0.025) 0, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 48px),
                      #0e0c0b
                    `,
                    // Cap faces: square (var(--cw) × var(--cw)), centered on the container
                    ...(isCapFace
                      ? {
                          left: 0,
                          right: 0,
                          top: 'calc(50% - var(--cw) / 2)',
                          width: 'var(--cw)',
                          height: 'var(--cw)',
                        }
                      : { inset: 0 }),
                  }}
                >
                  {faceImages[fi] !== null && (
                    <>
                      <Image
                        src={PROJECTS[faceImages[fi]!].image}
                        alt={PROJECTS[faceImages[fi]!].name}
                        fill
                        className="object-cover"
                        quality={90}
                        sizes="(max-width: 768px) 90vw, 1400px"
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(0,0,0,0.28)',
                        }}
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* ── Intro card — desktop (md+) fades out on scroll ───────────────── */}
        <AnimatePresence>
          {activeScene === 0 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.45 }}
              className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none"
              style={{ zIndex: 10 }}
            >
              <div style={{ textAlign: 'center', maxWidth: '32rem', padding: '0 1.5rem' }}>
                <p
                  style={{
                    fontFamily: 'Satoshi, system-ui, sans-serif',
                    fontSize: '0.52rem',
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.2)',
                    marginBottom: '1.5rem',
                  }}
                >
                  Selected Work&nbsp;·&nbsp;{PROJECTS.length} Projects
                </p>
                <h2
                  style={{
                    fontFamily: 'Satoshi, system-ui, sans-serif',
                    fontWeight: 900,
                    fontSize: 'clamp(3.5rem, 9vw, 7.5rem)',
                    letterSpacing: '-0.05em',
                    lineHeight: 0.88,
                    color: 'rgba(255,255,255,0.92)',
                    marginBottom: '0.15em',
                  }}
                >
                  Selected{' '}
                  <span
                    style={{
                      fontFamily: 'var(--font-instrument), Georgia, serif',
                      fontStyle: 'italic',
                      fontWeight: 400,
                      color: 'rgba(255,255,255,0.18)',
                    }}
                  >
                    Work
                  </span>
                </h2>
                <p
                  style={{
                    fontFamily: 'Satoshi, system-ui, sans-serif',
                    fontSize: '0.65rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.15)',
                    marginTop: '2rem',
                  }}
                >
                  Scroll to explore
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Project cards — desktop left slot ─────────────────────────────── */}
        {/* No `mode="wait"`: it holds the incoming card until the outgoing one
            finishes its 0.38s exit, so a fast scroll queues transitions faster
            than they can drain and the slot stalls on a stale (or blank) card
            until the section is fully re-entered. Default sync mode lets them
            overlap; the grid stack below keeps overlapping cards from
            displacing each other instead of relying on the queue. */}
        <div
          className="absolute hidden md:grid z-10"
          style={{
            left: 'clamp(4rem, 7vw, 7rem)',
            top: 0,
            bottom: 0,
            alignContent: 'center',
            width: 'min(21rem, 28%)',
          }}
        >
          <div style={{ display: 'grid' }}>
            <AnimatePresence>
              {!isRight && activeScene > 0 && project && (
                <motion.div
                  key={`left-${activeScene}`}
                  style={{ gridArea: '1 / 1' }}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -14 }}
                  transition={{ duration: 0.38 }}
                >
                  <ProjectCard project={project} align="left" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Project cards — desktop right slot ────────────────────────────── */}
        <div
          className="absolute hidden md:grid z-10"
          style={{
            right: 'clamp(4rem, 7vw, 7rem)',
            top: 0,
            bottom: 0,
            alignContent: 'center',
            width: 'min(21rem, 28%)',
          }}
        >
          <div style={{ display: 'grid' }}>
            <AnimatePresence>
              {isRight && activeScene > 0 && project && (
                <motion.div
                  key={`right-${activeScene}`}
                  style={{ gridArea: '1 / 1' }}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 14 }}
                  transition={{ duration: 0.38 }}
                >
                  <ProjectCard project={project} align="right" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Scene counter — bottom right ──────────────────────────────────── */}
        <div
          className="absolute bottom-7 right-8 z-20"
          style={{ pointerEvents: 'none', textAlign: 'right' }}
        >
          <span
            style={{
              fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
              fontSize: '0.52rem',
              letterSpacing: '0.18em',
              color: 'rgba(255,255,255,0.18)',
            }}
          >
            {String(activeScene).padStart(2, '0')}&nbsp;/&nbsp;{String(PROJECTS.length).padStart(2, '0')}
          </span>
        </div>

        {/* ── Face caption — bottom center ──────────────────────────────────── */}
        <div
          className="absolute bottom-7 left-1/2 z-20"
          style={{ transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none' }}
        >
          <div
            ref={captionNumRef}
            style={{
              fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
              fontSize: '0.45rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.2)',
              marginBottom: '0.2rem',
            }}
          >
            00
          </div>
          <div
            ref={captionLabelRef}
            style={{
              fontFamily: 'Satoshi, system-ui, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(1.2rem, 3vw, 2.2rem)',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.06)',
            }}
          >
            OVERVIEW
          </div>
        </div>

      </div>

      {/* ── Reduced-motion fallback — readable at every desktop width ────────── */}
      <div className="projects-reduced-fallback px-5 md:px-12 pt-[clamp(4rem,8vw,7rem)] pb-[clamp(4rem,8vw,7rem)]">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-7">
            <span style={{ fontFamily: 'Satoshi, system-ui, sans-serif', fontSize: '0.52rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>02 / Work</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontFamily: 'Satoshi, system-ui, sans-serif', fontSize: '0.52rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>{PROJECTS.length} Projects</span>
          </div>
          <h2 style={{ fontFamily: 'Satoshi, system-ui, sans-serif', fontWeight: 900, fontSize: 'clamp(2.8rem, 8vw, 6rem)', letterSpacing: '-0.05em', lineHeight: 0.88, color: 'rgba(255,255,255,0.94)', marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
            Selected <span style={{ fontFamily: 'var(--font-instrument), Georgia, serif', fontStyle: 'italic', fontWeight: 400, color: 'rgba(255,255,255,0.3)' }}>Work</span>
          </h2>
          <div className="grid gap-5 lg:grid-cols-3">
            {PROJECTS.map((project, index) => <MobileProjectCard key={project.id} project={project} index={index} />)}
          </div>
        </div>
      </div>

      {/* ── Mobile (< md) — plain scrolling list, no scroll-jack, no cube ───── */}
      <div className="md:hidden px-5 pt-[clamp(4rem,14vw,6rem)] pb-[clamp(4rem,12vw,5rem)]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-7">
          <span
            style={{
              fontFamily: 'Satoshi, system-ui, sans-serif',
              fontSize: '0.52rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.28)',
            }}
          >
            02 / Work
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <span
            style={{
              fontFamily: 'Satoshi, system-ui, sans-serif',
              fontSize: '0.52rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.22)',
            }}
          >
            {PROJECTS.length} Projects
          </span>
        </div>

        <h2
          style={{
            fontFamily: 'Satoshi, system-ui, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(2.8rem, 13vw, 4.5rem)',
            letterSpacing: '-0.05em',
            lineHeight: 0.88,
            color: 'rgba(255,255,255,0.94)',
            marginBottom: 'clamp(2rem, 8vw, 3rem)',
          }}
        >
          Selected{' '}
          <span
            style={{
              fontFamily: 'var(--font-instrument), Georgia, serif',
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.3)',
            }}
          >
            Work
          </span>
        </h2>

        <div className="flex flex-col gap-5">
          {PROJECTS.map((p, i) => (
            <MobileProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
