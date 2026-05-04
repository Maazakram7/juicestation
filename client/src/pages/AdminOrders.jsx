import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const STORAGE_KEY = 'js_admin_token';

export default function AdminOrders() {
  const [token, setToken] = useState(() => sessionStorage.getItem(STORAGE_KEY) || '');
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem(STORAGE_KEY));

  const handleAuth = (t) => {
    setToken(t);
    setAuthed(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    window.location.href = '/admin/orders';
  };

  if (!authed) {
    return <LoginScreen onAuth={handleAuth} />;
  }
  return <Dashboard key={token} token={token} onLogout={handleLogout} />;
}

function LoginScreen({ onAuth }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const tryLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/admin/orders`, {
        headers: { Authorization: `Bearer ${input}` },
      });
      if (res.status === 401) {
        setError('Wrong password.');
        setSubmitting(false);
        return;
      }
      if (!res.ok) {
        setError('Server error.');
        setSubmitting(false);
        return;
      }
      sessionStorage.setItem(STORAGE_KEY, input);
      onAuth(input);
    } catch (err) {
      setError('Connection error.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-6">
      <div className="max-w-sm w-full">
        <p className="text-xs uppercase tracking-[0.3em] opacity-50 mb-3 text-center">Admin</p>
        <h1 className="font-display text-3xl mb-8 text-center">Dashboard</h1>
        <form onSubmit={tryLogin} className="space-y-3">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-5 py-3.5 rounded-2xl bg-white border border-black/10 focus:outline-none focus:border-brand-green transition-all"
            placeholder="Admin password"
            autoFocus
            required
          />
          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
            {submitting ? 'Checking...' : 'Enter'}
          </button>
        </form>
        {error && <p className="text-sm text-brand-melon mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}

function Dashboard({ token, onLogout }) {
  const [tab, setTab] = useState('orders');

  return (
    <div className="min-h-screen bg-brand-cream pt-8 pb-24">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] opacity-50">Admin</p>
            <h1 className="font-display text-3xl md:text-4xl">Dashboard</h1>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onLogout();
            }}
            style={{ position: 'relative', zIndex: 100 }}
            className="text-sm uppercase tracking-wider px-5 py-3 rounded-full border-2 border-brand-charcoal hover:bg-brand-charcoal hover:text-brand-cream transition-all font-medium cursor-pointer"
          >
            Sign out
          </button>
        </div>

        {/* Main tabs */}
        <div className="flex gap-2 mb-8 border-b border-black/10">
          <TabButton active={tab === 'orders'} onClick={() => setTab('orders')}>
            Orders
          </TabButton>
          <TabButton active={tab === 'subscriptions'} onClick={() => setTab('subscriptions')}>
            Subscriptions
          </TabButton>
        </div>

        {tab === 'orders' && <OrdersTab token={token} />}
        {tab === 'subscriptions' && <SubscriptionsTab token={token} />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-3 text-sm font-medium tracking-wide transition-all border-b-2 -mb-[2px] ${
        active
          ? 'border-brand-charcoal text-brand-charcoal'
          : 'border-transparent opacity-50 hover:opacity-100'
      }`}
    >
      {children}
    </button>
  );
}

