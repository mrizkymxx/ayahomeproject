import Layout from "@/components/Layout";
import { Settings, DollarSign, FileText, Users, Shield, MessageCircle, CheckCircle2, PlayCircle } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { applyPageSeoMeta } from "@/lib/seo";

const features = [
  {
    icon: Settings,
    title: "Custom to Your Story",
    description: "We understand that every space is unique. That's why each design we create is fully customizable to reflect your style, needs, and personality.",
  },
  {
    icon: DollarSign,
    title: "Worth Every Penny",
    description: "Our furniture is more than decoration. Made from premium materials and crafted with precision, each piece is a long-term investment that retains its value year after year.",
  },
  {
    icon: FileText,
    title: "Always Updated",
    description: "With years of expertise in the industry, we know how to combine aesthetics, functionality, and quality in every masterpiece we deliver.",
  },
  {
    icon: Users,
    title: "Built on Experience",
    description: "Transparency matters to us. You'll receive regular progress updates so you feel involved in every step of the process.",
  },
  {
    icon: Shield,
    title: "We've Got You Covered",
    description: "Our commitment doesn't end when your furniture arrives. We provide a guarantee and after-sales service to ensure your peace of mind.",
  },
  {
    icon: MessageCircle,
    title: "Free Talk, Big Ideas",
    description: "It all begins with a conversation. We offer free consultations to help you discover the perfect solution for your home and lifestyle.",
  },
];

const stats = [
  { value: "120+", label: "Clients Served" },
  { value: "280+", label: "Projects Completed" },
  { value: "4+", label: "Years Experience" },
  { value: "95%", label: "Client Satisfaction" },
];

const process = [
  { step: "01", title: "Consultation", description: "Free initial consultation to understand your needs and vision" },
  { step: "02", title: "Design", description: "Custom design creation with 3D visualization and material selection" },
  { step: "03", title: "Production", description: "Expert craftsmanship using premium materials and traditional techniques" },
  { step: "04", title: "Delivery", description: "Professional delivery and installation with full setup service" },
];

const processVideoEmbedUrl = "";

const WhyUs = () => {
  useEffect(() => {
    applyPageSeoMeta({
      title: "Why Aya Home Project | Quality & Process",
      description:
        "See why clients choose Aya Home Project: premium materials, transparent process, expert craftsmanship, and after-sales support.",
      canonicalUrl: "https://ayahomeproject.com/why-us",
      imageUrl: "https://ayahomeproject.com/og-ayahomeproject.jpg",
      keywords: ["why choose Aya Home Project", "furniture quality", "custom furniture process"],
    });
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-container py-16">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6" data-aos="fade-up">
            Why Choose Aya Home Project?
          </h1>

          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed text-base md:text-lg" data-aos="fade-up" data-aos-delay="100">
            At Aya Home Project, we believe every room has a story, and every story deserves to be brought to life in a way that is both beautiful and functional. We don't just make furniture, we craft a personal experience, filled with care, attention, and exceptional quality from start to finish.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className="bg-secondary p-6 rounded-xl text-center"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="font-serif text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features List */}
        <div className="max-w-3xl mx-auto space-y-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className="flex gap-6 items-start group"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="shrink-0 w-16 h-16 flex items-center justify-center bg-secondary rounded-full group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                <feature.icon size={40} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-sans font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="section-container py-16 bg-secondary">
        <h2 className="font-serif text-4xl md:text-5xl text-center mb-4" data-aos="fade-up">Our Process</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          From concept to completion, we guide you through every step of creating your perfect furniture
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {process.map((item, index) => (
            <div 
              key={item.step} 
              className="relative bg-background rounded-xl p-6 border border-border"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center font-serif text-lg font-bold">
                {item.step}
              </div>
              <h3 className="font-sans font-bold text-lg mb-2 mt-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-14" data-aos="fade-up" data-aos-delay="150">
          <div className="bg-background border border-border rounded-xl p-6">
            <h3 className="font-sans font-bold text-xl mb-2 text-center">Production Process Video</h3>
            <p className="text-sm text-muted-foreground text-center mb-5">
              See how we craft each piece from raw materials to final finishing.
            </p>

            <div className="aspect-video rounded-xl overflow-hidden border border-border bg-muted">
              {processVideoEmbedUrl ? (
                <iframe
                  src={processVideoEmbedUrl}
                  title="Aya Home Project production process video"
                  className="w-full h-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
                  <PlayCircle size={44} className="text-muted-foreground mb-3" />
                  <p className="font-semibold text-foreground">Video placeholder</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add your YouTube/Vimeo embed URL in <code>processVideoEmbedUrl</code> on this page.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="section-container py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl text-center mb-12" data-aos="fade-up">Our Commitment</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4" data-aos="fade-right">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="shrink-0 mt-1 text-green-600" size={20} />
                <p className="text-muted-foreground">Premium quality materials sourced from trusted suppliers</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="shrink-0 mt-1 text-green-600" size={20} />
                <p className="text-muted-foreground">Expert craftsmen with decades of woodworking experience</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="shrink-0 mt-1 text-green-600" size={20} />
                <p className="text-muted-foreground">Environmentally conscious production methods</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="shrink-0 mt-1 text-green-600" size={20} />
                <p className="text-muted-foreground">1 year warranty on all products</p>
              </div>
            </div>
            
            <div className="space-y-4" data-aos="fade-left" data-aos-delay="100">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="shrink-0 mt-1 text-green-600" size={20} />
                <p className="text-muted-foreground">Free design consultation and 3D visualization</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="shrink-0 mt-1 text-green-600" size={20} />
                <p className="text-muted-foreground">Nationwide delivery and installation service</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="shrink-0 mt-1 text-green-600" size={20} />
                <p className="text-muted-foreground">Flexible payment options for your convenience</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="shrink-0 mt-1 text-green-600" size={20} />
                <p className="text-muted-foreground">Responsive after-sales support team</p>
              </div>
            </div>
          </div>

          <p className="italic text-muted-foreground text-center text-lg leading-relaxed mb-8" data-aos="fade-up">
            Aya Home Project is more than just a place to order furniture. We are your partner in creating spaces that are comfortable, beautiful, and truly meaningful.
          </p>

          <div className="text-center" data-aos="fade-up" data-aos-delay="100">
            <Link 
              to="/contact" 
              className="inline-block px-8 py-3 bg-foreground text-background rounded-lg font-sans font-bold hover:bg-foreground/90 transition-colors"
            >
              Start Your Project Today
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WhyUs;
