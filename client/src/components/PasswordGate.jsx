import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_PASSWORD = 'juicelaunch2026';
const STORAGE_KEY = 'js_gate_unlocked';

// Routes that bypass the password gate — mainly Stripe return URLs
// so customers coming back from payment don't hit another password prompt
const EXEMPT_ROUTES = ['/order-success'];

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === 'yes') {
      setUnlocked(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === SITE_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'yes');
      setUnlocked(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  // Exempt routes skip the gate entirely
  if (EXEMPT_ROUTES.includes(location.pathname)) return children;
  if (unlocked) return children;

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-6">
      <div className="max-w-md w-full text-center">
        <div className="text-5xl mb-6">🧃</div>
        <h1 className="font-display text-3xl mb-3">Coming soon</h1>
        <p className="opacity-60 mb-8 text-sm">
          Site under construction. Enter the preview password to continue.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`w-full px-5 py-3.5 rounded-2xl bg-white border ${
              error ? 'border-brand-melon' : 'border-black/10'
            } focus:outline-none focus:border-brand-green transition-all`}
            placeholder="Password"
            autoFocus
          />
          <button type="submit" className="btn-primary w-full">
            Enter
          </button>
        </form>
        {error && (
          <p className="text-sm text-brand-melon mt-4">Incorrect password.</p>
        )}
      </div>
    </div>
  );
}
