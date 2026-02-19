// src/lib/brand-trust.ts

export const brandTrustData: Record<string, { badge: string; reason: string; iconType: 'award' | 'trend' | 'shield' }> = {
  "EcoFlow": {
    badge: "Innovationsführer 2026",
    reason: "Marktführend bei Ladegeschwindigkeit und App-Anbindung.",
    iconType: "trend"
  },
  "Jackery": {
    badge: "Outdoor-Pionier",
    reason: "Seit über 10 Jahren spezialisiert auf robuste Camping-Lösungen.",
    iconType: "award"
  },
  "Anker": {
    badge: "Qualitäts-Garant",
    reason: "Bekannt für exzellente Verarbeitung und 5 Jahre Herstellergarantie.",
    iconType: "shield"
  },
  "Bluetti": {
    badge: "Nachhaltigkeits-Champion",
    reason: "Vorreiter bei langlebigen LiFePO4-Zellen und Bio-Gehäusen.",
    iconType: "award"
  },
  "default": {
    badge: "Geprüfter Händler",
    reason: "Erfüllt alle gängigen Sicherheitsstandards für mobile Energie.",
    iconType: "shield"
  }
};