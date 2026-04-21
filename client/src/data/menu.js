// Full JUICEeSTATION menu, transcribed from the menu board.
// Prices in GBP. Size pricing: S/M/L varies by category.
// Used by Menu page, JuiceCard components, and the Express API.

const VEGGIE_SIZES = { S: 5, M: 6, L: 7 };
const STANDARD_SIZES = { S: 5, M: 6, L: 7 };
const SINGLE_SIZES = { S: 4, M: 5, L: 6 };
const PROTEIN_SIZES = { S: 7, M: 8, L: 9 };

export const VEGGIE_JUICES = [
  { id: 'red-rush',      name: 'Red Rush',      tagline: 'Root-deep energy',                ingredients: ['carrot', 'beetroot', 'apple', 'ginger', 'lemon'],              sizes: VEGGIE_SIZES, gradient: 'from-[#E94E4E] to-[#8B1E3F]', accent: '#E94E4E', signature: true },
  { id: 'slim-grin',     name: 'Slim Grin',     tagline: 'Green and unrepentant',           ingredients: ['kale', 'spinach', 'celery', 'apple', 'lemon'],                 sizes: VEGGIE_SIZES, gradient: 'from-[#5A9A2E] to-[#2C5E1A]', accent: '#5A9A2E', signature: true },
  { id: 'purple-power',  name: 'Purple Power',  tagline: 'Beet. Watermelon. Joy.',          ingredients: ['beetroot', 'carrot', 'watermelon'],                            sizes: VEGGIE_SIZES, gradient: 'from-[#8B1E3F] to-[#E94E4E]', accent: '#8B1E3F' },
  { id: 'ruby-green',    name: 'Ruby Green',    tagline: 'Bitter citrus, grounded earth',   ingredients: ['grapefruit', 'carrot', 'celery', 'beetroot', 'ginger'],        sizes: VEGGIE_SIZES, gradient: 'from-[#C24266] to-[#5A9A2E]', accent: '#C24266' },
  { id: 'super-veg',     name: 'Super Veg',     tagline: 'Everything the garden gave us',   ingredients: ['orange', 'beetroot', 'carrot', 'ginger'],                      sizes: VEGGIE_SIZES, gradient: 'from-[#F39324] to-[#C24266]', accent: '#F39324' },
  { id: 'green-juice',   name: 'Green Juice',   tagline: 'Crisp. Cold. Quiet.',             ingredients: ['cucumber', 'kale', 'celery', 'lime'],                          sizes: VEGGIE_SIZES, gradient: 'from-[#7DC242] to-[#2C5E1A]', accent: '#7DC242' },
  { id: 'abc',           name: 'ABC',           tagline: "Three. That's it.",               ingredients: ['apple', 'beetroot', 'carrot'],                                 sizes: VEGGIE_SIZES, gradient: 'from-[#D14343] to-[#F39324]', accent: '#D14343', signature: true },
  { id: 'orange-detox',  name: 'Orange Detox',  tagline: 'Bright, sharp, clean',            ingredients: ['orange', 'carrot', 'ginger', 'lemon'],                         sizes: VEGGIE_SIZES, gradient: 'from-[#F39324] to-[#E94E4E]', accent: '#F39324' },
  { id: 'minty-mix',     name: 'Minty Mix',     tagline: 'A breath of fresh field',         ingredients: ['mint', 'spinach', 'celery', 'apple'],                          sizes: VEGGIE_SIZES, gradient: 'from-[#7DC242] to-[#5A9A2E]', accent: '#7DC242' },
];

