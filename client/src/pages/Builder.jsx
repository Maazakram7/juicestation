import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import { INGREDIENTS, BASE_CUSTOM_PRICE, MAX_CUSTOM_INGREDIENTS } from '../data/menu';
import { useCart } from '../context/CartContext';

export default function Builder() {
  const [selected, setSelected] = useState([]);
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const toggle = (id) => {
    setSelected((s) => {
      if (s.includes(id)) return s.filter((x) => x !== id);
      if (s.length >= MAX_CUSTOM_INGREDIENTS) return s; // cap per menu board
      return [...s, id];
    });
    setAdded(false);
  };

  const total = useMemo(() => {
    const sum = selected.reduce((acc, id) => {
      const ing = INGREDIENTS.find((i) => i.id === id);
      return acc + (ing?.price || 0);
    }, 0);
    return sum + (selected.length > 0 ? BASE_CUSTOM_PRICE : 0);
  }, [selected]);

  const handleAdd = () => {
    if (selected.length === 0) return;
    const names = selected
      .map((id) => INGREDIENTS.find((i) => i.id === id)?.name)
      .filter(Boolean);
    add({
      id: `custom-${Date.now()}`,
      name: 'Custom juice',
      price: total,
      meta: names.join(' · '),
    });
    setSelected([]);
    setAdded(true);
  };

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16 max-w-3xl"
        >
          <p className="text-xs uppercase tracking-[0.3em] opacity-50 mb-4">Build Your Own</p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.95]">
            Your juice,
            <br />
            <em className="not-italic text-brand-green-deep dark:text-brand-green">your rules.</em>
          </h1>
          <p className="mt-8 text-lg opacity-60 max-w-xl leading-relaxed">
            Craft your perfect blend — select up to {MAX_CUSTOM_INGREDIENTS} ingredients from our full menu, then choose your size.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Ingredients grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {INGREDIENTS.map((ing, i) => {
                const isSelected = selected.includes(ing.id);
                return (
                  <motion.button
                    key={ing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.4 }}
                    onClick={() => toggle(ing.id)}
                    whileTap={{ scale: 0.96 }}
                    className={`relative aspect-square rounded-3xl p-5 text-left transition-all duration-300 overflow-hidden ${
                      isSelected
                        ? 'ring-2 ring-offset-2 ring-offset-brand-cream dark:ring-offset-brand-charcoal ring-brand-green scale-[0.97]'
                        : 'border border-black/[0.08] dark:border-white/[0.08] hover:-translate-y-1'
                    }`}
                    style={{
                      backgroundColor: isSelected ? `${ing.color}22` : undefined,
                    }}
                  >
                    <div
                      className="absolute top-3 right-3 w-5 h-5 rounded-full transition-all"
                      style={{
                        backgroundColor: isSelected ? ing.color : 'transparent',
                        border: isSelected ? 'none' : '1.5px solid currentColor',
                        opacity: isSelected ? 1 : 0.3,
                      }}
                    >
                      {isSelected && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </motion.svg>
                      )}
                    </div>

                    <div className="text-4xl md:text-5xl mb-auto">{ing.emoji}</div>
                    <div className="absolute bottom-5 left-5 right-5">
                      <p className="font-display text-lg leading-none">{ing.name}</p>
                      <p className="text-xs opacity-50 mt-1 tabular-nums">£{ing.price.toFixed(2)}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Order summary — sticky */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 rounded-[28px] bg-white dark:bg-brand-ink border border-black/[0.06] dark:border-white/[0.06] p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.2em] opacity-50 mb-3">Your juice</p>
              <div className="flex items-baseline justify-between mb-6">
                <h3 className="font-display text-3xl">
                  {selected.length === 0 ? 'Empty bottle' : `${selected.length} ${selected.length === 1 ? 'ingredient' : 'ingredients'}`}
                </h3>
              </div>

              {/* Selected list */}
              <div className="min-h-[120px] mb-6">
                <AnimatePresence mode="popLayout">
                  {selected.length === 0 ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm opacity-50 italic"
                    >
                      Start picking ingredients on the left.
                    </motion.p>
                  ) : (
                    <ul className="space-y-2">
                      {selected.map((id) => {
                        const ing = INGREDIENTS.find((i) => i.id === id);
                        return (
                          <motion.li
                            key={id}
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="flex items-center gap-2">
                              <span className="text-lg">{ing.emoji}</span>
                              {ing.name}
                            </span>
                            <span className="tabular-nums opacity-60">£{ing.price.toFixed(2)}</span>
                          </motion.li>
                        );
                      })}
                      <li className="flex items-center justify-between text-sm pt-2 border-t border-black/5 dark:border-white/5">
                        <span className="opacity-60">Bottle & press</span>
                        <span className="tabular-nums opacity-60">£{BASE_CUSTOM_PRICE.toFixed(2)}</span>
                      </li>
                    </ul>
                  )}
                </AnimatePresence>
              </div>

              {/* Total */}
              <div className="flex items-baseline justify-between pt-4 border-t border-black/10 dark:border-white/10 mb-6">
                <span className="text-sm opacity-60">Total</span>
                <motion.span
                  key={total}
                  initial={{ scale: 1.15, color: '#7DC242' }}
                  animate={{ scale: 1, color: 'currentColor' }}
                  transition={{ duration: 0.3 }}
                  className="font-display text-3xl tabular-nums"
                >
                  £{total.toFixed(2)}
                </motion.span>
              </div>

              <button
                onClick={handleAdd}
                disabled={selected.length === 0}
                className="btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {added ? 'Added ✓' : 'Add to cart'}
                {!added && <span>→</span>}
              </button>

              <AnimatePresence>
                {added && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-center opacity-60 mt-3"
                  >
                    In your cart. Build another?
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
