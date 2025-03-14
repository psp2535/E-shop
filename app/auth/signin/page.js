"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";

export default function Signin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 w-full mb-3"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          Sign In
        </button>
      </form>
      <p className="mt-4">
        Dont have an account? <a href="/auth/signup" className="text-blue-500">Sign up</a>
      </p>
    </div>
  );
}
