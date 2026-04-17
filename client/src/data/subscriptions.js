// Subscription plans for JUICEeSTATION weekly delivery service.
// All prices in GBP per week. Delivery is free for subscribers
// within the eligible postcode radius.

export const DELIVERY_POSTCODES = {
  // Phase 1 — tight density around Bracknell. Widen later.
  primary: ['RG12', 'RG40', 'RG42'],
  // Nearby but lower priority — handled with a longer lead time
  extended: ['RG41', 'RG45', 'GU17', 'GU47', 'SL4', 'SL5'],
};

export const ONE_OFF_DELIVERY_FEE = 3.99;
export const ONE_OFF_MIN_ORDER = 25.00;

export const SUBSCRIPTION_TIERS = [
  {
    id: 'weekly-litre',
    name: 'Weekly Litre',
    tagline: 'Your weekly top-up',
    pricePerWeek: 22,
    walkUpValue: 25,
    savings: 3,
    contents: [
      { label: '1L bottle', qty: 1, note: 'Customer\'s choice from any juice' },
    ],
    description: "One 1-litre bottle delivered every Monday. You pick the flavour. It lasts the week. Simple.",
    bestFor: 'One person, daily sipper',
    featured: false,
  },
  {
    id: 'big-bottle-plus',
    name: 'Big Bottle Plus',
    tagline: 'Hero tier. Best variety.',
    pricePerWeek: 40,
    walkUpValue: 44.50,
    savings: 4.50,
    contents: [
      { label: '1L bottle', qty: 1, note: 'For slow sipping at home' },
      { label: '330ml bottles', qty: 3, note: 'Three grab-and-gos, mixed flavours' },
    ],
    description: 'One big bottle for home, three smaller bottles to grab on the way out. Different juices for different moments.',
    bestFor: 'Busy weekdays + weekend wind-down',
    featured: true,
  },
  {
    id: 'household-litres',
    name: 'Household Litres',
    tagline: 'Enough for two',
    pricePerWeek: 40,
    walkUpValue: 50,
    savings: 10,
    contents: [
      { label: '1L bottles', qty: 2, note: 'Mix two different flavours or double up' },
    ],
    description: 'Two 1-litre bottles per week. For couples, families, or anyone who shares a fridge.',
    bestFor: 'Couples, families, shared households',
    featured: false,
  },
];

export const SUBSCRIPTION_BENEFITS = [
  { label: 'Free delivery', body: 'Every Monday, RG12 · RG40 · RG42. We press Sunday, deliver first thing.' },
  { label: 'Swap any week', body: 'Pick your juices from our full menu, change them weekly. Not locked in.' },
  { label: 'Pause or cancel anytime', body: 'Going on holiday? Skip a week. Not for you? One-click cancel. No fees.' },
  { label: 'Priority access', body: 'New juices and seasonal specials reach subscribers first.' },
];
