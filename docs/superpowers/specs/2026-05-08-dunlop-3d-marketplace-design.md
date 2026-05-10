# Dunlop 3D Marketplace — Design

**Date:** 2026-05-08
**Status:** Approved (pending client review)
**Author:** working session with Efra
**Repository:** /Users/3fra/dev/dunlop

**Revisions**
- 2026-05-08 — Camera/composition revised from a rotatable 3D room to a fixed **2D orthographic framing of 3D objects**. The frame is the canvas; objects animate inside it. Trade-off: lose user-driven rotation; gain creative latitude on animation, choreography, and composition.
- 2026-05-08 — Checkout revised from redirect-to-hosted-BigCommerce to a **custom first-party checkout on the same BigCommerce backend**. Adds scope (now its own milestone) but preserves the diegetic frame through the entire purchase flow.
- 2026-05-09 — Reaffirmed: the BC integration is a **plug-and-play adapter**, not a re-implementation. Storefront GraphQL for catalog, BC Cart API for cart, `@bigcommerce/checkout-sdk` for checkout. We render UI against BC's official surfaces and never own commerce logic. See "Adapter-thin philosophy" under Cart & checkout.

## Overview

Rebuild jimdunlop.com as a Three.js-based diegetic marketplace: a **2D orthographic composition of 3D objects** — a fixed-frame studio still life rather than a navigable room — where every product category is represented by a physical object, the cart is an actual basket sitting in the frame, and editorial/heritage content surfaces contextually when a user picks up the object it relates to. The 2D framing means the camera is the staging, not a free-floating viewpoint; 3D objects living inside that frame are free to rotate, lift, hover, jiggle, fly between cells, and inspect themselves with real depth. The goal is a brand experience that is also fully transactional, with no friction tax for shoppers who just want to buy.

