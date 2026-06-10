import { motion } from 'framer-motion';
import Seo from '../components/Seo';

export default function TermsOfService() {
  return (
    <div className="pt-32 md:pt-40 pb-24">
      <Seo
        title="Terms of Service"
        description="The terms that apply when you order from or use the JUICEeSTATION website."
        path="/terms"
      />
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-faint mb-4">Terms of Service</p>
          <h1 className="font-display text-4xl md:text-6xl leading-[0.95] tracking-tight mb-4">
            The fine print, in plain English.
          </h1>
          <p className="text-sm text-subtle mb-12">Last updated: April 2026</p>

          <div className="space-y-10 text-base leading-relaxed">
            <Section title="1. About us">
              <p>JUICEeSTATION is a sole-trader business making and delivering cold-pressed juices. We trade from Princess Square, The Lexicon, Bracknell, RG12 1LS. By using our website or placing an order, you agree to these terms.</p>
            </Section>

            <Section title="2. Our products">
              <p>We make cold-pressed juices using fresh fruit and raw vegetables. No water, no sugar, no preservatives. All juices are perishable and must be consumed within <strong>3 days</strong> of pressing. Keep refrigerated.</p>
              <p>Photos and descriptions on our website show what to expect, but actual products may vary slightly in colour or appearance due to the natural ingredients used.</p>
            </Section>

            <Section title="3. Allergens">
              <p>Our juices are made in a kitchen that handles nuts, seeds, and other allergens. If you have a food allergy or intolerance, please review our <a href="/allergens" className="text-brand-green-deep underline">Allergen Information</a> page before ordering. By placing an order, you confirm that you have checked the ingredients for any allergens that may affect you.</p>
            </Section>

            <Section title="4. Pricing and payment">
              <p>All prices are listed in British Pounds (GBP) and include any applicable VAT. We accept payment by:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Card (Visa, Mastercard, American Express) via Stripe</li>
                <li>Apple Pay and Google Pay via Stripe</li>
                <li>Cash on delivery (paid to driver in UK pounds)</li>
              </ul>
              <p>Card payments are processed securely by Stripe. We never see or store your card details.</p>
            </Section>

            <Section title="5. Minimum order and delivery">
              <p>The minimum order for delivery is <strong>£25</strong>. Orders below this amount cannot be processed.</p>
              <p>We deliver to <strong>RG12, RG40, and RG42</strong> postcodes (Bracknell, Wokingham, and surrounding areas). Extended delivery zones may be available — contact us before ordering to check.</p>
              <p>Delivery times are estimates, not guarantees. Most orders are delivered within <strong>24 hours</strong> of placing them. Subscription orders are delivered every Monday morning unless otherwise agreed.</p>
            </Section>

            <Section title="6. Subscriptions">
              <p>When you subscribe, you agree to receive a regular weekly delivery at the price listed for your tier. After your initial signup, we will contact you within 24 hours to confirm details and arrange billing.</p>
              <p>You can pause, skip, or cancel your subscription at any time by emailing <a href="mailto:hello@juiceestation.co.uk" className="text-brand-green-deep underline">hello@juiceestation.co.uk</a>. Cancellations made at least 48 hours before your next delivery date will not be charged. There are no cancellation fees.</p>
            </Section>

            <Section title="7. Refunds and cancellations">
              <p>Because our juices are fresh perishable food, your statutory right of cancellation under the Consumer Contracts Regulations does not apply once juices have been pressed. However, we want you to be happy with your order:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Cancellation before pressing:</strong> Full refund if you cancel at least 24 hours before delivery.</li>
                <li><strong>Damaged or wrong items:</strong> Full refund or replacement. Contact us within 24 hours of delivery with a photo.</li>
                <li><strong>Not delivered:</strong> Full refund if we fail to deliver as agreed.</li>
                <li><strong>Change of mind after pressing:</strong> Unfortunately, we cannot refund fresh juice that has been pressed.</li>
              </ul>
              <p>Refunds are processed back to your original payment method within 5–10 business days.</p>
            </Section>

            <Section title="8. Our liability">
              <p>We take great care to ensure our products are safe and fresh. If something goes wrong because of our negligence, we will be liable for foreseeable losses up to the value of your order.</p>
              <p>We are not liable for losses caused by reasons outside our control (e.g. severe weather affecting deliveries) or for losses you could have avoided by following our instructions (e.g. consuming juice past the use-by date).</p>
              <p>Nothing in these terms limits your statutory rights as a consumer or excludes liability for death, personal injury, or fraud.</p>
            </Section>

            <Section title="9. Your account">
              <p>You are responsible for keeping your login credentials secure. Notify us immediately if you suspect unauthorised access to your account.</p>
              <p>We may refuse service or cancel orders if we suspect fraudulent activity, abusive behaviour, or violation of these terms.</p>
            </Section>

            <Section title="10. Privacy">
              <p>Your personal data is handled in accordance with our <a href="/privacy" className="text-brand-green-deep underline">Privacy Policy</a>.</p>
            </Section>

            <Section title="11. Governing law">
              <p>These terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
            </Section>

            <Section title="12. Changes to these terms">
              <p>We may update these terms from time to time. Significant changes will be communicated by email to active customers. Continued use of our website after changes are posted constitutes acceptance of the new terms.</p>
            </Section>

            <Section title="13. Contact">
              <p>Questions about these terms? Email <a href="mailto:hello@juiceestation.co.uk" className="text-brand-green-deep underline">hello@juiceestation.co.uk</a> or write to JUICEeSTATION, Princess Square, The Lexicon, Bracknell, RG12 1LS.</p>
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
