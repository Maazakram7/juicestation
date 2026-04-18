import { Router } from 'express';
import express from 'express';
import { stripe, webhookSecret } from '../lib/stripe.js';
import { supabase } from '../lib/supabase.js';

const router = Router();

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    if (!stripe) return res.status(500).send('Stripe not configured');
    if (!webhookSecret) return res.status(500).send('Webhook secret not configured');

    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error('[stripe webhook] signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object;
          const orderId = session.metadata?.order_id;

          if (orderId) {
            await supabase
              .from('orders')
              .update({
                status: 'paid',
                payment_intent_id: session.payment_intent,
                paid_at: new Date().toISOString(),
              })
              .eq('order_id', orderId);
            console.log(`[stripe webhook] order ${orderId} marked as paid`);
          }
          break;
        }

        case 'checkout.session.expired': {
          const session = event.data.object;
          const orderId = session.metadata?.order_id;
          if (orderId) {
            await supabase
              .from('orders')
              .update({ status: 'cancelled' })
              .eq('order_id', orderId)
              .eq('status', 'pending');
          }
          break;
        }

        default:
          console.log(`[stripe webhook] unhandled event: ${event.type}`);
      }

      res.json({ received: true });
    } catch (err) {
      console.error('[stripe webhook] handler error:', err);
      res.status(500).send('Handler error');
    }
  }
);

export default router;
