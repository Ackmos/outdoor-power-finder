// src/components/layout/Footer.tsx
export function Footer() {
  return (
    <footer className="bg-stone-100 border-t py-12 px-4 mt-20">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold mb-4">Top Marken</h4>
          <ul className="text-sm space-y-2 text-stone-600">
            <li><a href="/marke/ecoflow" className="hover:text-black">EcoFlow Vergleich</a></li>
            <li><a href="/marke/jackery" className="hover:text-black">Jackery Explorer</a></li>
            <li><a href="/marke/bluetti" className="hover:text-black">Bluetti Power</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Wissen</h4>
          <ul className="text-sm space-y-2 text-stone-600">
            <li><a href="/ratgeber/lifepo4" className="hover:text-black">Was ist LiFePO4?</a></li>
            <li><a href="/ratgeber/wattstunden" className="hover:text-black">Wh richtig berechnen</a></li>
          </ul>
        </div>
        <div className="col-span-2">
          <h4 className="font-bold mb-2">Transparenz</h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            Als Affiliate-Partner verdienen wir an qualifizierten Verkäufen. 
            Die technischen Daten und Berechnungen basieren auf Herstellerangaben und physikalischen Formeln ($ \eta = 0.85 $).
          </p>
        </div>
      </div>
    </footer>
  );
}