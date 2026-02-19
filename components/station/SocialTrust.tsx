// src/components/station/SocialTrust.tsx
import { brandTrustData } from "@/lib/brand-trust";
import { TrendingUp, Award, ShieldCheck, HelpCircle } from "lucide-react";

export function SocialTrust({ brandName }: { brandName: string }) {
  const trust = brandTrustData[brandName] || brandTrustData["default"];

  const icons = {
    award: <Award className="w-5 h-5 text-yellow-600" />,
    trend: <TrendingUp className="w-5 h-5 text-blue-600" />,
    shield: <ShieldCheck className="w-5 h-5 text-green-600" />,
  };

  return (
    <div className="bg-white border border-stone-100 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-2xl ${
          trust.iconType === 'trend' ? 'bg-blue-50' : 
          trust.iconType === 'award' ? 'bg-yellow-50' : 'bg-green-50'
        }`}>
          {icons[trust.iconType]}
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Marken-Status
          </p>
          <h4 className="text-lg font-bold text-stone-900 leading-tight">
            {trust.badge}
          </h4>
          <p className="text-sm text-stone-500 leading-relaxed">
            {trust.reason}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-stone-50 flex items-center justify-between">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-stone-200" />
          ))}
          <div className="w-6 h-6 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center text-[8px] font-bold">
            +
          </div>
        </div>
        <p className="text-[11px] text-stone-400 font-medium">
          Wird oft zusammen mit Solarpanels verglichen
        </p>
      </div>
    </div>
  );
}