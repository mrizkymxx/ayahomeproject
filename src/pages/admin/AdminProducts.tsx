import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2, Loader2, Upload, X, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/seo";
import { extractStoragePathFromPublicUrl, uploadMultipleImages } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  description: string | null;
  images: string[] | null;
  specifications: Record<string, string> | null;
  is_featured: boolean | null;
  is_best_seller: boolean | null;
  stock_status: string | null;
};

const defaultForm = {
  name: "",
  slug: "",
  category_id: "",
  description: "",
  image_urls: "",
  specs_text: "",
  is_featured: false,
  is_best_seller: false,
  stock_status: "available",
};

const PRODUCT_BUCKET = "products";

const imageCompression = {
  enabled: true,
  maxWidth: 2200,
  maxHeight: 2200,
  quality: 0.9,
  outputFormat: "image/webp" as const,
  minSavingsRatio: 0.06,
};

const parseSpecs = (text: string): Record<string, string> => {
  const entries = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [k, ...rest] = line.split(":");
      return [k?.trim(), rest.join(":").trim()] as const;
    })
    .filter(([k, v]) => k && v);

  return Object.fromEntries(entries);
};

const AdminProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [categoryInput, setCategoryInput] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const categoryNameById = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const currentImageList = useMemo(
    () =>
      form.image_urls
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    [form.image_urls],
  );

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [{ data: catRows }, { data: prodRows }] = await Promise.all([
        supabase.from("categories").select("id,name,slug").order("name"),
        supabase.from("products").select("*").order("created_at", { ascending: false }),
      ]);

      setCategories((catRows || []) as Category[]);
      setProducts((prodRows || []) as ProductRow[]);
      setLoading(false);
    }

    fetchData();
  }, []);

  const handleNew = () => {
    setEditing(null);
    setForm({
      ...defaultForm,
      category_id: categories[0]?.id || "",
    });
    setShowForm(true);
  };

  const handleEdit = (product: ProductRow) => {
    setEditing(product);
    setForm({
      name: product.name,
      slug: product.slug,
      category_id: product.category_id || "",
      description: product.description || "",
      image_urls: (product.images || []).join("\n"),
      specs_text: Object.entries(product.specifications || {})
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n"),
      is_featured: Boolean(product.is_featured),
      is_best_seller: Boolean(product.is_best_seller),
      stock_status: product.stock_status || "available",
    });
    setShowForm(true);
  };

  const addCategory = async () => {
    const name = categoryInput.trim();
    if (!name) return;

    const slug = slugify(name);
    if (!slug) {
      toast({
        variant: "destructive",
        title: "Invalid category",
        description: "Please enter a valid category name.",
      });
      return;
    }

    setCreatingCategory(true);
    const { data, error } = await supabase
      .from("categories")
      .insert({ name, slug })
      .select("id,name,slug")
      .single();
    setCreatingCategory(false);

    if (error || !data) {
      toast({
        variant: "destructive",
        title: "Category failed",
        description: error?.message || "Could not create category.",
      });
      return;
    }

    setCategories((prev) => {
      const next = [...prev, data as Category];
      next.sort((a, b) => a.name.localeCompare(b.name));
      return next;
    });
    setForm((prev) => ({ ...prev, category_id: data.id }));
    setCategoryInput("");
    toast({
      title: "Category created",
      description: `${data.name} is now available.`,
    });
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setUploadingImages(true);
    const folder = slugify(form.slug || form.name) || "uncategorized-product";
    const results = await uploadMultipleImages(PRODUCT_BUCKET, files, {
      folder: `products/${folder}`,
      compression: imageCompression,
    });
    setUploadingImages(false);

    const successUrls = results.filter((r) => r.success && r.url).map((r) => r.url as string);
    const failed = results.filter((r) => !r.success);

    if (successUrls.length > 0) {
      setForm((prev) => {
        const existing = prev.image_urls
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        return {
          ...prev,
          image_urls: [...existing, ...successUrls].join("\n"),
        };
      });
      toast({
        title: "Images uploaded",
        description: `${successUrls.length} image(s) uploaded with optimization.`,
      });
    }

    if (failed.length > 0) {
      toast({
        variant: "destructive",
        title: "Some uploads failed",
        description: failed.map((item) => item.error || "Unknown error").join(" | "),
      });
    }

    event.target.value = "";
  };

  const removeImageFromForm = async (url: string) => {
    setForm((prev) => ({
      ...prev,
      image_urls: prev.image_urls
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && line !== url)
        .join("\n"),
    }));

    const path = extractStoragePathFromPublicUrl(url, PRODUCT_BUCKET);
    if (!path) return;

    await supabase.storage.from(PRODUCT_BUCKET).remove([path]);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({
        variant: "destructive",
        title: "Name required",
        description: "Please fill product name.",
      });
      return;
    }

    if (!form.category_id) {
      toast({
        variant: "destructive",
        title: "Category required",
        description: "Please choose or create a category first.",
      });
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      slug: slugify(form.slug || form.name),
      category_id: form.category_id || null,
      description: form.description.trim(),
      images: form.image_urls
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      specifications: parseSpecs(form.specs_text),
      is_featured: form.is_featured,
      is_best_seller: form.is_best_seller,
      stock_status: form.stock_status || "available",
    };

    if (editing) {
      const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
      if (error) {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: error.message,
        });
      } else {
        setProducts((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...payload } : p)));
        toast({ title: "Product updated", description: "Changes have been saved." });
      }
    } else {
      const { data, error } = await supabase.from("products").insert(payload).select("*").single();
      if (error || !data) {
        toast({
          variant: "destructive",
          title: "Create failed",
          description: error?.message || "Could not create product.",
        });
      } else {
        setProducts((prev) => [data as ProductRow, ...prev]);
        toast({ title: "Product created", description: "Product has been added." });
      }
    }

    setSaving(false);
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.message,
      });
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Product deleted", description: "Product has been removed." });
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    const attachedCount = products.filter((product) => product.category_id === category.id).length;
    
    if (attachedCount > 0) {
      // Show option to force delete or cancel
      const shouldForceDelete = window.confirm(
        `"${category.name}" is used by ${attachedCount} product(s).\n\n` +
        `Choose OK to delete category and remove category assignment from products.\n` +
        `Choose Cancel to keep the category.`
      );
      
      if (!shouldForceDelete) return;
      
      // Update all products with this category to have NULL category_id
      const productsToUpdate = products.filter((p) => p.category_id === category.id);
      const { error: updateError } = await supabase
        .from("products")
        .update({ category_id: null })
        .in("id", productsToUpdate.map((p) => p.id));
      
      if (updateError) {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: `Could not update products: ${updateError.message}`,
        });
        return;
      }
      
      // Update products state
      setProducts((prev) =>
        prev.map((p) =>
          p.category_id === category.id ? { ...p, category_id: null } : p
        )
      );
    }

    // Delete the category
    const { error } = await supabase.from("categories").delete().eq("id", category.id);
    if (error) {
      toast({
        variant: "destructive",
        title: "Delete category failed",
        description: error.message,
      });
      return;
    }

    setCategories((prev) => prev.filter((item) => item.id !== category.id));
    if (form.category_id === category.id) {
      setForm((prev) => ({ ...prev, category_id: "" }));
    }
    toast({
      title: "Category deleted",
      description: `"${category.name}" has been removed${attachedCount > 0 ? ` and ${attachedCount} product(s) updated` : ""}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your {products.length} product(s)</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center justify-center md:justify-start gap-2 px-6 py-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-all font-medium self-start md:self-auto"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-background border border-border rounded-xl p-6 md:p-8 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold">{editing ? "Edit Product" : "Add New Product"}</h2>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Close form"
            >
              <X size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
              className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              placeholder="Slug"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
              className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <input
                placeholder="Create new category"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                disabled={creatingCategory || !categoryInput.trim()}
                onClick={addCategory}
                className="px-3 py-2 border border-border rounded-md text-sm disabled:opacity-60"
              >
                {creatingCategory ? "Adding..." : "Add"}
              </button>
            </div>
            <select
              value={form.stock_status}
              onChange={(e) => setForm({ ...form, stock_status: e.target.value })}
              className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="available">available</option>
              <option value="out_of_stock">out_of_stock</option>
              <option value="preorder">preorder</option>
            </select>
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring md:col-span-2"
              rows={4}
            />
            <textarea
              placeholder="Image URLs (one per line)"
              value={form.image_urls}
              onChange={(e) => setForm({ ...form, image_urls: e.target.value })}
              className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring md:col-span-2"
              rows={4}
            />
            <div className="md:col-span-2 border border-dashed border-border rounded-lg p-4">
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded-md text-sm cursor-pointer hover:bg-muted">
                  {uploadingImages ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  {uploadingImages ? "Uploading..." : "Upload product images"}
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                </label>
                <span className="text-xs text-muted-foreground">
                  Auto-compress enabled (WebP, high quality) to keep storage efficient.
                </span>
              </div>
              {currentImageList.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  {currentImageList.map((url, index) => (
                    <div key={`${url}-${index}`} className="relative border border-border rounded-md overflow-hidden">
                      <img src={url} alt={`Product ${index + 1}`} className="w-full h-28 object-cover" />
                      <button
                        type="button"
                        onClick={() => void removeImageFromForm(url)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-background/90 border border-border"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <textarea
              placeholder={"Specifications (one per line)\nMaterial: Teak Wood\nDimensions: 45cm x 50cm x 85cm"}
              value={form.specs_text}
              onChange={(e) => setForm({ ...form, specs_text: e.target.value })}
              className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              rows={4}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_best_seller}
                onChange={(e) => setForm({ ...form, is_best_seller: e.target.checked })}
              />
              Best Seller
            </label>
          </div>
          <div className="flex gap-3 mt-6 pt-6 border-t border-border/30">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-all disabled:opacity-50"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saving ? "Saving..." : "Save Product"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
              className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products List */}
      {loading ? (
        <div className="bg-background border border-border rounded-xl p-8 md:p-12 text-center">
          <Loader2 size={40} className="mx-auto text-muted-foreground mb-4 animate-spin" />
          <p className="text-muted-foreground font-medium">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-background border border-border rounded-xl p-8 md:p-12 text-center">
          <Package size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
          <p className="text-foreground font-semibold mb-1">No products yet</p>
          <p className="text-sm text-muted-foreground">Click "Add Product" to create your first product</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-background border border-border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Flags</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => (
                  <tr key={product.id} className={`border-t border-border hover:bg-muted/50 transition-colors ${idx % 2 === 0 ? "bg-background/50" : ""}`}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{product.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{product.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {categoryNameById.get(product.category_id || "") || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2 flex-wrap">
                        {product.is_featured && (
                          <span className="inline-block px-2 py-1 rounded-full text-xs bg-purple-100/80 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 font-medium">
                            ⭐ Featured
                          </span>
                        )}
                        {product.is_best_seller && (
                          <span className="inline-block px-2 py-1 rounded-full text-xs bg-orange-100/80 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300 font-medium">
                            🔥 Best Seller
                          </span>
                        )}
                        {!product.is_featured && !product.is_best_seller && (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
                          title="Edit product"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                          title="Delete product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {products.map((product) => (
              <div key={product.id} className="bg-background border border-border rounded-xl p-4 space-y-3 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{product.slug}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm border-t border-border/30 pt-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Category</p>
                    <p className="text-foreground">
                      {categoryNameById.get(product.category_id || "") || "-"}
                    </p>
                  </div>

                  {(product.is_featured || product.is_best_seller) && (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Flags</p>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {product.is_featured && (
                          <span className="inline-block px-2 py-1 rounded-full text-xs bg-purple-100/80 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 font-medium">
                            ⭐ Featured
                          </span>
                        )}
                        {product.is_best_seller && (
                          <span className="inline-block px-2 py-1 rounded-full text-xs bg-orange-100/80 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300 font-medium">
                            🔥 Best Seller
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminProducts;
