import PasswordGate from './components/PasswordGate';
import ScrollToTop from './components/ScrollToTop';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Builder from './pages/Builder';
import Subscribe from './pages/Subscribe';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import AdminOrders from './pages/AdminOrders';

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <PasswordGate>
      <>
        <ScrollToTop />
        <Navbar />
        <CartDrawer />
        <main className="min-h-screen">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/menu" element={<PageTransition><Menu /></PageTransition>} />
              <Route path="/builder" element={<PageTransition><Builder /></PageTransition>} />
              <Route path="/subscribe" element={<PageTransition><Subscribe /></PageTransition>} />
              <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
              <Route path="/order-success" element={<PageTransition><OrderSuccess /></PageTransition>} />
              <Route path="/admin/orders" element={<PageTransition><AdminOrders /></PageTransition>} />
          </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </>
    </PasswordGate>
  );
}
