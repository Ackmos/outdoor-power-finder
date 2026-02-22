// src/app/layout.tsx
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://powerstation-finder.de'),
  // ... andere globale Metadaten
}

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