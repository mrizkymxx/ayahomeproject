import Layout from "@/components/Layout";
import { Link, useParams } from "react-router-dom";
import afraChair from "@/assets/products/afra-chair.jpg";
import yolaChair from "@/assets/products/yola-chair.jpg";
import landaChair from "@/assets/products/landa-chair.jpg";
import briliyChair from "@/assets/products/briliy-chair.jpg";
import yantamChair from "@/assets/products/yantam-chair.jpg";
import gunawChair from "@/assets/products/gunaw-chair.jpg";

const allProducts: Record<string, {
  name: string;
  image: string;
  description: string;
  specs: string[];
  tags: string[];
  relatedIds: string[];
}> = {
  "afra-chair": {
    name: "Afra Chair",
    image: afraChair,
    description: "Kursi ini menghadirkan desain yang unik dan playful melalui sandaran berbentuk menyerupai telinga kelinci, memberikan karakter tersendiri pada ruang interior Anda. Terbuat dari kayu solid berkualitas dengan finishing natural, kursi ini menampilkan keindahan serat kayu yang alami dan tahan lama.\n\nDudukan berbentuk bundar dibuat dengan permukaan halus dan proporsi ergonomis untuk kenyamanan saat digunakan. Empat kaki kokoh yang diperkuat dengan penopang melingkar di bagian bawah memastikan stabilitas dan kekuatan struktur kursi.\n\nCocok untuk melengkapi ruang makan, kamar anak, maupun area dekoratif dengan tema natural atau Skandinavia. Kursi ini tidak hanya fungsional, tetapi juga mampu menambah nilai estetika pada ruangan Anda.",
    specs: ["Tinggi total: ±75 cm", "Tinggi dudukan: ±45 cm", "Diameter dudukan: ±35 cm", "Material: Kayu solid (finishing natural)"],
    tags: ["CUSTOMIZABLE", "GUARANTEE 1 YEAR"],
    relatedIds: ["yola-chair", "landa-chair", "briliy-chair", "yantam-chair"],
  },
  "yola-chair": {
    name: "Yola Chair",
    image: yolaChair,
    description: "Kursi rattan dengan desain elegan yang menggabungkan bahan kayu solid dan anyaman rotan berkualitas tinggi.",
    specs: ["Tinggi total: ±85 cm", "Material: Kayu solid & rotan"],
    tags: ["CUSTOMIZABLE", "GUARANTEE 1 YEAR"],
    relatedIds: ["afra-chair", "landa-chair", "briliy-chair", "yantam-chair"],
  },
  "landa-chair": {
    name: "Landa Chair",
    image: landaChair,
    description: "Kursi modern dengan sandaran melengkung yang ergonomis, terbuat dari kayu solid premium.",
    specs: ["Tinggi total: ±80 cm", "Material: Kayu solid teak"],
    tags: ["CUSTOMIZABLE", "GUARANTEE 1 YEAR"],
    relatedIds: ["afra-chair", "yola-chair", "briliy-chair", "gunaw-chair"],
  },
  "briliy-chair": {
    name: "Briliy Chair",
    image: briliyChair,
    description: "Kursi industrial minimalis dengan frame metal dan bantalan duduk yang nyaman.",
    specs: ["Tinggi total: ±82 cm", "Material: Metal frame & cushion"],
    tags: ["CUSTOMIZABLE", "GUARANTEE 1 YEAR"],
    relatedIds: ["afra-chair", "yola-chair", "landa-chair", "yantam-chair"],
  },
  "yantam-chair": {
    name: "Yantam Chair",
    image: yantamChair,
    description: "Kursi santai mid-century modern dengan bantal empuk dan rangka kayu solid.",
    specs: ["Tinggi total: ±78 cm", "Material: Kayu solid & upholstery"],
    tags: ["CUSTOMIZABLE", "GUARANTEE 1 YEAR"],
    relatedIds: ["afra-chair", "yola-chair", "briliy-chair", "gunaw-chair"],
  },
  "gunaw-chair": {
    name: "Gunaw Chair",
    image: gunawChair,
    description: "Kursi dining modern dengan upholstery premium dan kaki kayu dark walnut.",
    specs: ["Tinggi total: ±84 cm", "Material: Dark walnut & fabric"],
    tags: ["CUSTOMIZABLE", "GUARANTEE 1 YEAR"],
    relatedIds: ["afra-chair", "landa-chair", "briliy-chair", "yantam-chair"],
  },
};

const imageMap: Record<string, string> = {
  "afra-chair": afraChair,
  "yola-chair": yolaChair,
  "landa-chair": landaChair,
  "briliy-chair": briliyChair,
  "yantam-chair": yantamChair,
  "gunaw-chair": gunawChair,
};

const ProductDetail = () => {
  const { id } = useParams();
  const product = id ? allProducts[id] : null;

  if (!product) {
    return (
      <Layout>
        <div className="section-container py-20 text-center">
          <h1 className="font-serif text-3xl">Product not found</h1>
          <Link to="/products" className="mt-4 inline-block text-muted-foreground underline">Back to Products</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
          {/* Categories */}
          <div>
            <h3 className="font-sans font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              {["Bed", "Sofas", "Table", "Chair", "Dining Set", "Coffee Table"].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/products?category=${cat}`}
                    className={cat === "Chair" ? "font-bold underline underline-offset-4" : "text-muted-foreground hover:text-foreground"}
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/products" className="text-destructive text-sm font-bold italic mt-4 block">
              Click here for<br />more products
            </Link>
          </div>

          {/* Product Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Images */}
            <div>
              <img src={product.image} alt={product.name} className="w-full rounded-xl" width={600} height={600} />
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="font-serif text-3xl font-bold">{product.name}</h1>
                {product.tags.map((tag) => (
                  <span key={tag} className="text-xs font-sans font-bold border border-foreground px-3 py-1 uppercase">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line mb-6">
                {product.description}
              </div>

              <div className="mb-6">
                <p className="font-sans font-semibold text-sm mb-2">Spesifikasi Produk:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {product.specs.map((spec) => (
                    <li key={spec}>• {spec}</li>
                  ))}
                </ul>
              </div>

              <a
                href="https://wa.me/6289534721020"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 text-primary-foreground px-6 py-3 rounded-full font-sans font-bold text-sm hover:bg-green-600 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WHATSAPP
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="section-container py-12">
        <h2 className="font-sans font-bold text-xl mb-6">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {product.relatedIds.map((relId) => {
            const rel = allProducts[relId];
            if (!rel) return null;
            return (
              <Link to={`/products/${relId}`} key={relId} className="group text-center">
                <div className="aspect-square flex items-center justify-center p-4">
                  <img src={imageMap[relId]} alt={rel.name} className="max-h-full object-contain group-hover:scale-105 transition-transform" loading="lazy" width={200} height={200} />
                </div>
                <p className="font-serif italic text-sm mt-2">{rel.name}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
