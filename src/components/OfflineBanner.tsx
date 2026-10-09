import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../data/translations';

interface OfflineBannerProps {
  language: LanguageCode;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ language }) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  const t = translations[language];

  return (
    <aside aria-label="Offline status banner" className="bg-amber-600 text-white px-4 py-2 text-xs font-medium sticky top-0 z-50 shadow-md flex items-center justify-center gap-2">
      <WifiOff className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span>{t.offlineNotice}</span>
    </aside>
  );
};
