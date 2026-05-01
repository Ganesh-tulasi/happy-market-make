import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Wallet, ShieldCheck, ShoppingBag, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/data/products";
import { toast } from "sonner";

// ✅ Razorpay type declaration
declare global {
  interface Window {
    Razorpay: any;
  }
}

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: "Checkout — Ziffy" },
      { name: "description", content: "Secure checkout. Cash on Delivery or Online Payment." },
    ],
  }),
});

type Payment = "cod" | "online";

// ✅ Dynamically load Razorpay script
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.totalPrice());
  const clearCart = useCartStore((s) => s.clearCart);
  const navigate = useNavigate();
  const [payment, setPayment] = useState<Payment>("cod");
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Form field refs for prefill
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleOrderSuccess = (id: string) => {
    setOrderId(id);
    setPlaced(true);
    clearCart();
    toast.success("Order placed!", { description: `Order #${id} confirmed.` });
  };

  // ✅ Open Razorpay payment modal
  const openRazorpay = async () => {
    setLoading(true);
    const loaded = await loadRazorpayScript();

    if (!loaded) {
      toast.error("Payment failed to load. Please check your internet connection.");
      setLoading(false);
      return;
    }

    const id = "ZF" + Math.floor(100000 + Math.random() * 900000);

    const options = {
      // ✅ REPLACE THIS WITH YOUR RAZORPAY KEY ID
      key: "rzp_test_Sk5cEZyARqpGY6",
      amount: Math.round(total * 100), // Razorpay needs paise (₹1 = 100 paise)
      currency: "INR",
      name: "Ziffy",
      description: "Gift Order #" + id,
      image: "/favicon.ico",
      handler: function () {
        // ✅ Payment successful
        handleOrderSuccess(id);
      },
      prefill: {
        name: name,
        email: email,
        contact: phone,
      },
      notes: {
        order_id: id,
      },
      theme: {
        color: "#E91E8C", // Ziffy pink
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
          toast.error("Payment cancelled. Please try again.");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function () {
      toast.error("Payment failed. Please try again or use a different method.");
      setLoading(false);
    });

    rzp.open();
    setLoading(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (payment === "online") {
      // ✅ Open Razorpay for online payment
      openRazorpay();
    } else {
      // ✅ Cash on Delivery — place order directly
      const id = "ZF" + Math.floor(100000 + Math.random() * 900000);
      handleOrderSuccess(id);
    }
  };

  if (placed) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-20 max-w-xl text-center">
        <div className="h-20 w-20 rounded-full bg-gradient-primary mx-auto flex items-center justify-center shadow-soft">
          <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="mt-6 font-display text-4xl font-bold">Thank you! 💝</h1>
        <p className="mt-3 text-muted-foreground">
          Your order <span className="font-semibold text-foreground">#{orderId}</span> has been placed.
          We'll send you updates over WhatsApp shortly.
        </p>
        <Link to="/">
          <Button className="mt-8 rounded-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-soft h-12 px-8">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-20 max-w-xl text-center">
        <div className="h-20 w-20 rounded-full bg-rose-soft mx-auto flex items-center justify-center">
          <ShoppingBag className="h-9 w-9 text-primary" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add gifts to your cart to checkout.</p>
        <Link to="/">
          <Button className="mt-6 rounded-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-soft">
            Browse Gifts
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 md:py-14">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-8">Checkout</h1>

      <form onSubmit={onSubmit} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Contact */}
          <div className="bg-card rounded-3xl border border-border/50 shadow-card-soft p-6 md:p-8">
            <h2 className="font-display text-xl font-bold mb-5">Contact</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  required
                  className="mt-1.5 rounded-xl h-11"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  required
                  type="tel"
                  className="mt-1.5 rounded-xl h-11"
                  placeholder="+91 ..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  required
                  type="email"
                  className="mt-1.5 rounded-xl h-11"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-card rounded-3xl border border-border/50 shadow-card-soft p-6 md:p-8">
            <h2 className="font-display text-xl font-bold mb-5">Delivery Address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" required className="mt-1.5 rounded-xl h-11" placeholder="House no., street, area" />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" required className="mt-1.5 rounded-xl h-11" />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" required className="mt-1.5 rounded-xl h-11" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="message">Gift message (optional)</Label>
                <Textarea id="message" className="mt-1.5 rounded-xl" rows={3} placeholder="Add a sweet personal note…" />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-card rounded-3xl border border-border/50 shadow-card-soft p-6 md:p-8">
            <h2 className="font-display text-xl font-bold mb-5">Payment</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPayment("cod")}
                className={`text-left p-5 rounded-2xl border-2 transition-smooth ${
                  payment === "cod"
                    ? "border-primary bg-rose-tint shadow-soft"
                    : "border-border bg-background hover:border-primary/50"
                }`}
              >
                <Wallet className={`h-5 w-5 mb-2 ${payment === "cod" ? "text-primary" : "text-muted-foreground"}`} />
                <p className="font-semibold">Cash on Delivery</p>
                <p className="text-xs text-muted-foreground">Pay when it arrives</p>
              </button>
              <button
                type="button"
                onClick={() => setPayment("online")}
                className={`text-left p-5 rounded-2xl border-2 transition-smooth ${
                  payment === "online"
                    ? "border-primary bg-rose-tint shadow-soft"
                    : "border-border bg-background hover:border-primary/50"
                }`}
              >
                <CreditCard className={`h-5 w-5 mb-2 ${payment === "online" ? "text-primary" : "text-muted-foreground"}`} />
                <p className="font-semibold">Online Payment</p>
                <p className="text-xs text-muted-foreground">UPI / Card / Wallet</p>
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 self-start">
          <div className="bg-card rounded-3xl border border-border/50 shadow-card-soft p-6 md:p-8">
            <h2 className="font-display text-xl font-bold mb-5">Order Summary</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3">
                  <img src={product.image} alt={product.title} width={56} height={56} loading="lazy" className="h-14 w-14 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.title}</p>
                    <p className="text-xs text-muted-foreground">Qty {quantity}</p>
                  </div>
                  <span className="text-sm font-semibold">{formatPrice(product.price * quantity)}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(total)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="text-primary font-semibold">FREE</span></div>
              <div className="flex justify-between text-lg font-display font-bold pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-gradient-primary">{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-5 rounded-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-soft h-12 text-base"
            >
              {loading ? "Processing..." : payment === "online" ? "Pay Now" : "Place Order"}
            </Button>
            <p className="mt-3 text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Secured &amp; encrypted checkout
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
