import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import { INGREDIENTS, BASE_CUSTOM_PRICE, MAX_CUSTOM_INGREDIENTS } from '../data/menu';
import { useCart } from '../context/CartContext';

function IngredientTile({ ing, index, isSelected, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
    >
      <motion.button
        onClick={onToggle}
        whileTap={{ scale: 0.94 }}
        animate={{ scale: isSelected ? 0.97 : 1 }}
        transition={{ duration: 0.2 }}
        className={`relative w-full rounded-2xl md:rounded-3xl p-3 md:p-5 text-left transition-colors duration-300 overflow-hidden aspect-[4/5] sm:aspect-square ${
          isSelected
            ? 'ring-2 ring-offset-2 ring-offset-brand-cream dark:ring-offset-brand-charcoal ring-brand-green'
            : 'border border-black/[0.08] dark:border-white/[0.08]'
        }`}
        style={{
          backgroundColor: isSelected ? `${ing.color}22` : undefined,
        }}
      >
        <div
          className="absolute top-2.5 right-2.5 md:top-3 md:right-3 w-5 h-5 rounded-full transition-all flex items-center justify-center"
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
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </motion.svg>
          )}
        </div>

        <div className="text-3xl md:text-5xl">{ing.emoji}</div>
        <div className="absolute bottom-3 left-3 right-3 md:bottom-5 md:left-5 md:right-5">
          <p className="font-display text-sm md:text-lg leading-none">{ing.name}</p>
          <p className="text-[10px] md:text-xs opacity-50 mt-1 tabular-nums">£{ing.price.toFixed(2)}</p>
        </div>
      </motion.button>
    </motion.div>
  );
}

