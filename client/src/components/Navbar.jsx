import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/builder', label: 'Build your own' },
  { to: '/subscribe', label: 'Subscribe' },
];

export default function Navbar() {
  const { count, toggle } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      // Close mobile menu as soon as user starts scrolling
      setMobileOpen((open) => (open ? false : open));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-brand-cream/95 border-b border-black/5'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-10 h-24 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <img
            src="/logo.png"
            alt="JUICEeSTATION"
            className="h-14 md:h-16 w-auto transition-transform duration-500 group-hover:scale-[1.03])]"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `group relative px-4 py-2 text-sm font-medium tracking-wide rounded-full transition-all duration-300 ease-out hover:-translate-y-0.5 ${
                  isActive
                    ? 'text-brand-green-deep'
                    : 'opacity-70 hover:opacity-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  <span
                    className={`absolute left-4 right-4 -bottom-0.5 h-[1.5px] bg-current rounded-full origin-center transition-transform duration-300 ease-out ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                    aria-hidden="true"
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile-only Menu shortcut */}
          <Link
            to="/menu"
            className="md:hidden px-4 py-2 rounded-full bg-brand-green text-white text-sm font-medium tracking-wide hover:bg-brand-green-deep transition-colors"
          >
            Menu
          </Link>
        
          <button
            id="cart-icon-target"
            onClick={toggle}
            aria-label="Open cart"
            className="relative w-10 h-10 rounded-full border border-current/15 hover:border-current/40 transition-colors flex items-center justify-center"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-brand-melon text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
            className="md:hidden w-10 h-10 rounded-full border border-current/15 flex items-center justify-center"
          >
            <div className="flex flex-col gap-[4px]">
              <span className={`block w-4 h-[1.5px] bg-current transition-transform ${mobileOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
              <span className={`block w-4 h-[1.5px] bg-current transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-4 h-[1.5px] bg-current transition-transform ${mobileOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-brand-cream border-b border-black/5"
          >
            <div className="px-6 py-6 flex flex-col gap-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `py-3 text-lg font-display tracking-tight ${
                      isActive ? 'text-brand-green-deep' : 'opacity-80'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
