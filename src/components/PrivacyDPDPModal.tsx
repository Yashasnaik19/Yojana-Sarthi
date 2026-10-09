import React from 'react';
import { AppStorage } from '../services/storage';
import {
  X,
  ShieldCheck,
  Download,
  Trash2,
  Lock,
  FileText,
  AlertTriangle,
} from 'lucide-react';

interface PrivacyDPDPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataDeleted: () => void;
}

export const PrivacyDPDPModal: React.FC<PrivacyDPDPModalProps> = ({
  isOpen,
  onClose,
  onDataDeleted,
}) => {
  if (!isOpen) return null;

  const handleExportData = () => {
    const jsonStr = AppStorage.exportUserData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Yojana_Sarthi_Data_Export_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAll = () => {
    if (
      window.confirm(
        'Are you sure you want to delete all saved profile information, tracked applications, and bookmarks from this device? This action cannot be undone.'
      )
    ) {
      AppStorage.deleteAllUserData();
      onDataDeleted();
      onClose();
      alert('All local profile and application data has been permanently cleared.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-stone-900">Privacy & Data Rights (DPDP)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-stone-700 leading-relaxed">
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-medium">
            Yojana Sarthi follows India’s Digital Personal Data Protection (DPDP) framework. We adhere to purposeful collection, data minimization, and total citizen transparency.
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-stone-900 text-sm">1. What we collect</h3>
            <p>
              Only basic eligibility criteria you provide (occupation, state, district, broad income range, and requested support types) to calculate profile matches. We never collect bank account passwords, UPI PINs, Aadhaar OTPs, or biometric keys.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-stone-900 text-sm">2. Why we collect it</h3>
            <p>
              To discover matching government schemes and track application reference numbers that you deliberately provide.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-stone-900 text-sm">3. Independent Citizen Layer</h3>
            <p>
              Yojana Sarthi is an independent discovery and tracking tool. Official submissions and approvals are executed solely on the respective department portals.
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-stone-200 space-y-2.5">
            <button
              onClick={handleExportData}
              className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl flex items-center justify-center gap-2 min-h-[44px] transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              <span>Export My Data (JSON)</span>
            </button>

            <button
              onClick={handleDeleteAll}
              className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl flex items-center justify-center gap-2 min-h-[44px] transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete All My Data from Device</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
