import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// ✅ Prevent multiple Prisma instances
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("🛠 Credentials received:", credentials); // Debugging log

          if (!credentials?.email || !credentials?.password) {
            console.error("❌ Missing email or password");
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          console.log("🔍 User found:", user);

          if (!user) {
            console.error("❌ User not found");
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          console.log("🔑 Password valid:", isPasswordValid);

          if (!isPasswordValid) {
            console.error("❌ Invalid password");
            return null;
          }

          return { id: user.id, name: user.name, email: user.email };
        } catch (error) {
          console.error("🔥 Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", // ✅ Ensure this page exists
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET, // ✅ Ensure this is set in `.env.local`
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  debug: process.env.NODE_ENV !== "production", // ✅ Enable debug logs in development
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
