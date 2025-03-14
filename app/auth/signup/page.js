"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post("/api/auth/signup", formData);
      if (res.status === 201) {
        router.push("/auth/signin"); // Redirect to sign-in page
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="flex items-center gap-2 text-gray-600">
              <FaUser /> Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center gap-2 text-gray-600">
              <FaEnvelope /> Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center gap-2 text-gray-600">
              <FaLock /> Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-blue-500 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
