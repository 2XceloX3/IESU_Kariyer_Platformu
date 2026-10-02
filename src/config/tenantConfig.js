/**
 * Centralized Multi-Tenant & Institution Branding Configuration.
 * 
 * Provides an enterprise white-label configuration engine allowing
 * the platform to be dynamically customized for any university or institution.
 */

export const DEFAULT_TENANT_CONFIG = {
  id: 'iesu',
  institutionName: 'İstanbul Esenyurt Üniversitesi',
  institutionShortName: 'İESÜ',
  coordinatorTitle: 'Kariyer Geliştirme Merkezi',
  portalTitle: 'İESÜ Mezunlar Portalı',
  motto: 'Kariyer ve İstihdam Ekosistemi',
  domain: 'esenyurt.edu.tr',
  supportEmail: 'kariyer@esenyurt.edu.tr',
  logoUrl: '/iesu-logo.svg',
  faviconUrl: '/iesu-logo.svg',
  foundedYear: '2013',
  address: 'Zafer Mah. Doğan Araslı Bulvarı No:79 Esenyurt / İstanbul',
  phone: '+90 212 444 91 23',
  colors: {
    primary: '#990000',
    primaryHover: '#7A0000',
    student: '#990000',
    alumni: '#059669',
    company: '#0A2342',
    academic: '#4C1D95',
    admin: '#D97706'
  },
  social: {
    linkedin: 'https://linkedin.com/school/esenyurt-universitesi',
    instagram: 'https://instagram.com/iesukariyer',
    twitter: 'https://twitter.com/iesukariyer'
  },
  features: {
    webrtcCalls: true,
    atsKanban: true,
    globalAlumniMap: true,
    aiCvBuilder: true,
    eDevletVerification: true,
    obsSync: true
  }
};

let currentConfig = { ...DEFAULT_TENANT_CONFIG };

export function getTenantConfig() {
  return currentConfig;
}

export function updateTenantConfig(newConfig) {
  currentConfig = {
    ...currentConfig,
    ...newConfig,
    colors: { ...currentConfig.colors, ...(newConfig.colors || {}) },
    features: { ...currentConfig.features, ...(newConfig.features || {}) },
    social: { ...currentConfig.social, ...(newConfig.social || {}) }
  };
  return currentConfig;
}
