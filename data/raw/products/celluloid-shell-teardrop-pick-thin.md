---
url: https://www.jimdunlop.com/celluloid-shell-teardrop-pick-thin/
slug: celluloid-shell-teardrop-pick-thin
sku: 485-05TH
upc: "24485054012"
product_id: 340
title: CELLULOID SHELL TEARDROP PICK THIN
price: $5.76
price_value: 5.76
currency: USD
price_range_min: 5.76
price_range_max: 26.24
fetched_at: 2026-05-08
category: pick
has_variants: true
---

# CELLULOID SHELL TEARDROP PICK THIN

## Identifiers

- Title: `CELLULOID SHELL TEARDROP PICK THIN`
- SKU: `485-05TH`
- BC product_id: `340`
- UPC: `24485054012`

## Price

- Starting `$5.76` USD, **price range: $5.76 – $26.24** (depends on Pack selection — see Variants).
- BCData exposes `price_range.min` and `price_range.max`.

## Variants — THIS IS THE ONLY PAGE WITH VARIANTS IN THE SAMPLE

Picks have a **"Select a Pack" dropdown** rendered as a BigCommerce product modifier:

```html
<div class="form-field form-field--pack" data-product-attribute="set-select">
  <label for="attribute_select_1416">Select a Pack</label>
  <select name="attribute[1416]" id="attribute_select_1416" required>
    <option value="" selected disabled hidden>Choose option</option>
    <option data-product-attribute-value="1895" value="1895">12 Pk</option>
    <option data-product-attribute-value="1894" value="1894">72 Pk</option>
  </select>
</div>
```

- Option attribute (group) ID: `1416` ("Pack")
- Option value IDs: `1895` (12 Pk), `1894` (72 Pk)
- Encoding type: `set-select` (BigCommerce option-display value). Other possible types in BC are `set-rectangle` (button group), `set-radio`, `swatch`, etc. — they were NOT seen on this site for any product in the sample, only `set-select`.
- Note that the option group IDs differ across pick products (medium pick uses option attribute `1415` with values `1893`/`1892`). So option groups are not shared across pick products — every pick product owns its own attribute.

BCData also exposes:

```json
"available_variant_values": [1894, 1895],
"in_stock_attributes":      [1894, 1895],
"selected_attributes":      []
```

## Images

- 3 images.

## Description

> Get the warm tone and traditional feel of high quality Genuine Celluloid in the classic tear drop shape—perfect for single note runs.

## Long Story

> Get your Celluloid Picks from the pick-making experts. Celluloid is the original tortoiseshell substitute—it's remarkably close in feel, timbre, and appearance with even greater flexibility...

## Specifications / Features

- Gauge ("Thin") is encoded only via the **product title**, NOT as a structured attribute.
- Pack size is the only structured attribute (a BC product option).

## Other tabs

- `relatedproducts` carousel with 8 cards (other celluloid picks)
- No `productdemo`, no `feed`, no `inthenews`.

## Reviews

None rendered.

## JSON-LD

None.

## BCData

```json
{"product_attributes":{
  "sku":"485-05TH","upc":"24485054012",
  "mpn":null,"gtin":null,"weight":null,
  "base":false,
  "image":null,
  "price":{
    "without_tax":{"formatted":"$5.76","value":5.76,"currency":"USD"},
    "tax_label":"Tax",
    "price_range":{
      "min":{"without_tax":{"formatted":"$5.76","value":5.76,"currency":"USD"},"tax_label":"Tax"},
      "max":{"without_tax":{"formatted":"$26.24","value":26.24,"currency":"USD"},"tax_label":"Tax"}
    }
  },
  "out_of_stock_behavior":"label_option","out_of_stock_message":"Out of stock",
  "available_modifier_values":[],
  "available_variant_values":[1894,1895],
  "in_stock_attributes":[1894,1895],
  "selected_attributes":[],
  "stock":null,"instock":true,"stock_message":null,
  "purchasable":true,"purchasing_message":null,
  "call_for_price_message":null
}}
```

`base:false` is a strong tell that the product has variants (price varies by selection).
