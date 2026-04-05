import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2, Loader2, Upload, X } from "lucide-react";
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl">Articles</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditing(null);
            setForm(buildEmptyForm(defaultCategoryName));
          }}
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Add Article
        </button>
      </div>

      {showForm && (
        <div className="bg-background border border-border rounded-xl p-6 mb-6">
          <h3 className="font-sans font-semibold mb-4">{editing ? "Edit Article" : "Add Article"}</h3>
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
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => void handleSave()}
              disabled={saving}
              className="px-4 py-2 bg-foreground text-background text-sm rounded-lg disabled:opacity-60 inline-flex items-center gap-2"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              Save
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
              className="px-4 py-2 border border-border text-sm rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-background border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-sans font-semibold uppercase text-muted-foreground">Title</th>
              <th className="text-left px-6 py-3 text-xs font-sans font-semibold uppercase text-muted-foreground">Category</th>
              <th className="text-left px-6 py-3 text-xs font-sans font-semibold uppercase text-muted-foreground">Slug</th>
              <th className="text-left px-6 py-3 text-xs font-sans font-semibold uppercase text-muted-foreground">Author</th>
              <th className="text-left px-6 py-3 text-xs font-sans font-semibold uppercase text-muted-foreground">Date</th>
              <th className="text-right px-6 py-3 text-xs font-sans font-semibold uppercase text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(loading ? [] : articles).map((article) => (
              <tr key={article.id} className="border-t border-border">
                <td className="px-6 py-4 text-sm font-medium max-w-[250px] truncate">{article.title}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{article.category}</td>
                <td className="px-6 py-4 text-xs text-muted-foreground">{article.slug}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{article.author}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {article.published_at ? new Date(article.published_at).toLocaleDateString() : "-"}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(article)} className="p-1 hover:bg-muted rounded mr-2">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(article.id)} className="p-1 hover:bg-muted rounded text-destructive">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {!loading && articles.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-muted-foreground">
                  No articles yet.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-muted-foreground">
                  Loading articles...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminArticles;
