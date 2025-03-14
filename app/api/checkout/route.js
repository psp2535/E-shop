import { PrismaClient } from "@prisma/client";
import Razorpay from "razorpay";

const prisma = new PrismaClient();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { userId, amount } = req.body;

      if (!userId || !amount) {
        return res.status(400).json({ error: "Missing userId or amount" });
      }

      // Create an order in Razorpay
      const order = await razorpay.orders.create({
        amount: amount * 100, // Convert to paisa (smallest currency unit)
        currency: "INR",
      });

      // Store order details in the database
      await prisma.order.create({
        data: {
          userId,
          amount,
        },
      });

      // Return the created order
      return res.status(200).json(order);
    } catch (error) {
      console.error("Checkout error:", error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  // Handle non-POST requests
  return res.status(405).json({ message: "Method Not Allowed" });
}
