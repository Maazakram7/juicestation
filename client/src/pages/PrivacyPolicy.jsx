import { motion } from 'framer-motion';
import Seo from '../components/Seo';

export default function PrivacyPolicy() {
  return (
    <div className="pt-32 md:pt-40 pb-24">
      <Seo
        title="Privacy Policy"
        description="How JUICEeSTATION collects, uses and protects your personal data."
        path="/privacy"
      />
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-faint mb-4">Privacy Policy</p>
          <h1 className="font-display text-4xl md:text-6xl leading-[0.95] tracking-tight mb-4">
            Your data, simply.
          </h1>
          <p className="text-sm text-subtle mb-12">Last updated: April 2026</p>

          <div className="space-y-10 text-base leading-relaxed">
            <Section title="1. Who we are">
              <p>JUICEeSTATION is a sole-trader business operated from <strong>Princess Square, The Lexicon, Bracknell, RG12 1LS</strong>. For any questions about your data, contact us at <a href="mailto:hello@juiceestation.co.uk" className="text-brand-green-deep underline">hello@juiceestation.co.uk</a>.</p>
              <p>We are the data controller for any personal information you share with us. We comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>
            </Section>

            <Section title="2. What information we collect">
              <p>When you order from us or sign up for a subscription, we collect:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Your name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Delivery address and postcode</li>
                <li>Order history (what you ordered, when, and how much)</li>
                <li>Optional notes you provide with your order</li>
              </ul>
              <p>We do <strong>not</strong> store your card details. All payments are processed securely by Stripe, and only Stripe sees your full card information.</p>
            </Section>

            <Section title="3. Why we use your information">
              <p>We only use your data to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Process and deliver your orders</li>
                <li>Send order confirmations and delivery updates</li>
                <li>Manage your subscription if you have one</li>
                <li>Respond to your questions or feedback</li>
                <li>Keep records as required by UK tax law (orders kept for 6 years)</li>
              </ul>
              <p>We do not send marketing emails, and we do not sell or share your data with third parties for advertising.</p>
            </Section>

            <Section title="4. Who we share information with">
              <p>To run our service, we share data only with these trusted providers:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Stripe</strong> — to process online card payments. See <a href="https://stripe.com/gb/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-green-deep underline">stripe.com/gb/privacy</a>.</li>
                <li><strong>Resend</strong> — to send order confirmation and notification emails.</li>
                <li><strong>Supabase</strong> — to securely store order and customer information.</li>
              </ul>
              <p>All providers are GDPR-compliant and use industry-standard encryption.</p>
            </Section>

            <Section title="5. How long we keep your data">
              <p>Order records are kept for <strong>6 years</strong> as required by HMRC for tax purposes. After this, your information is deleted unless you have an active subscription.</p>
              <p>If you cancel your subscription and have no further orders, your account information will be deleted within 12 months.</p>
            </Section>

            <Section title="6. Your rights under UK GDPR">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Access</strong> the personal data we hold about you</li>
                <li><strong>Correct</strong> any data that is inaccurate</li>
                <li><strong>Delete</strong> your data (subject to our legal record-keeping obligations)</li>
                <li><strong>Object</strong> to how we use your data</li>
                <li><strong>Request a copy</strong> of your data in a portable format</li>
              </ul>
              <p>To exercise any of these rights, email <a href="mailto:hello@juiceestation.co.uk" className="text-brand-green-deep underline">hello@juiceestation.co.uk</a>. We will respond within 30 days. There is no fee for these requests.</p>
              <p>If you are unhappy with how we handle your data, you can complain to the Information Commissioner's Office at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-brand-green-deep underline">ico.org.uk</a>.</p>
            </Section>

            <Section title="7. Cookies and tracking">
              <p>We use only essential functional cookies that are required for our website to work properly. These cookies remember items in your shopping cart between visits.</p>
              <p>We do <strong>not</strong> use tracking cookies, advertising cookies, or third-party analytics. We do not track your behaviour across other websites.</p>
            </Section>

            <Section title="8. Security">
              <p>We take security seriously. All connections to our website use encrypted HTTPS, your personal data is stored securely with strict access controls, and we follow OWASP best practices to protect against common security threats.</p>
            </Section>

            <Section title="9. Changes to this policy">
              <p>If we update this policy, we will change the "Last updated" date at the top. For significant changes affecting your rights, we will email active customers.</p>
            </Section>

            <Section title="10. Contact us">
              <p>Questions about this policy or your data? Email <a href="mailto:hello@juiceestation.co.uk" className="text-brand-green-deep underline">hello@juiceestation.co.uk</a> or write to us at JUICEeSTATION, Princess Square, The Lexicon, Bracknell, RG12 1LS.</p>
            </Section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4">{title}</h2>
      <div className="space-y-4 opacity-80">{children}</div>
    </section>
  );
}
