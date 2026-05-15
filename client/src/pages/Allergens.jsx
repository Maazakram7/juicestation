import { motion } from 'framer-motion';

export default function Allergens() {
  return (
    <div className="pt-32 md:pt-40 pb-24">
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-faint mb-4">Allergen Information</p>
          <h1 className="font-display text-4xl md:text-6xl leading-[0.95] tracking-tight mb-4">
            Know what's in your juice.
          </h1>
          <p className="text-sm text-subtle mb-12">Last updated: April 2026</p>

          <div className="space-y-10 text-base leading-relaxed">
            <div role="alert" className="p-6 rounded-2xl bg-brand-melon/10 border border-brand-melon/30">
              <p className="text-sm font-medium text-brand-melon-deep">
                <span aria-hidden="true">⚠ </span>If you have a food allergy or intolerance, please read this page carefully before ordering. Your safety is your responsibility — we cannot be held liable if you order a juice containing an ingredient you are allergic to.
              </p>
            </div>

            <Section title="The 14 major allergens">
              <p>Under UK food law, businesses must declare the presence of these 14 allergens. If any of our juices contain one of these, it is listed in the ingredients on the menu and on this page.</p>
              <ol className="list-decimal pl-6 space-y-1 grid grid-cols-1 sm:grid-cols-2">
                <li>Celery</li>
                <li>Cereals containing gluten</li>
                <li>Crustaceans</li>
                <li>Eggs</li>
                <li>Fish</li>
                <li>Lupin</li>
                <li>Milk</li>
                <li>Molluscs</li>
                <li>Mustard</li>
                <li>Nuts (tree nuts)</li>
                <li>Peanuts</li>
                <li>Sesame seeds</li>
                <li>Soybeans</li>
                <li>Sulphur dioxide / sulphites</li>
              </ol>
            </Section>

            <Section title="Allergens in our juices">
              <p><strong>Most of our cold-pressed juices contain only fruit and vegetables.</strong> These are naturally free from the 14 major allergens listed above.</p>
              <p>However, certain juices and add-ons may contain:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Tree nuts</strong> — almond milk variants, certain "creamy" blends</li>
                <li><strong>Sesame</strong> — some specialty seed blends</li>
                <li><strong>Sulphites</strong> — naturally occurring in small amounts in certain fruits</li>
              </ul>
              <p>Specific allergen information for each juice is shown on the product page. If you are unsure or need details before ordering, email <a href="mailto:hello@juiceestation.co.uk" className="text-brand-green-deep underline">hello@juiceestation.co.uk</a> — we are happy to help.</p>
            </Section>

            <Section title="Cross-contamination">
              <p>Our juices are made in a kitchen that handles nuts, seeds, and other allergens. While we take precautions to keep equipment clean between batches, we cannot guarantee that our juices are completely free from cross-contamination with these ingredients.</p>
              <p><strong>If you have a severe allergy (such as anaphylaxis), please consider this before ordering.</strong></p>
            </Section>

            <Section title="Special requests">
              <p>If you would like us to make a juice without a specific ingredient, contact us <strong>before ordering</strong>. We will do our best to accommodate, but cannot guarantee the absence of trace allergens.</p>
            </Section>

            <Section title="In an emergency">
              <p>If you have an allergic reaction after consuming our juice:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>For severe reactions, call <strong>999</strong> immediately</li>
                <li>For non-emergency advice, call <strong>NHS 111</strong></li>
                <li>Notify us at <a href="mailto:hello@juiceestation.co.uk" className="text-brand-green-deep underline">hello@juiceestation.co.uk</a> so we can investigate and prevent it happening to others</li>
              </ul>
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
