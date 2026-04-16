import Layout from "@/components/Layout";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Share2, Facebook, Twitter, Copy, Check, Loader2 } from "lucide-react";
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  useEffect(() => {
    if (!product || !slug) return;

    const canonicalUrl = `${window.location.origin}/products/${slug}`;
    const primaryImage = product.images?.[0] || imageMap[product.slug] || afraChair;
    const imageUrl = /^https?:\/\//.test(primaryImage)
      ? primaryImage
      : `${window.location.origin}${primaryImage.startsWith("/") ? primaryImage : `/${primaryImage}`}`;
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

  const handleShare = (platform: "whatsapp" | "facebook" | "twitter") => {
    if (!product) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out ${product.name} from Aya Home Project!`);
    const shareUrls: Record<string, string> = {
      whatsapp: `https://wa.me/628164823454?text=${encodeURIComponent(`Hello Aya Home Project, I am interested in ordering ${product.name}. Can you send me more details about this Suar wood piece?`)}`,
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <img src={images[selectedImageIndex]} alt={product.name} className="w-full rounded-xl mb-4 cursor-pointer hover:opacity-90 transition-opacity" width={700} height={700} />
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.slice(0, 4).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`rounded-lg w-full h-24 overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImageIndex === index
                        ? 'border-foreground'
                        : 'border-border hover:border-foreground/50'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              {tags.map((tag) => (
                <span key={tag} className="text-xs font-bold border border-foreground px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
              <span className="text-xs text-muted-foreground border border-border px-2 py-1 rounded uppercase">{stockLabel}</span>
            </div>

            <h1 className="font-serif text-3xl font-bold mb-3">{product.name}</h1>
            <p className="text-sm text-muted-foreground mb-6">{product.category?.name}</p>

            <div className="mb-6 pb-6 border-b border-border">
              <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Share2 size={16} />
                Share this product:
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => handleShare("whatsapp")} className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm">
                  WhatsApp
                </button>
                <button onClick={() => handleShare("facebook")} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
                  <Facebook size={16} />
                </button>
                <button onClick={() => handleShare("twitter")} className="px-3 py-2 bg-black text-white rounded-lg text-sm">
                  <Twitter size={16} />
                </button>
                <button onClick={handleCopyLink} className="px-3 py-2 border rounded-lg text-sm inline-flex items-center gap-2">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line mb-6">{product.description}</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-sans font-bold text-sm mb-2">Product Specifications</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {Object.entries(specs).length === 0 ? (
                    <li>-</li>
                  ) : (
                    Object.entries(specs).map(([k, v]) => <li key={k}>• {k}: {v}</li>)
                  )}
                </ul>
              </div>
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-sans font-bold text-sm mb-2">Delivery & Services</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Free slab selection consultation</li>
                  <li>• Kiln-dried & export-grade finishing</li>
                  <li>• Worldwide shipping available</li>
                  <li>• 1 year structural warranty</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-container py-12">
          <h2 className="font-sans font-bold text-xl mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((item) => (
              <Link to={`/products/${item.slug}`} key={item.id} className="group text-center block">
                <div className="aspect-square flex items-center justify-center p-4 bg-secondary rounded-xl">
                  <img
                    src={item.images?.[0] || imageMap[item.slug] || afraChair}
                    alt={item.name}
                    className="max-h-full object-contain group-hover:scale-105 transition-transform"
                    loading="lazy"
                    width={200}
                    height={200}
                  />
                </div>
                <p className="font-serif italic text-sm mt-2">{item.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ProductDetail;
