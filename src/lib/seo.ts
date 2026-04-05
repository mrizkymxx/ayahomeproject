export type RelatedProductLink = {
  name: string;
  slug: string;
};

type PageSeoMetaInput = {
  title: string;
  description: string;
  canonicalUrl: string;
  imageUrl?: string;
  keywords?: string[];
  robots?: string;
};

type ArticleSeoMetaInput = {
  title: string;
  description: string;
  canonicalUrl: string;
  imageUrl?: string;
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
  keywords?: string[];
};

type ProductSeoMetaInput = {
  name: string;
  description: string;
  canonicalUrl: string;
  imageUrl?: string;
  category?: string;
  sku?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder" | "Discontinued";
  keywords?: string[];
  brand?: string;
  specs?: Record<string, string>;
};

const DEFAULT_SEO_IMAGE = "https://ayahomeproject.com/og-ayahomeproject.jpg";

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "from",
  "your",
  "you",
  "are",
  "atau",
  "yang",
  "dan",
  "untuk",
  "dengan",
  "dari",
  "pada",
  "dalam",
  "adalah",
  "itu",
  "ini",
]);

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildExcerpt(contentOrHtml: string | undefined, fallback = "", maxLength = 165): string {
  const plain = stripHtml(contentOrHtml || fallback);
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength).trim()}...`;
}

export function estimateReadTime(contentOrHtml: string, wordsPerMinute = 220): string {
  const plain = stripHtml(contentOrHtml);
  const words = plain.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
}

export function extractKeywords(title: string, category?: string, content?: string, limit = 8): string[] {
  const source = `${title} ${category || ""} ${stripHtml(content || "")}`.toLowerCase();
  const words = source
    .split(/[^a-z0-9]+/g)
    .map((word) => word.trim())
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));

  const score = new Map<string, number>();
  for (const word of words) {
    score.set(word, (score.get(word) || 0) + 1);
  }

  return [...score.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

export function toArticleHtml(rawContent: string): string {
  const trimmed = rawContent.trim();
  if (!trimmed) return "<p></p>";

  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(trimmed);
  if (looksLikeHtml) return trimmed;

  const blocks = trimmed.split(/\n{2,}/g).map((block) => block.trim()).filter(Boolean);
  return blocks
    .map((block) => {
      if (block.startsWith("## ")) {
        return `<h2>${escapeHtml(block.slice(3).trim())}</h2>`;
      }
      if (block.startsWith("# ")) {
        return `<h2>${escapeHtml(block.slice(2).trim())}</h2>`;
      }
      const paragraph = escapeHtml(block).replace(/\n/g, "<br/>");
      return `<p>${paragraph}</p>`;
    })
    .join("\n");
}

export function appendInternalProductLinks(contentHtml: string, products: RelatedProductLink[]): string {
  if (!products.length || contentHtml.includes("/products/")) return contentHtml;

  const uniqueProducts = products.filter(
    (product, index, arr) => arr.findIndex((item) => item.slug === product.slug) === index,
  );

  const links = uniqueProducts
    .slice(0, 3)
    .map((product) => `<li><a href="/products/${product.slug}">${escapeHtml(product.name)}</a></li>`)
    .join("");

  return `${contentHtml}\n<h2>Produk Furniture Terkait</h2>\n<ul>${links}</ul>`;
}

function upsertMetaByName(name: string, content: string) {
  let el = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertMetaByProperty(property: string, content: string) {
  let el = document.head.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(url: string) {
  let el = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

function upsertJsonLd(id: string, payload: Record<string, unknown>) {
  let el = document.head.querySelector(`script[type="application/ld+json"][data-seo-id="${id}"]`) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.setAttribute("data-seo-id", id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(payload);
}

function removeJsonLd(ids: string[]) {
  ids.forEach((id) => {
    const el = document.head.querySelector(`script[type="application/ld+json"][data-seo-id="${id}"]`);
    if (el) el.remove();
  });
}

function resolveSeoImage(imageUrl?: string): string {
  return imageUrl || DEFAULT_SEO_IMAGE;
}

export function applyPageSeoMeta(input: PageSeoMetaInput): void {
  document.title = input.title;

  upsertMetaByName("description", input.description);
  upsertMetaByName("robots", input.robots || "index,follow,max-image-preview:large");
  if (input.keywords && input.keywords.length) {
    upsertMetaByName("keywords", input.keywords.join(", "));
  }

  upsertCanonical(input.canonicalUrl);

  const imageUrl = resolveSeoImage(input.imageUrl);
  upsertMetaByProperty("og:type", "website");
  upsertMetaByProperty("og:title", input.title);
  upsertMetaByProperty("og:description", input.description);
  upsertMetaByProperty("og:url", input.canonicalUrl);
  upsertMetaByProperty("og:image", imageUrl);

  upsertMetaByName("twitter:card", "summary_large_image");
  upsertMetaByName("twitter:title", input.title);
  upsertMetaByName("twitter:description", input.description);
  upsertMetaByName("twitter:image", imageUrl);

  upsertJsonLd("webpage", {
    "@context": "https://schema.org",
    "@type": input.canonicalUrl === "https://ayahomeproject.com/" ? "WebSite" : "WebPage",
    name: input.title,
    description: input.description,
    url: input.canonicalUrl,
    image: imageUrl,
    publisher: {
      "@type": "Organization",
      name: "Aya Home Project",
    },
  });

  removeJsonLd(["article", "product"]);
}

export function applyArticleSeoMeta(input: ArticleSeoMetaInput): void {
  document.title = `${input.title} | Aya Home Project`;

  upsertMetaByName("description", input.description);
  upsertMetaByName("robots", "index,follow,max-image-preview:large");
  if (input.keywords && input.keywords.length) {
    upsertMetaByName("keywords", input.keywords.join(", "));
  }

  upsertCanonical(input.canonicalUrl);

  const imageUrl = resolveSeoImage(input.imageUrl);
  upsertMetaByProperty("og:type", "article");
  upsertMetaByProperty("og:title", input.title);
  upsertMetaByProperty("og:description", input.description);
  upsertMetaByProperty("og:url", input.canonicalUrl);
  upsertMetaByProperty("og:image", imageUrl);

  upsertMetaByName("twitter:card", "summary_large_image");
  upsertMetaByName("twitter:title", input.title);
  upsertMetaByName("twitter:description", input.description);
  upsertMetaByName("twitter:image", imageUrl);

  upsertJsonLd("article", {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    mainEntityOfPage: input.canonicalUrl,
    author: {
      "@type": "Organization",
      name: input.author || "Aya Home Project",
    },
    publisher: {
      "@type": "Organization",
      name: "Aya Home Project",
    },
    image: imageUrl,
    datePublished: input.publishedAt,
    dateModified: input.updatedAt || input.publishedAt,
  });

  removeJsonLd(["webpage", "product"]);
}

export function applyProductSeoMeta(input: ProductSeoMetaInput): void {
  const title = `${input.name} | Aya Home Project`;
  const imageUrl = resolveSeoImage(input.imageUrl);

  document.title = title;
  upsertMetaByName("description", input.description);
  upsertMetaByName("robots", "index,follow,max-image-preview:large");
  if (input.keywords && input.keywords.length) {
    upsertMetaByName("keywords", input.keywords.join(", "));
  }

  upsertCanonical(input.canonicalUrl);

  upsertMetaByProperty("og:type", "product");
  upsertMetaByProperty("og:title", title);
  upsertMetaByProperty("og:description", input.description);
  upsertMetaByProperty("og:url", input.canonicalUrl);
  upsertMetaByProperty("og:image", imageUrl);

  upsertMetaByName("twitter:card", "summary_large_image");
  upsertMetaByName("twitter:title", title);
  upsertMetaByName("twitter:description", input.description);
  upsertMetaByName("twitter:image", imageUrl);

  const additionalProperty = input.specs
    ? Object.entries(input.specs).map(([name, value]) => ({
        "@type": "PropertyValue",
        name,
        value,
      }))
    : undefined;

  const payload: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    image: imageUrl,
    sku: input.sku,
    category: input.category,
    url: input.canonicalUrl,
    additionalProperty,
    brand: {
      "@type": "Brand",
      name: input.brand || "Aya Home Project",
    },
  };

  if (input.availability) {
    payload.offers = {
      "@type": "Offer",
      url: input.canonicalUrl,
      availability: `https://schema.org/${input.availability}`,
    };
  }

  upsertJsonLd("product", payload);
  removeJsonLd(["webpage", "article"]);
}
