import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return new Response(JSON.stringify(user), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error creating user" }), { status: 500 });
  }
}
