import { LanguageCode } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  disclaimer: string;
  heroHeadline: string;
  heroSubheadline: string;
  findSchemesBtn: string;
  browseSchemesBtn: string;
  trackAppBtn: string;
  
  // Navigation
  navHome: string;
  navSchemes: string;
  navApplications: string;
  navUpdates: string;
  navProfile: string;

  // Search & Filters
  searchPlaceholder: string;
  voiceSearchTooltip: string;
  filterAll: string;
  filterCentral: string;
  filterState: string;
  filterOpen: string;

  // Sections
  recommendedSection: string;
  recommendedSub: string;
  applicationUpdatesSection: string;
  newSchemesSection: string;
  deadlinesSection: string;
  verifiedGovUpdatesSection: string;

  // User Types
  farmer: string;
  farmerDesc: string;
  worker: string;
  workerDesc: string;
  streetVendor: string;
  streetVendorDesc: string;
  student: string;
  studentDesc: string;
  artisan: string;
  artisanDesc: string;
  business: string;
  businessDesc: string;
  other: string;
  otherDesc: string;

  // Needs
  needFinancial: string;
  needLoan: string;
  needAgriculture: string;
  needSkill: string;
  needEmployment: string;
  needScholarship: string;
  needHousing: string;
  needHealthcare: string;
  needBusiness: string;
  needTools: string;
  needInsurance: string;

  // Statuses
  statusSubmitted: string;
  statusUnderVerification: string;
  statusDocumentsRequired: string;
  statusVerificationCompleted: string;
  statusApproved: string;
  statusSanctioned: string;
  statusPaymentProcessing: string;
  statusPaymentReleased: string;
  statusPaymentFailed: string;
  statusRejected: string;

  // Common UI
  profileMatch: string;
  profileMatchDisclaimer: string;
  openOfficialPortal: string;
  checkLatestStatus: string;
  lastChecked: string;
  sanctionStatusTitle: string;
  paymentStatusTitle: string;
  whatDoIDoNowTitle: string;
  demoDataLabel: string;
  demoDataNotice: string;
  adminPortal: string;
  demoMode: string;
  offlineNotice: string;
}

