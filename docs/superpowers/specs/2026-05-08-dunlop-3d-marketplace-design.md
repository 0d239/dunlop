# Dunlop 3D Marketplace — Design

**Date:** 2026-05-08
**Status:** Approved (pending client review)
**Author:** working session with Efra
**Repository:** /Users/3fra/dev/dunlop

## Overview

Rebuild jimdunlop.com as a Three.js-based diegetic marketplace: a single, orthographic, Animal-Crossing-style room where every product category is represented by a physical object, the cart is an actual basket sitting in the room, and editorial/heritage content surfaces contextually when a user picks up the object it relates to. The goal is a brand experience that is also fully transactional, with no friction tax for shoppers who just want to buy.

The existing site is a BigCommerce + Stencil store. The new front-end is a "head" on top of that backend — we read live catalog data from BigCommerce's public Storefront GraphQL API, build the cart via BigCommerce's Cart API, and hand off checkout to BigCommerce's hosted checkout. We do not replace the commerce backend.

## Goals

1. A diegetic 3D shopping experience that reads as distinctly Dunlop, not as a generic e-commerce front-end.
2. A working end-to-end shoppable prototype on real product data, fast enough to demo to the client and earn budget for the visual pass.
3. Editorial / heritage content surfaces in-context, not as a separate "history" section.
4. The cart is a continuously-visible, always-alive object in the world.
5. SEO and accessibility are first-class — every product page is reachable without rendering 3D.

## Non-goals

- Replacing or migrating BigCommerce.
- Building our own checkout / payments / tax engine.
- Walkable first-person navigation.
- Multiple rooms / floors in v1.
- Multiplayer, avatars, day/night cycles.
- A custom CMS in v1 (editorial lives as MDX in the repo).
- User accounts / login in v1.

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

A single orthographic interior — a musician's studio. Warm wood floor, exposed brick or paneled wall, a window throwing late-afternoon light, a record player or small amp humming in the corner. Black/white/red brand accents. Period-stylized wall signage ("DUNLOP. SINCE 1965.", "PERFORMANCE IS EVERYTHING.").

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

- **Default view** — orthographic camera at an elevated angle. Drag rotates the room (limited arc, ~180°). Pinch / scroll zooms slightly. Idle drift returns to default.
- **Hover / tap-hold** — interactable objects glow and show a label.
- **Click → dive** — camera animates into the object, room blurs, content panel slides in from the right. Breadcrumb top-left, persistent cart icon top-right.
- **Exit** — empty space, ESC, or back arrow returns to room.
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

**Basket as physical object.** In room view, the basket sits near the door. Items added literally appear in the basket as miniatures. Clicking the basket (or the persistent top-right cart icon) opens the cart panel.

**Cart panel.** Line items: thumbnail, name, variant, qty stepper, line total, remove. Subtotal at the bottom. Primary "Checkout" button. Empty state encourages return-to-room.

**Backend.** BigCommerce Cart API via GraphQL using the same Storefront token. Cart ID stored in `localStorage` + cookie; BigCommerce persists carts ~30 days server-side. The cart UI reads live from BC — they own the source of truth on prices and availability.

**Checkout handoff.** "Checkout" → redirect to `https://www.jimdunlop.com/checkout` with the cart cookie attached. BigCommerce's existing themed checkout takes over. No payment integration on our side in v1, no PCI scope. v2 may move to embedded checkout for visual continuity.

**Edge cases.** Out-of-stock blocks add and shows inline error. Quantity caps at available. Stale cart clears local state and surfaces a one-time toast. Network failures retry with subtle UI feedback.

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
- **Styling:** Tailwind for 2D UI overlays.
- **3D:** react-three-fiber + drei + (dev-only) leva. glTF/glb models with Draco compression. Texture atlases.
- **State:** Zustand. Single client store for cart, dive context, hover state, audio settings.
- **Data layer:** Server-side wrapper around BigCommerce Storefront GraphQL (`https://www.jimdunlop.com/graphql`). Queries cached with Next.js `fetch` cache (`revalidate: 3600` for catalog, `0` for cart/availability).
- **JWT refresh:** lazy — when a server-side query 401s, we re-fetch the homepage HTML, extract the JWT (regex `eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+`), persist to a server-side store, retry the query. No cron required.
- **Editorial CMS:** MDX files in a `content/` folder. Upgrade to Sanity or Payload in v2 if the client needs self-edit.
- **Audio:** Howler.js. Opt-in, default off, persistent toggle.
- **Auth:** none in v1. Cart is anonymous via BC cookie.
- **Analytics:** Vercel Analytics + Speed Insights. Custom event hooks (dive entered, item added, checkout started) wired but dashboard is v2.

### 3D asset strategy

**v1: primitive placeholders.** Boxes, cylinders, low-poly stand-ins. Untextured. Real interaction graph, scene composition, and dive logic — only the geometry is throwaway. This is intentional: M1 proves the concept end-to-end without burning budget on art.

**Later:** stock models (Sketchfab/TurboSquid) for generic furniture/lighting + commissioned hero objects (vintage Cry Baby, branded pick jar, period signage, branded amp). The R3F scene graph stays the same; only the model files swap.

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

The minimum that proves the concept on real data and earns credentials + budget.

- One basic room with ~6 placeholder primitive objects: pedalboard, pick jar, capo peg, strap rack, bookshelf, basket.
- Orthographic camera, drag-to-rotate, click-to-dive, ESC/back.
- 2-3 categories live on BigCommerce GraphQL: picks, pedals, capos. Other room objects show a "Coming soon" panel.
- Real product detail dives (title, price, image, description, Add to cart).
- Live cart: items add to BC via cart mutation, badge animates, basket count updates, cart panel lists items, **Checkout redirects to jimdunlop.com/checkout** with cart cookie.
- One editorial dive — founder photo with placeholder copy — proves the pattern.
- "Skip to shop" link top-right drops to a Next.js list view (same data, no 3D).
- Deployed to Vercel preview URL.

**Out of M1:** other categories, search, filters, real 3D models, audio, animation polish, artist roster, real heritage stories, custom picks workbench, variants UI, mobile-specific gestures.

### Milestone 2 — content pass

Crawl `/artists/<slug>/` pages. Populate bookshelf with 40 artist profiles. Write Cry Baby and founder heritage copy with client. Add pack-size variants UI for picks. Mobile gesture polish.

### Milestone 3 — visual pass

Replace primitives with real 3D models (stock + 4-5 commissioned hero objects). Lighting, materials, post-processing. Audio cues.

### Milestone 4 — full catalog

Remaining categories wired (strings, slides, straps, cables, apparel). In-fiction filter UIs. Search. Curation/featured tooling.

## Open questions

- Final domain for the prototype (Vercel preview is fine for demo; client will eventually want a real domain).
- Whether the client wants to swap to embedded BigCommerce checkout (v2) or stay with redirect handoff.
- Source of the heritage copy: client-written, ghostwritten by us with client approval, or pulled from third-party sources with citations.
- Whether to crawl artist pages now (small followup task) or defer to M2.

## References

- `data/raw/sitemaps/` — full URL inventory (1,692 products, 236 categories, 27 brands)
- `data/raw/editorial/` — extracted editorial content (most pages are product grids; see audit notes)
- `data/raw/products/` — sample product page HTML and parsed schema for 9 representative SKUs
- `data/raw/api/` — Storefront GraphQL responses + the JWT capture
- `docs/audit/product-schema.md` — consolidated PDP data schema
- `docs/audit/storefront-api.md` — Storefront API access notes (this is the load-bearing doc)
