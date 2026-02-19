// src/components/layout/Navbar.tsx
import Link from "next/link";
import { Zap, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500" />
          <span>POWER<span className="text-stone-500">FINDER</span></span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <Link href="/kategorie/camping" className="hover:text-black transition">Camping</Link>
          <Link href="/kategorie/notstrom" className="hover:text-black transition">Notstrom</Link>
          <Link href="/vergleich" className="hover:text-black transition">Vergleich</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon"><Search className="w-5 h-5" /></Button>
          <Button className="hidden md:flex bg-stone-900 text-white rounded-full px-6">
            Finder starten
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden"><Menu className="w-6 h-6" /></Button>
        </div>
      </div>
    </header>
  );
}