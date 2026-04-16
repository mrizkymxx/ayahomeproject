import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2, Loader2, Upload, X, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  appendInternalProductLinks,
  buildExcerpt,
  estimateReadTime,
  extractKeywords,
  slugify,
  toArticleHtml,
} from "@/lib/seo";
import { extractStoragePathFromPublicUrl, uploadImage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface Article {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  read_time: string;
  published_at: string;
  excerpt: string;
  content: string;
  image_url: string;
  keywords: string[];
}

type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  author: string | null;
  category: string | null;
  read_time: string | null;
  published_at: string | null;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
};

const ARTICLE_BUCKET = "articles";

const articleCompression = {
  enabled: true,
  maxWidth: 2200,
  maxHeight: 2200,
  quality: 0.9,
  outputFormat: "image/webp" as const,
  minSavingsRatio: 0.06,
};

const mapArticleRow = (a: ArticleRow): Article => ({
  id: a.id,
  title: a.title,
  slug: a.slug,
  author: a.author || "Aya Home Project",
  category: a.category || "Interior Tips",
  read_time: a.read_time || "1 min read",
  published_at: a.published_at || "",
  excerpt: a.excerpt || "",
  content: a.content || "",
  image_url: a.image_url || "",
  keywords: extractKeywords(a.title || "", a.category || "", a.content || "", 8),
});

const normalizeCategoryValue = (value: string, options: string[]): string => {
  const trimmed = value.trim();
  if (!trimmed) return "Interior Tips";
  const match = options.find((item) => item.toLowerCase() === trimmed.toLowerCase());
  return match || trimmed;
};

const buildEmptyForm = (defaultCategory: string) => ({
  title: "",
  slug: "",
  author: "Aya Home Project",
  category: defaultCategory,
  published_at: "",
  excerpt: "",
  content: "",
  image_url: "",
});

