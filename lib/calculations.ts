// src/lib/calculations.ts

export function calculateRuntime(capacityWh: number, deviceWatts: number) {
  const efficiency = 0.85; // 15% Verlust durch Wechselrichter
  const hours = (capacityWh * efficiency) / deviceWatts;

  if (hours < 1) {
    return `${Math.round(hours * 60)} Minuten`;
  }
  return `${hours.toFixed(1)} Stunden`;
}