import Layout from "@/components/Layout";
import { Link, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { applyPageSeoMeta } from "@/lib/seo";
import productsHero from "@/assets/products-hero.jpg";
import afraChair from "@/assets/products/afra-chair.jpg";
import yolaChair from "@/assets/products/yola-chair.jpg";
import landaChair from "@/assets/products/landa-chair.jpg";
import briliyChair from "@/assets/products/briliy-chair.jpg";
import yantamChair from "@/assets/products/yantam-chair.jpg";
import gunawChair from "@/assets/products/gunaw-chair.jpg";

// Fallback hardcoded data
const hardcodedCategories = ["Bed", "Sofas", "Table", "Chair", "Dining Set", "Coffee Table"];
const hardcodedProducts = [
  { id: "afra-chair", name: "Afra Chair", category: "Chair", slug: "afra-chair", image: afraChair },
  { id: "yola-chair", name: "Yola Chair", category: "Chair", slug: "yola-chair", image: yolaChair },
  { id: "landa-chair", name: "Landa Chair", category: "Chair", slug: "landa-chair", image: landaChair },
  { id: "briliy-chair", name: "Briliy Chair", category: "Chair", slug: "briliy-chair", image: briliyChair },
  { id: "yantam-chair", name: "Yantam Chair", category: "Chair", slug: "yantam-chair", image: yantamChair },
  { id: "gunaw-chair", name: "Gunaw Chair", category: "Chair", slug: "gunaw-chair", image: gunawChair },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "Chair";
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
      title: "Products | Aya Home Project",
      description:
        "Browse Aya Home Project products: handcrafted chairs and custom furniture for residential and hospitality spaces.",
      canonicalUrl: "https://ayahomeproject.id/products",
      imageUrl: "https://ayahomeproject.id/og-ayahomeproject.jpg",
      keywords: ["furniture products", "custom chairs", "hospitality furniture", "Aya Home Project"],
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
          .select('*')
          .order('name');

        // Fetch products with category relation
        const { data: prodsData, error: prodsError } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(id, name, slug)
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
          setProducts(prodsData || []);
          setUsingFallback(false);
          console.log('✅ Loaded from Supabase:', { categories: catsData?.length, products: prodsData?.length });
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

  // Get active category object
  const activeCategoryObj = categories.find(c => 
    (c.name === activeCategory) || (c.slug === activeCategory.toLowerCase().replace(' ', '-'))
  );

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

  // Filter products by active category
  let filteredProducts = products.filter((p) => {
    if (usingFallback) {
      return p.category === activeCategory;
    }
    return p.category?.name === activeCategory;
  });

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
        <div className="hero-banner h-[300px]">
          <img src={productsHero} alt="Products" className="w-full h-full object-cover rounded-2xl" width={1200} height={600} />
          <div className="hero-overlay rounded-2xl">
            <h1 className="font-serif text-5xl md:text-6xl text-primary-foreground font-bold">Products</h1>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-container py-12">
        {/* Search & Sort Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          
          {/* Mobile Category Dropdown */}
          <div className="w-full md:hidden">
            <select
              value={activeCategory}
              onChange={(e) => setSearchParams({ category: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring font-sans"
            >
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name} ({categoryCounts[cat.name] || 0})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <SlidersHorizontal size={20} className="text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="name">Sort by Name</option>
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
          {/* Categories Sidebar - Hidden on Mobile */}
          <div className="hidden md:block">
            <h3 className="font-sans font-bold text-lg mb-4">Categories</h3>
            
            {/* Category Search - Only show if many categories */}
            {categories.length > 8 && (
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            )}

            {/* Scrollable Category List */}
            <div className={`space-y-2 ${categories.length > 10 ? 'max-h-96 overflow-y-auto pr-2 scrollbar-thin' : ''}`}>
              {filteredCategories.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No categories found</p>
              ) : (
                filteredCategories.map((cat) => (
                  <button
                    key={cat.id || cat.slug || cat.name}
                    onClick={() => setSearchParams({ category: cat.name })}
                    className={`text-sm font-sans transition-all w-full text-left px-3 py-2 rounded-lg flex items-center justify-between group ${
                      activeCategory === cat.name
                        ? "bg-foreground text-background font-bold"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`text-xs ${activeCategory === cat.name ? 'text-background/70' : 'text-muted-foreground'}`}>
                      {categoryCounts[cat.name] || 0}
                    </span>
                  </button>
                ))
              )}
            </div>

            {/* Contact CTA */}
            <div className="mt-6 p-4 bg-secondary rounded-lg">
              <p className="text-sm font-sans font-bold mb-2">Need Custom Furniture?</p>
              <p className="text-xs text-muted-foreground mb-3">Contact us for custom orders and bulk purchases.</p>
              <Link 
                to="/contact" 
                className="text-xs font-bold text-destructive hover:underline"
              >
                Contact Us →
              </Link>
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
                <p className="text-muted-foreground text-lg mb-2">No products found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                  {usingFallback && <span className="ml-2 text-yellow-600">⚠️ Using cached data</span>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => {
                    const productImage = usingFallback ? product.image : (product.images?.[0] || afraChair);
                    const productSlug = product.slug || product.id;
                    
                    return (
                      <Link
                        to={`/products/${productSlug}`}
                        key={product.id || index}
                        className="group"
                        data-aos="fade-up"
                        data-aos-delay={index * 50}
                      >
                        <div className="bg-background border border-border rounded-xl overflow-hidden hover:border-foreground transition-all duration-300 hover:shadow-xl">
                          <div className="aspect-square flex items-center justify-center p-6 bg-secondary group-hover:bg-background transition-colors">
                            <img
                              src={productImage}
                              alt={product.name}
                              className="max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                              loading="lazy"
                              width={400}
                              height={400}
                            />
                          </div>
                          <div className="p-4">
                            <p className="font-serif text-lg italic mb-2">{product.name}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {usingFallback ? product.category : product.category?.name}
                              </span>
                              <span className="text-xs font-bold text-foreground group-hover:text-destructive transition-colors">
                                View Details →
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
      </section>
    </Layout>
  );
};

export default Products;
