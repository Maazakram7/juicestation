import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
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

// Shared word-reveal — scroll-linked on both desktop and mobile
function WordReveal({ children, progress, range, accent = false, mobile = false }) {
  const [start, end] = range;
  const y = useTransform(progress, [start, end], mobile ? [40, 0] : [80, 0]);
  const opacity = useTransform(
    progress,
    [start, start + (end - start) * 0.4, end],
    [0, 0.5, 1]
  );

  // Skip spring on mobile — direct transform is cheaper and smoother on mobile GPUs
  const ySmooth = mobile ? y : useSpring(y, { stiffness: 120, damping: 20 });

  return (
    <span className="inline-block overflow-hidden align-bottom mr-2 md:mr-5">
      <motion.span
        style={{ y: ySmooth, opacity }}
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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Desktop uses spring-smoothed progress, mobile uses raw for performance
  const desktopSmooth = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 28,
    mass: 0.5,
  });
  const progress = isMobile ? scrollYProgress : desktopSmooth;

  const marqueeX = useTransform(progress, [0, 1], ['0%', '-40%']);
  const progressWidth = useTransform(progress, [0, 1], ['0%', '100%']);
  const bgRotate = useTransform(progress, [0, 1], [0, 200]);

  // Shorter section on mobile — 200vh instead of 320vh means less scrolling
  // to get the full reveal, which feels way better on a phone
  const sectionHeight = isMobile ? '200vh' : '320vh';

  return (
    <section
      ref={sectionRef}
      className="relative bg-brand-cream dark:bg-brand-charcoal"
      style={{ height: sectionHeight }}
      aria-label="Fresh ingredients, cold-pressed"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Top label strip */}
        <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center px-5 md:px-10 pt-24 md:pt-28 text-[9px] md:text-xs uppercase tracking-[0.3em] opacity-50">
          <span>The Process</span>
          <span className="font-mono hidden sm:inline">Fresh · Raw · Cold-pressed</span>
        </div>

        {/* Ambient gradient — static radial on mobile, rotating conic on desktop */}
        {isMobile ? (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            <div
              className="w-[120%] h-[70%] opacity-15"
              style={{
                background: 'radial-gradient(circle, #7DC242 0%, transparent 60%)',
                filter: 'blur(40px)',
              }}
            />
          </div>
        ) : (
          <motion.div
            style={{ rotate: bgRotate }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            <div
              className="w-[70%] h-[70%] rounded-full opacity-20 blur-3xl"
              style={{
                background:
                  'conic-gradient(from 0deg, #7DC242, #F39324, #E94E4E, #7DC242)',
              }}
            />
          </motion.div>
        )}

        {/* Centered headline — scroll-linked word reveal on both mobile + desktop */}
        <div className="relative z-20 h-full flex items-center justify-center px-5 md:px-10">
          <h2 className="font-display text-center text-[12vw] md:text-[7vw] lg:text-[6vw] leading-[1] md:leading-[0.95] tracking-tight max-w-[18ch]">
            <WordReveal progress={progress} range={[0.0, 0.12]} mobile={isMobile}>Fresh</WordReveal>
            <WordReveal progress={progress} range={[0.05, 0.17]} mobile={isMobile}>fruit.</WordReveal>
            <br />
            <WordReveal progress={progress} range={[0.22, 0.34]} mobile={isMobile}>Raw</WordReveal>
            <WordReveal progress={progress} range={[0.27, 0.39]} accent mobile={isMobile}>vegetables.</WordReveal>
            <br />
            <WordReveal progress={progress} range={[0.5, 0.62]} mobile={isMobile}>Nothing</WordReveal>
            <WordReveal progress={progress} range={[0.55, 0.67]} mobile={isMobile}>added.</WordReveal>
            <br />
            <WordReveal progress={progress} range={[0.78, 0.9]} mobile={isMobile}>Nothing</WordReveal>
            <WordReveal progress={progress} range={[0.83, 0.95]} accent mobile={isMobile}>hidden.</WordReveal>
          </h2>
        </div>

        {/* Ingredient marquee */}
        <motion.div
          style={{ x: marqueeX }}
          className="absolute bottom-8 md:bottom-14 left-0 right-0 z-20 whitespace-nowrap pointer-events-none select-none"
        >
          <div className="flex gap-6 md:gap-16 text-[10px] md:text-sm uppercase tracking-[0.3em] opacity-40">
            {[
              'carrot', 'beetroot', 'apple', 'ginger', 'lemon',
              'kale', 'spinach', 'orange', 'cucumber', 'mint',
              'watermelon', 'celery', 'grapefruit', 'lime',
              'mango', 'pineapple', 'strawberry', 'banana', 'turmeric',
              'carrot', 'beetroot', 'apple', 'ginger', 'lemon',
              'kale', 'spinach', 'orange', 'cucumber', 'mint',
            ].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-2 md:gap-3">
                {item}
                <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-current" />
              </span>
            ))}
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/5 dark:bg-white/5 z-30">
          <motion.div style={{ width: progressWidth }} className="h-full bg-brand-green" />
        </div>
      </div>
    </section>
  );
}
