# JUICEeSTATION — Design Critique & Security Review

**Reviewer:** Claude (design + security skill)
**Date:** 15 May 2026
**Scope:** Full `client/` (React + Vite), `server/` (Express), `supabase/schema.sql`
**Method:** Static review of every source file (no runtime testing).

> Headline: The brand work, motion system, and information design are all genuinely strong — this looks like an award-shortlist-tier independent juice site. The accessibility and **server-side pricing trust model are the two real problems.** One is a polish issue, the other is a money-loss bug. The full table of findings is at the end.

---

## Part 1 — Design Critique

### Overall impression

Confident, opinionated, and on-brand. The "Pure. Fresh. No compromise." reveal, the marquee of ingredients, and the Oryzo/Lusion-style PP Neue Montreal typography give the site a premium-indie feel that's well above what a local Bracknell juice bar would normally ship. The colour palette (`#7DC242` green, `#E94E4E` watermelon, `#F39324` citrus, `#FAF7F1` cream) is cohesive and food-appropriate.

The biggest opportunity is **legibility under motion**: opacity-based de-emphasis is overused, several body-copy strings sit at `opacity-50`/`-60` on a cream background, and the contrast budget on smaller text dips below WCAG AA in multiple places.

### 1. First impression (2 seconds)

What draws the eye on `Home`: the giant `Pure. Fresh. No compromise.` headline, with `No compromise.` reveal-styled in green via the `<em>` override. That is exactly right — it's the brand promise and the hierarchy makes the user read it.

The hero video sits at `opacity-40` behind a `from-brand-cream/70 to-brand-cream` gradient, so it never competes with the headline. Good restraint.

One subtle problem: the hero CTA stack — `Order now` (filled green) and `Subscribe weekly` (ghost) — appears 12 → 0 px below the headline after a 0.9 s delay, which is fine, but the "stat strip" below (`No water · No sugar · No additives · Cold-pressed`) appears 1.3 s in and uses `opacity-70`. On warm cream, those four labels are the most informative element on the page and they're the easiest to miss. Promote them or raise their weight.

### 2. Usability

| Finding | Severity | Recommendation |
|---|---|---|
| Cart drawer renders behind `Navbar` z-stack but Navbar is `z-50` and drawer backdrop is `z-[60]`, panel `z-[70]` — works, but `Builder` toast is also `z-50` and could collide. | Minor | Codify a small z-index scale in `tailwind.config.js` (`z-nav: 50`, `z-toast: 60`, `z-drawer-bg: 70`, `z-drawer: 80`) so future overlays don't fight. |
| `Checkout.jsx` line 25 fires a "warm-up" `fetch(${API_URL}/)` on mount but rate-limits the health endpoint to 60/min. Harmless but wasted — and it sends an unnecessary preflight on first paint. | Minor | Drop the warm-up fetch, or only call it once per session via `sessionStorage`. |
| `Navbar.jsx` line 49 has a stray `)]` at the end of the className: `"… group-hover:scale-[1.03])]"`. Tailwind silently ignores it but it looks like a typo. | Minor | Remove the trailing `)]`. |
| Mobile menu auto-closes on any scroll (`Navbar.jsx` 23). With iOS's "tap address bar to scroll" momentum, a user opening the menu and starting to scroll loses the menu before they can pick. | Moderate | Only close on a deliberate scroll delta (e.g. > 50 px), or just close on route change (which you already do on line 30). |
| `AdminOrders.jsx` uses `confirm(...)` and `alert(...)` for "Cancel subscription" / errors. Native dialogs break the design system and are non-stylable. | Moderate | Replace with the same in-page toast/dialog pattern used in `Builder.jsx`. |
| `Checkout.jsx` has no client-side validation feedback other than `required`. The "minimum order" call-out is clear; the email/phone error states are not. | Moderate | Mirror the `hint` + `hintTone` pattern from `Subscribe.jsx`'s `Field` component into `Checkout.jsx`. |
| `Subscribe.jsx` opens the form via scroll *after* the user picks a tier, but the tier card itself becomes selected (charcoal background). Two visual feedbacks in one — fine — but `Subscribe.jsx` 137-142 has a fragile 100 ms `setTimeout` before scrolling. If the form mount is delayed by `AnimatePresence`, the scroll target won't exist yet. | Minor | Use a `ref` on the form section and call `scrollIntoView` from a `useEffect` that watches `selectedTier`. |
| `OrderSuccess.jsx` reads `id` from the URL with `params.get('id')` and renders it directly. If a user lands here without coming through checkout, they see the literal `JS-XXXXX` placeholder, which leaks the ID format and looks broken. | Minor | If no `id` is present, redirect to `/menu` or show a "We can't find this order — head home" empty state. |
| `Menu.jsx` minimum touch targets for the size-selector buttons (`M ·  £6` etc.) are `px-2 py-1` on the smallest breakpoint — roughly 26 × 22 CSS px. WCAG 2.5.5 (AAA) recommends 44 × 44, AA recommends 24 × 24 for Mobile. Close, but on the edge. | Moderate | Bump to at least `py-1.5 px-3` on mobile. |
| `JuiceCard.jsx` line 75-94 hides the badge row with `invisible` when empty but still reserves `min-h-[20px]`. Smart. Same trick on the size selector line 117-141 with `invisible`. This is good — keeps cards aligned in the grid. | Positive | Keep this. |

