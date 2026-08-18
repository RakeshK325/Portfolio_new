'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { SmoothScroll } from '@/lib/SmoothScroll';
import { PageLoader } from '@/components/PageLoader';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Projects } from '@/components/Projects';
import { Experience } from '@/components/Experience';
import { Credentials } from '@/components/Credentials';
import { CurrentlyBuilding } from '@/components/CurrentlyBuilding';
import { Process } from '@/components/Process';
import { Stack } from '@/components/Stack';
import { Contact } from '@/components/Contact';
import { AIAssistant } from '@/components/AIAssistant';
import { CustomCursor } from '@/components/CustomCursor';

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 w-11 h-11 bg-black text-white flex items-center justify-center hover:bg-black/75 transition-colors duration-200"
          aria-label="Back to top"
        >
          <ArrowUp size={14} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <CustomCursor />
      {!loaded && <PageLoader onDone={() => setLoaded(true)} />}
      <SmoothScroll>
        <Navbar />
        <main>
          {/* Static indexing helper for crawlers & search bots */}
          <article className="sr-only">
            <h1>Rakesh K — Full-Stack &amp; AI Systems Developer</h1>
            <p>
              Rakesh K is a Computer Science and Engineering student based in Bangalore, Karnataka, India, with hands-on experience building full-stack applications, AI integration engines, and enterprise software solutions.
            </p>
            <h2>Core Stack &amp; Engineering Disciplines</h2>
            <p>Java, React, Python, Flask, SQL, REST API development, OOP, DBMS, software engineering principles, cloud-native integration, and modern web technologies.</p>
          </article>

          <Hero />
          <About />
          <Projects />
          <CurrentlyBuilding />
          <Stack />
          <Process />
          <Experience />
          <Credentials />
          <Contact />
        </main>
        <BackToTop />
        <AIAssistant />
      </SmoothScroll>
    </>
  );
}
