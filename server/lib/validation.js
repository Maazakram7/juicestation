/**
 * Input validation schemas using Zod.
 * Every public endpoint validates against these.
 *
 * OWASP A03:2021 (Injection) — strict typing prevents injection attacks.
 * OWASP A04:2021 (Insecure Design) — reject unexpected fields, enforce limits.
 */
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// Reusable string sanitizer — strips any HTML tags that snuck in
const sanitizedString = (max) =>
  z
    .string()
    .max(max, `Must be ${max} characters or fewer.`)
    .transform((s) => DOMPurify.sanitize(s.trim(), { ALLOWED_TAGS: [] }));

// UK phone number — accepts mobile and landline formats
// Strict enough to reject obvious nonsense, lenient enough for genuine UK formats
const ukPhoneRegex = /^[\d\s\+\-\(\)]{10,20}$/;

// UK postcode — accepts both formatted (RG12 1AB) and unformatted (RG121AB)
const ukPostcodeRegex = /^[A-Z\s\d]{5,10}$/i;

// Customer base schema — used in orders, COD, and subscriptions
const customerSchema = z
  .object({
    name: sanitizedString(100).pipe(z.string().min(1, 'Name is required.')),
    email: z.string().email('Invalid email format.').max(254),
    phone: z
      .string()
      .max(20)
      .regex(ukPhoneRegex, 'Invalid UK phone number.')
      .optional()
      .or(z.literal('')),
    address: sanitizedString(500).pipe(z.string().min(5, 'Address must be at least 5 characters.')),
    notes: sanitizedString(500).optional().or(z.literal('')),
  })
  .strict(); // reject unexpected fields

// Cart item schema
const cartItemSchema = z
  .object({
    id: z.string().min(1).max(100),
    name: sanitizedString(200),
    price: z.number().min(0).max(100), // £100 max single item — prevents tampering
    qty: z.number().int().min(1).max(20), // sensible quantity bounds
    meta: sanitizedString(200).nullable().optional(),
  })
  .strict();

// ORDER (online via Stripe)
export const orderSchema = z
  .object({
    customer: customerSchema,
    items: z.array(cartItemSchema).min(1, 'Cart is empty.').max(50, 'Too many items in one order.'),
    total: z.number().positive('Total must be positive.').max(10000, 'Total exceeds maximum.'),
  })
  .strict();

// COD ORDER — same shape as online order
export const codOrderSchema = orderSchema;

// SUBSCRIPTION REQUEST
const subscriptionCustomerSchema = z
  .object({
    name: sanitizedString(100).pipe(z.string().min(1)),
    email: z.string().email().max(254),
    phone: z.string().max(20).regex(ukPhoneRegex, 'Invalid UK phone number.'),
    postcode: z.string().max(10).regex(ukPostcodeRegex, 'Invalid UK postcode.'),
    address: sanitizedString(500).pipe(z.string().min(5)),
    juicePreference: sanitizedString(500).optional().or(z.literal('')),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format.').optional().or(z.literal('')),
    notes: sanitizedString(500).optional().or(z.literal('')),
  })
  .strict();

export const subscriptionSchema = z
  .object({
    tier: z.enum(['weekly-litre', 'big-bottle-plus', 'household-litres']),
    customer: subscriptionCustomerSchema,
  })
  .strict();

/**
 * Express middleware factory: validates req.body against a schema.
 * On failure, returns 400 with the first validation error message.
 * On success, replaces req.body with the parsed (sanitized) data.
 */
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return res.status(400).json({
        error: firstIssue?.message || 'Invalid request body.',
        field: firstIssue?.path?.join('.'),
      });
    }
    // Replace body with the sanitized, validated version
    req.body = result.data;
    next();
  };
}
