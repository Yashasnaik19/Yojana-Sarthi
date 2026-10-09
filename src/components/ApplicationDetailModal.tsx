import React, { useState } from 'react';
import {
  TrackedApplication,
  LanguageCode,
  StatusSourceType,
} from '../types';
import { translations } from '../data/translations';
import { GovernmentIntegrationService } from '../services/governmentIntegration';
import {
  X,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCw,
  Building2,
  Banknote,
  FileCheck,
  CreditCard,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';

interface ApplicationDetailModalProps {
  application: TrackedApplication | null;
  onClose: () => void;
  onUpdateApplication: (updated: TrackedApplication) => void;
  isDemoMode: boolean;
  language: LanguageCode;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  onClose,
  onUpdateApplication,
  isDemoMode,
  language,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  if (!application) return null;

  const t = translations[language];

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    setRefreshMessage(null);

    try {
      const result = await GovernmentIntegrationService.checkApplicationStatus(
        application.schemeId,
        application.referenceNumber,
        isDemoMode || application.isDemo
      );

      const nowStr = new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const updated: TrackedApplication = {
        ...application,
        lastChecked: nowStr,
        currentStatus: result.status,
        statusSourceType: result.statusSourceType,
        statusSourceName: result.statusSourceName,
        nextActionAdvice: result.actionAdvice,
      };

      onUpdateApplication(updated);

      if (result.isAvailable) {
        setRefreshMessage(`Status verified from ${result.statusSourceName}: ${result.rawPortalMessage}`);
      } else {
        setRefreshMessage(result.actionAdvice);
      }
    } catch (e) {
      setRefreshMessage('Could not reach official status service. Please check directly on the portal.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const getSourceBadge = (type: StatusSourceType) => {
    switch (type) {
      case 'OFFICIAL_API':
        return { label: 'Official API (Verified)', bg: 'bg-emerald-50 text-emerald-800 border-emerald-300' };
      case 'OFFICIAL_PORTAL':
        return { label: 'Official Gov Portal', bg: 'bg-blue-50 text-blue-800 border-blue-300' };
      case 'ADMIN_VERIFIED':
        return { label: 'Admin Verified', bg: 'bg-purple-50 text-purple-800 border-purple-300' };
      default:
        return { label: 'User Entered', bg: 'bg-amber-50 text-amber-800 border-amber-300' };
    }
  };

  const sourceBadge = getSourceBadge(application.statusSourceType);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-500">
              Application Tracker
            </span>
            {application.isDemo && (
              <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                DEMO DATA
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-800">
          {/* Demo disclaimer banner if demo application */}
          {application.isDemo && (
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Demo Application Record:</strong> This application is provided for demonstration purposes. It does not represent a real submission with the government.
              </span>
            </div>
          )}

          {/* Scheme and Reference */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-stone-900 leading-snug">
                {application.schemeName}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mt-1 font-mono">
                <span className="font-semibold text-stone-800">
                  Ref: {application.referenceNumber}
                </span>
                <span aria-hidden="true">·</span>
                <span>Submitted: {application.applicationDate}</span>
              </div>
            </div>

            {/* Check Latest Status Button */}
            <button
              onClick={handleRefreshStatus}
              disabled={isRefreshing}
              className="self-start sm:self-auto px-4 py-2 text-xs font-bold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl min-h-[44px] flex items-center gap-2 transition-colors shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-700' : ''}`} />
              <span>{isRefreshing ? 'Checking source...' : t.checkLatestStatus}</span>
            </button>
          </div>

          {/* Status highlight card */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-stone-500 uppercase block">
                Current Status
              </span>
              <div className="text-base font-extrabold text-stone-900 mt-0.5 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>{application.currentStatus.replace(/_/g, ' ')}</span>
              </div>
              <span className="text-xs text-stone-500 mt-1 block">
                Last checked: {application.lastChecked}
              </span>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-bold tracking-wider text-stone-500 uppercase block">
                Status Source
              </span>
              <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-lg border mt-1 ${sourceBadge.bg}`}>
                {sourceBadge.label}
              </span>
              <span className="text-[11px] text-stone-500 block mt-0.5 truncate max-w-[220px]">
                {application.statusSourceName}
              </span>
            </div>
          </div>

          {refreshMessage && (
            <div className="p-3 rounded-xl bg-stone-100 text-xs text-stone-800 border border-stone-200">
              {refreshMessage}
            </div>
          )}

          {/* "WHAT DO I DO NOW?" UX ADVICE BOX (Major UX feature from Section 20) */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
              <HelpCircle className="w-4 h-4 text-emerald-700" />
              <span>{t.whatDoIDoNowTitle}</span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed font-medium">
              {application.nextActionAdvice}
            </p>
          </div>

          {/* APPLICATION PROGRESS TIMELINE (Section 16) */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-stone-900">Application Progress Timeline</h3>
            <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200 pl-2">
              {application.timeline.map((event, idx) => {
                const isDone = event.isCompleted;
                const isCurrent = event.isCurrent;
                return (
                  <div key={event.id || idx} className="relative flex items-start gap-4">
                    {/* Timeline Node dot */}
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${
                        isDone
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-amber-500 border-amber-500 text-white animate-pulse'
                          : 'bg-white border-stone-300 text-stone-400'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : isCurrent ? (
                        <Clock className="w-4 h-4" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-stone-300" />
                      )}
                    </div>

                    {/* Timeline event details */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <h4 className={`font-bold ${isCurrent ? 'text-amber-950' : 'text-stone-900'}`}>
                          {event.label}
                        </h4>
                        <span className="text-[11px] font-mono text-stone-500">{event.date}</span>
                      </div>
                      <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                        {event.description}
                      </p>
                      <span className="text-[10px] text-stone-400 mt-1 block">
                        Source: {event.source}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* DEDICATED SANCTION STATUS SECTION (Section 18) */}
          <section className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  {t.sanctionStatusTitle}
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-800">
                {application.sanction.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Sanctioned Amount</span>
                <span className="font-bold text-stone-900 mt-0.5 block">
                  {application.sanction.amount || 'Pending Approval'}
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Sanction Date</span>
                <span className="font-semibold text-stone-800 mt-0.5 block">
                  {application.sanction.sanctionDate || 'In Review'}
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Sanction Reference</span>
                <span className="font-mono text-stone-700 mt-0.5 block truncate">
                  {application.sanction.sanctionReference || 'Awaiting Order'}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-stone-400 block">
              Sanctioning Authority: {application.sanction.source}
            </span>
          </section>

          {/* DEDICATED PAYMENT STATUS SECTION (Section 19) */}
          <section className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  {t.paymentStatusTitle}
                </h3>
              </div>
              <span className="text-xs font-bold text-sky-800">
                {application.payment.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Disbursement Amount</span>
                <span className="font-bold text-stone-900 mt-0.5 block">
                  {application.payment.amount || 'Calculated post-sanction'}
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Disbursement Date</span>
                <span className="font-semibold text-stone-800 mt-0.5 block">
                  {application.payment.paymentDate || 'Pending clearance'}
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Payment / FTO Reference</span>
                <span className="font-mono text-stone-700 mt-0.5 block truncate">
                  {application.payment.paymentReferenceMasked || 'Pending PFMS'}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-stone-400 block">
              Payment Gateway: {application.payment.source}
            </span>
          </section>

          {application.notes && (
            <div className="text-xs text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-200">
              <strong>Your Note:</strong> {application.notes}
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <a
            href={application.officialTrackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl min-h-[44px] flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span>Open Official Department Portal ↗</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200 rounded-xl min-h-[44px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
