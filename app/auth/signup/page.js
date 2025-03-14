"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../../../components/Navbar";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="border p-2 w-full mb-3"
          value={formData.name}
          onChange={handleChange}
          required
        />
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
          Sign Up
        </button>
      </form>
      <p className="mt-4">
        Already have an account? <a href="/auth/signin" className="text-blue-500">Sign in</a>
      </p>
    </div>
  );
}
