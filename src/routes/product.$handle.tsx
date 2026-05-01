import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Truck, ShieldCheck, Heart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { getProductByHandle, formatPrice, products } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$handle")({
  component: ProductPage,
  head: ({ params }) => {
    const p = getProductByHandle(params.handle);
    const title = p ? `${p.title} — Ziffy` : "Product — Ziffy";
    const desc = p?.description ?? "Personalized gift from Ziffy.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  loader: ({ params }) => {
    const p = getProductByHandle(params.handle);
    if (!p) throw notFound();
    return { p };
  },
});

function ProductPage() {
  const { handle } = Route.useParams();
  const product = getProductByHandle(handle)!;
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    addItem(product, qty);
    toast.success(`Added ${qty}× ${product.title}`, {
      action: { label: "View Cart", onClick: () => setOpen(true) },
    });
  };

  return (
    <div>
      <div className="container mx-auto px-4 md:px-6 py-10 md:py-14 grid lg:grid-cols-2 gap-10">
        <div className="aspect-square rounded-[2rem] overflow-hidden bg-rose-soft shadow-card-soft">
          <img
            src={product.image}
            alt={product.title}
            width={1024}
            height={1024}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <p className="text-sm text-primary font-semibold uppercase tracking-wider">{product.category}</p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">{product.title}</h1>
          <p className="mt-2 text-muted-foreground">{product.tagline}</p>
          <p className="mt-6 text-3xl font-bold text-gradient-primary">{formatPrice(product.price)}</p>
          <p className="mt-6 text-foreground/80 leading-relaxed">{product.description}</p>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-2 bg-card rounded-full border border-border p-1.5">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="h-9 w-9 rounded-full hover:bg-accent flex items-center justify-center transition-smooth"
                aria-label="Decrease"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-semibold w-8 text-center">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="h-9 w-9 rounded-full hover:bg-accent flex items-center justify-center transition-smooth"
                aria-label="Increase"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              onClick={handleAdd}
              size="lg"
              className="flex-1 rounded-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-soft h-12"
            >
              <ShoppingBag className="h-4 w-4 mr-2" /> Add to Cart
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-rose-soft p-4">
              <Truck className="h-5 w-5 text-primary mx-auto" />
              <p className="text-xs mt-2 font-medium">Same-day delivery</p>
            </div>
            <div className="rounded-2xl bg-rose-soft p-4">
              <ShieldCheck className="h-5 w-5 text-primary mx-auto" />
              <p className="text-xs mt-2 font-medium">Secure checkout</p>
            </div>
            <div className="rounded-2xl bg-rose-soft p-4">
              <Heart className="h-5 w-5 text-primary mx-auto fill-primary" />
              <p className="text-xs mt-2 font-medium">Personalized</p>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container mx-auto px-4 md:px-6 py-12">
          <h2 className="font-display text-3xl font-bold mb-8">You may also love</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-8">
            <Link to="/category/$slug" params={{ slug: product.category }} className="text-primary font-medium hover:underline">
              View all {product.category} →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
