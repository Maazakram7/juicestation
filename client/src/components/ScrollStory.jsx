import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

// Detect mobile once on mount
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

// Desktop: scroll-linked word reveal
function WordRevealDesktop({ children, progress, range, accent = false }) {
  const [start, end] = range;
  const y = useTransform(progress, [start, end], [80, 0]);
  const opacity = useTransform(progress, [start, start + (end - start) * 0.4, end], [0, 0.5, 1]);
  const yS = useSpring(y, { stiffness: 120, damping: 20 });

  return (
    <span className="inline-block overflow-hidden align-bottom mr-3 md:mr-5">
      <motion.span
        style={{ y: yS, opacity }}
        className={`inline-block ${accent ? 'text-brand-green-deep dark:text-brand-green' : ''}`}
      >
        {children}
      </motion.span>
    </span>
  );
}

// Mobile: simple stagger fade-in (no scroll-linking)
function WordRevealMobile({ children, delay, accent = false }) {
  return (
    <span className="inline-block overflow-hidden align-bottom mr-2">
      <motion.span
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
        className={`inline-block ${accent ? 'text-brand-green-deep dark:text-brand-green' : ''}`}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function ScrollStory() {
  const isMobile = useIsMobile();
  const sectionRef = useRef(null);

  // Only compute scroll progress on desktop (avoids expensive mobile work)
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

  // Mobile: tighter section, simpler layout
  if (isMobile) {
    return (
      <section className="relative bg-brand-cream dark:bg-brand-charcoal py-24 px-6 overflow-hidden">
        {/* Top label */}
        <div className="flex justify-between items-center mb-12 text-[10px] uppercase tracking-[0.3em] opacity-50">
          <span>The Process</span>
          <span className="font-mono">Fresh · Raw · Cold-pressed</span>
        </div>

        {/* Static subtle gradient (no rotation, much cheaper) */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="w-[120%] h-[60%] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #7DC242, transparent 70%)', filter: 'blur(40px)' }}
          />
        </div>

        {/* Headline — staggered fade-in instead of scroll-linked */}
        <div className="relative z-10">
          <h2 className="font-display text-center text-[11vw] leading-[1] tracking-tight">
            <WordRevealMobile delay={0}>Fresh</WordRevealMobile>
            <WordRevealMobile delay={0.1}>fruit.</WordRevealMobile>
            <br />
            <WordRevealMobile delay={0.25}>Raw</WordRevealMobile>
            <WordRevealMobile delay={0.35} accent>vegetables.</WordRevealMobile>
            <br />
            <WordRevealMobile delay={0.5}>Nothing</WordRevealMobile>
            <WordRevealMobile delay={0.6}>added.</WordRevealMobile>
            <br />
            <WordRevealMobile delay={0.75}>Nothing</WordRevealMobile>
            <WordRevealMobile delay={0.85} accent>hidden.</WordRevealMobile>
          </h2>
        </div>

        {/* Static ingredient line (no marquee animation) */}
        <div className="mt-16 overflow-hidden whitespace-nowrap text-[10px] uppercase tracking-[0.3em] opacity-30 text-center">
          carrot · beetroot · apple · ginger · lemon · kale · spinach · orange · mint
        </div>
      </section>
    );
  }

  // Desktop: original scroll-linked version (unchanged)
  return (
    <section
      ref={sectionRef}
      className="relative bg-brand-cream dark:bg-brand-charcoal"
      style={{ height: '320vh' }}
      aria-label="Fresh ingredients, cold-pressed"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center px-6 md:px-10 pt-24 md:pt-28 text-xs uppercase tracking-[0.3em] opacity-50">
          <span>The Process</span>
          <span className="font-mono">Fresh · Raw · Cold-pressed</span>
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

        <div className="relative z-20 h-full flex items-center justify-center px-6 md:px-10">
          <h2 className="font-display text-center text-[10vw] md:text-[7vw] lg:text-[6vw] leading-[0.95] tracking-tight max-w-[18ch]">
            <WordRevealDesktop progress={smoothProgress} range={[0.0, 0.12]}>Fresh</WordRevealDesktop>
            <WordRevealDesktop progress={smoothProgress} range={[0.05, 0.17]}>fruit.</WordRevealDesktop>
            <br />
            <WordRevealDesktop progress={smoothProgress} range={[0.22, 0.34]}>Raw</WordRevealDesktop>
            <WordRevealDesktop progress={smoothProgress} range={[0.27, 0.39]} accent>vegetables.</WordRevealDesktop>
            <br />
            <WordRevealDesktop progress={smoothProgress} range={[0.5, 0.62]}>Nothing</WordRevealDesktop>
            <WordRevealDesktop progress={smoothProgress} range={[0.55, 0.67]}>added.</WordRevealDesktop>
            <br />
            <WordRevealDesktop progress={smoothProgress} range={[0.78, 0.9]}>Nothing</WordRevealDesktop>
            <WordRevealDesktop progress={smoothProgress} range={[0.83, 0.95]} accent>hidden.</WordRevealDesktop>
          </h2>
        </div>

        <motion.div
          style={{ x: marqueeX }}
          className="absolute bottom-10 md:bottom-14 left-0 right-0 z-20 whitespace-nowrap pointer-events-none select-none"
        >
          <div className="flex gap-10 md:gap-16 text-xs md:text-sm uppercase tracking-[0.3em] opacity-40">
            {[
              'carrot', 'beetroot', 'apple', 'ginger', 'lemon',
              'kale', 'spinach', 'orange', 'cucumber', 'mint',
              'watermelon', 'celery', 'grapefruit', 'lime',
              'mango', 'pineapple', 'strawberry', 'banana', 'turmeric',
              'carrot', 'beetroot', 'apple', 'ginger', 'lemon',
              'kale', 'spinach', 'orange', 'cucumber', 'mint',
            ].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-3">
                {item}
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
              </span>
            ))}
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/5 dark:bg-white/5 z-30">
          <motion.div style={{ width: progressWidth }} className="h-full bg-brand-green" />
        </div>
      </div>
    </section>
  );
}
