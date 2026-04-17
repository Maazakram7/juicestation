import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

// Generates a short, human-readable order ID (e.g. JS-A4B7C2)
function generateOrderId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I confusables
  let id = 'JS-';
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

router.post('/', async (req, res) => {
  try {
    const { customer, items, total } = req.body;

    // --- Validation ---
    if (!customer || !customer.email || !customer.name || !customer.address) {
      return res.status(400).json({ error: 'Missing customer details.' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }
    if (typeof total !== 'number' || total < 0) {
      return res.status(400).json({ error: 'Invalid total.' });
    }

    const order_id = generateOrderId();

    // --- Upsert user (optional, best-effort — don't fail the order if this breaks) ---
    try {
      await supabase
        .from('users')
        .upsert(
          {
            email: customer.email,
            name: customer.name,
            phone: customer.phone || null,
          },
          { onConflict: 'email' }
        );
    } catch (e) {
      console.warn('[orders] user upsert failed, continuing:', e.message);
    }

    // --- Insert order ---
    const { data, error } = await supabase
      .from('orders')
      .insert({
        order_id,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone || null,
        delivery_address: customer.address,
        notes: customer.notes || null,
        items,          // JSONB
        total,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('[orders] insert error:', error);
      return res.status(500).json({ error: 'Could not save order.' });
    }

    res.status(201).json({
      order_id: data.order_id,
      status: data.status,
      total: data.total,
    });
  } catch (err) {
    console.error('[orders] unexpected error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /order/:id — fetch a single order (for confirmation emails etc.)
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
