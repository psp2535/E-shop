import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { amount, productId } = await req.json();

    if (!amount || !productId) {
      return NextResponse.json({ error: "Invalid payment details." }, { status: 400 });
    }

    console.log("Payment request received:", { amount, productId });

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // Convert ₹ to paise
      currency: "INR",
      receipt: `order_${productId}`.slice(0, 39),
      payment_capture: 1, // Auto-capture payment
    };

    console.log("Creating Razorpay Order:", options);

    const order = await razorpay.orders.create(options);

    console.log("Order Created:", order);

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
