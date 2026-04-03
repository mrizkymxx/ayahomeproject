import Layout from "@/components/Layout";
import { Link, useSearchParams } from "react-router-dom";
import productsHero from "@/assets/products-hero.jpg";
import afraChair from "@/assets/products/afra-chair.jpg";
import yolaChair from "@/assets/products/yola-chair.jpg";
import landaChair from "@/assets/products/landa-chair.jpg";
import briliyChair from "@/assets/products/briliy-chair.jpg";
import yantamChair from "@/assets/products/yantam-chair.jpg";
import gunawChair from "@/assets/products/gunaw-chair.jpg";

const categories = ["Bed", "Sofas", "Table", "Chair", "Dining Set", "Coffee Table"];

const products = [
  { id: "afra-chair", name: "Afra Chair", category: "Chair", image: afraChair },
  { id: "yola-chair", name: "Yola Chair", category: "Chair", image: yolaChair },
  { id: "landa-chair", name: "Landa Chair", category: "Chair", image: landaChair },
  { id: "briliy-chair", name: "Briliy Chair", category: "Chair", image: briliyChair },
  { id: "yantam-chair", name: "Yantam Chair", category: "Chair", image: yantamChair },
  { id: "gunaw-chair", name: "Gunaw Chair", category: "Chair", image: gunawChair },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "Chair";

  const filteredProducts = products.filter((p) => p.category === activeCategory);

  return (
    <Layout>
      {/* Hero */}
      <section className="section-container py-6">
        <div className="hero-banner h-[300px]">
          <img src={productsHero} alt="Products" className="w-full h-full object-cover rounded-2xl" width={1200} height={600} />
          <div className="hero-overlay rounded-2xl">
            <h1 className="font-serif text-5xl md:text-6xl text-primary-foreground font-bold">Products</h1>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
          {/* Categories Sidebar */}
          <div>
            <h3 className="font-sans font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setSearchParams({ category: cat })}
                    className={`text-sm font-sans transition-colors ${
                      activeCategory === cat
                        ? "font-bold underline underline-offset-4"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
            <Link to="/products" className="text-destructive text-sm font-bold italic mt-4 block">
              Click here for<br />more products
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 gap-8">
            {filteredProducts.map((product) => (
              <Link
                to={`/products/${product.id}`}
                key={product.id}
                className="group text-center"
              >
                <div className="aspect-square flex items-center justify-center p-4 group-hover:shadow-md transition-shadow rounded-xl">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full object-contain group-hover:scale-105 transition-transform"
                    loading="lazy"
                    width={400}
                    height={400}
                  />
                </div>
                <p className="mt-3 font-serif text-base italic">{product.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Products;
