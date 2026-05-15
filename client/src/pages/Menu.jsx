import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import JuiceCard from '../components/JuiceCard';
import { CATEGORIES } from '../data/menu';

export default function Menu() {
  const [active, setActive] = useState('all');
  const resultsRef = useRef(null);

  const visibleCategories = active === 'all' ? CATEGORIES : CATEGORIES.filter((c) => c.id === active);

  const handleCategoryChange = (id) => {
    if (id === active) return; // skip if same category

    setActive(id);

    // Wait for React to re-render with new content, then scroll
    // Using rAF + setTimeout ensures the scroll happens after layout
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (resultsRef.current) {
          const y = resultsRef.current.getBoundingClientRect().top + window.scrollY - 100;
          // -100 offset accounts for fixed navbar height so results aren't hidden behind it
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 50);
    });
  };

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12 md:mb-16 max-w-3xl"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-faint mb-4">The full menu</p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
            No water.
            <br />
            No sugar.
            <br />
            <em>No preservatives.</em>
          </h1>
          <p className="mt-8 text-lg text-muted max-w-xl leading-relaxed">
            Forty-plus recipes across five categories. Build your own from scratch or pick a signature.
          </p>
        </motion.div>

        {/* Category pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-wrap gap-2 mb-12 md:mb-16"
        >
          <CategoryPill
            label="Everything"
            active={active === 'all'}
            onClick={() => handleCategoryChange('all')}
          />
          {CATEGORIES.map((c) => (
            <CategoryPill
              key={c.id}
              label={c.label}
              active={active === c.id}
              onClick={() => handleCategoryChange(c.id)}
            />
          ))}
        </motion.div>

        {/* Categories — scroll target */}
        <div ref={resultsRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="space-y-20 md:space-y-28"
            >
              {visibleCategories.map((cat) => (
                <section key={cat.id} id={cat.id}>
                  <div className="flex items-end justify-between flex-wrap gap-4 mb-8 md:mb-10 pb-6 border-b border-current/10">
                    <h2 className="font-display text-2xl md:text-4xl tracking-tight">{cat.label}</h2>
                    <p className="text-xs md:text-sm text-subtle tracking-wide">{cat.subtitle}</p>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
                    {cat.items.map((juice, i) => (
                      <JuiceCard key={juice.id} juice={juice} index={i} />
                    ))}
                  </div>
                </section>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Allergen note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 pt-8 border-t border-current/10 text-xs uppercase tracking-[0.3em] text-faint text-center"
        >
          Allergy warning · Our juices contain different kinds of nuts · Review ingredients before ordering
        </motion.div>
      </div>
    </div>
  );
}

function CategoryPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-[44px] px-5 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all ${
        active
          ? 'bg-brand-charcoal text-brand-cream'
          : 'border border-muted text-muted hover:text-brand-charcoal hover:border-black/40'
      }`}
    >
      {label}
    </button>
  );
}
