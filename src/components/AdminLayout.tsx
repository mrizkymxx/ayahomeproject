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
    <div className="min-h-screen flex bg-background flex-col md:flex-row">
      {/* Sidebar - Desktop + Mobile Responsive */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 z-40 w-64 md:w-72
        bg-gradient-to-b from-foreground to-foreground/95 text-primary-foreground
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:block
        shadow-lg md:shadow-none
      `}>
        {/* Sidebar Header */}
        <div className="p-6 md:p-8 border-b border-primary-foreground/20">
          <h2 className="font-serif text-xl md:text-2xl font-bold tracking-tight">Aya Admin</h2>
          <p className="text-xs text-primary-foreground/70 mt-1">Management Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {adminNav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-sans
                  transition-all duration-200 group
                  ${isActive
                    ? "bg-primary-foreground/20 text-white font-medium"
                    : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white"
                  }
                `}
              >
                <item.icon size={20} className="flex-shrink-0 transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
                {isActive && <span className="ml-auto h-1 w-1 rounded-full bg-white" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 md:p-6 border-t border-primary-foreground/20 space-y-2">
          <button
            type="button"
            onClick={() => {
              void handleLogout("manual");
            }}
            disabled={loggingOut}
            className={`
              w-full flex items-center gap-3 px-4 py-3 text-sm rounded-lg
              transition-all duration-200 group
              ${loggingOut 
                ? "opacity-50 cursor-not-allowed bg-primary-foreground/10"
                : "hover:bg-primary-foreground/10 text-primary-foreground/80 hover:text-white"
              }
            `}
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className="text-left">
              {loggingOut ? "Signing out..." : "Logout"}
            </span>
          </button>
          <Link 
            to="/" 
            className="
              w-full flex items-center gap-3 px-4 py-3 text-sm rounded-lg
              hover:bg-primary-foreground/10 transition-all duration-200
              text-primary-foreground/80 hover:text-white
            "
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span>Back to Site</span>
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen md:min-h-0">
        {/* Header */}
        <header className="bg-background border-b border-border px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="font-serif text-xl md:text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="text-xs md:text-sm text-muted-foreground">
            {new Date().toLocaleDateString()}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
