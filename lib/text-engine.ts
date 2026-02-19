import { templates, uspTemplates, deepDiveTemplates } from "./text-template";
import { getStationScenario, getStationUSP } from "./usp-logic";

/**
 * Erzeugt einen stabilen Zahlenwert aus einem String (Slug).
 * Wichtig, damit Google bei jedem Crawl denselben Text sieht.
 */
function getStableHash(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

/**
 * Hauptfunktion zur Generierung des individuellen SEO-Textes.
 */
export function generateSeoText(station: any): string {
  const seed = getStableHash(station.slug);
  const usp = getStationUSP(station);
  
  // 1. Daten vorbereiten
  const totalPorts = (station.portsAc || 0) + (station.portsUsbC || 0) + (station.portsUsbA || 0);
  
  // 2. Text-Bausteine auswählen (Stabil via Seed)
  const intro = templates.transitions.intro[seed % templates.transitions.intro.length];
  const linking = templates.transitions.linking[seed % templates.transitions.linking.length];
  const closing = templates.transitions.closing[seed % templates.transitions.closing.length];

  // 3. USP-Satz auswählen
  const uspPool = uspTemplates[usp.type as keyof typeof uspTemplates] || uspTemplates.GENERAL;
  const rawUspText = uspPool[seed % uspPool.length];

  // 4. Platzhalter ersetzen
  const formattedUspText = rawUspText
    .replace(/{name}/g, station.name)
    .replace(/{weight}/g, station.weightKg.toString())
    .replace(/{output}/g, station.outputWatts.toString())
    .replace(/{cycles}/g, station.cycleLife.toString())
    .replace(/{portCount}/g, totalPorts.toString());

  // 5. Einen zusätzlichen stabilen Satz für Akku/Laden hinzufügen (optional)
  const batteryText = templates.battery.lifepo4[seed % templates.battery.lifepo4.length]
    .replace(/{cycleLife}/g, station.cycleLife.toString());

  // 6. Finaler Text-Zusammenbau
  // Struktur: Intro -> USP-Hauptteil -> Überleitung -> Akku-Fakten -> Fazit
  return `${intro} ${formattedUspText} ${linking} ${batteryText} ${closing}`;
}

export function generateDetailedAnalysis(station: any) {
  const seed = getStableHash(station.slug);
  const usp = getStationUSP(station);
  const scenario = getStationScenario(station); // NEU: Szenario-Logik
  
  const totalPorts = (station.portsAc || 0) + (station.portsUsbC || 0) + (station.portsUsbA || 0);

  // 1. Der USP-Satz (Kurz & Knackig)
  const uspPool = uspTemplates[usp.type as keyof typeof uspTemplates] || uspTemplates.GENERAL;
  const summary = uspPool[seed % uspPool.length]
    .replace(/{name}/g, station.name)
    .replace(/{weight}/g, station.weightKg)
    .replace(/{output}/g, station.outputWatts)
    .replace(/{cycles}/g, station.cycleLife)
    .replace(/{portCount}/g, totalPorts);

  // 2. Der Deep Dive (Lang & SEO-stark)
  // Wir greifen auf den Pool zu, den getStationScenario bestimmt hat
  const deepDivePool = deepDiveTemplates[scenario.pool as keyof typeof deepDiveTemplates];
  const deepDiveContent = deepDivePool[seed % deepDivePool.length]
    .replace(/{name}/g, station.name)
    .replace(/{capacity}/g, station.capacityWh)
    .replace(/{output}/g, station.outputWatts)
    .replace(/{portCount}/g, totalPorts);

  return {
    summary,
    deepDiveTitle: scenario.title, // Der Titel kommt aus der Szenario-Logik
    deepDiveContent,
    technicalNote: templates.battery.lifepo4[seed % templates.battery.lifepo4.length].replace(/{cycleLife}/g, station.cycleLife)
  };
}