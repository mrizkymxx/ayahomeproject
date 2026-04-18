import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { label: "HOME", path: "/" },
  { label: "ABOUT US", path: "/about" },
  { label: "PRODUCTS", path: "/products" },
  { label: "ARTICLES", path: "/articles" },
  { label: "CONTACT", path: "/contact" },
  { label: "WHY US", path: "/why-us" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-background py-4 sm:py-6 px-4 sm:px-6 lg:px-12 transition-shadow duration-300 ${scrolled ? 'shadow-md border-b border-border/30' : ''}`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="flex flex-col leading-tight py-2">
          <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">AYAHOMEPROJECT</span>
          <span className="font-sans text-xs lg:text-sm tracking-[0.18em] text-muted-foreground">SUAR WOOD SPECIALIST</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? "nav-link-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button 
          className="md:hidden p-2 -mr-2 hover:bg-muted rounded-lg transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="md:hidden mt-3 sm:mt-4 pb-3 flex flex-col gap-1 px-2 -mx-4 border-t border-border/30 pt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`nav-link py-3 px-3 rounded-lg transition-all ${
                location.pathname === item.path 
                  ? "bg-muted/50 underline underline-offset-8 decoration-2" 
                  : "hover:bg-muted/30"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
