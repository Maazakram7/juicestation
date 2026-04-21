import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import JuiceCard from '../components/JuiceCard';
import { CATEGORIES } from '../data/menu';

export default function Menu() {
  // "all" shows every category stacked, or pick one
  const [active, setActive] = useState('all');

  const visibleCategories = active === 'all' ? CATEGORIES : CATEGORIES.filter((c) => c.id === active);

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
          <p className="text-xs uppercase tracking-[0.3em] opacity-50 mb-4">The full menu</p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
            No water.
            <br />
            No sugar.
            <br />
            <em>No preservatives.</em>
          </h1>
          <p className="mt-8 text-lg opacity-60 max-w-xl leading-relaxed">
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
          <CategoryPill label="Everything" active={active === 'all'} onClick={() => setActive('all')} />
          {CATEGORIES.map((c) => (
            <CategoryPill
              key={c.id}
              label={c.label}
              active={active === c.id}
              onClick={() => setActive(c.id)}
            />
          ))}
        </motion.div>

        {/* Categories */}
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
                  <p className="text-xs md:text-sm opacity-50 tracking-wide">{cat.subtitle}</p>
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

        {/* Allergen note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 pt-8 border-t border-current/10 text-xs uppercase tracking-[0.25em] opacity-50 text-center"
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
      className={`px-5 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all ${
        active
          ? 'bg-brand-charcoal dark:bg-brand-cream text-brand-cream dark:text-brand-charcoal'
          : 'border border-current/15 hover:border-current/40 opacity-70 hover:opacity-100'
      }`}
    >
      {label}
    </button>
  );
}
