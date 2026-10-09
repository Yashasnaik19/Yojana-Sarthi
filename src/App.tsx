import React, { useState, useEffect, useMemo } from 'react';
import {
  UserProfile,
  Scheme,
  TrackedApplication,
  SchemeUpdate,
  NotificationItem,
  LanguageCode,
  UserType,
} from './types';
import { translations } from './data/translations';
import { AppStorage, DEFAULT_PROFILE } from './services/storage';
import { rankSchemesForProfile } from './services/matchEngine';

// Components
import { CivicDisclaimer } from './components/CivicDisclaimer';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { SchemeCard } from './components/SchemeCard';
import { SchemeDetailModal } from './components/SchemeDetailModal';
import { TrackApplicationModal } from './components/TrackApplicationModal';
import { ApplicationCard } from './components/ApplicationCard';
import { ApplicationDetailModal } from './components/ApplicationDetailModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { OnboardingModal } from './components/OnboardingModal';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { PrivacyDPDPModal } from './components/PrivacyDPDPModal';
import { OfflineBanner } from './components/OfflineBanner';

// Icons
import {
  Search,
  Mic,
  Sparkles,
  Bookmark,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileText,
  UserCheck,
  Calendar,
  Layers,
  ArrowRight,
  SlidersHorizontal,
  RefreshCw,
  BellRing,
} from 'lucide-react';

