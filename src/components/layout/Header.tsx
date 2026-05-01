import { Link } from "@tanstack/react-router";
import { ShoppingBag, Heart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/category/chocolates", label: "Chocolates" },
  { to: "/category/bouquets", label: "Bouquets" },
  { to: "/category/cups", label: "Cups" },
  { to: "/category/combos", label: "Combos" },
] as const;

export function Header() {
  const totalItems = useCartStore((s) => s.totalItems());
  const setOpen = useCartStore((s) => s.setOpen);

  return (
    <header className="sticky top-0 z-40 w-full bg-rose-soft/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-soft group-hover:scale-105 transition-smooth">
            <Heart className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold text-gradient-primary">
            Ziffy
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-smooth"
              activeProps={{ className: "text-primary font-semibold" }}
              activeOptions={{ exact: link.to === "/" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          className="relative hover:bg-accent rounded-full"
          aria-label="Open cart"
        >
          <ShoppingBag className="h-5 w-5 text-primary" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-primary text-primary-foreground text-[11px] font-semibold flex items-center justify-center shadow-soft">
              {totalItems}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}