const AdminArticles = () => {
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [products, setProducts] = useState<Array<{ name: string; slug: string }>>([]);
  const [articleCategories, setArticleCategories] = useState<string[]>(["Interior Tips"]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [categoryInput, setCategoryInput] = useState("");
  const [editing, setEditing] = useState<Article | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(buildEmptyForm("Interior Tips"));

  const suggestedKeywords = useMemo(
    () => extractKeywords(form.title, form.category, form.content, 8),
    [form.title, form.category, form.content],
  );

  const defaultCategoryName = useMemo(() => articleCategories[0] || "Interior Tips", [articleCategories]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [{ data: articleRows }, { data: productRows }] = await Promise.all([
        supabase.from("articles").select("*").order("published_at", { ascending: false }),
        supabase.from("products").select("name,slug").order("name"),
      ]);

      const mappedArticles = ((articleRows || []) as ArticleRow[]).map(mapArticleRow);
      const categorySet = new Set<string>();
      mappedArticles.forEach((article) => {
        const categoryName = article.category.trim();
        if (categoryName) categorySet.add(categoryName);
      });
      if (categorySet.size === 0) categorySet.add("Interior Tips");

      const nextCategories = Array.from(categorySet).sort((a, b) => a.localeCompare(b));
      setArticles(mappedArticles);
      setProducts(productRows || []);
      setArticleCategories(nextCategories);
      setForm((prev) => ({
        ...prev,
        category: normalizeCategoryValue(prev.category, nextCategories),
      }));
      setLoading(false);
    }

    fetchData();
  }, []);

  const addCategory = () => {
    const normalized = normalizeCategoryValue(categoryInput, articleCategories);
    if (!normalized) return;

    const exists = articleCategories.some((item) => item.toLowerCase() === normalized.toLowerCase());
    if (exists) {
      setForm((prev) => ({ ...prev, category: normalized }));
      setCategoryInput("");
      toast({
        title: "Category selected",
        description: `${normalized} is already available.`,
      });
      return;
    }

    setArticleCategories((prev) => [...prev, normalized].sort((a, b) => a.localeCompare(b)));
    setForm((prev) => ({ ...prev, category: normalized }));
    setCategoryInput("");
    toast({
      title: "Category created",
      description: `${normalized} is ready to use.`,
    });
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const folder = slugify(form.slug || form.title) || "article-image";
    const result = await uploadImage(ARTICLE_BUCKET, file, {
      folder: `articles/${folder}`,
      compression: articleCompression,
    });
    setUploadingImage(false);

    if (!result.success || !result.url) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: result.error || "Could not upload image.",
      });
      event.target.value = "";
      return;
    }

    setForm((prev) => ({ ...prev, image_url: result.url || "" }));
    toast({
      title: "Image uploaded",
      description: "Article image uploaded with optimization.",
    });
    event.target.value = "";
  };

  const removeUploadedImage = async () => {
    const currentUrl = form.image_url.trim();
    setForm((prev) => ({ ...prev, image_url: "" }));
    if (!currentUrl) return;

    const path = extractStoragePathFromPublicUrl(currentUrl, ARTICLE_BUCKET);
    if (!path) return;
    await supabase.storage.from(ARTICLE_BUCKET).remove([path]);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast({
        variant: "destructive",
        title: "Title required",
        description: "Please fill article title.",
      });
      return;
    }

    setSaving(true);
    const resolvedSlug = slugify(form.slug || form.title);
    const resolvedCategory = normalizeCategoryValue(form.category, articleCategories);
    const htmlContent = appendInternalProductLinks(toArticleHtml(form.content), products);
    const resolvedExcerpt = buildExcerpt(form.excerpt || form.content, form.title, 165);
    const resolvedReadTime = estimateReadTime(form.content || form.excerpt || form.title);
    const publishedAtIso = form.published_at
      ? new Date(form.published_at).toISOString()
      : new Date().toISOString();

    const payload = {
      title: form.title.trim(),
      slug: resolvedSlug,
      author: form.author.trim() || "Aya Home Project",
      category: resolvedCategory,
      excerpt: resolvedExcerpt,
      content: htmlContent,
      read_time: resolvedReadTime,
      image_url: form.image_url.trim() || null,
      is_featured: false,
      published_at: publishedAtIso,
    };

    if (editing) {
      const { error } = await supabase.from("articles").update(payload).eq("id", editing.id);
      if (error) {
        setSaving(false);
        toast({
          variant: "destructive",
          title: "Update failed",
          description: error.message,
        });
        return;
      }

      setArticles((prev) =>
        prev.map((article) =>
          article.id === editing.id
            ? {
                ...article,
                ...payload,
                image_url: payload.image_url || "",
                keywords: extractKeywords(payload.title, payload.category, payload.content, 8),
              }
            : article,
        ),
      );
      toast({ title: "Article updated", description: "Changes have been saved." });
    } else {
      const { data, error } = await supabase.from("articles").insert(payload).select("*").single();
      if (error || !data) {
        setSaving(false);
        toast({
          variant: "destructive",
          title: "Create failed",
          description: error?.message || "Could not create article.",
        });
        return;
      }

      setArticles((prev) => [mapArticleRow(data as ArticleRow), ...prev]);
      toast({ title: "Article created", description: "Article has been added." });
    }

    setArticleCategories((prev) => {
      const exists = prev.some((item) => item.toLowerCase() === resolvedCategory.toLowerCase());
      if (exists) return prev;
      return [...prev, resolvedCategory].sort((a, b) => a.localeCompare(b));
    });

    setSaving(false);
    setForm(buildEmptyForm(resolvedCategory || defaultCategoryName));
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (article: Article) => {
    setEditing(article);
    setForm({
      title: article.title,
      slug: article.slug,
      author: article.author,
      category: article.category,
      published_at: article.published_at ? article.published_at.slice(0, 10) : "",
      excerpt: article.excerpt,
      content: article.content,
      image_url: article.image_url || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.message,
      });
      return;
    }
    setArticles((prev) => prev.filter((article) => article.id !== id));
    toast({ title: "Article deleted", description: "Article has been removed." });
  };

  const categoryOptions = articleCategories.length ? articleCategories : ["Interior Tips"];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Articles</h1>
          <p className="text-muted-foreground">Manage your blog content ({articles.length} article{articles.length !== 1 ? 's' : ''})</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditing(null);
            setForm(buildEmptyForm(defaultCategoryName));
          }}
          className="flex items-center justify-center md:justify-start gap-2 px-6 py-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-all font-medium self-start md:self-auto"
        >
          <Plus size={20} />
          Add Article
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-background border border-border rounded-xl p-6 md:p-8 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold">{editing ? "Edit Article" : "Add New Article"}</h2>
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
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })}
              className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              placeholder="Slug (auto)"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
              className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              placeholder="Author"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <div className="md:col-span-2 flex items-center gap-2">
              <input
                placeholder="Create new article category"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                disabled={!categoryInput.trim()}
                onClick={addCategory}
                className="px-3 py-2 border border-border rounded-md text-sm disabled:opacity-60"
              >
                Add
              </button>
            </div>
            <input
              type="date"
              value={form.published_at}
              onChange={(e) => setForm({ ...form, published_at: e.target.value })}
              className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              placeholder="Excerpt (optional)"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <textarea
              placeholder="Content (plain text/markdown-ish/HTML). Internal links + read time + excerpt + keywords will be auto-generated."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring md:col-span-2"
              rows={8}
            />
            <input
              placeholder="Hero image URL (optional)"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring md:col-span-2"
            />
            <div className="md:col-span-2 border border-dashed border-border rounded-lg p-4">
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded-md text-sm cursor-pointer hover:bg-muted">
                  {uploadingImage ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  {uploadingImage ? "Uploading..." : "Upload article image"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
                <span className="text-xs text-muted-foreground">
                  Auto-compress enabled (WebP, high quality) to save storage.
                </span>
              </div>
              {form.image_url && (
                <div className="mt-4 relative w-full md:w-72 border border-border rounded-md overflow-hidden">
                  <img src={form.image_url} alt="Article preview" className="w-full h-40 object-cover" />
                  <button
                    type="button"
                    onClick={() => void removeUploadedImage()}
                    className="absolute top-2 right-2 p-1 rounded-full bg-background/90 border border-border"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
            <div className="md:col-span-2 text-xs text-muted-foreground">
              <div>
                <strong>Auto SEO:</strong> slug, excerpt, read time, keyword suggestions, and internal links to products.
              </div>
              <div className="mt-1">
                <strong>Keyword suggestions:</strong> {suggestedKeywords.join(", ") || "-"}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6 pt-6 border-t border-border/30">
            <button
              onClick={() => void handleSave()}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-all disabled:opacity-50"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saving ? "Saving..." : "Save Article"}
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

      {/* Articles List */}
      {loading ? (
        <div className="bg-background border border-border rounded-xl p-8 md:p-12 text-center">
          <Loader2 size={40} className="mx-auto text-muted-foreground mb-4 animate-spin" />
          <p className="text-muted-foreground font-medium">Loading articles...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-background border border-border rounded-xl p-8 md:p-12 text-center">
          <FileText size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
          <p className="text-foreground font-semibold mb-1">No articles yet</p>
          <p className="text-sm text-muted-foreground">Click "Add Article" to publish your first post</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-background border border-border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Author</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article, idx) => (
                  <tr key={article.id} className={`border-t border-border hover:bg-muted/50 transition-colors ${idx % 2 === 0 ? "bg-background/50" : ""}`}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground truncate">{article.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{article.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{article.category}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{article.author}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                      {article.published_at ? new Date(article.published_at).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(article)} className="p-2 hover:bg-muted rounded-lg transition-colors" title="Edit article">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(article.id)} className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive" title="Delete article">
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
            {articles.map((article) => (
              <div key={article.id} className="bg-background border border-border rounded-xl p-4 space-y-3 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground line-clamp-2">{article.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{article.slug}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(article)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm border-t border-border/30 pt-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Category</p>
                      <p className="text-foreground">{article.category}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Author</p>
                      <p className="text-foreground text-sm">{article.author}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Published</p>
                    <p className="text-foreground text-sm">
                      {article.published_at ? new Date(article.published_at).toLocaleDateString() : "-"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminArticles;
