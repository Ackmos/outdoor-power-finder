export function FAQSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Welche Powerstation ist die beste für Camping?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Für Camping empfehlen wir kompakte Modelle zwischen 300Wh und 600Wh, wie die EcoFlow River Serie oder Jackery Explorer, da sie leicht zu transportieren sind."
        }
      },
      {
        "@type": "Question",
        "name": "Wie kann ich eine Powerstation laden?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Die meisten Powerstations lassen sich über drei Wege laden: Klassisch über die Steckdose (AC), über das Auto-Ladegerät (DC) oder mittels faltbarer Solarpaneele für maximale Unabhängigkeit."
        }
      }
    ]
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}