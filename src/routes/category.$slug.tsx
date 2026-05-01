import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProductCard } from "@/components/product/ProductCard";
import { categories, getProductsByCategory, type Category } from "@/data/products";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
  head: ({ params }) => {
    const cat = categories.find((c) => c.slug === params.slug);
    const title = cat ? `${cat.title} — Ziffy` : "Category — Ziffy";
    const desc = cat ? `${cat.subtitle}. Personalized & delivered same day.` : "Shop personalized gifts.";
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
    const cat = categories.find((c) => c.slug === params.slug);
    if (!cat) throw notFound();
    return { cat };
  },
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const cat = categories.find((c) => c.slug === slug)!;
  const items = getProductsByCategory(slug as Category);

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm text-primary font-semibold uppercase tracking-wider">Collection</p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">{cat.title}</h1>
        <p className="mt-3 text-muted-foreground text-lg">{cat.subtitle}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