function OrdersTab({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [lastFetch, setLastFetch] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Could not fetch orders');
      const data = await res.json();
      setOrders(data.orders || []);
      setLastFetch(new Date());
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const fulfillOrder = async (orderId) => {
    try {
      const res = await fetch(`${API_URL}/admin/orders/${orderId}/fulfill`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Could not update order');
      }
      await fetchOrders();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const filtered = orders.filter((o) => {
    if (filter === 'all') return true;
    if (filter === 'active') return o.status === 'paid' || o.status === 'pending_cod';
    return o.status === filter;
  });

  const counts = {
    all: orders.length,
    active: orders.filter((o) => o.status === 'paid' || o.status === 'pending_cod').length,
    paid: orders.filter((o) => o.status === 'paid').length,
    pending_cod: orders.filter((o) => o.status === 'pending_cod').length,
    pending: orders.filter((o) => o.status === 'pending').length,
    fulfilled: orders.filter((o) => o.status === 'fulfilled').length,
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'all', label: 'All' },
          { id: 'active', label: 'To deliver' },
          { id: 'paid', label: 'Paid online' },
          { id: 'pending_cod', label: 'Cash on delivery' },
          { id: 'pending', label: 'Pending payment' },
          { id: 'fulfilled', label: 'Fulfilled' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium tracking-wide transition-all ${
              filter === f.id
                ? 'bg-brand-charcoal text-brand-cream'
                : 'border border-current/15 hover:border-current/40 opacity-70 hover:opacity-100'
            }`}
          >
            {f.label}
            <span className="ml-2 text-xs opacity-60">{counts[f.id]}</span>
          </button>
        ))}
      </div>

      {lastFetch && (
        <p className="text-xs opacity-40 mb-4">
          Last updated: {lastFetch.toLocaleTimeString()} (auto-refreshes every 30s) — tap any order to expand
        </p>
      )}

      {error && (
        <div className="mb-4 p-4 rounded-2xl bg-brand-melon/10 text-brand-melon text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-center py-20 opacity-50">Loading orders...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center py-20 opacity-50">No orders {filter !== 'all' ? `with this status` : 'yet'}.</p>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((order) => (
              <OrderCard key={order.order_id} order={order} onFulfill={fulfillOrder} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}

function SubscriptionsTab({ token }) {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [lastFetch, setLastFetch] = useState(null);

  const fetchSubs = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/admin/subscriptions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Could not fetch subscriptions');
      const data = await res.json();
      setSubs(data.subscriptions || []);
      setLastFetch(new Date());
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSubs();
    const interval = setInterval(fetchSubs, 30000);
    return () => clearInterval(interval);
  }, [fetchSubs]);

  const activateSub = async (subscriptionId) => {
    try {
      const res = await fetch(`${API_URL}/admin/subscriptions/${subscriptionId}/activate`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Could not activate');
      }
      await fetchSubs();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const cancelSub = async (subscriptionId) => {
    if (!confirm('Cancel this subscription? This cannot be undone.')) return;
    try {
      const res = await fetch(`${API_URL}/admin/subscriptions/${subscriptionId}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Could not cancel');
      }
      await fetchSubs();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const filtered = subs.filter((s) => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  const counts = {
    all: subs.length,
    pending: subs.filter((s) => s.status === 'pending').length,
    active: subs.filter((s) => s.status === 'active').length,
    cancelled: subs.filter((s) => s.status === 'cancelled').length,
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'all', label: 'All' },
          { id: 'pending', label: 'New requests' },
          { id: 'active', label: 'Active' },
          { id: 'cancelled', label: 'Cancelled' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium tracking-wide transition-all ${
              filter === f.id
                ? 'bg-brand-charcoal text-brand-cream'
                : 'border border-current/15 hover:border-current/40 opacity-70 hover:opacity-100'
            }`}
          >
            {f.label}
            <span className="ml-2 text-xs opacity-60">{counts[f.id]}</span>
          </button>
        ))}
      </div>

      {lastFetch && (
        <p className="text-xs opacity-40 mb-4">
          Last updated: {lastFetch.toLocaleTimeString()} — tap any subscription to expand
        </p>
      )}

      {error && (
        <div className="mb-4 p-4 rounded-2xl bg-brand-melon/10 text-brand-melon text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-center py-20 opacity-50">Loading subscriptions...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center py-20 opacity-50">No subscriptions {filter !== 'all' ? `with this status` : 'yet'}.</p>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((sub) => (
              <SubscriptionCard
                key={sub.subscription_id}
                sub={sub}
                onActivate={activateSub}
                onCancel={cancelSub}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}

function OrderCard({ order, onFulfill }) {
  const [expanded, setExpanded] = useState(false);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    pending_cod: 'bg-orange-100 text-orange-800',
    paid: 'bg-brand-green/15 text-brand-green-deep',
    fulfilled: 'bg-gray-200 text-gray-600',
    cancelled: 'bg-brand-melon/15 text-brand-melon',
  };

  const statusLabels = {
    pending: 'pending payment',
    pending_cod: 'cash on delivery',
    paid: 'paid',
    fulfilled: 'fulfilled',
    cancelled: 'cancelled',
  };

  const canFulfill = order.status === 'paid' || order.status === 'pending_cod';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden"
    >
      <div
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpanded(!expanded); }}
        className="w-full text-left p-4 md:p-5 hover:bg-black/[0.02] transition-colors cursor-pointer"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full ${statusColors[order.status] || 'bg-gray-100'}`}>
                {statusLabels[order.status] || order.status}
              </span>
              <span className="font-display text-base font-semibold tabular-nums">#{String(order.sequence_number || 0).padStart(5, '0')}</span>
              <span className="font-mono text-xs opacity-50">{order.order_id}</span>
              <span className="text-xs opacity-50">{formatTime(order.created_at)}</span>
            </div>
            <p className="font-medium text-sm md:text-base truncate">{order.customer_name}</p>
            <p className="text-xs opacity-60 truncate">{order.items.reduce((s, i) => s + i.qty, 0)} items · tap to expand</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-display text-xl md:text-2xl tabular-nums">£{Number(order.total).toFixed(2)}</p>
            {order.status === 'pending_cod' && (
              <p className="text-[10px] uppercase tracking-wider text-orange-700 font-medium mt-1">Collect cash</p>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-black/[0.06] pt-4 space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-1">Contact</p>
                <p className="text-sm">
                  <a href={`mailto:${order.customer_email}`} onClick={(e) => e.stopPropagation()} className="text-brand-green-deep">
                    {order.customer_email}
                  </a>
                </p>
                {order.customer_phone && (
                  <p className="text-sm">
                    <a href={`tel:${order.customer_phone}`} onClick={(e) => e.stopPropagation()} className="text-brand-green-deep">
                      {order.customer_phone}
                    </a>
                  </p>
                )}
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-1">Items</p>
                <ul className="space-y-1">
                  {order.items.map((item, i) => (
                    <li key={i} className="text-sm flex justify-between">
                      <span>
                        {item.name}
                        {item.meta && <span className="opacity-50 text-xs"> ({item.meta})</span>}
                      </span>
                      <span className="opacity-60 tabular-nums">x{item.qty} · £{(item.price * item.qty).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-1">Delivery to</p>
                <p className="text-sm whitespace-pre-line">{order.delivery_address}</p>
              </div>

              {order.notes && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-1">Notes</p>
                  <p className="text-sm italic opacity-80">"{order.notes}"</p>
                </div>
              )}

              {canFulfill && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onFulfill(order.order_id);
                  }}
                  className="btn-primary w-full text-sm"
                >
                  {order.status === 'pending_cod' ? 'Mark delivered & cash collected' : 'Mark as fulfilled'}
                </button>
              )}

              {order.status === 'pending' && (
                <p className="text-xs text-center opacity-60 italic">
                  Awaiting Stripe payment confirmation.
                </p>
              )}

              {order.status === 'fulfilled' && order.fulfilled_at && (
                <p className="text-xs opacity-50 text-center">
                  Fulfilled {formatTime(order.fulfilled_at)}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SubscriptionCard({ sub, onActivate, onCancel }) {
  const [expanded, setExpanded] = useState(false);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-brand-green/15 text-brand-green-deep',
    cancelled: 'bg-gray-200 text-gray-600',
    paused: 'bg-orange-100 text-orange-800',
  };

  const statusLabels = {
    pending: 'new request',
    active: 'active',
    cancelled: 'cancelled',
    paused: 'paused',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden"
    >
      <div
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpanded(!expanded); }}
        className="w-full text-left p-4 md:p-5 hover:bg-black/[0.02] transition-colors cursor-pointer"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full ${statusColors[sub.status] || 'bg-gray-100'}`}>
                {statusLabels[sub.status] || sub.status}
              </span>
              <span className="font-mono text-xs opacity-50">{sub.subscription_id}</span>
              <span className="text-xs opacity-50">{formatTime(sub.created_at)}</span>
            </div>
            <p className="font-medium text-sm md:text-base truncate">{sub.customer_name}</p>
            <p className="text-xs opacity-60 truncate">{sub.tier_name} · tap to expand</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-display text-xl md:text-2xl tabular-nums">£{Number(sub.price_per_week).toFixed(2)}</p>
            <p className="text-[10px] uppercase tracking-wider opacity-50 mt-1">per week</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-black/[0.06] pt-4 space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-1">Contact</p>
                <p className="text-sm">
                  <a href={`mailto:${sub.customer_email}`} onClick={(e) => e.stopPropagation()} className="text-brand-green-deep">
                    {sub.customer_email}
                  </a>
                </p>
                {sub.customer_phone && (
                  <p className="text-sm">
                    <a href={`tel:${sub.customer_phone}`} onClick={(e) => e.stopPropagation()} className="text-brand-green-deep">
                      {sub.customer_phone}
                    </a>
                  </p>
                )}
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-1">Plan</p>
                <p className="text-sm font-medium">{sub.tier_name}</p>
                <p className="text-sm opacity-60">£{Number(sub.price_per_week).toFixed(2)} per week</p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-1">Postcode</p>
                <p className="text-sm">{sub.delivery_postcode}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-1">Delivery to</p>
                <p className="text-sm whitespace-pre-line">{sub.delivery_address}</p>
              </div>

              {sub.juice_preference && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-1">Juice preference</p>
                  <p className="text-sm">{sub.juice_preference}</p>
                </div>
              )}

              {sub.preferred_start_date && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-1">Preferred start date</p>
                  <p className="text-sm">{sub.preferred_start_date}</p>
                </div>
              )}

              {sub.notes && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-1">Notes</p>
                  <p className="text-sm italic opacity-80">"{sub.notes}"</p>
                </div>
              )}

              {sub.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onActivate(sub.subscription_id);
                    }}
                    className="btn-primary flex-1 text-sm"
                  >
                    Mark as active
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onCancel(sub.subscription_id);
                    }}
                    className="px-5 py-3 rounded-full border-2 border-brand-melon text-brand-melon hover:bg-brand-melon hover:text-white transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {sub.status === 'active' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onCancel(sub.subscription_id);
                  }}
                  className="w-full px-5 py-3 rounded-full border-2 border-brand-melon text-brand-melon hover:bg-brand-melon hover:text-white transition-colors text-sm font-medium"
                >
                  Cancel subscription
                </button>
              )}

              {sub.status === 'active' && sub.activated_at && (
                <p className="text-xs opacity-50 text-center">
                  Active since {formatTime(sub.activated_at)}
                </p>
              )}

              {sub.status === 'cancelled' && sub.cancelled_at && (
                <p className="text-xs opacity-50 text-center">
                  Cancelled {formatTime(sub.cancelled_at)}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString();
}
