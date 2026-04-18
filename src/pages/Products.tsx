import Layout from "@/components/Layout";
import { Link, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { applyPageSeoMeta } from "@/lib/seo";
import { OptimizedImage } from "@/lib/vercel-image-optimization";
import productsHero from "@/assets/products-hero.jpg";
import afraChair from "@/assets/products/afra-chair.jpg";
import yolaChair from "@/assets/products/yola-chair.jpg";
import landaChair from "@/assets/products/landa-chair.jpg";
import briliyChair from "@/assets/products/briliy-chair.jpg";
import yantamChair from "@/assets/products/yantam-chair.jpg";
import gunawChair from "@/assets/products/gunaw-chair.jpg";

// Fallback image map for products without images
const fallbackImageMap: Record<string, string> = {
  "afra-chair": afraChair,
  "yola-chair": yolaChair,
  "landa-chair": landaChair,
  "briliy-chair": briliyChair,
  "yantam-chair": yantamChair,
  "gunaw-chair": gunawChair,
};

// Fallback hardcoded data
const hardcodedCategories = ["Dining Table", "Coffee Table", "Console Table", "Bar Top", "Bench", "Conference Table"];
const hardcodedProducts = [
  { id: "afra-chair", name: "Suar Live-Edge Dining Table", category: "Dining Table", slug: "afra-chair", image: afraChair },
  { id: "yola-chair", name: "Suar Round Coffee Table", category: "Coffee Table", slug: "yola-chair", image: yolaChair },
  { id: "landa-chair", name: "Suar Console Table", category: "Console Table", slug: "landa-chair", image: landaChair },
  { id: "briliy-chair", name: "Suar Bar Top Counter", category: "Bar Top", slug: "briliy-chair", image: briliyChair },
  { id: "yantam-chair", name: "Suar Garden Bench", category: "Bench", slug: "yantam-chair", image: yantamChair },
  { id: "gunaw-chair", name: "Suar Conference Table", category: "Conference Table", slug: "gunaw-chair", image: gunawChair },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [categorySearch, setCategorySearch] = useState("");
  
  // Supabase data
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    applyPageSeoMeta({
      title: "Suar Wood Products | Aya Home Project",
      description:
        "Browse our collection of premium Suar (Trembesi) wood furniture: live-edge dining tables, coffee tables, bar tops, console tables, and custom pieces for homes and hospitality.",
      canonicalUrl: "https://ayahomeproject.com/products",
      imageUrl: "https://ayahomeproject.com/og-ayahomeproject.jpg",
      keywords: ["suar wood table", "live edge dining table", "trembesi furniture", "monkey pod wood", "Aya Home Project"],
    });
  }, []);

  // Fetch categories and products from Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch categories
        const { data: catsData, error: catsError } = await supabase
          .from('categories')
          .select('id, name, slug')
          .order('name');

        // Fetch products WITHOUT category join (simpler, more reliable)
        const { data: prodsData, error: prodsError } = await supabase
          .from('products')
          .select(`
            id,
            name,
            slug,
            category_id,
            images,
            is_featured,
            is_best_seller,
            stock_status,
            created_at
          `)
          .order('created_at', { ascending: false })
          .order('id', { ascending: false });

        if (catsError || prodsError) {
          console.warn('Supabase fetch error, using fallback data');
          setCategories(hardcodedCategories.map(name => ({ name, slug: name.toLowerCase().replace(' ', '-') })));
          setProducts(hardcodedProducts);
          setUsingFallback(true);
        } else {
          setCategories(catsData || []);
          
          // Enrich products with category data (merge at client)
          const enrichedProducts = (prodsData || []).map((prod: any) => {
            const category = catsData?.find(cat => cat.id === prod.category_id);
            return {
              ...prod,
              category: category ? { id: category.id, name: category.name, slug: category.slug } : null,
            };
          });
          
          setProducts(enrichedProducts);
          setUsingFallback(false);
          console.log('✅ Loaded from Supabase:', { categories: catsData?.length, products: enrichedProducts.length });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setCategories(hardcodedCategories.map(name => ({ name, slug: name.toLowerCase().replace(' ', '-') })));
        setProducts(hardcodedProducts);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Set activeCategory based on URL param or default
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    } else {
      // Default to "All Products"
      setActiveCategory(null);
    }
  }, [categoryParam]);

  // Get active category object
  const activeCategoryObj = activeCategory ? categories.find(c => 
    (c.name === activeCategory) || (c.slug === activeCategory.toLowerCase().replace(' ', '-'))
  ) : null;

  // Get product count per category
  const categoryCounts = categories.reduce((acc, cat) => {
    const count = products.filter((p) => {
      if (usingFallback) {
        return p.category === cat.name;
      }
      return p.category?.name === cat.name || p.category_id === cat.id;
    }).length;
    acc[cat.name] = count;
    return acc;
  }, {} as Record<string, number>);

  // Filter categories by search
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Filter products by active category (null = All Products)
  let filteredProducts = activeCategory 
    ? products.filter((p) => {
        if (usingFallback) {
          return p.category === activeCategory;
        }
        return p.category?.name === activeCategory;
      })
    : products; // Show all products if no category selected

  // Search filter
  if (searchTerm) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Sort
  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "newest") {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      if (dateA !== dateB) return dateB - dateA;
      return a.name.localeCompare(b.name);
    }
    if (sortBy === "popular") {
      const popularityA = (a.is_best_seller ? 2 : 0) + (a.is_featured ? 1 : 0);
      const popularityB = (b.is_best_seller ? 2 : 0) + (b.is_featured ? 1 : 0);
      if (popularityA !== popularityB) return popularityB - popularityA;
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="section-container py-6">
        <div className="hero-banner h-[350px] md:h-[400px] group overflow-hidden rounded-3xl">
          <OptimizedImage
            src={productsHero}
            alt="Suar Wood Collection"
            width={1200}
            height={600}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            priority={true}
          />
          <div className="hero-overlay rounded-3xl">
            <div className="flex flex-col items-center justify-center">
              <h1 className="font-serif text-5xl md:text-6xl text-primary-foreground font-bold text-center">Suar Wood Collection</h1>
              <p className="text-primary-foreground/80 text-sm md:text-base mt-3">Premium handcrafted furniture from Indonesia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 relative">
        {/* Sticky Filter Header - Below Navbar with Space */}
        <div className="sticky top-32 z-40 bg-background/95 backdrop-blur-md border-b border-border/30 shadow-sm">
          <div className="section-container py-5 md:py-6">
            {/* Desktop Layout */}
            <div className="hidden md:flex items-center gap-4 justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background/50 transition-all hover:border-foreground/30 focus:border-foreground/50"
                />
              </div>

              {/* Category Dropdown */}
              <Select value={activeCategory || ""} onValueChange={(value) => {
                if (value) {
                  setSearchParams({ category: value });
                } else {
                  setSearchParams({});
                }
              }}>
                <SelectTrigger className="w-48 px-4 py-2.5 text-sm font-medium rounded-lg border-border bg-background hover:border-foreground/40 shadow-sm">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {categories.map((cat) => (
                    <SelectItem key={cat.name} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 px-4 py-2.5 text-sm font-medium rounded-lg border-border bg-background hover:border-foreground/40 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>

              {/* Active Filter Indicator */}
              {(activeCategory || searchTerm) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSearchParams({});
                  }}
                  className="text-xs font-medium text-destructive hover:text-destructive/80 transition-colors px-3 py-2 rounded-md hover:bg-destructive/10"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background/50 transition-all"
                />
              </div>

              {/* Category & Sort Row */}
              <div className="grid grid-cols-2 gap-3">
                {/* Category Dropdown */}
                <Select value={activeCategory || ""} onValueChange={(value) => {
                  if (value) {
                    setSearchParams({ category: value });
                  } else {
                    setSearchParams({});
                  }
                }}>
                  <SelectTrigger className="w-full px-3 py-3 text-sm font-medium rounded-lg border-border bg-background/50 cursor-pointer">
                    <SelectValue placeholder="Categories" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {categories.map((cat) => (
                      <SelectItem key={cat.name} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full px-3 py-3 text-sm font-medium rounded-lg border-border bg-background/50 cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="name">Sort</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="popular">Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Products Content */}
        <div className="section-container py-8">
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            {/* Desktop Categories Sidebar */}
            <div className="hidden md:block">
              <div className="bg-gradient-to-b from-secondary/20 to-secondary/5 rounded-lg p-4 border border-border/30">
                <h3 className="font-sans font-semibold text-sm uppercase tracking-wide text-foreground mb-4">
                  Categories
                </h3>
                
                {/* Category Search */}
                {categories.length > 8 && (
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background/50 transition-all"
                    />
                  </div>
                )}

                {/* Category List */}
                <div className={`space-y-1.5 ${categories.length > 10 ? 'max-h-96 overflow-y-auto pr-2 scrollbar-thin' : ''}`}>
                  <button
                    onClick={() => setSearchParams({})}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all font-medium flex items-center justify-between ${
                      activeCategory === null
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                    }`}
                  >
                    <span>All Products</span>
                    <span className="text-xs font-bold">{products.length}</span>
                  </button>

                  {filteredCategories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setSearchParams({ category: cat.name })}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all font-medium flex items-center justify-between ${
                        activeCategory === cat.name
                          ? "bg-foreground text-background"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-xs font-bold ml-2 flex-shrink-0">{categoryCounts[cat.name] || 0}</span>
                    </button>
                  ))}
                </div>

                {/* CTA Box */}
                <div className="mt-6 pt-4 border-t border-border/30">
                  <p className="text-xs font-semibold text-foreground mb-2">Custom Slab?</p>
                  <p className="text-xs text-muted-foreground mb-3">Contact for custom dimensions.</p>
                  <Link 
                    to="/contact" 
                    className="inline-text text-xs font-bold text-destructive hover:text-destructive/80 transition-colors"
                  >
                    Get in Touch →
                  </Link>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin" size={40} />
                <span className="ml-3 text-muted-foreground">Loading products...</span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary">
                    <Search size={32} className="text-muted-foreground" />
                  </div>
                </div>
                <p className="text-foreground font-semibold text-lg mb-2">No products found</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm ? "Try adjusting your search term or " : ""}{activeCategory ? "try a different category or " : ""}browse all products
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSearchParams({});
                  }}
                  className="text-sm font-bold text-foreground hover:text-destructive transition-colors"
                >
                  View All Products →
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between pb-4 border-b border-border/30">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Showing <span className="font-bold text-foreground">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''}
                    </p>
                    {activeCategory && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Category: <span className="font-medium text-foreground">{activeCategory}</span>
                      </p>
                    )}
                    {usingFallback && <p className="text-xs text-yellow-600 mt-1">⚠️ Using cached data</p>}
                  </div>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      Clear search ✕
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredProducts.map((product, index) => {
                    // Get product image with proper fallback
                    let productImage = afraChair; // Default fallback
                    
                    if (usingFallback) {
                      // Using hardcoded data - use image property
                      productImage = (product as any).image || afraChair;
                    } else {
                      // Using Supabase data - check images array or slug map
                      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
                        productImage = product.images[0]; // Use first image from Supabase
                      } else {
                        // Fallback to image map based on slug
                        productImage = fallbackImageMap[product.slug] || afraChair;
                      }
                    }
                    
                    const productSlug = product.slug || product.id;
                    const isFeatured = product.is_featured;
                    const isBestSeller = product.is_best_seller;
                    
                    return (
                      <Link
                        to={`/products/${productSlug}`}
                        key={product.id || index}
                        className="group"
                        data-aos="fade-up"
                        data-aos-delay={index * 50}
                      >
                        <div className="bg-background border border-border rounded-xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:border-foreground/30 hover:shadow-2xl hover:-translate-y-1">
                          {/* Image Container with Badges */}
                          <div className="aspect-square flex items-center justify-center p-6 bg-gradient-to-br from-secondary/50 to-secondary/10 group-hover:from-secondary/80 group-hover:to-secondary/30 transition-all duration-300 relative overflow-hidden">
                            <OptimizedImage
                              src={productImage}
                              alt={product.name}
                              width={400}
                              height={400}
                              className="max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                            />
                            
                            {/* Badges */}
                            <div className="absolute top-3 right-3 flex gap-2 flex-wrap justify-end">
                              {isBestSeller && (
                                <span className="inline-block px-2.5 py-1.5 rounded-full text-xs font-bold bg-orange-500 text-white animate-pulse shadow-lg">
                                  Best Seller
                                </span>
                              )}
                              {isFeatured && (
                                <span className="inline-block px-2.5 py-1.5 rounded-full text-xs font-bold bg-purple-500 text-white shadow-lg">
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="p-4 flex-1 flex flex-col">
                            <p className="font-serif text-lg italic line-clamp-2 flex-1 mb-3 text-foreground group-hover:text-destructive transition-colors">{product.name}</p>
                            <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                {usingFallback ? product.category : product.category?.name || "Uncategorized"}
                              </span>
                              <span className="text-xs font-bold text-foreground group-hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                                View →
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
        </div>
      </section>
    </Layout>
  );
};

export default Products;
