import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { isAdminLoggedIn, onAdminAuthStateChange } from "@/lib/admin-auth";

const AdminRouteGuard = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      const ok = await isAdminLoggedIn();
      if (mounted) {
        setLoggedIn(ok);
        setLoading(false);
      }
    };

    check();
    const unsubscribe = onAdminAuthStateChange((ok) => {
      if (!mounted) return;
      setLoggedIn(ok);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen bg-muted flex items-center justify-center">
        <Loader2 className="animate-spin" size={28} />
      </section>
    );
  }

  if (!loggedIn) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/admin/login?next=${next}`} replace />;
  }

  return <Outlet />;
};

export default AdminRouteGuard;
