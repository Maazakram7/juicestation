import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

// Desktop word reveal — scroll-linked per word with spring smoothing
function WordReveal({ children, progress, range, accent = false }) {
  const [start, end] = range;
  const y = useTransform(progress, [start, end], [80, 0]);
  const opacity = useTransform(
    progress,
    [start, start + (end - start) * 0.4, end],
    [0, 0.5, 1]
  );
  const ySpring = useSpring(y, { stiffness: 120, damping: 20 });

  return (
    <span className="inline-block overflow-hidden align-bottom mr-3 md:mr-5">
      <motion.span
        style={{ y: ySpring, opacity }}
        className={`inline-block ${accent ? 'text-brand-green-deep' : ''}`}
      >
        {children}
      </motion.span>
    </span>
  );
}

// Mobile: section pins, timer-based line sequencer plays on fixed schedule
function MobileSequencer() {
  const sectionRef = useRef(null);
  const [phase, setPhase] = useState(-1); // -1 = not started, 0-3 = showing line N
  const [inView, setInView] = useState(false);

  // Each line displays for this long, including fade transitions
  const LINE_DURATION = 1800; // ms per line

  const lines = [
    { text: 'Fresh fruit.', color: 'rgba(125, 194, 66, 0.22)', accent: false },
    { text: 'Raw vegetables.', color: 'rgba(243, 147, 36, 0.20)', accent: true },
    { text: 'Nothing added.', color: 'rgba(233, 78, 78, 0.18)', accent: false },
    { text: 'Nothing hidden.', color: 'rgba(125, 194, 66, 0.22)', accent: true },
  ];

  // Observe when section enters viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Trigger when the pinned content is centered in view
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setInView(true);
          }
        });
      },
      { threshold: [0, 0.5, 1] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Once in view, sequence through the lines on a fixed schedule
  useEffect(() => {
    if (!inView) return;

    setPhase(0);
    const timers = [];

    lines.forEach((_, i) => {
      if (i === 0) return; // phase 0 is already set
      timers.push(
        setTimeout(() => setPhase(i), i * LINE_DURATION)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [inView]);

  const currentLine = phase >= 0 ? lines[phase] : null;

  return (
    <section
      ref={sectionRef}
      className="relative bg-brand-cream h-[100vh] overflow-hidden"
      aria-label="Fresh ingredients, cold-pressed"
    >
      {/* Top label strip */}
      <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center px-5 pt-10 text-[9px] uppercase tracking-[0.3em] opacity-50">
        <span>The Process</span>
      </div>

      {/* Ambient glow — color changes smoothly with each phrase */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <motion.div
          className="w-[130%] h-[70%] rounded-full"
          animate={{
            backgroundColor: currentLine ? currentLine.color : 'rgba(125, 194, 66, 0.15)',
            scale: [1, 1.03, 1],
          }}
          transition={{
            backgroundColor: { duration: 1.2, ease: 'easeInOut' },
            scale: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      </div>

      {/* Line stack — each fades in/out on its own timer, independent of scroll */}
      <div className="absolute inset-0 z-20">
        <AnimatePresence mode="wait">
          {currentLine && (
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{
                duration: 0.8,
                ease: [0.2, 0.8, 0.2, 1],
              }}
              className={`absolute inset-0 flex items-center justify-center px-6 ${
                currentLine.accent ? 'text-brand-green-deep' : ''
              }`}
            >
              <h2 className="font-display text-center text-[14vw] leading-[1.05] tracking-tight max-w-[12ch]">
                {currentLine.text}
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dot progress indicators */}
      <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center gap-2">
        {lines.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: phase === i ? 1 : 0.2,
              scale: phase === i ? 1.3 : 0.8,
            }}
            transition={{ duration: 0.4 }}
            className="w-1.5 h-1.5 rounded-full bg-brand-charcoal"
          />
        ))}
      </div>
    </section>
  );
}

// Desktop version — scroll-linked (unchanged)
function DesktopScrollStory() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 28,
    mass: 0.5,
  });

  const marqueeX = useTransform(smoothProgress, [0, 1], ['0%', '-40%']);
  const progressWidth = useTransform(smoothProgress, [0, 1], ['0%', '100%']);
  const bgRotate = useTransform(smoothProgress, [0, 1], [0, 200]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-brand-cream"
      style={{ height: '320vh' }}
      aria-label="Fresh ingredients, cold-pressed"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center px-10 pt-28 text-xs uppercase tracking-[0.3em] opacity-50">
          <span>The Process</span>
          <span className="font-mono">Fresh &middot; Raw &middot; Cold-pressed</span>
        </div>

        <motion.div
          style={{ rotate: bgRotate }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="w-[70%] h-[70%] rounded-full opacity-20 blur-3xl"
            style={{ background: 'conic-gradient(from 0deg, #7DC242, #F39324, #E94E4E, #7DC242)' }}
          />
        </motion.div>

        <div className="relative z-20 h-full flex items-center justify-center px-10">
          <h2 className="font-display text-center text-[7vw] lg:text-[6vw] leading-[0.95] tracking-tight max-w-[18ch]">
            <WordReveal progress={smoothProgress} range={[0.0, 0.12]}>Fresh</WordReveal>
            <WordReveal progress={smoothProgress} range={[0.05, 0.17]}>fruit.</WordReveal>
            <br />
            <WordReveal progress={smoothProgress} range={[0.22, 0.34]}>Raw</WordReveal>
            <WordReveal progress={smoothProgress} range={[0.27, 0.39]} accent>vegetables.</WordReveal>
            <br />
            <WordReveal progress={smoothProgress} range={[0.5, 0.62]}>Nothing</WordReveal>
            <WordReveal progress={smoothProgress} range={[0.55, 0.67]}>added.</WordReveal>
            <br />
            <WordReveal progress={smoothProgress} range={[0.78, 0.9]}>Nothing</WordReveal>
            <WordReveal progress={smoothProgress} range={[0.83, 0.95]} accent>hidden.</WordReveal>
          </h2>
        </div>

        <motion.div
          style={{ x: marqueeX }}
          className="absolute bottom-14 left-0 right-0 z-20 whitespace-nowrap pointer-events-none select-none"
        >
          <div className="flex gap-16 text-sm uppercase tracking-[0.3em] opacity-40">
            {['carrot','beetroot','apple','ginger','lemon','kale','spinach','orange','cucumber','mint','watermelon','celery','grapefruit','lime','mango','pineapple','strawberry','banana','turmeric','carrot','beetroot','apple','ginger','lemon','kale','spinach','orange','cucumber','mint'].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-3">
                {item}
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
              </span>
            ))}
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/5 z-30">
          <motion.div style={{ width: progressWidth }} className="h-full bg-brand-green" />
        </div>
      </div>
    </section>
  );
}

export default function ScrollStory() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileSequencer /> : <DesktopScrollStory />;
}
