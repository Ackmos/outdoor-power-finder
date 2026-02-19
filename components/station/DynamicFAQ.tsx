// src/components/station/DynamicFAQ.tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function DynamicFAQ({ station }: { station: any }) {
  const faqs = [
    {
      q: `Welche Anschlüsse hat die ${station.name}?`,
      a: `Die ${station.name} verfügt über ${station.portsAc} AC-Steckdosen, ${station.portsUsbC} USB-C Ports und ${station.portsUsbA} USB-A Anschlüsse.`
    },
    {
      q: `Ist die ${station.name} für medizinisches Backup (CPAP) geeignet?`,
      a: station.upsMode 
        ? `Ja, dank des USV-Modus und der Kapazität von ${station.capacityWh}Wh ist sie ideal für CPAP-Geräte geeignet.`
        : `Bedingt. Sie hat zwar ${station.capacityWh}Wh, verfügt aber über keinen dedizierten USV-Modus.`
    }
  ];

  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold mb-6">Häufige Fragen zur {station.name}</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-stone-600">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

//TODO Mehr fragen definieren, z.B. zu Solarinput, Gewicht, etc. Je mehr relevante Fragen wir hier abdecken, desto besser für SEO und Nutzerbindung.