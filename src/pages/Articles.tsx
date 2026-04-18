import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight, Share2, Facebook, Twitter, Copy, Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { applyPageSeoMeta } from "@/lib/seo";
import smallRoom from '@/assets/generated/small-room.webp';
import wallPaint from '@/assets/generated/wall-paint.webp';
import moldyFurniture from '@/assets/generated/moldy-furniture.webp';

// Fallback hardcoded data
const hardcodedArticles = [
  {
    id: 1,
    slug: "small-room-secrets",
    title: "How to Choose the Perfect Suar Wood Slab for Your Dining Table",
    author: "Aya Home Project",
    date: "6 August 2025",
    published_at: "2025-08-06T10:00:00Z",
    category: "Buying Guide",
    read_time: "5 min read",
    excerpt: "Selecting the right Suar slab is the most important step in creating your dream table. Learn how to evaluate grain patterns, moisture content, thickness, and live-edge profiles to find a slab that matches your space and style perfectly.",
    image: smallRoom,
    image_url: "/src/assets/generated/small-room.webp",
    featured: true,
    is_featured: true,
  },
  {
    id: 2,
    slug: "wall-paint-furniture-finish",
    title: "Live-Edge vs Straight-Edge: Which Suar Finish Is Right for You?",
    author: "Aya Home Project",
    date: "7 August 2025",
    published_at: "2025-08-07T10:00:00Z",
    category: "Design Guide",
    read_time: "4 min read",
    excerpt: "Explore the differences between live-edge and straight-edge Suar wood finishes. Understand when the natural bark edge adds character versus when a clean, refined edge suits your interior design better.",
    image: wallPaint,
    image_url: "/src/assets/generated/wall-paint.webp",
    featured: false,
    is_featured: false,
  },
  {
    id: 3,
    slug: "moldy-furniture-solutions",
    title: "Caring for Your Suar Wood Furniture: A Complete Maintenance Guide",
    author: "Aya Home Project",
    date: "8 August 2025",
    published_at: "2025-08-08T10:00:00Z",
    category: "Maintenance",
    read_time: "6 min read",
    excerpt: "Suar wood is naturally durable, but proper care extends its beauty for generations. Learn the best practices for cleaning, oiling, protecting against humidity, and restoring your Suar furniture's original lustre.",
    image: moldyFurniture,
    image_url: "/src/assets/generated/moldy-furniture.webp",
    featured: false,
    is_featured: false,
  },
];

const fallbackImageBySlug: Record<string, string> = {
  "small-room-secrets": smallRoom,
  "wall-paint-furniture-finish": wallPaint,
  "moldy-furniture-solutions": moldyFurniture,
};

