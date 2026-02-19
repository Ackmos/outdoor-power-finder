// src/components/seo/JsonLd.tsx
export function JsonLd({ data }: { data: any }) {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": data.name,
    "description": data.analysisText,
    "brand": { "@type": "Brand", "name": data.brand.name },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EUR",
      "price": data.priceApprox,
      "availability": "https://schema.org/InStock"
    },
    "additionalProperty": [
      { "@type": "PropertyValue", "name": "Kapazität", "value": `${data.capacityWh} Wh` },
      { "@type": "PropertyValue", "name": "Akkutyp", "value": data.batteryType }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}