export default function App() {
  // App state
  const [language, setLanguageState] = useState<LanguageCode>(() => AppStorage.getLanguage());
  const [profile, setProfileState] = useState<UserProfile>(() => AppStorage.getProfile());
  const [schemes, setSchemesState] = useState<Scheme[]>(() => AppStorage.getSchemes());
  const [applications, setApplicationsState] = useState<TrackedApplication[]>(() => AppStorage.getApplications());
  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>(() => AppStorage.getSavedSchemeIds());
  const [updates, setUpdatesState] = useState<SchemeUpdate[]>(() => AppStorage.getUpdates());
  const [notifications, setNotificationsState] = useState<NotificationItem[]>(() => AppStorage.getNotifications());
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => AppStorage.getDemoMode());

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedUserTypeFilter, setSelectedUserTypeFilter] = useState<string>('all');
  const [selectedScopeFilter, setSelectedScopeFilter] = useState<string>('all');
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
  const [applicationStatusFilter, setApplicationStatusFilter] = useState<string>('all');

  // Modals & Drawers
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [selectedSchemeForModal, setSelectedSchemeForModal] = useState<Scheme | null>(null);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState<boolean>(false);
  const [preselectedSchemeForTrack, setPreselectedSchemeForTrack] = useState<Scheme | null>(null);
  const [selectedAppForDetail, setSelectedAppForDetail] = useState<TrackedApplication | null>(null);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState<boolean>(false);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);

  const t = translations[language];

  // Sync language changes to storage
  const handleSetLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    AppStorage.setLanguage(lang);
  };

  // Sync profile changes
  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfileState(newProfile);
    AppStorage.saveProfile(newProfile);
  };

  // Toggle demo mode
  const handleToggleDemoMode = () => {
    const nextVal = !isDemoMode;
    setIsDemoMode(nextVal);
    AppStorage.setDemoMode(nextVal);
  };

  // Bookmark scheme
  const handleToggleSaveScheme = (id: string) => {
    AppStorage.toggleSavedScheme(id);
    setSavedSchemeIds(AppStorage.getSavedSchemeIds());
  };

  // Add application
  const handleAddApplication = (newApp: TrackedApplication) => {
    AppStorage.addApplication(newApp);
    setApplicationsState(AppStorage.getApplications());
    // Auto add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Application Added to Tracking',
      body: `Tracking reference ${newApp.referenceNumber} for ${newApp.schemeName} has been saved.`,
      schemeName: newApp.schemeName,
      applicationId: newApp.id,
      type: 'status_changed',
      read: false,
      timestamp: 'Just now',
    };
    AppStorage.addNotification(newNotif);
    setNotificationsState(AppStorage.getNotifications());
  };

  // Update application (e.g. from refresh)
  const handleUpdateApplication = (updatedApp: TrackedApplication) => {
    AppStorage.updateApplication(updatedApp);
    setApplicationsState(AppStorage.getApplications());
    setSelectedAppForDetail(updatedApp);
  };

  // Schemes ranking using Deterministic Match Engine
  const rankedSchemes = useMemo(() => {
    return rankSchemesForProfile(schemes, profile);
  }, [schemes, profile]);

  // Filtered schemes for catalog tab
  const filteredSchemes = useMemo(() => {
    return rankedSchemes.filter(({ scheme }) => {
      // Search term
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = scheme.name.toLowerCase().includes(q);
        const matchesDesc = scheme.shortDescription.toLowerCase().includes(q);
        const matchesCat = scheme.category.toLowerCase().includes(q);
        const matchesBenefits = scheme.benefits.toLowerCase().includes(q);
        const matchesMinistry = scheme.ministry.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat && !matchesBenefits && !matchesMinistry) {
          return false;
        }
      }

      // User Type filter
      if (selectedUserTypeFilter !== 'all') {
        if (!scheme.targetGroups.includes(selectedUserTypeFilter as UserType) && !scheme.targetGroups.includes('other')) {
          return false;
        }
      }

      // Scope filter
      if (selectedScopeFilter === 'central' && scheme.scope !== 'CENTRAL') return false;
      if (selectedScopeFilter === 'state' && scheme.scope !== 'STATE') return false;

      // Saved only
      if (showSavedOnly && !savedSchemeIds.includes(scheme.id)) return false;

      return true;
    });
  }, [rankedSchemes, searchQuery, selectedUserTypeFilter, selectedScopeFilter, showSavedOnly, savedSchemeIds]);

  // Filtered applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (applicationStatusFilter === 'sanctioned') {
        return app.currentStatus === 'SANCTIONED' || app.currentStatus === 'APPROVED';
      }
      if (applicationStatusFilter === 'action') {
        return app.currentStatus === 'DOCUMENTS_REQUIRED' || app.currentStatus === 'PAYMENT_FAILED';
      }
      if (applicationStatusFilter === 'active') {
        return app.currentStatus !== 'PAYMENT_RELEASED' && app.currentStatus !== 'EXPIRED';
      }
      return true;
    });
  }, [applications, applicationStatusFilter]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans pb-20 md:pb-8">
      {/* Offline Alert Bar */}
      <OfflineBanner language={language} />

      {/* Official Platform Disclaimer (Independent service notice) */}
      <CivicDisclaimer language={language} />

      {/* Top Navigation Bar (Strict Top Bar Contract) */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={handleSetLanguage}
        unreadNotifCount={unreadCount}
        onOpenNotifications={() => setIsNotifDrawerOpen(true)}
        isDemoMode={isDemoMode}
        onToggleDemoMode={handleToggleDemoMode}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* MAIN VIEW CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* ==================== TAB: HOME ==================== */}
        {currentTab === 'home' && (
          <div className="space-y-8">
            {/* HERO SECTION */}
            <section className="relative overflow-hidden rounded-3xl bg-stone-900 text-white shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                {/* Text Content */}
                <div className="lg:col-span-7 p-6 sm:p-10 z-10 space-y-5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-emerald-200 text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      Namaste, {profile.name || 'Citizen'}
                    </span>
                    <span className="text-stone-400 text-xs font-medium">
                      {profile.state} · {profile.district}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white max-w-xl">
                    {t.heroHeadline}
                  </h1>

                  <p className="text-xs sm:text-sm text-stone-300 max-w-lg leading-relaxed">
                    {t.heroSubheadline}
                  </p>

                  {/* Primary CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => setIsOnboardingOpen(true)}
                      className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl min-h-[44px] flex items-center gap-2 transition-all shadow-md active:scale-95"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{t.findSchemesBtn}</span>
                    </button>

                    <button
                      onClick={() => setCurrentTab('schemes')}
                      className="px-5 py-3 bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs sm:text-sm font-semibold rounded-xl min-h-[44px] border border-stone-700 flex items-center gap-1.5 transition-all"
                    >
                      <span>{t.browseSchemesBtn}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setPreselectedSchemeForTrack(null);
                        setIsTrackModalOpen(true);
                      }}
                      className="px-4 py-3 bg-stone-800/80 hover:bg-stone-700 text-emerald-300 text-xs sm:text-sm font-semibold rounded-xl min-h-[44px] border border-emerald-900/60 flex items-center gap-1.5 transition-all"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>{t.trackAppBtn}</span>
                    </button>
                  </div>
                </div>

                {/* Hero Authentic Documentary Photo */}
                <div className="lg:col-span-5 h-64 sm:h-80 lg:h-full relative overflow-hidden">
                  <img
                    src="/src/assets/images/schemesaathi_hero_citizens_1791480609650.jpg"
                    alt="Indian citizens using SchemeSaathi in a community village"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent lg:bg-gradient-to-r lg:from-stone-900 lg:to-transparent" />
                </div>
              </div>
            </section>

            {/* QUICK SEARCH & VOICE BAR */}
            <section className="bg-white p-3 sm:p-4 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-stone-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:bg-white"
                  />
                </div>

                <button
                  onClick={() => setIsVoiceSearchOpen(true)}
                  title={t.voiceSearchTooltip}
                  className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-xl min-h-[44px] flex items-center gap-1.5 font-bold text-xs transition-colors shrink-0"
                >
                  <Mic className="w-4 h-4 text-emerald-700" />
                  <span className="hidden sm:inline">Voice Assistant</span>
                </button>
              </div>

              {/* Quick user role selector tabs */}
              <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-stone-100 overflow-x-auto text-xs pb-1">
                <span className="text-[11px] font-bold text-stone-400 uppercase shrink-0 mr-1">
                  For:
                </span>
                {[
                  { id: 'all', label: 'All Citizens' },
                  { id: 'farmer', label: '🌾 Farmers' },
                  { id: 'worker', label: '👷 Workers' },
                  { id: 'street_vendor', label: '🛒 Vendors' },
                  { id: 'student', label: '🎓 Students' },
                  { id: 'artisan', label: '🧵 Artisans' },
                  { id: 'business', label: '🏪 MSME' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedUserTypeFilter(item.id);
                      if ((currentTab as string) !== 'schemes') setCurrentTab('schemes');
                    }}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold min-h-[36px] transition-colors ${
                      selectedUserTypeFilter === item.id
                        ? 'bg-emerald-800 text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>

            {/* SECTION 1: RECOMMENDED FOR YOU */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight">
                    {t.recommendedSection}
                  </h2>
                  <p className="text-xs text-stone-500">
                    Matched to your profile: {profile.userTypes.join(', ')} · {profile.state} · {profile.incomeRange.replace(/_/g, ' ')}
                  </p>
                </div>
                <button
                  onClick={() => setIsOnboardingOpen(true)}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 self-start sm:self-auto py-1"
                >
                  <span>Update your profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rankedSchemes.slice(0, 3).map(({ scheme, score, reasons }) => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    matchScore={score}
                    matchReasons={reasons}
                    isSaved={savedSchemeIds.includes(scheme.id)}
                    onToggleSave={handleToggleSaveScheme}
                    onOpenDetails={(s) => setSelectedSchemeForModal(s)}
                    language={language}
                  />
                ))}
              </div>
            </section>

            {/* SECTION 2: APPLICATION STATUS HIGHLIGHTS */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight">
                    {t.applicationUpdatesSection}
                  </h2>
                  <p className="text-xs text-stone-500">
                    Follow the journey: Submitted → Verification → Sanction → Payment
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('applications')}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                >
                  <span>View all ({applications.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {applications.slice(0, 3).map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onOpenDetails={(a) => setSelectedAppForDetail(a)}
                    language={language}
                  />
                ))}
              </div>
            </section>

            {/* SECTION 3: RECENTLY VERIFIED SCHEMES & DEADLINES */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Approaching deadlines */}
              <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-stone-900">{t.deadlinesSection}</h3>
                  </div>
                  <span className="text-[10px] font-mono text-stone-400">AY 2026-27</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-stone-900">National Scholarship Portal</strong>
                      <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px]">
                        23 days left
                      </span>
                    </div>
                    <p className="text-stone-600 text-[11px]">
                      Pre & Post-Matric central scholarships closing on 31 October 2026.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-stone-900">PMFBY Rabi Season Sowing</strong>
                      <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px]">
                        38 days left
                      </span>
                    </div>
                    <p className="text-stone-600 text-[11px]">
                      Cut-off date for notified crop enrollment under Rabi season insurance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified government updates feed */}
              <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-stone-900">{t.verifiedGovUpdatesSection}</h3>
                  </div>
                  <button
                    onClick={() => setCurrentTab('updates')}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950"
                  >
                    View feed →
                  </button>
                </div>

                <div className="space-y-3">
                  {updates.slice(0, 2).map((upd) => (
                    <div
                      key={upd.id}
                      className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between text-stone-500 text-[11px]">
                        <span className="font-bold text-emerald-800">{upd.schemeName}</span>
                        <span className="font-mono">{upd.publishedAt}</span>
                      </div>
                      <h4 className="font-bold text-stone-900 leading-snug">{upd.title}</h4>
                      <p className="text-stone-600 text-[11px] leading-relaxed">{upd.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TRUST & PUBLIC SERVICE INTEGRITY NOTICE */}
            <section className="p-6 bg-stone-100 rounded-3xl border border-stone-200 space-y-3 text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                <h3 className="text-sm font-bold text-stone-900">Why trust Yojana Sarthi?</h3>
              </div>
              <p className="leading-relaxed">
                Yojana Sarthi connects Indian citizens directly to verified, official government portals. We never claim official eligibility on behalf of the government, and we never collect passwords, biometric keys, or sensitive financial secrets. All recommendations are transparently calculated to help you explore the support you may be eligible to discover.
              </p>
            </section>
          </div>
        )}

        {/* ==================== TAB: SCHEMES CATALOG ==================== */}
        {currentTab === 'schemes' && (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                Government Scheme Catalog
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                Verified Central & State welfare initiatives with step-by-step application guidance.
              </p>
            </div>

            {/* Filters and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3 shadow-xs">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by scheme name, benefits, or keyword..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-stone-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setShowSavedOnly(!showSavedOnly)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border min-h-[40px] flex items-center gap-1.5 transition-colors ${
                      showSavedOnly
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-emerald-700 text-emerald-700' : ''}`} />
                    <span>Saved Only ({savedSchemeIds.length})</span>
                  </button>

                  <button
                    onClick={() => setIsVoiceSearchOpen(true)}
                    className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl border border-emerald-200 min-h-[40px] min-w-[40px] flex items-center justify-center"
                    aria-label="Voice search"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filter controls row */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 text-xs">
                {/* User Type */}
                <select
                  value={selectedUserTypeFilter}
                  onChange={(e) => setSelectedUserTypeFilter(e.target.value)}
                  className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 font-medium focus:outline-none"
                >
                  <option value="all">Role: All Roles</option>
                  <option value="farmer">Role: Farmer</option>
                  <option value="worker">Role: Worker</option>
                  <option value="street_vendor">Role: Street Vendor</option>
                  <option value="student">Role: Student</option>
                  <option value="artisan">Role: Artisan</option>
                  <option value="business">Role: MSME / Business</option>
                </select>

                {/* Scope */}
                <select
                  value={selectedScopeFilter}
                  onChange={(e) => setSelectedScopeFilter(e.target.value)}
                  className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 font-medium focus:outline-none"
                >
                  <option value="all">Scope: Central & State</option>
                  <option value="central">Scope: Central Government Only</option>
                  <option value="state">Scope: Karnataka State Only</option>
                </select>

                <span className="text-[11px] text-stone-400 ml-auto">
                  Showing {filteredSchemes.length} schemes
                </span>
              </div>
            </div>

            {/* Schemes Grid */}
            {filteredSchemes.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
                <p className="text-sm font-semibold text-stone-700">No schemes found matching your search.</p>
                <p className="text-xs text-stone-400">Try clearing filters or updating your profile needs.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedUserTypeFilter('all');
                    setSelectedScopeFilter('all');
                    setShowSavedOnly(false);
                  }}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold min-h-[40px]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSchemes.map(({ scheme, score, reasons }) => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    matchScore={score}
                    matchReasons={reasons}
                    isSaved={savedSchemeIds.includes(scheme.id)}
                    onToggleSave={handleToggleSaveScheme}
                    onOpenDetails={(s) => setSelectedSchemeForModal(s)}
                    language={language}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB: APPLICATIONS ==================== */}
        {currentTab === 'applications' && (
          <div className="space-y-6">
            {/* Header + Add Application CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                  My Applications
                </h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  Track the complete lifecycle: Submission, Verification, Sanction, and Payment disbursement.
                </p>
              </div>

              <button
                onClick={() => {
                  setPreselectedSchemeForTrack(null);
                  setIsTrackModalOpen(true);
                }}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl min-h-[44px] flex items-center gap-2 shadow-sm self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Track an application</span>
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: `All (${applications.length})` },
                { id: 'active', label: 'Active Progress' },
                { id: 'sanctioned', label: 'Sanctioned' },
                { id: 'action', label: 'Action Required ⚠️' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setApplicationStatusFilter(f.id)}
                  className={`px-3.5 py-2 rounded-xl font-semibold transition-colors min-h-[40px] whitespace-nowrap ${
                    applicationStatusFilter === f.id
                      ? 'bg-emerald-900 text-white'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Applications List */}
            {filteredApplications.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
                <p className="text-sm font-semibold text-stone-700">You haven't added any applications yet in this view.</p>
                <p className="text-xs text-stone-400">
                  Applied through an official portal? Add your reference number to receive status guidance.
                </p>
                <button
                  onClick={() => setIsTrackModalOpen(true)}
                  className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold min-h-[44px]"
                >
                  + Track an application
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredApplications.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onOpenDetails={(a) => setSelectedAppForDetail(a)}
                    language={language}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB: UPDATES ==================== */}
        {currentTab === 'updates' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                Government Updates Feed
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                Verified policy amendments, window notices, and direct benefit disbursement advisories.
              </p>
            </div>

            <div className="space-y-4 max-w-3xl">
              {updates.map((item) => (
                <article
                  key={item.id}
                  className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-800">{item.schemeName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-700 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Verified
                      </span>
                    </div>
                    <span className="font-mono text-[11px]">{item.publishedAt}</span>
                  </div>

                  <h2 className="text-base font-bold text-stone-900 leading-snug">
                    {item.title}
                  </h2>

                  <p className="text-xs text-stone-700 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400">
                      Last checked: {item.verifiedAt}
                    </span>
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 min-h-[44px] py-2"
                    >
                      <span>Read official source ↗</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB: PROFILE ==================== */}
        {currentTab === 'profile' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                Citizen Profile & Preferences
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                Your profile information is used exclusively to find relevant scheme recommendations.
              </p>
            </div>

            {/* Profile Overview Card */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-stone-900">{profile.name}</h2>
                  <p className="text-xs text-stone-500">
                    {profile.state} · {profile.district} ({profile.areaType})
                  </p>
                </div>
                <button
                  onClick={() => setIsOnboardingOpen(true)}
                  className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold rounded-xl min-h-[40px]"
                >
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-stone-100">
                <div>
                  <span className="text-stone-400 text-[11px] block">Primary Occupation</span>
                  <strong className="text-stone-900 capitalize">{profile.userTypes.join(', ')}</strong>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Household Income Bracket</span>
                  <strong className="text-stone-900">{profile.incomeRange.replace(/_/g, ' ')}</strong>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Active Assistance Needs</span>
                  <strong className="text-stone-900 capitalize">{profile.needs.join(', ')}</strong>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Preferred Language</span>
                  <strong className="text-stone-900 uppercase">{profile.language}</strong>
                </div>
              </div>

              {profile.farmerDetails && (
                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                  <span className="font-bold block">Farmer Particulars</span>
                  <div>Land owned: {profile.farmerDetails.landOwned ? 'Yes' : 'No'}</div>
                  <div>Primary crop: {profile.farmerDetails.cropType}</div>
                </div>
              )}
            </div>

            {/* Preferences & Privacy Actions */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-900">Privacy & System Settings</h3>

              <div className="space-y-2">
                <button
                  onClick={() => setIsPrivacyOpen(true)}
                  className="w-full p-3.5 bg-stone-50 hover:bg-stone-100 rounded-2xl border border-stone-200 text-left text-xs font-semibold text-stone-800 flex items-center justify-between min-h-[44px]"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>DPDP Privacy Policy & Data Export</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>

                <button
                  onClick={handleToggleDemoMode}
                  className="w-full p-3.5 bg-stone-50 hover:bg-stone-100 rounded-2xl border border-stone-200 text-left text-xs font-semibold text-stone-800 flex items-center justify-between min-h-[44px]"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-amber-500' : 'bg-emerald-600'}`} />
                    <span>{isDemoMode ? 'Demo Mode: Active (Mock sample data)' : 'Live Mode: Active'}</span>
                  </div>
                  <span className="text-[11px] text-stone-500">Tap to toggle</span>
                </button>

                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="w-full p-3.5 bg-stone-50 hover:bg-stone-100 rounded-2xl border border-stone-200 text-left text-xs font-semibold text-stone-800 flex items-center justify-between min-h-[44px]"
                >
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-stone-600" />
                    <span>Yojana Sarthi Admin Portal</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-stone-200 bg-white/60 py-6 px-4 sm:px-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-semibold text-stone-700">Yojana Sarthi · Civic Welfare Discovery</p>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Independent civic assistance layer. All rights reserved. Follows Indian DPDP framework.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-medium text-stone-600">
            <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-emerald-800">
              Privacy Policy
            </button>
            <button onClick={() => setIsOnboardingOpen(true)} className="hover:text-emerald-800">
              Update Profile
            </button>
            <button onClick={() => setIsAdminOpen(true)} className="hover:text-emerald-800">
              Admin Portal
            </button>
          </div>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAVIGATION (Ergonomic Thumb Zone) */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        unreadNotifs={unreadCount}
      />

      {/* ALL INTERACTIVE MODALS */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        currentProfile={profile}
        onSaveProfile={handleSaveProfile}
      />

      <SchemeDetailModal
        scheme={selectedSchemeForModal}
        onClose={() => setSelectedSchemeForModal(null)}
        profile={profile}
        isSaved={selectedSchemeForModal ? savedSchemeIds.includes(selectedSchemeForModal.id) : false}
        onToggleSave={handleToggleSaveScheme}
        onOpenTrackModal={(sch) => {
          setSelectedSchemeForModal(null);
          setPreselectedSchemeForTrack(sch);
          setIsTrackModalOpen(true);
        }}
        language={language}
      />

      <TrackApplicationModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        schemes={schemes}
        preselectedScheme={preselectedSchemeForTrack}
        onAddApplication={handleAddApplication}
        language={language}
      />

      <ApplicationDetailModal
        application={selectedAppForDetail}
        onClose={() => setSelectedAppForDetail(null)}
        onUpdateApplication={handleUpdateApplication}
        isDemoMode={isDemoMode}
        language={language}
      />

      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        notifications={notifications}
        onMarkRead={(id) => {
          AppStorage.markNotificationRead(id);
          setNotificationsState(AppStorage.getNotifications());
        }}
        onMarkAllRead={() => {
          AppStorage.markAllNotificationsRead();
          setNotificationsState(AppStorage.getNotifications());
        }}
        onSelectApplicationById={(appId) => {
          const target = applications.find((a) => a.id === appId);
          if (target) setSelectedAppForDetail(target);
        }}
        language={language}
      />

      <VoiceSearchModal
        isOpen={isVoiceSearchOpen}
        onClose={() => setIsVoiceSearchOpen(false)}
        onApplyParsedProfile={(partial) => {
          const updated = { ...profile, ...partial };
          handleSaveProfile(updated);
          setCurrentTab('schemes');
        }}
        language={language}
      />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        schemes={schemes}
        onSaveSchemes={(s) => {
          setSchemesState(s);
          AppStorage.saveSchemes(s);
        }}
        updates={updates}
        onSaveUpdates={(u) => {
          setUpdatesState(u);
          AppStorage.saveUpdates(u);
        }}
        applications={applications}
        isDemoMode={isDemoMode}
        onToggleDemoMode={handleToggleDemoMode}
        onBroadcastNotification={(title, body, schemeName) => {
          const newNotif: NotificationItem = {
            id: `notif-${Date.now()}`,
            title,
            body,
            schemeName,
            type: 'update',
            read: false,
            timestamp: 'Just now',
          };
          AppStorage.addNotification(newNotif);
          setNotificationsState(AppStorage.getNotifications());
        }}
      />

      <PrivacyDPDPModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        onDataDeleted={() => {
          setProfileState(DEFAULT_PROFILE);
          setApplicationsState(AppStorage.getApplications());
          setSavedSchemeIds(AppStorage.getSavedSchemeIds());
        }}
      />
    </div>
  );
}
