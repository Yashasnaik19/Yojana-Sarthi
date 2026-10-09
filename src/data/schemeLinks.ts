export interface SchemeLinkEntry {
  officialApplicationUrl: string;
  officialInformationUrl: string;
  officialTrackingUrl: string;
  linksLastChecked: string;
}

export const ADMIN_SUPPORT_EMAIL = 'naikyashas532@gmail.com';
export const DEFAULT_OFFICIAL_PORTAL = 'https://www.india.gov.in/';

export const SCHEME_LINKS: Record<string, SchemeLinkEntry> = {
  'pm-kisan': {
    officialApplicationUrl: 'https://pmkisan.gov.in/',
    officialInformationUrl: 'https://pmkisan.gov.in/Documents.aspx',
    officialTrackingUrl: 'https://pmkisan.gov.in/FarmerStatus.aspx',
    linksLastChecked: '9 October 2026',
  },
  'pmfby': {
    officialApplicationUrl: 'https://pmfby.gov.in/',
    officialInformationUrl: 'https://pmfby.gov.in/guidelines',
    officialTrackingUrl: 'https://pmfby.gov.in/',
    linksLastChecked: '9 October 2026',
  },
  'pm-svanidhi': {
    officialApplicationUrl: 'https://pmsvanidhi.mohua.gov.in/',
    officialInformationUrl: 'https://pmsvanidhi.mohua.gov.in/Home/Schemes',
    officialTrackingUrl: 'https://pmsvanidhi.mohua.gov.in/Home/TrackApplication',
    linksLastChecked: '9 October 2026',
  },
  'pm-vishwakarma': {
    officialApplicationUrl: 'https://pmvishwakarma.gov.in/',
    officialInformationUrl: 'https://pmvishwakarma.gov.in/Home/SchemeGuidelines',
    officialTrackingUrl: 'https://pmvishwakarma.gov.in/Home/TrackStatus',
    linksLastChecked: '9 October 2026',
  },
  'pmkvy': {
    officialApplicationUrl: 'https://www.pmkvyofficial.org/',
    officialInformationUrl: 'https://www.msde.gov.in/en/schemes-initiatives/schemes-programmes-under-msde/pmkvy',
    officialTrackingUrl: 'https://www.pmkvyofficial.org/',
    linksLastChecked: '9 October 2026',
  },
  'naps': {
    officialApplicationUrl: 'https://www.apprenticeshipindia.gov.in/',
    officialInformationUrl: 'https://www.apprenticeshipindia.gov.in/guidelines',
    officialTrackingUrl: 'https://www.apprenticeshipindia.gov.in/',
    linksLastChecked: '9 October 2026',
  },
  'nsp': {
    officialApplicationUrl: 'https://scholarships.gov.in/',
    officialInformationUrl: 'https://scholarships.gov.in/public/faq',
    officialTrackingUrl: 'https://scholarships.gov.in/',
    linksLastChecked: '9 October 2026',
  },
  'pmegp': {
    officialApplicationUrl: 'https://www.kviconline.gov.in/pmegpeportal/',
    officialInformationUrl: 'https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp',
    officialTrackingUrl: 'https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp',
    linksLastChecked: '9 October 2026',
  },
  'udyam': {
    officialApplicationUrl: 'https://udyamregistration.gov.in/',
    officialInformationUrl: 'https://udyamregistration.gov.in/Government-India/Ministry-MSME-registration.htm',
    officialTrackingUrl: 'https://udyamregistration.gov.in/PrintApplication.aspx',
    linksLastChecked: '9 October 2026',
  },
  'karnataka-raitha-siri': {
    officialApplicationUrl: 'https://fruits.karnataka.gov.in/',
    officialInformationUrl: 'https://raitamitra.karnataka.gov.in/',
    officialTrackingUrl: 'https://fruits.karnataka.gov.in/',
    linksLastChecked: '9 October 2026',
  },
  'karnataka-yuva-nidhi': {
    officialApplicationUrl: 'https://sevasindhugs.karnataka.gov.in/',
    officialInformationUrl: 'https://skilldevelopment.karnataka.gov.in/',
    officialTrackingUrl: 'https://sevasindhugs.karnataka.gov.in/',
    linksLastChecked: '9 October 2026',
  },
};

export function getSchemeLinks(schemeId: string): SchemeLinkEntry {
  return (
    SCHEME_LINKS[schemeId] || {
      officialApplicationUrl: DEFAULT_OFFICIAL_PORTAL,
      officialInformationUrl: DEFAULT_OFFICIAL_PORTAL,
      officialTrackingUrl: DEFAULT_OFFICIAL_PORTAL,
      linksLastChecked: '9 October 2026',
    }
  );
}

export function getOfficialTrackingUrl(schemeId: string): string {
  return SCHEME_LINKS[schemeId]?.officialTrackingUrl || DEFAULT_OFFICIAL_PORTAL;
}
