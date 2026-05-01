import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-gradient-primary">404</h1>
        <h2 className="mt-4 font-display text-2xl">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-gradient-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-90 transition-smooth"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Personalized Gifts, Chocolates, Bouquets & Combos" },
      { name: "description", content: "Hand-crafted chocolates, fresh bouquets, photo mugs & curated gift combos. Personalized with their name and your message. Same-day delivery." },
      { name: "author", content: "Ziffy" },
      { property: "og:title", content: "Personalized Gifts, Chocolates, Bouquets & Combos" },
      { property: "og:description", content: "Hand-crafted chocolates, fresh bouquets, photo mugs & curated gift combos. Personalized with their name and your message. Same-day delivery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Personalized Gifts, Chocolates, Bouquets & Combos" },
      { name: "twitter:description", content: "Hand-crafted chocolates, fresh bouquets, photo mugs & curated gift combos. Personalized with their name and your message. Same-day delivery." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8740936d-f8fe-4068-addb-2510bc695451/id-preview-1702b90f--ff5730cf-8684-4c4b-84cf-426da854358d.lovable.app-1777634583192.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8740936d-f8fe-4068-addb-2510bc695451/id-preview-1702b90f--ff5730cf-8684-4c4b-84cf-426da854358d.lovable.app-1777634583192.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Toaster position="top-center" richColors />
    </div>
  );
}
