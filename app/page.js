"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [products, setProducts] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    axios
      .get("/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (product) => {
    if (!session) {
      alert("Please Sign In to make a purchase.");
      signIn();
      return;
    }

    try {
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        alert("Failed to load Razorpay. Check your internet connection.");
        return;
      }

      const response = await axios.post("/api/payment", {
        amount: product.price,
        productId: product.id,
      });

      if (!response.data || !response.data.order) {
        throw new Error("Invalid order response from server");
      }

      const { order } = response.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        name: "E-Commerce",
        description: product.name,
        handler: (res) => {
          alert("Payment Successful!");
        },
        prefill: {
          name: session.user?.name || "John Doe",
          email: session.user?.email || "johndoe@example.com",
          contact: session.user?.contact || "9876543210",
        },
        theme: { color: "#6366F1" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment Failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-white text-2xl font-bold">
            E-Shop
          </Link>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-white">Welcome, {session.user.name}!</span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn()}
                className="bg-white text-blue-600 px-4 py-2 rounded-md shadow-md hover:bg-gray-200 transition"
              >
                Sign In / Sign Up
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Product List */}
      <div className="max-w-7xl mx-auto px-5 py-10">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Shop Our Latest Products
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Explore our exclusive collection and make your purchase today!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md-grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
              >
             

<Image
  src={product.imageUrl}
  alt={product.name}
  width={300} // Adjust width
  height={224} // Adjust height
  className="w-full h-56 object-cover"
/>

                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">₹{product.price}</p>
                  <button
                    onClick={() => handlePayment(product)}
                    className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              Loading products...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
