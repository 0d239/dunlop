#!/usr/bin/env bun
/**
 * One-shot scrape of the BigCommerce Storefront GraphQL catalog into
 * `src/data/catalog.json`. Run after refreshing the JWT.
 *
 *   1. curl the homepage, extract the JWT
 *   2. for each target category, paginate site.category(entityId).products
 *   3. normalize each node to our Product shape
 *   4. derive `capos` from the accessories result by category-path filter
 *   5. write src/data/catalog.json
 *
 * Run:
 *   bun run scripts/scrape-catalog.ts
 */

const ENDPOINT = 'https://www.jimdunlop.com/graphql';
const OUT = new URL('../src/data/catalog.json', import.meta.url);

type RawProduct = {
  entityId: number;
  sku: string;
  name: string;
  path: string;
  description: string | null;
  defaultImage: { url: string; altText: string | null } | null;
  images: { edges: { node: { url: string; altText: string | null } }[] };
  prices: { price: { value: number; currencyCode: string } | null } | null;
  brand: { name: string } | null;
  categories: { edges: { node: { entityId: number; name: string; path: string } }[] };
};

type Product = {
  id: string;
  sku: string;
  name: string;
  brand: string | null;
  priceCents: number;
  priceFormatted: string;
  image: string;
  images: string[];
  description: string;
  path: string;
  categoryPaths: string[];
};

const PRODUCT_FIELDS = `
  entityId
  sku
  name
  path
  description
  defaultImage { url(width: 480) altText }
  images { edges { node { url(width: 960) altText } } }
  prices { price { value currencyCode } }
  brand { name }
  categories { edges { node { entityId name path } } }
`;

async function fetchToken(): Promise<string> {
  const res = await fetch('https://www.jimdunlop.com/', {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  const html = await res.text();
  const m = html.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/);
  if (!m) throw new Error('Storefront JWT not found in homepage HTML');
  return m[0];
}

async function gql<T>(token: string, query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const r = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0',
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!r.ok) throw new Error(`GraphQL HTTP ${r.status}: ${await r.text()}`);
  const j = (await r.json()) as { data?: T; errors?: unknown };
  if (j.errors) throw new Error(`GraphQL errors: ${JSON.stringify(j.errors)}`);
  if (!j.data) throw new Error('GraphQL returned no data');
  return j.data;
}

function priceCents(p: RawProduct): number {
  const v = p.prices?.price?.value;
  return typeof v === 'number' ? Math.round(v * 100) : 0;
}

function priceFormatted(p: RawProduct): string {
  const cents = priceCents(p);
  if (cents === 0) return '—';
  return `$${(cents / 100).toFixed(2)}`;
}

function stripHtml(s: string | null): string {
  if (!s) return '';
  return s
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function normalize(p: RawProduct): Product {
  return {
    id: String(p.entityId),
    sku: p.sku,
    name: p.name,
    brand: p.brand?.name ?? null,
    priceCents: priceCents(p),
    priceFormatted: priceFormatted(p),
    image: p.defaultImage?.url ?? '',
    images: p.images?.edges?.map((e) => e.node.url) ?? [],
    description: stripHtml(p.description).slice(0, 1200),
    path: p.path,
    categoryPaths: p.categories?.edges?.map((e) => e.node.path) ?? [],
  };
}

async function fetchCategory(token: string, entityId: number, label: string): Promise<Product[]> {
  const out: Product[] = [];
  let after: string | null = null;
  let page = 0;
  while (true) {
    page += 1;
    const data = await gql<{
      site: {
        category: {
          products: {
            edges: { node: RawProduct }[];
            pageInfo: { hasNextPage: boolean; endCursor: string | null };
          };
        } | null;
      };
    }>(
      token,
      `query Q($id: Int!, $after: String) {
        site {
          category(entityId: $id) {
            products(first: 50, after: $after) {
              edges { node { ${PRODUCT_FIELDS} } }
              pageInfo { hasNextPage endCursor }
            }
          }
        }
      }`,
      { id: entityId, after },
    );
    const cat = data.site.category;
    if (!cat) throw new Error(`Category ${entityId} (${label}) returned null`);
    out.push(...cat.products.edges.map((e) => normalize(e.node)));
    const info = cat.products.pageInfo;
    process.stdout.write(`  ${label} page ${page}: ${out.length} so far\n`);
    if (!info.hasNextPage || !info.endCursor) break;
    after = info.endCursor;
  }
  return out;
}

async function main() {
  console.log('Fetching JWT…');
  const token = await fetchToken();
  console.log(`  token len=${token.length}, first 16: ${token.slice(0, 16)}…`);

  const picks = await fetchCategory(token, 25, 'picks');
  const electronics = await fetchCategory(token, 42, 'electronics');
  const accessories = await fetchCategory(token, 36, 'accessories');

  const capos = accessories.filter((p) =>
    p.categoryPaths.some((path) => path.includes('/capos/')),
  );

  const slides = accessories.filter((p) =>
    p.categoryPaths.some((path) => path.includes('/slides-tonebars/slides/') || path === '/products/accessories/slides-tonebars/slides/'),
  );

  const cables = accessories.filter((p) =>
    p.categoryPaths.some((path) => path.includes('/mxr-cables/')),
  );

  const straps = accessories.filter((p) =>
    p.categoryPaths.some((path) => path.includes('/straps/')),
  );

  const out = {
    fetchedAt: new Date().toISOString(),
    counts: {
      picks: picks.length,
      electronics: electronics.length,
      accessories: accessories.length,
      capos: capos.length,
      slides: slides.length,
      cables: cables.length,
      straps: straps.length,
    },
    picks,
    electronics,
    capos,
    slides,
    cables,
    straps,
  };

  await Bun.write(OUT, JSON.stringify(out, null, 2));
  console.log('\nWrote', OUT.pathname);
  console.log('Counts:', out.counts);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
