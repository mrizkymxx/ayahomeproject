import { useEffect, useMemo, useState } from "react";
import { Package, FileText, Mail, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type DashboardCounts = {
  products: number | null;
  articles: number | null;
  messages: number | null;
};

const AdminDashboard = () => {
  const [counts, setCounts] = useState<DashboardCounts>({
    products: null,
    articles: null,
    messages: null,
  });

  useEffect(() => {
    let active = true;

    async function fetchCounts() {
      const [productsResult, articlesResult, messagesResult] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("articles").select("id", { count: "exact", head: true }),
        supabase.from("inquiries").select("id", { count: "exact", head: true }),
      ]);

      if (!active) return;

      if (productsResult.error || articlesResult.error || messagesResult.error) {
        console.error("Error fetching admin dashboard stats:", {
          products: productsResult.error,
          articles: articlesResult.error,
          messages: messagesResult.error,
        });
      }

      setCounts({
        products: productsResult.error ? null : (productsResult.count ?? 0),
        articles: articlesResult.error ? null : (articlesResult.count ?? 0),
        messages: messagesResult.error ? null : (messagesResult.count ?? 0),
      });
    }

    fetchCounts();

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      { label: "Products", value: counts.products, icon: Package, path: "/admin/products" },
      { label: "Articles", value: counts.articles, icon: FileText, path: "/admin/articles" },
      { label: "Messages", value: counts.messages, icon: Mail, path: "/admin/messages" },
    ],
    [counts.articles, counts.messages, counts.products],
  );

  return (
    <div>
      <h2 className="font-serif text-2xl mb-6">Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.path}
            className="bg-background border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
          >
              <div className="flex items-center justify-between mb-4">
                <stat.icon size={24} className="text-muted-foreground" />
                <TrendingUp size={16} className="text-green-500" />
              </div>
              <p className="font-serif text-3xl font-bold">{stat.value ?? "-"}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Link>
          ))}
      </div>

      <div className="bg-background border border-border rounded-xl p-6">
        <h3 className="font-sans font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/products" className="px-4 py-2 bg-foreground text-background text-sm rounded-lg hover:opacity-90 transition-opacity">
            Manage Products
          </Link>
          <Link to="/admin/articles" className="px-4 py-2 bg-foreground text-background text-sm rounded-lg hover:opacity-90 transition-opacity">
            Manage Articles
          </Link>
          <Link to="/admin/messages" className="px-4 py-2 border border-border text-sm rounded-lg hover:bg-muted transition-colors">
            View Messages
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
