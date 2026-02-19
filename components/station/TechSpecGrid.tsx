// src/components/station/TechSpecGrid.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Zap, Sun, HardDrive, Weight, Battery, 
  RefreshCw, Timer, Plug, Smartphone, Usb, Car, Activity, 
  ShieldCheck
} from "lucide-react";

export function TechSpecGrid({ station }: { station: any }) {
  // Helfer für die Zeitformatierung (z.B. 90 Min -> 1,5 Std)
  const formatTime = (min: number) => {
    if (min < 60) return `${min} Min.`;
    const hrs = min / 60;
    return `${hrs.toLocaleString('de-DE', { maximumFractionDigits: 1 })} Std.`;
  };

  const specGroups = [
    {
      title: "Leistung & Akku",
      items: [
        { label: "Kapazität", value: `${station.capacityWh} Wh`, icon: Battery },
        { label: "Dauerleistung", value: `${station.outputWatts} W`, icon: Zap },
        { label: "Spitzenleistung", value: `${station.surgeWatts} W`, icon: Activity },
        { label: "Akku-Typ", value: station.batteryType, icon: HardDrive },
        { label: "Lebensdauer", value: `${station.cycleLife}+ Zyklen`, icon: RefreshCw },
      ]
    },
    {
      title: "Laden",
      items: [
        { label: "AC Laden", value: formatTime(station.chargeTimeAcMin), icon: Timer },
        { label: "Solar Input", value: `${station.solarInputMaxW}W`, icon: Sun },
        { label: "USV Modus", value: station.upsMode ? "Ja" : "Nein", icon: ShieldCheck },
      ]
    },
    {
      title: "Anschlüsse",
      items: [
        { label: "AC Steckdosen", value: station.portsAc, icon: Plug },
        { label: "USB-C Ports", value: station.portsUsbC, icon: Smartphone },
        { label: "USB-A Ports", value: station.portsUsbA, icon: Usb },
        { label: "12V DC Port", value: station.portsDc12v, icon: Car },
      ]
    }
  ];

  return (
    <Card className="sticky top-6 border-none shadow-sm bg-stone-50/50">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm uppercase tracking-widest text-stone-500 font-bold">
            Technische Daten
          </CardTitle>
          <div className="flex items-center gap-1 text-xs text-stone-400">
            <Weight className="w-3 h-3" />
            {station.weightKg} kg
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {specGroups.map((group) => (
          <div key={group.title} className="space-y-3">
            <h4 className="text-[10px] uppercase font-bold text-stone-400 border-b pb-1">
              {group.title}
            </h4>
            <div className="grid gap-2">
              {group.items.map((item) => (
                <div key={item.label} className="flex justify-between items-center group">
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <item.icon className="w-3.5 h-3.5 text-stone-400 group-hover:text-blue-500 transition-colors" />
                    <span>{item.label}</span>
                  </div>
                  <span className="font-bold text-sm text-stone-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}