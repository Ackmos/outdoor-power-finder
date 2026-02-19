export function BrandAuthority() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-black mb-6">Führende Powerstation-Hersteller im Fokus</h2>
        <div className="grid md:grid-cols-3 gap-6 text-sm text-stone-600 leading-relaxed">
          <p>
            <strong>EcoFlow:</strong> Bekannt für die branchenweit schnellsten Ladezeiten (X-Stream Technologie) und eine hervorragende App-Steuerung. Ideal für Nutzer, die wenig Zeit am Stromnetz verbringen.
          </p>
          <p>
            <strong>Bluetti:</strong> Setzt konsequent auf langlebige LiFePO4-Akkus und bietet oft modulare Erweiterungsmöglichkeiten für Haus-Backup-Systeme an.
          </p>
          <p>
            <strong>Jackery:</strong> Der Pionier für Outdoor-Strom. Die Explorer-Serie besticht durch Robustheit, einfache Bedienung und ein sehr gut abgestimmtes Solar-Ökosystem.
          </p>
        </div>
      </div>
    </section>
  );
}