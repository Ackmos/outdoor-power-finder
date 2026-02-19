// src/lib/usp-logic.ts

export type USPType = 
  | "PORTABILITY" 
  | "POWER" 
  | "LONGEVITY" 
  | "CONNECTIVITY" 
  | "VALUE" 
  | "ALL_STAR" 
  | "GENERAL";

interface USPResult {
  type: USPType;
  label: string;
  score: number;
}

export function getStationUSP(station: any): USPResult {
  const points: USPResult[] = [];

  // 1. Portabilität: Alles unter 10kg ist für Camper extrem attraktiv
  if (station.weightKg && station.weightKg < 10) {
    points.push({ 
      type: "PORTABILITY", 
      label: "Federleicht", 
      score: 10 - station.weightKg // Je leichter, desto wertvoller der USP
    });
  }

  // 2. Power: Stationen mit echtem "Wumms" für Haushaltsgeräte
  if (station.outputWatts && station.outputWatts >= 2000) {
    points.push({ 
      type: "POWER", 
      label: "Kraftpaket", 
      score: station.outputWatts / 500 // Skaliert mit der Leistung
    });
  }

  // 3. Langlebigkeit: Fokus auf LiFePO4 und hohe Zyklenzahlen
  if (station.cycleLife && station.cycleLife >= 3000) {
    points.push({ 
      type: "LONGEVITY", 
      label: "Dauerläufer", 
      score: station.cycleLife / 500 
    });
  }

  // 4. Konnektivität: Viele Anschlüsse für Technik-Fans
  const totalPorts = (station.portsAc || 0) + (station.portsUsbC || 0) + (station.portsUsbA || 0);
  if (totalPorts >= 10) {
    points.push({ 
      type: "CONNECTIVITY", 
      label: "Anschluss-Monster", 
      score: totalPorts * 0.5 
    });
  }

  // 5. Preis-Leistung: Euro pro Wattstunde (Wh)
  if (station.priceApprox && station.capacityWh) {
    const pricePerWh = station.priceApprox / station.capacityWh;
    if (pricePerWh < 0.85) { // Günstiger als 85 Cent pro Wh gilt als Top-Deal
      points.push({ 
        type: "VALUE", 
        label: "Preis-Leistungs-Sieger", 
        score: (1 - pricePerWh) * 10 
      });
    }
  }

  // --- LOGIK FÜR DEN "ALL-STAR" ---
  // Wenn eine Station in 3 oder mehr Kategorien punktet, ist sie ein All-Star
  if (points.length >= 3) {
    return { type: "ALL_STAR", label: "Der ultimative Champion", score: 100 };
  }

  // Wenn keine speziellen USPs gefunden wurden, ist es ein solider Allrounder
  if (points.length === 0) {
    return { type: "GENERAL", label: "Allrounder", score: 0 };
  }

  // Ansonsten: Den USP mit dem höchsten Score zurückgeben
  return points.sort((a, b) => b.score - a.score)[0];
}


export function getStationScenario(station: any) {
  // Wir nutzen die Kapazität als Haupt-Entscheider für das Szenario
  if (station.capacityWh < 500) {
    return {
      id: "CAMPING",
      title: "Der Spezialist für Micro-Adventures & mobiles Equipment",
      pool: "CAMPING_EXPERT"
    };
  } 
  
  if (station.capacityWh >= 500 && station.capacityWh < 1500) {
    return {
      id: "VANLIFE",
      title: "Die All-in-One Lösung für Vanlife und Home-Office",
      pool: "HOME_OFFICE_BACKUP"
    };
  }

  return {
    id: "BACKUP",
    title: "Maximale Sicherheit: Die Station als Haus-Backup",
    pool: "EMERGENCY_PREPAREDNESS"
  };
}