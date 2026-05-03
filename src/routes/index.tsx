import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Truck, ShieldCheck, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { categories } from "@/data/products";
import { useProductsStore } from "@/stores/productsStore";
import heroGift from "@/assets/hero-gift.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Ziffy — Personalized Gifts, Chocolates, Bouquets & Combos" },
      { name: "description", content: "Make every gift personal. Hand-crafted chocolates, fresh bouquets, photo mugs and curated combos with same-day delivery." },
    ],
  }),
});

function Index() {
  const products = useProductsStore((s) => s.products);
  const featured = products.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-hero">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border/50 shadow-soft text-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium">Custom-made for you</span>
            </span>
            <h1 className="mt-6 font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05]">
              Make Every Gift{" "}
              <span className="text-gradient-primary">Personal</span> with Ziffy 💝
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Hand-crafted chocolates, fresh bouquets, photo mugs &amp; curated combos —
              personalized with their name, your message, and the moment.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/category/$slug" params={{ slug: "chocolates" }}>
                <Button size="lg" className="rounded-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-soft h-12 px-6">
                  Shop Now <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/category/$slug" params={{ slug: "combos" }}>
                <Button size="lg" variant="outline" className="rounded-full h-12 px-6 border-border bg-card hover:bg-accent">
                  Explore Combos
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <span className="flex items-center gap-2 text-primary font-medium">
                <Truck className="h-4 w-4" /> Same Day Delivery
              </span>
              <span className="flex items-center gap-2 text-primary font-medium">
                <ShieldCheck className="h-4 w-4" /> Secure Checkout
              </span>
              <span className="flex items-center gap-2 text-primary font-medium">
                <Heart className="h-4 w-4 fill-primary" /> 10k+ Happy Gifts
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-[2rem] overflow-hidden bg-rose-tint shadow-glow">
              <img
                src={heroGift}
                alt="Pink gift box with satin ribbon"
                width={1024}
                height={1024}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="mb-10">
          <h2 className="font-display text-4xl md:text-5xl font-bold">Shop by Category</h2>
          <p className="mt-2 text-muted-foreground">Find the perfect gift for every moment.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden shadow-card-soft hover:shadow-soft transition-smooth"
            >
              <img
                src={c.image}
                alt={c.title}
                width={600}
                height={750}
                loading="lazy"
                className="h-full w-full object-cover group-hover:scale-105 transition-smooth"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <h3 className="font-display text-2xl font-bold">{c.title}</h3>
                <p className="text-sm opacity-90">{c.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="container mx-auto px-4 md:px-6 py-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Bestsellers</h2>
            <p className="mt-2 text-muted-foreground">Loved by thousands of gift-givers.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="bg-gradient-banner rounded-[2.5rem] px-6 py-14 md:py-20 text-center text-primary-foreground shadow-glow">
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Need it today? We've got you.
          </h2>
          <p className="mt-3 opacity-95">
            Order before 2 PM for same-day delivery within the city.
          </p>
          <Link to="/category/combos">
            <Button size="lg" className="mt-7 rounded-full bg-card text-primary hover:bg-card/90 h-12 px-8 shadow-soft">
              Start Gifting
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
