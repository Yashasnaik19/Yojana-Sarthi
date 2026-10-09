import React, { useState } from 'react';
import {
  UserType,
  NeedCategory,
  LanguageCode,
  IncomeRange,
  UserProfile,
} from '../types';
import { translations } from '../data/translations';
import {
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Wheat,
  HardHat,
  ShoppingBag,
  GraduationCap,
  Scissors,
  Store,
  User,
  ShieldCheck,
  MapPin,
  Banknote,
  Sparkles,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

const INDIAN_STATES = [
  'Karnataka',
  'Maharashtra',
  'Uttar Pradesh',
  'Tamil Nadu',
  'Telangana',
  'Andhra Pradesh',
  'Kerala',
  'Madhya Pradesh',
  'Rajasthan',
  'Bihar',
  'Gujarat',
  'Punjab',
  'West Bengal',
  'Odisha',
  'Other State / UT'
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
}) => {
  const [step, setStep] = useState<number>(1);
  const [language, setLanguage] = useState<LanguageCode>(currentProfile.language || 'en');
  const [name, setName] = useState<string>(currentProfile.name || '');
  const [userTypes, setUserTypes] = useState<UserType[]>(currentProfile.userTypes || ['farmer']);
  const [state, setState] = useState<string>(currentProfile.state || 'Karnataka');
  const [district, setDistrict] = useState<string>(currentProfile.district || 'Belagavi');
  const [areaType, setAreaType] = useState<'rural' | 'urban'>(currentProfile.areaType || 'rural');
  const [incomeRange, setIncomeRange] = useState<IncomeRange>(currentProfile.incomeRange || '1_to_2_lakh');
  const [age, setAge] = useState<number>(currentProfile.age || 40);
  const [needs, setNeeds] = useState<NeedCategory[]>(currentProfile.needs || ['agriculture', 'financial']);

  // Role specifics
  const [landOwned, setLandOwned] = useState<boolean>(currentProfile.farmerDetails?.landOwned ?? true);
  const [cropType, setCropType] = useState<string>(currentProfile.farmerDetails?.cropType || 'Paddy');
  const [studentLevel, setStudentLevel] = useState<string>(currentProfile.studentDetails?.educationLevel || 'College / Degree');
  const [artisanTrade, setArtisanTrade] = useState<string>(currentProfile.artisanDetails?.tradeCraft || 'Carpentry / Woodcraft');
  const [vendingType, setVendingType] = useState<string>(currentProfile.vendorDetails?.vendingType || 'Fruit & Vegetable');

  if (!isOpen) return null;

  const t = translations[language];

  const handleToggleUserType = (type: UserType) => {
    if (userTypes.includes(type)) {
      if (userTypes.length > 1) {
        setUserTypes(userTypes.filter((t) => t !== type));
      }
    } else {
      setUserTypes([...userTypes, type]);
    }
  };

  const handleToggleNeed = (need: NeedCategory) => {
    if (needs.includes(need)) {
      if (needs.length > 1) {
        setNeeds(needs.filter((n) => n !== need));
      }
    } else {
      setNeeds([...needs, need]);
    }
  };

  const handleFinish = () => {
    const updated: UserProfile = {
      ...currentProfile,
      name: name.trim() || 'Citizen',
      language,
      userTypes,
      state,
      district: district.trim() || 'Belagavi',
      areaType,
      incomeRange,
      age,
      needs,
      farmerDetails: userTypes.includes('farmer')
        ? {
            landOwned,
            landSizeAcres: 2.5,
            cropType,
            irrigation: true,
            farmingActivity: 'Cultivation',
          }
        : undefined,
      studentDetails: userTypes.includes('student')
        ? {
            educationLevel: studentLevel,
            stream: 'General',
            academicYear: '2026-27',
          }
        : undefined,
      artisanDetails: userTypes.includes('artisan')
        ? {
            tradeCraft: artisanTrade,
            experienceYears: 8,
            toolRequirement: true,
            creditRequirement: true,
          }
        : undefined,
      vendorDetails: userTypes.includes('street_vendor')
        ? {
            vendingType,
            municipality: district,
            existingRegistration: true,
            creditRequirement: 10000,
          }
        : undefined,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString(),
    };

    onSaveProfile(updated);
    onClose();
  };

  const userTypeCards: { id: UserType; title: string; desc: string; icon: any }[] = [
    { id: 'farmer', title: t.farmer, desc: t.farmerDesc, icon: Wheat },
    { id: 'worker', title: t.worker, desc: t.workerDesc, icon: HardHat },
    { id: 'street_vendor', title: t.streetVendor, desc: t.streetVendorDesc, icon: ShoppingBag },
    { id: 'student', title: t.student, desc: t.studentDesc, icon: GraduationCap },
    { id: 'artisan', title: t.artisan, desc: t.artisanDesc, icon: Scissors },
    { id: 'business', title: t.business, desc: t.businessDesc, icon: Store },
    { id: 'other', title: t.other, desc: t.otherDesc, icon: User },
  ];

  const needOptions: { id: NeedCategory; label: string; iconStr: string }[] = [
    { id: 'financial', label: t.needFinancial, iconStr: '💰' },
    { id: 'loan', label: t.needLoan, iconStr: '🏦' },
    { id: 'agriculture', label: t.needAgriculture, iconStr: '🌾' },
    { id: 'skill', label: t.needSkill, iconStr: '🛠️' },
    { id: 'employment', label: t.needEmployment, iconStr: '💼' },
    { id: 'scholarship', label: t.needScholarship, iconStr: '🎓' },
    { id: 'housing', label: t.needHousing, iconStr: '🏠' },
    { id: 'healthcare', label: t.needHealthcare, iconStr: '🏥' },
    { id: 'business', label: t.needBusiness, iconStr: '🧑‍💼' },
    { id: 'tools', label: t.needTools, iconStr: '🧰' },
    { id: 'insurance', label: t.needInsurance, iconStr: '🛡️' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Step Progress */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 tracking-wider">
                STEP {step} OF 4
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-xs text-stone-500 font-medium">Citizen Profile Matching</span>
            </div>
            <h2 className="text-lg font-bold text-stone-900 mt-0.5">
              {step === 1 && 'Choose your preferred language'}
              {step === 2 && 'What best describes you?'}
              {step === 3 && 'Tell us basic details for scheme matching'}
              {step === 4 && 'What kind of help are you looking for?'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: LANGUAGE */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-stone-600">
                Yojana Sarthi is designed for simple, respectful citizen guidance in your comfortable language:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { code: 'en', title: 'English', native: 'English', desc: 'Central & State schemes' },
                  { code: 'kn', title: 'Kannada', native: 'ಕನ್ನಡ', desc: 'ಕರ್ನಾಟಕ ಮತ್ತು ಕೇಂದ್ರ ಯೋಜನೆಗಳು' },
                  { code: 'hi', title: 'Hindi', native: 'हिन्दी', desc: 'राष्ट्रीय एवं राज्य योजनाएं' },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code as LanguageCode)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all min-h-[90px] ${
                      language === l.code
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-stone-900">{l.native}</span>
                      {language === l.code && <Check className="w-4 h-4 text-emerald-700" />}
                    </div>
                    <span className="text-xs text-stone-500 mt-1 block">{l.desc}</span>
                  </button>
                ))}
              </div>
              <div className="pt-2 text-xs text-stone-500">
                Additional Indian regional languages (Tamil, Telugu, Malayalam, Marathi, Bengali, Odia, Gujarati) are structured for upcoming updates.
              </div>
            </div>
          )}

          {/* STEP 2: USER TYPE */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600">
                Select your primary activity (you can pick multiple if applicable):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {userTypeCards.map((card) => {
                  const isSelected = userTypes.includes(card.id);
                  const Icon = card.icon;
                  return (
                    <button
                      key={card.id}
                      onClick={() => handleToggleUserType(card.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all min-h-[80px] flex items-start gap-3 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-stone-900">{card.title}</h3>
                          {isSelected && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5 leading-snug">{card.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: DETAILS */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Naik"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">State of Residence</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 bg-white"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Belagavi / Bengaluru"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Area Type</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAreaType('rural')}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl border ${
                        areaType === 'rural' ? 'bg-emerald-50 border-emerald-600 text-emerald-900' : 'border-stone-200 text-stone-600'
                      }`}
                    >
                      Rural (Village)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAreaType('urban')}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl border ${
                        areaType === 'urban' ? 'bg-emerald-50 border-emerald-600 text-emerald-900' : 'border-stone-200 text-stone-600'
                      }`}
                    >
                      Urban (City/Town)
                    </button>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Annual Household Income Range (Never asks exact bank amount)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'below_1_lakh', label: 'Below ₹1 Lakh' },
                      { id: '1_to_2_lakh', label: '₹1 Lakh – ₹2 Lakh' },
                      { id: '2_to_5_lakh', label: '₹2 Lakh – ₹5 Lakh' },
                      { id: '5_to_10_lakh', label: '₹5 Lakh – ₹10 Lakh' },
                      { id: 'above_10_lakh', label: 'Above ₹10 Lakh' },
                      { id: 'prefer_not_to_say', label: 'Prefer not to say' },
                    ].map((inc) => (
                      <button
                        key={inc.id}
                        type="button"
                        onClick={() => setIncomeRange(inc.id as IncomeRange)}
                        className={`py-2 px-3 text-xs font-medium rounded-xl border text-center ${
                          incomeRange === inc.id
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold'
                            : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        {inc.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic role fields */}
              {userTypes.includes('farmer') && (
                <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2.5">
                  <span className="text-xs font-bold text-emerald-900 block">🌾 Farmer Specific Criteria</span>
                  <div className="flex flex-wrap gap-4 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800">
                      <input
                        type="checkbox"
                        checked={landOwned}
                        onChange={(e) => setLandOwned(e.target.checked)}
                        className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      Cultivable land owned in your name / family
                    </label>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Primary Crop</label>
                    <input
                      type="text"
                      value={cropType}
                      onChange={(e) => setCropType(e.target.value)}
                      placeholder="e.g. Paddy, Cotton, Millets, Vegetables"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-emerald-300 bg-white"
                    />
                  </div>
                </div>
              )}

              {userTypes.includes('student') && (
                <div className="p-3.5 bg-sky-50/60 rounded-2xl border border-sky-200 space-y-2">
                  <span className="text-xs font-bold text-sky-900 block">🎓 Student Education Level</span>
                  <select
                    value={studentLevel}
                    onChange={(e) => setStudentLevel(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-sky-300 bg-white"
                  >
                    <option value="School (Pre-Matric Class 1-10)">School (Pre-Matric Class 1-10)</option>
                    <option value="Higher Secondary (11-12 / PUC)">Higher Secondary (11-12 / PUC)</option>
                    <option value="College / Degree (Graduate)">College / Degree (Graduate)</option>
                    <option value="Post-Graduate / Professional">Post-Graduate / Professional</option>
                    <option value="ITI / Polytechnic Diploma">ITI / Polytechnic Diploma</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: NEEDS */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600">
                What kind of government support are you looking for right now? (Select all that apply)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {needOptions.map((opt) => {
                  const isSelected = needs.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleToggleNeed(opt.id)}
                      className={`p-3 rounded-2xl border-2 text-left transition-all min-h-[64px] flex items-center gap-2.5 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <span className="text-lg shrink-0" aria-hidden="true">{opt.iconStr}</span>
                      <span className="text-xs leading-tight flex-1">{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-start gap-2 text-xs text-stone-600">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  Our matching engine computes recommendations deterministically. We never sell or share your personal answers with third parties.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-200 rounded-xl min-h-[44px] flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl min-h-[44px] flex items-center gap-1.5 shadow-sm"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl min-h-[44px] flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Find My Schemes</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