export const FRESH_JUICES = [
  { id: 'turmeric-power',name: 'Turmeric Power',tagline: 'Golden, warming, defiant',        ingredients: ['turmeric', 'black pepper', 'orange', 'ginger', 'carrot'],      sizes: STANDARD_SIZES, gradient: 'from-[#D4941A] to-[#8B4513]', accent: '#D4941A', isNew: true },
  { id: 'feel-good',     name: 'Feel Good',     tagline: 'Sunshine in a bottle',            ingredients: ['mango', 'watermelon', 'strawberry', 'passionfruit'],           sizes: STANDARD_SIZES, gradient: 'from-[#F39324] to-[#E94E4E]', accent: '#F39324', signature: true },
  { id: 'acai-berry',    name: 'Acai Berry',    tagline: 'Deep, nutty, delicious',          ingredients: ['acai berry', 'apple', 'banana', 'hazelnut'],                   sizes: STANDARD_SIZES, gradient: 'from-[#4A2B5C] to-[#2C1936]', accent: '#4A2B5C' },
  { id: 'mango-flair',   name: 'Mango Flair',   tagline: 'Tropical, triple-threat',         ingredients: ['mango', 'pineapple', 'orange'],                                sizes: STANDARD_SIZES, gradient: 'from-[#F4D03F] to-[#F39324]', accent: '#F4D03F' },
  { id: 'citrus-mix',    name: 'Citrus Mix',    tagline: 'Three-way citrus',                ingredients: ['orange', 'grapefruit', 'lemon'],                               sizes: STANDARD_SIZES, gradient: 'from-[#F4D03F] to-[#E94E4E]', accent: '#F4D03F' },
  { id: 'detox',         name: 'Detox',         tagline: 'Morning reset',                   ingredients: ['orange', 'apple', 'ginger', 'lemon'],                          sizes: STANDARD_SIZES, gradient: 'from-[#F39324] to-[#7DC242]', accent: '#F39324' },
  { id: 'paradise',      name: 'Paradise',      tagline: 'A pink-sand afternoon',           ingredients: ['strawberry', 'banana', 'guava'],                               sizes: STANDARD_SIZES, gradient: 'from-[#FF6B9D] to-[#E94E4E]', accent: '#FF6B9D' },
  { id: 'apple-party',   name: 'Apple Party',   tagline: 'Crisp on crisp on crisp',         ingredients: ['apple', 'pineapple', 'orange'],                                sizes: STANDARD_SIZES, gradient: 'from-[#A4DE7F] to-[#F4D03F]', accent: '#A4DE7F' },
  { id: 'beet-orange',   name: 'Beet Orange',   tagline: 'Earth meets sun',                 ingredients: ['orange', 'beetroot', 'carrot'],                                sizes: STANDARD_SIZES, gradient: 'from-[#8B1E3F] to-[#F39324]', accent: '#8B1E3F' },
  { id: 'berry-treasure',name: 'Berry Treasure',tagline: 'Buried-fruit riches',             ingredients: ['mixed berries', 'apple', 'mango', 'banana'],                   sizes: STANDARD_SIZES, gradient: 'from-[#8B1E3F] to-[#4A2B5C]', accent: '#8B1E3F' },
  { id: 'easy-tropical', name: 'Easy Tropical', tagline: 'Sandals-optional',                ingredients: ['pineapple', 'mango', 'banana', 'apple'],                       sizes: STANDARD_SIZES, gradient: 'from-[#F4D03F] to-[#7DC242]', accent: '#F4D03F' },
];

export const SMOOTHIES = [
  { id: 'acai-mix',      name: 'Acai Mix',      tagline: 'Deep purple breakfast',           ingredients: ['acai berry', 'banana', 'milk', 'yoghurt', 'honey'],            sizes: STANDARD_SIZES, gradient: 'from-[#4A2B5C] to-[#2C1936]', accent: '#4A2B5C', signature: true },
  { id: 'nutty-banana',  name: 'Nutty Banana',  tagline: 'Almond hug',                      ingredients: ['banana', 'almonds', 'milk', 'yoghurt', 'honey'],               sizes: STANDARD_SIZES, gradient: 'from-[#C8A04A] to-[#8B6914]', accent: '#C8A04A' },
  { id: 'oats-smoothie', name: 'Oats Smoothie', tagline: 'A hug for breakfast',             ingredients: ['oats', 'banana', 'hazelnut', 'peanut butter', 'cocoa powder', 'yoghurt', 'milk', 'honey'], sizes: STANDARD_SIZES, gradient: 'from-[#8B6914] to-[#4A3319]', accent: '#8B6914', kidsFavourite: true },
  { id: 'havana',        name: 'Havana',        tagline: 'Mango-banana cream',              ingredients: ['mango', 'banana', 'milk', 'yoghurt', 'honey'],                 sizes: STANDARD_SIZES, gradient: 'from-[#F4D03F] to-[#F39324]', accent: '#F4D03F' },
  { id: 'blubana',       name: 'Blubana',       tagline: 'Blue skies, banana base',         ingredients: ['blueberries', 'banana', 'milk', 'yoghurt', 'honey'],           sizes: STANDARD_SIZES, gradient: 'from-[#4A5FB7] to-[#2C3A7A]', accent: '#4A5FB7' },
  { id: 'triple-berry',  name: 'Triple Berry',  tagline: 'Three berries, no arguments',     ingredients: ['mixed berries', 'milk', 'yoghurt', 'honey'],                   sizes: STANDARD_SIZES, gradient: 'from-[#E94E4E] to-[#8B1E3F]', accent: '#E94E4E', kidsFavourite: true },
  { id: 'summer-set',    name: 'Summer Set',    tagline: 'A holiday in a glass',            ingredients: ['strawberry', 'mango', 'milk', 'yoghurt', 'honey'],             sizes: STANDARD_SIZES, gradient: 'from-[#FF6B9D] to-[#F39324]', accent: '#FF6B9D' },
];

