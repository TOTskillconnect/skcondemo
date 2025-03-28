import { SearchProfile, AssessmentTemplate } from '../types';

const STORAGE_KEYS = {
  SEARCH_PROFILES: 'search_profiles',
  ASSESSMENT_TEMPLATES: 'assessment_templates',
} as const;

export const storage = {
  getSearchProfiles: (): SearchProfile[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.SEARCH_PROFILES);
    return data ? JSON.parse(data) : [];
  },

  saveSearchProfile: (profile: SearchProfile): void => {
    if (typeof window === 'undefined') return;
    const profiles = storage.getSearchProfiles();
    const updatedProfiles = [...profiles, profile];
    localStorage.setItem(STORAGE_KEYS.SEARCH_PROFILES, JSON.stringify(updatedProfiles));
  },

  getAssessmentTemplates: (): AssessmentTemplate[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENT_TEMPLATES);
    return data ? JSON.parse(data) : [];
  },

  saveAssessmentTemplate: (template: AssessmentTemplate): void => {
    if (typeof window === 'undefined') return;
    const templates = storage.getAssessmentTemplates();
    const updatedTemplates = [...templates, template];
    localStorage.setItem(STORAGE_KEYS.ASSESSMENT_TEMPLATES, JSON.stringify(updatedTemplates));
  },

  // Initialize mock data if storage is empty
  initializeMockData: (): void => {
    if (typeof window === 'undefined') return;
    
    if (!localStorage.getItem(STORAGE_KEYS.SEARCH_PROFILES)) {
      localStorage.setItem(STORAGE_KEYS.SEARCH_PROFILES, JSON.stringify([]));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.ASSESSMENT_TEMPLATES)) {
      localStorage.setItem(STORAGE_KEYS.ASSESSMENT_TEMPLATES, JSON.stringify([]));
    }
  },
}; 