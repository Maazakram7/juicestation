import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function JuiceCard({ juice, index = 0 }) {
  const { add, updateQty, items } = useCart();
  const [size, setSize] = useState('M');
  const [fly, setFly] = useState(null);
  const sizes = juice.sizes || { M: juice.price };
  const price = sizes[size];
  const hasMultipleSizes = Object.keys(sizes).length > 1;

  const cartItemId = `${juice.id}-${size}`;
  const cartItem = items.find((i) => i.id === cartItemId);
  const qtyInCart = cartItem ? cartItem.qty : 0;

  const badges = [
    juice.isNew && { label: 'New', color: 'bg-brand-melon text-white' },
    juice.signature && { label: 'Signature', color: 'bg-brand-citrus/90 text-white' },
    juice.kidsFavourite && { label: "Kids' favourite", color: 'bg-brand-green text-white' },
  ].filter(Boolean);

  const handleAdd = (e) => {
    const button = e.currentTarget.getBoundingClientRect();
    const cartIcon = document.getElementById('cart-icon-target');

    if (cartIcon) {
      const cartRect = cartIcon.getBoundingClientRect();
      setFly({
        id: Date.now(),
        startX: button.left + button.width / 2,
        startY: button.top + button.height / 2,
        endX: cartRect.left + cartRect.width / 2,
        endY: cartRect.top + cartRect.height / 2,
        accent: juice.accent,
      });
      setTimeout(() => setFly(null), 750);
    }

    add({
      id: cartItemId,
      name: `${juice.name} (${size})`,
      price,
    });
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    updateQty(cartItemId, qtyInCart - 1);
  };

  // Animate only the first 6 cards. After that, render instantly without animation.
  // This eliminates flicker on fast scroll through long lists of cards.
  const shouldAnimate = index < 6;

  return (
    <>
      <motion.article
        {...(shouldAnimate
          ? {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.4, delay: index * 0.04, ease: [0.2, 0.8, 0.2, 1] },
            }
          : {})}
        style={{ willChange: shouldAnimate ? 'transform, opacity' : 'auto' }}
        className="group relative rounded-[18px] md:rounded-[28px] overflow-hidden bg-white border border-black/[0.06] transition-all duration-300 ease-out md:hover:-translate-y-1 md:hover:shadow-xl md:hover:shadow-black/5 flex flex-col"
      >
        <div
          className={`h-1 md:h-2 w-full bg-gradient-to-r ${juice.gradient} flex-shrink-0`}
          aria-hidden="true"
        />
        <div className="p-4 sm:p-5 md:p-8 flex flex-col flex-1">
          {/* Badge row */}
          <div
            className={`flex flex-wrap gap-1 mb-2 md:mb-4 min-h-[20px] md:min-h-[24px] ${
              badges.length === 0 ? 'invisible' : ''
            }`}
            aria-hidden={badges.length === 0}
          >
            {badges.length > 0 ? (
              badges.map((b) => (
                <span
                  key={b.label}
                  className={`text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-wider font-medium px-1.5 sm:px-2 md:px-2.5 py-0.5 md:py-1 rounded-full ${b.color}`}
                >
                  {b.label}
                </span>
              ))
            ) : (
              <span className="text-[8px] sm:text-[9px] md:text-[10px] px-1.5 sm:px-2 md:px-2.5 py-0.5 md:py-1">
                &nbsp;
              </span>
            )}
          </div>

          <h3 className="font-display text-base sm:text-xl md:text-3xl tracking-tight leading-[0.95] mb-1 md:mb-2 relative inline-block">
            {juice.name}
            <span
              className="absolute left-0 right-0 -bottom-1 h-[2px] rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-out"
              style={{ backgroundColor: juice.accent }}
              aria-hidden="true"
            />
          </h3>

          <p className="text-[11px] sm:text-[13px] md:text-sm text-muted mb-3 md:mb-6 min-h-[16px] md:min-h-[20px]">
            {juice.tagline || '\u00A0'}
          </p>

          <p
            className="text-[10px] sm:text-[12px] md:text-[13px] leading-relaxed text-muted mb-3 md:mb-6 border-l-2 pl-2 sm:pl-3 md:pl-4 py-0.5 md:py-1 min-h-[36px] sm:min-h-[42px] md:min-h-[48px]"
            style={{ borderColor: juice.accent }}
          >
            {juice.ingredients.join(' · ')}
          </p>

          <div
            className={`flex items-center gap-1 mb-3 md:mb-5 p-0.5 md:p-1 rounded-full border border-current/10 w-fit ${
              hasMultipleSizes ? '' : 'invisible'
            }`}
            aria-hidden={!hasMultipleSizes}
          >
            {hasMultipleSizes ? (
              Object.entries(sizes).map(([s, p]) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={`text-[10px] sm:text-[11px] md:text-xs tracking-wider px-3 sm:px-3 md:px-3 py-1.5 md:py-1.5 rounded-full transition-all tabular-nums ${
                    size === s
                      ? 'bg-brand-charcoal text-brand-cream'
                      : 'text-muted hover:text-brand-charcoal'
                  }`}
                >
                  {s} · £{p}
                </button>
              ))
            ) : (
              <span className="text-[10px] sm:text-[11px] md:text-xs px-2 sm:px-2.5 md:px-3 py-1 md:py-1.5">
                &nbsp;
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 md:gap-3 pt-2 md:pt-4 border-t border-current/10 mt-auto">
            <span className="font-display text-base sm:text-xl md:text-2xl tabular-nums">
              £{price.toFixed(2)}
            </span>

            <AnimatePresence mode="wait" initial={false}>
              {qtyInCart === 0 ? (
                <motion.button
                  key="add-btn"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleAdd}
                  whileTap={{ scale: 0.88 }}
                  whileHover={{ scale: 1.08 }}
                  aria-label={`Add ${juice.name} to cart`}
                  className="relative w-11 h-11 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-brand-charcoal text-brand-cream flex items-center justify-center transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </motion.button>
              ) : (
                <motion.div
                  key="qty-controls"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1 bg-brand-charcoal text-brand-cream rounded-full p-1"
                >
                  <motion.button
                    onClick={handleDecrement}
                    whileTap={{ scale: 0.85 }}
                    aria-label={`Remove one ${juice.name}`}
                    className="w-9 h-9 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </motion.button>

                  <motion.span
                    key={qtyInCart}
                    initial={{ scale: 1.3, y: -2 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                    className="font-display text-sm sm:text-base md:text-lg tabular-nums min-w-[14px] text-center"
                  >
                    {qtyInCart}
                  </motion.span>

                  <motion.button
                    onClick={handleAdd}
                    whileTap={{ scale: 0.85 }}
                    aria-label={`Add another ${juice.name}`}
                    className="w-9 h-9 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.article>

      <AnimatePresence>
        {fly && (
          <motion.div
            key={fly.id}
            initial={{
              left: fly.startX - 10,
              top: fly.startY - 10,
              opacity: 1,
              scale: 1,
            }}
            animate={{
              left: fly.endX - 10,
              top: fly.endY - 10,
              scale: 0.3,
              opacity: 0,
            }}
            transition={{ duration: 0.7, ease: [0.5, 0, 0.75, 0] }}
            style={{
              position: 'fixed',
              width: 20,
              height: 20,
              borderRadius: 999,
              backgroundColor: fly.accent,
              zIndex: 9999,
              pointerEvents: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}