// src/app/layout.tsx
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="scroll-smooth">
      <head />
      <body className="antialiased selection:bg-yellow-200">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}