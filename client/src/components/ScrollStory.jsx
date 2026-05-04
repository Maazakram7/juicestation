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

// Single line that fades in, holds, fades out as scroll progresses through its range
function ScrollLine({ children, progress, range, accent = false }) {
  const [start, end] = range;
  const fadeIn = start;
  const fullyIn = start + (end - start) * 0.25;
  const fullyOut = start + (end - start) * 0.75;
  const fadeOut = end;

  const opacity = useTransform(
    progress,
    [fadeIn, fullyIn, fullyOut, fadeOut],
    [0, 1, 1, 0]
  );

  const y = useTransform(
    progress,
    [fadeIn, fullyIn, fullyOut, fadeOut],
    [40, 0, 0, -40]
  );

  return (
    <motion.div
      style={{
        opacity,
        y,
        willChange: 'transform, opacity',
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 2.5rem',
      }}
    >
      <h2 className="font-display text-center text-[7vw] lg:text-[6vw] leading-[0.95] tracking-tight max-w-[18ch]">
        {accent ? <em className="not-italic text-brand-green-deep">{children}</em> : children}
      </h2>
    </motion.div>
  );
}

function MobileSequencer() {
  const sectionRef = useRef(null);
  const [phase, setPhase] = useState(-1);
  const [inView, setInView] = useState(false);

  const LINE_DURATION = 1800;

  const lines = [
    { text: 'Fresh fruit.', accent: false },
    { text: 'Raw vegetables.', accent: true },
    { text: 'Nothing added.', accent: false },
    { text: 'Nothing hidden.', accent: true },
  ];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setInView(true);
          } else if (!entry.isIntersecting) {
            setInView(false);
          }
        });
      },
      { threshold: [0, 0.5, 1] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let currentPhase = 0;
    setPhase(0);
    const interval = setInterval(() => {
      currentPhase = (currentPhase + 1) % lines.length;
      setPhase(currentPhase);
    }, LINE_DURATION);
    return () => clearInterval(interval);
  }, [inView]);

  const currentLine = phase >= 0 ? lines[phase] : null;

  return (
    <section
      ref={sectionRef}
      className="relative bg-brand-cream h-[60vh] overflow-hidden"
      aria-label="Fresh ingredients, cold-pressed"
    >
      <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center px-5 pt-10 text-[9px] uppercase tracking-[0.3em] opacity-50">
        <span>The Process</span>
      </div>

      <div className="absolute inset-0 z-20">
        <AnimatePresence mode="wait">
          {currentLine && (
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute inset-0 flex items-center justify-center px-6"
            >
              <h2 className="font-display text-center text-[18vw] leading-[0.95] tracking-[-0.03em] max-w-[10ch]">
                {currentLine.accent ? <em className="not-italic">{currentLine.text}</em> : currentLine.text}
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function DesktopScrollStory() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Buttery smooth spring — Apple-like weighted feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 24,
    mass: 0.6,
    restDelta: 0.001,
  });

  const marqueeX = useTransform(smoothProgress, [0, 1], ['0%', '-40%']);
  const progressWidth = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      ref={sectionRef}
      className="relative bg-brand-cream"
      style={{
        height: '320vh',
        contain: 'layout style paint',
      }}
      aria-label="Fresh ingredients, cold-pressed"
    >
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ transform: 'translateZ(0)' }}
      >
        <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center px-10 pt-28 text-xs uppercase tracking-[0.3em] opacity-50">
          <span>The Process</span>
          <span className="font-mono">Fresh &middot; Raw &middot; Cold-pressed</span>
        </div>

        {/* Static gradient — no rotation, no perf cost */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
          style={{ transform: 'translateZ(0)' }}
        >
          <div
            className="w-[70%] h-[70%] rounded-full opacity-15"
            style={{
              background: 'radial-gradient(circle, #7DC242 0%, #F39324 40%, #E94E4E 70%, transparent 100%)',
              filter: 'blur(60px)',
              willChange: 'auto',
            }}
          />
        </div>

        {/* Lines container — each line crossfades through its scroll range */}
        <div className="relative z-20 h-full">
          <ScrollLine progress={smoothProgress} range={[0.05, 0.30]}>
            Fresh fruit.
          </ScrollLine>
          <ScrollLine progress={smoothProgress} range={[0.28, 0.53]} accent>
            Raw vegetables.
          </ScrollLine>
          <ScrollLine progress={smoothProgress} range={[0.51, 0.76]}>
            Nothing added.
          </ScrollLine>
          <ScrollLine progress={smoothProgress} range={[0.74, 0.99]} accent>
            Nothing hidden.
          </ScrollLine>
        </div>

        <motion.div
          style={{ x: marqueeX, willChange: 'transform' }}
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
          <motion.div style={{ width: progressWidth, willChange: 'width' }} className="h-full bg-brand-green" />
        </div>
      </div>
    </section>
  );
}

export default function ScrollStory() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileSequencer /> : <DesktopScrollStory />;
}
