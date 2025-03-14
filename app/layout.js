import { Geist, Geist_Mono } from "next/font/google";
import SessionWrapper from "../components/SessionWrapper"; // Import new wrapper
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionWrapper> {/* Wrap children inside SessionProvider */}
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
// "use client";
// import { SessionProvider } from "next-auth/react";

// export default function RootLayout({ children }) {
//   return (
//     <SessionProvider>
//       {children}
//     </SessionProvider>
//   );
// }