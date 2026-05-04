import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const fromAddress = process.env.EMAIL_FROM || 'JUICEeSTATION <onboarding@resend.dev>';
const ownerEmail = process.env.OWNER_EMAIL;

export const resend = apiKey ? new Resend(apiKey) : null;

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatItems(items) {
  return items
    .map((it) => {
      const meta = it.meta ? ` (${it.meta})` : '';
      return `<li style="margin:6px 0;color:#1B1B1B;list-style:none;padding-left:0;"><strong>${escapeHtml(it.name)}</strong>${escapeHtml(meta)} <span style="color:#7A7A7A;">&mdash; ${it.qty} &times; £${Number(it.price).toFixed(2)}</span></li>`;
    })
    .join('');
}

// ============== ORDER CUSTOMER CONFIRMATION ==============
export async function sendCustomerConfirmation(order) {
  if (!resend) {
    console.warn('[mailer] Resend not configured; skipping customer email');
    return;
  }

  const html = `<!DOCTYPE html><html><body style="font-family:-apple-system,Helvetica,Arial,sans-serif;background:#FBF8F1;margin:0;padding:0;"><div style="max-width:560px;margin:0 auto;padding:40px 24px;"><div style="text-align:center;margin-bottom:32px;"><h1 style="font-size:32px;font-weight:600;color:#1B1B1B;margin:0;letter-spacing:-0.02em;">Thank you, ${escapeHtml(order.customer_name)}.</h1><p style="color:#7A7A7A;margin-top:8px;font-size:15px;">${order.is_cod ? 'Order placed. Pay £' + Number(order.total).toFixed(2) + ' in cash when we deliver.' : 'Your order is confirmed. We will press it fresh.'}</p></div><div style="background:#fff;border:1px solid #E5E5E5;border-radius:16px;padding:24px;margin-bottom:24px;"><p style="margin:0 0 4px 0;font-size:11px;letter-spacing:2px;color:#5A9A2E;text-transform:uppercase;font-weight:600;">Order ID</p><p style="margin:0;font-family:monospace;font-size:22px;font-weight:600;color:#1B1B1B;">${escapeHtml(order.order_id)}</p></div><div style="background:#fff;border:1px solid #E5E5E5;border-radius:16px;padding:24px;margin-bottom:24px;"><p style="margin:0 0 12px 0;font-size:11px;letter-spacing:2px;color:#7A7A7A;text-transform:uppercase;font-weight:600;">Your order</p><ul style="list-style:none;padding:0;margin:0;">${formatItems(order.items)}</ul><div style="border-top:1px solid #E5E5E5;margin-top:16px;padding-top:16px;display:flex;justify-content:space-between;"><span style="color:#7A7A7A;font-size:14px;">Total</span><strong style="font-size:20px;color:#1B1B1B;">£${Number(order.total).toFixed(2)}</strong></div></div><div style="background:#fff;border:1px solid #E5E5E5;border-radius:16px;padding:24px;margin-bottom:24px;"><p style="margin:0 0 12px 0;font-size:11px;letter-spacing:2px;color:#7A7A7A;text-transform:uppercase;font-weight:600;">Delivery to</p><p style="margin:0;line-height:1.6;color:#1B1B1B;">${escapeHtml(order.delivery_address).replace(/\n/g, '<br>')}</p>${order.notes ? `<p style="margin:12px 0 0 0;color:#7A7A7A;font-size:14px;font-style:italic;">"${escapeHtml(order.notes)}"</p>` : ''}</div><p style="text-align:center;color:#7A7A7A;font-size:14px;line-height:1.6;margin-top:32px;">Questions? Reply to this email or call us.<br><strong style="color:#1B1B1B;">JUICEeSTATION</strong> &middot; Bracknell, Berkshire</p></div></body></html>`;

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: order.customer_email,
      subject: `Order confirmed: ${order.order_id}`,
      html,
    });
    if (error) {
      console.error('[mailer] customer email error:', error);
    } else {
      console.log(`[mailer] customer email sent to ${order.customer_email} (${data?.id})`);
    }
  } catch (err) {
    console.error('[mailer] customer email exception:', err);
  }
}

