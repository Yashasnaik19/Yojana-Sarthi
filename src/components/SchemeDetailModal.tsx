import React, { useState } from 'react';
import {
  Scheme,
  LanguageCode,
  UserProfile,
} from '../types';
import { translations } from '../data/translations';
import { calculateSchemeMatch } from '../services/matchEngine';
import { ADMIN_SUPPORT_EMAIL } from '../data/schemeLinks';
import {
  X,
  ExternalLink,
  Bookmark,
  CheckCircle2,
  Building2,
  FileCheck2,
  Sparkles,
  HelpCircle,
  Phone,
  Mail,
  ShieldCheck,
  PlusCircle,
  Volume2,
  Loader2,
  Clock,
  Flag,
} from 'lucide-react';

interface SchemeDetailModalProps {
  scheme: Scheme | null;
  onClose: () => void;
  profile: UserProfile;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenTrackModal: (scheme: Scheme) => void;
  language: LanguageCode;
}

export const SchemeDetailModal: React.FC<SchemeDetailModalProps> = ({
  scheme,
  onClose,
  profile,
  isSaved,
  onToggleSave,
  onOpenTrackModal,
  language,
}) => {
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [simplifiedExplanation, setSimplifiedExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  if (!scheme) return null;

  const t = translations[language];
  const matchResult = calculateSchemeMatch(scheme, profile);

  const toggleDoc = (doc: string) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [doc]: !prev[doc],
    }));
  };

  const handleExplainWithGemini = async () => {
    setIsExplaining(true);
    try {
      const res = await fetch('/api/gemini/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schemeName: scheme.name,
          benefits: scheme.benefits,
          eligibility: scheme.eligibilitySummary,
          language,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSimplifiedExplanation(data.explanation);
      } else {
        setSimplifiedExplanation(
          `Simplified view: This program is managed by ${scheme.ministry}. You receive ${scheme.benefits} if you fulfill the published requirements (${scheme.eligibilitySummary}). Next step: Prepare your ID and apply directly on the official portal.`
        );
      }
    } catch (e) {
      setSimplifiedExplanation(
        `Simplified view: This program is managed by ${scheme.ministry}. You receive ${scheme.benefits} if you fulfill the published requirements (${scheme.eligibilitySummary}). Next step: Prepare your ID and apply directly on the official portal.`
      );
    } finally {
      setIsExplaining(false);
    }
  };

  const handlePlayAudio = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }

      const textToRead = simplifiedExplanation || `${scheme.name}. ${scheme.shortDescription}. Benefits: ${scheme.benefits}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-stone-500 truncate">
            <span className="font-semibold text-stone-800">{scheme.category}</span>
            <span aria-hidden="true">·</span>
            <span>{scheme.scope === 'STATE' ? `${scheme.state} State` : 'Central Govt'}</span>
            {scheme.linksLastChecked && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-stone-600 font-medium">
                  Links last checked: {scheme.linksLastChecked}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onToggleSave(scheme.id)}
              className="p-2 text-stone-500 hover:text-emerald-800 rounded-lg hover:bg-stone-200 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
              aria-label={isSaved ? 'Saved' : 'Save'}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-emerald-700 text-emerald-700' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-200 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-800">
          {/* Header Title & Ministry */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
              {scheme.name}
            </h2>
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-stone-400 shrink-0" />
              <span>{scheme.ministry}</span>
              {scheme.department && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{scheme.department}</span>
                </>
              )}
            </p>
          </div>

          {/* Profile Match Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-emerald-950">
                {matchResult.score}% Profile Match
              </span>
              <span className="text-xs font-semibold text-emerald-800">
                Based on your preferences
              </span>
            </div>
            <div className="w-full bg-emerald-200/80 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-700 h-2 rounded-full"
                style={{ width: `${matchResult.score}%` }}
              />
            </div>
            <div className="pt-1 text-xs text-emerald-900 space-y-1">
              <span className="font-semibold block">Why did we recommend this?</span>
              <ul className="list-disc list-inside space-y-0.5 text-stone-700">
                {matchResult.reasons.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
            <p className="text-[11px] text-emerald-800/80 italic pt-1 border-t border-emerald-200/60">
              {t.profileMatchDisclaimer}
            </p>
          </div>

          {/* AI Plain Language Assistant / Voice audio button */}
          <div className="p-4 rounded-2xl bg-stone-100/80 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-stone-900">
                  Plain-Language Explainer
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayAudio}
                  title="Read aloud in clear voice"
                  className="px-2.5 py-1 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 min-h-[36px] flex items-center gap-1.5"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'text-emerald-600 animate-pulse' : ''}`} />
                  <span>{isPlayingAudio ? 'Stop Voice' : 'Listen'}</span>
                </button>
                <button
                  onClick={handleExplainWithGemini}
                  disabled={isExplaining}
                  className="px-3 py-1 text-xs font-semibold text-emerald-900 bg-white border border-emerald-300 hover:bg-emerald-50 rounded-lg min-h-[36px] flex items-center gap-1.5 shadow-2xs"
                >
                  {isExplaining ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Simplifying...</span>
                    </>
                  ) : (
                    <span>Explain in plain words</span>
                  )}
                </button>
              </div>
            </div>
            {simplifiedExplanation ? (
              <div className="p-3 bg-white rounded-xl text-xs text-stone-800 leading-relaxed border border-stone-200 whitespace-pre-line">
                {simplifiedExplanation}
              </div>
            ) : (
              <p className="text-xs text-stone-500">
                Need simplified terms without bureaucratic wording? Tap the button above to generate a verified, plain explanation.
              </p>
            )}
          </div>

          {/* What is this? */}
          <section className="space-y-1.5">
            <h3 className="text-sm font-bold text-stone-900">What is this scheme?</h3>
            <p className="text-xs text-stone-700 leading-relaxed">
              {scheme.longDescription}
            </p>
          </section>

          {/* What can you get? (Benefits) */}
          <section className="space-y-1.5 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
              What can you get? (Benefits)
            </h3>
            <p className="text-sm font-semibold text-emerald-900 leading-snug">
              {scheme.benefits}
            </p>
          </section>

          {/* Who is it for & Eligibility */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-stone-900">Eligibility criteria</h3>
            <p className="text-xs text-stone-600 italic">
              {scheme.eligibilitySummary}
            </p>
            <ul className="space-y-1.5 text-xs text-stone-700 mt-2">
              {scheme.eligibilityBullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Documents Usually Required (Interactive Checklist) */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900">Documents usually required</h3>
              <span className="text-[11px] text-stone-500">Check off what you have ready</span>
            </div>
            <div className="space-y-2">
              {scheme.documentsRequired.map((doc, idx) => {
                const isChecked = Boolean(checkedDocs[doc]);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleDoc(doc)}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-colors min-h-[44px] flex items-center justify-between gap-3 ${
                      isChecked
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-emerald-700 border-emerald-700 text-white' : 'border-stone-300 bg-white'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span>{doc}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {isChecked ? 'Ready' : 'Needed'}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-stone-500">
              * Document rules can be updated by the department. Always verify on the official portal before final submission.
            </p>
          </section>

          {/* Step-by-Step Application Guide */}
          <section className="space-y-2.5">
            <h3 className="text-sm font-bold text-stone-900">How to apply (Step-by-step)</h3>
            <div className="space-y-2">
              {scheme.applicationProcess.map((stepText, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 leading-relaxed">
                  {stepText}
                </div>
              ))}
            </div>
          </section>

          {/* Official Helplines & Verified Source Links */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs text-stone-600">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-bold text-stone-800">Official Portal & Assistance</span>
              <span className="text-[11px] text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-medium">
                Always confirm details on the official portal before applying.
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={scheme.officialApplicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-2 py-1 min-h-[36px]"
              >
                <span>Official Application Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {scheme.officialInformationUrl && (
                <a
                  href={scheme.officialInformationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-stone-700 hover:text-stone-900 underline underline-offset-2 py-1 min-h-[36px]"
                >
                  <span>Official Scheme Guidelines / Information</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div className="flex flex-wrap gap-4 pt-1">
              {scheme.helplineNumber && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-500" />
                  <span>Helpline: <strong className="text-stone-800">{scheme.helplineNumber}</strong></span>
                </div>
              )}
              {scheme.helplineEmail && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-stone-500" />
                  <span>Email: <strong className="text-stone-800">{scheme.helplineEmail}</strong></span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
              <span className="text-stone-500">
                Source: {scheme.verificationSource}{scheme.linksLastChecked ? ` · Links last checked: ${scheme.linksLastChecked}` : ''}
              </span>

              <a
                href={`mailto:${ADMIN_SUPPORT_EMAIL}?subject=${encodeURIComponent(`Report broken link: ${scheme.name}`)}&body=${encodeURIComponent(`Hello Yojana Sarthi Team,\n\nI noticed an issue with the link for:\nScheme: ${scheme.name} (ID: ${scheme.id})\nApplication URL: ${scheme.officialApplicationUrl}\nInformation URL: ${scheme.officialInformationUrl}\n\nIssue details:\n`)}`}
                className="inline-flex items-center gap-1 text-rose-700 hover:text-rose-900 font-semibold py-1 shrink-0"
                title="Report broken link to administrator"
              >
                <Flag className="w-3 h-3 text-rose-600" />
                <span>Report a broken link</span>
              </a>
            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Actions */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onOpenTrackModal(scheme);
            }}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-stone-800 bg-white border border-stone-300 hover:bg-stone-100 rounded-xl min-h-[44px] flex items-center justify-center gap-2 transition-colors shadow-2xs"
          >
            <PlusCircle className="w-4 h-4 text-emerald-700" />
            <span>I have applied (+ Track status)</span>
          </button>

          <a
            href={scheme.officialApplicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl min-h-[44px] flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span>Open Official Application Portal ↗</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
