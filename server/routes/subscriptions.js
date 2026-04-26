import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { sendSubscriptionCustomerAck, sendSubscriptionOwnerNotification } from '../lib/mailer.js';

const router = Router();

// Tier pricing source of truth — mirrors client.
// Authoritative here for when Stripe billing is wired in.
const TIERS = {
  'weekly-litre':     { name: 'Weekly Litre',     pricePerWeek: 22 },
  'big-bottle-plus':  { name: 'Big Bottle Plus',  pricePerWeek: 40 },
  'household-litres': { name: 'Household Litres', pricePerWeek: 40 },
};

function generateSubscriptionId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'JSS-';
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

router.post('/', async (req, res) => {
  try {
    const { tier, customer } = req.body;

    // Validation
    const tierInfo = TIERS[tier];
    if (!tierInfo) return res.status(400).json({ error: 'Invalid subscription tier.' });
    if (!customer || !customer.name || !customer.email || !customer.address || !customer.postcode) {
      return res.status(400).json({ error: 'Missing customer details.' });
    }

    const subscription_id = generateSubscriptionId();

    // Best-effort user upsert
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
      console.warn('[subscriptions] user upsert failed, continuing:', e.message);
    }

    // Insert subscription request. Status = pending until manually confirmed + Stripe set up.
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        subscription_id,
        tier,
        tier_name: tierInfo.name,
        price_per_week: tierInfo.pricePerWeek,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone || null,
        delivery_address: customer.address,
        delivery_postcode: customer.postcode.toUpperCase().replace(/\s+/g, ''),
        juice_preference: customer.juicePreference || null,
        preferred_start_date: customer.startDate || null,
        notes: customer.notes || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('[subscriptions] insert error:', error);
      return res.status(500).json({ error: 'Could not save subscription.' });
    }

    // NOTE (Stripe integration point):
    // 1) Create a Stripe Customer for customer.email
    // 2) Create a Product + Price in Stripe for each tier (one-time, or use Stripe Subscriptions with a weekly interval)
    // 3) Send a Stripe Checkout link to customer.email OR set up a SetupIntent to collect card details
    // 4) Webhook /stripe/webhook updates `status` to 'active' once first payment clears
    // Until then, pending subscriptions sit in the DB for manual follow-up.

    res.status(201).json({
      subscription_id: data.subscription_id,
      status: data.status,
      tier: data.tier_name,
      price_per_week: data.price_per_week,
    });
  } catch (err) {
    console.error('[subscriptions] unexpected error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('subscription_id', req.params.id)
    .single();
  if (error || !data) return res.status(404).json({ error: 'Not found.' });
  res.json(data);
});

export default router;
