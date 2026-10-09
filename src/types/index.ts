export type UserType =
  | 'farmer'
  | 'worker'
  | 'street_vendor'
  | 'student'
  | 'artisan'
  | 'business'
  | 'other';

export type NeedCategory =
  | 'financial'
  | 'loan'
  | 'agriculture'
  | 'skill'
  | 'employment'
  | 'scholarship'
  | 'housing'
  | 'healthcare'
  | 'business'
  | 'tools'
  | 'women'
  | 'senior'
  | 'disability'
  | 'insurance';

export type LanguageCode = 'en' | 'kn' | 'hi';

export type IncomeRange =
  | 'below_1_lakh'
  | '1_to_2_lakh'
  | '2_to_5_lakh'
  | '5_to_10_lakh'
  | 'above_10_lakh'
  | 'prefer_not_to_say';

export interface UserProfile {
  name: string;
  phoneMasked: string;
  language: LanguageCode;
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  state: string;
  district: string;
  pincode?: string;
  areaType: 'rural' | 'urban';
  userTypes: UserType[];
  incomeRange: IncomeRange;
  needs: NeedCategory[];
  
  // Role-specific details
  farmerDetails?: {
    landOwned: boolean;
    landSizeAcres?: number;
    cropType?: string;
    irrigation: boolean;
    farmingActivity?: string;
  };
  studentDetails?: {
    educationLevel: string;
    stream: string;
    academicYear: string;
    instituteType?: string;
  };
  workerDetails?: {
    employmentType: string;
    skillArea: string;
    apprenticeshipInterest: boolean;
  };
  vendorDetails?: {
    vendingType: string;
    municipality: string;
    existingRegistration: boolean;
    creditRequirement?: number;
  };
  artisanDetails?: {
    tradeCraft: string;
    experienceYears: number;
    toolRequirement: boolean;
    creditRequirement: boolean;
  };

  notificationPreferences?: {
    inApp: boolean;
    sms: boolean;
    push: boolean;
    whatsapp: boolean;
  };

  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SchemeScope = 'CENTRAL' | 'STATE';
export type SchemeStatus = 'OPEN' | 'CLOSING_SOON' | 'TEMPORARILY_UNAVAILABLE' | 'CLOSED';
export type VerificationStatus = 'VERIFIED' | 'NEEDS_REVIEW' | 'OUTDATED' | 'ARCHIVED';

export interface Scheme {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  subCategory?: string;
  ministry: string;
  department?: string;
  scope: SchemeScope;
  state: string; // "All" for central, or specific state like "Karnataka"
  targetGroups: UserType[];
  benefits: string;
  benefitAmountMax?: number;
  benefitType: 'financial' | 'loan' | 'insurance' | 'scholarship' | 'training' | 'tools' | 'subsidy';
  eligibilitySummary: string;
  eligibilityBullets: string[];
  eligibilityRules?: Array<{ field: string; operator: string; value: any; priority: number }>;
  documentsRequired: string[];
  applicationProcess: string[];
  onlineApplicationAvailable: boolean;
  offlineApplicationAvailable: boolean;
  officialApplicationUrl: string;
  officialInformationUrl: string;
  officialTrackingUrl?: string;
  linksLastChecked?: string;
  helplineNumber: string;
  helplineEmail: string;
  deadline?: string;
  status: SchemeStatus;
  verificationStatus: VerificationStatus;
  lastVerified: string;
  verificationSource: string;
  imageUrl?: string;
}

export type ApplicationNormalizedStatus =
  | 'SUBMITTED'
  | 'UNDER_VERIFICATION'
  | 'DOCUMENTS_REQUIRED'
  | 'VERIFICATION_COMPLETED'
  | 'APPROVED'
  | 'SANCTIONED'
  | 'PAYMENT_PROCESSING'
  | 'PAYMENT_RELEASED'
  | 'PAYMENT_FAILED'
  | 'REJECTED'
  | 'EXPIRED';

export type StatusSourceType =
  | 'OFFICIAL_API'
  | 'OFFICIAL_PORTAL'
  | 'USER_ENTERED'
  | 'ADMIN_VERIFIED';

export interface TimelineEvent {
  id: string;
  status: ApplicationNormalizedStatus;
  label: string;
  date: string;
  description: string;
  source: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isFailed?: boolean;
}

export interface SanctionInfo {
  status: 'NOT_YET_SANCTIONED' | 'UNDER_CONSIDERATION' | 'APPROVED' | 'SANCTIONED' | 'CANCELLED' | 'REJECTED';
  amount?: string;
  sanctionReference?: string;
  sanctionDate?: string;
  source: string;
}

export interface PaymentInfo {
  status: 'NOT_APPLICABLE' | 'PENDING' | 'PROCESSING' | 'INITIATED' | 'CREDITED' | 'FAILED' | 'RETURNED';
  amount?: string;
  paymentDate?: string;
  paymentReferenceMasked?: string;
  source: string;
}

export interface TrackedApplication {
  id: string;
  userId: string;
  schemeId: string;
  schemeName: string;
  ministry: string;
  referenceNumber: string;
  applicationDate: string;
  registeredPhoneMasked: string;
  currentStatus: ApplicationNormalizedStatus;
  statusSourceType: StatusSourceType;
  statusSourceName: string;
  officialTrackingUrl: string;
  lastChecked: string;
  lastChanged: string;
  isDemo: boolean;
  benefitPreview: string;
  timeline: TimelineEvent[];
  sanction: SanctionInfo;
  payment: PaymentInfo;
  nextActionAdvice: string;
  notes?: string;
}

export interface SchemeUpdate {
  id: string;
  schemeId: string;
  schemeName: string;
  title: string;
  summary: string;
  rawSourceText?: string;
  sourceUrl: string;
  publishedAt: string;
  verifiedAt: string;
  verificationStatus: 'VERIFIED' | 'NEEDS_REVIEW' | 'REJECTED';
  isImportant: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  schemeName?: string;
  applicationId?: string;
  type: 'status_changed' | 'doc_required' | 'sanction' | 'payment' | 'deadline' | 'update' | 'match';
  read: boolean;
  timestamp: string;
}

export interface MatchScoreResult {
  scheme: Scheme;
  score: number; // 0 - 100
  reasons: string[];
  disclaimer: string;
}

export type AdminRole = 'SUPER_ADMIN' | 'VERIFIER' | 'EDITOR' | 'SUPPORT';
