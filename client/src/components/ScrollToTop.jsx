import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls to the top of the page whenever the route changes.
 * Mount this once inside <BrowserRouter>, above <Routes>.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use 'instant' instead of 'smooth' for route changes —
    // smooth animations on page transitions feel janky.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
