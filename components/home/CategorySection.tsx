// src/components/home/CategorySection.tsx
import { Tent, Home, Truck } from "lucide-react";
import Link from "next/link";

const categories = [
  { title: "Camping & Outdoor", slug: "camping", icon: Tent, desc: "Leicht & Kompakt" },
  { title: "Home Backup", slug: "notstrom", icon: Home, desc: "Sicherheit bei Blackouts" },
  { title: "Vanlife & DIY", slug: "vanlife", icon: Truck, desc: "Maximale Kapazität" },
];

export function CategorySection() {
  return (
    <div className="grid md:grid-cols-3 gap-4 mb-16">
      {categories.map((cat) => (
        <Link key={cat.slug} href={`/kategorie/${cat.slug}`} className="group">
          <div className="bg-white border p-6 rounded-2xl hover:border-yellow-500 transition-all shadow-sm flex items-center gap-4">
            <div className="bg-stone-100 p-3 rounded-xl group-hover:bg-yellow-500 transition">
              <cat.icon className="w-6 h-6 group-hover:text-black" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900">{cat.title}</h3>
              <p className="text-xs text-stone-500">{cat.desc}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}