### 3. Visual hierarchy

What draws the eye on a juice card: the **name** (huge `text-3xl md:text-3xl font-display`) — correct. The **price** (`text-2xl tabular-nums`) is the second hit — correct. The **+** button is the third — correct. The ingredient strip with the coloured left border is the fourth — also correct.

Reading flow on `Home`: hero → ScrollStory ("Fresh fruit. Raw vegetables. Nothing added. Nothing hidden.") → featured roster → Testimonials → green CTA section. This is a clean inverted-funnel: promise → process → product → social proof → ask. **The structure is the best thing on the site.**

One issue: the `JUICEeSTATION` rendered at `opacity-0.06`, `text-[11vw]` in the footer is gorgeous on desktop but on a mid-range phone it adds a chunk of paint cost for what is essentially decoration. Combined with the persistent `grain` SVG overlay (`bg-blend-multiply`) on the green CTA section, weaker phones may stutter scroll past these.

### 4. Consistency

The system is mostly disciplined:

- Two button styles (`btn-primary`, `btn-ghost`) used everywhere.
- One radius vocabulary: `rounded-full` for pills, `rounded-2xl` (16px) for inputs, `rounded-[24-28px]` for cards.
- One eyebrow style: `text-xs uppercase tracking-[0.3em] opacity-50`.

Inconsistencies to fix:

- **Radius drift**: cards use `rounded-[18px] md:rounded-[28px]` (JuiceCard), `rounded-[24px]` (review card), `rounded-[28px]` (subscribe summary), `rounded-2xl` (allergen card). Pick three values (small / medium / large) and stick with them.
- **Eyebrow tracking**: most are `tracking-[0.3em]`, but a few (PrivacyPolicy, some footer labels) are `tracking-[0.2em]` or `tracking-[0.25em]`. Pick one.
- **Opacity scale for de-emphasised text**: `opacity-40`, `-50`, `-60`, `-70`, `-75`, `-80` all appear. Three steps is enough.
- **Border colour for cards**: `border-black/[0.06]` vs `border-black/5` vs `border-current/10` vs `border-current/15` are used interchangeably. Define `border-hairline` and `border-muted` tokens.
- **Sequence numbers**: `AdminOrders.jsx` shows `#00001` (5-digit padded) but `OrderSuccess.jsx` shows the raw 6-char `JS-XXXXX` format. Two ID systems for the same order is going to confuse the operator and the customer in support emails.
- **Status vocabulary mismatch**: code uses `paid`, `pending_cod`, `fulfilled`; the SQL schema's CHECK constraint only allows `pending`, `confirmed`, `preparing`, `out_for_delivery`, `delivered`, `cancelled`. (See Security/Bugs section — this will throw at insert time.)

### 5. Accessibility (WCAG 2.1 AA)

**Pass:**

- `prefers-reduced-motion` honored in `index.css` (kills animation durations) and in `Testimonials.jsx` (kills marquee).
- ARIA labels on icon-only buttons (cart, close, increment/decrement).
- Form labels properly associated via `<label>` wrapping in `Field` components.
- `aria-hidden="true"` on decorative SVGs and underline elements.
- Skip-to-content not present but heading order is clean (one `h1` per route).
- Strict-mode React, semantic `<header>`, `<main>`, `<nav>`, `<aside>`, `<footer>`, `<figure>` / `<blockquote>` in testimonials.
- Stars in `ReviewCard` get an `aria-label="5 star rating"` on the container.