export default function Builder() {
  const [selected, setSelected] = useState([]);
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const toggle = (id) => {
    const ing = INGREDIENTS.find((i) => i.id === id);
    if (!ing) return;

    // Decide action FIRST, synchronously, outside of setState
    let action;
    let newSelected;
    if (selected.includes(id)) {
      action = 'removed';
      newSelected = selected.filter((x) => x !== id);
    } else if (selected.length >= MAX_CUSTOM_INGREDIENTS) {
      action = 'max';
      newSelected = selected;
    } else {
      action = 'added';
      newSelected = [...selected, id];
    }

    setSelected(newSelected);

    // Queue the toast
    const toastId = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newToast = { id: toastId, emoji: ing.emoji, name: ing.name, action };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 2000);

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
    setMobileDrawerOpen(false);
  };

  return (
    <div className="pt-28 md:pt-40 pb-32 lg:pb-24">
      <style>{`
        @keyframes toastPop {
          0%   { transform: translateY(-20px) scale(0.85); opacity: 0; }
          50%  { transform: translateY(2px) scale(1.03); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes toastFade {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(-8px) scale(0.92); }
        }
        .js-toast {
          animation: toastPop 0.32s cubic-bezier(0.2, 0.8, 0.2, 1.2) forwards,
                     toastFade 0.25s ease-out 1.7s forwards;
          will-change: transform, opacity;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-8 md:mb-16 max-w-3xl"
        >
          <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-50 mb-3 md:mb-4">Build Your Own</p>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95]">
            Your juice,
            <br />
            <em className="not-italic text-brand-green-deep dark:text-brand-green">your rules.</em>
          </h1>
          <p className="mt-4 md:mt-8 text-sm md:text-lg opacity-60 max-w-xl leading-relaxed">
            Craft your perfect blend &mdash; select up to {MAX_CUSTOM_INGREDIENTS} ingredients from our full menu, then choose your size.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 md:gap-4">
              {INGREDIENTS.map((ing, i) => (
                <IngredientTile
                  key={ing.id}
                  ing={ing}
                  index={i}
                  isSelected={selected.includes(ing.id)}
                  onToggle={() => toggle(ing.id)}
                />
              ))}
            </div>
          </div>

          <aside className="hidden lg:block lg:col-span-4">
            <div className="lg:sticky lg:top-28 rounded-[28px] bg-white dark:bg-brand-ink border border-black/[0.06] dark:border-white/[0.06] p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.2em] opacity-50 mb-3">Your juice</p>
              <div className="flex items-baseline justify-between mb-6">
                <h3 className="font-display text-3xl">
                  {selected.length === 0 ? 'Empty bottle' : `${selected.length} ${selected.length === 1 ? 'ingredient' : 'ingredients'}`}
                </h3>
              </div>

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
                            <button
                              onClick={() => toggle(id)}
                              className="tabular-nums opacity-60 hover:opacity-100 hover:text-brand-melon transition-colors"
                            >
                              £{ing.price.toFixed(2)} ×
                            </button>
                          </motion.li>
                        );
                      })}
                      <li className="flex items-center justify-between text-sm pt-2 border-t border-black/5 dark:border-white/5">
                        <span className="opacity-60">Bottle &amp; press</span>
                        <span className="tabular-nums opacity-60">£{BASE_CUSTOM_PRICE.toFixed(2)}</span>
                      </li>
                    </ul>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-baseline justify-between pt-4 border-t border-black/10 dark:border-white/10 mb-6">
                <span className="text-sm opacity-60">Total</span>
                <span className="font-display text-3xl tabular-nums">
                  £{total.toFixed(2)}
                </span>
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

      {/* Toast stack — pure CSS, no framer-motion, no state coordination */}
      <div className="fixed top-24 md:top-28 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="js-toast">
            <div
              className={`flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl backdrop-blur-xl ${
                t.action === 'added'
                  ? 'bg-brand-green text-white'
                  : t.action === 'removed'
                  ? 'bg-brand-charcoal/90 dark:bg-brand-cream/90 text-brand-cream dark:text-brand-charcoal'
                  : 'bg-brand-melon text-white'
              }`}
            >
              <span className="text-2xl">{t.emoji}</span>
              <div className="text-sm">
                <p className="font-medium leading-tight">
                  {t.action === 'added' && `${t.name} added`}
                  {t.action === 'removed' && `${t.name} removed`}
                  {t.action === 'max' && `Max ${MAX_CUSTOM_INGREDIENTS} ingredients`}
                </p>
                {t.action === 'added' && (
                  <p className="text-[11px] opacity-80 leading-tight">Tap again to remove</p>
                )}
              </div>
              {t.action === 'added' && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile sticky bottom bar */}
      <AnimatePresence>
        {(selected.length > 0 || added) && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-40 pointer-events-none"
          >
            <AnimatePresence>
              {mobileDrawerOpen && selected.length > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="pointer-events-auto mx-3 mb-1 rounded-2xl bg-white dark:bg-brand-ink border border-black/[0.08] dark:border-white/[0.08] shadow-2xl p-4 max-h-[50vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] opacity-50">Your juice</p>
                    <button
                      onClick={() => setMobileDrawerOpen(false)}
                      className="text-xs opacity-60"
                    >
                      Close
                    </button>
                  </div>
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
                          className="flex items-center justify-between text-sm py-1"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-lg">{ing.emoji}</span>
                            {ing.name}
                          </span>
                          <button
                            onClick={() => toggle(id)}
                            className="flex items-center gap-2 text-xs"
                          >
                            <span className="tabular-nums opacity-60">£{ing.price.toFixed(2)}</span>
                            <span className="w-6 h-6 rounded-full border border-current/20 flex items-center justify-center opacity-60">×</span>
                          </button>
                        </motion.li>
                      );
                    })}
                    <li className="flex items-center justify-between text-xs pt-2 border-t border-black/5 dark:border-white/5">
                      <span className="opacity-60">Bottle &amp; press</span>
                      <span className="tabular-nums opacity-60">£{BASE_CUSTOM_PRICE.toFixed(2)}</span>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pointer-events-auto mx-3 mb-3 rounded-full bg-brand-charcoal dark:bg-brand-cream text-brand-cream dark:text-brand-charcoal shadow-2xl flex items-center p-1.5 pl-5 gap-3">
              <button
                onClick={() => setMobileDrawerOpen((o) => !o)}
                disabled={selected.length === 0}
                className="flex-1 flex items-center justify-between text-left"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] opacity-50">
                    {added ? 'Added' : `${selected.length} ${selected.length === 1 ? 'item' : 'items'}`}
                  </p>
                  <p className="font-display text-lg tabular-nums">
                    {added ? '✓ in your cart' : `£${total.toFixed(2)}`}
                  </p>
                </div>
                {selected.length > 0 && !added && (
                  <motion.span
                    animate={{ rotate: mobileDrawerOpen ? 180 : 0 }}
                    className="text-xs opacity-60 mr-3"
                  >
                    ▼
                  </motion.span>
                )}
              </button>

              <button
                onClick={handleAdd}
                disabled={selected.length === 0}
                className="px-5 py-3 rounded-full bg-brand-green text-white font-medium text-sm transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {added ? 'Done' : 'Add →'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
