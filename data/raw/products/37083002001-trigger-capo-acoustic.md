---
url: https://www.jimdunlop.com/37083002001-trigger-capo-acoustic/
slug: 37083002001-trigger-capo-acoustic
sku: 83CB
upc: "37083002001"
product_id: 1399
title: TRIGGER® CAPO ACOUSTIC CURVED BLACK
price: $20.99
price_value: 20.99
currency: USD
fetched_at: 2026-05-08
category: capo
---

# TRIGGER® CAPO ACOUSTIC CURVED BLACK

## Header / Identifiers

- `<h1 class="productView-title" itemprop="name">` -> `TRIGGER® CAPO ACOUSTIC CURVED BLACK`
- `<span data-product-sku>` -> `83CB`
- Hidden form `<input name="product_id" value="1399">` (BigCommerce product ID)
- UPC `37083002001` (slug appears to be the UPC)

## Price

- Visible price: `$20.99` in `<span data-product-price-without-tax>`
- Microdata: `itemprop="offers"` with nested `<meta itemprop="price" content="20.99">`, `priceCurrency="USD"`, `valueAddedTaxIncluded=false`
- Availability: `<meta itemprop="availability" content="http://schema.org/InStock">`
- No compare-at / sale price element shown (`rrp-price--withoutTax` and `non-sale-price--withoutTax` containers exist but are empty / hidden)

## Variants / Options

- None on this product page. No `data-product-attribute` selector. Add-to-cart form is a single-SKU buy.
- Related capo finishes (NICKEL, GOLD, FLAT BLACK, FLAT NICKEL, ELECTRIC) are linked as separate products in the Related Gear carousel.

## Images

- 2 images encountered as `data-image-gallery-item`. Pattern:
  - `https://cdn11.bigcommerce.com/s-n26aknlnlm/images/stencil/{size}/products/{product_id}/{image_id}/{UPC}.{view-tag}__{cache_id}.{timestamp}.jpg`
  - Sizes used: `500x659` (gallery main), `1280x1280` (zoom), `100x100` (thumb)
  - View tags seen: `MAIN`, `PT01`/`PT02` etc.

## Description

> This curved-radius acoustic guitar capo allows you to quickly and easily change key with a squeeze of the hand without hindering your fingers or scratching the neck of your guitar.

Lives in `<article class="productView-description" itemprop="description">` -> first inner `<div class="productView-description">`.

## "Long Story" / Marketing copy

`<section id="longstory" class="infotabs">` (no `data-position` on this product). HTML body text:

> The Dunlop Trigger Capo allows you to quickly and easily change key with a squeeze of the hand. This capo's strong spring-action clamp keeps it firmly in place, while its slim profile ensures that you can play up and down the fingerboard unhindered. Special padding protects your instrument's neck from scratches. Made from lightweight aircraft-grade aluminum, the Trigger Capo is a must on the road when you need to change key on the fly.
>
> Acoustic Curved - Black

## Other tabs / sections present

- `<section id="productdemo" class="infotabs">` - YouTube embed iframe (`https://www.youtube.com/embed/cOwM6s_KSs0`)
- `<section id="feed" class="infotabs">` - Juicer social feed (`data-feed-id="dunlopcapos"`)
- `<section id="relatedproducts" class="infotabs">` - "Related Gear" carousel

No "Tech Specs" / "Features" table on this product. No reviews section rendered.

## Specifications / Features

None present as structured data. Spec-like info is sometimes embedded inside the description copy ("Acoustic Curved - Black"), but is not in a table.

## Related Gear (related products)

8 related cards in `#productCarousel`. Each `<article class="card">` includes:
- product URL, image (500x659), title (`card-title`), SKU (`card-productCode`), price, BC product_id (on the add-to-bag button).

Sample related SKUs: 83CN, 83CG, 84FB, 63CBK, 84FN.

## Reviews

No `<div class="productView-rating">` rendered. `themeSettings.show_product_reviews=true` and `productpage_reviews_count=9` (so the module is enabled) but no reviews exist for this product.

## Manuals

`<a class="ic ic-manual" href="/content/manuals/...pdf">` block was not present on this page (capos generally lack a PDF manual).

## JSON-LD

None. The site uses **schema.org microdata** (itemscope / itemprop) inline on the HTML, NOT JSON-LD.

## BCData (inline JS object)

```js
var BCData = {
  "product_attributes": {
    "sku": "83CB",
    "upc": "37083002001",
    "mpn": null,
    "gtin": null,
    "weight": null,
    "base": true,
    "image": null,
    "price": {
      "without_tax": {"formatted":"$20.99","value":20.99,"currency":"USD"},
      "tax_label": "Tax"
    },
    "out_of_stock_behavior": "label_option",
    "out_of_stock_message": "Out of stock",
    "available_modifier_values": [],
    "in_stock_attributes": [],
    "stock": null,
    "instock": true,
    "stock_message": null,
    "purchasable": true,
    "purchasing_message": null,
    "call_for_price_message": null
  }
};
```

## stencilBootstrap("product", {...})

Large config blob (theme settings, urls, b2bSettings) — page-template type is `pages/product`, store_hash `n26aknlnlm`, channel_id 1, storefront_api token present. Same shape on every product page.

## "atc-product" (Also-bought / cross-sell IDs)

`<dl class="productView-info">` lists three product IDs: `1402`, `1400`, `1404` — these are referenced by a 3rd-party "advanced quantity" / cross-sell script.
