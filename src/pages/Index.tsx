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
    { id: "afra-chair", name: "Afra Chair", slug: "afra-chair", img: afraChair },
    { id: "yola-chair", name: "Yola Chair", slug: "yola-chair", img: yolaChair },
    { id: "landa-chair", name: "Landa Chair", slug: "landa-chair", img: landaChair },
  ];
  const [homeProducts, setHomeProducts] = useState<HomeProduct[]>(fallbackHomeProducts);

  useEffect(() => {
    applyPageSeoMeta({
      title: "Aya Home Project | Custom Furniture Indonesia",
      description:
        "Custom furniture from Jepara for homes, cafes, restaurants, hotels, and hospitality projects worldwide.",
      canonicalUrl: "https://ayahomeproject.id/",
      imageUrl: "https://ayahomeproject.id/og-ayahomeproject.jpg",
      keywords: ["custom furniture", "Jepara furniture", "furniture Indonesia", "Aya Home Project"],
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
      subtitle: "Custom Furniture for Homes, Cafes, Hotels, and Global Projects"
    },
    {
      image: heroSlide02,
      title: "Premium Quality",
      subtitle: "Handcrafted with Passion & Precision"
    },
    {
      image: heroSlide03,
      title: "Custom Designs",
      subtitle: "Tailored to Your Unique Style"
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
        description: "We couldn’t submit your request right now. Please try again in a moment.",
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
            { icon: ShieldCheck, title: "Guarantee Product", desc: "1 year warranty on all furniture with comprehensive after-sales service." },
            { icon: Palette, title: "Custom Design", desc: "Every piece is fully customizable to match your unique style and needs." },
            { icon: Handshake, title: "Business to Business", desc: "Trusted partner for restaurants, hotels, and cafes worldwide." },
            { icon: MessageSquare, title: "Free Consultation", desc: "Expert advice to help you find the perfect furniture solutions." },
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
        <h2 className="font-serif text-4xl md:text-5xl text-center mb-4" data-aos="fade-up">Our Products</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          Handcrafted furniture made from premium materials, designed for comfort and elegance.
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
                Aya Home Project is a custom furniture studio from Jepara, Indonesia. We build premium pieces for homes and hospitality businesses with flexible design, detailed craftsmanship, and global-ready quality.
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
                  <img src={catalogImg01} alt="Aya Home Project Catalog 1" className="w-full h-80 object-cover rounded-2xl" loading="lazy" width={800} height={600} />
                </SwiperSlide>
                <SwiperSlide>
                  <img src={catalogImg02} alt="Aya Home Project Catalog 2" className="w-full h-80 object-cover rounded-2xl" loading="lazy" width={800} height={600} />
                </SwiperSlide>
                <SwiperSlide>
                  <img src={catalogImg03} alt="Aya Home Project Catalog 3" className="w-full h-80 object-cover rounded-2xl" loading="lazy" width={800} height={600} />
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
              title: "Customizable",
              desc: "Every design is fully customizable to reflect your style and personality.",
              icon: Palette,
            },
            {
              title: "Premium Quality",
              desc: "Made from premium materials, crafted with precision for lasting value.",
              icon: Handshake,
            },
            {
              title: "Guarantee 1 Year",
              desc: "We provide guarantee and after-sales service for your peace of mind.",
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

      {/* Best Seller Section */}
      <section className="bg-secondary py-16">
        <div className="section-container">
          <h2 className="font-serif text-4xl md:text-5xl text-center mb-12" data-aos="fade-up">Aya Home Project Best Seller</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { img: afraChair, name: "Afra Chair" },
              { img: yolaChair, name: "Yola Chair" },
              { img: landaChair, name: "Landa Chair" },
              { img: briliyChair, name: "Briliy Chair" },
            ].map((product, index) => (
              <Link 
                to="/products" 
                key={product.name} 
                className="group text-center"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="bg-background rounded-xl overflow-hidden aspect-square flex items-center justify-center p-6 group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                  <img src={product.img} alt={product.name} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-300" loading="lazy" width={300} height={300} />
                </div>
                <p className="mt-4 font-serif text-base italic">{product.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
