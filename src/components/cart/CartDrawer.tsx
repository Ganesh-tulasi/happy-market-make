import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingBag, Minus, Plus, Trash2, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/data/products";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const setOpen = useCartStore((s) => s.setOpen);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = useCartStore((s) => s.totalPrice());
  const totalItems = useCartStore((s) => s.totalItems());

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-background">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="font-display text-2xl">
            Your Cart {totalItems > 0 && <span className="text-muted-foreground text-base font-normal">({totalItems})</span>}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="h-20 w-20 rounded-full bg-rose-soft flex items-center justify-center mb-4">
              <ShoppingBag className="h-9 w-9 text-primary" />
            </div>
            <p className="font-display text-xl mb-2">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mb-6">Add some sweet surprises to get started.</p>
            <Button onClick={() => setOpen(false)} className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-soft">
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto -mx-6 px-6 py-4 space-y-4 min-h-0">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3 p-3 rounded-2xl bg-rose-soft/60 border border-border/50">
                  <img
                    src={product.image}
                    alt={product.title}
                    width={80}
                    height={80}
                    loading="lazy"
                    className="h-20 w-20 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium leading-tight truncate">{product.title}</h4>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="text-muted-foreground hover:text-destructive transition-smooth"
                        aria-label="Remove"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-primary font-semibold mt-1">{formatPrice(product.price)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-background rounded-full border border-border p-1">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="h-6 w-6 rounded-full hover:bg-accent flex items-center justify-center transition-smooth"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium w-5 text-center">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="h-6 w-6 rounded-full hover:bg-accent flex items-center justify-center transition-smooth"
                          aria-label="Increase"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-smooth"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex-shrink-0 border-t border-border pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span className="text-primary font-semibold">FREE</span>
              </div>
              <div className="flex items-center justify-between text-lg font-display border-t border-border pt-3">
                <span>Total</span>
                <span className="text-gradient-primary font-bold">{formatPrice(total)}</span>
              </div>
              <Link to="/checkout" onClick={() => setOpen(false)}>
                <Button className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-soft rounded-full h-12 text-base">
                  Checkout
                </Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
