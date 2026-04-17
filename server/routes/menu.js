import { Router } from 'express';

const router = Router();

// Source of truth mirrored from the menu board. Exposed for external consumers
// (receipts, future Stripe webhook price authoritativeness, etc.).

const VEG = { S: 5, M: 6, L: 7 };
const STD = { S: 5, M: 6, L: 7 };
const SINGLE = { S: 4, M: 5, L: 6 };
const PROTEIN = { S: 7, M: 8, L: 9 };

const CATEGORIES = [
  {
    id: 'veggie',
    label: 'Veggie Juices',
    subtitle: 'S £5 · M £6 · L £7',
    items: [
      { id: 'red-rush',     name: 'Red Rush',     sizes: VEG, ingredients: ['carrot','beetroot','apple','ginger','lemon'],          signature: true },
      { id: 'slim-grin',    name: 'Slim Grin',    sizes: VEG, ingredients: ['kale','spinach','celery','apple','lemon'],             signature: true },
      { id: 'purple-power', name: 'Purple Power', sizes: VEG, ingredients: ['beetroot','carrot','watermelon'] },
      { id: 'ruby-green',   name: 'Ruby Green',   sizes: VEG, ingredients: ['grapefruit','carrot','celery','beetroot','ginger'] },
      { id: 'super-veg',    name: 'Super Veg',    sizes: VEG, ingredients: ['orange','beetroot','carrot','ginger'] },
      { id: 'green-juice',  name: 'Green Juice',  sizes: VEG, ingredients: ['cucumber','kale','celery','lime'] },
      { id: 'abc',          name: 'ABC',          sizes: VEG, ingredients: ['apple','beetroot','carrot'],                           signature: true },
      { id: 'orange-detox', name: 'Orange Detox', sizes: VEG, ingredients: ['orange','carrot','ginger','lemon'] },
      { id: 'minty-mix',    name: 'Minty Mix',    sizes: VEG, ingredients: ['mint','spinach','celery','apple'] },
    ],
  },
  {
    id: 'fresh',
    label: 'Fresh Juices',
    subtitle: 'S £5 · M £6 · L £7',
    items: [
      { id: 'turmeric-power', name: 'Turmeric Power', sizes: STD, ingredients: ['turmeric','black pepper','orange','ginger','carrot'], isNew: true },
      { id: 'feel-good',      name: 'Feel Good',      sizes: STD, ingredients: ['mango','watermelon','strawberry','passionfruit'],     signature: true },
      { id: 'acai-berry',     name: 'Acai Berry',     sizes: STD, ingredients: ['acai berry','apple','banana','hazelnut'] },
      { id: 'mango-flair',    name: 'Mango Flair',    sizes: STD, ingredients: ['mango','pineapple','orange'] },
      { id: 'citrus-mix',     name: 'Citrus Mix',     sizes: STD, ingredients: ['orange','grapefruit','lemon'] },
      { id: 'detox',          name: 'Detox',          sizes: STD, ingredients: ['orange','apple','ginger','lemon'] },
      { id: 'paradise',       name: 'Paradise',       sizes: STD, ingredients: ['strawberry','banana','guava'] },
      { id: 'apple-party',    name: 'Apple Party',    sizes: STD, ingredients: ['apple','pineapple','orange'] },
      { id: 'beet-orange',    name: 'Beet Orange',    sizes: STD, ingredients: ['orange','beetroot','carrot'] },
      { id: 'berry-treasure', name: 'Berry Treasure', sizes: STD, ingredients: ['mixed berries','apple','mango','banana'] },
      { id: 'easy-tropical',  name: 'Easy Tropical',  sizes: STD, ingredients: ['pineapple','mango','banana','apple'] },
    ],
  },
  {
    id: 'smoothie',
    label: 'Smoothies',
    subtitle: 'S £5 · M £6 · L £7',
    items: [
      { id: 'acai-mix',      name: 'Acai Mix',      sizes: STD, ingredients: ['acai berry','banana','milk','yoghurt','honey'],                                                    signature: true },
      { id: 'nutty-banana',  name: 'Nutty Banana',  sizes: STD, ingredients: ['banana','almonds','milk','yoghurt','honey'] },
      { id: 'oats-smoothie', name: 'Oats Smoothie', sizes: STD, ingredients: ['oats','banana','hazelnut','peanut butter','cocoa powder','yoghurt','milk','honey'], kidsFavourite: true },
      { id: 'havana',        name: 'Havana',        sizes: STD, ingredients: ['mango','banana','milk','yoghurt','honey'] },
      { id: 'blubana',       name: 'Blubana',       sizes: STD, ingredients: ['blueberries','banana','milk','yoghurt','honey'] },
      { id: 'triple-berry',  name: 'Triple Berry',  sizes: STD, ingredients: ['mixed berries','milk','yoghurt','honey'],                                          kidsFavourite: true },
      { id: 'summer-set',    name: 'Summer Set',    sizes: STD, ingredients: ['strawberry','mango','milk','yoghurt','honey'] },
    ],
  },
  {
    id: 'single',
    label: 'Single Juice Choice',
    subtitle: 'S £4 · M £5 · L £6 · add ginger or lime for 50p',
    items: [
      { id: 'single-carrot',     name: 'Carrot Juice',     sizes: SINGLE, ingredients: ['carrot'] },
      { id: 'single-orange',     name: 'Orange Juice',     sizes: SINGLE, ingredients: ['orange'] },
      { id: 'single-apple',      name: 'Apple Juice',      sizes: SINGLE, ingredients: ['apple'] },
      { id: 'single-watermelon', name: 'Watermelon Juice', sizes: SINGLE, ingredients: ['watermelon'] },
      { id: 'single-cucumber',   name: 'Cucumber Juice',   sizes: SINGLE, ingredients: ['cucumber'] },
      { id: 'single-celery',     name: 'Celery Juice',     sizes: SINGLE, ingredients: ['celery'] },
    ],
  },
  {
    id: 'protein',
    label: 'Protein Shakes',
    subtitle: 'S £7 · M £8 · L £9',
    items: [
      { id: 'shake-1', name: 'Shake 1', sizes: PROTEIN, ingredients: ['fresh coconut water','blueberry','whey protein'] },
      { id: 'shake-2', name: 'Shake 2', sizes: PROTEIN, ingredients: ['banana','dates','peanut butter','cocoa powder','honey','milk','whey protein'] },
      { id: 'shake-3', name: 'Shake 3', sizes: PROTEIN, ingredients: ['strawberry','banana','honey','milk','whey protein'] },
      { id: 'shake-4', name: 'Shake 4', sizes: PROTEIN, ingredients: ['fresh coconut water','banana','hazelnut','whey protein'] },
      { id: 'shake-5', name: 'Shake 5', sizes: PROTEIN, ingredients: ['banana','almonds','oats','honey','milk','whey protein'] },
      { id: 'shake-6', name: 'Shake 6', sizes: PROTEIN, ingredients: ['avocado','almonds','milk','honey','whey protein'] },
    ],
  },
];

router.get('/', (req, res) => {
  res.json({ categories: CATEGORIES });
});

export default router;
