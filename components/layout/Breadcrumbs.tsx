// src/components/layout/Breadcrumbs.tsx
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Das JSON-LD Schema für Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://powerfinder.app" 
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": `https://powerfinder.app${item.href}`
      }))
    ]
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      {/* Script für strukturierte Daten */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ol className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
        <li className="flex items-center">
          <Link 
            href="/" 
            className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
          >
            <Home className="w-3 h-3" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.href} className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 opacity-30" />
              {isLast ? (
                <span className="text-blue-600 truncate max-w-[150px] md:max-w-none">
                  {item.label}
                </span>
              ) : (
                <Link 
                  href={item.href}
                  className="hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}