**Fail or risky:**

| Finding | Severity | Recommendation |
|---|---|---|
| Heavy use of `opacity-50` on body copy. `#111` at 50 % on `#FAF7F1` ≈ `#888885` against cream → contrast ≈ 3.6:1. Below the 4.5:1 normal-text threshold. Affects: privacy/terms/allergen body text, footer email/Visit list, `AdminOrders` timestamps, allergen-warning copy, every eyebrow label, every "tap to expand" hint. | 🔴 Critical | Replace opacity with explicit colour tokens (`text-stone-600`, `text-stone-700`) so contrast can be measured and tuned. Aim ≥ 4.5:1 for anything < 18 px. |
| `text-brand-green-deep` (`#5A9A2E`) on white: contrast ≈ 3.7:1. Used for active nav link, links inside admin cards (`mailto:`, `tel:`), the success checkmark area's text. Fails AA normal. | 🔴 Critical | Darken to ≈ `#4A8024` or use it only on large text (≥ 24 px / 19 px bold) where 3:1 is allowed. |
| `text-brand-melon` (`#E94E4E`) on white: contrast ≈ 3.5:1. Used for error messages — actually the highest-stakes copy on the site. | 🔴 Critical | Darken to `#C73A3A` (~ 4.6:1) for error text specifically. Keep the lighter shade for icons / decorative dots. |
| `text-brand-citrus` (`#F39324`) on white: contrast ≈ 2.6:1. Used for the "Most popular" tier badge text on white, and the `<em>` "Zero shortcuts." accent on the home page. | 🔴 Critical | Reserve `#F39324` for use **on** dark backgrounds (it works on charcoal). For light backgrounds, use a deeper amber like `#B36510`. |
| `<div onClick role="button" tabIndex={0} onKeyDown={...}>` pattern in `OrderCard` and `SubscriptionCard` is a non-button button. It works for keyboard but screen readers announce the contents twice (the whole card *and* every link inside). | 🟡 Moderate | Use a real `<button>` for the header band, or move the click handler to a chevron-icon button and let the card contents stay clickable links. |
| `<input type="password">` on `PasswordGate` and `LoginScreen` — no `name`, no `autocomplete`. Password managers don't fire. | 🟡 Moderate | Add `name="password"` and `autoComplete="current-password"`. |
| Skip-to-content link missing. Keyboard users have to tab through nav + cart icon + menu toggle on every page. | 🟡 Moderate | Add `<a href="#main" className="sr-only focus:not-sr-only ...">Skip to main</a>` at top of `App.jsx`, and `id="main"` on the `<main>`. |
| `<a href="https://...">` external links in Footer have `target="_blank" rel="noopener noreferrer"` — good. But `Testimonials.jsx` line 102 has a blank line between `href` attr and `target`, which Tailwind/JSX is fine with but suggests a broken merge. Worth re-inspecting. | Minor | Format check. |
| Touch targets: `JuiceCard` quantity buttons are `w-7 h-7` (28 px) at small mobile breakpoint. Below 44 × 44 (AAA) and below 24 × 24 only if you count just the button — but the parent has padding. Borderline. | 🟡 Moderate | Bump to `w-8 h-8` minimum on `sm:`. |
| `<style>` blocks injected inside `Builder.jsx` and `Testimonials.jsx` contain `@keyframes`. These re-mount on every component re-mount. Harmless for CSS but wasteful and not CSP-friendly if a strict CSP is ever set. | Minor | Move keyframes into `index.css` and reference by class. |
| `<svg>` in stars (Testimonials line 46) have no `aria-hidden`. The `aria-label="5 star rating"` is on the parent so this is OK in practice — but be explicit. | Minor | Add `aria-hidden="true"` to the star SVGs. |
| Logo `<img alt="JUICEeSTATION">` is correct in Navbar and Footer. Good. | Positive | — |
| The `🧃` and other emoji used as decoration are not hidden from AT. VoiceOver will read "beverage box". | Minor | Wrap in `<span aria-hidden="true">🧃</span>`. |

### What works well

