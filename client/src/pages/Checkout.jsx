import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function Checkout() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // NOTE (Stripe integration point):
      // Before hitting /order, you'd create a Stripe PaymentIntent here
      // and confirm payment with stripe.confirmCardPayment(). On success,
      // forward the paymentIntent.id as payment_intent_id below.
      const res = await fetch(`${API_URL}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            qty: i.qty,
            meta: i.meta || null,
          })),
          total,
        }),
      });

      if (!res.ok) throw new Error('Order failed — please try again.');
      const data = await res.json();

      clear();
      navigate(`/order-success?id=${encodeURIComponent(data.order_id)}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-40 pb-24 px-6 text-center max-w-xl mx-auto">
        <div className="text-6xl mb-6 opacity-30">🧃</div>
        <h1 className="font-display text-4xl mb-4">Cart's empty.</h1>
        <p className="opacity-60 mb-8">You'll want something in it before checking out.</p>
        <Link to="/menu" className="btn-primary">Browse the menu</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12 max-w-2xl"
        >
          <p className="text-xs uppercase tracking-[0.3em] opacity-50 mb-4">Checkout</p>
          <h1 className="font-display text-4xl md:text-6xl leading-[0.95]">
            Almost there.
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
            <Field label="Name" name="name" value={form.name} onChange={handleChange} required />
            <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
            <Field label="Delivery address" name="address" value={form.address} onChange={handleChange} required textarea />
            <Field label="Notes (optional)" name="notes" value={form.notes} onChange={handleChange} textarea />

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-brand-melon"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full mt-6 disabled:opacity-50"
            >
              {submitting ? 'Placing order…' : `Place order · £${total.toFixed(2)}`}
              {!submitting && <span>→</span>}
            </button>
            <p className="text-xs opacity-50 text-center mt-2">
              Payment processed securely. Stripe integration ready — currently in mock mode.
            </p>
          </form>

          {/* Summary */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 rounded-[28px] bg-white dark:bg-brand-ink border border-black/[0.06] dark:border-white/[0.06] p-6 md:p-8">
              <h3 className="font-display text-xl mb-6">Your order</h3>
              <ul className="space-y-3 mb-6">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between text-sm">
                    <div className="min-w-0 flex-1 mr-4">
                      <p className="truncate">{item.name}</p>
                      {item.meta && <p className="text-xs opacity-50 truncate">{item.meta}</p>}
                    </div>
                    <span className="opacity-60 text-xs">× {item.qty}</span>
                    <span className="tabular-nums w-16 text-right">
                      £{(item.price * item.qty).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-baseline justify-between">
                <span className="text-sm opacity-60">Total</span>
                <span className="font-display text-2xl tabular-nums">£{total.toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, type = 'text', textarea, required }) {
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] opacity-50 mb-2 block">{label}</span>
      <Tag
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        rows={textarea ? 3 : undefined}
        className="w-full px-5 py-3.5 rounded-2xl bg-white dark:bg-brand-ink border border-black/[0.08] dark:border-white/[0.08] focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20 transition-all font-sans"
      />
    </label>
  );
}
