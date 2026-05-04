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

function MobileScrollStory() {
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

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3 && !hasStarted) {
            setHasStarted(true);
          }
        });
      },
      { threshold: [0, 0.3, 0.6] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted || revealedCount >= words.length) return;
    const timeout = setTimeout(() => {
      setRevealedCount((c) => c + 1);
    }, 450);
    return () => clearTimeout(timeout);
  }, [hasStarted, revealedCount]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-brand-cream overflow-hidden"
      style={{ minHeight: '100vh' }}
      aria-label="Fresh ingredients, cold-pressed"
    >
      <div className="relative h-screen w-full flex items-center justify-center">
        <div className="absolute top-10 left-0 right-0 z-30 flex justify-between items-center px-5 text-[9px] uppercase tracking-[0.3em] opacity-50">
          <span>The Process</span>
        </div>

        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="w-[80%] h-[80%] rounded-full opacity-15"
            style={{
              background: 'radial-gradient(circle, #7DC242 0%, #F39324 40%, #E94E4E 70%, transparent 100%)',
              filter: 'blur(50px)',
            }}
          />
        </div>

        <div className="relative z-20 px-6 w-full">
          <h2 className="font-display text-center text-[10vw] leading-[1.05] tracking-tight">
            {words.map((word, i) => (
              <span key={i}>
                <span className="inline-block overflow-hidden align-bottom mr-2">
                  <motion.span
                    initial={{ y: 50, opacity: 0 }}
                    animate={
                      revealedCount > i
                        ? { y: 0, opacity: 1 }
                        : { y: 50, opacity: 0 }
                    }
                    transition={{
                      duration: 0.6,
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

  useEffect(() => {
    if (!hasStarted || revealedCount >= words.length) return;

    const timeout = setTimeout(() => {
      setRevealedCount((c) => c + 1);
    }, 500);

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

        <div className="absolute bottom-14 left-0 right-0 z-20 whitespace-nowrap pointer-events-none select-none overflow-hidden">
          <div
            className="flex gap-16 text-sm uppercase tracking-[0.3em] opacity-40"
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
  return isMobile ? <MobileScrollStory /> : <DesktopScrollStory />;
}
