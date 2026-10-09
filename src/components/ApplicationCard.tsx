import React from 'react';
import { TrackedApplication, LanguageCode } from '../types';
import { translations } from '../data/translations';
import {
  Clock,
  Building2,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  ExternalLink,
} from 'lucide-react';

interface ApplicationCardProps {
  application: TrackedApplication;
  onOpenDetails: (app: TrackedApplication) => void;
  language: LanguageCode;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onOpenDetails,
  language,
}) => {
  const t = translations[language];

  // Status visual mapping with both explicit text label & accessible color
  const getStatusDisplay = () => {
    switch (application.currentStatus) {
      case 'SANCTIONED':
      case 'APPROVED':
        return {
          label: t.statusSanctioned,
          bg: 'bg-emerald-50',
          text: 'text-emerald-900',
          dot: 'bg-emerald-600',
          border: 'border-emerald-300',
          icon: CheckCircle2,
        };
      case 'DOCUMENTS_REQUIRED':
        return {
          label: t.statusDocumentsRequired,
          bg: 'bg-amber-50',
          text: 'text-amber-900',
          dot: 'bg-amber-500',
          border: 'border-amber-300',
          icon: AlertTriangle,
        };
      case 'UNDER_VERIFICATION':
        return {
          label: t.statusUnderVerification,
          bg: 'bg-orange-50',
          text: 'text-orange-900',
          dot: 'bg-orange-500',
          border: 'border-orange-300',
          icon: Clock,
        };
      case 'PAYMENT_PROCESSING':
        return {
          label: t.statusPaymentProcessing,
          bg: 'bg-sky-50',
          text: 'text-sky-900',
          dot: 'bg-sky-600',
          border: 'border-sky-300',
          icon: RotateCw,
        };
      case 'PAYMENT_RELEASED':
        return {
          label: t.statusPaymentReleased,
          bg: 'bg-emerald-50',
          text: 'text-emerald-900',
          dot: 'bg-emerald-600',
          border: 'border-emerald-300',
          icon: CheckCircle2,
        };
      case 'REJECTED':
      case 'PAYMENT_FAILED':
        return {
          label: t.statusRejected,
          bg: 'bg-rose-50',
          text: 'text-rose-900',
          dot: 'bg-rose-600',
          border: 'border-rose-300',
          icon: AlertCircle,
        };
      default:
        return {
          label: t.statusSubmitted,
          bg: 'bg-blue-50',
          text: 'text-blue-900',
          dot: 'bg-blue-600',
          border: 'border-blue-300',
          icon: Clock,
        };
    }
  };

  const statusStyle = getStatusDisplay();
  const StatusIcon = statusStyle.icon;

  return (
    <div
      onClick={() => onOpenDetails(application)}
      className="cursor-pointer bg-white rounded-2xl border border-stone-200 hover:border-emerald-500/70 hover:shadow-md transition-all duration-200 p-5 space-y-3.5 relative overflow-hidden"
    >
      {/* Top row: Status Tag + Demo Label */}
      <div className="flex items-center justify-between gap-2">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
          <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
          <StatusIcon className="w-3.5 h-3.5" />
          <span>{statusStyle.label}</span>
        </div>

        {application.isDemo && (
          <span className="text-[10px] font-mono tracking-wider font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300">
            DEMO DATA
          </span>
        )}
      </div>

      {/* Scheme & Reference */}
      <div>
        <h3 className="text-base font-bold text-stone-900 leading-snug">
          {application.schemeName}
        </h3>
        <div className="flex items-center gap-2 text-xs text-stone-500 mt-1 font-mono">
          <span>Ref: {application.referenceNumber}</span>
          <span aria-hidden="true">·</span>
          <span>Applied: {application.applicationDate}</span>
        </div>
      </div>

      {/* Department & Benefit info */}
      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs space-y-1">
        <div className="flex items-center justify-between text-stone-600">
          <span>Sanction / Benefit:</span>
          <strong className="text-stone-900 font-semibold">{application.benefitPreview}</strong>
        </div>
        <div className="flex items-center justify-between text-stone-500 text-[11px]">
          <span>Source:</span>
          <span className="truncate max-w-[200px]">{application.statusSourceName}</span>
        </div>
      </div>

      {/* Next Action UX guidance prompt */}
      <div className="text-xs text-stone-600 bg-stone-50/50 p-2.5 rounded-xl border border-stone-100 flex items-start gap-2">
        <span className="font-bold text-stone-800 shrink-0">Next step:</span>
        <span className="line-clamp-2 text-stone-700">{application.nextActionAdvice}</span>
      </div>

      {/* Bottom Footer: Last Checked & View Details button */}
      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-stone-400">
          Last checked: {application.lastChecked}
        </span>
        <div className="flex items-center gap-1 font-bold text-emerald-800 group-hover:text-emerald-950">
          <span>View tracking details</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
