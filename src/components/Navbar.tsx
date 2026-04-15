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
    <header className={`sticky top-0 z-50 bg-background py-6 px-6 lg:px-12 transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="flex flex-col leading-tight">
          <span className="font-serif text-2xl lg:text-3xl font-bold tracking-tight">AYAHOMEPROJECT</span>
          <span className="font-sans text-xs lg:text-sm tracking-[0.18em] text-muted-foreground">SUAR WOOD SPECIALIST</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
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

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="md:hidden mt-4 flex flex-col gap-3 px-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`nav-link py-2 ${location.pathname === item.path ? "nav-link-active" : ""}`}
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
