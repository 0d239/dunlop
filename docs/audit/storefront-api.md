# BigCommerce Storefront API Audit — jimdunlop.com

Date: 2026-05-08
Probe target: `https://www.jimdunlop.com/`
Store hash: `n26aknlnlm`
Channel ID: `1`
Site ID: `1000`
Theme: Stencil (theme version `2d490620-2b37-013f-fe2e-6636e0b6f4cb`)

## TL;DR — Decisive Answer

**YES. The public BigCommerce Storefront GraphQL API can power a new front-end on its own — no admin credentials, no scraping required.**

Evidence: anonymously fetched the homepage, lifted the embedded Storefront API JWT, and successfully retrieved real product, category, brand, search, and pagination data via `POST /graphql`. The catalog reports **1,692 products** via `collectionInfo.totalItems`, paginated with cursors. Introspection is enabled, so we can map the full schema.

The only caveat is token rotation: the JWT we captured expires `eat = 1778416215` (2026-05-10). The merchant's theme will issue a fresh one on every page load, so the integration model is "fetch homepage → extract token → use until refresh," which the new front-end (or a backend job) can do automatically.

---

## 1. Token Discovery

### Where it lives in the page
The Stencil bootstrap config is rendered inline in `<script>window.stencilBootstrap("default", "{...}").load();</script>` near the bottom of the homepage. Inside that JSON:

```json
"storefront_api": {
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJjaWQiOlsxXSwi..."
}
```

A second copy appears as `graphQLToken` in the `PapathemesMultiQtyProductOptionsSettings` config block immediately below.

### Reproducible extraction recipe
```bash
curl -sL -A "Mozilla/5.0" https://www.jimdunlop.com/ \
  | grep -oE 'eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+' \
  | sort -u | head -1
```
The first JWT match on the page is the Storefront token. (Also retrievable by JSON-parsing the `stencilBootstrap` argument and reading `storefront_api.token` — more robust if the page layout changes.)

### Decoded JWT payload
```json
{
  "cid": [1],
  "cors": ["https://www.jimdunlop.com"],
  "eat": 1778416215,
  "iat": 1778243415,
  "iss": "BC",
  "sid": 1000105895,
  "sub": "BC",
  "sub_type": 0,
  "token_type": 1
}
```
- `cid: [1]` — channel 1 (the public storefront channel)
- `cors` — the token is bound to `https://www.jimdunlop.com` via CORS, but **server-side curl with no Origin header is accepted** (verified)
- `eat - iat = 172800s = 48h` lifetime; the homepage rotates one in on each render so a daily refresh is more than safe.

Saved at: `data/raw/api/storefront_token.txt`

---

## 2. REST Endpoint Status

| Endpoint | Status | Notes |
|---|---|---|
| `GET /api/storefront/products?limit=5` | **404** | No such route on Stencil — products live in GraphQL only |
| `GET /api/storefront/categories` | **404** | Same — GraphQL only |
| `GET /api/storefront/v3/products` | **404** | (v3 admin REST is server-side only) |
| `GET /api/storefront/order` | **404** | |
| `GET /api/storefront/checkouts` | **404** | |
| `GET /api/storefront/carts` | **200** | Returns `[]` for anonymous session — the only first-party REST endpoint that responds. Used by the cart UI; useful only if we keep BC checkout. |

The Stencil first-party REST API surface that is publicly reachable on this store is effectively just the cart/checkout helpers. **Catalog reads must go through GraphQL.**

Raw responses:
- `data/raw/api/rest_cart.json`
- `data/raw/api/rest_products.json` (empty, 404)
- `data/raw/api/rest_categories.json` (empty, 404)

---

## 3. GraphQL Endpoint

### Endpoint
`POST https://www.jimdunlop.com/graphql`
Header: `Authorization: Bearer <token>`
Header: `Content-Type: application/json`

### Auth requirement
- WITHOUT bearer token: `HTTP 401 — {"errors":[{"message":"GraphQL credentials were missing. No token was sent."}]}`
- WITH the captured token: `HTTP 200` for every query below.

### Queries that work

#### Sanity check
```graphql
{ site { settings { storeName storeHash } } }
```
Response: `{"data":{"site":{"settings":{"storeName":"Dunlop","storeHash":"n26aknlnlm"}}}}`
File: `data/raw/api/gql_storename.json`

#### Rich products list (5 products)
```graphql
{
  site {
    products(first: 5) {
      edges {
        node {
          entityId sku name path
          defaultImage { url(width: 300) altText }
          prices {
            price { value currencyCode }
            retailPrice { value currencyCode }
          }
          categories { edges { node { entityId name path } } }
          variants(first: 3) {
            edges {
              node {
                entityId sku
                defaultImage { url(width: 300) }
                prices { price { value } }
              }
            }
          }
        }
      }
    }
  }
}
```
Returns full product nodes including SKU, slug, CDN image URL, price, currency, category tree position, and variant details. Sample first node: `entityId 113, sku 3040T-L, "NICKEL SILVER LEFT THUMBPICKS .025 IN", $31.49 USD`.
File: `data/raw/api/gql_products.json` (4.4 KB)

