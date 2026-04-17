import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

/**
 * ScrollStory — text-only pinned scroll narrative.
 *
 * No fruits, no bottles, no illustrations. Just:
 *  - pinned sticky section
 *  - word-by-word headline reveal synced to scroll progress
 *  - ambient rotating glow behind the text
 *  - ingredient marquee pinned at the bottom
 *  - scroll progress bar
 *
 * This keeps the Oryzo-style motion vocabulary but leans entirely on typography.
 */

// Word reveal tied to scroll progress
function WordReveal({ children, progress, range, accent = false }) {
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

export default function ScrollStory() {
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
      className="relative bg-brand-cream dark:bg-brand-charcoal"
      style={{ height: '320vh' }}
      aria-label="Fresh ingredients, cold-pressed"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Top label strip */}
        <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center px-6 md:px-10 pt-24 md:pt-28 text-xs uppercase tracking-[0.3em] opacity-50">
          <span>The Process</span>
          <span className="font-mono">Fresh · Raw · Cold-pressed</span>
        </div>

        {/* Ambient rotating glow — only visual decoration */}
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

        {/* Centered headline — slightly smaller type than before */}
        <div className="relative z-20 h-full flex items-center justify-center px-6 md:px-10">
          <h2 className="font-display text-center text-[10vw] md:text-[7vw] lg:text-[6vw] leading-[0.95] tracking-tight max-w-[18ch]">
            <WordReveal progress={smoothProgress} range={[0.00, 0.12]}>Fresh</WordReveal>
            <WordReveal progress={smoothProgress} range={[0.05, 0.17]}>fruit.</WordReveal>
            <br />
            <WordReveal progress={smoothProgress} range={[0.22, 0.34]}>Raw</WordReveal>
            <WordReveal progress={smoothProgress} range={[0.27, 0.39]} accent>vegetables.</WordReveal>
            <br />
            <WordReveal progress={smoothProgress} range={[0.50, 0.62]}>Nothing</WordReveal>
            <WordReveal progress={smoothProgress} range={[0.55, 0.67]}>added.</WordReveal>
            <br />
            <WordReveal progress={smoothProgress} range={[0.78, 0.90]}>Nothing</WordReveal>
            <WordReveal progress={smoothProgress} range={[0.83, 0.95]} accent>hidden.</WordReveal>
          </h2>
        </div>

        {/* Ingredient marquee — pinned at bottom, slides with scroll */}
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

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/5 dark:bg-white/5 z-30">
          <motion.div style={{ width: progressWidth }} className="h-full bg-brand-green" />
        </div>
      </div>
    </section>
  );
}
