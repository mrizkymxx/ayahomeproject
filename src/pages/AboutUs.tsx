import Layout from "@/components/Layout";
import { useEffect } from "react";
import aboutHero from '@/assets/about-hero.webp';
import projectHosp01 from '@/assets/generated/hotel-sumbawa-01.webp';
import projectHosp02 from '@/assets/generated/hotel-sumbawa-02.webp';
import projectHosp03 from '@/assets/generated/hotel-sumbawa-03.webp';
import projectRest01 from '@/assets/generated/sushi-bali-01.webp';
import projectRest02 from '@/assets/generated/sushi-bali-02.webp';
import projectRest03 from '@/assets/generated/sushi-bali-03.webp';
import { applyPageSeoMeta } from "@/lib/seo";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { HandMetal, Flag, RefreshCw, Store } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const timelineData = [
  {
    date: "March 2021",
    title: "Founded",
    icon: HandMetal,
    description: "Aya Home Project was established in Jepara, Indonesia — the heartland of Indonesian woodworking. From day one, we specialized in Suar (Trembesi) wood, sourcing premium slabs from sustainable plantations across Java and transforming them into live-edge masterpieces with export-grade finishing.",
  },
  {
    date: "July 2022",
    title: "First Export",
    icon: Flag,
    description: "Our first international shipment marked a major milestone. We began supplying live-edge Suar dining tables and bar tops to boutique hotels and restaurants in Australia, Japan, and Europe. Our reputation for consistent quality and reliable delivery grew rapidly in the global market.",
  },
  {
    date: "November 2023",
    title: "Expansion",
    icon: RefreshCw,
    description: "We expanded our workshop and upgraded to industrial kiln-drying facilities to meet growing international demand. Our product range broadened to include conference tables, reception desks, and custom hospitality furniture — all crafted from premium Suar wood with resin, metal, and mixed-material options.",
  },
  {
    date: "Today",
    title: "Present",
    icon: Store,
    description: "Today, Aya Home Project serves clients across 15+ countries — from private homeowners seeking a statement dining table to five-star resorts furnishing entire properties with Suar wood. Every slab is hand-selected, kiln-dried, and finished to perfection in our Jepara workshop.",
  },
];

const AboutUs = () => {
  useEffect(() => {
    applyPageSeoMeta({
      title: "About Aya Home Project | Suar Wood Specialists from Jepara",
      description:
        "Discover our journey as Indonesia's premier Suar (Trembesi) wood furniture studio. From Jepara to the world — handcrafted live-edge tables and custom wood furniture.",
      canonicalUrl: "https://ayahomeproject.com/about",
      imageUrl: "https://ayahomeproject.com/og-ayahomeproject.jpg",
      keywords: ["about Aya Home Project", "Suar wood Jepara", "Trembesi furniture workshop", "live edge table maker"],
    });
  }, []);

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="section-container py-6">
        <div className="hero-banner h-[300px]" data-aos="fade-down">
          <img src={aboutHero} alt="Our Journey" className="w-full h-full object-cover object-top rounded-2xl" width={800} height={512} />
          <div className="hero-overlay rounded-2xl">
            <h1 className="font-serif text-5xl md:text-6xl text-primary-foreground font-bold italic">
              Our Journey
            </h1>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-container py-16">
        <h2 className="font-serif text-4xl md:text-5xl text-center mb-12" data-aos="fade-up">Our Story</h2>
        <div className="max-w-4xl mx-auto space-y-16">
          {timelineData.map((item, index) => (
            <div 
              key={index} 
              className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8"
              data-aos="fade-right"
              data-aos-delay={index * 100}
            >
              <div className="text-center md:text-left">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-secondary rounded-full group-hover:bg-foreground group-hover:text-background transition-colors">
                  <item.icon size={32} strokeWidth={1.5} />
                </div>
                <p className="font-serif text-xl font-bold">{item.date}</p>
                <p className="text-sm text-muted-foreground mt-1">{item.title}</p>
              </div>
              <div>
                <p className="text-foreground leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section - Showcase */}
      <section className="section-container py-20 bg-secondary">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="inline-block px-3 py-1 bg-background rounded-full mb-4">
              <span className="text-xs font-sans tracking-widest uppercase text-muted-foreground">Featured Projects</span>
            </div>
            <h2 className="font-serif text-5xl md:text-6xl mb-6 font-bold">Trusted By Leading Hospitality Brands</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From boutique hotels in Bali to Michelin-featured restaurants worldwide, our Suar wood installations elevate luxury spaces with timeless craftsmanship and natural beauty.
            </p>
          </div>

          {/* Hotels & Resorts */}
          <div className="mb-20" data-aos="fade-up" data-aos-delay="100">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1 bg-border"></div>
              <div className="px-4 py-2 bg-background rounded-lg border border-border">
                <h3 className="font-sans font-bold text-sm tracking-widest uppercase text-muted-foreground">
                  Hotels & Resorts
                </h3>
              </div>
              <div className="h-px flex-1 bg-border"></div>
            </div>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Custom reception desks, dining tables, and lobby installations that define the hospitality experience
            </p>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="projects-swiper"
            >
              {[
                { src: projectHosp01, alt: "Luxury hotel reception desk with hand-selected Suar wood live-edge top and metal base", title: "Reception Desk" },
                { src: projectHosp02, alt: "Resort dining installation featuring custom Suar wood table with integrated resin design", title: "Dining Installation" },
                { src: projectHosp03, alt: "Hotel suite furniture showcasing premium Suar wood craftsmanship with natural grain patterns", title: "Suite Furniture" },
              ].map((project, idx) => (
                <SwiperSlide key={idx}>
                  <div className="group overflow-hidden rounded-xl shadow-lg">
                    <div className="relative w-full h-80">
                      <img 
                        src={project.src}
                        alt={project.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        width={400}
                        height={300}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    </div>
                    <div className="px-4 py-3 bg-background border-b border-border">
                      <p className="text-sm font-sans font-semibold text-foreground">{project.title}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Restaurants & Bars */}
          <div data-aos="fade-up" data-aos-delay="200">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1 bg-border"></div>
              <div className="px-4 py-2 bg-background rounded-lg border border-border">
                <h3 className="font-sans font-bold text-sm tracking-widest uppercase text-muted-foreground">
                  Restaurants & Bars
                </h3>
              </div>
              <div className="h-px flex-1 bg-border"></div>
            </div>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Statement bar tops, private dining tables, and signature installations for culinary destinations
            </p>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="projects-swiper"
            >
              {[
                { src: projectRest01, alt: "Premium bar counter crafted from single Suar wood slab with professional-grade finishing", title: "Bar Counter" },
                { src: projectRest02, alt: "Restaurant private dining table in live-edge Suar wood with custom metalwork installation", title: "Dining Table" },
                { src: projectRest03, alt: "Signature restaurant installation featuring exceptional Suar wood grain patterns and live-edge design", title: "Signature Installation" },
              ].map((project, idx) => (
                <SwiperSlide key={idx}>
                  <div className="group overflow-hidden rounded-xl shadow-lg">
                    <div className="relative w-full h-80">
                      <img 
                        src={project.src}
                        alt={project.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        width={400}
                        height={300}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    </div>
                    <div className="px-4 py-3 bg-background border-b border-border">
                      <p className="text-sm font-sans font-semibold text-foreground">{project.title}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutUs;
