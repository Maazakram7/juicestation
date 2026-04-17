import { motion } from 'framer-motion';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

/**
 * JuiceCard — text-led layout.
 * The product photography isn't ready for the web yet, so the card leans
 * entirely on typography + an accent gradient strip. Far cleaner than
 * a generic SVG bottle silhouette.
 */
export default function JuiceCard({ juice, index = 0 }) {
  const { add } = useCart();
  const [size, setSize] = useState('M');
  const sizes = juice.sizes || { M: juice.price };
  const price = sizes[size];

  const badges = [
    juice.isNew && { label: 'New', color: 'bg-brand-melon text-white' },
    juice.signature && { label: 'Signature', color: 'bg-brand-citrus/90 text-white' },
    juice.kidsFavourite && { label: "Kids' favourite", color: 'bg-brand-green text-white' },
  ].filter(Boolean);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.035, ease: [0.2, 0.8, 0.2, 1] }}
      className="group relative rounded-[28px] overflow-hidden bg-white dark:bg-brand-ink border border-black/[0.06] dark:border-white/[0.06] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/40"
    >
      {/* Accent strip — the only visual flair. Colored gradient band at the top. */}
      <div
        className={`h-2 w-full bg-gradient-to-r ${juice.gradient}`}
        aria-hidden="true"
      />

      <div className="p-7 md:p-8">
        {/* Badges row */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {badges.map((b) => (
              <span
                key={b.label}
                className={`text-[10px] uppercase tracking-wider font-medium px-2.5 py-1 rounded-full ${b.color}`}
              >
                {b.label}
              </span>
            ))}
          </div>
        )}

        {/* Name + tagline */}
        <h3 className="font-display text-2xl md:text-3xl tracking-tight leading-[0.95] mb-2 relative inline-block">
          {juice.name}
          <span
            className="absolute left-0 right-0 -bottom-1 h-[2px] rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-out"
            style={{ backgroundColor: juice.accent }}
            aria-hidden="true"
          />
        </h3>
        <p className="text-sm opacity-60 mb-6">{juice.tagline}</p>

        {/* Ingredient list — editorial feel, bullet-separated */}
        <p className="text-[13px] leading-relaxed opacity-75 mb-6 border-l-2 pl-4 py-1" style={{ borderColor: juice.accent }}>
          {juice.ingredients.join(' · ')}
        </p>

        {/* Size selector */}
        {Object.keys(sizes).length > 1 && (
          <div className="flex items-center gap-1 mb-5 p-1 rounded-full border border-current/10 w-fit">
            {Object.entries(sizes).map(([s, p]) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`text-xs tracking-wider px-3 py-1.5 rounded-full transition-all tabular-nums ${
                  size === s
                    ? 'bg-brand-charcoal dark:bg-brand-cream text-brand-cream dark:text-brand-charcoal'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                {s} · £{p}
              </button>
            ))}
          </div>
        )}

        {/* Price + CTA row */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-current/10">
          <span className="font-display text-2xl tabular-nums">
            £{price.toFixed(2)}
          </span>
          <button
            onClick={() =>
              add({
                id: `${juice.id}-${size}`,
                name: `${juice.name} (${size})`,
                price,
              })
            }
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-charcoal dark:bg-brand-cream text-brand-cream dark:text-brand-charcoal text-sm font-medium tracking-wide transition-all hover:scale-[1.03] active:scale-[0.98] group/btn"
          >
            Add
            <span className="transition-transform group-hover/btn:translate-x-0.5">→</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}
