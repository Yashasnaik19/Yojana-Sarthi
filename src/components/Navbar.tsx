import React from 'react';
import {
  Bell,
  Globe,
  SlidersHorizontal,
  Sparkles,
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../data/translations';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  unreadNotifCount: number;
  onOpenNotifications: () => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  onOpenAdmin: () => void;
  onOpenPrivacy: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  unreadNotifCount,
  onOpenNotifications,
  isDemoMode,
  onToggleDemoMode,
  onOpenAdmin,
  onOpenPrivacy,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const t = translations[language];

  const navLinks = [
    { id: 'home', label: t.navHome },
    { id: 'schemes', label: t.navSchemes },
    { id: 'applications', label: t.navApplications },
    { id: 'updates', label: t.navUpdates },
    { id: 'profile', label: t.navProfile },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-md py-1"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            🌱
          </div>
          <div className="leading-tight">
            <span className="text-xl font-extrabold tracking-tight text-stone-900 block">
              Yojana Sarthi
            </span>
            <span className="text-[10px] text-emerald-800 font-medium block">
              {language === 'kn' ? 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಸೇತು' : language === 'hi' ? 'सरकारी योजना सहायक' : 'Civic Scheme Discovery'}
            </span>
          </div>
        </button>

        {/* Zone 2: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setCurrentTab(link.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap min-h-[36px] flex items-center ${
                  isActive
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Language, Demo Toggle, Notifications, Admin) */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="relative inline-flex items-center">
            <label htmlFor="language-select" className="sr-only">Select Language</label>
            <Globe className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 pointer-events-none" aria-hidden="true" />
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="pl-8 pr-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 text-xs font-semibold rounded-lg appearance-none cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none min-h-[40px]"
            >
              <option value="en">English</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>

          {/* Demo Mode Toggle Button */}
          <button
            onClick={onToggleDemoMode}
            title={isDemoMode ? 'Click to toggle to Production verification mode' : 'Click to enable Demo mode'}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors min-h-[40px] ${
              isDemoMode
                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isDemoMode ? 'bg-amber-500 animate-pulse' : 'bg-emerald-600'
              }`}
            />
            <span className="font-semibold">{isDemoMode ? 'Demo Mode' : 'Live Sync'}</span>
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={onOpenNotifications}
            aria-label={`View notifications, ${unreadNotifCount} unread`}
            className="relative p-2 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
          >
            <Bell className="w-5 h-5" aria-hidden="true" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-75">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {/* Admin Portal Button */}
          <button
            onClick={onOpenAdmin}
            title="Open SchemeSaathi Admin Console"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg min-h-[40px] transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
            <span>Admin</span>
          </button>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:bg-stone-100 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drop-down drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 py-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-stone-100">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-3 text-left text-xs font-semibold rounded-lg min-h-[44px] flex items-center ${
                  currentTab === link.id
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'text-stone-700 bg-stone-50 hover:bg-stone-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => {
                onToggleDemoMode();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-medium text-stone-700 flex items-center gap-1.5 py-1.5"
            >
              <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-amber-500' : 'bg-emerald-600'}`} />
              <span>{isDemoMode ? 'Switch to Live Mode' : 'Switch to Demo Mode'}</span>
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-stone-700 font-semibold px-2 py-1 bg-stone-100 rounded"
              >
                Admin
              </button>
              <button
                onClick={() => {
                  onOpenPrivacy();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-stone-600 font-medium px-2 py-1 bg-stone-50 rounded"
              >
                DPDP Privacy
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
