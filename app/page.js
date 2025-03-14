// "use client";

// import { useEffect, useState } from "react";
// import { SessionProvider } from "next-auth/react";
// import axios from "axios";
// import Navbar from "../components/Navbar";
// import "./globals.css";

// export default function Home() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     axios.get("/api/products").then((res) => setProducts(res.data));
//   }, []);

//   const handlePayment = async (product) => {
//     try {
//       const response = await axios.post("/api/payment", {
//         amount: product.price * 100, // Convert ₹ to paise
//         productId: product.id,
//         receipt: `order_${product.id}`, // ✅ Short and unique (max 40 chars)
//       });
      

//       const { order } = response.data;

//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY, // Razorpay Public Key
//         amount: order.amount,
//         currency: "INR",
//         name: "E-Commerce Store",
//         description: product.name,
//         order_id: order.id,
//         handler: async function (response) {
//           alert("Payment Successful!");
//         },
//         prefill: {
//           name: "John Doe",
//           email: "johndoe@example.com",
//           contact: "9876543210",
//         },
//         theme: {
//           color: "#6366F1",
//         },
//       };

//       const razor = new window.Razorpay(options);
//       razor.open();
//     } catch (error) {
//       console.error("Payment failed:", error);
//       alert("Payment Failed!");
//     }
//   };

//   return (
//     <SessionProvider>
//       <div className="min-h-screen bg-gray-100">
//         <Navbar />
//         <h1 className="text-4xl text-center font-bold my-5">Products</h1>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5">
//           {products.length > 0 ? (
//             products.map((product) => (
//               <div key={product.id} className="bg-white p-5 rounded-lg shadow-lg">
//                 <img
//                   src={product.imageUrl}
//                   alt={product.name}
//                   className="w-full h-40 object-cover"
//                 />
//                 <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
//                 <p className="text-gray-500">₹{product.price}</p>
//                 <button
//                   onClick={() => handlePayment(product)}
//                   className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
//                 >
//                   Buy Now
//                 </button>
//               </div>
//             ))
//           ) : (
//             <p className="text-center text-gray-500">Loading products...</p>
//           )}
//         </div>
//       </div>
//     </SessionProvider>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("/api/products").then((res) => setProducts(res.data));
  }, []);

  const handlePayment = async (product) => {
    try {
      const response = await axios.post("/api/payment", {
        amount: product.price, // ✅ Send price in ₹
        productId: product.id,
      });

      const { order } = response.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY, // ✅ Public Key
        amount: order.amount,
        currency: "INR",
        name: "E-Commerce",
        description: product.name,
        order_id: order.id,
        handler: async (response) => {
          alert("Payment Successful!");
          console.log("Payment Details:", response);
        },
        prefill: {
          name: "John Doe",
          email: "johndoe@example.com",
          contact: "9876543210",
        },
        theme: { color: "#6366F1" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error(error);
      alert("Payment Failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <h1 className="text-4xl text-center font-bold my-5">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="bg-white p-5 rounded-lg shadow-lg">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
              <p className="text-gray-500">₹{product.price}</p>
              <button
                onClick={() => handlePayment(product)}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
              >
                Buy Now
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Loading products...</p>
        )}
      </div>
    </div>
  );
}

