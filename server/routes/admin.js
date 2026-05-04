import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { timingSafeEqual } from 'crypto';

const router = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

/**
 * Admin authentication middleware.
 * Uses constant-time comparison to prevent timing attacks (OWASP A07:2021).
 * The password is stored as a plain env var on Render — for higher security,
 * future versions should use bcrypt-hashed tokens or short-lived JWTs.
 */
function requireAdmin(req, res, next) {
  if (!ADMIN_PASSWORD) {
    console.error('[admin] ADMIN_PASSWORD env var not set');
    return res.status(500).json({ error: 'Server misconfigured.' });
  }

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    // Generic message — don't reveal what's wrong (avoids enumeration)
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const provided = auth.slice(7); // strip 'Bearer ' prefix
  const expected = ADMIN_PASSWORD;

  // Constant-time comparison — prevents timing attacks
  // Buffers must be the same length, so pad shorter one
  const providedBuf = Buffer.from(provided);
  const expectedBuf = Buffer.from(expected);

  let isValid = providedBuf.length === expectedBuf.length;
  // Always run timingSafeEqual to keep timing constant regardless of length match
  // Use a buffer of equal length for the comparison if lengths differ
  const compareBuf = isValid
    ? providedBuf
    : Buffer.alloc(expectedBuf.length, 0);

  if (!timingSafeEqual(compareBuf, expectedBuf)) {
    isValid = false;
  }

  if (!isValid) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

router.get('/orders', requireAdmin, async (req, res) => {
  // Get total count to compute sequence numbers correctly past the 200-order limit
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

  // Compute sequence number for each order based on chronological position
  // Orders are returned newest-first, so newest order has highest sequence number
  const total = totalCount || (data?.length || 0);
  const ordersWithSeq = (data || []).map((order, idx) => ({
    ...order,
    sequence_number: total - idx,
  }));

  res.json({ orders: ordersWithSeq, total });
});

router.patch('/orders/:id/fulfill', requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .update({
      status: 'fulfilled',
      fulfilled_at: new Date().toISOString(),
    })
    .eq('order_id', req.params.id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json({ order: data });
});
// GET /admin/subscriptions — list all subscription signups, newest first
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

// PATCH /admin/subscriptions/:id/activate — mark as active (after manual setup)
router.patch('/subscriptions/:id/activate', requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({
      status: 'active',
      activated_at: new Date().toISOString(),
    })
    .eq('subscription_id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ subscription: data });
});

// PATCH /admin/subscriptions/:id/cancel — mark as cancelled
router.patch('/subscriptions/:id/cancel', requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
    })
    .eq('subscription_id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ subscription: data });
});
export default router;
