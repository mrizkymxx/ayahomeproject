import Layout from "@/components/Layout";
import { useEffect } from "react";
import aboutHero from "@/assets/about-hero.jpg";
import projectHosp01 from "@/assets/generated/hotel-sumbawa-01.jpg";
import projectHosp02 from "@/assets/generated/hotel-sumbawa-02.jpg";
import projectHosp03 from "@/assets/generated/hotel-sumbawa-03.jpg";
import projectRest01 from "@/assets/generated/sushi-bali-01.jpg";
import projectRest02 from "@/assets/generated/sushi-bali-02.jpg";
import projectRest03 from "@/assets/generated/sushi-bali-03.jpg";
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
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="section-container py-16 bg-secondary">
        <h2 className="font-serif text-5xl md:text-6xl text-center mb-4" data-aos="fade-up">Projects</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          Our Suar wood installations bring warmth and character to spaces across the globe
        </p>

        <div className="mb-16" data-aos="fade-up" data-aos-delay="200">
          <h3 className="font-serif text-xl text-center mb-6 italic">
            Suar Wood Installations for Hotels & Resorts
          </h3>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="projects-swiper"
          >
            <SwiperSlide>
              <div className="group overflow-hidden rounded-lg">
                <img src={projectHosp01} alt="Suar Wood Hotel Reception Desk" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" width={400} height={300} />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="group overflow-hidden rounded-lg">
                <img src={projectHosp02} alt="Suar Wood Resort Dining Table" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" width={400} height={300} />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="group overflow-hidden rounded-lg">
                <img src={projectHosp03} alt="Suar Wood Hotel Suite Furniture" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" width={400} height={300} />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        <div data-aos="fade-up" data-aos-delay="300">
          <h3 className="font-serif text-xl text-center mb-6 italic">
            Live-Edge Bar Tops & Tables for Restaurants Worldwide
          </h3>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="projects-swiper"
          >
            <SwiperSlide>
              <div className="group overflow-hidden rounded-lg">
                <img src={projectRest01} alt="Suar Wood Bar Counter" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" width={400} height={300} />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="group overflow-hidden rounded-lg">
                <img src={projectRest02} alt="Suar Wood Restaurant Tables" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" width={400} height={300} />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="group overflow-hidden rounded-lg">
                <img src={projectRest03} alt="Suar Wood Private Dining Table" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" width={400} height={300} />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>
    </Layout>
  );
};

export default AboutUs;
