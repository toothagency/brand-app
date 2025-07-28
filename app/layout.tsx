import type { Metadata } from "next";
import "./globals.css";
import { BrandProvider } from "./contexts/BrandContext";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import AOSInit from "./components/AOSInit";
import Footer from "./components/footer";

export const metadata: Metadata = {
  title: "Jara AI Brand Builder",
  description: "Create your brand, logo, and social content instantly with AI",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`}
      >
        <AOSInit />
        <Toaster />
        <Navbar />
        <BrandProvider>{children}</BrandProvider>
        <Footer />
      </body>
    </html>
  );
}
