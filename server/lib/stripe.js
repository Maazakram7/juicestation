import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  console.warn('[stripe] Missing STRIPE_SECRET_KEY — payments will fail until .env is set.');
}

export const stripe = secretKey
  ? new Stripe(secretKey, { apiVersion: '2024-11-20.acacia' })
  : null;

export const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
