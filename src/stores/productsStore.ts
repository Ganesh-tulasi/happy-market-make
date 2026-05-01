import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { products as seedProducts, type Product, type Category } from "@/data/products";

interface ProductsStore {
  products: Product[];
  addProduct: (p: Omit<Product, "id" | "handle"> & { handle?: string }) => void;
  removeProduct: (id: string) => void;
  resetToDefault: () => void;
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const useProductsStore = create<ProductsStore>()(
  persist(
    (set, get) => ({
      products: seedProducts,

      addProduct: (p) => {
        const id = "p" + Date.now();
        const handle = p.handle?.trim() || slugify(p.title) || id;
        set({ products: [{ ...p, id, handle }, ...get().products] });
      },

      removeProduct: (id) =>
        set({ products: get().products.filter((p) => p.id !== id) }),

      resetToDefault: () => set({ products: seedProducts }),
    }),
    {
      name: "ziffy-products",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useProductsByCategory = (cat: Category) =>
  useProductsStore((s) => s.products.filter((p) => p.category === cat));

export const useProductByHandle = (handle: string) =>
  useProductsStore((s) => s.products.find((p) => p.handle === handle));
