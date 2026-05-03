import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import crypto from "crypto";

const createOrderSchema = z.object({
  amount: z.number().int().min(100), // paise
  currency: z.string().default("INR"),
  receipt: z.string().max(40),
});

export const createRazorpayOrder = createServerFn({ method: "POST" })
  .inputValidator((input) => createOrderSchema.parse(input))
  .handler(async ({ data }) => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new Error("Razorpay credentials are not configured");
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    let res: Response;
    try {
      res = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          amount: data.amount,
          currency: data.currency,
          receipt: data.receipt,
        }),
      });
    } catch (err) {
      console.error("Razorpay fetch threw:", err);
      throw new Error("Network error contacting Razorpay");
    }

    const text = await res.text();
    if (!res.ok) {
      console.error("Razorpay order creation failed:", res.status, text);
      throw new Error(`Razorpay ${res.status}: ${text}`);
    }

    const order = JSON.parse(text) as { id: string; amount: number; currency: string };
    return {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
    };
  });

const verifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .inputValidator((input) => verifySchema.parse(input))
  .handler(async ({ data }) => {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) throw new Error("Razorpay secret not configured");

    const expected = crypto
      .createHmac("sha256", keySecret)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex");

    const a = Buffer.from(expected);
    const b = Buffer.from(data.razorpay_signature);
    const valid = a.length === b.length && crypto.timingSafeEqual(a, b);

    if (!valid) {
      return { success: false as const };
    }
    return { success: true as const, payment_id: data.razorpay_payment_id };
  });