export const translations: Record<LanguageCode, Translations> = {
  en: {
    appName: 'Yojana Sarthi',
    tagline: 'Government schemes, matched to you.',
    disclaimer: 'Yojana Sarthi is an independent information and assistance platform. Applications and final eligibility decisions are handled by the respective government departments.',
    heroHeadline: 'Government schemes, matched to you.',
    heroSubheadline: 'Tell us a little about yourself and what you need. We will help you discover relevant government schemes and connect you to the official application portal.',
    findSchemesBtn: 'Find schemes for me',
    browseSchemesBtn: 'Browse all schemes',
    trackAppBtn: 'Track an application',

    navHome: 'Home',
    navSchemes: 'Schemes',
    navApplications: 'Applications',
    navUpdates: 'Updates',
    navProfile: 'Profile',

    searchPlaceholder: 'Search schemes by name, benefit, or need...',
    voiceSearchTooltip: 'Speak your situation or requirement',
    filterAll: 'All Schemes',
    filterCentral: 'Central Govt',
    filterState: 'State Govt',
    filterOpen: 'Open Now',

    recommendedSection: 'Recommended for you',
    recommendedSub: 'Matched using your profile preferences',
    applicationUpdatesSection: 'Application status highlights',
    newSchemesSection: 'Recently verified schemes',
    deadlinesSection: 'Approaching deadlines',
    verifiedGovUpdatesSection: 'Verified government updates',

    farmer: 'Farmer',
    farmerDesc: 'Agriculture, crop insurance, income support, equipment, loans',
    worker: 'Worker',
    workerDesc: 'Employment, skill development, apprenticeships, social security',
    streetVendor: 'Street Vendor',
    streetVendorDesc: 'Working capital credit, identity, urban business support',
    student: 'Student',
    studentDesc: 'Scholarships, education assistance, skill development',
    artisan: 'Artisan',
    artisanDesc: 'Traditional trades, tools, training, collateral-free credit',
    business: 'Small Business',
    businessDesc: 'MSME registration, credit, entrepreneurship subsidies',
    other: 'Other Citizen',
    otherDesc: 'General public welfare and social security schemes',

    needFinancial: 'Financial Assistance',
    needLoan: 'Loan / Working Capital',
    needAgriculture: 'Agriculture Support',
    needSkill: 'Skill Training',
    needEmployment: 'Employment / Apprenticeship',
    needScholarship: 'Scholarship / Education',
    needHousing: 'Housing Support',
    needHealthcare: 'Healthcare Coverage',
    needBusiness: 'Business Setup',
    needTools: 'Tools & Equipment',
    needInsurance: 'Insurance & Pension',

    statusSubmitted: 'Submitted',
    statusUnderVerification: 'Under Verification',
    statusDocumentsRequired: 'Documents Required',
    statusVerificationCompleted: 'Verification Completed',
    statusApproved: 'Approved',
    statusSanctioned: 'Sanctioned',
    statusPaymentProcessing: 'Payment Processing',
    statusPaymentReleased: 'Payment Credited',
    statusPaymentFailed: 'Payment Failed',
    statusRejected: 'Rejected',

    profileMatch: 'Profile match',
    profileMatchDisclaimer: 'This match is an informational recommendation based on your profile. Final eligibility is determined by the concerned government department.',
    openOfficialPortal: 'Open Official Application Portal ↗',
    checkLatestStatus: 'Check latest status',
    lastChecked: 'Last checked',
    sanctionStatusTitle: 'Sanction Status',
    paymentStatusTitle: 'Payment Status',
    whatDoIDoNowTitle: 'What do I do now?',
    demoDataLabel: 'DEMO DATA',
    demoDataNotice: 'Demo application — not a real government application record.',
    adminPortal: 'Admin Portal',
    demoMode: 'Demo Mode',
    offlineNotice: 'You are offline. Saved scheme information is still available. Application status will update when you reconnect.',
  },
  kn: {
    appName: 'ಯೋಜನಾ ಸಾರಥಿ (Yojana Sarthi)',
    tagline: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, ನಿಮಗೆ ತಕ್ಕಂತೆ.',
    disclaimer: 'ಯೋಜನಾ ಸಾರಥಿ ಒಂದು ಸ್ವತಂತ್ರ ಮಾಹಿತಿ ಮತ್ತು ಮಾರ್ಗದರ್ಶನ ವೇದಿಕೆಯಾಗಿದೆ. ಅಂತಿಮ ಅರ್ಹತೆ ಮತ್ತು ಅರ್ಜಿಗಳನ್ನು ಆಯಾ ಸರ್ಕಾರಿ ಇಲಾಖೆಗಳು ನಿರ್ಧರಿಸುತ್ತವೆ.',
    heroHeadline: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, ನಿಮಗೆ ತಕ್ಕಂತೆ.',
    heroSubheadline: 'ನಿಮ್ಮ ಬಗ್ಗೆ ಮತ್ತು ನಿಮಗೆ ಬೇಕಾದ ಸಹಾಯದ ಬಗ್ಗೆ ತಿಳಿಸಿ. ನಿಮಗಾಗಿ ಸೂಕ್ತ ಯೋಜನೆಗಳನ್ನು ಕಂಡುಹಿಡಿದು ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್‌ಗೆ ಸಂಪರ್ಕಿಸುತ್ತೇವೆ.',
    findSchemesBtn: 'ನನಗಾಗಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ',
    browseSchemesBtn: 'ಎಲ್ಲಾ ಯೋಜನೆಗಳನ್ನು ನೋಡಿ',
    trackAppBtn: 'ಅರ್ಜಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',

    navHome: 'ಮುಖಪುಟ',
    navSchemes: 'ಯೋಜನೆಗಳು',
    navApplications: 'ನನ್ನ ಅರ್ಜಿಗಳು',
    navUpdates: 'ಅಪ್‌ಡೇಟ್‌ಗಳು',
    navProfile: 'ಪ್ರೊಫೈಲ್',

    searchPlaceholder: 'ಯೋಜನೆ, ನೆರವು ಅಥವಾ ಇಲಾಖೆ ಹುಡುಕಿ...',
    voiceSearchTooltip: 'ಧ್ವನಿ ಮೂಲಕ ನಿಮ್ಮ ಅಗತ್ಯವನ್ನು ಹೇಳಿ',
    filterAll: 'ಎಲ್ಲಾ ಯೋಜನೆಗಳು',
    filterCentral: 'ಕೇಂದ್ರ ಸರ್ಕಾರ',
    filterState: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರ',
    filterOpen: 'ಈಗ ಲಭ್ಯವಿದೆ',

    recommendedSection: 'ನಿಮಗಾಗಿ ಶಿಫಾರಸು ಮಾಡಲಾದ ಯೋಜನೆಗಳು',
    recommendedSub: 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ವಿವರಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ಹೊಂದಿಸಲಾಗಿದೆ',
    applicationUpdatesSection: 'ಅರ್ಜಿ ಸ್ಥಿತಿ ಮುಖ್ಯಾಂಶಗಳು',
    newSchemesSection: 'ಇತ್ತೀಚೆಗೆ ಪರಿಶೀಲಿಸಲಾದ ಯೋಜನೆಗಳು',
    deadlinesSection: 'ಮುಕ್ತಾಯವಾಗುತ್ತಿರುವ ಗಡುವುಗಳು',
    verifiedGovUpdatesSection: 'ಪರಿಶೀಲಿಸಿದ ಸರ್ಕಾರಿ ಪ್ರಕಟಣೆಗಳು',

    farmer: 'ರೈತರು',
    farmerDesc: 'ಕೃಷಿ ನೆರವು, ಬೆಳೆ ವಿಮೆ, ಆದಾಯ ಬೆಂಬಲ, ಸಲಕರಣೆಗಳು, ಸಾಲ',
    worker: 'ಕಾರ್ಮಿಕರು',
    workerDesc: 'ಉದ್ಯೋಗ, ಕೌಶಲ್ಯ ತರಬೇತಿ, ಸಾಮಾಜಿಕ ಭದ್ರತೆ',
    streetVendor: 'ಬೀದಿ ವ್ಯಾಪಾರಿ',
    streetVendorDesc: 'ದುಡಿಯುವ ಬಂಡವಾಳ ಸಾಲ, ವ್ಯಾಪಾರ ನೆರವು',
    student: 'ವಿದ್ಯಾರ್ಥಿ',
    studentDesc: 'ವಿದ್ಯಾರ್ಥಿವೇತನ, ಶಿಕ್ಷಣ ನೆರವು, ಕೌಶಲ್ಯ',
    artisan: 'ಕುಶಲಕರ್ಮಿ (ವಿಶ್ವಕರ್ಮ)',
    artisanDesc: 'ಸಾಂಪ್ರದಾಯಿಕ ಕಸುಬು, ಉಪಕರಣಗಳು, ತರಬೇತಿ, ಸಾಲ',
    business: 'ಸಣ್ಣ ವ್ಯಾಪಾರ',
    businessDesc: 'ನೋಂದಣಿ, ಸಬ್ಸಿಡಿ, ಉದ್ಯಮಶೀಲತೆ ಬೆಂಬಲ',
    other: 'ಇತರ ನಾಗರಿಕರು',
    otherDesc: 'ಸಾಮಾನ್ಯ ಜನಕಲ್ಯಾಣ ಮತ್ತು ಸಮಾಜ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳು',

    needFinancial: 'ಆರ್ಥಿಕ ನೆರವು',
    needLoan: 'ಸಾಲ / ಬಂಡವಾಳ',
    needAgriculture: 'ಕೃಷಿ ಬೆಂಬಲ',
    needSkill: 'ಕೌಶಲ್ಯ ತರಬೇತಿ',
    needEmployment: 'ಉದ್ಯೋಗ / ಅಪ್ರೆಂಟಿಸ್‌ಶಿಪ್',
    needScholarship: 'ವಿದ್ಯಾರ್ಥಿವೇತನ',
    needHousing: 'ವಸತಿ ನೆರವು',
    needHealthcare: 'ಆರೋಗ್ಯ ಚಿಕಿತ್ಸೆ',
    needBusiness: 'ವ್ಯಾಪಾರ ಆರಂಭ',
    needTools: 'ಉಪಕರಣಗಳು',
    needInsurance: 'ವಿಮೆ ಮತ್ತು ಪಿಂಚಣಿ',

    statusSubmitted: 'ಸಲ್ಲಿಸಲಾಗಿದೆ',
    statusUnderVerification: 'ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ',
    statusDocumentsRequired: 'ದಾಖಲೆಗಳು ಬೇಕಾಗುತ್ತವೆ',
    statusVerificationCompleted: 'ಪರಿಶೀಲನೆ ಪೂರ್ಣಗೊಂಡಿದೆ',
    statusApproved: 'ಅನುಮೋದಿಸಲಾಗಿದೆ',
    statusSanctioned: 'ಮಂಜೂರಾಗಿದೆ (Sanctioned)',
    statusPaymentProcessing: 'ಹಣ ಬಿಡುಗಡೆ ಹಂತದಲ್ಲಿದೆ',
    statusPaymentReleased: 'ಖಾತೆಗೆ ಜಮೆಯಾಗಿದೆ',
    statusPaymentFailed: 'ಪಾವತಿ ವಿಫಲವಾಗಿದೆ',
    statusRejected: 'ತಿರಸ್ಕರಿಸಲಾಗಿದೆ',

    profileMatch: 'ಪ್ರೊಫೈಲ್ ಹೊಂದಾಣಿಕೆ',
    profileMatchDisclaimer: 'ಇದು ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಆಧಾರಿತ ಶಿಫಾರಸು ಮಾತ್ರ. ಅಂತಿಮ ಅರ್ಹತೆಯನ್ನು ಸಂಬಂಧಪಟ್ಟ ಸರ್ಕಾರಿ ಇಲಾಖೆ ನಿರ್ಧರಿಸುತ್ತದೆ.',
    openOfficialPortal: 'ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್ ತೆರೆಯಿರಿ ↗',
    checkLatestStatus: 'ಇತ್ತೀಚಿನ ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ',
    lastChecked: 'ಕೊನೆಯ ಪರಿಶೀಲನೆ',
    sanctionStatusTitle: 'ಮಂಜೂರಾತಿ ಸ್ಥಿತಿ (Sanction)',
    paymentStatusTitle: 'ಪಾವತಿ ಸ್ಥಿತಿ (Payment)',
    whatDoIDoNowTitle: 'ಈಗ ನಾನು ಏನು ಮಾಡಬೇಕು?',
    demoDataLabel: 'ಡೆಮೊ ಮಾಹಿತಿ',
    demoDataNotice: 'ಡೆಮೊ ಅರ್ಜಿ — ಇದು ನೈಜ ಸರ್ಕಾರಿ ದಾಖಲೆಯಲ್ಲ.',
    adminPortal: 'ನಿರ್ವಾಹಕ ಪೋರ್ಟಲ್',
    demoMode: 'ಡೆಮೊ ಮೋಡ್',
    offlineNotice: 'ನೀವು ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿದ್ದೀರಿ. ಉಳಿಸಲಾದ ಮಾಹಿತಿ ಲಭ್ಯವಿದೆ. ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಬಂದಾಗ ಸ್ಥಿತಿ ನವೀಕರಣಗೊಳ್ಳುತ್ತದೆ.',
  },
  hi: {
    appName: 'योजना सारथी (Yojana Sarthi)',
    tagline: 'सरकारी योजनाएं, आपके लिए सटीक।',
    disclaimer: 'योजना सारथी एक स्वतंत्र सूचना एवं सहायता मंच है। आवेदन और अंतिम पात्रता संबंधित सरकारी विभागों द्वारा तय की जाती है।',
    heroHeadline: 'सरकारी योजनाएं, आपके लिए सटीक।',
    heroSubheadline: 'अपने बारे में और अपनी जरूरत बताएं। हम आपको सही योजनाएं ढूंढने और आधिकारिक सरकारी पोर्टल से जोड़ने में मदद करेंगे।',
    findSchemesBtn: 'मेरे लिए योजनाएं खोजें',
    browseSchemesBtn: 'सभी योजनाएं देखें',
    trackAppBtn: 'आवेदन ट्रैक करें',

    navHome: 'होम',
    navSchemes: 'योजनाएं',
    navApplications: 'मेरे आवेदन',
    navUpdates: 'अपडेट्स',
    navProfile: 'प्रोफाइल',

    searchPlaceholder: 'योजना, लाभ या आवश्यकता खोजें...',
    voiceSearchTooltip: 'बोलकर अपनी आवश्यकता बताएं',
    filterAll: 'सभी योजनाएं',
    filterCentral: 'केंद्र सरकार',
    filterState: 'राज्य सरकार',
    filterOpen: 'वर्तमान में खुली',

    recommendedSection: 'आपके लिए अनुशंसित',
    recommendedSub: 'आपकी प्रोफाइल जानकारी के आधार पर सुझाई गई',
    applicationUpdatesSection: 'आवेदन स्थिति मुख्य बिंदु',
    newSchemesSection: 'हाल ही में सत्यापित योजनाएं',
    deadlinesSection: 'अंतिम तिथि नजदीक',
    verifiedGovUpdatesSection: 'सत्यापित सरकारी सूचनाएं',

    farmer: 'किसान',
    farmerDesc: 'कृषि सहायता, फसल बीमा, आय सहायता, उपकरण, ऋण',
    worker: 'श्रमिक / कामगार',
    workerDesc: 'रोजगार, कौशल विकास, अप्रेंटिसशिप, सामाजिक सुरक्षा',
    streetVendor: 'स्ट्रीट वेंडर / रेहड़ी पटरी',
    streetVendorDesc: 'कार्यशील पूंजी ऋण, पहचान, व्यवसाय सहायता',
    student: 'छात्र / विद्यार्थी',
    studentDesc: 'छात्रवृत्ति, शिक्षा सहायता, कौशल प्रशिक्षण',
    artisan: 'कारीगर / शिल्पकार',
    artisanDesc: 'पारंपरिक व्यवसाय, औजार किट, प्रशिक्षण, बिना गारंटी ऋण',
    business: 'लघु उद्योग / व्यापारी',
    businessDesc: 'एमएसएमई पंजीकरण, ऋण सब्सिडी, उद्यमिता समर्थन',
    other: 'अन्य नागरिक',
    otherDesc: 'सामान्य जन कल्याण और सामाजिक सुरक्षा योजनाएं',

    needFinancial: 'वित्तीय सहायता',
    needLoan: 'ऋण / पूंजी',
    needAgriculture: 'कृषि समर्थन',
    needSkill: 'कौशल प्रशिक्षण',
    needEmployment: 'रोजगार / अप्रेंटिसशिप',
    needScholarship: 'छात्रवृत्ति / शिक्षा',
    needHousing: 'आवास सहायता',
    needHealthcare: 'स्वास्थ्य लाभ',
    needBusiness: 'व्यवसाय स्थापना',
    needTools: 'औजार एवं उपकरण',
    needInsurance: 'बीमा एवं पेंशन',

    statusSubmitted: 'जमा किया गया',
    statusUnderVerification: 'सत्यापन प्रक्रियाधीन',
    statusDocumentsRequired: 'दस्तावेज आवश्यक',
    statusVerificationCompleted: 'सत्यापन पूर्ण',
    statusApproved: 'स्वीकृत',
    statusSanctioned: 'स्वीकृत / स्वीकृत राशि (Sanctioned)',
    statusPaymentProcessing: 'भुगतान प्रक्रियाधीन',
    statusPaymentReleased: 'खाते में हस्तांतरित',
    statusPaymentFailed: 'भुगतान विफल',
    statusRejected: 'अस्वीकृत',

    profileMatch: 'प्रोफाइल मिलान',
    profileMatchDisclaimer: 'यह आपकी प्रोफाइल के आधार पर एक अनुशंसा है। अंतिम पात्रता संबंधित सरकारी विभाग द्वारा निर्धारित की जाती है।',
    openOfficialPortal: 'आधिकारिक पोर्टल खोलें ↗',
    checkLatestStatus: 'नवीनतम स्थिति जांचें',
    lastChecked: 'अंतिम जांच',
    sanctionStatusTitle: 'स्वीकृति स्थिति (Sanction)',
    paymentStatusTitle: 'भुगतान स्थिति (Payment)',
    whatDoIDoNowTitle: 'अब मुझे क्या करना चाहिए?',
    demoDataLabel: 'डेमो डेटा',
    demoDataNotice: 'डेमो आवेदन — यह वास्तविक सरकारी रिकॉर्ड नहीं है।',
    adminPortal: 'एडमिन पोर्टल',
    demoMode: 'डेमो मोड',
    offlineNotice: 'आप ऑफलाइन हैं। सहेजी गई जानकारी उपलब्ध है। नेटवर्क आने पर स्थिति अपडेट होगी।',
  }
};