#### Total catalog size + cursor pagination
```graphql
{ site { products { collectionInfo { totalItems } pageInfo { hasNextPage endCursor } } } }
```
Response: `{"data":{"site":{"products":{"collectionInfo":{"totalItems":1692},"pageInfo":{"hasNextPage":true,"endCursor":"eyJpZCI6MTIyfQ=="}}}}}`
**1,692 products** total, cursor-paginatable. At `first: 100` per request that's 17 requests to enumerate the full catalog.
File: `data/raw/api/gql_product_count.json`

#### Category tree + brand list
```graphql
{
  site {
    categoryTree { entityId name path productCount children { entityId name path productCount } }
    brands(first: 50) { edges { node { entityId name path defaultImage { url(width: 200) } } } }
  }
}
```
Returns the full nav tree with per-category product counts:
- `/products/` — 1,161 (Electronics 368, Guitar Picks 434, Accessories 321, Strings 111, Apparel 15)
- `/artists/` and other top-level branches also returned

File: `data/raw/api/gql_categories_brands.json` (8.1 KB)

#### Search
```graphql
query Q($q: String!) {
  site {
    search {
      searchProducts(filters: { searchTerm: $q }) {
        products {
          collectionInfo { totalItems }
          edges { node { entityId sku name path brand { name } } }
        }
      }
    }
  }
}
```
Variables `{"q":"wah"}` → 124 hits, including `CRY BABY® JUNIOR WAH`, `CAE WAH`, etc.
File: `data/raw/api/gql_search_wah.json`

#### Introspection
```graphql
{ __schema { types { name } } }
```
HTTP 200, ~23 KB response listing every type (`AddCartLineItemsDataInput`, `Product`, `Variant`, `Category`, `Brand`, etc.). **Introspection is enabled**, so we can generate a full TypeScript SDK with `graphql-codegen` against the live endpoint.
File: `data/raw/api/gql_introspection.json`

### Queries that don't work
- `searchProducts(filters: {})` — returns `"At least one filter must be provided."` Must include at least one filter such as `searchTerm`, `categoryEntityId`, `brandEntityIds`, etc. Not a blocker; for full enumeration use `site { products(first: 100, after: "...") }` instead of search.

---

## 4. Implications for the Rebuild

| Need | Public API answer |
|---|---|
| List all products (catalog enumeration) | `site.products(first, after)` — 17 paginated calls for the full 1,692 SKUs |
| Product detail (PDP) by slug | `site.route(path: "/cry-baby-standard-wah/")` returns a `Product` (standard BC schema; confirmed types exist via introspection) |
| Category landing pages | `site.category(entityId:)` or `categoryTree` for nav |
| Brand pages | `site.brands` and `site.brand` |
| Search | `site.search.searchProducts` with `searchTerm` filter |
| Variants, pricing, stock | All on `Product`/`Variant` nodes (verified `variants`, `prices` fields return data) |
| Images | CDN URLs on `defaultImage` and `images` fields, requestable at arbitrary widths |
| Cart / checkout | `/api/storefront/carts` REST + GraphQL `cart` mutations (token can do this; not yet exercised in this audit) |
| Orders / customer accounts | Require customer-impersonation token, not in scope for catalog-only front-end |

### Recommendation
- **Skip scraping.** All catalog data we need is in GraphQL with stable schema and pagination.
- **Token-refresh worker:** in the new front-end's backend, run a periodic job (every 12–24h) that fetches the BC homepage, extracts the JWT, and caches it. Use that token for all storefront queries. (Alternative: ask the merchant to provision a long-lived Storefront API token via the BC admin — simpler if we have the relationship, but we don't need it to start.)
- **Codegen:** point `graphql-codegen` at `https://www.jimdunlop.com/graphql` with the bearer token; introspection works, so we get fully typed queries on day one.
- **Catalog snapshot:** for the first iteration, fetch the entire 1,692-product catalog into our own datastore (e.g. nightly), serve from there for speed and resilience to BC outages, and use live GraphQL only for stock/price freshness on PDP.

---

## 5. Risks and Open Questions

1. **Token rotation visibility.** If BC ever flips the storefront to require a same-origin Origin/Referer, our extraction recipe still works (we send a Mozilla UA, no Origin restriction observed in this probe), but worth re-verifying in production.
2. **Rate limits.** Not exercised — BC publishes per-store soft limits on Storefront GraphQL but did not throttle the ~10 requests we made. Run an enumeration test before committing the architecture.
3. **Customer-specific data** (logged-in pricing, B2B group pricing, cart with `cartId`) needs an additional customer-impersonation JWT, separate from the anonymous token captured here. Out of scope for catalog browse.
4. **Schema version.** Capture and version-control `gql_introspection.json` so we can diff schema changes between BC platform updates.
