export interface SearchProfile {
  id: string;
  title: string;
  basicCriteria: {
    roleTitle: string;
    experienceLevel: string;
    industry: string;
    skills: string[];
  };
  hiringContext: {
    companyStage: string;
    milestones: string[];
    contributions: string;
    culturalValues: string[];
  };
  createdAt: string;
  status: 'active' | 'saved';
}

export interface AssessmentTemplate {
  id: string;
  title: string;
  type: 'technical' | 'behavioral' | 'cultural';
  duration: number;
  questions: {
    id: string;
    type: 'multiple-choice' | 'text' | 'coding';
    question: string;
    options?: string[];
  }[];
  createdAt: string;
  status: 'draft' | 'active';
}

export interface DashboardMetrics {
  activeSearches: number;
  savedAssessments: number;
  recentActivity: {
    id: string;
    type: 'search' | 'assessment';
    title: string;
    timestamp: string;
  }[];
} 