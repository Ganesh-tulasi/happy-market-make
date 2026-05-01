import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useProductsStore } from "@/stores/productsStore";
import { categories, formatPrice, type Category } from "@/data/products";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Admin — Ziffy" },
      { name: "description", content: "Add or remove products in your Ziffy storefront." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function AdminPage() {
  const products = useProductsStore((s) => s.products);
  const addProduct = useProductsStore((s) => s.addProduct);
  const removeProduct = useProductsStore((s) => s.removeProduct);
  const resetToDefault = useProductsStore((s) => s.resetToDefault);

  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<Category>("chocolates");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const onImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setImage(typeof reader.result === "string" ? reader.result : "");
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fallback = categories.find((c) => c.slug === category)?.image ?? "";
    const priceNum = Number(price);
    if (!title || !priceNum || priceNum <= 0) {
      toast.error("Please enter a title and a valid price");
      return;
    }
    addProduct({
      title: title.trim(),
      tagline: tagline.trim() || "Personalized gift",
      price: priceNum,
      category,
      image: image || fallback,
      description: description.trim() || `${title} — hand-crafted with love.`,
    });
    toast.success(`Added "${title}"`);
    setTitle(""); setTagline(""); setPrice(""); setImage(""); setDescription("");
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 md:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-primary font-semibold uppercase tracking-wider">Admin</p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">Manage Products</h1>
          <p className="mt-2 text-muted-foreground">Add new gifts or remove items from your storefront.</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="rounded-full">
              <RotateCcw className="h-4 w-4 mr-2" /> Reset to default
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset all products?</AlertDialogTitle>
              <AlertDialogDescription>
                This restores the original Ziffy catalog and removes any custom products you added.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => { resetToDefault(); toast.success("Catalog reset"); }}
              >
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Add product form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-1 bg-card rounded-3xl border border-border/50 shadow-card-soft p-6 md:p-8 space-y-4 self-start lg:sticky lg:top-24"
        >
          <h2 className="font-display text-xl font-bold">Add Product</h2>

          <div>
            <Label htmlFor="p-title">Title</Label>
            <Input id="p-title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1.5 rounded-xl h-11" placeholder="Heart Chocolate Box" />
          </div>

          <div>
            <Label htmlFor="p-tagline">Tagline</Label>
            <Input id="p-tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} className="mt-1.5 rounded-xl h-11" placeholder="Personalized • 12 pieces" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="p-price">Price (₹)</Label>
              <Input id="p-price" type="number" min="1" value={price} onChange={(e) => setPrice(e.target.value)} required className="mt-1.5 rounded-xl h-11" placeholder="899" />
            </div>
            <div>
              <Label htmlFor="p-cat">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger id="p-cat" className="mt-1.5 rounded-xl h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>{c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="p-img">Image</Label>
            <Input
              id="p-img"
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && onImageFile(e.target.files[0])}
              className="mt-1.5 rounded-xl h-11 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-rose-tint file:text-primary file:text-sm file:font-medium"
            />
            {image && (
              <img src={image} alt="Preview" className="mt-3 h-24 w-24 rounded-xl object-cover border border-border" />
            )}
            <p className="text-xs text-muted-foreground mt-1.5">Optional — uses category image if blank.</p>
          </div>

          <div>
            <Label htmlFor="p-desc">Description</Label>
            <Textarea id="p-desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1.5 rounded-xl" placeholder="Hand-crafted Belgian chocolates…" />
          </div>

          <Button type="submit" className="w-full rounded-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-soft h-11">
            <Plus className="h-4 w-4 mr-1" /> Add Product
          </Button>
        </form>

        {/* Products list */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">All Products ({products.length})</h2>
          </div>

          {products.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-12 text-center bg-rose-soft/40">
              <p className="font-display text-xl">No products yet</p>
              <p className="text-sm text-muted-foreground mt-1">Add your first gift using the form.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border/50 shadow-card-soft">
                  <img src={p.image} alt={p.title} className="h-16 w-16 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Link to="/product/$handle" params={{ handle: p.handle }} className="font-medium hover:text-primary transition-smooth truncate block">
                      {p.title}
                    </Link>
                    <p className="text-xs text-muted-foreground capitalize">{p.category} · {p.tagline}</p>
                  </div>
                  <span className="font-semibold text-primary hidden sm:block">{formatPrice(p.price)}</span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove "{p.title}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove the product from your storefront. You can restore the default catalog anytime.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => { removeProduct(p.id); toast.success("Removed"); }}
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
