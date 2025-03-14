"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <Link href="/" className="text-lg font-bold">E-Commerce</Link>
      {session ? (
        <div className="flex gap-4">
          <p>Welcome, {session.user.name}</p>
          <button onClick={() => signOut()} className="bg-red-500 px-3 py-1 rounded">Logout</button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link href="/auth/signin">
            <button className="bg-blue-500 px-3 py-1 rounded">Login</button>
          </Link>
          <Link href="/auth/signup">
            <button className="bg-green-500 px-3 py-1 rounded">Sign Up</button>
          </Link>
        </div>
      )}
    </nav>
  );
}
