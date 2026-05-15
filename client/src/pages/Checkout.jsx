import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ONE_OFF_MIN_ORDER } from '../data/subscriptions';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function Checkout() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('online');
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

    const endpoint = paymentMethod === 'cod' ? `${API_URL}/order/cod` : `${API_URL}/order`;

    try {
      const res = await fetch(endpoint, {
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

      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({}));
        throw new Error(msg || 'Order failed.');
      }
      const data = await res.json();

      if (paymentMethod === 'online') {
        if (!data.checkout_url) throw new Error('No payment URL.');
        clear();
        window.location.href = data.checkout_url;
      } else {
        clear();
        navigate(`/order-success?id=${encodeURIComponent(data.order_id)}&type=cod`);
      }
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-40 pb-24 px-6 text-center max-w-xl mx-auto">
        <div className="text-6xl mb-6 opacity-30" aria-hidden="true">🧃</div>
        <h1 className="font-display text-4xl mb-4">Cart's empty.</h1>
        <p className="text-muted mb-8">Add something before checking out.</p>
        <Link to="/menu" className="btn-primary">Browse the menu</Link>
      </div>
    );
  }

  const belowMinimum = total < ONE_OFF_MIN_ORDER;

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12 max-w-2xl"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-faint mb-4">Checkout</p>
          <h1 className="font-display text-4xl md:text-6xl leading-[0.95]">Almost there.</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
            <Field label="Name" name="name" value={form.name} onChange={handleChange} required autoComplete="name" />
            <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email" />
            <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required autoComplete="tel" />
            <Field label="Delivery address" name="address" value={form.address} onChange={handleChange} required textarea autoComplete="street-address" />
            <Field label="Notes (optional)" name="notes" value={form.notes} onChange={handleChange} textarea autoComplete="off" />

            <div className="pt-4">
              <span className="text-xs uppercase tracking-[0.3em] text-faint mb-3 block">Payment method</span>
              <div className="grid grid-cols-2 gap-3">
                <PaymentOption active={paymentMethod === 'online'} onClick={() => setPaymentMethod('online')} title="Pay online" subtitle="Card, Apple Pay" />
                <PaymentOption active={paymentMethod === 'cod'} onClick={() => setPaymentMethod('cod')} title="Cash on delivery" subtitle="Pay when delivered" />
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm text-brand-melon-deep">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || belowMinimum}
              className="btn-primary w-full mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting
                ? (paymentMethod === 'online' ? 'Redirecting...' : 'Placing order...')
                : belowMinimum
                ? `Add £${(ONE_OFF_MIN_ORDER - total).toFixed(2)} more — £${ONE_OFF_MIN_ORDER} minimum`
                : paymentMethod === 'online'
                ? `Pay £${total.toFixed(2)} securely →`
                : `Place order — £${total.toFixed(2)} on delivery →`}
            </button>
            <p className="text-xs text-subtle text-center mt-2">
              {paymentMethod === 'online' ? 'Secure payment powered by Stripe.' : 'Pay the driver in cash on delivery.'}
            </p>
          </form>

          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 rounded-[28px] bg-white border border-black/[0.06] p-6 md:p-8">
              <h3 className="font-display text-xl mb-6">Your order</h3>
              <ul className="space-y-3 mb-6">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between text-sm">
                    <div className="min-w-0 flex-1 mr-4">
                      <p className="truncate">{item.name}</p>
                      {item.meta && <p className="text-xs text-subtle truncate">{item.meta}</p>}
                    </div>
                    <span className="text-subtle text-xs">× {item.qty}</span>
                    <span className="tabular-nums w-16 text-right">£{(item.price * item.qty).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-black/10 flex items-baseline justify-between">
                <span className="text-sm text-muted">Total</span>
                <span className="font-display text-2xl tabular-nums">£{total.toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function PaymentOption({ active, onClick, title, subtitle }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative text-left p-4 rounded-2xl border-2 transition-all ${active ? 'border-brand-green bg-brand-green/5' : 'border-black/10 hover:border-black/20'}`}
    >
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted mt-0.5">{subtitle}</p>
      {active && (
        <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-brand-green flex items-center justify-center" aria-hidden="true">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
    </button>
  );
}

/**
 * Form field with optional hint copy below the input.
 * `hintTone` controls colour: 'error' = red, 'ok' = green, 'muted' (default).
 */
function Field({ label, name, value, onChange, type = 'text', textarea, required, hint, hintTone = 'muted', autoComplete }) {
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.3em] text-faint mb-2 block">{label}</span>
      <Tag
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        rows={textarea ? 3 : undefined}
        autoComplete={autoComplete}
        className="w-full px-5 py-3.5 rounded-2xl bg-white border border-black/[0.08] focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20 transition-all font-sans"
      />
      {hint && (
        <p
          className={`text-xs mt-2 ${
            hintTone === 'error'
              ? 'text-brand-melon-deep'
              : hintTone === 'ok'
              ? 'text-brand-green-deep'
              : 'text-subtle'
          }`}
        >
          {hint}
        </p>
      )}
    </label>
  );
}