import React from 'react';
import { Home, Compass, FileText, BellRing, User } from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../data/translations';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: LanguageCode;
  unreadNotifs: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setCurrentTab,
  language,
  unreadNotifs,
}) => {
  const t = translations[language];

  const tabs = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'schemes', label: t.navSchemes, icon: Compass },
    { id: 'applications', label: t.navApplications, icon: FileText },
    { id: 'updates', label: t.navUpdates, icon: BellRing, badge: unreadNotifs },
    { id: 'profile', label: t.navProfile, icon: User },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`relative flex flex-col items-center justify-center min-h-[44px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                isActive
                  ? 'text-emerald-800 font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-emerald-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight truncate max-w-[64px] ${isActive ? 'font-bold text-emerald-900' : 'font-medium'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 bg-emerald-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
