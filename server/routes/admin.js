import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'Admin password not configured on server.' });
  }
  if (!auth || auth !== `Bearer ${ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

router.get('/orders', requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    console.error('[admin/orders] fetch error:', error);
    return res.status(500).json({ error: 'Could not fetch orders.' });
  }
  res.json({ orders: data || [] });
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
