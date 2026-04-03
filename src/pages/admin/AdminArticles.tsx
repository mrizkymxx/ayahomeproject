import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Article {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
}

const initialArticles: Article[] = [
  { id: "1", title: "Secrets You Should Know For Those of You Who Have a Small Room", author: "Loewes Furniture", date: "6 August 2025", excerpt: "Tips for small room furniture..." },
  { id: "2", title: "Wall Paint vs Furniture Finish Should They Match", author: "Loewes Furniture", date: "7 August 2025", excerpt: "Color coordination tips..." },
  { id: "3", title: "Moldy Furniture? Find Out The Causes and How to Fix It!", author: "Loewes Furniture", date: "8 August 2025", excerpt: "Furniture maintenance guide..." },
];

const AdminArticles = () => {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [editing, setEditing] = useState<Article | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", author: "Loewes Furniture", date: "", excerpt: "" });

  const handleSave = () => {
    if (editing) {
      setArticles(articles.map((a) => (a.id === editing.id ? { ...a, ...form } : a)));
    } else {
      setArticles([...articles, { id: Date.now().toString(), ...form }]);
    }
    setForm({ title: "", author: "Loewes Furniture", date: "", excerpt: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (article: Article) => {
    setEditing(article);
    setForm({ title: article.title, author: article.author, date: article.date, excerpt: article.excerpt });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl">Articles</h2>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm({ title: "", author: "Loewes Furniture", date: "", excerpt: "" }); }}
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Add Article
        </button>
      </div>

      {showForm && (
        <div className="bg-background border border-border rounded-xl p-6 mb-6">
          <h3 className="font-sans font-semibold mb-4">{editing ? "Edit Article" : "Add Article"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <input placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <textarea placeholder="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring md:col-span-2" rows={3} />
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
              <th className="text-left px-6 py-3 text-xs font-sans font-semibold uppercase text-muted-foreground">Title</th>
              <th className="text-left px-6 py-3 text-xs font-sans font-semibold uppercase text-muted-foreground">Author</th>
              <th className="text-left px-6 py-3 text-xs font-sans font-semibold uppercase text-muted-foreground">Date</th>
              <th className="text-right px-6 py-3 text-xs font-sans font-semibold uppercase text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-t border-border">
                <td className="px-6 py-4 text-sm font-medium max-w-[250px] truncate">{article.title}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{article.author}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{article.date}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(article)} className="p-1 hover:bg-muted rounded mr-2"><Edit size={16} /></button>
                  <button onClick={() => setArticles(articles.filter((a) => a.id !== article.id))} className="p-1 hover:bg-muted rounded text-destructive"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminArticles;
