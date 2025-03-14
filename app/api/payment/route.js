import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { amount, productId } = await req.json();

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,  // ✅ Public Key
      key_secret: process.env.RAZORPAY_KEY_SECRET,  // ✅ Secret Key
    });

    const options = {
      amount: amount * 100, // Convert ₹ to paise
      currency: "INR",
      receipt: `order_${productId}`.slice(0, 39), // ✅ Ensure receipt length is < 40
      payment_capture: 1, // Auto-capture payment
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Payment error:", error); // ✅ Debugging log
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
