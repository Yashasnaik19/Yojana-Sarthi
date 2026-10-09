import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../data/translations';

interface CivicDisclaimerProps {
  language: LanguageCode;
}

export const CivicDisclaimer: React.FC<CivicDisclaimerProps> = ({ language }) => {
  const t = translations[language];

  return (
    <aside aria-label="Official platform disclaimer" className="bg-emerald-950 text-emerald-100 px-4 py-2 text-xs border-b border-emerald-900">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-left">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
          <p className="leading-tight font-medium text-emerald-200">
            {t.disclaimer}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] shrink-0 font-medium">
          <Info className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Independent Citizen Service Layer</span>
        </div>
      </div>
    </aside>
  );
};
