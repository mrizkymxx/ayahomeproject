import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer>
      {/* Social Media */}
      <div className="py-10 text-center">
        <p className="font-semibold text-sm mb-4">Follow Our Social Media</p>
        <div className="flex justify-center gap-3">
          <a href="#" className="social-icon bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-primary-foreground" aria-label="Instagram">
            <Instagram size={20} />
          </a>
          <a href="#" className="social-icon bg-foreground text-background" aria-label="TikTok">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13v-3.5a6.37 6.37 0 0 0-.88-.07 6.26 6.26 0 0 0 0 12.52 6.27 6.27 0 0 0 6.27-6.27V8.55a8.19 8.19 0 0 0 3.83.96V6.09a4.85 4.85 0 0 1 0 .6z"/></svg>
          </a>
          <a href="#" className="social-icon bg-blue-600 text-primary-foreground" aria-label="Facebook">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a href="#" className="social-icon bg-red-600 text-primary-foreground" aria-label="Pinterest">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.425 1.808-2.425.853 0 1.265.64 1.265 1.408 0 .858-.546 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.282a.3.3 0 0 1 .069.288l-.278 1.133c-.044.183-.145.222-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.527-2.291-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
          </a>
          <a href="#" className="social-icon bg-red-500 text-primary-foreground" aria-label="YouTube">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
        </div>
      </div>

      {/* Footer Info */}
      <div className="footer-section">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <span className="font-serif text-3xl italic font-bold">loler</span>
              <div className="mt-2">
                <span className="font-serif text-xl font-bold">Loewes</span>
                <br />
                <span className="font-serif text-xl font-bold">Furniture<sup className="text-xs">©</sup></span>
              </div>
            </div>

            <div>
              <h4 className="font-sans font-semibold text-sm mb-3">Our Office</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Loewes Furniture</p>
                <p>Desa Platar RT2 RW1</p>
                <p>Tahunan Jepara</p>
                <p>Central Java 59423</p>
                <p className="mt-3">+62 895-3472-10204</p>
                <p>loewesfurniture@gmail.com</p>
              </div>
            </div>

            <div>
              <h4 className="font-sans font-semibold text-sm mb-3">Others</h4>
              <div className="flex flex-col gap-2 text-sm">
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
                <Link to="/products" className="text-muted-foreground hover:text-foreground transition-colors">Products</Link>
                <Link to="/articles" className="text-muted-foreground hover:text-foreground transition-colors">Articles</Link>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
                <Link to="/why-us" className="text-muted-foreground hover:text-foreground transition-colors">Why Us</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
