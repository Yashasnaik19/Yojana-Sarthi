import React, { useState } from 'react';
import {
  UserProfile,
  LanguageCode,
  UserType,
  NeedCategory,
} from '../types';
import { translations } from '../data/translations';
import {
  X,
  Mic,
  MicOff,
  Sparkles,
  Search,
  Loader2,
  Check,
  Wheat,
  ShoppingBag,
  GraduationCap,
  Scissors,
} from 'lucide-react';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyParsedProfile: (partial: Partial<UserProfile>) => void;
  language: LanguageCode;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onApplyParsedProfile,
  language,
}) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [parseResult, setParseResult] = useState<any>(null);

  if (!isOpen) return null;

  const t = translations[language];

  const samplePrompts = [
    { text: 'I am a farmer with 2 acres in Karnataka looking for agriculture assistance and loan', icon: '🌾' },
    { text: 'I am a street vendor in city needing working capital loan of ₹10,000 to ₹50,000', icon: '🛒' },
    { text: 'College student looking for post-matric higher education scholarship', icon: '🎓' },
    { text: 'Traditional artisan carpenter needing modern tools and business support', icon: '🧵' },
  ];

  const handleStartListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not natively supported in this browser. Please type your query in the box below.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'kn' ? 'kn-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);

    recognition.onresult = (event: any) => {
      const speechText = event.results[0][0].transcript;
      setQuery(speechText);
      setIsListening(false);
      handleProcessQuery(speechText);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleProcessQuery = async (customQuery?: string) => {
    const q = customQuery || query;
    if (!q.trim()) return;

    setIsLoading(true);
    setParseResult(null);

    try {
      const res = await fetch('/api/gemini/voice-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, language }),
      });
      if (res.ok) {
        const data = await res.json();
        setParseResult(data.parsed);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyResult = () => {
    if (!parseResult) return;

    const partial: Partial<UserProfile> = {};
    if (parseResult.occupation) {
      partial.userTypes = [parseResult.occupation as UserType];
    }
    if (parseResult.state && parseResult.state !== 'All') {
      partial.state = parseResult.state;
    }
    if (parseResult.needs && Array.isArray(parseResult.needs)) {
      partial.needs = parseResult.needs as NeedCategory[];
    }

    onApplyParsedProfile(partial);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-stone-900">Voice & Natural Scheme Finder</h2>
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
        <div className="p-6 space-y-5">
          <p className="text-xs text-stone-600 leading-relaxed">
            Tell us about your work and what help you need in your own words (e.g., <em>"I am a farmer with 2 acres in Karnataka looking for crop insurance"</em>).
          </p>

          {/* Voice Input Section */}
          <div className="flex flex-col items-center justify-center p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <button
              onClick={isListening ? () => setIsListening(false) : handleStartListening}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all min-h-[44px] min-w-[44px] shadow-md ${
                isListening
                  ? 'bg-rose-600 text-white animate-bounce ring-4 ring-rose-200'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
              aria-label={isListening ? 'Stop listening' : 'Start speaking'}
            >
              {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
            </button>
            <span className="text-xs font-semibold text-stone-700">
              {isListening ? 'Listening to your voice... Speak now' : 'Tap microphone to speak'}
            </span>
          </div>

          {/* Or text box */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700">
              Or type your requirement:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Street vendor needing loan"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              />
              <button
                onClick={() => handleProcessQuery()}
                disabled={isLoading || !query.trim()}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl min-h-[44px] flex items-center gap-1 shadow-xs"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Analyze</span>
              </button>
            </div>
          </div>

          {/* Sample prompts */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-stone-500 uppercase">Try quick examples</span>
            <div className="space-y-1.5">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(p.text);
                    handleProcessQuery(p.text);
                  }}
                  className="w-full p-2.5 text-left text-xs bg-white hover:bg-stone-50 border border-stone-200 rounded-xl text-stone-700 flex items-center gap-2 transition-colors min-h-[44px]"
                >
                  <span className="text-base shrink-0">{p.icon}</span>
                  <span className="truncate">{p.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Parsed Result Display */}
          {parseResult && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                <span>Matched Criteria Found</span>
                <span className="text-emerald-700">Ready to filter</span>
              </div>
              <div className="text-xs text-stone-700 space-y-1">
                <div><strong>Detected Occupation:</strong> {parseResult.occupation}</div>
                <div><strong>State:</strong> {parseResult.state || 'All States'}</div>
                <div><strong>Needs:</strong> {parseResult.needs?.join(', ')}</div>
              </div>

              <button
                onClick={handleApplyResult}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl min-h-[44px] flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Show Matching Schemes</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
