import {
  UserProfile,
  TrackedApplication,
  SchemeUpdate,
  NotificationItem,
  Scheme,
  LanguageCode
} from '../types';
import { SEED_SCHEMES } from '../data/seedSchemes';
import { SEED_APPLICATIONS } from '../data/seedApplications';
import { SEED_UPDATES } from '../data/seedUpdates';
import { SEED_NOTIFICATIONS } from '../data/seedNotifications';

const STORAGE_KEYS = {
  PROFILE: 'schemesaathi_profile_v1',
  APPLICATIONS: 'schemesaathi_applications_v1',
  SAVED_SCHEMES: 'schemesaathi_saved_v1',
  UPDATES: 'schemesaathi_updates_v1',
  NOTIFICATIONS: 'schemesaathi_notifications_v1',
  SCHEMES_CUSTOM: 'schemesaathi_schemes_v1',
  DEMO_MODE: 'schemesaathi_demo_mode_v1',
  LANGUAGE: 'schemesaathi_language_v1',
};

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Ramesh Naik',
  phoneMasked: '+91 98•••• 4120',
  language: 'en',
  age: 42,
  gender: 'male',
  state: 'Karnataka',
  district: 'Belagavi',
  pincode: '590001',
  areaType: 'rural',
  userTypes: ['farmer'],
  incomeRange: '1_to_2_lakh',
  needs: ['agriculture', 'financial', 'insurance'],
  farmerDetails: {
    landOwned: true,
    landSizeAcres: 2.5,
    cropType: 'Paddy & Sugarcane',
    irrigation: true,
    farmingActivity: 'Cultivation',
  },
  notificationPreferences: {
    inApp: true,
    sms: true,
    push: true,
    whatsapp: true,
  },
  onboardingCompleted: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export class AppStorage {
  static getLanguage(): LanguageCode {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (saved === 'kn' || saved === 'hi' || saved === 'en') return saved;
    return 'en';
  }

  static setLanguage(lang: LanguageCode): void {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  }

  static getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load profile:', e);
    }
    return DEFAULT_PROFILE;
  }

  static saveProfile(profile: UserProfile): void {
    profile.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }

  static getDemoMode(): boolean {
    const saved = localStorage.getItem(STORAGE_KEYS.DEMO_MODE);
    if (saved === null) return true; // Default to demo mode for initial prototype
    return saved === 'true';
  }

  static setDemoMode(val: boolean): void {
    localStorage.setItem(STORAGE_KEYS.DEMO_MODE, String(val));
  }

  static getApplications(): TrackedApplication[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load applications:', e);
    }
    return SEED_APPLICATIONS;
  }

  static saveApplications(apps: TrackedApplication[]): void {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
  }

  static addApplication(newApp: TrackedApplication): void {
    const apps = this.getApplications();
    const updated = [newApp, ...apps];
    this.saveApplications(updated);
  }

  static updateApplication(updatedApp: TrackedApplication): void {
    const apps = this.getApplications();
    const index = apps.findIndex((a) => a.id === updatedApp.id);
    if (index !== -1) {
      apps[index] = updatedApp;
      this.saveApplications([...apps]);
    }
  }

  static getSavedSchemeIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_SCHEMES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load saved schemes:', e);
    }
    return ['pm-kisan', 'pm-svanidhi'];
  }

  static toggleSavedScheme(schemeId: string): boolean {
    const saved = this.getSavedSchemeIds();
    const index = saved.indexOf(schemeId);
    let isNowSaved = false;
    if (index > -1) {
      saved.splice(index, 1);
      isNowSaved = false;
    } else {
      saved.push(schemeId);
      isNowSaved = true;
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_SCHEMES, JSON.stringify(saved));
    return isNowSaved;
  }

  static getSchemes(): Scheme[] {
    try {
      const custom = localStorage.getItem(STORAGE_KEYS.SCHEMES_CUSTOM);
      if (custom) return JSON.parse(custom);
    } catch (e) {
      console.error('Failed to load schemes:', e);
    }
    return SEED_SCHEMES;
  }

  static saveSchemes(schemes: Scheme[]): void {
    localStorage.setItem(STORAGE_KEYS.SCHEMES_CUSTOM, JSON.stringify(schemes));
  }

  static getUpdates(): SchemeUpdate[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.UPDATES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load updates:', e);
    }
    return SEED_UPDATES;
  }

  static saveUpdates(updates: SchemeUpdate[]): void {
    localStorage.setItem(STORAGE_KEYS.UPDATES, JSON.stringify(updates));
  }

  static getNotifications(): NotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load notifications:', e);
    }
    return SEED_NOTIFICATIONS;
  }

  static saveNotifications(notifs: NotificationItem[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  }

  static markNotificationRead(id: string): void {
    const list = this.getNotifications();
    const item = list.find((n) => n.id === id);
    if (item) {
      item.read = true;
      this.saveNotifications(list);
    }
  }

  static markAllNotificationsRead(): void {
    const list = this.getNotifications().map((n) => ({ ...n, read: true }));
    this.saveNotifications(list);
  }

  static addNotification(item: NotificationItem): void {
    const list = this.getNotifications();
    this.saveNotifications([item, ...list]);
  }

  // DPDP compliant: export user data
  static exportUserData(): string {
    const payload = {
      exportedAt: new Date().toISOString(),
      platform: 'Yojana Sarthi Independent Portal',
      profile: this.getProfile(),
      applications: this.getApplications(),
      savedSchemeIds: this.getSavedSchemeIds(),
      notifications: this.getNotifications(),
    };
    return JSON.stringify(payload, null, 2);
  }

  // DPDP compliant: complete deletion of user data
  static deleteAllUserData(): void {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.SAVED_SCHEMES);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  }
}
