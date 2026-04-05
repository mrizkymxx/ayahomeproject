import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { applyPageSeoMeta } from "@/lib/seo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    applyPageSeoMeta({
      title: "Page Not Found | Aya Home Project",
      description: "The page you are looking for does not exist.",
      canonicalUrl: `${window.location.origin}${location.pathname}`,
      imageUrl: "https://ayahomeproject.com/og-ayahomeproject.jpg",
      robots: "noindex,nofollow",
    });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
