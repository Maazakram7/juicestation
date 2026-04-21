import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ScrollStory from '../components/ScrollStory';
import Testimonials from '../components/Testimonials';
import JuiceCard from '../components/JuiceCard';
import { MENU } from '../data/menu';

const HEADLINE = ['Pure.', 'Fresh.', 'No compromise.'];

export default function Home() {
  const featured = MENU.slice(0, 3);

  return (
    <>
      <section className="relative min-h-[85vh] md:min-h-screen flex items-start md:items-center overflow-hidden pt-28 md:pt-20 pb-6 md:pb-0">
        <video
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/70 via-brand-cream/40 to-brand-cream" />

        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[20%] right-[8%] w-24 h-24 md:w-40 md:h-40 rounded-full bg-brand-melon/20 blur-2xl"
        />
        <motion.div
          animate={{ y: [0, 30, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[20%] left-[5%] w-32 h-32 md:w-52 md:h-52 rounded-full bg-brand-green/20 blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 w-full">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs md:text-sm uppercase tracking-[0.3em] opacity-60 mb-6"
          >
            Bracknell · Berkshire · Since day one
          </motion.p>

          <h1 className="font-display text-[14vw] md:text-[9vw] lg:text-[7.5vw] leading-[0.9] tracking-tighter max-w-[18ch]">
            {HEADLINE.map((word, i) => (
              <span key={i} className="block overflow-hidden align-bottom">
                <motion.span
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 1,
                    delay: 0.3 + i * 0.12,
                    ease: [0.2, 0.8, 0.2, 1],
                  }}
                  className="inline-block"
                >
                  {i === 2 ? <em>{word}</em> : word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-12 flex flex-col sm:flex-row gap-3 md:gap-4 items-stretch sm:items-start max-w-xs sm:max-w-none"
          >
            <Link to="/menu" className="btn-primary w-full sm:w-auto">
              Order now
              <span>→</span>
            </Link>
            <Link to="/subscribe" className="btn-ghost w-full sm:w-auto">
              Subscribe weekly
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="mt-10 md:mt-32 flex flex-wrap gap-4 md:gap-12 text-sm opacity-70"
          >
            {[
              ['No water', 'Ever.'],
              ['No sugar', 'None added.'],
              ['No additives', 'You read that right.'],
              ['Cold-pressed', 'Every morning.'],
            ].map(([label, sub]) => (
              <div key={label}>
                <p className="font-medium">{label}</p>
                <p className="text-xs opacity-60 mt-0.5">{sub}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <ScrollStory />

      <section className="section bg-brand-cream">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12 md:mb-20 flex-wrap gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="max-w-xl"
            >
              <p className="text-xs uppercase tracking-[0.3em] opacity-50 mb-4">The roster</p>
              <h2 className="font-display text-3xl md:text-5xl lg:text-6xl leading-[0.95]">
                Nine juices.
                <br />
                <em className="not-italic text-brand-citrus">Zero shortcuts.</em>
              </h2>
            </motion.div>
            <Link to="/menu" className="btn-ghost">
              See all nine
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
            {featured.map((juice, i) => (
              <JuiceCard key={juice.id} juice={juice} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      <section className="section bg-brand-green relative overflow-hidden">
        <div className="absolute inset-0 grain" />
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl text-white leading-[0.95]"
          >
            Ready to taste
            <br />
            <em className="not-italic">the difference?</em>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-10"
          >
            <Link to="/menu" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-brand-green-deep font-medium transition-all hover:scale-[1.02] hover:shadow-2xl">
              Start your order
              <span>→</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
