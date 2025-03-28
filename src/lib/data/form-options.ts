import { 
  ROLE_TITLES, 
  INDUSTRIES, 
  TECHNICAL_SKILLS_EXPANDED,
  SOFT_SKILLS_EXPANDED,
  BUSINESS_SKILLS,
  CULTURAL_VALUES,
  COMPANY_STAGES,
  HIRING_GOALS,
  MILESTONE_OPTIONS,
  ACCOMPLISHMENT_OPTIONS
} from '@/lib/utils/search';

export interface RoleOption {
  value: string;
  label: string;
  description: string;
  icon: string;
  category: string;
  relatedSkills: string[];
  typicalResponsibilities: string[];
}

export interface IndustryOption {
  value: string;
  label: string;
  description: string;
  icon: string;
  category: string;
  subcategories: string[];
  relatedRoles: string[];
}

export interface ExperienceOption {
  value: string;
  label: string;
  description: string;
  icon: string;
  category: string;
  typicalResponsibilities: string[];
  salaryRange: string;
}

export interface SkillOption {
  id: string;
  label: string;
  description: string;
  icon: string;
  category: string;
  popularity: number;
  relatedSkills: string[];
}

export interface CompanyStageOption {
  value: string;
  label: string;
  description: string;
  icon: string;
  typicalChallenges: string[];
  hiringNeeds: string[];
}

export interface HiringGoalOption {
  value: string;
  label: string;
  description: string;
  icon: string;
  typicalTimeline: string;
  keyConsiderations: string[];
}

export interface HiringContextSuggestion {
  id: string;
  label: string;
  category: string;
  icon?: string;
}

// Role options for the wizard
export const ROLE_OPTIONS = ROLE_TITLES.map(role => ({
  id: role.toLowerCase().replace(/\s+/g, '-'),
  label: role
}));

// Industry options for the wizard
export const INDUSTRY_OPTIONS = INDUSTRIES.map(industry => ({
  id: industry.toLowerCase().replace(/\s+/g, '-'),
  label: industry
}));

// Experience level options
export const EXPERIENCE_OPTIONS = [
  { id: 'entry', label: 'Entry Level (0-2 years)' },
  { id: 'mid', label: 'Mid Level (2-5 years)' },
  { id: 'senior', label: 'Senior Level (5-8 years)' },
  { id: 'lead', label: 'Lead (8+ years)' }
];

// Combined technical, soft, and business skills for the wizard
export const SKILL_OPTIONS = [
  ...TECHNICAL_SKILLS_EXPANDED,
  ...SOFT_SKILLS_EXPANDED,
  ...BUSINESS_SKILLS
];

// Company stage options for the wizard
export const COMPANY_STAGE_OPTIONS = COMPANY_STAGES.map(stage => ({
  id: stage.toLowerCase().replace(/\s+/g, '-'),
  label: stage
}));

// Hiring goal options for the wizard
export const HIRING_GOAL_OPTIONS = HIRING_GOALS.map(goal => ({
  id: goal.toLowerCase().replace(/\s+/g, '-'),
  label: goal
}));

// Hiring goal suggestions for the tag input
export const HIRING_GOAL_SUGGESTIONS = HIRING_GOALS.map(goal => ({
  id: goal.toLowerCase().replace(/\s+/g, '-'),
  label: goal,
  category: 'goal'
}));

// Milestone suggestions for the tag input
export const MILESTONE_SUGGESTIONS = MILESTONE_OPTIONS;

// Accomplishment suggestions for the tag input
export const ACCOMPLISHMENT_SUGGESTIONS = ACCOMPLISHMENT_OPTIONS;

// Cultural value suggestions for the tag input
export const CULTURAL_VALUE_SUGGESTIONS = CULTURAL_VALUES; 