The existing site is a BigCommerce + Stencil store. The new front-end is a "head" on top of that backend — we read live catalog data from BigCommerce's public Storefront GraphQL API and drive cart + checkout via BigCommerce's APIs. **Checkout itself is custom-built into the diegetic experience** (no redirect to BigCommerce's hosted checkout): same backend, our own UI, payments tokenized client-side so we stay out of PCI scope. We do not replace the commerce backend.

## Goals

1. A diegetic 3D shopping experience that reads as distinctly Dunlop, not as a generic e-commerce front-end.
2. A working end-to-end shoppable prototype on real product data, fast enough to demo to the client and earn budget for the visual pass.
3. Editorial / heritage content surfaces in-context, not as a separate "history" section.
4. The cart is a continuously-visible, always-alive object in the world.
5. SEO and accessibility are first-class — every product page is reachable without rendering 3D.

## Non-goals

- Replacing or migrating BigCommerce. Checkout *UI* is ours; payments, tax, fulfillment, inventory, and order management stay on BC.
- Building a payment processor or holding card data ourselves — payment fields are tokenized via BC's Checkout SDK / hosted-field integrations so PAN never hits our origin.
- Walkable first-person navigation, or any user-driven camera rotation/pan. The frame is fixed; only objects move.
- Multiple rooms / floors in v1.
- Multiplayer, avatars, day/night cycles.
- A custom CMS in v1 (editorial lives as MDX in the repo).
- User accounts / login in v1 (guest checkout only).

## Context — audit findings

A site audit was completed on 2026-05-08. Full results in `docs/audit/` and `data/raw/`. Key findings:

- **Platform:** BigCommerce + Stencil theme. Store hash `n26aknlnlm`, channel id `1`.
- **Catalog scale:** 1,692 products, 236 categories, 27 brands. Top-level structure: guitar-picks, electronics, accessories, strings, apparel.
- **Public Storefront GraphQL API works without admin credentials.** A 48-hour Storefront API JWT is embedded in the homepage HTML inside `window.stencilBootstrap("default", "{...storefront_api: { token }...}")`. With it, anonymous queries return products, categories, brands, search, pagination, and introspection.
- **Variants are sparse.** Only picks have real BigCommerce option selectors (pack sizes). Capos, pedals, slides, straps, strings, cables — every color/size/gauge is its own product URL with no variant dropdown.
- **JSON-LD is not present** on PDPs. The site uses incomplete schema.org microdata. We will emit our own JSON-LD for SEO on the rebuild.
- **The editorial cupboard is bare.** Every brand URL (`/dunlop/`, `/mxr/`, `/cry-baby/`, `/way-huge/`, `/cae/`) currently 302-redirects to a product grid. `/about`, `/our-story`, `/history` 404. The only on-site source of brand prose is the homepage `<meta description>` and the trademark register on `/legal/`.
- **Brand identity recoverable from the site:** founded 1965, Benicia CA, family-owned. Color: black/white/red (`#EF0000`). Stylistic motif: every section title ends with a period ("Featured Artists.", "FEED."). Three official taglines: *PERFORMANCE IS EVERYTHING*, *LIVE TO PLAY LIVE*, *IT'S MORE THAN A PICK*. Heritage names in the trademark register: CRYBABY, FUZZ FACE, ROCKMAN, ECHOPLEX, OCTAVIO, UNIVIBE, TORTEX, FASEL.
- **The /artists/ index lists ~40 artists/bands** (Slash, Hendrix, Tom Morello, Iron Maiden, Zakk Wylde, Eddie Van Halen, Buddy Guy, Tool, Animals As Leaders, etc.) with per-artist profile pages we have not yet crawled. This is the richest editorial canvas the live site has.

## Design

### The room

A single 2D orthographic composition — a musician's studio rendered as a fixed-frame still life. The camera doesn't pan or rotate; the frame is the canvas. 3D objects live inside that frame and animate freely (rotate, hover, lift, sway, jiggle, fly between cells, swap places) in ways that would feel wrong inside a navigable space. Warm wood floor, exposed brick or paneled wall, a window throwing late-afternoon light, a record player or small amp humming in the corner. Black/white/red brand accents. Period-stylized wall signage ("DUNLOP. SINCE 1965.", "PERFORMANCE IS EVERYTHING.").

Diegetic anchor objects, each tied to a category:

| Object | Maps to | Dive opens |
|---|---|---|
| Guitar on stand | — (hero) | Featured signature gear |
| Pedalboard on the floor | Electronics (368) | Pedalboard view, brand rows |
| Vintage Cry Baby on a pedestal | Heritage | Cry Baby history dive |
| Jar of picks on the desk | Picks (434) | Pick families |
| Pegboard above the desk | Custom picks portal | Workbench / engraving |
| Capos on a wall hook | Capos | Capo lineup |
| Slide tray on the desk | Slides | Slide lineup |
| Strap draped over guitar | Straps | Strap wall |
| Coiled cable on a hook | Cables | Cable view |
| Strings on a shelf | Strings (111) | Strings shelf, by instrument |
| T-shirt on chair back | Apparel (15) | Apparel rack |
| Bookshelf of records | Artists (40) | Artist profiles |
| Framed founder photo / gold record | Heritage | 1965 origin |
| Basket near the door | Cart | Cart view + checkout handoff |

The room is small and curated. Deeper catalog access happens *inside* each object's dive — never as a generic grid that breaks the diegesis.

### Navigation

- **Default view** — fixed 2D orthographic frame. The camera does not pan, zoom, or rotate; composition is authored, not user-driven. Idle micro-animations (a pick wobbling, a cable swaying, dust motes drifting through window light, the record turning) keep the scene alive.
- **Hover / tap-hold** — interactable objects animate in place (lift, glow, slow rotation revealing a hidden side) and show a label. The 2D framing means hover can be theatrical without disorienting the viewer.
- **Click → dive** — the selected object animates to a hero position in-frame, surrounding objects gracefully recede or dim, and a content panel slides in from the right. Breadcrumb top-left, persistent cart icon top-right.
- **Exit** — empty space, ESC, or back arrow returns the room to its resting composition.
- **Loading** — themed loader on first paint (e.g., a spinning record, or a "TUNING UP." progress bar).
- **Skip-to-shop escape hatch** — a top-right link drops to a conventional Next.js product list/grid view that exposes the same data, same cart, no 3D. Serves screen readers, low-end devices, SEO crawlers, and shoppers who just want to buy fast.

### Dive mechanic

A dive is the core interaction. Three flavors, one anatomy.

**Anatomy.** Camera moves into the object (~1.2s). Object scales up, room blurs. Content panel slides in from the right. Breadcrumb top-left ("Room → Pedalboard"). Cart icon top-right.

**Flavors.**

1. **Category dive** — clicking the jar of picks, the pedalboard, the strap rack, etc. Shows all items in the category in-fiction (picks fan out, pedals tile across the pedalboard). User taps a specific item to drill in.
2. **Product dive** — clicking a hero product directly (the vintage Cry Baby, the strap on the guitar). Goes straight to detail: title, price, variants if relevant, description, images, **Add to cart**. Optional "Story" tab if the product has editorial.
3. **Editorial dive** — the bookshelf records, the founder photo, the vintage Cry Baby pedestal. Story-led: prose + period imagery + embedded gear callouts that themselves drill into product dives.

**Editorial source matrix.**

- **Artist records (40)** — populated from `/artists/<slug>/` pages (followup crawl needed; not on the M1 path).
- **Cry Baby pedestal** — original copy drafted from public sources, client approves.
- **Founder photo (1965)** — short prose drafted, client approves.
- **MXR / Way Huge / CAE** — surface inside pedalboard dive as hero callouts.

**Add to cart animation.** Item visually flies from its position toward the basket. Basket bounces. Count badge pops. Optional audio cue (pick click).

**Variants.** Only picks have pack-size variant dropdowns. Everything else is one-click add.

### Cart & checkout

**Basket as physical object.** In room view, the basket sits in-frame. Items added literally fly across the composition into the basket as miniatures (the 2D framing makes this trajectory cinematic — much harder to choreograph in a free-camera room). Clicking the basket (or the persistent top-right cart icon) opens the cart panel.

**Cart panel.** Line items: thumbnail, name, variant, qty stepper, line total, remove. Subtotal at the bottom. Primary "Checkout" button. Empty state encourages return-to-room.

**Cart backend.** BigCommerce Cart API via GraphQL using the same Storefront token. Cart ID stored in `localStorage` + cookie; BigCommerce persists carts ~30 days server-side. The cart UI reads live from BC — they own the source of truth on prices and availability.

**Custom checkout (no redirect).** Checkout is a first-party flow we build inside the diegetic experience, not a handoff. The flow steps:

1. **Contact** — email (guest checkout in v1).
2. **Shipping address** — address form, autocomplete optional.
3. **Shipping method** — fetched live from BC, priced per address.
4. **Payment** — tokenized via BC's Checkout SDK and the merchant's configured payment provider (Stripe / Braintree / Adyen — TBD per BC store config). Hosted fields render the card inputs so card data never touches our origin; we keep PCI scope to SAQ-A.
5. **Review & place order** — order created via BC's checkout-to-order conversion endpoint. On success, an order confirmation panel slides in within the same frame; the basket empties with an animated rest pose.

The visual treatment stays in the diegetic frame the entire way: checkout is a panel sequence on top of the same 2D-ortho scene, not a separate themed page. Errors from BC (declined card, address validation, inventory race) surface inline at the offending step with retry. v2: explore Apple Pay / Google Pay express paths and saved-customer login.

**Backend split.** BC owns: products, prices, taxes, shipping rates, inventory, payment processing, order management, fulfillment, refunds, customer records. We own: cart UI, checkout UI, payment tokenization handoff, order confirmation UX. We do not store card data, do not settle payments, do not manage inventory.

**Adapter-thin philosophy.** The new front-end is an opinionated *renderer*, not a re-implementation of commerce logic. Wherever BigCommerce ships an official client (Storefront GraphQL for catalog, the Cart REST/GraphQL surface for carts, `@bigcommerce/checkout-sdk` for checkout), we use it directly and render UI against the events/state it exposes. We do not write our own order state machine, our own payment retry semantics, our own tax math, or our own address validation — BC owns all of that, and the SDK is the contract. If BC adds a payment method, ships a fix, or rotates a payment provider integration, we should pick it up by upgrading the SDK, not by patching our code. The internal BC adapter (`src/lib/bigcommerce/`) is a thin facade: typed query helpers + a checkout-SDK lifecycle wrapper, no business logic of our own. When we feel the urge to "improve" on BC's behavior, the default answer is *don't*.

**Edge cases.** Out-of-stock blocks add and shows inline error. Quantity caps at available. Stale cart clears local state and surfaces a one-time toast. Network failures retry with subtle UI feedback. Payment errors surface inline at the payment step with retry; address-validation errors return user to the shipping step with the offending field flagged.

### Catalog depth

Hierarchy is at most four levels: **Room → Category dive → Sub-grouping → Product detail.**

| Category | Count | In-fiction grouping |
|---|---|---|
| Picks | 434 | 14 family trays (Tortex, Flow, Jazz, Celluloid, Primetone, Ultex, Nylon, Delrin-500, Herco, Max-Grip, Gator Grip, Artist Series, Graphic Artist, Finger/Thumb) |
| Electronics | 368 | Brand rows (Cry Baby, MXR, Way Huge, Dunlop Electronics, Authentic Hendrix) |
| Accessories | 321 | Already split across multiple room objects |
| Strings | 111 | Shelves by instrument (electric / bass / acoustic / classical / ukulele) |
| Apparel | 15 | Flat rack |
| Artists | 40 | Bookshelf, alphabetical or by instrument |

**In-fiction filters.** Pick gauge → thickness gauge tool. Material → swatch card. Brand → corkboard logo magnets. Price → tape-measure slider. Sort → flipped card.

**Search.** Magnifying glass (notepad metaphor) overlay. Live results. Tapping a result jumps directly to that product's dive.

**Curation.** Each category dive opens with a "spotlight" tier (featured / new / seasonal) before the full catalog. Driven by BC category-featured flags + a small JSON we control.

**Performance.** Instanced rendering for repeated geometries (one mesh per pick shape). Texture atlasing. LOD (close-up = full geometry, far = sprite). Virtualized dives — render 30-50 items at a time.

## Architecture

### Stack

- **Framework:** Next.js 16, App Router, on Vercel (Fluid Compute).
- **Language:** TypeScript.
- **Styling:** Tailwind for 2D UI overlays (panels, buttons, type).
- **3D:** react-three-fiber + drei + (dev-only) leva. glTF/glb models with Draco compression. Texture atlases. **Camera is fixed orthographic — no orbit controls, no user-driven camera motion.** Animation is per-object via spring/damp libraries (drei `useSpring`, `MathUtils.damp`) and react-spring/three for choreographed sequences.
- **State:** Zustand. Single client store for cart, dive context, hover state, audio settings.
- **Data layer:** Server-side wrapper around BigCommerce Storefront GraphQL (`https://www.jimdunlop.com/graphql`). Queries cached with Next.js `fetch` cache (`revalidate: 3600` for catalog, `0` for cart/availability).
- **Checkout:** BigCommerce Checkout SDK (`@bigcommerce/checkout-sdk`) for step orchestration, address validation, shipping/tax quoting, and payment tokenization via hosted fields. Order placement via the SDK's `submitOrder`. PCI scope is SAQ-A — card fields render in BC's iframe/hosted-field surface, our DOM never sees PAN.
- **JWT refresh:** lazy — when a server-side query 401s, we re-fetch the homepage HTML, extract the JWT (regex `eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+`), persist to a server-side store, retry the query. No cron required.
- **Editorial CMS:** MDX files in a `content/` folder. Upgrade to Sanity or Payload in v2 if the client needs self-edit.
- **Audio:** Howler.js. Opt-in, default off, persistent toggle.
- **Auth:** none in v1. Cart is anonymous via BC cookie.
- **Analytics:** Vercel Analytics + Speed Insights. Custom event hooks (dive entered, item added, checkout started) wired but dashboard is v2.

### 3D asset strategy

**v1: primitive placeholders.** Boxes, cylinders, low-poly stand-ins. Untextured. Real interaction graph, scene composition, dive logic, and animation choreography — only the geometry is throwaway. This is intentional: M1 proves the concept end-to-end without burning budget on art. Because the camera is fixed and the framing is 2D, primitive geometry composes more cleanly than it would in a free-camera room — silhouettes read against the frame.

**Later:** stock models (Sketchfab/TurboSquid) for generic furniture/lighting + commissioned hero objects (vintage Cry Baby, branded pick jar, period signage, branded amp). The R3F scene graph stays the same; only the model files swap. Animation rigs authored against primitives carry over.

### Repo shape (proposed)

```
/
  app/                    Next.js App Router pages
    (room)/               3D experience routes
    (shop)/               Skip-to-shop fallback routes
    api/                  Server routes (BC GraphQL proxy, JWT refresh)
  components/
    room/                 R3F scene, camera, room objects
    dive/                 Dive panels, transitions, in-fiction filters
    cart/                 Cart panel, basket-in-room, animations
    ui/                   Tailwind UI primitives
  lib/
    bigcommerce/          GraphQL client, queries, JWT manager
    state/                Zustand stores
  content/                MDX editorial pieces
  data/                   Audit data and seeded catalog snapshots
    raw/                  Raw scrape & API responses (not for runtime)
  public/
    models/               glTF/glb (placeholders v1, real assets later)
    audio/                Interaction sounds
  docs/
    audit/                Site audit docs
    superpowers/specs/    This file lives here
```

## Build plan

### Milestone 1 — diegetic prototype (the demo)

The minimum that proves the concept on real data and earns credentials + budget. Browsing + add-to-cart only; checkout is stubbed.

- One basic room with ~6 placeholder primitive objects: pedalboard, pick jar, capo peg, strap rack, bookshelf, basket.
- Fixed 2D orthographic camera (no rotation), click-to-dive, ESC/back, dive choreography (selected object hero-poses, others recede).
- 2–3 categories live on BigCommerce GraphQL: picks, pedals, capos. Other room objects show a "Coming soon" panel.
- Real product detail dives (title, price, image, description, Add to cart).
- Live cart wired to BC Cart API: items add via cart mutation with animated fly-to-basket, badge animates, basket count updates, cart panel lists items.
- **Checkout button is a stub** in M1 — opens a "Checkout coming soon" panel. Real checkout lands in M2.
- One editorial dive — founder photo with placeholder copy — proves the pattern.
- "Skip to shop" link top-right drops to a Next.js list view (same data, no 3D).
- Deployed to Vercel preview URL.

**Out of M1:** custom checkout, other categories, search, filters, real 3D models, audio, animation polish, artist roster, real heritage stories, custom picks workbench, variants UI, mobile-specific gestures.

### Milestone 2 — custom checkout

Build the first-party checkout that replaces the BC hosted redirect. Same backend, our UI, in-frame.

- Integrate `@bigcommerce/checkout-sdk` against the live BC store. Confirm with client which payment provider is provisioned (Stripe / Braintree / Adyen) before starting; SDK init differs per provider.
- Checkout flow as a panel sequence layered over the room: Contact → Shipping address → Shipping method → Payment → Review.
- Shipping rates and tax fetched live from BC per address.
- Payment via hosted fields — card data tokenized in BC's iframe, never touching our DOM. PCI scope: SAQ-A.
- Order submission via SDK; success state animates the basket emptying with a "thank-you" confirmation panel and order number from BC.
- Inline error handling at each step (declined card, address validation, inventory race, network).
- Guest checkout only (no account creation in v1).
- Deployed and end-to-end test-purchased on the BC sandbox/staging store before pointing at production.

**Out of M2:** Apple Pay / Google Pay, saved customers, account login, address book, post-purchase upsell.

### Milestone 3 — content pass

Crawl `/artists/<slug>/` pages. Populate bookshelf with 40 artist profiles. Write Cry Baby and founder heritage copy with client. Add pack-size variants UI for picks. Mobile gesture polish.

### Milestone 4 — visual pass

Replace primitives with real 3D models (stock + 4–5 commissioned hero objects). Lighting, materials, post-processing. Audio cues. Authored animation polish (fly-to-basket arc, dive transitions, idle ambient motion).

### Milestone 5 — full catalog

Remaining categories wired (strings, slides, straps, cables, apparel). In-fiction filter UIs. Search. Curation/featured tooling.

## Open questions

- Final domain for the prototype (Vercel preview is fine for demo; client will eventually want a real domain).
- **Which payment provider is configured on the live BC store** (Stripe / Braintree / Adyen / other). Determines Checkout SDK init and the hosted-fields surface; needed before M2 starts.
- Whether to point the M2 checkout at the BC sandbox or directly at the production store with test-mode payment keys.
- Source of the heritage copy: client-written, ghostwritten by us with client approval, or pulled from third-party sources with citations.
- Whether to crawl artist pages now (small followup task) or defer to the content pass milestone.
- How aggressive idle animation should be (subtle ambient vs. always-something-moving). Affects perceived energy and battery on mobile.

## References

- `data/raw/sitemaps/` — full URL inventory (1,692 products, 236 categories, 27 brands)
- `data/raw/editorial/` — extracted editorial content (most pages are product grids; see audit notes)
- `data/raw/products/` — sample product page HTML and parsed schema for 9 representative SKUs
- `data/raw/api/` — Storefront GraphQL responses + the JWT capture
- `docs/audit/product-schema.md` — consolidated PDP data schema
- `docs/audit/storefront-api.md` — Storefront API access notes (this is the load-bearing doc)