const Articles = () => {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const { toast } = useToast();
  
  // Supabase data
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    applyPageSeoMeta({
      title: "Articles | Aya Home Project — Suar Wood Guides",
      description:
        "Read Aya Home Project articles about Suar wood selection, live-edge table design, and furniture care guides for international buyers.",
      canonicalUrl: "https://ayahomeproject.com/articles",
      imageUrl: "https://ayahomeproject.com/og-ayahomeproject.jpg",
      keywords: ["suar wood guide", "live edge table tips", "trembesi wood care", "Aya Home Project blog"],
    });
  }, []);

  // Fetch articles from Supabase
  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .order('published_at', { ascending: false });

        if (error) {
          console.warn('Supabase fetch error, using fallback data');
          setArticles(hardcodedArticles);
          setUsingFallback(true);
        } else {
          // Map Supabase data to include remote image and local fallback
          const mappedArticles = (data || []).map(article => ({
            ...article,
            featured: article.is_featured,
            date: new Date(article.published_at).toLocaleDateString('en-US', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            }),
            image: fallbackImageBySlug[article.slug] || article.image_url || smallRoom,
          }));
          setArticles(mappedArticles);
          setUsingFallback(false);
          console.log('✅ Loaded from Supabase:', { articles: data?.length });
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        setArticles(hardcodedArticles);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  const handleCopyLink = (articleId: number, slug: string) => {
    const url = `${window.location.origin}/articles/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(articleId);
    toast({
      title: "Link copied!",
      description: "Article link has been copied to clipboard.",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (platform: string, article: typeof articles[0]) => {
    const url = encodeURIComponent(`${window.location.origin}/articles/${article.slug}`);
    const text = encodeURIComponent(article.title);
    
    const shareUrls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const featuredArticle = articles.find((a) => a.featured || a.is_featured);
  const regularArticles = articles.filter((a) => !(a.featured || a.is_featured));

  return (
    <Layout>
      <section className="section-container py-16">
        <h1 className="font-serif text-5xl md:text-6xl text-center mb-4" data-aos="fade-up">Suar Wood Knowledge</h1>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          Expert guides on Suar wood selection, live-edge design, finishing techniques, and furniture maintenance
        </p>

        {/* Featured Article */}
        {featuredArticle && (
          <article className="mb-16" data-aos="fade-up">
            <div className="bg-secondary rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative h-64 lg:h-auto">
                <img 
                  src={featuredArticle.image} 
                  alt={featuredArticle.title} 
                  className="w-full h-full object-cover" 
                  loading="eager" 
                  width={600} 
                  height={400} 
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-destructive text-white px-3 py-1 rounded-full text-xs font-bold">
                    FEATURED
                  </span>
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <span className="text-xs font-bold text-destructive mb-2">{featuredArticle.category}</span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">{featuredArticle.title}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    {featuredArticle.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {featuredArticle.date}
                  </span>
                  <span>{featuredArticle.read_time || featuredArticle.readTime}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center gap-3">
                  <Link 
                    to={`/articles/${featuredArticle.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors font-sans font-bold text-sm"
                  >
                    Read Full Article
                    <ArrowRight size={16} />
                  </Link>
                  
                  {/* Share Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleShare('whatsapp', featuredArticle)}
                      className="p-2 border border-border rounded-lg hover:bg-green-500 hover:text-white hover:border-green-500 transition-colors"
                      title="Share on WhatsApp"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleShare('facebook', featuredArticle)}
                      className="p-2 border border-border rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
                      title="Share on Facebook"
                    >
                      <Facebook size={18} />
                    </button>
                    <button
                      onClick={() => handleShare('twitter', featuredArticle)}
                      className="p-2 border border-border rounded-lg hover:bg-black hover:text-white hover:border-black transition-colors"
                      title="Share on Twitter"
                    >
                      <Twitter size={18} />
                    </button>
                    <button
                      onClick={() => handleCopyLink(featuredArticle.id, featuredArticle.slug)}
                      className="p-2 border border-border rounded-lg hover:bg-foreground hover:text-background transition-colors"
                      title="Copy link"
                    >
                      {copiedId === featuredArticle.id ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* Regular Articles Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin" size={40} />
            <span className="ml-3 text-muted-foreground">Loading articles...</span>
          </div>
        ) : regularArticles.length === 0 && !featuredArticle ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No articles available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article, index) => (
              <article 
                key={article.id} 
                className="group bg-background border border-border rounded-xl overflow-hidden hover:border-foreground hover:shadow-xl transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
              <div className="relative overflow-hidden h-48">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                  loading="lazy" 
                  width={400} 
                  height={300} 
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h2 className="font-serif text-xl font-bold mb-3 line-clamp-2 group-hover:text-destructive transition-colors">
                  {article.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {article.date}
                  </span>
                  <span>•</span>
                  <span>{article.read_time || article.readTime}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <Link 
                    to={`/articles/${article.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-bold hover:text-destructive transition-colors"
                  >
                    Read More
                    <ArrowRight size={14} />
                  </Link>
                  
                  {/* Share Dropdown */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleShare('whatsapp', article)}
                      className="p-1.5 hover:bg-secondary rounded transition-colors"
                      title="Share"
                    >
                      <Share2 size={14} />
                    </button>
                    <button
                      onClick={() => handleCopyLink(article.id, article.slug)}
                      className="p-1.5 hover:bg-secondary rounded transition-colors"
                      title="Copy link"
                    >
                      {copiedId === article.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      </section>
    </Layout>
  );
};

export default Articles;