export const SINGLE_JUICES = [
  { id: 'single-carrot',     name: 'Carrot Juice',     tagline: 'Pure carrot',     ingredients: ['carrot'],     sizes: SINGLE_SIZES, gradient: 'from-[#F39324] to-[#C8702A]', accent: '#F39324' },
  { id: 'single-orange',     name: 'Orange Juice',     tagline: 'Pure orange',     ingredients: ['orange'],     sizes: SINGLE_SIZES, gradient: 'from-[#F39324] to-[#E94E4E]', accent: '#F39324' },
  { id: 'single-apple',      name: 'Apple Juice',      tagline: 'Pure apple',      ingredients: ['apple'],      sizes: SINGLE_SIZES, gradient: 'from-[#A4DE7F] to-[#5A9A2E]', accent: '#A4DE7F' },
  { id: 'single-watermelon', name: 'Watermelon Juice', tagline: 'Pure watermelon', ingredients: ['watermelon'], sizes: SINGLE_SIZES, gradient: 'from-[#FF6B9D] to-[#E94E4E]', accent: '#FF6B9D' },
  { id: 'single-cucumber',   name: 'Cucumber Juice',   tagline: 'Pure cucumber',   ingredients: ['cucumber'],   sizes: SINGLE_SIZES, gradient: 'from-[#7DC242] to-[#5A9A2E]', accent: '#7DC242' },
  { id: 'single-celery',     name: 'Celery Juice',     tagline: 'Pure celery',     ingredients: ['celery'],     sizes: SINGLE_SIZES, gradient: 'from-[#5A9A2E] to-[#2C5E1A]', accent: '#5A9A2E' },
];

export const PROTEIN_SHAKES = [
  { id: 'shake-1', name: 'Shake 1', tagline: 'Coconut-blueberry lift',    ingredients: ['fresh coconut water', 'blueberry', 'whey protein'],                                  sizes: PROTEIN_SIZES, gradient: 'from-[#4A5FB7] to-[#2C3A7A]', accent: '#4A5FB7' },
  { id: 'shake-2', name: 'Shake 2', tagline: 'Peanut-cocoa power',        ingredients: ['banana', 'dates', 'peanut butter', 'cocoa powder', 'honey', 'milk', 'whey protein'],  sizes: PROTEIN_SIZES, gradient: 'from-[#8B6914] to-[#4A3319]', accent: '#8B6914' },
  { id: 'shake-3', name: 'Shake 3', tagline: 'Strawberry-banana classic', ingredients: ['strawberry', 'banana', 'honey', 'milk', 'whey protein'],                              sizes: PROTEIN_SIZES, gradient: 'from-[#FF6B9D] to-[#E94E4E]', accent: '#FF6B9D' },
  { id: 'shake-4', name: 'Shake 4', tagline: 'Coconut-hazelnut recovery', ingredients: ['fresh coconut water', 'banana', 'hazelnut', 'whey protein'],                          sizes: PROTEIN_SIZES, gradient: 'from-[#F4D03F] to-[#C8A04A]', accent: '#F4D03F' },
  { id: 'shake-5', name: 'Shake 5', tagline: 'Oats, nuts, honey',         ingredients: ['banana', 'almonds', 'oats', 'honey', 'milk', 'whey protein'],                         sizes: PROTEIN_SIZES, gradient: 'from-[#C8A04A] to-[#8B6914]', accent: '#C8A04A' },
  { id: 'shake-6', name: 'Shake 6', tagline: 'Green, creamy, strong',     ingredients: ['avocado', 'almonds', 'milk', 'honey', 'whey protein'],                                sizes: PROTEIN_SIZES, gradient: 'from-[#5A9A2E] to-[#2C5E1A]', accent: '#5A9A2E' },
];

