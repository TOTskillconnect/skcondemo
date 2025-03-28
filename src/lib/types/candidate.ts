export interface Candidate {
  id: string;
  name: string;
  title: string;
  photoUrl?: string;
  location: {
    city: string;
    country: string;
    remote: boolean;
  };
  experience: {
    years: number;
    startupYears: number;
    notableProjects: string[];
    title: string;
    company: string;
    description: string;
  }[];
  skills: {
    technical: Array<{ id: string; label: string }>;
    soft: Array<{ id: string; label: string }>;
  };
  verification: Array<{
    type: string;
    date: string;
    score: number;
  }>;
  identityVerified: boolean;
  roleplayVerified: boolean;
  availability: {
    status: 'available' | 'interviewing' | 'hired';
    notice: string;
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
      name: string;
      description: string;
      technologies: string[];
      url?: string;
    }>;
    assessments?: Array<{
      type: string;
      score: number;
      date: string;
    }>;
  };
  hiringContextMatchScore: number;
  matchScore: number;
  lastVerified: string;
  hiringContext: {
    goal: string;
    companyStage: string;
    milestones: string[];
    accomplishments: string[];
    culturalValues: string[];
  };
} 