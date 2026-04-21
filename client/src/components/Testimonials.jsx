import { motion } from 'framer-motion';

/**
 * Real Google reviews of JUICEeSTATION, Princess Square, Lexicon, Bracknell.
 * Pulled live from the business's Google Business Profile.
 * Light edits only for length; no wording changed.
 *
 * 5.0 ★ rating across 321+ reviews at time of build.
 */
const REVIEWS = [
  { text: 'Real proper juices, real friendly staff', name: 'Nathan Miles' },
  { text: 'Amazing smoothies! Super friendly.', name: 'Rhiannon Cripps' },
  { text: 'Amazing orange juice I got here', name: 'Frankie Classie' },
  { text: 'Delicious smoothie Ruby Green, great service. Would come again and highly recommend.', name: 'Claire Wootten' },
  { text: 'What a service, such a gem in Bracknell! Best fresh juice I had in a very long time. Thank you.', name: 'Sara Anna Czirjak' },
  { text: 'Incredibly friendly, amazing fresh juice!', name: 'Abdullah Chaudhry' },
  { text: 'The juices are freshly squeezed with well-balanced flavours, plus the owner is very friendly.', name: 'Tepeina Naikuni' },
  { text: 'Very friendly and nice service!', name: 'Ammara Qureshi' },
  { text: 'Great customer service. Juice is so yummy!', name: 'Jessica Elday' },
  { text: 'Amazing juice, great service and very friendly people! Recommend.', name: 'Mariusz Boszman' },
  { text: 'The best shake I\'ve ever had. The fruit is so fresh every day, and they even added a protein option now. Ideal if you just finished the gym and want a healthy drink with a good amount of protein.', name: 'Antoni Niedzwiecki' },
  { text: 'Amazing quality and such kind people.', name: 'Fin' },
  { text: 'Absolutely excellent service, very quick and amazing tasting drink. Would definitely go again.', name: 'HS' },
  { text: 'Workers are very nice and welcoming.', name: 'kunai' },
  { text: 'Amazing selection of fruit juices and protein shakes. Great service, the gentlemen here are awesome. Highly recommend.', name: 'Fe Gardener' },
  { text: 'AMAZING! Tastes amazing. The guys are wonderful and very kind. My fav stall in town and always coming back for more.', name: 'Kayleigh Morris' },
  { text: 'Absolutely amazing and tasty drinks. I got the Turmeric Power that made me feel revitalised and the Shake 2 with peanut butter and dates is sooo tasty. No nasty additives, just pure fruit and good stuff.', name: 'Shabana Khan' },
  { text: 'Quality produce and excellent service!', name: 'Jaganath Devarajan' },
  { text: 'I would highly recommend this company. We will revisit soon.', name: 'Hannah G' },
  { text: 'Brings me joy to drink some fresh fruit juices blended in front of me instead of buying a sugary bottled drink. Would recommend the ABC, Apple Party and Paradise!', name: 'Lisa Adams' },
  { text: 'Great selection of juices and smoothies. Served with a smile and warmth. Will be back! Prefer this to all the other drinks places in the area.', name: 'Joanna' },
  { text: 'Super friendly staff, took the time to explain the menu and talk us through options. Got the Detox and Summer Set, really good drinks. Will definitely be back!', name: 'Yasmin Jordan' },
  { text: 'Very good smoothie, very nice people and amazing service! Recommend.', name: 'Daniel Oprea' },
  { text: 'Amazing seasonal drink and worth every bit. The taste was refreshing and high quality. I would definitely recommend it.', name: 'Raja Rizwan' },
];

// Split into two rows that scroll in opposite directions, Oryzo-style
const ROW_1 = REVIEWS.slice(0, 12);
const ROW_2 = REVIEWS.slice(12);

function ReviewCard({ r }) {
  return (
    <figure className="flex-shrink-0 w-[82vw] sm:w-[440px] md:w-[500px] mx-3 md:mx-4 px-7 md:px-8 py-7 md:py-8 rounded-[24px] bg-white border border-black/[0.06]">
      <div className="flex items-center gap-0.5 mb-4" aria-label="5 star rating">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#F39324">
            <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.2L2 10l7.1-1.1L12 2z" />
          </svg>
        ))}
      </div>
      <blockquote className="font-display text-lg md:text-xl leading-snug tracking-tight mb-5 line-clamp-4">
        "{r.text}"
      </blockquote>
      <figcaption className="flex items-center justify-between text-sm">
        <cite className="not-italic font-medium">{r.name}</cite>
        <span className="opacity-40 text-[11px] uppercase tracking-wider">Google review</span>
      </figcaption>
    </figure>
  );
}

// One infinite-scrolling row. Uses CSS keyframes so JS doesn't thrash.
function MarqueeRow({ items, reverse = false, duration = 80 }) {
  const doubled = [...items, ...items]; // duplicate for seamless loop
  const animClass = reverse ? 'animate-marquee-reverse' : 'animate-marquee-forward';

  return (
    <div className="overflow-hidden" role="region">
      <div
        className={`flex w-max ${animClass}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((r, i) => (
          <ReviewCard key={i} r={r} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="relative pt-8 md:pt-12 pb-24 md:pb-32 bg-brand-cream overflow-hidden">
      {/* Heading */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-10 md:mb-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] opacity-50 mb-4">Loved locally</p>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl leading-[0.95] tracking-tight">
              321+ reviews.
              <br />
              Every single <em>five stars.</em>
            </h2>
          </div>
          <a
            href="https://www.google.com/maps/place/?q=place_id:ChIJIWr1WAB1dkgRzlYc2_8nI6w"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost shrink-0"
          >
            Read them all →
          </a>
        </motion.div>
      </div>

      {/* Two rows, opposite directions */}
      <div className="relative space-y-4 md:space-y-6">
        {/* Fade edges */}
        <div
          className="absolute inset-y-0 left-0 w-16 md:w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, var(--edge-fade, #FAF7F1), transparent)' }}
        />
        <div
          className="absolute inset-y-0 right-0 w-16 md:w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--edge-fade, #FAF7F1), transparent)' }}
        />

        <MarqueeRow items={ROW_1} duration={90} />
        <MarqueeRow items={ROW_2} reverse duration={110} />
      </div>

      {/* Animation keyframes — scoped inline, not in Tailwind config */}
      <style>{`
        :root { --edge-fade: #FAF7F1; }
        .dark { --edge-fade: #1B1B1B; }
        @keyframes marquee-forward {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .animate-marquee-forward { animation: marquee-forward linear infinite; }
        .animate-marquee-reverse { animation: marquee-reverse linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee-forward, .animate-marquee-reverse { animation: none; }
        }
        /* Line-clamp utility (Tailwind v3 has it but just in case) */
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
