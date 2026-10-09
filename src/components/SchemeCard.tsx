import React from 'react';
import { Scheme, LanguageCode } from '../types';
import { translations } from '../data/translations';
import {
  ExternalLink,
  Bookmark,
  CheckCircle2,
  Calendar,
  Building2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface SchemeCardProps {
  scheme: Scheme;
  matchScore?: number;
  matchReasons?: string[];
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenDetails: (scheme: Scheme) => void;
  language: LanguageCode;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  matchScore,
  matchReasons,
  isSaved,
  onToggleSave,
  onOpenDetails,
  language,
}) => {
  const t = translations[language];

  return (
    <article className="group bg-white rounded-2xl border border-stone-200 hover:border-emerald-500/60 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div className="p-5">
        {/* Unboxed Metadata Header (Zero-Pill Discipline) */}
        <div className="flex items-center justify-between gap-2 text-xs text-stone-500 mb-2">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-semibold text-stone-700">{scheme.category}</span>
            <span aria-hidden="true">·</span>
            <span>{scheme.scope === 'STATE' ? `${scheme.state} State` : 'Central Govt'}</span>
            <span aria-hidden="true">·</span>
            {scheme.linksLastChecked && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-stone-500 font-medium">
                  Links checked: {scheme.linksLastChecked}
                </span>
              </>
            )}
          </div>
          <button
            onClick={() => onToggleSave(scheme.id)}
            aria-label={isSaved ? `Remove ${scheme.name} from saved` : `Save ${scheme.name}`}
            className="p-2 text-stone-400 hover:text-emerald-700 min-h-[44px] min-w-[44px] -mr-2 -mt-2 flex items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-700 text-emerald-700' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-950 transition-colors leading-snug line-clamp-2">
          {scheme.name}
        </h3>

        {/* Ministry Subtext */}
        <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5 shrink-0 text-stone-400" />
          <span className="truncate">{scheme.ministry}</span>
        </p>

        {/* Short Description */}
        <p className="text-xs text-stone-600 mt-2.5 line-clamp-2 leading-relaxed">
          {scheme.shortDescription}
        </p>

        {/* Benefits Highlight Box */}
        <div className="mt-3.5 p-3 rounded-xl bg-stone-50 border border-stone-200/80">
          <span className="text-[10px] font-bold tracking-wider text-stone-500 uppercase block">
            What you can receive
          </span>
          <p className="text-xs font-semibold text-stone-900 mt-0.5 line-clamp-2">
            {scheme.benefits}
          </p>
        </div>

        <p className="text-[11px] text-amber-900/90 bg-amber-50/80 px-2.5 py-1 rounded-lg border border-amber-200/60 mt-3 font-medium">
          Always confirm details on the official portal before applying.
        </p>

        {/* Match score bar if available */}
        {matchScore !== undefined && (
          <div className="mt-3.5 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-900">
                {matchScore}% profile match
              </span>
              <span className="text-[11px] text-stone-400">
                Informational match
              </span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${matchScore}%` }}
              />
            </div>
            {matchReasons && matchReasons.length > 0 && (
              <p className="text-[11px] text-stone-500 mt-1 truncate">
                Matched: {matchReasons[0]}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="px-5 py-3.5 bg-stone-50/70 border-t border-stone-200 flex items-center justify-between gap-3">
        <a
          href={scheme.officialApplicationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-stone-600 hover:text-emerald-800 flex items-center gap-1 min-h-[44px] py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded"
        >
          <span>Official Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={() => onOpenDetails(scheme)}
          className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors min-h-[44px] flex items-center gap-1 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          <span>View Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
};
