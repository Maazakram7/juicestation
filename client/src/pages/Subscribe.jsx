import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SUBSCRIPTION_TIERS,
  SUBSCRIPTION_BENEFITS,
  DELIVERY_POSTCODES,
  ONE_OFF_DELIVERY_FEE,
  ONE_OFF_MIN_ORDER,
} from '../data/subscriptions';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function Subscribe() {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState(null);
  const formRef = useRef(null);

  // Scroll the form into view once it has mounted under AnimatePresence.
  // Effect runs after layout, so the target always exists — no setTimeout.
  useEffect(() => {
    if (selectedTier && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedTier]);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    postcode: '',
    address: '',
    juicePreference: '',
    startDate: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Postcode validation — accept RG12, RG40, RG42 (primary) or extended
  const postcodePrefix = form.postcode.trim().toUpperCase().replace(/\s+/g, '').slice(0, 4);
  const isPrimaryPostcode = DELIVERY_POSTCODES.primary.some((p) =>
    postcodePrefix.startsWith(p)
  );
  const isExtendedPostcode = DELIVERY_POSTCODES.extended.some((p) =>
    postcodePrefix.startsWith(p)
  );
  const postcodeStatus =
    form.postcode.length < 3
      ? null
      : isPrimaryPostcode
      ? 'primary'
      : isExtendedPostcode
      ? 'extended'
      : 'out-of-range';

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTier) {
      setError('Please pick a subscription tier.');
      return;
    }
    if (postcodeStatus === 'out-of-range') {
      setError("We don't deliver to that postcode yet. Sorry!");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: selectedTier,
          customer: form,
        }),
      });
      if (!res.ok) throw new Error('Signup failed — please try again.');
      const data = await res.json();
      navigate(`/order-success?id=${encodeURIComponent(data.subscription_id)}&type=subscription`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const tier = SUBSCRIPTION_TIERS.find((t) => t.id === selectedTier);

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16 md:mb-20 max-w-4xl"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-faint mb-4">Weekly subscription</p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
            Delivered fresh.
            <br />
            Every <em>Monday.</em>
          </h1>
          <p className="mt-8 text-lg text-muted max-w-2xl leading-relaxed">
            Order by Sunday. Pressed Monday morning, delivered the same day. Free delivery across{' '}
            <strong>RG12, RG40, RG42</strong>. Pause, skip or cancel any week — no fees.
          </p>
        </motion.div>

        {/* Benefit strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mb-20 md:mb-24 pb-12 md:pb-16 border-b border-current/10"
        >
          {SUBSCRIPTION_BENEFITS.map((b) => (
            <div key={b.label}>
              <p className="font-display text-lg mb-1.5">{b.label}</p>
              <p className="text-sm text-muted leading-relaxed">{b.body}</p>
            </div>
          ))}
        </motion.div>

        {/* Tiers */}
        <div className="mb-16">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-faint mb-3">Pick a plan</p>
            <h2 className="font-display text-3xl md:text-5xl tracking-tight">
              Three tiers. Switch anytime.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {SUBSCRIPTION_TIERS.map((tier, i) => (
              <TierCard
                key={tier.id}
                tier={tier}
                index={i}
                selected={selectedTier === tier.id}
                onSelect={() => setSelectedTier(tier.id)}
              />
            ))}
          </div>
        </div>

        {/* Form (appears when a tier is chosen) */}
        <AnimatePresence>
          {selectedTier && (
            <motion.section
              id="subscribe-form"
              ref={formRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-20 pt-12 border-t border-current/10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Form */}
                <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-faint mb-2">Your details</p>
                    <h3 className="font-display text-2xl md:text-3xl tracking-tight">
                      Let's get you set up.
                    </h3>
                  </div>
                  <Field label="Name" name="name" value={form.name} onChange={handleChange} required autoComplete="name" />
                  <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email" />
                  <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required autoComplete="tel" />
                  <Field
                    label="Delivery postcode"
                    name="postcode"
                    value={form.postcode}
                    onChange={handleChange}
                    required
                    hint={
                      postcodeStatus === 'primary'
                        ? '✓ Great — we deliver here every Monday.'
                        : postcodeStatus === 'extended'
                        ? '✓ We can deliver here — lead time may be a bit longer.'
                        : postcodeStatus === 'out-of-range'
                        ? '⚠ This postcode is outside our delivery zone. Contact us to discuss options.'
                        : 'Covers RG12 · RG40 · RG42 first, extended zones available'
                    }
                    hintTone={postcodeStatus === 'out-of-range' ? 'error' : postcodeStatus ? 'ok' : 'muted'}
                    autoComplete="postal-code"
                  />
                  <Field label="Full delivery address" name="address" value={form.address} onChange={handleChange} required textarea autoComplete="street-address" />
                  <Field
                    label="Preferred juices (optional)"
                    name="juicePreference"
                    value={form.juicePreference}
                    onChange={handleChange}
                    textarea
                    placeholder="e.g. Red Rush and Green Juice, or I'll pick each week"
                  />
                  <Field
                    label="When would you like to start?"
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={handleChange}
                  />
                  <Field label="Anything else we should know?" name="notes" value={form.notes} onChange={handleChange} textarea />

                  {error && (
                    <motion.p
                      role="alert"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-brand-melon-deep"
                    >
                      {error}
                    </motion.p>
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary w-full md:w-auto disabled:opacity-50"
                    >
                      {submitting ? 'Submitting…' : `Subscribe · £${tier?.pricePerWeek}/week`}
                      {!submitting && <span>→</span>}
                    </button>
                    <p className="text-xs text-subtle mt-4 max-w-lg">
                      We'll confirm by email within 24 hours and set up your billing. First delivery on the Monday after confirmation. Cancel any time.
                    </p>
                  </div>
                </form>

                {/* Sticky summary */}
                <aside className="lg:col-span-5">
                  <div className="lg:sticky lg:top-28 rounded-[28px] bg-white border border-black/[0.06] p-6 md:p-8">
                    <p className="text-xs uppercase tracking-[0.3em] text-faint mb-3">Your plan</p>
                    <h3 className="font-display text-2xl mb-1">{tier.name}</h3>
                    <p className="text-sm text-muted italic mb-6">{tier.tagline}</p>

                    <ul className="space-y-3 mb-6">
                      {tier.contents.map((c, i) => (
                        <li key={i} className="flex items-baseline justify-between text-sm gap-4">
                          <div className="flex-1">
                            <p>
                              <span className="tabular-nums">{c.qty}×</span> {c.label}
                            </p>
                            <p className="text-xs text-subtle mt-0.5">{c.note}</p>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4 border-t border-current/10 space-y-2">
                      <div className="flex justify-between text-sm text-muted">
                        <span>Walk-up value</span>
                        <span className="line-through tabular-nums">£{tier.walkUpValue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Delivery</span>
                        <span className="text-brand-green-deep font-medium">Free</span>
                      </div>
                      <div className="flex items-baseline justify-between pt-3 border-t border-current/10">
                        <span className="font-medium">Your weekly total</span>
                        <span className="font-display text-2xl tabular-nums">£{tier.pricePerWeek}</span>
                      </div>
                      <p className="text-xs text-subtle text-right">
                        Save £{tier.savings.toFixed(2)}/week · £{(tier.savings * 52).toFixed(0)}/year
                      </p>
                    </div>
                  </div>
                </aside>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* One-off order callout */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-24 md:mt-32 p-8 md:p-12 rounded-[28px] bg-brand-charcoal text-brand-cream border border-white/10"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-lg">
              <p className="text-xs uppercase tracking-[0.3em] opacity-70 mb-3">Not ready to subscribe?</p>
              <h3 className="font-display text-2xl md:text-3xl tracking-tight mb-3">
                One-off delivery, £{ONE_OFF_MIN_ORDER} minimum.
              </h3>
              <p className="opacity-80 leading-relaxed">
                Build an order of £{ONE_OFF_MIN_ORDER} or more and we'll deliver it to your door for £{ONE_OFF_DELIVERY_FEE.toFixed(2)}. Subscribers skip this fee every week.
              </p>
            </div>
            <button
              onClick={() => navigate('/menu')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-cream text-brand-charcoal font-medium text-sm tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              Build an order
              <span>→</span>
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

// ——————————————————————————————————————————————————————————————

function TierCard({ tier, selected, onSelect, index }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
      onClick={onSelect}
      className={`group relative text-left p-7 md:p-8 rounded-[28px] transition-all duration-300 ease-out hover:-translate-y-1 ${
        selected
          ? 'bg-brand-charcoal text-brand-cream border-2 border-brand-green shadow-xl'
          : 'bg-white border border-black/[0.06] hover:shadow-xl hover:shadow-black/5'
      }`}
    >
      {tier.featured && !selected && (
        <span className="absolute -top-3 left-7 bg-brand-citrus text-white text-[10px] uppercase tracking-wider font-medium px-3 py-1 rounded-full">
          Most popular
        </span>
      )}
      {selected && (
        <span className="absolute top-5 right-5 w-7 h-7 rounded-full bg-brand-green flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}

      <p className={`text-xs uppercase tracking-[0.3em] mb-3 ${selected ? 'opacity-70' : 'text-faint'}`}>{tier.tagline}</p>
      <h3 className="font-display text-2xl md:text-3xl tracking-tight mb-4 leading-none">{tier.name}</h3>

      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-4xl tabular-nums">£{tier.pricePerWeek}</span>
          <span className={`text-sm ${selected ? 'opacity-70' : 'text-muted'}`}>/week</span>
        </div>
        <p className={`text-xs mt-1 tabular-nums ${selected ? 'opacity-70' : 'text-subtle'}`}>
          Save £{tier.savings.toFixed(2)}/week vs walk-up
        </p>
      </div>

      <div className="space-y-2.5 mb-6 text-sm">
        {tier.contents.map((c, i) => (
          <div key={i} className="flex items-baseline gap-2">
            <span className="tabular-nums font-medium">{c.qty}×</span>
            <span>{c.label}</span>
          </div>
        ))}
      </div>

      <p className={`text-sm leading-relaxed mb-4 ${selected ? 'opacity-80' : 'text-muted'}`}>{tier.description}</p>
      <p className={`text-xs italic pt-3 border-t border-current/10 ${selected ? 'opacity-70' : 'text-subtle'}`}>
        Best for: {tier.bestFor}
      </p>
    </motion.button>
  );
}

function Field({ label, name, value, onChange, type = 'text', textarea, required, hint, hintTone = 'muted', placeholder, autoComplete }) {
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
        rows={textarea ? 2 : undefined}
        placeholder={placeholder}
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
