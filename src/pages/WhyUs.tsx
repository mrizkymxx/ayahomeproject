import Layout from "@/components/Layout";
import { Settings, DollarSign, FileText, Users, Shield, MessageCircle } from "lucide-react";

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

const WhyUs = () => {
  return (
    <Layout>
      <section className="section-container py-16">
        <h1 className="font-serif text-6xl md:text-8xl leading-tight mb-8">
          <span className="block">Why</span>
          <span className="block text-right">Loewes</span>
          <span className="block text-right">Furniture?</span>
        </h1>

        <p className="italic text-muted-foreground max-w-3xl mx-auto text-center mb-16 leading-relaxed">
          At Loewes Furniture, we believe every room has a story, and every story deserves to be brought to life in a way that is both beautiful and functional. We don't just make furniture, we craft a personal experience, filled with care, attention, and exceptional quality from start to finish.
        </p>

        <div className="max-w-2xl mx-auto space-y-12">
          {features.map((feature) => (
            <div key={feature.title} className="flex gap-6 items-start">
              <div className="shrink-0 w-16 h-16 flex items-center justify-center">
                <feature.icon size={40} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-sans font-bold text-lg underline underline-offset-4 mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="italic text-muted-foreground max-w-3xl mx-auto text-center mt-16 leading-relaxed">
          Loewes Furniture is more than just a place to order furniture. We are your partner in creating spaces that are comfortable, beautiful, and truly meaningful.
        </p>
      </section>
    </Layout>
  );
};

export default WhyUs;
