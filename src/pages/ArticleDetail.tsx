import Layout from "@/components/Layout";
import { Link, useParams } from "react-router-dom";
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Copy, Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import smallRoom from "@/assets/generated/small-room.jpg";
import wallPaint from "@/assets/generated/wall-paint.jpg";
import moldyFurniture from "@/assets/generated/moldy-furniture.jpg";
import { applyArticleSeoMeta, buildExcerpt, extractKeywords } from "@/lib/seo";

type Article = {
  id: string;
  slug: string;
  title: string;
  author?: string;
  published_at?: string;
  category?: string;
  read_time?: string;
  excerpt?: string;
  content?: string;
  image_url?: string;
  is_featured?: boolean;
};

const imageBySlug: Record<string, string> = {
  "small-room-secrets": smallRoom,
  "wall-paint-furniture-finish": wallPaint,
  "moldy-furniture-solutions": moldyFurniture,
};

const fallbackArticles: Record<string, Article> = {
  "small-room-secrets": {
    id: "fallback-1",
    slug: "small-room-secrets",
    title: "Secrets You Should Know For Those of You Who Have a Small Room",
    author: "Aya Home Project",
    published_at: "2025-08-06T10:00:00Z",
    category: "Interior Tips",
    read_time: "5 min read",
    excerpt:
      "Discover expert tips and tricks to maximize your small room space. Learn how to make your compact living area feel spacious, organized, and stylish with smart furniture choices and clever design solutions.",
    content:
      "<p>Living in a small room doesn't mean you have to compromise on style or functionality. With the right approach, you can transform even the tiniest space into a comfortable and beautiful living area.</p><h2>1. Choose Multi-Functional Furniture</h2><p>Invest in furniture that serves multiple purposes. A bed with built-in storage, a coffee table that doubles as a desk, or an ottoman with hidden compartments can help you maximize every square inch of your space.</p><h2>2. Use Vertical Space</h2><p>Don't forget about your walls! Floating shelves, wall-mounted desks, and tall bookcases draw the eye upward and make the room feel larger while providing valuable storage.</p>",
  },
  "wall-paint-furniture-finish": {
    id: "fallback-2",
    slug: "wall-paint-furniture-finish",
    title: "Wall Paint vs Furniture Finish Should They Match",
    author: "Aya Home Project",
    published_at: "2025-08-07T10:00:00Z",
    category: "Design Guide",
    read_time: "4 min read",
    excerpt:
      "Explore the art of color coordination in interior design. Understand when to match and when to contrast your wall colors with furniture finishes for a harmonious living space.",
    content:
      "<p>One of the most common questions in interior design is whether your wall paint should match your furniture finish. The answer depends on your design goals and personal preferences.</p><h2>The Matching Approach</h2><p>Matching your wall paint to your furniture finish creates a cohesive, monochromatic look.</p><h2>The Contrasting Approach</h2><p>Contrasting colors can make your furniture stand out and add visual interest.</p>",
  },
  "moldy-furniture-solutions": {
    id: "fallback-3",
    slug: "moldy-furniture-solutions",
    title: "Moldy Furniture? Find Out The Causes and How to Fix It!",
    author: "Aya Home Project",
    published_at: "2025-08-08T10:00:00Z",
    category: "Maintenance",
    read_time: "6 min read",
    excerpt:
      "Learn the root causes of mold on furniture and effective solutions to prevent and treat it. Keep your furniture looking fresh and extend its lifespan with proper care techniques.",
    content:
      "<p>Discovering mold on your furniture can be disheartening, but understanding the causes and solutions can help you prevent and treat this common problem.</p><h2>What Causes Mold on Furniture?</h2><p>Mold thrives in high humidity and poor air circulation.</p><h2>How to Remove Mold Safely</h2><p>Move furniture outdoors, use a soft brush, and clean with a suitable solution before drying completely.</p>",
  },
};

const ArticleDetail = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error || !data) {
          setArticle(fallbackArticles[slug] || null);
        } else {
          setArticle(data);
        }
      } catch {
        setArticle(fallbackArticles[slug] || null);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug]);

  useEffect(() => {
    if (!article || !slug) return;
    const canonicalUrl = `${window.location.origin}/articles/${slug}`;
    const description = buildExcerpt(article.excerpt || article.content || "", article.title, 160);
    const keywords = extractKeywords(article.title, article.category, article.content, 10);

    const localImage = imageBySlug[slug];
    const resolvedOgImage = localImage
      ? `${window.location.origin}${localImage}`
      : article.image_url && /^https?:\/\//.test(article.image_url)
        ? article.image_url
        : article.image_url
          ? `${window.location.origin}${article.image_url}`
          : undefined;

    applyArticleSeoMeta({
      title: article.title,
      description,
      canonicalUrl,
      imageUrl: resolvedOgImage,
      publishedAt: article.published_at,
      updatedAt: article.published_at,
      author: article.author || "Aya Home Project",
      keywords,
    });
  }, [article, slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Article link has been copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: "facebook" | "twitter" | "whatsapp") => {
    if (!article) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(article.title);
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    };
    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  if (loading) {
    return (
      <Layout>
        <section className="section-container py-20 flex items-center justify-center">
          <Loader2 className="animate-spin" size={40} />
          <span className="ml-3 text-muted-foreground">Loading article...</span>
        </section>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <section className="section-container py-20 text-center">
          <h1 className="font-serif text-3xl mb-3">Article not found</h1>
          <Link to="/articles" className="text-muted-foreground underline">
            Back to Articles
          </Link>
        </section>
      </Layout>
    );
  }

  const dateText = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const heroImage = imageBySlug[article.slug] || article.image_url || smallRoom;

  return (
    <Layout>
      <section className="section-container py-12">
        <div className="max-w-3xl mx-auto">
          <Link to="/articles" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft size={14} />
            Back to Articles
          </Link>

          <div className="mb-6">
            <span className="text-xs font-bold text-destructive">{article.category}</span>
            <h1 className="font-serif text-4xl md:text-5xl mt-2 mb-4">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/70">
              <span className="flex items-center gap-1">
                <User size={14} />
                {article.author || "Aya Home Project"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {dateText}
              </span>
              <span>{article.read_time}</span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden mb-8">
            <img src={heroImage} alt={article.title} className="w-full h-[320px] md:h-[450px] object-cover" />
          </div>

          <div className="mb-8 flex items-center gap-2">
            <button onClick={() => handleShare("whatsapp")} className="px-3 py-2 border rounded-lg text-sm hover:bg-secondary">
              <Share2 size={16} />
            </button>
            <button onClick={() => handleShare("facebook")} className="px-3 py-2 border rounded-lg text-sm hover:bg-secondary">
              <Facebook size={16} />
            </button>
            <button onClick={() => handleShare("twitter")} className="px-3 py-2 border rounded-lg text-sm hover:bg-secondary">
              <Twitter size={16} />
            </button>
            <button onClick={handleCopyLink} className="px-3 py-2 border rounded-lg text-sm hover:bg-secondary inline-flex items-center gap-2">
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>

          {article.excerpt && (
            <p className="text-lg leading-relaxed text-foreground/85 mb-8 border-l-4 border-border pl-4">
              {article.excerpt}
            </p>
          )}

          <article
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content || "<p>No content available.</p>" }}
          />
        </div>
      </section>
    </Layout>
  );
};

export default ArticleDetail;
