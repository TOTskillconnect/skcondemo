export interface Tag {
  id: string;
  label: string;
  category?: string;
  icon?: string;
}

export interface VerificationBadge {
  type: 'skill' | 'identity' | 'roleplay';
  label: string;
  icon: string;
  verifiedAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  title: string;
  photoUrl?: string;
  experience: {
    years: number;
    startupYears: number;
    notableProjects: string[];
  };
  skills: {
    technical: Tag[];
    soft: Tag[];
  };
  context: {
    startupStages: string[];
    industries: string[];
    achievements: string[];
    culturalValues?: string[];
    about?: string;
    experience?: Array<{
      title: string;
      company: string;
      description: string;
    }>;
    projects?: Array<{
      title: string;
      description: string;
      technologies: string[];
    }>;
    assessments?: Array<{
      title: string;
      description: string;
      score: number;
      completedAt: string;
    }>;
  };
  verification: VerificationBadge[];
  availability: {
    status: 'available' | 'interviewing' | 'hired';
    startDate?: string;
  };
  location: {
    city: string;
    country: string;
    remote: boolean;
  };
  matchScore: number;
  hiringContextMatchScore: number;
  lastVerified: string;
  hiringContext: {
    goal: string;
    companyStage: string;
    milestones: string[];
    accomplishments: string[];
    culturalValues: string[];
  };
}

export interface SearchFilters {
  roleTitle: string[];
  industry: string;
  experienceLevel: string;
  skills: string[];
  goal: string;
  companyStage: string;
  milestones: string[];
  accomplishments: string[];
  culturalValues: string[];
  context: string;
  verification: {
    requireSkillVerification: boolean;
    requireIdentityVerification: boolean;
    requireRoleplayVerification: boolean;
  };
  location: {
    cities: string[];
    remoteOnly: boolean;
  };
}

export interface SearchResultsState {
  candidates: Candidate[];
  filters: SearchFilters;
  sortBy: 'matchScore' | 'experience' | 'availability' | 'verification';
  sortOrder: 'asc' | 'desc';
  shortlist: string[]; // Array of candidate IDs
  viewMode: 'grid' | 'list';
  page: number;
  totalPages: number;
  totalCandidates: number;
}

export interface SearchWizardData {
  id?: string;
  name?: string;
  lastModified?: string;
  basicCriteria: {
    roleTitle: string[];
    industry: string;
    experienceLevel: string;
    skills: Tag[];
  };
  hiringContext: {
    goal: string;
    companyStage: string;
    milestones: Tag[];
    accomplishments: Tag[];
    culturalValues: Tag[];
    context: string;
  };
}

export interface SearchWizardStep {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export const SEARCH_WIZARD_STEPS: SearchWizardStep[] = [
  {
    id: 'basic-criteria',
    title: 'Basic Criteria',
    description: 'Define the role and required skills',
    icon: '🎯',
  },
  {
    id: 'hiring-context',
    title: 'Hiring Context',
    description: 'Set your company context and goals',
    icon: '🏢',
  },
  {
    id: 'preview',
    title: 'Preview & Confirm',
    description: 'Review and finalize your search criteria',
    icon: '✨',
  },
];

export interface SearchDraft {
  id: string;
  name: string;
  data: SearchWizardData;
  lastModified: string;
} 