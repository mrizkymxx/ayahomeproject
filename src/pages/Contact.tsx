import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { MapPin, Phone, Clock, Send, Instagram, MessageCircle, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitInquiry } from "@/lib/supabase-hooks";
import contactHero from "@/assets/generated/og-ayahomeproject.jpg";
import { applyPageSeoMeta } from "@/lib/seo";

const Contact = () => {
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    applyPageSeoMeta({
      title: "Contact Aya Home Project",
      description:
        "Contact Aya Home Project for custom furniture consultation, project inquiries, and international orders.",
      canonicalUrl: "https://ayahomeproject.id/contact",
      imageUrl: "https://ayahomeproject.id/og-ayahomeproject.jpg",
      keywords: ["contact Aya Home Project", "furniture consultation", "international furniture inquiry"],
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await submitInquiry({
      type: "contact",
      first_name: form.firstName,
      last_name: form.lastName,
      phone: form.phone,
      email: form.email,
      message: form.message || "No message provided",
    });

    if (result.success) {
      toast({
        title: "Message received!",
        description: "Thank you for contacting us. Our team will get back to you within 24 hours.",
      });
      setForm({ firstName: "", lastName: "", phone: "", email: "", message: "" });
    } else {
      toast({
        title: "Message failed",
        description: "We couldn’t submit your message right now. Please try again shortly.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-container py-12">
        <div className="text-center mb-12" data-aos="fade-up">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">Get In Touch</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about our furniture? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-secondary p-6 rounded-xl text-center" data-aos="fade-up" data-aos-delay="100">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-foreground text-background rounded-full mb-4">
              <MapPin size={24} />
            </div>
            <h3 className="font-sans font-bold mb-2">Visit Our Office</h3>
            <p className="text-sm text-muted-foreground">
              Sidomulyo Street, RT 5 RW 3<br />
              Langon Village, Tahunan District<br />
              Jepara Regency 59452<br />
              Central Java, Indonesia
            </p>
          </div>

          <div className="bg-secondary p-6 rounded-xl text-center" data-aos="fade-up" data-aos-delay="200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-foreground text-background rounded-full mb-4">
              <Phone size={24} />
            </div>
            <h3 className="font-sans font-bold mb-2">WhatsApp & Social</h3>
            <a href="https://wa.me/628164823454" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors block mb-1">
              +62 816-4823-454
            </a>
            <a href="https://www.instagram.com/ayahomeproject.id" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors block mb-1">
              @ayahomeproject.id
            </a>
            <a href="https://www.tokopedia.com/ayahomeproject" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Tokopedia: ayahomeproject
            </a>
          </div>

          <div className="bg-secondary p-6 rounded-xl text-center" data-aos="fade-up" data-aos-delay="300">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-foreground text-background rounded-full mb-4">
              <Clock size={24} />
            </div>
            <h3 className="font-sans font-bold mb-2">Business Hours</h3>
            <p className="text-sm text-muted-foreground">
              Monday - Friday: 8:00 - 17:00<br />
              Saturday: 8:00 - 13:00<br />
              Sunday: Closed
            </p>
          </div>
        </div>

        {/* Main Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image & Info */}
          <div data-aos="fade-right">
            <div className="rounded-2xl overflow-hidden mb-6">
              <img src={contactHero} alt="Contact Aya Home Project" className="w-full h-80 object-cover" width={600} height={400} />
            </div>
            
            <div className="bg-secondary p-6 rounded-xl">
              <h3 className="font-serif text-2xl font-bold mb-4">Why Choose Aya Home Project?</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-0.5">✓</span>
                  <span>Free consultation before ordering</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-0.5">✓</span>
                  <span>Dimension simulation via WhatsApp</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-0.5">✓</span>
                  <span>Price estimate within 24 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-0.5">✓</span>
                  <span>Custom size & design</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-0.5">✓</span>
                  <span>Nationwide & international shipping</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-0.5">✓</span>
                  <span>1-Year Structural Warranty</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-0.5">✓</span>
                  <span>Water-based & Oil finishing options</span>
                </li>
              </ul>
              
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm font-semibold mb-2">Follow Us</p>
                <div className="flex gap-3">
                  <a
                    href="https://www.instagram.com/ayahomeproject.id"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="https://wa.me/628164823454"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle size={20} />
                  </a>
                  <a
                    href="https://www.tokopedia.com/ayahomeproject"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    aria-label="Tokopedia"
                  >
                    <Store size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div data-aos="fade-left">
            <div className="bg-background border border-border p-8 rounded-2xl">
              <h2 className="font-serif text-3xl font-bold mb-2">Send Us a Message</h2>
              <p className="text-sm text-muted-foreground mb-6">Fill out the form below and we'll get back to you within 24 hours</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-sans font-semibold block mb-2">
                      First Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-sans font-semibold block mb-2">
                      Last Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-sans font-semibold block mb-2">
                    WhatsApp Number <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    placeholder="+62 812-3456-7890"
                  />
                </div>

                <div>
                  <label className="text-sm font-sans font-semibold block mb-2">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-sans font-semibold block mb-2">
                    Your Message
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about your project or inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-foreground text-background rounded-lg font-sans font-bold text-sm hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  By submitting this form, you agree to our privacy policy
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
