import { motion, AnimatePresence } from 'framer-motion';
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
  const [revealedCount, setRevealedCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const words = [
    { text: 'Fresh', accent: false },
    { text: 'fruit.', accent: false, lineEnd: true },
    { text: 'Raw', accent: false },
    { text: 'vegetables.', accent: true, lineEnd: true },
    { text: 'Nothing', accent: false },
    { text: 'added.', accent: false, lineEnd: true },
    { text: 'Nothing', accent: false },
    { text: 'hidden.', accent: true, lineEnd: true },
  ];

  // Trigger reveal sequence when section enters view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4 && !hasStarted) {
            setHasStarted(true);
          }
        });
      },
      { threshold: [0, 0.4, 0.8] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  // Once started, reveal one word at a time on a steady timer
  useEffect(() => {
    if (!hasStarted || revealedCount >= words.length) return;

    const timeout = setTimeout(() => {
      setRevealedCount((c) => c + 1);
    }, 500); // 500ms between each word

    return () => clearTimeout(timeout);
  }, [hasStarted, revealedCount]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-brand-cream"
      style={{
        minHeight: '100vh',
        contain: 'layout style paint',
      }}
      aria-label="Fresh ingredients, cold-pressed"
    >
      <div
        className="relative h-screen w-full overflow-hidden flex items-center justify-center"
        style={{ transform: 'translateZ(0)' }}
      >
        <div className="absolute top-10 left-0 right-0 z-30 flex justify-between items-center px-10 text-xs uppercase tracking-[0.3em] opacity-50">
          <span>The Process</span>
          <span className="font-mono">Fresh &middot; Raw &middot; Cold-pressed</span>
        </div>

        {/* Static gradient backdrop */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="w-[70%] h-[70%] rounded-full opacity-15"
            style={{
              background: 'radial-gradient(circle, #7DC242 0%, #F39324 40%, #E94E4E 70%, transparent 100%)',
              filter: 'blur(60px)',
            }}
          />
        </div>

        <div className="relative z-20 px-10">
          <h2 className="font-display text-center text-[7vw] lg:text-[6vw] leading-[0.95] tracking-tight max-w-[18ch]">
            {words.map((word, i) => (
              <span key={i}>
                <span className="inline-block overflow-hidden align-bottom mr-3 md:mr-5">
                  <motion.span
                    initial={{ y: 60, opacity: 0 }}
                    animate={
                      revealedCount > i
                        ? { y: 0, opacity: 1 }
                        : { y: 60, opacity: 0 }
                    }
                    transition={{
                      duration: 0.7,
                      ease: [0.2, 0.8, 0.2, 1],
                    }}
                    className={`inline-block ${word.accent ? 'text-brand-green-deep' : ''}`}
                    style={{ willChange: 'transform, opacity' }}
                  >
                    {word.text}
                  </motion.span>
                </span>
                {word.lineEnd && i < words.length - 1 && <br />}
              </span>
            ))}
          </h2>
        </div>

        {/* Static marquee at bottom */}
        <div className="absolute bottom-14 left-0 right-0 z-20 whitespace-nowrap pointer-events-none select-none overflow-hidden">
          <div
            className="flex gap-16 text-sm uppercase tracking-[0.3em] opacity-40 animate-marquee"
            style={{
              willChange: 'transform',
              animation: 'marquee 60s linear infinite',
            }}
          >
            {[...Array(2)].map((_, copy) => (
              <div key={copy} className="flex gap-16 shrink-0">
                {['carrot','beetroot','apple','ginger','lemon','kale','spinach','orange','cucumber','mint','watermelon','celery','grapefruit','lime','mango','pineapple','strawberry','banana','turmeric'].map((item, i) => (
                  <span key={`${copy}-${i}`} className="inline-flex items-center gap-3 shrink-0">
                    {item}
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

export default function ScrollStory() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileSequencer /> : <DesktopScrollStory />;
}
