import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, FileText, Mail, LogOut, Menu, X } from "lucide-react";
import { logoutAdmin } from "@/lib/admin-auth";
import { useToast } from "@/hooks/use-toast";

const adminNav = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Products", path: "/admin/products", icon: Package },
  { label: "Articles", path: "/admin/articles", icon: FileText },
  { label: "Messages", path: "/admin/messages", icon: Mail },
];

const ADMIN_IDLE_TIMEOUT_MS = 30 * 60 * 1000;

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const isLoggingOutRef = useRef(false);
  const idleTimerRef = useRef<number | null>(null);

  const handleLogout = useCallback(
    async (reason: "manual" | "idle") => {
      if (isLoggingOutRef.current) return;

      isLoggingOutRef.current = true;
      setLoggingOut(true);

      const result = await logoutAdmin();
      if (!result.success) {
        isLoggingOutRef.current = false;
        setLoggingOut(false);
        toast({
          variant: "destructive",
          title: "Logout failed",
          description: result.message || "Unable to end admin session.",
        });
        return;
      }

      const params = new URLSearchParams();
      if (reason === "idle") {
        params.set("reason", "idle");
      }

      const query = params.toString();
      navigate(`/admin/login${query ? `?${query}` : ""}`, { replace: true });
    },
    [navigate, toast]
  );

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current !== null) {
      window.clearTimeout(idleTimerRef.current);
    }

    idleTimerRef.current = window.setTimeout(() => {
      void handleLogout("idle");
    }, ADMIN_IDLE_TIMEOUT_MS);
  }, [handleLogout]);

  useEffect(() => {
    const activityEvents: Array<keyof WindowEventMap> = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
    ];

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, resetIdleTimer);
    });
    resetIdleTimer();

    return () => {
      if (idleTimerRef.current !== null) {
        window.clearTimeout(idleTimerRef.current);
      }

      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, resetIdleTimer);
      });
    };
  }, [resetIdleTimer]);

  return (
    <div className="min-h-screen flex bg-muted">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-0 overflow-hidden"} bg-foreground text-primary-foreground transition-all duration-300 flex flex-col`}>
        <div className="p-6">
          <h2 className="font-serif text-xl font-bold">Aya Home Project Admin</h2>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-sans transition-colors ${
                location.pathname === item.path
                  ? "bg-primary-foreground/20"
                  : "hover:bg-primary-foreground/10"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4">
          <button
            type="button"
            onClick={() => {
              void handleLogout("manual");
            }}
            disabled={loggingOut}
            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-primary-foreground/10 rounded-lg transition-colors mb-2"
          >
            <LogOut size={18} />
            {loggingOut ? "Logging out..." : "Logout Admin"}
          </button>
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-primary-foreground/10 rounded-lg transition-colors">
            <LogOut size={18} />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-background border-b border-border px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="font-sans font-semibold">Admin Dashboard</h1>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