// ============== ORDER OWNER NOTIFICATION ==============
export async function sendOwnerNotification(order) {
  if (!resend || !ownerEmail) {
    console.warn('[mailer] Resend or OWNER_EMAIL not set; skipping owner email');
    return;
  }

  const itemCount = order.items.reduce((sum, it) => sum + (it.qty || 1), 0);

  const html = `<!DOCTYPE html><html><body style="font-family:-apple-system,Helvetica,Arial,sans-serif;background:#FBF8F1;margin:0;padding:0;"><div style="max-width:560px;margin:0 auto;padding:40px 24px;"><div style="background:#5A9A2E;color:#fff;padding:20px 24px;border-radius:16px 16px 0 0;"><p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;opacity:0.8;">${order.is_cod ? 'New COD order — collect cash' : 'New order'}</p><h1 style="margin:4px 0 0 0;font-size:26px;font-weight:600;">£${Number(order.total).toFixed(2)} &middot; ${itemCount} ${itemCount === 1 ? 'item' : 'items'}</h1></div><div style="background:#fff;border:1px solid #E5E5E5;border-top:none;border-radius:0 0 16px 16px;padding:24px;"><p style="margin:0 0 4px 0;font-size:11px;letter-spacing:2px;color:#7A7A7A;text-transform:uppercase;font-weight:600;">Order</p><p style="margin:0 0 16px 0;font-family:monospace;font-size:18px;font-weight:600;">${escapeHtml(order.order_id)}</p><p style="margin:16px 0 4px 0;font-size:11px;letter-spacing:2px;color:#7A7A7A;text-transform:uppercase;font-weight:600;">Customer</p><p style="margin:0;font-size:16px;color:#1B1B1B;"><strong>${escapeHtml(order.customer_name)}</strong></p><p style="margin:2px 0;font-size:14px;color:#7A7A7A;">${escapeHtml(order.customer_email)}</p>${order.customer_phone ? `<p style="margin:2px 0;font-size:14px;color:#7A7A7A;">${escapeHtml(order.customer_phone)}</p>` : ''}<p style="margin:16px 0 4px 0;font-size:11px;letter-spacing:2px;color:#7A7A7A;text-transform:uppercase;font-weight:600;">Items</p><ul style="list-style:none;padding:0;margin:0;">${formatItems(order.items)}</ul><p style="margin:16px 0 4px 0;font-size:11px;letter-spacing:2px;color:#7A7A7A;text-transform:uppercase;font-weight:600;">Deliver to</p><p style="margin:0;line-height:1.6;color:#1B1B1B;">${escapeHtml(order.delivery_address).replace(/\n/g, '<br>')}</p>${order.notes ? `<p style="margin:12px 0 0 0;color:#1B1B1B;font-size:14px;font-style:italic;background:#F4F9EC;padding:10px 14px;border-radius:8px;">"${escapeHtml(order.notes)}"</p>` : ''}</div></div></body></html>`;

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: ownerEmail,
      subject: `New order ${order.order_id} - ${order.customer_name} - £${Number(order.total).toFixed(2)}`,
      html,
    });
    if (error) {
      console.error('[mailer] owner email error:', error);
    } else {
      console.log(`[mailer] owner email sent to ${ownerEmail} (${data?.id})`);
    }
  } catch (err) {
    console.error('[mailer] owner email exception:', err);
  }
}

// ============== SUBSCRIPTION CUSTOMER ACK ==============
export async function sendSubscriptionCustomerAck(subscription) {
  if (!resend) {
    console.warn('[mailer] Resend not configured; skipping subscription customer email');
    return;
  }

  const html = `<!DOCTYPE html><html><body style="font-family:-apple-system,Helvetica,Arial,sans-serif;background:#FBF8F1;margin:0;padding:0;"><div style="max-width:560px;margin:0 auto;padding:40px 24px;"><div style="text-align:center;margin-bottom:32px;"><h1 style="font-size:32px;font-weight:600;color:#1B1B1B;margin:0;letter-spacing:-0.02em;">We got your subscription request, ${escapeHtml(subscription.customer_name)}.</h1><p style="color:#7A7A7A;margin-top:8px;font-size:15px;">We will be in touch within 24 hours.</p></div><div style="background:#fff;border:1px solid #E5E5E5;border-radius:16px;padding:24px;margin-bottom:24px;"><p style="margin:0 0 4px 0;font-size:11px;letter-spacing:2px;color:#5A9A2E;text-transform:uppercase;font-weight:600;">Your reference</p><p style="margin:0 0 16px 0;font-family:monospace;font-size:22px;font-weight:600;color:#1B1B1B;">${escapeHtml(subscription.subscription_id)}</p><p style="margin:0 0 4px 0;font-size:11px;letter-spacing:2px;color:#7A7A7A;text-transform:uppercase;font-weight:600;">Plan</p><p style="margin:0 0 16px 0;font-size:18px;font-weight:600;color:#1B1B1B;">${escapeHtml(subscription.tier_name)} &mdash; £${Number(subscription.price_per_week).toFixed(2)}/week</p><p style="margin:0 0 4px 0;font-size:11px;letter-spacing:2px;color:#7A7A7A;text-transform:uppercase;font-weight:600;">Delivery to</p><p style="margin:0;line-height:1.6;color:#1B1B1B;">${escapeHtml(subscription.delivery_address).replace(/\n/g, '<br>')}</p></div><div style="background:#F4F9EC;border-radius:16px;padding:20px 24px;margin-bottom:24px;"><p style="margin:0;color:#1B1B1B;font-size:14px;line-height:1.7;"><strong>What happens next?</strong><br>Within 24 hours we will email you to confirm your delivery details and set up secure billing. Your first delivery will be the Monday after we confirm.</p></div><p style="text-align:center;color:#7A7A7A;font-size:14px;line-height:1.6;margin-top:32px;">Questions? Just reply to this email.<br><strong style="color:#1B1B1B;">JUICEeSTATION</strong> &middot; Bracknell, Berkshire</p></div></body></html>`;

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: subscription.customer_email,
      subject: `Subscription request received: ${subscription.subscription_id}`,
      html,
    });
    if (error) {
      console.error('[mailer] subscription customer email error:', error);
    } else {
      console.log(`[mailer] subscription customer email sent to ${subscription.customer_email} (${data?.id})`);
    }
  } catch (err) {
    console.error('[mailer] subscription customer email exception:', err);
  }
}

