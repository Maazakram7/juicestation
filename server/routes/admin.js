import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { timingSafeEqual } from 'crypto';

const router = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

/**
 * Admin authentication middleware.
 * Uses constant-time comparison to prevent timing attacks (OWASP A07:2021).
 */
function requireAdmin(req, res, next) {
  if (!ADMIN_PASSWORD) {
    console.error('[admin] ADMIN_PASSWORD env var not set');
    return res.status(500).json({ error: 'Server misconfigured.' });
  }

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const provided = auth.slice(7);
  const expected = ADMIN_PASSWORD;

  const providedBuf = Buffer.from(provided);
  const expectedBuf = Buffer.from(expected);

  let isValid = providedBuf.length === expectedBuf.length;
  const compareBuf = isValid ? providedBuf : Buffer.alloc(expectedBuf.length, 0);

  if (!timingSafeEqual(compareBuf, expectedBuf)) {
    isValid = false;
  }

  if (!isValid) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

// GET /admin/orders — list orders with sequence numbers
router.get('/orders', requireAdmin, async (req, res) => {
  const { count: totalCount, error: countError } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('[admin/orders] count error:', countError);
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    console.error('[admin/orders] fetch error:', error);
    return res.status(500).json({ error: 'Could not fetch orders.' });
  }

  const total = totalCount || (data?.length || 0);
  const ordersWithSeq = (data || []).map((order, idx) => ({
    ...order,
    sequence_number: total - idx,
  }));

  res.json({ orders: ordersWithSeq, total });
});

// PATCH /admin/orders/:id/fulfill
router.patch('/orders/:id/fulfill', requireAdmin, async (req, res) => {
  const orderId = req.params.id;
  const { data, error } = await supabase
    .from('orders')
    .update({
      status: 'fulfilled',
      fulfilled_at: new Date().toISOString(),
    })
    .eq('order_id', orderId)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json({ order: data });
});

// GET /admin/subscriptions — list subscription signups
router.get('/subscriptions', requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    console.error('[admin/subscriptions] fetch error:', error);
    return res.status(500).json({ error: 'Could not fetch subscriptions.' });
  }
  res.json({ subscriptions: data || [] });
});

// PATCH /admin/subscriptions/:id/activate
router.patch('/subscriptions/:id/activate', requireAdmin, async (req, res) => {
  const subscriptionId = req.params.id;
  const { data, error } = await supabase
    .from('subscriptions')
    .update({
      status: 'active',
      activated_at: new Date().toISOString(),
    })
    .eq('subscription_id', subscriptionId)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ subscription: data });
});

// PATCH /admin/subscriptions/:id/cancel
router.patch('/subscriptions/:id/cancel', requireAdmin, async (req, res) => {
  const subscriptionId = req.params.id;
  const { data, error } = await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
    })
    .eq('subscription_id', subscriptionId)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ subscription: data });
});

export default router;
