'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;

const ORION_CHIPS = [
  { label: 'Roles', detail: 'Admin · Faculty · HOD · Principal' },
  { label: 'Security', detail: 'JWT authentication · RBAC' },
  { label: 'Documents', detail: 'Multer uploads · Puppeteer PDF generation' },
];

const WYTNEST_CHIPS = [
  { label: 'Schedules', detail: 'UIP · IAP dual-schedule tracking' },
  { label: 'Database', detail: 'Atomic Firestore batch writes' },
  { label: 'AI', detail: 'Smart Availability assistant' },
];

const BLACKE_CHIPS = [
  { label: 'Analysis', detail: 'gRNA ranking engine' },
  { label: 'Metrics', detail: 'On-target efficiency · off-target risk' },
  { label: 'ML', detail: 'Machine-learning workflow' },
];


interface Chip { label: string; detail: string }

interface Build {
  logoSlot:  React.ReactNode;
  name:      string;
  tagline:   string;
  chips:     Chip[];
  link:      string;
}

function Row({
  build,
  inView,
  delay,
  divided,
}: {
  build:   Build;
  inView:  boolean;
  delay:   number;
  divided: boolean;
}) {
  return (
    <div
      style={
        divided
          ? { borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 'clamp(1.25rem,2.5vw,1.75rem)' }
          : {}
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] items-start lg:items-center gap-5 lg:gap-12">

        {/* ── Logo / badge slot ── */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay, ease: EASE }}
        >
          {build.logoSlot}
        </motion.div>

        {/* ── Description ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: delay + 0.08, ease: EASE }}
        >
          <p
            className="text-white/80"
            style={{
              fontFamily: 'Satoshi, system-ui, sans-serif',
              fontSize:   'clamp(0.88rem,1.4vw,1.15rem)',
              fontWeight: 600,
            }}
          >
            {build.name}{' '}
            <span
              style={{
                fontFamily: 'var(--font-instrument), Georgia, serif',
                fontStyle:  'italic',
                fontWeight: 400,
                color:      'rgba(255,255,255,0.38)',
              }}
            >
              — {build.tagline}
            </span>
          </p>

          <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5">
            {build.chips.map((chip) => (
              <span key={chip.label} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-white/30 shrink-0" />
                <span
                  className="text-[0.6rem] tracking-[0.05em] text-white/35"
                  style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}
                >
                  <span className="text-white/55">{chip.label}</span>
                  {' '}· {chip.detail}
                </span>
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── Link ── */}
        <motion.a
          href={build.link}
          target="_self"
          rel="noopener noreferrer"
          data-cursor="view"
          className="group inline-flex items-center gap-2 text-white/35 hover:text-white transition-colors duration-200 shrink-0"
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: delay + 0.16, ease: EASE }}
        >
          <span
            className="text-[0.58rem] tracking-[0.2em] uppercase font-medium"
            style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}
          >
            View Project
          </span>
          <ArrowUpRight
            size={12}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
          />
        </motion.a>
      </div>
    </div>
  );
}

export function CurrentlyBuilding() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  const BUILDS: Build[] = [
    {
      logoSlot: (
        <span className="inline-flex items-center gap-2 border border-white/15 px-3 py-1.5 text-[0.55rem] tracking-[0.2em] uppercase text-white/55">
          Project 01
        </span>
      ),
      name:    'Faculty Appraisal Portal',
      tagline: 'MERN platform automating faculty self-appraisal workflows across four roles.',
      chips:   ORION_CHIPS,
      link:    '#work',
    },
    {
      logoSlot: (
        <span className="inline-flex items-center gap-2 border border-white/15 px-3 py-1.5 text-[0.55rem] tracking-[0.2em] uppercase text-white/55">
          Project 02
        </span>
      ),
      name:     'Pediatric Vaccination Management System',
      tagline:  'Dual-schedule UIP/IAP tracking with an AI-driven Smart Availability assistant.',
      chips:    WYTNEST_CHIPS,
      link:     '#work',
    },
    {
      logoSlot: (
        <span className="inline-flex items-center gap-2 border border-white/15 px-3 py-1.5 text-[0.55rem] tracking-[0.2em] uppercase text-white/55">
          Project 03
        </span>
      ),
      name:    'Target-X: CRISPR Target Analysis',
      tagline: 'AI-powered gRNA ranking for on-target efficiency and off-target risk analysis.',
      chips:   BLACKE_CHIPS,
      link:    '#work',
    },
  ];

  return (
    <section
      ref={ref}
      data-theme="dark"
      className="w-full bg-[#0A0A0A] border-t border-white/6 relative overflow-hidden"
    >
      {/* moving scan line */}
      <motion.div
        aria-hidden
        className="absolute top-0 bottom-0 w-px pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, transparent, rgba(255,255,255,0.18), transparent)',
        }}
        animate={{ left: ['-5%', '105%'] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-[clamp(1.25rem,5vw,5rem)] py-[clamp(2rem,4vw,3.5rem)]">
        <div className="flex flex-col gap-[clamp(1.25rem,2.5vw,1.75rem)]">
          {BUILDS.map((build, i) => (
            <Row
              key={build.name}
              build={build}
              inView={inView}
              delay={i * 0.14}
              divided={i > 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
