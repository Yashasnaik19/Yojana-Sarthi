import React from 'react';
import { NotificationItem, LanguageCode } from '../types';
import { translations } from '../data/translations';
import {
  X,
  Check,
  Bell,
  Clock,
  Sparkles,
  CreditCard,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onSelectApplicationById?: (appId: string) => void;
  language: LanguageCode;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onSelectApplicationById,
  language,
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'sanction':
        return <FileCheck className="w-4 h-4 text-emerald-600" />;
      case 'doc_required':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'deadline':
        return <Calendar className="w-4 h-4 text-rose-600" />;
      default:
        return <Bell className="w-4 h-4 text-sky-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/40 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl border-l border-stone-200 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-800" />
            <h2 className="text-base font-bold text-stone-900">Notifications</h2>
            <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
              {notifications.filter((n) => !n.read).length} new
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-xs text-stone-600 hover:text-emerald-800 font-medium py-1 px-2 hover:bg-stone-200 rounded-lg min-h-[36px]"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close notifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-100 p-2 sm:p-3 space-y-1">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-xs">
              No notifications yet. You are all caught up!
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onMarkRead(item.id);
                  if (item.applicationId && onSelectApplicationById) {
                    onSelectApplicationById(item.applicationId);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
                  item.read
                    ? 'bg-white hover:bg-stone-50 opacity-80'
                    : 'bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    {getNotificationIcon(item.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`text-xs ${item.read ? 'font-semibold text-stone-800' : 'font-bold text-stone-900'}`}>
                        {item.title}
                      </h3>
                      <span className="text-[10px] text-stone-400 shrink-0 font-mono">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {item.body}
                    </p>
                    {item.schemeName && (
                      <span className="text-[10px] text-emerald-800 font-semibold block mt-1">
                        Scheme: {item.schemeName}
                      </span>
                    )}
                  </div>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-2" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Channel preferences footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 text-xs text-stone-600 space-y-2">
          <span className="font-bold text-stone-800 block">Notification Channels</span>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-emerald-800 font-medium">
              ✓ In-App
            </span>
            <span className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-stone-600">
              ✓ SMS Alerts
            </span>
            <span className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-stone-600">
              ✓ WhatsApp Updates
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
