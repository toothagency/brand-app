import type { Metadata } from "next";
import "./globals.css";
import { BrandProvider } from "./contexts/BrandContext";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
export const metadata: Metadata = {
  title: "Jara AI",
  description: "AI-powered brand design at lightning speed",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`}
      >
        <Toaster />
        <Navbar />
        <BrandProvider>{children}</BrandProvider>
      </body>
    </html>
  );
}
