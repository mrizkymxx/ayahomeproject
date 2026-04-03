import Layout from "@/components/Layout";
import smallRoom from "@/assets/articles/small-room.jpg";
import wallPaint from "@/assets/articles/wall-paint.jpg";
import moldyFurniture from "@/assets/articles/moldy-furniture.jpg";

const articles = [
  {
    id: 1,
    title: "Secrets You Should Know For Those of You Who Have a Small Room",
    author: "Loewes Furniture",
    date: "6 August 2025",
    excerpt: "Loewes Wood was founded by Afra Yolanda & Syahrizal in Jepara, a country already renowned for its furniture products. At the time, Loewes Wood focused on producing wooden furniture, with many orders coming in for chairs. Over time, following market demand, Loewes Wood gradually expanded into producing furniture from other materials, such as iron, stainless steel, and even HPL.",
    image: smallRoom,
  },
  {
    id: 2,
    title: "Wall Paint vs Furniture Finish Should They Match",
    author: "Loewes Furniture",
    date: "7 August 2025",
    excerpt: "Loewes Wood was founded by Afra Yolanda & Syahrizal in Jepara, a country already renowned for its furniture products. At the time, Loewes Wood focused on producing wooden furniture, with many orders coming in for chairs. Over time, following market demand, Loewes Wood gradually expanded into producing furniture from other materials, such as iron, stainless steel, and even HPL.",
    image: wallPaint,
  },
  {
    id: 3,
    title: "Moldy Furniture? Find Out The Causes and How to Fix It!",
    author: "Loewes Furniture",
    date: "8 August 2025",
    excerpt: "Loewes Wood was founded by Afra Yolanda & Syahrizal in Jepara, a country already renowned for its furniture products. At the time, Loewes Wood focused on producing wooden furniture, with many orders coming in for chairs. Over time, following market demand, Loewes Wood gradually expanded into producing furniture from other materials, such as iron, stainless steel, and even HPL.",
    image: moldyFurniture,
  },
];

const Articles = () => {
  return (
    <Layout>
      <section className="section-container py-16">
        <h1 className="font-serif text-5xl md:text-6xl text-center mb-16">Study With Loewes</h1>

        <div className="space-y-12 max-w-4xl mx-auto">
          {articles.map((article) => (
            <article key={article.id} className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 border-b border-border pb-12">
              <div className="overflow-hidden rounded-lg">
                <img src={article.image} alt={article.title} className="w-full h-56 object-cover" loading="lazy" width={300} height={224} />
              </div>
              <div>
                <h2 className="font-sans text-xl md:text-2xl font-bold mb-2">{article.title}</h2>
                <p className="text-sm text-muted-foreground italic mb-4">
                  by {article.author}. {article.date}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {article.excerpt}
                </p>
                <button className="font-sans text-sm font-bold underline underline-offset-4 hover:text-muted-foreground transition-colors">
                  Read More
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Articles;
