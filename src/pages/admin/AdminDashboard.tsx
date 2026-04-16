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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats Grid - Responsive Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.path}
            className={`
              group bg-background border border-border rounded-xl p-5 md:p-6
              hover:shadow-lg hover:border-foreground/30 transition-all duration-300
              cursor-pointer transform hover:scale-105 hover:-translate-y-1
            `}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-muted group-hover:bg-foreground/5 transition-colors">
                <stat.icon size={28} className="text-foreground/70 group-hover:text-foreground transition-colors" />
              </div>
              <TrendingUp size={18} className="text-green-500 group-hover:text-green-600" />
            </div>
            
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                {stat.label}
              </p>
              <p className="font-serif text-3xl md:text-4xl font-bold">
                {stat.value !== null ? stat.value.toLocaleString() : "-"}
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground group-hover:text-foreground/70 transition-colors">
                View {stat.label.toLowerCase()} →
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions Section */}
      <div className="mt-8 pt-8 border-t border-border">
        <h2 className="font-serif text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link 
            to="/admin/products" 
            className={`
              px-6 py-3 rounded-lg font-medium text-sm text-background bg-foreground
              hover:bg-foreground/90 transition-all duration-200
              flex items-center justify-center gap-2 group
              transform hover:scale-105
            `}
          >
            <Package size={18} className="group-hover:scale-110 transition-transform" />
            Manage Products
          </Link>
          <Link 
            to="/admin/articles" 
            className={`
              px-6 py-3 rounded-lg font-medium text-sm text-foreground bg-muted
              hover:bg-muted/80 border border-border hover:border-foreground/30 transition-all duration-200
              flex items-center justify-center gap-2 group
              transform hover:scale-105
            `}
          >
            <FileText size={18} className="group-hover:scale-110 transition-transform" />
            Manage Articles
          </Link>
          <Link 
            to="/admin/messages" 
            className={`
              px-6 py-3 rounded-lg font-medium text-sm text-foreground border border-border
              hover:bg-muted hover:border-foreground/30 transition-all duration-200
              flex items-center justify-center gap-2 group
              transform hover:scale-105
            `}
          >
            <Mail size={18} className="group-hover:scale-110 transition-transform" />
            View Messages
          </Link>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8">
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-2">💡 Tip</h3>
          <p className="text-sm text-muted-foreground">
            Organize your products by categories to make them easier to manage and for customers to browse.
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-2">📝 Reminder</h3>
          <p className="text-sm text-muted-foreground">
            Keep your blog articles fresh and updated. Regular content helps with SEO and customer engagement.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
