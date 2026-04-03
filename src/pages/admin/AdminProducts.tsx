import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
}

const initialProducts: Product[] = [
  { id: "1", name: "Afra Chair", category: "Chair", description: "Kursi dengan desain telinga kelinci" },
  { id: "2", name: "Yola Chair", category: "Chair", description: "Kursi rattan elegan" },
  { id: "3", name: "Landa Chair", category: "Chair", description: "Kursi modern melengkung" },
  { id: "4", name: "Briliy Chair", category: "Chair", description: "Kursi industrial minimalis" },
  { id: "5", name: "Yantam Chair", category: "Chair", description: "Kursi santai mid-century" },
  { id: "6", name: "Gunaw Chair", category: "Chair", description: "Kursi dining modern" },
];

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Chair", description: "" });

  const handleSave = () => {
    if (editing) {
      setProducts(products.map((p) => (p.id === editing.id ? { ...p, ...form } : p)));
    } else {
      setProducts([...products, { id: Date.now().toString(), ...form }]);
    }
    setForm({ name: "", category: "Chair", description: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setForm({ name: product.name, category: product.category, description: product.description });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl">Products</h2>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm({ name: "", category: "Chair", description: "" }); }}
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-background border border-border rounded-xl p-6 mb-6">
          <h3 className="font-sans font-semibold mb-4">{editing ? "Edit Product" : "Add Product"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {["Bed", "Sofas", "Table", "Chair", "Dining Set", "Coffee Table"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring md:col-span-2"
              rows={3}
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} className="px-4 py-2 bg-foreground text-background text-sm rounded-lg">Save</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 border border-border text-sm rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-background border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-sans font-semibold uppercase text-muted-foreground">Name</th>
              <th className="text-left px-6 py-3 text-xs font-sans font-semibold uppercase text-muted-foreground">Category</th>
              <th className="text-left px-6 py-3 text-xs font-sans font-semibold uppercase text-muted-foreground">Description</th>
              <th className="text-right px-6 py-3 text-xs font-sans font-semibold uppercase text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-border">
                <td className="px-6 py-4 text-sm font-medium">{product.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{product.category}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground truncate max-w-[200px]">{product.description}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(product)} className="p-1 hover:bg-muted rounded mr-2"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(product.id)} className="p-1 hover:bg-muted rounded text-destructive"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
