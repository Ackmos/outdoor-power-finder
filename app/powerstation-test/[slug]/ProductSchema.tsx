export function ProductSchema({ station }: { station: any }) {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": `${station.brand.name} ${station.name}`,
    "image": [
      station.thumbnailUrl,
      ...(station.images || [])
    ].filter(Boolean),
    "description": `Testbericht und technische Daten zur ${station.name} Powerstation von ${station.brand.name}.`,
    "brand": {
      "@type": "Brand",
      "name": station.brand.name
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EUR",
      "price": station.priceApprox,
      "availability": "https://schema.org/InStock",
      "url": `https://deine-domain.de/powerstation-test/${station.slug}`
    },
    // Optional: Falls du ein Rating-Feld hast
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "12"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}