// src/components/station/AffiliateCTA.tsx
import { Button } from "@/components/ui/button";
import { ShoppingCart, ExternalLink } from "lucide-react";

interface AffiliateCTAProps {
  price: number;
  shopName?: string;
  url?: string;
}

export function AffiliateCTA({ price, shopName = "Amazon", url = "#" }: AffiliateCTAProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-stone-400 uppercase font-bold tracking-wider">Aktueller Bestpreis</span>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-stone-900">{price.toFixed(2)} €</span>
          <span className="text-sm text-stone-500">inkl. MwSt.</span>
        </div>
      </div>

      <a href={url} target="_blank" rel="nofollow noopener">
        <Button className="w-full h-14 text-lg font-bold bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all group rounded-2xl">
          <ShoppingCart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
          Jetzt bei {shopName} prüfen
          <ExternalLink className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </a>

      <p className="text-[10px] text-stone-400 leading-tight">
        * Preise können sich seit der letzten Aktualisierung geändert haben. 
        Klick auf den Button führt zum Partnershop (Affiliate-Link).
      </p>
    </div>
  );
}