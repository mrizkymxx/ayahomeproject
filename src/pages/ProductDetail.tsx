import Layout from "@/components/Layout";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useLayoutEffect } from "react";
import { MessageCircle, Facebook, Twitter, Copy, Check, Loader2, Heart, Share2, MapPin, Truck, Shield, Instagram, Music } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { applyProductSeoMeta, buildExcerpt } from "@/lib/seo";
import afraChair from "@/assets/products/afra-chair.jpg";
import yolaChair from "@/assets/products/yola-chair.jpg";
import landaChair from "@/assets/products/landa-chair.jpg";
import briliyChair from "@/assets/products/briliy-chair.jpg";
import yantamChair from "@/assets/products/yantam-chair.jpg";
import gunawChair from "@/assets/products/gunaw-chair.jpg";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  images: string[] | null;
  specifications: Record<string, string> | null;
  is_featured: boolean | null;
  is_best_seller: boolean | null;
  stock_status: string | null;
  category_id: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

const imageMap: Record<string, string> = {
  "afra-chair": afraChair,
  "yola-chair": yolaChair,
  "landa-chair": landaChair,
  "briliy-chair": briliyChair,
  "yantam-chair": yantamChair,
  "gunaw-chair": gunawChair,
};

const ProductDetail = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [canShare] = useState(() => typeof navigator !== 'undefined' && !!navigator.share);

  useEffect(() => {
    async function fetchData() {
      if (!slug) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(id,name,slug)")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        setProduct(null);
        setLoading(false);
        return;
      }

      setProduct(data as Product);

      const { data: relatedRows } = await supabase
        .from("products")
        .select("*, category:categories(id,name,slug)")
        .eq("category_id", data.category_id)
        .neq("id", data.id)
        .limit(8);

      setRelated((relatedRows || []) as Product[]);
      setLoading(false);
    }

    fetchData();
  }, [slug]);

  useLayoutEffect(() => {
    if (!product || !slug) return;

    const canonicalUrl = `${window.location.origin}/products/${slug}`;
    
    // Get primary image with proper fallback
    let primaryImage = afraChair; // default fallback
    
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      // Use first image from product.images (from Supabase)
      primaryImage = product.images[0];
      console.log("Using Supabase image:", primaryImage);
    } else if (imageMap[product.slug]) {
      // Fallback to imageMap
      primaryImage = imageMap[product.slug];
      console.log("Using imageMap:", primaryImage);
    } else {
      console.log("Using default image:", primaryImage);
    }
    
    // Ensure absolute URL
    const imageUrl = /^https?:\/\//.test(primaryImage)
      ? primaryImage
      : `${window.location.origin}${primaryImage.startsWith("/") ? primaryImage : `/${primaryImage}`}`;
    
    console.log("Final OG:image URL:", imageUrl);
    
    const description = buildExcerpt(
      product.description || `${product.name} — premium Suar wood furniture handcrafted by Aya Home Project, Jepara.`,
      product.name,
      160,
    );
    const normalizedStock = (product.stock_status || "").toLowerCase();
    const availability = normalizedStock.includes("out") ? "OutOfStock" : "InStock";

    applyProductSeoMeta({
      name: product.name,
      description,
      canonicalUrl,
      imageUrl,
      category: product.category?.name,
      sku: product.slug,
      availability,
      keywords: [
        product.name,
        product.category?.name || "",
        "suar wood furniture",
        "live edge table",
        "trembesi wood",
        "Aya Home Project",
      ].filter(Boolean),
      specs: product.specifications || undefined,
    });
  }, [product, slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Product link has been copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (!product || !navigator.share) return;

    try {
      // Use same image resolution as SEO meta
      let primaryImage = afraChair;
      
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        primaryImage = product.images[0];
      } else if (imageMap[product.slug]) {
        primaryImage = imageMap[product.slug];
      }
      
      const absoluteImageUrl = /^https?:\/\//.test(primaryImage)
        ? primaryImage
        : `${window.location.origin}${primaryImage.startsWith("/") ? primaryImage : `/${primaryImage}`}`;

      const shareData: ShareData = {
        title: product.name,
        text: `Check out this premium Suar wood furniture: ${product.name} — handcrafted by Aya Home Project, Jepara. ${product.description ? product.description.slice(0, 100) : ''}`,
        url: window.location.href,
      };

      // Fetch and add image if available
      if (absoluteImageUrl) {
        try {
          const response = await fetch(absoluteImageUrl);
          const blob = await response.blob();
          const file = new File([blob], `${product.slug}.jpg`, { type: blob.type });
          if (navigator.share.length > 0) {
            // Some browsers might support files in share
            Object.assign(shareData, { files: [file] });
          }
        } catch (err) {
          // If image fetch fails, continue without it
          console.debug("Image fetch failed for share:", err);
        }
      }

      await navigator.share(shareData);
      toast({
        title: "Shared!",
        description: "Product shared successfully.",
      });
    } catch (error: any) {
      // User cancelled share or error occurred - silently handle
      if (error.name !== 'AbortError') {
        toast({
          variant: "destructive",
          title: "Share failed",
          description: "Could not share product. Please try again.",
        });
      }
    }
  };

  const handleShare = (platform: "whatsapp" | "instagram" | "threads" | "tiktok" | "x") => {
    if (!product) return;
    const url = window.location.href;
    const text = `Check out ${product.name} from Aya Home Project!`;
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);
    
    const shareUrls: Record<string, string> = {
      whatsapp: `https://wa.me/628164823454?text=${encodeURIComponent(`Hello Aya Home Project, I am interested in ordering ${product.name}. Can you send me more details about this Suar wood piece?\n\n${url}`)}`,
      instagram: `https://www.instagram.com/sharer.php?u=${encodedUrl}`,
      threads: `https://www.threads.net/intent/post?text=${encodedText}%20${encodedUrl}`,
      tiktok: `https://www.tiktok.com/share/video?url=${encodedUrl}`,
      x: `https://x.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    };
    
    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  if (loading) {
    return (
      <Layout>
        <section className="section-container py-20 flex items-center justify-center">
          <Loader2 className="animate-spin" size={40} />
          <span className="ml-3 text-muted-foreground">Loading product...</span>
        </section>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="section-container py-20 text-center">
          <h1 className="font-serif text-3xl">Product not found</h1>
          <Link to="/products" className="mt-4 inline-block text-muted-foreground underline">
            Back to Products
          </Link>
        </div>
      </Layout>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [imageMap[product.slug] || afraChair];
  const specs = product.specifications || {};
  const tags = [product.is_featured ? "FEATURED" : "", product.is_best_seller ? "BEST SELLER" : ""].filter(Boolean);
  const stockLabel = product.stock_status || "available";

  return (
    <Layout>
      <section className="section-container py-12">
        <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/products" className="hover:text-foreground transition-colors">
                Products
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-semibold">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Product Images */}
          <div>
            <div className="relative group">
              <img 
                src={images[selectedImageIndex]} 
                alt={product.name} 
                className="w-full rounded-2xl mb-6 cursor-pointer hover:opacity-90 transition-opacity shadow-lg" 
                width={700} 
                height={700} 
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast({ title: "Link copied!", description: "Product link copied to clipboard" });
                }}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur hover:bg-white rounded-full p-3 transition-all shadow-lg"
              >
                <Heart size={20} className="text-foreground" />
              </button>
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(0, 4).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`rounded-xl w-full h-24 overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImageIndex === index
                        ? 'border-foreground shadow-lg'
                        : 'border-border hover:border-foreground/50'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div>
            {/* Tags */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {tags.map((tag) => (
                <span key={tag} className="text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-orange-500/10 text-orange-600 border border-orange-200/50">
                  {tag}
                </span>
              ))}
              {stockLabel && (
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                  stockLabel.toLowerCase().includes('out') 
                    ? 'bg-red-500/10 text-red-600 border-red-200/50'
                    : 'bg-green-500/10 text-green-600 border-green-200/50'
                }`}>
                  {stockLabel}
                </span>
              )}
            </div>

            {/* Title & Category */}
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2 text-foreground">{product.name}</h1>
            <Link to={`/products?category=${product.category?.name}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 inline-block">
              Category: <span className="font-semibold text-foreground">{product.category?.name || 'Uncategorized'}</span>
            </Link>

            {/* Main CTA - WhatsApp Order Button */}
            <button
              onClick={() => handleShare("whatsapp")}
              className="w-full mb-6 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 group"
            >
              <MessageCircle size={22} className="group-hover:animate-bounce" />
              <span>Order via WhatsApp</span>
            </button>

            {/* Share Section */}
            <div className="mb-8 pb-8 border-b border-border/30">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Share this product</p>
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

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-foreground">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>

            {/* Specifications & Services */}
            <div className="grid grid-cols-1 gap-4">
              {/* Specifications */}
              <div className="border border-border/30 rounded-xl p-5 bg-gradient-to-br from-muted/30 to-muted/10 backdrop-blur-sm">
                <h4 className="font-sans font-bold text-base mb-4 text-foreground">Specifications</h4>
                {Object.entries(specs).length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No specifications available</p>
                ) : (
                  <ul className="text-sm text-muted-foreground space-y-2">
                    {Object.entries(specs).map(([k, v]) => (
                      <li key={k} className="flex items-start gap-3">
                        <span className="text-foreground font-medium min-w-fit">{k}:</span>
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Delivery & Services */}
              <div className="border border-border/30 rounded-xl p-5 bg-gradient-to-br from-muted/30 to-muted/10 backdrop-blur-sm">
                <h4 className="font-sans font-bold text-base mb-4 text-foreground">Delivery & Services</h4>
                <ul className="text-sm text-muted-foreground space-y-3">
                  <li className="flex items-start gap-3">
                    <Truck size={18} className="text-foreground mt-0.5 flex-shrink-0" />
                    <span>Free slab selection consultation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield size={18} className="text-foreground mt-0.5 flex-shrink-0" />
                    <span>Kiln-dried & export-grade finishing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin size={18} className="text-foreground mt-0.5 flex-shrink-0" />
                    <span>Worldwide shipping available</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield size={18} className="text-foreground mt-0.5 flex-shrink-0" />
                    <span>1 year structural warranty</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-container py-16 border-t border-border/30">
          <div className="mb-10">
            <h2 className="font-serif text-4xl font-bold mb-2">Related Products</h2>
            <p className="text-muted-foreground">Explore more from our collection</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <Link to={`/products/${item.slug}`} key={item.id} className="group">
                <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square bg-secondary">
                  <img
                    src={item.images?.[0] || imageMap[item.slug] || afraChair}
                    alt={item.name}
                    className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    width={250}
                    height={250}
                  />
                  {item.is_best_seller && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-orange-500/90 text-white text-xs font-bold rounded-full">
                      Best Seller
                    </div>
                  )}
                  {item.is_featured && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-purple-500/90 text-white text-xs font-bold rounded-full">
                      Featured
                    </div>
                  )}
                </div>
                <h3 className="font-serif italic text-sm font-semibold group-hover:text-destructive transition-colors line-clamp-2">{item.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{item.category?.name || 'Furniture'}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ProductDetail;
