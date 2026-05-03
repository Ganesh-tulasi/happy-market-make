import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-rose-soft mt-24 pt-16 pb-8 border-t border-border/50">
      <div className="container mx-auto px-4 md:px-6 grid gap-10 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-soft">
              <Heart className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold text-gradient-primary">
              Ziffy
            </span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            Make every gift personal. Hand-crafted with love &amp; delivered with care.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/category/$slug" params={{ slug: "chocolates" }} className="hover:text-primary transition-smooth">Chocolates</Link></li>
            <li><Link to="/category/$slug" params={{ slug: "bouquets" }} className="hover:text-primary transition-smooth">Bouquets</Link></li>
            <li><Link to="/category/$slug" params={{ slug: "cups" }} className="hover:text-primary transition-smooth">Cups</Link></li>
            <li><Link to="/category/$slug" params={{ slug: "combos" }} className="hover:text-primary transition-smooth">Combos</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4">Help</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Same Day Delivery</li>
            <li>Track Order</li>
            <li>Contact</li>
            <li>WhatsApp Support</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4">Stay in touch</h4>
          <p className="text-sm text-muted-foreground">
            Get sweet drops &amp; seasonal offers.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 pt-6 border-t border-border/50 text-center text-sm text-muted-foreground">
        Made with <Heart className="inline h-3.5 w-3.5 fill-primary text-primary mx-0.5" /> by Ziffy © 2026
      </div>
    </footer>
  );
}
