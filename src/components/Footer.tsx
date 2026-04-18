import { Link } from "react-router-dom";
import { Instagram, MessageCircle, Store } from "lucide-react";

const WHATSAPP_LINK = "https://wa.me/628164823454";
const INSTAGRAM_LINK = "https://www.instagram.com/ayahomeproject.id";
const TOKOPEDIA_LINK = "https://www.tokopedia.com/ayahomeproject";

const Footer = () => {
  const channels = [
    {
      name: "Instagram",
      href: INSTAGRAM_LINK,
      icon: Instagram,
      iconClass: "bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-primary-foreground",
    },
    {
      name: "WhatsApp",
      href: WHATSAPP_LINK,
      icon: MessageCircle,
      iconClass: "bg-green-500 text-primary-foreground",
    },
    {
      name: "Tokopedia",
      href: TOKOPEDIA_LINK,
      icon: Store,
      iconClass: "bg-emerald-600 text-primary-foreground",
    },
  ] as const;

  return (
    <footer>
      <div className="py-10 text-center">
        <p className="font-semibold text-sm mb-4">Follow Our Channels</p>
        <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto">
          {channels.map((channel) => (
            <a
              key={channel.name}
              href={channel.href}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-2"
              aria-label={channel.name}
            >
              <span className={`social-icon ${channel.iconClass}`}>
                <channel.icon size={20} />
              </span>
              <span className="text-xs text-muted-foreground">{channel.name}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="footer-section">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <span className="font-serif text-xl font-bold">AYAHOMEPROJECT</span>
              <p className="font-sans text-xs tracking-[0.18em] mt-1 text-muted-foreground">SUAR WOOD SPECIALIST</p>
            </div>

            <div>
              <h3 className="font-sans font-semibold text-sm mb-3">Our Workshop</h3>
              <div className="text-sm space-y-1 leading-6">
                <p className="font-semibold text-foreground">Aya Home Project</p>
                <p className="text-foreground">Serogenen, Pekalongan</p>
                <p className="text-foreground">Batealit, Jepara Regency</p>
                <p className="text-foreground">Central Java 59461</p>
                <p className="text-foreground">Indonesia</p>
                <p className="pt-2 text-xs text-muted-foreground">International inquiries are welcome.</p>
              </div>
            </div>

            <div>
              <h3 className="font-sans font-semibold text-sm mb-3">Others</h3>
              <div className="flex flex-col gap-2 text-sm">
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
                <Link to="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                  Products
                </Link>
                <Link to="/articles" className="text-muted-foreground hover:text-foreground transition-colors">
                  Articles
                </Link>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
                <Link to="/why-us" className="text-muted-foreground hover:text-foreground transition-colors">
                  Why Us
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border text-xs text-muted-foreground">
            Design &amp; Development by M Rizky (
            <a
              href="https://www.instagram.com/mrizkymxx"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              @mrizkymxx
            </a>
            )
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