- The **motion system** is restrained: `cubic-bezier(0.2, 0.8, 0.2, 1)` reused everywhere, viewport-once animations to avoid replay on scroll-back, `prefers-reduced-motion` properly honored.
- **Empty states**: cart drawer ("Nothing here yet — pick a juice or build one from scratch"), `Checkout` empty cart ("Cart's empty"), `Subscribe` postcode hint — all written in the same voice and all give the user one next step.
- **Microcopy**: "Add £4.50 more for delivery", "Empty bottle" (builder cart heading when you've picked nothing), "Build another?" after add — confident, brand-on, never bossy.
- **Real reviews used verbatim** (Testimonials.jsx) with attribution — the most credible thing on the page.
- The Builder toast pattern (added / removed / max) with three colour variants and accurate copy is a small thing executed perfectly.

### Priority design recommendations

1. **Fix the contrast cluster.** The three brand accent colours (`brand-green-deep`, `brand-melon`, `brand-citrus`) all fail AA against white at normal text size, and `opacity-50` on cream is below AA for body copy. Adjusting four token values fixes ~80 % of the sites' contrast failures.
2. **Replace `confirm()`/`alert()` in `AdminOrders`** with the same in-app modal/toast pattern used elsewhere — for visual consistency *and* so error states aren't bypassed in iOS in-app browsers (which sometimes suppress native dialogs).
3. **Tighten the opacity scale**. Define three steps (`text-muted`, `text-subtle`, `text-faint`) backed by explicit colours, and codemod the existing `opacity-40 / -50 / -60 / -70 / -75` usages onto them.

---

## Part 2 — Security Review

> **Bottom line:** The defensive perimeter (Helmet, CORS allowlist, rate limits, Zod, timing-safe admin compare, RLS-by-default Supabase, Stripe webhook signature verification, DOMPurify on free-text) is genuinely well-built. The hole is **server trust of client-supplied prices in the Stripe checkout** — an attacker can pay £0.05 per juice. There are also two privacy IDOR endpoints, one client-side "password" that isn't, and one schema/code mismatch that will break orders on a fresh deploy.

### 🚨 Critical findings

#### S-1. Server trusts client-supplied item prices when creating the Stripe Checkout Session
**File:** `server/routes/orders.js` lines 22 → 84
**Severity:** 🔴 Critical (financial loss)

The `POST /order` handler accepts `items: [{ id, name, price, qty, meta }]` from the browser, runs them through `orderSchema` (which only bounds `price` between 0 and 100), and then constructs Stripe line items from those values verbatim:

```js
const lineItems = items.map((item) => ({
  price_data: { currency: 'gbp',
    product_data: { name: item.name, ... },
    unit_amount: Math.round(item.price * 100), // ← attacker-controlled
  },
  quantity: item.qty,
}));
```

A malicious user can `POST /order` with `[{ id: 'red-rush-M', name: 'Red Rush (M)', price: 0.50, qty: 10, ... }], total: 25` — passes Zod, passes the £25 minimum check, and Stripe creates a checkout for £5.00. The same item normally costs £60. Magnitude: roughly 90 % discount per order across the entire menu.

The `/menu` route already contains the authoritative price table on the server. Use it.

**Fix sketch:**
```js
import { CATEGORIES } from './menu.js'; // or refactor into a shared lib
const PRICE_LOOKUP = buildPriceLookup(CATEGORIES); // { 'red-rush-M': 6, ... }

const lineItems = items.map((item) => {
  const expected = PRICE_LOOKUP[item.id];
  if (expected == null) throw badRequest(`Unknown item: ${item.id}`);
  if (Math.abs(expected - item.price) > 0.001) {
    throw badRequest(`Price mismatch for ${item.id}`);
  }
  return { price_data: { currency: 'gbp',
    product_data: { name: item.name },
    unit_amount: Math.round(expected * 100),
  }, quantity: item.qty };
});
```

Same fix applies to `/order/cod`, where COD totals are also stored as whatever the client claimed. Custom-builder juices (`id: 'custom-…'`) need their own recompute path using the `INGREDIENTS` price table from `data/menu.js`.

#### S-2. Public GET endpoints leak full order/subscription PII
**Files:** `server/routes/orders.js` line 190; `server/routes/subscriptions.js` line 107
**Severity:** 🔴 Critical (privacy / GDPR)

```js
router.get('/:id', async (req, res) => {
  const { data } = await supabase.from('orders').select('*').eq('order_id', req.params.id).single();
  res.json(data); // returns: name, email, phone, address, notes, items, total, ...
});
```

Both endpoints have no authentication. The order ID is `JS-` + 6 chars from a 32-char alphabet (≈ 1.07 billion possibilities), so brute force is impractical at 30 req/min — but the URL still ends up in:

- browser history of any shared device
- referrer headers if the user lands somewhere external from the success page
- email previews / share links

This is also a GDPR exposure: returning full address + phone + notes for any URL that happens to match.

**Fix:**
- Either remove the public lookup entirely (the success page only needs the ID echoed back, which it already gets from `?id=` in the URL), or
- gate it behind a one-time signed token issued by the order/subscription flow, or
- return only non-PII fields (`status`, `total`, `created_at`).

#### S-3. "PasswordGate" is a client-side string compare
**File:** `client/src/components/PasswordGate.jsx` line 4
**Severity:** 🔴 Critical *if* the intent is to block the public — Minor if it's understood to be a soft "coming soon" door.

```js
const SITE_PASSWORD = 'juicelaunch2026';
```

This ships in the JS bundle. `view-source:` → search → done. It also gets written to `localStorage` as `js_gate_unlocked: 'yes'`, so anyone can bypass with a single `localStorage.setItem('js_gate_unlocked', 'yes')` in DevTools.

Also: the component is **not currently imported** in `App.jsx` — so right now the gate isn't even rendered. Either remove it from the repo, or wire it up properly. If you need a real preview gate, do it at the edge (Vercel password protection / basic auth header) so the password never reaches the browser.

#### S-4. Admin password is the bearer token, stored in `sessionStorage`
**Files:** `server/routes/admin.js` line 7-51; `client/src/pages/AdminOrders.jsx` line 8-50
**Severity:** 🟡 Moderate

`AdminOrders.jsx` stores the literal admin password in `sessionStorage` under key `js_admin_token` and sends it as `Authorization: Bearer <password>` on every poll (every 30 s). The server's `requireAdmin` compares it with `timingSafeEqual` — that's correct — but:

- Any XSS anywhere in the app reads the password directly out of `sessionStorage`. With React + DOMPurify on free-text the XSS surface is small, but `dangerouslySetInnerHTML` is one mistake away.
- The same plaintext password traverses the network on every poll. If a logging proxy or analytics tool ever sniffs `Authorization`, the actual credential is in the log.
- Brute-force resistance relies on the global `/admin` rate-limit of 30 req/min/IP — but legitimate polling already uses 4 of those (orders + subs at 30 s each from one open tab). A distributed attacker has lots of room.

**Fix sketch:**
- One `POST /admin/login` endpoint that takes the password, verifies, and returns a short-lived (1 hour) signed JWT or random opaque token stored in a `httpOnly; Secure; SameSite=Strict` cookie.
- Move the strict brute-force limiter (e.g. 5 attempts / 15 min) onto that single login endpoint, not the whole `/admin` namespace.
- Hash the password at rest with `argon2` or `bcrypt` even though it's a single shared secret — defence in depth against env-var leak.

#### S-5. SQL schema CHECK constraint doesn't match the application's status values
**Files:** `supabase/schema.sql` line 37; used in `server/routes/orders.js`, `server/routes/stripe.js`, `server/routes/admin.js`
**Severity:** 🔴 Critical (functional, not security, but it will break orders on a clean DB)

```sql
status text not null default 'pending' check (status in (
  'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'
))
```

But the application writes: `'pending'`, `'pending_cod'`, `'paid'`, `'fulfilled'`, `'cancelled'`. Of those, **`pending_cod`, `paid`, and `fulfilled` will be rejected by the CHECK constraint** on any DB built from the committed schema. The current production DB has presumably been manually altered to allow these — but anyone re-running `schema.sql` for staging or a recovery will get a broken instance.

**Fix:** Update the SQL CHECK to the values the code actually uses, and add a migration in `supabase/` describing the change. Same for the `payment_method` column — it's written by the COD path (`server/routes/orders.js` line 157) but doesn't exist in the schema.

---

### 🟡 Moderate findings

#### S-6. `total` is also client-supplied and stored verbatim
**File:** `server/routes/orders.js` line 30-36
**Severity:** 🟡 Moderate

After S-1 is fixed (server recomputes prices), `total` is still stored from the request body without being recomputed. If you ever generate invoices or analytics from `orders.total`, an attacker could send `total: 1000000` (caps at 10000 via Zod) for a £25 order. Recompute server-side and ignore the client's number.

#### S-7. CORS allows requests with no `Origin` header
**File:** `server/index.js` line 47-49
**Severity:** 🟡 Moderate

```js
if (!origin) return callback(null, true);
```

The comment says this is to allow curl / mobile apps / server-to-server. For a customer-facing site that has neither a mobile app nor any documented S2S consumers, this means any `fetch`/`XMLHttpRequest` made without an `Origin` (which is everything except a browser cross-origin request) can hit any endpoint, including `POST /admin/*` if it knows the bearer.

Tighten: only allow no-origin on `GET /` (health) and `GET /menu`. Everything else should require a matching origin.

#### S-8. `RESEND_API_KEY` may be loaded into the app but is also referenced in emails sent on behalf of arbitrary customer emails
**File:** `server/lib/mailer.js`
**Severity:** 🟡 Moderate

The `from:` is your domain (or `onboarding@resend.dev` if not configured), but `to:` is set to `order.customer_email`, which is from the request. Zod validates the format but if an attacker creates 500 orders with disposable emails the function will fan-out 500 sends — and Resend bills per email and rate-limits per minute. Combined with the per-IP order rate limit of 5/10min this is bounded, but worth noting.

Also: the customer-facing HTML email contains the cart's `item.name` and `item.meta`, both of which DOMPurify-strip on input but the email renders inside server-generated HTML using `escapeHtml`. That's correct — but `formatItems` doesn't escape `meta` (it interpolates `${escapeHtml(meta)}` — actually it does, false alarm). Email side is fine.

#### S-9. The Stripe webhook handler doesn't check if the order is already paid before marking paid
**File:** `server/routes/stripe.js` line 32-46
**Severity:** 🟡 Moderate

If Stripe retries `checkout.session.completed` for the same session (which they do under retry policy) the order is updated to `status: 'paid'` again *and* customer/owner emails fire again. Idempotency by checking the current status before updating:

```js
.update({ status: 'paid', ... })
.eq('order_id', orderId)
.neq('status', 'paid')      // ← add this
.select().single();
```

…and only send email if `data` (the updated row) is non-null. Otherwise duplicate confirmations after every webhook retry storm.

#### S-10. CORS error → 500 in error handler unless caught
**File:** `server/index.js` line 138
**Severity:** 🟢 Minor

The CORS rejection is correctly mapped to 403 inside the error handler, but the `cors` middleware itself wraps the error as `Error('Not allowed by CORS')` and the `next(err)` call still ends up at the 500-handler unless that exact string match holds. Use a typed error or a property check (`err.name === 'CorsError'`) instead of string comparison.

#### S-11. Rate-limiter behavior behind Render's proxy
**File:** `server/index.js` line 17 (`app.set('trust proxy', 1)`)
**Severity:** 🟢 Minor

`trust proxy: 1` trusts exactly one hop. If Render ever puts a second proxy in front (Cloudflare, etc.) or the server is moved to a multi-hop deployment, `req.ip` becomes the *first* proxy and rate-limits cease to discriminate. Express docs recommend either a CIDR list of known proxies or an exact integer matched to deployment topology. Document this and pin to your deployment.

#### S-12. `JSON.parse` of localStorage cart is unguarded type-wise
**File:** `client/src/context/CartContext.jsx` line 60-62
**Severity:** 🟢 Minor

```js
const stored = localStorage.getItem(STORAGE_KEY);
if (stored) dispatch({ type: 'HYDRATE', payload: JSON.parse(stored) });
```

A maliciously crafted local storage entry (or just stale data shape) can hydrate the cart with arbitrary `{ price: 'haha' }` items, which then survive into checkout. With S-1 fixed the server clamps prices anyway, but defence in depth: validate the parsed array's shape with a small schema before dispatching.

---

### 🟢 Low / informational

| # | File | Note |
|---|---|---|
| S-13 | `server/lib/supabase.js` 18 | If env vars are missing, the export still creates a `placeholder` client and the app boots. Better to throw at startup so misconfigured deploys fail loudly rather than silently dropping orders. |
| S-14 | `server/index.js` 145 | `console.error('[error]', { stack: err.stack })` is fine in dev but in prod will dump stack traces into Render logs — a third-party log viewer / collaborator with log access sees source paths. Consider conditionally including `stack` only when `NODE_ENV !== 'production'`. |
| S-15 | `client/dist/` is on disk but `.gitignore`d — `git ls-files` confirms it's not committed. Good. The two `hero-old.mp4` / `hero-compressed.mp4` files inside `dist/` look like build artefacts the host should ignore. |
| S-16 | `client/index.html` 25 | Loads `fonts.cdnfonts.com` over HTTPS, with `crossorigin` but no SRI hash. If the font CDN is ever compromised, custom CSS could land in your page. Pin to a hash or self-host. |
| S-17 | `client/src/components/Testimonials.jsx` 102-104 | Whitespace anomaly: a blank line between `href` and `target` in the JSX — renders fine but suggests a merge artefact worth cleaning. |
| S-18 | All `.env.example` files are tracked and **don't** contain real keys. Verified. ✅ |
| S-19 | `server/package.json` | Stripe SDK pinned to `^22.0.2` with `apiVersion: '2024-11-20.acacia'` — these are tied; if `^22` floats to 23 you may get a hard mismatch warning. Pin exact in production. |
| S-20 | `helmet({ contentSecurityPolicy: false })` | Justified comment ("API only"), but the same Express app could one day serve admin HTML. If that happens, remove this disable. |
| S-21 | Cart drawer + Stripe redirect | After a successful Stripe redirect the cart is cleared, but if the user hits back-button before paying the cart is *also* cleared (`clear()` runs at line 64 of `Checkout.jsx` *before* `window.location.href`). Mostly a UX issue; minor if Stripe abandonment is rare. |

---

## Combined priority list (fix order)

1. **S-1 — Recompute Stripe `unit_amount` from a server-side price table.** This is the only finding that has direct, immediate financial impact.
2. **S-2 — Lock down or remove the public `GET /order/:id` and `GET /subscription/:id` endpoints.** GDPR + PII.
3. **S-5 — Update `supabase/schema.sql` CHECK constraint to match the statuses the code writes, and add the missing `payment_method` column.** Otherwise a fresh-DB deploy is dead on arrival.
4. **Accessibility cluster** — fix the three brand colour contrasts (`brand-green-deep`, `brand-melon`, `brand-citrus`) and replace opacity-based de-emphasis with explicit colour tokens. This is the largest single quality win and the only thing that could attract a UK Equality Act / public-sector audit issue.
5. **S-4 — Swap the static admin password for a one-shot login + short-lived token in an httpOnly cookie**, and put a strict brute-force limiter on the login endpoint.
6. **S-9 — Make the Stripe webhook idempotent** with a status guard before the update.
7. **S-3 — Remove or properly implement `PasswordGate`** (it currently isn't even imported, and is misleading as a security control).
8. **S-6 — Recompute `total` server-side instead of trusting the client.**
9. **Design polish** — fix `confirm()`/`alert()` in `AdminOrders`, the `)]` typo in Navbar, the `setTimeout`-before-scroll in `Subscribe`, the `OrderSuccess` placeholder render.
10. **S-12 — Schema-validate the cart on hydrate from localStorage.**

The rest are minors that can be batched into a cleanup PR.

---

## What you did right (worth keeping)

- Helmet + CORS allowlist + per-route rate limiting + 100 kB body cap + `x-powered-by` off. Most early-stage Express apps don't have any of these.
- Zod schemas with `.strict()` to reject unknown keys *and* DOMPurify on free-text strings (defence-in-depth for stored XSS into the admin dashboard).
- Stripe webhook signature verification with the raw body. Easy to get wrong, you got it right.
- Constant-time admin password compare with `timingSafeEqual` and equal-length buffer padding.
- Supabase RLS enabled on every table, no public policies — the anon key cannot read.
- `.env` files git-ignored; only `.env.example` committed, and the examples don't carry secrets.
- Honoring `prefers-reduced-motion` consistently across CSS, Framer, and Testimonials' CSS-animation marquee.
- Real customer reviews verbatim from Google with attribution — best social proof you can have.
- The motion design language (one easing, one staggered reveal pattern, one card hover, one button-tap scale) is more disciplined than 90 % of Vite-React starter sites.
