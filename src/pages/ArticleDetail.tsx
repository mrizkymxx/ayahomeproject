import Layout from "@/components/Layout";
import { Link, useParams } from "react-router-dom";
import { Calendar, User, ArrowLeft, Share2, Copy, Check, Loader2 } from "lucide-react";
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
  const [canShare] = useState(() => typeof navigator !== 'undefined' && !!navigator.share);

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

  const handleNativeShare = async () => {
    if (!article || !navigator.share) return;

    try {
      await navigator.share({
        title: article.title,
        text: `${article.excerpt || article.title} — Read more on Aya Home Project`,
        url: window.location.href,
      });
      toast({
        title: "Shared!",
        description: "Article shared successfully.",
      });
    } catch (error: any) {
      // User cancelled share or error occurred - silently handle
      if (error.name !== 'AbortError') {
        toast({
          variant: "destructive",
          title: "Share failed",
          description: "Could not share article. Please try again.",
        });
      }
    }
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
      {/* Hero Section */}
      <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-gradient-to-b from-slate-900/50 to-slate-900/20">
        <img 
          src={heroImage} 
          alt={article.title} 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </section>

      {/* Main Content */}
      <section className="section-container py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Back Link */}
          <Link to="/articles" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 mb-6 group transition-colors">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Link>

          {/* Article Header */}
          <div className="mb-8">
            {/* Category Badge */}
            <div className="inline-block mb-4">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-700 border border-blue-200/50 rounded-full">
                {article.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-foreground leading-tight">
              {article.title}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-6 py-4 border-y border-border/30">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User size={16} className="text-blue-600" />
                <span className="font-medium">{article.author || "Aya Home Project"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={16} className="text-blue-600" />
                <span className="font-medium">{dateText}</span>
              </div>
              {article.read_time && (
                <div className="text-sm font-medium text-muted-foreground">
                  {article.read_time}
                </div>
              )}
            </div>
          </div>

          {/* Share Section */}
          <div className="mb-8 pb-8 border-b border-border/30">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Share this article</p>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Native Share Button (iPhone/Android style) */}
              {canShare && (
                <button
                  onClick={handleNativeShare}
                  className="flex-1 md:flex-none px-4 py-2.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-300/50 hover:border-blue-400 text-blue-700 rounded-lg transition-all flex items-center justify-center gap-2 group font-semibold"
                  title="Share using system share sheet"
                >
                  <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              )}
              
              {/* Copy Link */}
              <button 
                onClick={handleCopyLink}
                className="flex-1 md:flex-none px-4 py-2.5 bg-muted/30 hover:bg-muted/50 border border-border rounded-lg transition-all flex items-center justify-center gap-2 group"
                title="Copy link to clipboard"
              >
                {copied ? (
                  <>
                    <Check size={18} className="text-green-600" />
                    <span className="text-sm font-medium text-green-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-lg leading-relaxed text-foreground/85 mb-8 font-medium bg-blue-500/5 border-l-4 border-blue-400 p-4 rounded-r-lg">
              {article.excerpt}
            </p>
          )}

          {/* Article Content */}
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
