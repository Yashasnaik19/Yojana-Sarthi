import React, { useState } from 'react';
import {
  Scheme,
  SchemeUpdate,
  TrackedApplication,
  AdminRole,
  VerificationStatus,
  SchemeStatus,
} from '../types';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  PlusCircle,
  Edit3,
  Sparkles,
  BarChart3,
  Sliders,
  Send,
  Calendar,
  Layers,
  FileCheck2,
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  schemes: Scheme[];
  onSaveSchemes: (schemes: Scheme[]) => void;
  updates: SchemeUpdate[];
  onSaveUpdates: (updates: SchemeUpdate[]) => void;
  applications: TrackedApplication[];
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  onBroadcastNotification: (title: string, body: string, schemeName: string) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  schemes,
  onSaveSchemes,
  updates,
  onSaveUpdates,
  applications,
  isDemoMode,
  onToggleDemoMode,
  onBroadcastNotification,
}) => {
  const [adminRole, setAdminRole] = useState<AdminRole>('SUPER_ADMIN');
  const [activeTab, setActiveTab] = useState<'overview' | 'schemes' | 'updates' | 'applications'>('overview');

  // New update verification simulation
  const [summarizingId, setSummarizingId] = useState<string | null>(null);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [broadcastScheme, setBroadcastScheme] = useState(schemes[0]?.name || 'PM-KISAN');

  if (!isOpen) return null;

  const totalSchemes = schemes.length;
  const verifiedSchemes = schemes.filter((s) => s.verificationStatus === 'VERIFIED').length;
  const reviewNeeded = schemes.filter((s) => s.verificationStatus === 'NEEDS_REVIEW').length;
  const trackedCount = applications.length;

  const handleUpdateStatus = (schemeId: string, status: VerificationStatus) => {
    const updated = schemes.map((s) => {
      if (s.id === schemeId) {
        return {
          ...s,
          verificationStatus: status,
          lastVerified: '8 October 2026',
        };
      }
      return s;
    });
    onSaveSchemes(updated);
  };

  const handleApproveUpdate = (updateId: string) => {
    const updatedList = updates.map((u) => {
      if (u.id === updateId) {
        return {
          ...u,
          verificationStatus: 'VERIFIED' as const,
          verifiedAt: '8 October 2026',
        };
      }
      return u;
    });
    onSaveUpdates(updatedList);
  };

  const handleSummarizeWithAI = async (item: SchemeUpdate) => {
    setSummarizingId(item.id);
    try {
      const res = await fetch('/api/gemini/summarize-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schemeName: item.schemeName,
          rawUpdateText: item.rawSourceText || item.summary,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const updatedList = updates.map((u) => {
          if (u.id === item.id) {
            return {
              ...u,
              summary: data.summaryText || data.summary || u.summary,
            };
          }
          return u;
        });
        onSaveUpdates(updatedList);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSummarizingId(null);
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastBody.trim()) return;
    onBroadcastNotification(broadcastTitle.trim(), broadcastBody.trim(), broadcastScheme);
    setBroadcastTitle('');
    setBroadcastBody('');
    alert('Verified scheme notification broadcast to registered citizens!');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center font-bold">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">Yojana Sarthi Admin Portal</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                  v1.2-VERIFIED
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Official Scheme Verification & Citizen Alert Desk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Role Switcher */}
            <select
              value={adminRole}
              onChange={(e) => setAdminRole(e.target.value as AdminRole)}
              className="text-xs bg-stone-800 text-stone-200 border border-stone-700 rounded-lg px-2 py-1.5 focus:outline-none"
            >
              <option value="SUPER_ADMIN">Role: Super Admin</option>
              <option value="VERIFIER">Role: Scheme Verifier</option>
              <option value="EDITOR">Role: Content Editor</option>
              <option value="SUPPORT">Role: Citizen Support</option>
            </select>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close admin"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="px-6 py-2.5 bg-stone-100 border-b border-stone-200 flex items-center justify-between text-xs overflow-x-auto">
          <div className="flex items-center gap-1">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
              { id: 'schemes', label: 'Scheme Verification', icon: Layers },
              { id: 'updates', label: 'Change Pipeline', icon: RotateCw },
              { id: 'applications', label: 'Anonymized Stats', icon: FileCheck2 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 min-h-[36px] transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-emerald-950 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Demo / Production Switcher */}
          <button
            onClick={onToggleDemoMode}
            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 ${
              isDemoMode
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-emerald-50 text-emerald-900 border-emerald-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-amber-500' : 'bg-emerald-600'}`} />
            <span>{isDemoMode ? 'Demo Mode Active' : 'Live Mode Active'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-stone-800">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 uppercase">Total Schemes</span>
                  <div className="text-2xl font-black text-stone-900 mt-1">{totalSchemes}</div>
                  <span className="text-[10px] text-stone-400 mt-0.5 block">Central & State catalogs</span>
                </div>
                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase">Verified Active</span>
                  <div className="text-2xl font-black text-emerald-900 mt-1">{verifiedSchemes}</div>
                  <span className="text-[10px] text-emerald-700 mt-0.5 block">100% official portal linked</span>
                </div>
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 uppercase">Tracked Applications</span>
                  <div className="text-2xl font-black text-stone-900 mt-1">{trackedCount}</div>
                  <span className="text-[10px] text-stone-400 mt-0.5 block">Active tracking references</span>
                </div>
                <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200">
                  <span className="text-[11px] font-bold text-sky-800 uppercase">Verified Updates</span>
                  <div className="text-2xl font-black text-sky-900 mt-1">{updates.length}</div>
                  <span className="text-[10px] text-sky-700 mt-0.5 block">Monitored official feeds</span>
                </div>
              </div>

              {/* Broadcast notification card */}
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                  <Send className="w-4 h-4 text-emerald-700" />
                  <span>Broadcast Verified Scheme Notification</span>
                </div>
                <form onSubmit={handleSendBroadcast} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">Target Scheme</label>
                      <select
                        value={broadcastScheme}
                        onChange={(e) => setBroadcastScheme(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-300"
                      >
                        {schemes.map((s) => (
                          <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">Alert Title</label>
                      <input
                        type="text"
                        required
                        value={broadcastTitle}
                        onChange={(e) => setBroadcastTitle(e.target.value)}
                        placeholder="e.g. PM SVANidhi Application Window Extended"
                        className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">Notification Body</label>
                    <textarea
                      required
                      rows={2}
                      value={broadcastBody}
                      onChange={(e) => setBroadcastBody(e.target.value)}
                      placeholder="Brief verified explanation for citizen inboxes..."
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-300"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl min-h-[40px] flex items-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Verified Alert to Citizens</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: SCHEMES MANAGEMENT */}
          {activeTab === 'schemes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-700">Scheme Catalog Management</span>
                <span className="text-stone-500">{schemes.length} schemes loaded</span>
              </div>

              <div className="space-y-3">
                {schemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className="p-4 bg-white rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-bold text-stone-900">{scheme.name}</strong>
                        <span className="text-[10px] text-stone-500 font-mono">({scheme.scope})</span>
                      </div>
                      <p className="text-stone-500 text-[11px]">{scheme.ministry}</p>
                      <p className="text-stone-600 line-clamp-1">{scheme.benefits}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={scheme.verificationStatus}
                        onChange={(e) => handleUpdateStatus(scheme.id, e.target.value as VerificationStatus)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold border ${
                          scheme.verificationStatus === 'VERIFIED'
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                            : 'bg-amber-50 text-amber-900 border-amber-300'
                        }`}
                      >
                        <option value="VERIFIED">Status: VERIFIED</option>
                        <option value="NEEDS_REVIEW">Status: NEEDS REVIEW</option>
                        <option value="OUTDATED">Status: OUTDATED</option>
                        <option value="ARCHIVED">Status: ARCHIVED</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: UPDATES PIPELINE */}
          {activeTab === 'updates' && (
            <div className="space-y-4">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                <strong>Government Source Monitoring Pipeline:</strong> When official gazettes or portal changes are captured, administrators verify and publish with AI summarization support.
              </div>

              <div className="space-y-3">
                {updates.map((item) => (
                  <div key={item.id} className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">{item.title}</span>
                      <span className="text-[10px] font-mono text-stone-400">{item.publishedAt}</span>
                    </div>
                    <p className="text-stone-600 leading-relaxed">{item.summary}</p>
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100">
                      <span className="text-[11px] text-stone-400">Scheme: {item.schemeName}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSummarizeWithAI(item)}
                          disabled={summarizingId === item.id}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-lg text-xs flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3 text-emerald-700" />
                          <span>{summarizingId === item.id ? 'Summarizing...' : 'AI Summary'}</span>
                        </button>
                        <button
                          onClick={() => handleApproveUpdate(item.id)}
                          className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs"
                        >
                          Verify & Publish
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ANONYMIZED STATS */}
          {activeTab === 'applications' && (
            <div className="space-y-4">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                <strong>DPDP Privacy Guarantee:</strong> Administrator view only exposes anonymized scheme statistics and aggregate tracking milestones. No citizen passwords, Aadhaar, or financial secrets are recorded.
              </div>

              <div className="space-y-2 text-xs">
                {applications.map((app) => (
                  <div key={app.id} className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between">
                    <div>
                      <strong className="text-stone-900">{app.schemeName}</strong>
                      <div className="text-[11px] font-mono text-stone-400">
                        Ref: {app.referenceNumber} · {app.registeredPhoneMasked}
                      </div>
                    </div>
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {app.currentStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
