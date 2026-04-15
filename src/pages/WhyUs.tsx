import Layout from "@/components/Layout";
import { Settings, DollarSign, FileText, Users, Shield, MessageCircle, CheckCircle2, PlayCircle } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { applyPageSeoMeta } from "@/lib/seo";

const features = [
  {
    icon: Settings,
    title: "Custom to Your Vision",
    description: "Every Suar slab is unique. We work with you to select the perfect slab, edge profile, dimensions, and finish — creating a one-of-a-kind piece that reflects your style and space.",
  },
  {
    icon: DollarSign,
    title: "Worth Every Penny",
    description: "Suar wood is a lifetime investment. Its natural durability, stunning grain patterns, and timeless appeal mean your furniture gains character with age rather than losing value.",
  },
  {
    icon: FileText,
    title: "Export-Grade Standards",
    description: "Every slab is kiln-dried to 8-12% moisture content, treated for international phytosanitary compliance, and finished with premium coatings suitable for any climate worldwide.",
  },
  {
    icon: Users,
    title: "Transparent Process",
    description: "From slab selection photos to production updates and shipping tracking — you'll receive regular progress reports so you feel connected to every step of the crafting process.",
  },
  {
    icon: Shield,
    title: "We've Got You Covered",
    description: "Our commitment extends beyond delivery. We provide a 1-year structural warranty and responsive after-sales support to ensure your Suar furniture stays perfect.",
  },
  {
    icon: MessageCircle,
    title: "Free Consultation",
    description: "Not sure which slab, finish, or size is right? Our team offers free consultations to guide you through Suar wood selection, design options, and shipping logistics.",
  },
];

const stats = [
  { value: "120+", label: "Clients Served" },
  { value: "280+", label: "Slabs Crafted" },
  { value: "15+", label: "Countries Shipped" },
  { value: "95%", label: "Client Satisfaction" },
];

const process = [
  { step: "01", title: "Slab Selection", description: "Choose your Suar slab from our inventory with photos of grain, dimensions, and live-edge profiles" },
  { step: "02", title: "Design & Finish", description: "Select edge treatment, leg style, and finishing — natural oil, lacquer, epoxy resin, or custom options" },
  { step: "03", title: "Craftsmanship", description: "Expert artisans kiln-dry, shape, sand, and finish your piece using traditional Jepara woodworking techniques" },
  { step: "04", title: "Worldwide Delivery", description: "Professional crating and international shipping via sea or air freight with full tracking and insurance" },
];

const processVideoEmbedUrl = "";

const WhyUs = () => {
  useEffect(() => {
    applyPageSeoMeta({
      title: "Why Choose Aya Home Project | Suar Wood Quality & Process",
      description:
        "See why international clients choose Aya Home Project for premium Suar wood furniture: kiln-dried slabs, export-grade quality, transparent process, and worldwide shipping.",
      canonicalUrl: "https://ayahomeproject.com/why-us",
      imageUrl: "https://ayahomeproject.com/og-ayahomeproject.jpg",
      keywords: ["why choose Aya Home Project", "suar wood quality", "live edge table process", "international furniture shipping"],
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
            We don't just sell furniture — we craft heirloom-quality Suar wood pieces that tell a story. From hand-selecting raw slabs in our Jepara workshop to delivering finished masterpieces worldwide, every step is guided by craftsmanship, transparency, and an obsession with quality.
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
          From raw Suar slab to finished masterpiece — we guide you through every step of creating your perfect furniture
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
              See how we transform raw Suar slabs into stunning live-edge furniture.
            </p>

            <div className="aspect-video rounded-xl overflow-hidden border border-border bg-muted">
              {processVideoEmbedUrl ? (
                <iframe
                  src={processVideoEmbedUrl}
                  title="Aya Home Project Suar wood production process video"
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
                <p className="text-muted-foreground">Premium Suar slabs sourced from sustainable plantations across Java</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="shrink-0 mt-1 text-green-600" size={20} />
                <p className="text-muted-foreground">Industrial kiln-drying to 8-12% moisture for crack-free stability</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="shrink-0 mt-1 text-green-600" size={20} />
                <p className="text-muted-foreground">ISPM-15 compliant crating for international shipping</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="shrink-0 mt-1 text-green-600" size={20} />
                <p className="text-muted-foreground">1-year structural warranty on all products</p>
              </div>
            </div>
            
            <div className="space-y-4" data-aos="fade-left" data-aos-delay="100">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="shrink-0 mt-1 text-green-600" size={20} />
                <p className="text-muted-foreground">Free slab selection consultation with photos and measurements</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="shrink-0 mt-1 text-green-600" size={20} />
                <p className="text-muted-foreground">Worldwide shipping — sea freight and air freight options</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="shrink-0 mt-1 text-green-600" size={20} />
                <p className="text-muted-foreground">Multiple finish options: natural oil, lacquer, epoxy resin, water-based</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="shrink-0 mt-1 text-green-600" size={20} />
                <p className="text-muted-foreground">Responsive after-sales support team via WhatsApp and email</p>
              </div>
            </div>
          </div>

          <p className="italic text-muted-foreground text-center text-lg leading-relaxed mb-8" data-aos="fade-up">
            Aya Home Project is more than a furniture workshop. We are your trusted partner in bringing the natural beauty of Indonesian Suar wood into homes, hotels, and restaurants around the world.
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
