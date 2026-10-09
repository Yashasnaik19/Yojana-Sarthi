import React, { useState } from 'react';
import {
  Scheme,
  TrackedApplication,
  LanguageCode,
} from '../types';
import { translations } from '../data/translations';
import { getOfficialTrackingUrl } from '../data/schemeLinks';
import {
  X,
  PlusCircle,
  ShieldCheck,
  Calendar,
  Building2,
  Lock,
  CheckCircle2,
} from 'lucide-react';

interface TrackApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  schemes: Scheme[];
  preselectedScheme?: Scheme | null;
  onAddApplication: (app: TrackedApplication) => void;
  language: LanguageCode;
}

export const TrackApplicationModal: React.FC<TrackApplicationModalProps> = ({
  isOpen,
  onClose,
  schemes,
  preselectedScheme,
  onAddApplication,
  language,
}) => {
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(
    preselectedScheme?.id || schemes[0]?.id || ''
  );
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [applicationDate, setApplicationDate] = useState<string>(
    new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  );
  const [portalApplied, setPortalApplied] = useState<string>('Official Government Portal');
  const [registeredPhone, setRegisteredPhone] = useState<string>('+91 98•••• 4120');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const t = translations[language];
  const targetScheme = schemes.find((s) => s.id === selectedSchemeId) || schemes[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceNumber.trim()) return;

    const newApp: TrackedApplication = {
      id: `app-${Date.now()}`,
      userId: 'user-active-citizen',
      schemeId: targetScheme.id,
      schemeName: targetScheme.name,
      ministry: targetScheme.ministry,
      referenceNumber: referenceNumber.trim().toUpperCase(),
      applicationDate,
      registeredPhoneMasked: registeredPhone,
      currentStatus: 'SUBMITTED',
      statusSourceType: 'USER_ENTERED',
      statusSourceName: `${portalApplied} (User added)`,
      officialTrackingUrl: targetScheme.officialTrackingUrl || getOfficialTrackingUrl(targetScheme.id),
      lastChecked: 'Just added',
      lastChanged: 'Just added',
      isDemo: false,
      benefitPreview: targetScheme.benefits,
      timeline: [
        {
          id: `t-${Date.now()}`,
          status: 'SUBMITTED',
          label: 'Application reference recorded',
          date: applicationDate,
          description: `Reference number ${referenceNumber.trim().toUpperCase()} added to Yojana Sarthi tracking.`,
          source: portalApplied,
          isCompleted: true,
          isCurrent: true,
        },
        {
          id: `t-${Date.now()}-2`,
          status: 'UNDER_VERIFICATION',
          label: 'Department verification',
          date: 'Pending',
          description: 'Awaiting desk & field scrutiny by the concerned department.',
          source: targetScheme.ministry,
          isCompleted: false,
          isCurrent: false,
        },
      ],
      sanction: {
        status: 'UNDER_CONSIDERATION',
        source: targetScheme.ministry,
      },
      payment: {
        status: 'PENDING',
        source: 'Public Financial Management System',
      },
      nextActionAdvice:
        'Your application reference has been registered. You can click "Check latest status" anytime or open the official tracking portal.',
      notes: notes.trim() || undefined,
    };

    onAddApplication(newApp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              +
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Track an Application</h2>
              <p className="text-xs text-stone-500">Add official reference number to follow progress</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security / Privacy Warning */}
        <div className="mx-6 mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
          <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Privacy & Security Protection:</strong> Never enter government portal passwords, OTPs, or bank PINs. Yojana Sarthi only needs your application reference number to provide tracking assistance.
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Select Scheme</label>
            <select
              value={selectedSchemeId}
              onChange={(e) => setSelectedSchemeId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              {schemes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.scope === 'STATE' ? s.state : 'Central'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Application / Reference Number <span className="text-emerald-700">*</span>
            </label>
            <input
              type="text"
              required
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="e.g. PMK-2026-458721 or SVN-2026-90214"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-mono uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Printed on your official acknowledgement slip or SMS receipt.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Application Date</label>
              <input
                type="text"
                value={applicationDate}
                onChange={(e) => setApplicationDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Where did you apply?</label>
              <select
                value={portalApplied}
                onChange={(e) => setPortalApplied(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
              >
                <option value="Official Department Portal">Official Portal (Online)</option>
                <option value="CSC / Common Service Centre">CSC / Village Centre (Offline)</option>
                <option value="Seva Sindhu / State Center">Seva Sindhu / State Portal</option>
                <option value="Bank Branch">Direct at Bank Branch</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Optional Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Applied via Canara Bank branch"
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl min-h-[44px] shadow-sm flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add to My Applications</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
