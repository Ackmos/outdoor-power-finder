// src/components/station/ProsCons.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

interface ProsConsProps {
  pros: string | null;
  cons: string | null;
}

export function ProsCons({ pros, cons }: ProsConsProps) {
  // Hilfsfunktion zum Umwandeln des Strings in ein Array
  const formatList = (text: string | null) => 
    text ? text.split(";").filter((item) => item.trim() !== "") : [];

  const prosList = formatList(pros);
  const consList = formatList(cons);

  return (
    <section className="grid md:grid-cols-2 gap-6">
      {/* Vorteile */}
      <Card className="border-green-100 bg-green-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 text-lg">
            <CheckCircle2 className="w-5 h-5" />
            Vorteile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {prosList.length > 0 ? (
              prosList.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-stone-700">
                  <span className="text-green-500 font-bold">✓</span>
                  {item}
                </li>
              ))
            ) : (
              <li className="text-sm text-stone-400 italic">Keine Vorteile angegeben</li>
            )}
          </ul>
        </CardContent>
      </Card>

      {/* Nachteile */}
      <Card className="border-stone-200 bg-stone-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-stone-700 text-lg">
            <XCircle className="w-5 h-5" />
            Nachteile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {consList.length > 0 ? (
              consList.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-stone-600">
                  <span className="text-stone-400 font-bold">✕</span>
                  {item}
                </li>
              ))
            ) : (
              <li className="text-sm text-stone-400 italic">Keine nennenswerten Nachteile</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}