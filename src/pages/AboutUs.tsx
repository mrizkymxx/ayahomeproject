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
    description: "Aya Home Project began in Jepara, Indonesia, where fine woodworking is a living tradition. From day one, we focused on handcrafted custom furniture with export-minded construction quality, clean finishing, and design that feels timeless in both homes and hospitality spaces.",
  },
  {
    date: "July 2022",
    title: "Expansion",
    icon: Flag,
    description: "As demand increased, we expanded into larger B2B projects for villas, cafés, and boutique hotels. We strengthened production flow, quality control, and material standards to deliver consistent results that international clients can trust project after project.",
  },
  {
    date: "November 2023",
    title: "Rebranding",
    icon: RefreshCw,
    description: "We rebranded as Aya Home Project to represent a broader design capability beyond solid wood: iron, stainless steel, upholstery, and HPL integration. The new identity marked our commitment to become a reliable custom furniture partner for architects, developers, and buyers across borders.",
  },
  {
    date: "Today",
    title: "Present",
    icon: Store,
    description: "Today, we serve residential and hospitality projects in Indonesia and abroad with custom sizing, design collaboration, and shipping support. With responsive communication and dependable craftsmanship, we help international clients source furniture that is beautiful, practical, and ready for real-world use.",
  },
];

const AboutUs = () => {
  useEffect(() => {
    applyPageSeoMeta({
      title: "About Aya Home Project | Jepara Craftsmanship",
      description:
        "Discover Aya Home Project's story, craftsmanship roots in Jepara, and international-ready custom furniture capabilities.",
      canonicalUrl: "https://ayahomeproject.id/about",
      imageUrl: "https://ayahomeproject.id/og-ayahomeproject.jpg",
      keywords: ["about Aya Home Project", "Jepara craftsmanship", "custom furniture workshop"],
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
          See how our furniture brings spaces to life across Indonesia
        </p>

        <div className="mb-16" data-aos="fade-up" data-aos-delay="200">
          <h3 className="font-serif text-xl text-center mb-6 italic">
            Our Products for Hotels & Cafés in Sumbawa, Indonesia
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
                <img src={projectHosp01} alt="Hotel Project 1" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" width={400} height={300} />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="group overflow-hidden rounded-lg">
                <img src={projectHosp02} alt="Hotel Project 2" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" width={400} height={300} />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="group overflow-hidden rounded-lg">
                <img src={projectHosp03} alt="Hotel Project 3" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" width={400} height={300} />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        <div data-aos="fade-up" data-aos-delay="300">
          <h3 className="font-serif text-xl text-center mb-6 italic">
            Our Products for Sushi Restaurants in Uluwatu & Seminyak, Bali
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
                <img src={projectRest01} alt="Restaurant Project 1" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" width={400} height={300} />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="group overflow-hidden rounded-lg">
                <img src={projectRest02} alt="Restaurant Project 2" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" width={400} height={300} />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="group overflow-hidden rounded-lg">
                <img src={projectRest03} alt="Restaurant Project 3" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" width={400} height={300} />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>
    </Layout>
  );
};

export default AboutUs;
