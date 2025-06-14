import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { BrandProvider } from "./contexts/BrandContext";
import Navbar from "./components/Navbar";
import { Toaster } from 'react-hot-toast';
export const metadata: Metadata = {
  title: "Tooth BrandKit",
  description: "AI-powered brand design at lightning speed",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <Toaster/>
        <Providers>
          {" "} <Navbar />
          <BrandProvider>{children}</BrandProvider>
        </Providers>
      </body>
    </html>
  );
}
