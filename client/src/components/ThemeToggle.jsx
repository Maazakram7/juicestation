import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="relative w-10 h-10 rounded-full border border-current/15 hover:border-current/40 transition-colors flex items-center justify-center overflow-hidden"
    >
      <motion.span
        key={theme}
        initial={{ y: isDark ? 20 : -20, opacity: 0, rotate: -90 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        exit={{ y: isDark ? -20 : 20, opacity: 0, rotate: 90 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="absolute text-[15px]"
      >
        {isDark ? '☾' : '☀︎'}
      </motion.span>
    </button>
  );
}
