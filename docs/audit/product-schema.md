# jimdunlop.com — Product Page Data Schema (Audit)

**Sample size:** 9 products spanning capo, pedal (×2), slide, strap, strings, cable, pick (×2).
**Platform:** BigCommerce on a customized Stencil theme (`store_hash: n26aknlnlm`, `channel_id: 1`, template `pages/product`).
**Fetched:** 2026-05-08.
**Source files:** `data/raw/products/_raw/<slug>.html` (raw) and `data/raw/products/<slug>.md` (extracted).

---

## TL;DR

- **No JSON-LD anywhere.** The store uses inline schema.org **microdata** (`itemscope` / `itemprop`) — and only for `Product`, `Offer`, `PriceSpecification`, `ItemAvailability`, `OfferItemCondition`, and a (rendered-empty) `BreadcrumbList`. There is no `AggregateRating`, no `Brand`, no `Manufacturer`, no `image` on the Product, no `description` extracted to microdata text (it's the inner HTML of the description article).
- **The most useful inline JS state object is `var BCData`** — it's emitted on every product page and contains the canonical SKU/UPC/price (formatted + numeric), purchasable/instock flags, and (when present) variant value IDs.
- **`window.stencilBootstrap("product", {...}).load()`** is also emitted on every product page; the giant config blob is mostly theme settings and global URLs, but it carries the Storefront API JWT (short-lived), `cdn_url`, `secure_base_url`, `store_hash`, `template`, etc. Same blob shape on every page.
- **Variants are exceedingly rare in this catalog.** Only the picks have a true BigCommerce option (a "Pack size" select). Everything else (capos, pedals, slides, straps, strings, cables) is one-SKU-per-URL — color/size/gauge/length variations are modeled as separate products.
- **Specifications, features, and dimensions are almost always prose** in the description body. The only structured fields rendered server-side are: title, sku, upc, price, currency, availability, image URLs, and (for picks) one option-value list.
- The site links a 3rd-party "Multi-Qty Product Options" widget (loaded as an async script from `d318p1ys3t24hm.cloudfront.net/scripts/latest/multi-qty-product-options.js`); it consumes the `<dl class="productView-info">` `atc-product` IDs to build a cross-sell / quantity matrix at runtime. Anything that widget shows is **not** in the static HTML.

---

## Field schema (union across all 9 products)

Legend: **U** = universal (present on every product page), **C** = category-specific or conditional, **HTML** = reliably extractable from the static HTML (microdata or BCData), **JS-render** = injected client-side after page load (e.g., from a 3rd-party widget or a Storefront API call), **API** = needs a BigCommerce API call to obtain.

| Field | Coverage | Source | Notes |
|---|---|---|---|
| `title` | U | HTML — `<h1 class="productView-title" itemprop="name">` | All-caps, with ®/™ glyphs preserved. |
| `sku` | U | HTML — `<span data-product-sku>` and `BCData.product_attributes.sku` | Mix of formats (`GCB95`, `83CB`, `203`, `DEN1046`, `485-05TH`, `3PDCP06`, `MX100`, `ILD04`). |
| `upc` | U | `BCData.product_attributes.upc` (NOT exposed in microdata) | Real GTIN-12 only on newer products (`MX100` -> `710137140592`). Older products use a 11-digit Dunlop-internal UPC. |
| `mpn`, `gtin` | U=null | `BCData` fields | Always null — the `upc` field carries the GTIN. |
| `product_id` | U | Hidden form input `<input name="product_id" value="…">` | BigCommerce internal product ID (numeric). Useful for Storefront/Catalog API calls. |
| `price.formatted` | U | HTML — `<span data-product-price-without-tax>` AND `BCData.product_attributes.price.without_tax.formatted` | Already includes currency symbol. |
| `price.value` | U | HTML — microdata `<meta itemprop="price">` AND `BCData...price.without_tax.value` | Numeric. |
| `price.currency` | U | microdata `<meta itemprop="priceCurrency">` AND `BCData...price.without_tax.currency` | Always `USD` on storefront. |
| `price.compareAt` (RRP / non-sale) | C, observed=0 | empty `<span data-product-rrp-price-without-tax>` and `<span data-product-non-sale-price-without-tax>` | Containers are always present but always empty in the sample. The theme supports RRP / sale, but no product in the sample is on sale. |
| `price.priceRange` (min/max) | C | `BCData...price.price_range` (only when product has options that change price) | Only seen on the THIN pick variant. |
| `availability` | U | microdata `<meta itemprop="availability">` AND `BCData.instock` (boolean) AND `BCData.purchasable` | All sample products are `InStock`. |
| `images[]` | U | `<img data-image-gallery-item data-src=…>` | URL pattern: `https://cdn11.bigcommerce.com/s-n26aknlnlm/images/stencil/{size}/products/{product_id}/{image_id}/{filename}.jpg?c={n}`. The Stencil server resizes on request — `1280x1280` (zoom) and `500x659` (gallery) are emitted side-by-side. Filenames encode view-tags: `MAIN`, `LEFT`, `RGHT`, `TOPP`, `BOTT`, `BACK`, `PT01`, `PT02`. Older filenames are `<UPC>.<view>__<cache>.<ts>.jpg`; newer ones are `<SKU>.<view>__<cache>.<ts>.jpg`. |
| `images.count` | U | derived | Range observed: 2–6. |
| `description` | U | `<article class="productView-description" itemprop="description">` -> first inner `<div class="productView-description">` | Free HTML (paragraphs, lists, inline `<br>`). For some categories it doubles as the spec sheet (slide dimensions, strings gauges, strap length). |
| `longStory` | C | `<section id="longstory" class="infotabs">` | Long marketing copy. Sometimes contains `<h4>` sub-headings (Rockman X100). Pedals/picks/strings/capos: yes. Slide: no. |
| `productDemo` | C | `<section id="productdemo" class="infotabs">` -> `<iframe src="https://www.youtube.com/embed/{id}…">` | Youtube embed. Capo, pedals, slide: yes. Strap, strings, cable, picks: no. |
| `inTheNews` | C | `<section id="inthenews" class="infotabs">` | Flat `<ul>` of external article links (lifestyle.jimdunlop.com or Youtube). Pedals, strings: yes. Others: no. |
| `feed` (social) | C | `<section id="feed" class="infotabs">` -> Juicer.io embed (`<ul class="juicer-feed" data-feed-id="…">`) | Different `data-feed-id` per product family (`crybabywah`, `mxr`, `dunlopcapos`, `dunlopstrings`, `mxrcables`, `dunlopstraps`, none on slide & picks). |
| `manualPdf` | C | `<a class="ic ic-manual" href="/content/manuals/{file}.pdf">` | Pedals: SKU-named (e.g. `GCB95.pdf`, `MX100.pdf`). Capos: none. Slide: shared "Slide_Chart.pdf". Strings/strap/cable/picks: none. |
| `relatedProducts[]` | U | `<section id="relatedproducts">` -> `<section id="productCarousel">` -> N × `<article class="card">` | 4–15 cards observed. Each card has: URL, image, title, SKU, price, BC `data-product-id`. |
| `crossSellIds[]` ("atc-product") | U | `<dl class="productView-info"><dd class="productView-info-value atc-product">` | Always 3 numeric BC product IDs. Consumed by the 3rd-party Multi-Qty widget. Distinct from related products. |
| `breadcrumbs` | U=empty | `<ul class="breadcrumbs" itemscope itemtype="http://schema.org/BreadcrumbList">` | Markup is emitted but `themeSettings.hide_breadcrumbs=true`, so the `<ul>` is empty in every page. (Category context must come from elsewhere — either category landing pages or the BC API.) |
| `reviews` | C, observed=0 | (none in the static HTML) | `themeSettings.show_product_reviews=true`, `productpage_reviews_count=9`. The reviews list renders client-side from BC data. None of our 9 products have any reviews on the page. No `aggregateRating` microdata is emitted. |
| `manufacturer` / `brand` | not in HTML | — | Brand (Dunlop / MXR / Cry Baby / Way Huge / etc.) is implied only by the SKU prefix or the Juicer feed ID. Not exposed as a structured field. |
| `weight`, `dimensions`, `mpn` | U=null | `BCData` fields | Always null in HTML. Probably populated in the BC Catalog API but not surfaced to the storefront. |
| `customFields` | not in HTML | — | `themeSettings.show_custom_fields_tabs=false`. Custom fields, if any, must be fetched via the BC Catalog API. |
| `videos[]` | C (single) | One iframe in the productdemo section | `themeSettings.productpage_videos_count=8` suggests the theme could support up to 8 videos, but only 1 iframe is emitted on the products in our sample. |

### Variants / Options

This is the most important question for the rebuild and is worth restating.

| Where | What |
|---|---|
| HTML | `<form data-cart-item-add>` contains, when there are options, a `<div class="components-products-options">` block holding one or more `<div class="form-field" data-product-attribute="set-select">` — only `set-select` was observed; BC also supports `set-rectangle`, `set-radio`, `set-swatch`, `product-list-image`, `set-textarea`, `set-checkbox`, `set-input`, `set-date`. None of those were seen in the sample. |
| Each option | `<select name="attribute[{group_id}]" id="attribute_select_{group_id}">` with `<option data-product-attribute-value="{value_id}" value="{value_id}">{display label}</option>`. The display label (e.g., "12 Pk", "72 Pk") is the only human-readable indication of the variant. |
| BCData | `"available_modifier_values"`, `"available_variant_values"`, `"in_stock_attributes"`, `"selected_attributes"` — all arrays of integer attribute-value IDs. `"base":true` means "this URL is the base product" (no variant selected); `"base":false` means the URL maps to a non-default variant. |
| Cross-product mapping | **Across pick products, the `set-select` group IDs differ** (1415 for medium pick, 1416 for thin pick). Option values (1892–1895) are also unique per-product. So you cannot deduplicate "12 Pk" across the catalog from HTML alone — that information lives in the BC API. |

**For the rebuild:** if we drop variants entirely we lose the picks pack-size selector. If we keep them we have to fetch BC option groups + values through the Catalog API (or shadow them in our own model).

---

## Specifications & features — what's actually structured

In the sampled HTML, the following category-specific data items are **not** structured anywhere; they only exist as plain prose inside the description or long-story `<div>`s:

| Category | Spec data (prose only) |
|---|---|
| Capo | Curve type ("Curved"), color ("Black"), instrument type ("Acoustic") — encoded in the title and a single trailing line of long-story text. |
| Pedal | Power requirements, controls list, modes, I/O, dimensions, weight, true bypass — all in long-story prose with `<h4>` sub-headings on richer products (Rockman X100). |
| Slide | Inner Diameter / Outer Diameter / Length / Ring Size — single `\|`-delimited string in the description (e.g., "Inner Diameter 22mm \| Outer Diameter 25mm \| Length 69mm \| Ring Size 12-13"). Material (Glass) is in the title only. |
| Strap | Length range — single line in the description ("Length: Min 37" / Max 65""). Width, material, ends, pull-test rating only mentioned in long-story prose. |
| Strings | Gauges — single line in the description ("Gauges: 10, 13, 17, 26, 36, 46 Electric - Nickel Wound - Light"). Core material in the title. |
| Cable | Length — only in the title and the description prose ("These 6" patch cables…"). Conductor material, jacket, end style — all in long-story prose. |
| Pick | Material (Celluloid), shape (Teardrop), gauge (Thin/Medium/Heavy/Extra Heavy), color (Shell) — title only. Pack size — structured as a BC product option. |

If we want a clean catalog model, we will need to either (a) parse these prose fields ourselves with category-specific extractors, (b) use the BigCommerce Catalog API for the underlying custom fields if any exist, or (c) build the structured spec data ourselves during the rebuild.

---

## JSON-LD: presence, completeness

Verdict: **NOT PRESENT.** No `<script type="application/ld+json">` blocks anywhere on any of the 9 product pages.

The only schema.org content is **inline microdata** with this shape (annotated, real example from `cry-baby-standard-wah.html`):

```html
<!-- Outer Product wrapper -->
<div itemscope itemtype="http://schema.org/Product">

  <!-- Title becomes the Product 'name' -->
  <h1 class="productView-title" itemprop="name">CRY BABY® STANDARD WAH</h1>

  <!-- Description body becomes the 'description' (HTML in microdata, not text) -->
  <article class="productView-description" itemprop="description">…</article>

  <!-- Offer block sits inside the price section -->
  <div class="price-section now-price"
       itemprop="offers" itemscope itemtype="http://schema.org/Offer">

    <!-- Visible currency-formatted price (display only) -->
    <span data-product-price-without-tax class="price">$99.99</span>

    <!-- Microdata: availability + condition (always InStock + Condition) -->
    <meta itemprop="availability" content="http://schema.org/InStock">
    <meta itemprop="itemCondition" content="http://schema.org/Condition">

    <!-- Numeric price + currency, machine-readable -->
    <div itemprop="priceSpecification" itemscope
         itemtype="http://schema.org/PriceSpecification">
      <meta itemprop="price"          content="99.99">
      <meta itemprop="priceCurrency"  content="USD">
      <meta itemprop="valueAddedTaxIncluded" content="false">
    </div>

  </div>
</div>
```

What's **missing** vs a complete e-commerce JSON-LD:

- No `image` on the Product (the URLs are in `<img data-src>` only).
- No `sku`, `mpn`, `gtin13`, `brand`, `manufacturer`, `category`, `weight`, `model` microdata fields.
- No `aggregateRating` / `review`.
- No `priceValidUntil`, no `seller`, no `url` on the Offer.
- The `BreadcrumbList` `<ul>` is emitted but completely empty (the theme is configured to hide breadcrumbs).

So microdata alone is **not** sufficient for SEO rich-results. Anyone who wants Google merchant cards / rich snippets has to assemble them client-side from BCData + the description.

A complete annotated JSON-LD shape we'd want to emit on the rebuild (this is a target schema, NOT something parsed off the live site):

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "CRY BABY® STANDARD WAH",
  "sku": "GCB95",
  "gtin12": "11095000001",
  "brand": { "@type": "Brand", "name": "Dunlop" },
  "category": "Effects Pedals > Wah",
  "description": "This Cry Baby Wah features the legendary Fasel® inductor…",
  "image": [
    "https://cdn11.bigcommerce.com/s-n26aknlnlm/images/stencil/1280x1280/products/583/6157/11095000001.MAIN__82256.1663874792.jpg",
    "https://cdn11.bigcommerce.com/s-n26aknlnlm/images/stencil/1280x1280/products/583/6158/11095000001.LEFT__57452.1663874792.jpg"
  ],
  "offers": {
    "@type": "Offer",
    "price": "99.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "url": "https://www.jimdunlop.com/cry-baby-standard-wah/"
  }
}
```

---

## Inline JS state objects (mineable for catalog data)

### `var BCData` — every product page

```js
var BCData = {
  "product_attributes": {
    "sku": "...",            // canonical SKU
    "upc": "...",            // UPC/GTIN string (Dunlop-internal or real GTIN-12)
    "mpn": null, "gtin": null, "weight": null,
    "base": true,            // false when the URL maps to a non-default variant
    "image": null,           // would be a variant-image URL when set
    "price": {
      "without_tax": {"formatted":"$X.XX","value":X.XX,"currency":"USD"},
      "tax_label": "Tax",
      // present only when options change price:
      "price_range": {
        "min": {"without_tax":{"formatted":"$X.XX","value":X.XX,"currency":"USD"}},
        "max": {"without_tax":{"formatted":"$X.XX","value":X.XX,"currency":"USD"}}
      }
    },
    "out_of_stock_behavior": "label_option",
    "out_of_stock_message": "Out of stock",
    // For products WITH options:
    "available_modifier_values": [],         // we never observed any non-empty
    "available_variant_values":  [1894,1895],
    "in_stock_attributes":       [1894,1895],
    "selected_attributes":       [],
    // Stock / purchasability:
    "stock": null, "instock": true, "stock_message": null,
    "purchasable": true, "purchasing_message": null,
    "call_for_price_message": null
  }
};
```

### `window.stencilBootstrap("product", "{...}").load()` — every product page

Single argument is a JSON-stringified config blob (the `\\"`-escaped form is literal in the script tag). Its top-level keys:

- `themeSettings` — hundreds of theme keys; useful ones: `hide_breadcrumbs`, `show_product_reviews`, `show_product_reviews_tabs`, `productpage_reviews_count`, `productpage_related_products_count`, `productpage_similar_by_views_count`, `productpage_videos_count`, `show_custom_fields_tabs`, `show_product_dimensions`, `show_product_weight`, `pdp-sale-price-label` ("Now:"), `pdp-non-sale-price-label` ("Was:"), `pdp-retail-price-label` ("MSRP:"), `productgallery_size`, `zoom_size`, `swatch_option_size`.
- `urls` — the standard BC URL map (cart, checkout, login, account, wishlist, …).
- `secureBaseUrl`, `cartId`, `template` (`pages/product`), `customer`, `store_hash` (`n26aknlnlm`), `cdn_url`.
- `b2bSettings` — `channel_id:1`, `site_id:1000`, `request.absolute_path` (the slug), and a **`storefront_api.token`** JWT (short-lived, JWT decodes to `cid:[1], iss:"BC", sub:"BC", token_type:1, exp:~48h`).
- `general.storeId: 1000105895`.

The `storefront_api.token` is the most useful artifact in this blob — it can be used against `https://www.jimdunlop.com/api/storefront/...` for product, cart, and customer endpoints without authenticating, but it expires every ~48 hours.

### `<dl class="productView-info">` "atc-product" IDs

Always 3 numeric BC product IDs. Read by `multi-qty-product-options.js` (loaded async from CloudFront). These appear to be cross-sell complement products. They are NOT the related products carousel.

---

## Universal vs category-specific summary

| Field | Capo | Pedal | Slide | Strap | Strings | Cable | Pick |
|---|---|---|---|---|---|---|---|
| title, sku, upc, product_id, price, currency, availability | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| description (HTML) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| images (multi) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| relatedProducts carousel | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| crossSellIds (atc-product) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| longStory section | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ |
| productDemo (YouTube iframe) | ✓ | ✓ | ✓ | — | — | — | — |
| inTheNews links | — | ✓ | — | — | ✓ | — | — |
| Juicer social feed | ✓ | ✓ | — | ✓ | ✓ | ✓ | — |
| manualPdf | — | ✓ | (shared chart) | — | — | — | — |
| BC product **option** (variants) | — | — | — | — | — | — | ✓ ("Pack") |
| Compare-at / sale price | observed=0 (markup present, empty) |
| Reviews / aggregateRating | observed=0 (theme enabled) |
| Structured spec table | NEVER — all spec data is in description prose |

---

## Reliability of HTML extraction vs API

| Data | Static HTML | Need BC API |
|---|---|---|
| Title, SKU, UPC, price, currency, availability | ✓ reliable (microdata + BCData) | not needed |
| Image URLs | ✓ reliable (`data-src` on `data-image-gallery-item`) | optional for source-of-truth file names |
| Description, long story | ✓ reliable (HTML) | not needed |
| Variants (option groups + values) | ✓ for one product, but option group IDs are per-product, not deduplicated | needed if we want global "pack size" / "gauge" facets |
| Brand / manufacturer | ✗ never exposed | needed |
| Categories / breadcrumbs | ✗ DOM is empty | needed |
| Custom fields (any internal-spec metadata) | ✗ `show_custom_fields_tabs=false` | needed |
| Reviews | ✗ none in static HTML | needed (BC has a reviews API) |
| Cross-sell / related products | ✓ in carousel cards (URL, SKU, title, price, image, BC id) | optional — API gives canonical lists |

Recommended approach for the rebuild:

1. Extract title/SKU/UPC/price/availability/images/description from the static HTML — that data is reliable and complete.
2. Treat description prose as the source of truth for category-specific specs (slide dimensions, strings gauges, strap length, cable length, pick gauge), and write small per-category extractors against well-known patterns.
3. Pull canonical brand/category/custom-fields/reviews from the BigCommerce Catalog & Reviews APIs.
4. Picks are the only product family with a real BigCommerce option (Pack size). Either model picks as variant products in our own catalog or treat each (pick × pack-size) combination as a separate SKU.
