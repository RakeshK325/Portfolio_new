'use client';

import { useEffect, useRef, useState } from 'react';
import { RKMark } from './RKMark';
import gsap from 'gsap';

export function PageLoader({ onDone }: { onDone: () => void }) {
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const countRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    if (reducedMotion) {
      const reducedTimer = window.setTimeout(onDone, 80);
      return () => {
        window.clearTimeout(reducedTimer);
        document.body.style.overflow = previousOverflow;
      };
    }

    gsap.fromTo(
      logoRef.current,
      { opacity: 0, y: 18, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out', delay: 0.12 },
    );

    const logoFloat = gsap.to(logoRef.current, {
      y: -6,
      duration: 2.2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
      delay: 0.95,
    });

    const dotPulse = gsap.to(dotRef.current, {
      opacity: 0.15,
      repeat: -1,
      yoyo: true,
      duration: 0.6,
      ease: 'power1.inOut',
    });

    let current = 0;
    let ready = document.readyState === 'complete';
    let exiting = false;
    let progressTimer = 0;
    let fallbackTimer = 0;

    const updateProgress = (value: number) => {
      current = Math.min(100, Math.round(value));
      setCount(current);
      if (lineRef.current) lineRef.current.style.transform = `scaleX(${current / 100})`;
    };

    const startExit = () => {
      if (exiting) return;
      exiting = true;
      window.clearInterval(progressTimer);
      window.clearTimeout(fallbackTimer);
      logoFloat.kill();
      dotPulse.kill();

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = previousOverflow;
          onDone();
        },
      });
      tl.to([logoRef.current, countRef.current, labelRef.current], {
        opacity: 0,
        y: -16,
        duration: 0.35,
        ease: 'power2.in',
        stagger: 0.04,
      });
      panelRefs.current.forEach((panel, i) => {
        tl.to(panel, { y: '-100%', duration: 0.72, ease: 'power4.inOut' }, 0.16 + i * 0.065);
      });
    };

    const onReady = () => {
      ready = true;
      if (current >= 92) startExit();
    };

    const advance = () => {
      if (exiting) return;
      const next = Math.min(current + (current < 72 ? 8 : 3), 92);
      updateProgress(next);
      if (ready && next >= 92) startExit();
    };

    window.addEventListener('load', onReady, { once: true });
    progressTimer = window.setInterval(advance, 75);
    fallbackTimer = window.setTimeout(() => {
      ready = true;
      updateProgress(100);
      startExit();
    }, 2400);

    return () => {
      window.clearInterval(progressTimer);
      window.clearTimeout(fallbackTimer);
      window.removeEventListener('load', onReady);
      logoFloat.kill();
      dotPulse.kill();
      document.body.style.overflow = previousOverflow;
    };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden" aria-label="Loading portfolio" role="status">
      <div className="absolute inset-0 flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            ref={(el) => { panelRefs.current[i] = el; }}
            className="flex-1"
            style={{ backgroundColor: '#0A0A0A' }}
          />
        ))}
      </div>

      <div
        ref={logoRef}
        className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none gap-5"
        style={{ opacity: 0 }}
      >
        <RKMark size="lg" />
        <div ref={labelRef} className="flex items-center gap-2">
          <span
            ref={dotRef}
            className="block w-2 h-2 rounded-full"
            style={{ backgroundColor: 'rgba(138,180,255,0.8)', boxShadow: '0 0 18px rgba(138,180,255,0.35)' }}
          />
          <span
            style={{
              fontFamily: 'var(--font-instrument), Georgia, serif',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)',
              color: 'rgba(255,255,255,0.28)',
              letterSpacing: '0.05em',
            }}
          >
            Loading Rakesh K portfolio
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none" style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }}>
        <div ref={lineRef} className="h-full origin-left" style={{ backgroundColor: 'rgba(138,180,255,0.65)', transform: 'scaleX(0)' }} />
      </div>

      <div
        ref={countRef}
        className="absolute bottom-6 right-6 z-10 pointer-events-none select-none tabular-nums"
        style={{
          fontFamily: 'Satoshi, system-ui, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(4rem, 10vw, 8rem)',
          letterSpacing: '-0.05em',
          lineHeight: 1,
          color: 'rgba(255,255,255,0.82)',
        }}
      >
        {count}%
      </div>

      <div
        className="absolute bottom-7 left-6 z-10 pointer-events-none"
        style={{
          fontFamily: 'Satoshi, system-ui, sans-serif',
          fontSize: '0.5rem',
          letterSpacing: '0.26em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.14)',
          fontWeight: 500,
        }}
      >
        Portfolio · 2026
      </div>
    </div>
  );
}
