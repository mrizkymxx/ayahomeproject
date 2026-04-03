import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

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

  return (
    <header className="bg-background py-6 px-6 lg:px-12">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="flex flex-col leading-tight">
          <span className="font-serif text-2xl lg:text-3xl font-bold tracking-tight">Loewes</span>
          <span className="font-serif text-2xl lg:text-3xl font-bold tracking-tight">Furniture<sup className="text-xs">©</sup></span>
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

        <div className="hidden md:block">
          <span className="font-serif text-3xl italic font-bold tracking-tight opacity-80">loler</span>
        </div>

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
