import { PrismaClient } from "@prisma/client";
import Razorpay from "razorpay";

const prisma = new PrismaClient();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ error: "Missing userId or amount" });
    }

    // ✅ Create order in Razorpay
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`, // ✅ Unique receipt ID
      payment_capture: 1, // Auto-capture payment
    });

    // ✅ Store order details in the database
    const savedOrder = await prisma.order.create({
      data: {
        userId,
        amount,
        orderId: order.id, // ✅ Save Razorpay order ID
        status: "created", // ✅ Initial status
      },
    });

    return res.status(200).json({ orderId: order.id, savedOrder });
  } catch (error) {
    console.error("Checkout error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  } finally {
    await prisma.$disconnect(); // ✅ Ensure Prisma is properly disconnected
  }
}
