import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, type Product } from "@/data/products";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`Added ${product.title}`, {
      description: "Open cart to checkout",
      action: { label: "View", onClick: () => setOpen(true) },
    });
  };

  return (
    <Link
      to="/product/$handle"
      params={{ handle: product.handle }}
      className="group relative rounded-3xl overflow-hidden bg-card border border-border/50 shadow-card-soft hover:shadow-soft transition-smooth flex flex-col"
    >
      <div className="aspect-square overflow-hidden bg-rose-soft">
        <img
          src={product.image}
          alt={product.title}
          width={600}
          height={600}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-smooth"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-lg leading-tight">{product.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{product.tagline}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-gradient-primary">{formatPrice(product.price)}</span>
          <Button
            size="sm"
            onClick={handleAdd}
            className="rounded-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-soft h-9 px-4"
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </div>
    </Link>
  );
}
