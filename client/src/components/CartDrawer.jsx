import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ONE_OFF_MIN_ORDER } from '../data/subscriptions';

export default function CartDrawer() {
  const { items, isOpen, close, total, updateQty, remove } = useCart();
  const meetsMinimum = total >= ONE_OFF_MIN_ORDER;
  const remaining = Math.max(0, ONE_OFF_MIN_ORDER - total);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-brand-cream z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <header className="px-6 py-6 border-b border-black/5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] opacity-50">Your order</p>
                <h2 className="font-display text-2xl mt-0.5">
                  {items.length === 0 ? 'Empty for now' : `${items.length} ${items.length === 1 ? 'item' : 'items'}`}
                </h2>
              </div>
              <button
                onClick={close}
                aria-label="Close cart"
                className="w-10 h-10 rounded-full border border-current/15 hover:border-current/40 transition-colors flex items-center justify-center"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="4" x2="20" y2="20" />
                  <line x1="20" y1="4" x2="4" y2="20" />
                </svg>
              </button>
            </header>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center px-6 text-center">
                  <div className="text-6xl mb-6 opacity-30">🧃</div>
                  <p className="font-display text-xl mb-2">Nothing here yet.</p>
                  <p className="text-sm opacity-60 mb-2">Pick a juice — or build one from scratch.</p>
                  <p className="text-xs opacity-50 mb-8">£{ONE_OFF_MIN_ORDER} minimum order for delivery</p>
                  <Link to="/menu" onClick={close} className="btn-primary">
                    Browse the menu
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-black/5">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-6 py-5 flex items-center gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.name}</p>
                          {item.meta && (
                            <p className="text-xs opacity-50 mt-0.5 truncate">{item.meta}</p>
                          )}
                          <p className="text-sm opacity-60 mt-1 tabular-nums">£{item.price.toFixed(2)}</p>
                        </div>

                        {/* Qty stepper */}
                        <div className="flex items-center gap-2 border border-current/15 rounded-full px-1 py-1">
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            aria-label="Decrease"
                            className="w-7 h-7 rounded-full hover:bg-current/10 transition-colors flex items-center justify-center text-sm"
                          >−</button>
                          <span className="text-sm tabular-nums w-5 text-center">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            aria-label="Increase"
                            className="w-7 h-7 rounded-full hover:bg-current/10 transition-colors flex items-center justify-center text-sm"
                          >+</button>
                        </div>

                        <button
                          onClick={() => remove(item.id)}
                          aria-label="Remove"
                          className="text-xs opacity-40 hover:opacity-100 hover:text-brand-melon transition-all"
                        >
                          ✕
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <footer className="px-6 py-6 border-t border-black/5 bg-white/50">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-sm opacity-60">Subtotal</span>
                  <span className="font-display text-2xl tabular-nums">£{total.toFixed(2)}</span>
                </div>

                {/* Minimum order indicator */}
                {!meetsMinimum ? (
                  <div className="mb-4 px-4 py-3 rounded-2xl bg-brand-melon/10 border border-brand-melon/20">
                    <p className="text-sm font-medium text-brand-melon">
                      Add £{remaining.toFixed(2)} more for delivery
                    </p>
                    <p className="text-xs opacity-70 mt-0.5">
                      £{ONE_OFF_MIN_ORDER} minimum order
                    </p>
                  </div>
                ) : (
                  <div className="mb-4 flex items-center gap-2 text-sm text-brand-green-deep">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="font-medium">Minimum reached — ready to checkout</span>
                  </div>
                )}

                {meetsMinimum ? (
                  <Link to="/checkout" onClick={close} className="btn-primary w-full">
                    Checkout
                    <span>→</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="btn-primary w-full opacity-50 cursor-not-allowed"
                  >
                    £{ONE_OFF_MIN_ORDER} minimum needed
                  </button>
                )}

                <p className="text-center text-xs opacity-50 mt-3">
                  Delivered fresh, daily. Bracknell area.
                </p>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}