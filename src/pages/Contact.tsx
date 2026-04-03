import Layout from "@/components/Layout";
import { useState } from "react";
import contactHero from "@/assets/contact-hero.jpg";

const Contact = () => {
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Name: ${form.firstName} ${form.lastName}\nPhone: ${form.phone}\nEmail: ${form.email}`;
    window.open(`https://wa.me/6289534721020?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <Layout>
      <section className="section-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image */}
          <div className="rounded-xl overflow-hidden">
            <img src={contactHero} alt="Contact" className="w-full h-full object-cover min-h-[400px]" width={600} height={600} />
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-center">
            <h1 className="font-serif text-4xl font-bold mb-6">Contact Us</h1>
            <div className="space-y-4">
              <div>
                <h3 className="font-sans font-semibold">Office</h3>
                <p className="text-sm text-muted-foreground">
                  Loewes Furniture<br />
                  Platar Village RT.02/RW.01, Subdistrict Tahunan, Regency Jepara, Central Java Province, Postal Code 59423, Indonesia
                </p>
              </div>
              <div>
                <h3 className="font-sans font-semibold">Email</h3>
                <p className="text-sm text-muted-foreground">loewesfurniture@gmail.com</p>
              </div>
              <div>
                <h3 className="font-sans font-semibold">Phone / WhatsApp</h3>
                <p className="text-sm text-muted-foreground">+62 895-3472-10204</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-sans">
                  <span className="text-destructive">*</span> First Name
                </label>
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-muted border-0 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-sans">
                  <span className="text-destructive">*</span> Last Name
                </label>
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-muted border-0 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-sans">
                  <span className="text-destructive">*</span> WhatsApp Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-muted border-0 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-sans">
                  <span className="text-destructive">*</span> Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-muted border-0 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex items-start gap-4 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2 border border-foreground text-sm font-sans hover:bg-foreground hover:text-background transition-colors"
                >
                  Submit
                </button>
                <p className="text-xs text-muted-foreground">
                  Loewes Furniture requires your contact information to contact you regarding our products and services.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
