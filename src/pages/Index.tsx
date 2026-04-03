import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-home.jpg";
import afraChair from "@/assets/products/afra-chair.jpg";
import yolaChair from "@/assets/products/yola-chair.jpg";
import landaChair from "@/assets/products/landa-chair.jpg";
import hotelBali from "@/assets/projects/hotel-bali.jpg";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-container py-6">
        <div className="hero-banner h-[500px]">
          <img src={heroImg} alt="Loewes Furniture Showroom" className="w-full h-full object-cover rounded-2xl" width={1920} height={800} />
          <div className="hero-overlay rounded-2xl">
            <div className="text-center">
              <h1 className="font-serif text-5xl md:text-7xl text-primary-foreground font-bold">
                Loewes Furniture
              </h1>
              <p className="text-primary-foreground/80 mt-4 text-lg font-sans">
                Crafting Timeless Furniture Since 2021
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-container py-16">
        <h2 className="font-serif text-4xl md:text-5xl text-center mb-4">Our Products</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Handcrafted furniture made from premium materials, designed for comfort and elegance.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { img: afraChair, name: "Afra Chair" },
            { img: yolaChair, name: "Yola Chair" },
            { img: landaChair, name: "Landa Chair" },
          ].map((product) => (
            <Link to="/products" key={product.name} className="group text-center">
              <div className="bg-secondary rounded-xl overflow-hidden aspect-square flex items-center justify-center p-8 group-hover:shadow-lg transition-shadow">
                <img src={product.img} alt={product.name} className="max-h-full object-contain group-hover:scale-105 transition-transform" loading="lazy" width={400} height={400} />
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

      {/* About Preview */}
      <section className="bg-secondary py-16">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl mb-6">Our Journey</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Loewes Wood was founded by Afra Yolanda & Syahrizal in Jepara, a country already renowned for its furniture products. We craft premium furniture for restaurants, hotels, coffee shops, and homes worldwide.
              </p>
              <Link to="/about" className="inline-block border-2 border-foreground px-6 py-2 text-sm tracking-wider uppercase hover:bg-foreground hover:text-background transition-colors mt-4">
                Learn More
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img src={hotelBali} alt="Loewes Furniture Project" className="w-full h-80 object-cover" loading="lazy" width={800} height={600} />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-container py-16 text-center">
        <h2 className="font-serif text-4xl md:text-5xl mb-12">Why Loewes Furniture?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Customizable", desc: "Every design is fully customizable to reflect your style and personality." },
            { title: "Premium Quality", desc: "Made from premium materials, crafted with precision for lasting value." },
            { title: "Guarantee 1 Year", desc: "We provide guarantee and after-sales service for your peace of mind." },
          ].map((item) => (
            <div key={item.title} className="p-6">
              <h3 className="font-serif text-xl mb-3">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
