export function HomeSchema({ stations }: { stations: any[] }) {
  const baseUrl = "https://powerstation-finder.de";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      // 1. Die Organisation (POWERFINDER als Marke)
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": "POWERFINDER",
        "url": baseUrl,
        "logo": `${baseUrl}/logo.png`,
        "description": "Das größte Vergleichsportal für Powerstations und mobile Solarsysteme."
      },
      // 2. Die Liste der Produkte (ItemList)
      {
        "@type": "ItemList",
        "name": "Top Powerstations 2026",
        "description": "Eine Übersicht der besten mobilen Stromspeicher im Test.",
        "itemListElement": stations.map((s, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": `${baseUrl}/powerstation-test/${s.slug}`,
          "name": `${s.brand.name} ${s.name}`
        }))
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}