// ============== SUBSCRIPTION OWNER NOTIFICATION ==============
export async function sendSubscriptionOwnerNotification(subscription) {
  if (!resend || !ownerEmail) {
    console.warn('[mailer] Resend or OWNER_EMAIL not set; skipping subscription owner email');
    return;
  }

  const html = `<!DOCTYPE html><html><body style="font-family:-apple-system,Helvetica,Arial,sans-serif;background:#FBF8F1;margin:0;padding:0;"><div style="max-width:560px;margin:0 auto;padding:40px 24px;"><div style="background:#5A9A2E;color:#fff;padding:20px 24px;border-radius:16px 16px 0 0;"><p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;opacity:0.8;">New subscription request</p><h1 style="margin:4px 0 0 0;font-size:24px;font-weight:600;">${escapeHtml(subscription.tier_name)} &mdash; £${Number(subscription.price_per_week).toFixed(2)}/week</h1></div><div style="background:#fff;border:1px solid #E5E5E5;border-top:none;border-radius:0 0 16px 16px;padding:24px;"><p style="margin:0 0 4px 0;font-size:11px;letter-spacing:2px;color:#7A7A7A;text-transform:uppercase;font-weight:600;">Reference</p><p style="margin:0 0 16px 0;font-family:monospace;font-size:18px;font-weight:600;">${escapeHtml(subscription.subscription_id)}</p><p style="margin:16px 0 4px 0;font-size:11px;letter-spacing:2px;color:#7A7A7A;text-transform:uppercase;font-weight:600;">Customer</p><p style="margin:0;font-size:16px;color:#1B1B1B;"><strong>${escapeHtml(subscription.customer_name)}</strong></p><p style="margin:2px 0;font-size:14px;color:#7A7A7A;">${escapeHtml(subscription.customer_email)}</p>${subscription.customer_phone ? `<p style="margin:2px 0;font-size:14px;color:#7A7A7A;">${escapeHtml(subscription.customer_phone)}</p>` : ''}<p style="margin:16px 0 4px 0;font-size:11px;letter-spacing:2px;color:#7A7A7A;text-transform:uppercase;font-weight:600;">Postcode</p><p style="margin:0;font-size:16px;color:#1B1B1B;">${escapeHtml(subscription.delivery_postcode)}</p><p style="margin:16px 0 4px 0;font-size:11px;letter-spacing:2px;color:#7A7A7A;text-transform:uppercase;font-weight:600;">Address</p><p style="margin:0;line-height:1.6;color:#1B1B1B;">${escapeHtml(subscription.delivery_address).replace(/\n/g, '<br>')}</p>${subscription.juice_preference ? `<p style="margin:16px 0 4px 0;font-size:11px;letter-spacing:2px;color:#7A7A7A;text-transform:uppercase;font-weight:600;">Juice preference</p><p style="margin:0;color:#1B1B1B;">${escapeHtml(subscription.juice_preference)}</p>` : ''}${subscription.preferred_start_date ? `<p style="margin:16px 0 4px 0;font-size:11px;letter-spacing:2px;color:#7A7A7A;text-transform:uppercase;font-weight:600;">Preferred start</p><p style="margin:0;color:#1B1B1B;">${escapeHtml(subscription.preferred_start_date)}</p>` : ''}${subscription.notes ? `<p style="margin:16px 0 4px 0;font-size:11px;letter-spacing:2px;color:#7A7A7A;text-transform:uppercase;font-weight:600;">Notes</p><p style="margin:12px 0 0 0;color:#1B1B1B;font-size:14px;font-style:italic;background:#F4F9EC;padding:10px 14px;border-radius:8px;">"${escapeHtml(subscription.notes)}"</p>` : ''}<p style="margin:24px 0 0 0;font-size:13px;color:#7A7A7A;font-style:italic;border-top:1px solid #E5E5E5;padding-top:16px;">Reply to customer within 24h to confirm delivery details and set up billing.</p></div></div></body></html>`;

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: ownerEmail,
      subject: `New subscription: ${subscription.tier_name} - ${subscription.customer_name} - £${Number(subscription.price_per_week).toFixed(2)}/wk`,
      html,
    });
    if (error) {
      console.error('[mailer] subscription owner email error:', error);
    } else {
      console.log(`[mailer] subscription owner email sent to ${ownerEmail} (${data?.id})`);
    }
  } catch (err) {
    console.error('[mailer] subscription owner email exception:', err);
  }
}
