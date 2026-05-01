import chocolatesImg from "@/assets/cat-chocolates.jpg";
import bouquetsImg from "@/assets/cat-bouquets.jpg";
import cupsImg from "@/assets/cat-cups.jpg";
import combosImg from "@/assets/cat-combos.jpg";

export type Category = "chocolates" | "bouquets" | "cups" | "combos";

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: number; // in INR
  image: string;
  category: Category;
  tagline: string;
}

export const categories: { slug: Category; title: string; subtitle: string; image: string }[] = [
  { slug: "chocolates", title: "Chocolates", subtitle: "Personalized chocolate boxes", image: chocolatesImg },
  { slug: "bouquets", title: "Bouquets", subtitle: "Custom flower bouquets", image: bouquetsImg },
  { slug: "cups", title: "Cups", subtitle: "Photo printed mugs", image: cupsImg },
  { slug: "combos", title: "Combos", subtitle: "Curated gift combos", image: combosImg },
];

export const products: Product[] = [
  {
    id: "p1",
    handle: "heart-chocolate-box",
    title: "Heart Chocolate Box",
    description: "Hand-crafted Belgian chocolates in a signature heart-shaped box. Personalize with a name or message.",
    price: 899,
    image: chocolatesImg,
    category: "chocolates",
    tagline: "Personalized • 12 pieces",
  },
  {
    id: "p2",
    handle: "love-letter-truffles",
    title: "Love Letter Truffles",
    description: "Velvety dark chocolate truffles dusted with cocoa, packed in a luxe gift sleeve with a custom note.",
    price: 749,
    image: chocolatesImg,
    category: "chocolates",
    tagline: "16 truffles • Custom note",
  },
  {
    id: "p3",
    handle: "blush-rose-bouquet",
    title: "Blush Rose Bouquet",
    description: "Fifteen fresh blush pink roses, hand-tied and wrapped in soft pastel paper with satin ribbon.",
    price: 1199,
    image: bouquetsImg,
    category: "bouquets",
    tagline: "15 stems • Same day delivery",
  },
  {
    id: "p4",
    handle: "pink-peony-bouquet",
    title: "Pink Peony Bouquet",
    description: "Plush pink peonies and roses arranged in a romantic, garden-style bouquet.",
    price: 1499,
    image: bouquetsImg,
    category: "bouquets",
    tagline: "Premium florals",
  },
  {
    id: "p5",
    handle: "photo-heart-mug",
    title: "Photo Heart Mug",
    description: "Premium ceramic mug printed with your favourite photo and a custom message inside the heart.",
    price: 499,
    image: cupsImg,
    category: "cups",
    tagline: "Dishwasher safe • 350ml",
  },
  {
    id: "p6",
    handle: "couple-name-mug",
    title: "Couple Name Mug",
    description: "Glossy white mug with elegant typography featuring two names and a date of your choice.",
    price: 449,
    image: cupsImg,
    category: "cups",
    tagline: "Personalized typography",
  },
  {
    id: "p7",
    handle: "sweet-surprise-combo",
    title: "Sweet Surprise Combo",
    description: "A curated basket of Belgian chocolates, fresh roses and a personalised mug — wrapped with a satin bow.",
    price: 1899,
    image: combosImg,
    category: "combos",
    tagline: "Chocolates + Roses + Mug",
  },
  {
    id: "p8",
    handle: "luxury-gift-hamper",
    title: "Luxury Gift Hamper",
    description: "Our most-loved hamper: artisan chocolates, peony bouquet, photo mug and a hand-written card.",
    price: 2499,
    image: combosImg,
    category: "combos",
    tagline: "All-in-one luxury",
  },
];

export const getProductsByCategory = (cat: Category) =>
  products.filter((p) => p.category === cat);

export const getProductByHandle = (handle: string) =>
  products.find((p) => p.handle === handle);

export const formatPrice = (n: number) => `₹${n.toLocaleString("en-IN")}`;