// Unified flat export — everything that can be added to cart.
// `price` is the medium size for display and as the cart default.
export const MENU = [...VEGGIE_JUICES, ...FRESH_JUICES, ...SMOOTHIES, ...SINGLE_JUICES, ...PROTEIN_SHAKES].map((item) => ({
  ...item,
  price: item.sizes.M,
}));

export const CATEGORIES = [
  { id: 'veggie',   label: 'Veggie Juices',        items: VEGGIE_JUICES,  subtitle: 'S £5 · M £6 · L £7' },
  { id: 'fresh',    label: 'Fresh Juices',         items: FRESH_JUICES,   subtitle: 'S £5 · M £6 · L £7' },
  { id: 'smoothie', label: 'Smoothies',            items: SMOOTHIES,      subtitle: 'S £5 · M £6 · L £7' },
  { id: 'single',   label: 'Single Juice Choice',  items: SINGLE_JUICES,  subtitle: 'S £4 · M £5 · L £6 · add ginger or lime for 50p' },
  { id: 'protein',  label: 'Protein Shakes',       items: PROTEIN_SHAKES, subtitle: 'S £7 · M £8 · L £9' },
];

// Make Your Own ingredients pool
export const INGREDIENTS = [
  { id: 'apple',        name: 'Apple',        price: 0.80, emoji: '🍎', color: '#E94E4E' },
  { id: 'carrot',       name: 'Carrot',       price: 0.70, emoji: '🥕', color: '#F39324' },
  { id: 'beetroot',     name: 'Beetroot',     price: 0.90, emoji: '🫐', color: '#8B1E3F' },
  { id: 'ginger',       name: 'Ginger',       price: 0.60, emoji: '🫚', color: '#C8A04A' },
  { id: 'lemon',        name: 'Lemon',        price: 0.50, emoji: '🍋', color: '#F4D03F' },
  { id: 'orange',       name: 'Orange',       price: 0.80, emoji: '🍊', color: '#F39324' },
  { id: 'grapefruit',   name: 'Grapefruit',   price: 0.90, emoji: '🍊', color: '#E94E4E' },
  { id: 'celery',       name: 'Celery',       price: 0.60, emoji: '🥬', color: '#5A9A2E' },
  { id: 'spinach',      name: 'Spinach',      price: 0.70, emoji: '🥬', color: '#2C5E1A' },
  { id: 'kale',         name: 'Kale',         price: 0.80, emoji: '🥬', color: '#2C5E1A' },
  { id: 'cucumber',     name: 'Cucumber',     price: 0.60, emoji: '🥒', color: '#7DC242' },
  { id: 'mint',         name: 'Mint',         price: 0.50, emoji: '🌿', color: '#5A9A2E' },
  { id: 'watermelon',   name: 'Watermelon',   price: 1.00, emoji: '🍉', color: '#E94E4E' },
  { id: 'lime',         name: 'Lime',         price: 0.50, emoji: '🫒', color: '#7DC242' },
  { id: 'mango',        name: 'Mango',        price: 1.00, emoji: '🥭', color: '#F4D03F' },
  { id: 'pineapple',    name: 'Pineapple',    price: 1.00, emoji: '🍍', color: '#F4D03F' },
  { id: 'strawberry',   name: 'Strawberry',   price: 1.00, emoji: '🍓', color: '#E94E4E' },
  { id: 'blueberry',    name: 'Blueberry',    price: 1.20, emoji: '🫐', color: '#4A5FB7' },
  { id: 'banana',       name: 'Banana',       price: 0.60, emoji: '🍌', color: '#F4D03F' },
  { id: 'turmeric',     name: 'Turmeric',     price: 0.80, emoji: '🫚', color: '#D4941A' },
];

export const BASE_CUSTOM_PRICE = 2.00;
export const MAX_CUSTOM_INGREDIENTS = 5;

export const CUSTOM_SIZE_UPCHARGE = { S: 0, M: 1, L: 2 };
