import { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Default meta tags for fallback
const DEFAULT_TITLE = "Aya Home Project | Premium Suar Wood Furniture Indonesia";
const DEFAULT_DESCRIPTION = "Premium live-edge Suar (Trembesi) wood furniture handcrafted in Jepara, Indonesia. Custom dining tables, coffee tables, and bar tops for homes, hotels, and restaurants worldwide.";
const DEFAULT_IMAGE = "https://ayahomeproject.com/og-ayahomeproject.jpg";

interface MetaTags {
  title: string;
  description: string;
  image: string;
  url: string;
  type: "product" | "article";
}

function isBot(userAgent: string): boolean {
  const botPatterns = [
    /facebookexternalhit/i,
    /whatsapp/i,
    /twitterbot/i,
    /linkedinbot/i,
    /pinterest/i,
    /slurp/i,
    /googlebot/i,
    /bingbot/i,
    /yandex/i,
    /msnbot/i,
    /ia_archiver/i,
    /crawler/i,
  ];

  return botPatterns.some((pattern) => pattern.test(userAgent));
}

async function getProductMeta(slug: string): Promise<MetaTags | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, description, images")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      console.log("[OG API] Product not found:", slug);
      return null;
    }

    let imageUrl = DEFAULT_IMAGE;
    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      imageUrl = data.images[0];
      // Ensure it's absolute URL
      if (!imageUrl.startsWith("http")) {
        imageUrl = `https://ayahomeproject.com${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
      }
    }

    return {
      title: `${data.name} | Aya Home Project`,
      description:
        data.description || `Premium Suar wood furniture: ${data.name}`,
      image: imageUrl,
      url: `https://www.ayahomeproject.com/products/${slug}`,
      type: "product",
    };
  } catch (err) {
    console.error("[OG API] Error fetching product:", err);
    return null;
  }
}

async function getArticleMeta(slug: string): Promise<MetaTags | null> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("id, title, excerpt, featured_image")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      console.log("[OG API] Article not found:", slug);
      return null;
    }

    let imageUrl = data.featured_image || DEFAULT_IMAGE;
    // Ensure it's absolute URL
    if (imageUrl && !imageUrl.startsWith("http")) {
      imageUrl = `https://ayahomeproject.com${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
    }

    return {
      title: `${data.title} | Aya Home Project`,
      description: data.excerpt || DEFAULT_DESCRIPTION,
      image: imageUrl || DEFAULT_IMAGE,
      url: `https://www.ayahomeproject.com/articles/${slug}`,
      type: "article",
    };
  } catch (err) {
    console.error("[OG API] Error fetching article:", err);
    return null;
  }
}

function buildHtmlWithMeta(meta: MetaTags, redirectUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description.replace(/"/g, "&quot;")}" />
  
  <meta property="og:type" content="${meta.type}" />
  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.description.replace(/"/g, "&quot;")}" />
  <meta property="og:url" content="${meta.url}" />
  <meta property="og:image" content="${meta.image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${meta.title}" />
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${meta.title}" />
  <meta name="twitter:description" content="${meta.description.replace(/"/g, "&quot;")}" />
  <meta name="twitter:image" content="${meta.image}" />
  
  <link rel="canonical" href="${meta.url}" />
  
  <!-- Redirect to SPA after bot crawls -->
  <script>
    if (!/bot|crawler|spider/i.test(navigator.userAgent)) {
      window.location.replace('${redirectUrl}');
    }
  </script>
</head>
<body>
  <p>Loading...</p>
</body>
</html>`;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  try {
    const userAgent = req.headers["user-agent"] || "";
    const path = req.query.path as string;

    console.log("[OG API] Request:", {
      path,
      isBot: isBot(userAgent),
      userAgent: userAgent.substring(0, 100),
    });

    // Parse path to determine if product or article
    if (!path) {
      console.log("[OG API] No path provided");
      return res.redirect("/");
    }

    const segments = path.split("/").filter(Boolean);
    const type = segments[0]; // "products" or "articles"
    const slug = segments[1]; // the slug

    if (!slug) {
      console.log("[OG API] No slug in path:", path);
      return res.redirect("/");
    }

    // Check if this is a bot
    if (!isBot(userAgent)) {
      console.log("[OG API] Not a bot, serving SPA wrapper");
      // For browsers: serve SPA wrapper that loads the app with correct path
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Aya Home Project | Premium Suar Wood Furniture Indonesia</title>
  <script>
    // Preserve the original path and load SPA
    window.__initialPath = '/${path}';
  </script>
  <script type="module" src="/src/main.tsx"></script>
  <link rel="stylesheet" href="/src/index.css">
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(200).send(html);
    }

    // For bots: fetch meta tags and return enriched HTML
    let meta: MetaTags | null = null;

    if (type === "products") {
      meta = await getProductMeta(slug);
    } else if (type === "articles") {
      meta = await getArticleMeta(slug);
    }

    // Use default if data not found
    if (!meta) {
      console.log("[OG API] Using default meta for path:", path);
      meta = {
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        image: DEFAULT_IMAGE,
        url: `https://www.ayahomeproject.com/${path}`,
        type: type === "products" ? "product" : "article",
      };
    }

    const html = buildHtmlWithMeta(meta, `/${path}`);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400"); // 1hr browser, 24hr edge
    return res.status(200).send(html);
  } catch (error) {
    console.error("[OG API] Error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: String(error) });
  }
}
