import Layout from "@/components/Layout";
import aboutHero from "@/assets/about-hero.jpg";
import hotelBali from "@/assets/projects/hotel-bali.jpg";

const timelineData = [
  {
    date: "March 2021",
    title: "Founded",
    description: "Loewes Wood was founded by Afra Yolanda & Syahrizal in Jepara, a country already renowned for its furniture products. At the time, Loewes Wood focused on producing wooden furniture, with many orders coming in for chairs. Over time, following market demand, Loewes Wood gradually expanded into producing furniture from other materials, such as iron, stainless steel, and even HPL.",
  },
  {
    date: "July 2022",
    title: "Expansion",
    description: "Loewes Wood collaborates with a furniture company to provide and supply a wide range of products. Loewes Wood's products include chairs, nightstands, drawers, and beds. The products are manufactured to high quality standards, as they are intended for export. These products are intended for the United States market, particularly the Florida region.",
  },
  {
    date: "November 2023",
    title: "Rebranding",
    description: "Over time, Loewes Wood has grown to meet the furniture needs of people in Indonesia and even around the world. Loewes Wood is considering changing its name, replacing \"Wood\" with \"Furniture.\" This is because Loewes' buyer demand extends beyond wood to other materials such as iron, stainless steel, and HPL.",
  },
  {
    date: "Today",
    title: "Present",
    description: "With Loewes Furniture's extensive experience, we have been trusted to produce furniture for numerous restaurants, coffee shops, and even hotels. In addition to large-scale projects, we also undertake small-scale furniture projects, ranging from small items like nightstands to large-scale home beds.",
  },
];

const AboutUs = () => {
  return (
    <Layout>
      {/* Hero Banner */}
      <section className="section-container py-6">
        <div className="hero-banner h-[300px]">
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
        <div className="max-w-4xl mx-auto space-y-16">
          {timelineData.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
              <div className="text-center md:text-left">
                <p className="font-serif text-xl font-bold">{item.date}</p>
              </div>
              <div>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="section-container py-16">
        <h2 className="font-serif text-5xl md:text-6xl text-center mb-12">Projects</h2>

        <div className="mb-12">
          <h3 className="font-serif text-xl text-center mb-6 italic">
            Our Products for Hotels & Cafés in Sumbawa, Indonesia
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <img src={hotelBali} alt="Hotel Project" className="w-full h-48 object-cover rounded-lg col-span-2 md:col-span-1 md:row-span-2 md:h-full" loading="lazy" width={400} height={300} />
            <img src={hotelBali} alt="Hotel Project" className="w-full h-48 object-cover rounded-lg" loading="lazy" width={400} height={300} />
            <img src={hotelBali} alt="Hotel Project" className="w-full h-48 object-cover rounded-lg" loading="lazy" width={400} height={300} />
          </div>
        </div>

        <div>
          <h3 className="font-serif text-xl text-center mb-6 italic">
            Our Products for Sushi Restaurants in Uluwatu & Seminyak, Bali
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <img src={hotelBali} alt="Restaurant Project" className="w-full h-48 object-cover rounded-lg" loading="lazy" width={400} height={300} />
            <img src={hotelBali} alt="Restaurant Project" className="w-full h-48 object-cover rounded-lg col-span-2 md:col-span-1 md:row-span-2 md:h-full" loading="lazy" width={400} height={300} />
            <img src={hotelBali} alt="Restaurant Project" className="w-full h-48 object-cover rounded-lg" loading="lazy" width={400} height={300} />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutUs;
