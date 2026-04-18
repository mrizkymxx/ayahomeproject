import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { ShieldCheck, Palette, Handshake, MessageSquare } from 'lucide-react';
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { submitInquiry } from "@/lib/supabase-hooks";
import { supabase } from "@/integrations/supabase/client";
import { applyPageSeoMeta } from "@/lib/seo";
import heroSlide01 from "@/assets/generated/hero-home-01.jpg";
import heroSlide02 from "@/assets/generated/hero-home-02.jpg";
import heroSlide03 from "@/assets/generated/hero-home-03.jpg";
import afraChair from "@/assets/products/afra-chair.jpg";
import yolaChair from "@/assets/products/yola-chair.jpg";
import landaChair from "@/assets/products/landa-chair.jpg";
import briliyChair from "@/assets/products/briliy-chair.jpg";
import catalogImg01 from "@/assets/generated/catalog-book-01.jpg";
import catalogImg02 from "@/assets/generated/catalog-book-02.jpg";
import catalogImg03 from "@/assets/generated/catalog-book-03.jpg";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

type HomeProduct = {
  id: string;
  name: string;
  slug: string;
  img: string;
};

const Index = () => {
  const { toast } = useToast();
  const [isCatalogSubmitting, setIsCatalogSubmitting] = useState(false);
  const fallbackHomeProducts: HomeProduct[] = [
    { id: "afra-chair", name: "Suar Dining Table", slug: "afra-chair", img: afraChair },
    { id: "yola-chair", name: "Suar Coffee Table", slug: "yola-chair", img: yolaChair },
    { id: "landa-chair", name: "Suar Console Table", slug: "landa-chair", img: landaChair },
  ];
  const [homeProducts, setHomeProducts] = useState<HomeProduct[]>(fallbackHomeProducts);

  useEffect(() => {
    applyPageSeoMeta({
      title: "Aya Home Project | Premium Suar Wood Furniture Indonesia",
      description:
        "Premium live-edge Suar (Trembesi) wood furniture handcrafted in Jepara, Indonesia. Custom dining tables, coffee tables, and bar tops for homes, hotels, and restaurants worldwide.",
      canonicalUrl: "https://ayahomeproject.com/",
      imageUrl: "https://ayahomeproject.com/og-ayahomeproject.jpg",
      keywords: ["suar wood furniture", "trembesi wood", "live edge table", "monkey pod wood", "Jepara furniture", "Aya Home Project"],
    });
  }, []);

  useEffect(() => {
    let active = true;

    async function fetchHomeProducts() {
      const fallbackImageBySlug: Record<string, string> = {
        "afra-chair": afraChair,
        "yola-chair": yolaChair,
        "landa-chair": landaChair,
      };

      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, images, is_featured, created_at")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })
        .order("name", { ascending: true })
        .limit(3);

      if (!active || error || !data?.length) return;

      const mapped: HomeProduct[] = data.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        img: product.images?.[0] || fallbackImageBySlug[product.slug] || afraChair,
      }));

      setHomeProducts(mapped);
    }

    fetchHomeProducts();

    return () => {
      active = false;
    };
  }, []);

  const heroSlides = [
    {
      image: heroSlide01,
      title: "Aya Home Project",
      subtitle: "Premium Suar & Trembesi Wood Furniture for the World"
    },
    {
      image: heroSlide02,
      title: "Live-Edge Masterpieces",
      subtitle: "Each Slab Tells a Unique Story of Nature"
    },
    {
      image: heroSlide03,
      title: "Crafted in Jepara",
      subtitle: "Exported to Homes, Hotels & Restaurants Worldwide"
    }
  ];

  const handleCatalogSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCatalogSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const firstName = String(formData.get('firstName') || "");
    const lastName = String(formData.get('lastName') || "");
    const phone = String(formData.get('phone') || "");
    const email = String(formData.get('email') || "");

    const result = await submitInquiry({
      type: "catalog",
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      message: "Catalog request from homepage form",
    });

    if (result.success) {
      toast({
        title: "Request received!",
        description: "Thank you. Our team will review your catalog request and contact you shortly.",
      });
      e.currentTarget.reset();
    } else {
      toast({
        title: "Request failed",
        description: "We couldn't submit your request right now. Please try again in a moment.",
        variant: "destructive",
      });
    }
    setIsCatalogSubmitting(false);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-container py-6">
        <div className="hero-banner h-[500px]">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            speed={800}
            className="hero-swiper h-full"
          >
            {heroSlides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <img 
                    src={slide.image} 
                    alt={slide.title}
                    className="w-full h-full object-cover rounded-2xl" 
                    width={1920} 
                    height={800} 
                  />
                  <div className="hero-overlay rounded-2xl">
                    <div className="text-center">
                      <h1 className="font-serif text-5xl md:text-7xl text-primary-foreground font-bold">
                        {slide.title}
                      </h1>
                      <p className="text-primary-foreground/80 mt-4 text-lg font-sans">
                        {slide.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: ShieldCheck, title: "Guaranteed Quality", desc: "Every Suar slab is kiln-dried, treated, and finished to international export standards with a 1-year warranty." },
            { icon: Palette, title: "Custom Live-Edge", desc: "Choose your slab, edge profile, finish, and leg design. Every piece is one-of-a-kind, crafted to your vision." },
            { icon: Handshake, title: "B2B & Hospitality", desc: "Trusted partner for hotels, restaurants, resorts, and interior designers across 15+ countries." },
            { icon: MessageSquare, title: "Free Consultation", desc: "Expert advice on Suar wood selection, dimensions, finishes, and international shipping logistics." },
          ].map((feature) => (
            <div 
              key={feature.title} 
              className="text-center p-6 rounded-xl hover:bg-secondary transition-colors group"
              data-aos="fade-up"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-secondary group-hover:bg-background rounded-full transition-colors">
                <feature.icon size={40} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-container py-16">
        <h2 className="font-serif text-4xl md:text-5xl text-center mb-4" data-aos="fade-up">Our Suar Collection</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          Handcrafted live-edge Suar wood furniture, each piece showcasing the unique beauty of Trembesi grain.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {homeProducts.map((product, index) => (
            <Link 
              to={`/products/${product.slug}`}
              key={product.id}
              className="group text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-secondary rounded-xl overflow-hidden aspect-square flex items-center justify-center p-8 group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                <img src={product.img} alt={product.name} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-300" loading="lazy" width={400} height={400} />
              </div>
              <p className="mt-4 font-serif text-lg italic">{product.name}</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/products" className="inline-block border-2 border-foreground px-8 py-3 font-sans text-sm tracking-wider uppercase hover:bg-foreground hover:text-background transition-colors">
            View All Products
          </Link>
        </div>
      </section>

      {/* About Preview with Catalog Form */}
      <section className="bg-secondary py-16">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl mb-6">Our Journey</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Aya Home Project specializes in premium Suar (Trembesi) wood furniture from Jepara, Indonesia. We source the finest Suar slabs and transform them into stunning live-edge dining tables, coffee tables, bar tops, and statement pieces for homes and hospitality projects worldwide.
              </p>
              
              {/* Request Catalog Form */}
              <div className="bg-background p-6 rounded-xl mb-6">
                <h3 className="font-sans font-bold text-lg mb-4">Request Our Catalog</h3>
                <form onSubmit={handleCatalogSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      required
                      className="px-3 py-2 bg-muted border-0 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      required
                      className="px-3 py-2 bg-muted border-0 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="WhatsApp Number"
                    required
                    className="w-full px-3 py-2 bg-muted border-0 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    required
                    className="w-full px-3 py-2 bg-muted border-0 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    type="submit"
                    disabled={isCatalogSubmitting}
                    className="w-full px-6 py-2 border-2 border-foreground text-sm tracking-wider uppercase hover:bg-foreground hover:text-background transition-colors"
                  >
                    {isCatalogSubmitting ? "Submitting..." : "Submit Request"}
                  </button>
                </form>
              </div>

              <Link to="/about" className="inline-block text-sm underline underline-offset-4 hover:text-muted-foreground transition-colors">
                Read More About Us →
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={16}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop={true}
                className="projects-swiper"
              >
                <SwiperSlide>
                  <img src={catalogImg01} alt="Suar Wood Catalog Preview 1" className="w-full h-80 object-cover rounded-2xl" loading="lazy" width={800} height={600} />
                </SwiperSlide>
                <SwiperSlide>
                  <img src={catalogImg02} alt="Suar Wood Catalog Preview 2" className="w-full h-80 object-cover rounded-2xl" loading="lazy" width={800} height={600} />
                </SwiperSlide>
                <SwiperSlide>
                  <img src={catalogImg03} alt="Suar Wood Catalog Preview 3" className="w-full h-80 object-cover rounded-2xl" loading="lazy" width={800} height={600} />
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-container py-16 text-center">
        <h2 className="font-serif text-4xl md:text-5xl mb-12" data-aos="fade-up">Why Aya Home Project?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Solid Suar Wood",
              desc: "Every piece is crafted from genuine Suar (Trembesi / Monkey Pod) wood — kiln-dried and finished to perfection.",
              icon: Palette,
            },
            {
              title: "Export-Grade Quality",
              desc: "Built to international standards with premium finishes, ready for worldwide shipping via sea or air freight.",
              icon: Handshake,
            },
            {
              title: "Guarantee 1 Year",
              desc: "We provide a structural warranty and responsive after-sales support for your complete peace of mind.",
              icon: ShieldCheck,
            },
          ].map((item, index) => (
            <div 
              key={item.title} 
              className="p-6 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-full bg-secondary">
                <item.icon size={28} strokeWidth={1.75} />
              </div>
              <h3 className="font-serif text-xl mb-3">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Best Seller Section - Customer Favorites */}
      <section className="bg-secondary py-20">
        <div className="section-container">
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="inline-block px-3 py-1 bg-background rounded-full mb-4">
              <span className="text-xs font-sans tracking-widest uppercase text-muted-foreground">Customer Favorites</span>
            </div>
            <h2 className="font-serif text-5xl md:text-6xl mb-6 font-bold">Most-Loved Suar Pieces</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover the Suar wood furniture that our global clients choose most—proven favorites for homes, hotels, and restaurants seeking timeless quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { img: afraChair, name: "Live-Edge Dining Table", category: "Dining", badge: "Top Rated" },
              { img: yolaChair, name: "Round Coffee Table", category: "Living", badge: "Best Seller" },
              { img: landaChair, name: "Statement Console", category: "Entryway", badge: "Most Popular" },
              { img: briliyChair, name: "Premium Bar Top", category: "Hospitality", badge: "Trending" },
            ].map((product, index) => (
              <Link 
                to="/products" 
                key={product.name} 
                className="group"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  {/* Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-destructive/90 rounded-full z-10">
                    <span className="text-xs font-bold text-white">{product.badge}</span>
                  </div>

                  {/* Image */}
                  <div className="bg-background aspect-square flex items-center justify-center p-8 group-hover:bg-muted transition-colors duration-300 overflow-hidden">
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      className="max-h-full object-contain group-hover:scale-125 transition-transform duration-500" 
                      loading="lazy" 
                      width={300} 
                      height={300} 
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">{product.category}</p>
                  <p className="font-serif text-lg font-semibold group-hover:text-primary transition-colors mb-3 line-clamp-2">{product.name}</p>
                  <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View Details
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link to="/products" className="inline-flex items-center gap-2 px-8 py-3 border-2 border-foreground font-sans text-sm tracking-wider uppercase hover:bg-foreground hover:text-background transition-colors">
              Explore Complete Collection
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
