import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { stripe } from '../lib/stripe.js';

const router = Router();

function generateOrderId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'JS-';
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function getClientBase() {
  return process.env.CLIENT_ORIGIN?.split(',')[0] || 'http://localhost:5173';
}

router.post('/', async (req, res) => {
  try {
    const { customer, items, total } = req.body;

    if (!customer || !customer.email || !customer.name || !customer.address) {
      return res.status(400).json({ error: 'Missing customer details.' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }
    if (typeof total !== 'number' || total < 0) {
      return res.status(400).json({ error: 'Invalid total.' });
    }
    if (!stripe) {
      return res.status(500).json({ error: 'Payment system not configured.' });
    }

    const order_id = generateOrderId();

    try {
      await supabase.from('users').upsert({
        email: customer.email,
        name: customer.name,
        phone: customer.phone || null,
      }, { onConflict: 'email' });
    } catch (e) {
      console.warn('[orders] user upsert failed, continuing:', e.message);
    }

    const { data: order, error: insertError } = await supabase
      .from('orders')
      .insert({
        order_id,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone || null,
        delivery_address: customer.address,
        notes: customer.notes || null,
        items,
        total,
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      console.error('[orders] insert error:', insertError);
      return res.status(500).json({ error: 'Could not save order.' });
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: item.name,
          ...(item.meta ? { description: item.meta } : {}),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    const base = getClientBase();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: customer.email,
      success_url: `${base}/order-success?id=${encodeURIComponent(order_id)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/checkout?cancelled=1`,
      metadata: { order_id, customer_email: customer.email },
      billing_address_collection: 'auto',
      locale: 'en-GB',
    });

    await supabase
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('order_id', order_id);

    res.status(201).json({
      order_id,
      checkout_url: session.url,
      session_id: session.id,
    });
  } catch (err) {
    console.error('[orders] unexpected error:', err);
    res.status(500).json({ error: err.message || 'Server error.' });
  }
});

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_id', req.params.id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Not found.' });
  res.json(data);
});

export default router;
