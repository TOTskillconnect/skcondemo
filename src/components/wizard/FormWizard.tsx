'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from '@/components/common/ProgressBar';
import { SearchWizardData, Tag } from '@/lib/types/search';
import { ValidationError } from '@/lib/utils/validation';
import { 
  ROLE_TITLES, 
  ROLE_TITLES_TAGS,
  INDUSTRIES, 
  TECHNICAL_SKILLS_EXPANDED as TECHNICAL_SKILLS, 
  SOFT_SKILLS_EXPANDED as SOFT_SKILLS, 
  BUSINESS_SKILLS,
  COMPANY_STAGES, 
  HIRING_GOALS, 
  MILESTONE_OPTIONS, 
  ACCOMPLISHMENT_OPTIONS, 
  CULTURAL_VALUES 
} from '@/lib/utils/search';
import InteractiveTagInput from './InteractiveTagInput';
import { 
  ChevronRightIcon, 
  ChevronLeftIcon, 
  CheckCircleIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

// Define question types
type QuestionType = 'select' | 'tags' | 'review';

interface BaseQuestion {
  id: string;
  section: 'basicCriteria' | 'hiringContext' | 'review';
  title: string;
  description: string;
  type: QuestionType;
  required?: boolean;
  options?: string[];
  suggestions?: Tag[];
  maxTags?: number;
}

interface SelectQuestion extends BaseQuestion {
  type: 'select';
}

interface TagsQuestion extends BaseQuestion {
  type: 'tags';
}

interface ReviewQuestion extends BaseQuestion {
  type: 'review';
}

type Question = SelectQuestion | TagsQuestion | ReviewQuestion;

// Extend Tag interface for our relevance scoring
interface TagWithRelevance extends Tag {
  relevance?: number;
}

// Define all questions in a flat structure
const FORM_QUESTIONS: Question[] = [
  // Basic Criteria questions
  {
    id: 'roleTitle',
    section: 'basicCriteria',
    title: 'What role are you looking to fill?',
    description: 'The job title helps us match candidates with the right experience and skills. Specific roles like "Frontend Developer" or "Product Manager" work better than general terms.',
    required: true,
    type: 'select',
    options: ROLE_TITLES,
    suggestions: ROLE_TITLES_TAGS
  },
  {
    id: 'industry',
    section: 'basicCriteria',
    title: 'What industry is your company in?',
    description: 'We use this to find candidates with relevant domain experience. Candidates who understand your industry\'s specific challenges can contribute faster to your team.',
    required: false,
    type: 'select',
    options: INDUSTRIES
  },
  {
    id: 'experienceLevel',
    section: 'basicCriteria',
    title: 'What experience level are you looking for?',
    description: 'Select the years of experience you expect for this role. This helps us filter candidates with the right seniority level and salary expectations.',
    required: false,
    type: 'select',
    options: ['Entry Level (0-2 years)', 'Mid Level (2-5 years)', 'Senior Level (5-8 years)', 'Lead (8+ years)']
  },
  {
    id: 'skills',
    section: 'basicCriteria',
    title: 'What skills are required for this role?',
    description: 'Add up to 5 technical and soft skills that are crucial for success. Focus on must-have skills rather than nice-to-haves for better matches. We\'ll suggest relevant skills based on the role.',
    required: false,
    type: 'tags',
    maxTags: 5
  },
  
  // Hiring Context questions
  {
    id: 'goal',
    section: 'hiringContext',
    title: 'What is your primary hiring goal?',
    description: 'Understanding your objectives helps us find candidates who align with your specific needs. Different goals (building a new team vs. adding specialized expertise) require different candidate profiles.',
    required: false,
    type: 'select',
    options: HIRING_GOALS
  },
  {
    id: 'companyStage',
    section: 'hiringContext',
    title: 'What stage is your company in?',
    description: 'Different growth stages require different types of candidates. Early-stage companies often need generalists who can wear multiple hats, while later stages might need specialists.',
    required: false,
    type: 'select',
    options: COMPANY_STAGES
  },
  {
    id: 'milestones',
    section: 'hiringContext',
    title: 'What key milestones should this hire help achieve?',
    description: 'Select up to 3 business milestones this role will contribute to. This helps us find candidates who have experience with similar objectives and can drive these outcomes.',
    required: false,
    type: 'tags',
    maxTags: 3
  },
  {
    id: 'accomplishments',
    section: 'hiringContext',
    title: 'What should this person accomplish?',
    description: 'Select up to 3 specific outcomes you expect from this hire. We\'ll match candidates with a track record of similar accomplishments, indicating they can deliver what you need.',
    required: false,
    type: 'tags',
    maxTags: 3
  },
  {
    id: 'culturalValues',
    section: 'hiringContext',
    title: 'What cultural values matter most for this role?',
    description: 'Select up to 3 values that will help this person thrive in your company culture. Cultural fit is crucial for long-term retention and team cohesion.',
    required: false,
    type: 'tags',
    maxTags: 3
  }
];

// Add final review step
const STEPS: Question[] = [
  ...FORM_QUESTIONS,
  {
    id: 'review',
    section: 'review',
    title: 'Review Your Search Criteria',
    description: 'Make sure everything looks right before we find your candidates.',
    type: 'review'
  }
];

interface FormWizardProps {
  initialData?: SearchWizardData;
  onComplete: (data: SearchWizardData) => void;
  onDataChange?: (data: SearchWizardData) => void;
}

export default function FormWizard({ initialData, onComplete, onDataChange }: FormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [data, setData] = useState<SearchWizardData>(initialData || {
    basicCriteria: {
      roleTitle: [] as string[],
      industry: '',
      experienceLevel: '',
      skills: [] as Tag[],
    },
    hiringContext: {
      goal: '',
      companyStage: '',
      milestones: [] as Tag[],
      accomplishments: [] as Tag[],
      culturalValues: [] as Tag[],
      context: '',
    },
  });
  const [error, setError] = useState<string | null>(null);
  const [summaryExpanded, setSummaryExpanded] = useState(true);

  // New state for filtered suggestions
  const [filteredSkills, setFilteredSkills] = useState<Tag[]>([]);
  const [filteredMilestones, setFilteredMilestones] = useState<Tag[]>(MILESTONE_OPTIONS);
  const [filteredAccomplishments, setFilteredAccomplishments] = useState<Tag[]>(ACCOMPLISHMENT_OPTIONS);

  useEffect(() => {
    if (onDataChange) {
      onDataChange(data);
    }
  }, [data, onDataChange]);

  // Filter skills based on selected role title
  useEffect(() => {
    const roleTitles = data.basicCriteria.roleTitle.map((title: string) => title.toLowerCase());
    let relevantSkills: Tag[] = [...TECHNICAL_SKILLS, ...SOFT_SKILLS, ...BUSINESS_SKILLS];
    
    if (roleTitles.length > 0) {
      // Technical roles
      if (roleTitles.some((title: string) => title.includes('developer') || title.includes('engineer') || title.includes('architect'))) {
        // For technical roles, prioritize technical skills but include some soft skills
        const techSkills = TECHNICAL_SKILLS.filter(skill => {
          // Frontend specific
          if (roleTitles.some((title: string) => title.includes('frontend') || title.includes('front end') || title.includes('ui')) && 
              (skill.label.toLowerCase().includes('react') || 
               skill.label.toLowerCase().includes('vue') || 
               skill.label.toLowerCase().includes('angular'))) {
            return true;
          }
          
          // Backend specific
          if (roleTitles.some((title: string) => title.includes('backend') || title.includes('back end') || title.includes('api')) && 
              (skill.label.toLowerCase().includes('node') || 
               skill.label.toLowerCase().includes('python') || 
               skill.label.toLowerCase().includes('java'))) {
            return true;
          }
          
          // Full stack
          if (roleTitles.some((title: string) => title.includes('full stack') || title.includes('fullstack'))) {
            return true;
          }
          
          // DevOps/Cloud specific
          if (roleTitles.some((title: string) => title.includes('devops') || title.includes('cloud') || title.includes('infrastructure')) && 
              (skill.label.toLowerCase().includes('aws') || 
               skill.label.toLowerCase().includes('azure') || 
               skill.label.toLowerCase().includes('gcp'))) {
            return true;
          }
          
          // Data science specific
          if (roleTitles.some((title: string) => title.includes('data') || title.includes('ml') || title.includes('machine learning') || title.includes('ai')) && 
              (skill.label.toLowerCase().includes('python') || 
               skill.label.toLowerCase().includes('r') || 
               skill.label.toLowerCase().includes('tensorflow'))) {
            return true;
          }
          
          // Mobile specific
          if (roleTitles.some((title: string) => title.includes('mobile') || title.includes('ios') || title.includes('android')) && 
              (skill.label.toLowerCase().includes('react native') || 
               skill.label.toLowerCase().includes('flutter') || 
               skill.label.toLowerCase().includes('swift'))) {
            return true;
          }
          
          return false;
        });
        
        // Include some soft skills for technical roles
        const someSoftSkills = SOFT_SKILLS.filter(() => Math.random() > 0.7);
        relevantSkills = [...techSkills, ...someSoftSkills];
      } 
      // Product/Project Management roles
      else if (roleTitles.some((title: string) => title.includes('product') || title.includes('project') || title.includes('manager'))) {
        // For PM roles, prioritize business and soft skills 
        const relevantBizSkills = BUSINESS_SKILLS.filter(skill =>
          skill.label.toLowerCase().includes('product') ||
          skill.label.toLowerCase().includes('project') ||
          skill.label.toLowerCase().includes('agile') ||
          skill.label.toLowerCase().includes('scrum')
        );
        
        const relevantSoftSkills = SOFT_SKILLS.filter(skill =>
          skill.label.toLowerCase().includes('communication') ||
          skill.label.toLowerCase().includes('leadership') ||
          skill.label.toLowerCase().includes('stakeholder')
        );
        
        relevantSkills = [...relevantBizSkills, ...relevantSoftSkills];
      }
      // Leadership roles
      else if (roleTitles.some((title: string) => title.includes('cto') || title.includes('director') || title.includes('vp') || title.includes('lead') || title.includes('head'))) {
        // For leadership roles, prioritize management, strategic, and soft skills
        const relevantSoftSkills = SOFT_SKILLS.filter(skill =>
          skill.label.toLowerCase().includes('leadership') ||
          skill.label.toLowerCase().includes('management') ||
          skill.label.toLowerCase().includes('strategy') ||
          skill.label.toLowerCase().includes('vision')
        );
        
        // Include some technical skills for technical leadership
        const someTechSkills = TECHNICAL_SKILLS.filter(skill =>
          roleTitles.some((title: string) => title.includes('cto') || title.includes('technical')) ? true : Math.random() > 0.8
        );
        
        relevantSkills = [...relevantSoftSkills, ...someTechSkills];
      }
    }
    
    setFilteredSkills(relevantSkills);
  }, [data.basicCriteria.roleTitle]);

  // Filter milestones and accomplishments based on hiring context
  useEffect(() => {
    // Filter milestones based on company stage and goal
    const companyStage = data.hiringContext.companyStage.toLowerCase();
    const goal = data.hiringContext.goal.toLowerCase();
    
    // Filter milestones
    let contextRelevantMilestones = [...MILESTONE_OPTIONS];
    
    if (companyStage || goal) {
      contextRelevantMilestones = MILESTONE_OPTIONS.filter(milestone => {
        const milestoneLabel = milestone.label.toLowerCase();
        
        // Early-stage relevant milestones
        if ((companyStage.includes('pre-seed') || companyStage.includes('seed')) && 
            (milestoneLabel.includes('product launch') || 
             milestoneLabel.includes('funding') || 
             milestoneLabel.includes('mvp') ||
             milestoneLabel.includes('user growth'))) {
          return true;
        }
        
        // Growth-stage relevant milestones
        if ((companyStage.includes('series a') || companyStage.includes('series b')) && 
            (milestoneLabel.includes('market expansion') || 
             milestoneLabel.includes('revenue') || 
             milestoneLabel.includes('scaling') ||
             milestoneLabel.includes('growth'))) {
          return true;
        }
        
        // Late-stage relevant milestones
        if ((companyStage.includes('series c') || companyStage.includes('mature')) && 
            (milestoneLabel.includes('ipo') || 
             milestoneLabel.includes('acquisition') || 
             milestoneLabel.includes('profitability') ||
             milestoneLabel.includes('international'))) {
          return true;
        }
        
        // Goal-specific milestones
        if (goal.includes('build') && milestoneLabel.includes('team')) return true;
        if (goal.includes('scale') && milestoneLabel.includes('growth')) return true;
        if (goal.includes('expand') && milestoneLabel.includes('market')) return true;
        if (goal.includes('launch') && milestoneLabel.includes('product')) return true;
        
        // Keep some random milestones
        return Math.random() > 0.6;
      });
    }
    
    setFilteredMilestones(contextRelevantMilestones);
    
    // Filter accomplishments based on role title, company stage and goal
    const roleTitles = data.basicCriteria.roleTitle.map((title: string) => title.toLowerCase());
    let contextRelevantAccomplishments = [...ACCOMPLISHMENT_OPTIONS];
    
    if (roleTitles.length > 0 || companyStage || goal) {
      contextRelevantAccomplishments = ACCOMPLISHMENT_OPTIONS.filter(accomplishment => {
        const accomplishmentLabel = accomplishment.label.toLowerCase();
        
        // Technical role accomplishments
        if (roleTitles.some((title: string) => title.includes('developer') || title.includes('engineer')) && 
            (accomplishmentLabel.includes('code') || 
             accomplishmentLabel.includes('system') || 
             accomplishmentLabel.includes('architecture'))) {
          return true;
        }
        
        // Product role accomplishments
        if (roleTitles.some((title: string) => title.includes('product')) && 
            (accomplishmentLabel.includes('product') || 
             accomplishmentLabel.includes('roadmap') || 
             accomplishmentLabel.includes('strategy'))) {
          return true;
        }
        
        // Leadership role accomplishments
        if (roleTitles.some((title: string) => title.includes('lead') || title.includes('manager') || title.includes('director')) && 
            (accomplishmentLabel.includes('team') || 
             accomplishmentLabel.includes('strategy') || 
             accomplishmentLabel.includes('growth'))) {
          return true;
        }
        
        // Early-stage company accomplishments
        if ((companyStage.includes('pre-seed') || companyStage.includes('seed')) && 
            (accomplishmentLabel.includes('launch') || 
             accomplishmentLabel.includes('mvp') || 
             accomplishmentLabel.includes('first'))) {
          return true;
        }
        
        // Growth-stage company accomplishments
        if (companyStage.includes('series') && 
            (accomplishmentLabel.includes('scale') || 
             accomplishmentLabel.includes('growth') || 
             accomplishmentLabel.includes('improve'))) {
          return true;
        }
        
        // Keep some random accomplishments
        return Math.random() > 0.7;
      });
    }
    
    setFilteredAccomplishments(contextRelevantAccomplishments);
    
  }, [data.hiringContext.companyStage, data.hiringContext.goal, data.basicCriteria.roleTitle]);

  const handleNext = () => {
    const currentQuestion = STEPS[currentStep];
    
    // Validate current field if required
    if (currentQuestion.required) {
      const value = getFieldValue(currentQuestion.id, currentQuestion.section);
      
      if (!value || (Array.isArray(value) && value.length === 0)) {
        setError(`This field is required`);
        return;
      }
    }
    
    setError(null);
    
    if (currentStep < STEPS.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const getFieldValue = (fieldId: string, section: string) => {
    if (section === 'basicCriteria') {
      return data.basicCriteria[fieldId as keyof typeof data.basicCriteria];
    } else if (section === 'hiringContext') {
      return data.hiringContext[fieldId as keyof typeof data.hiringContext];
    }
    return null;
  };

  const updateField = (fieldId: string, section: string, value: any) => {
    if (section === 'basicCriteria') {
      setData({
        ...data,
        basicCriteria: {
          ...data.basicCriteria,
          [fieldId]: value,
        },
      });
    } else if (section === 'hiringContext') {
      setData({
        ...data,
        hiringContext: {
          ...data.hiringContext,
          [fieldId]: value,
        },
      });
    }
  };

  // Animation variants
  const cardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  // Helper function to check if a section has any filled values
  const sectionHasValues = (section: 'basicCriteria' | 'hiringContext'): boolean => {
    const sectionData = data[section];
    return Object.keys(sectionData).some(key => {
      const value = sectionData[key as keyof typeof sectionData];
      return value && (typeof value === 'string' ? value !== '' : (value as any).length > 0);
    });
  };

  // Determine if we have any selections to show in the summary
  const hasAnySelections = (): boolean => {
    return sectionHasValues('basicCriteria') || sectionHasValues('hiringContext');
  };

  // Determine which section the current question belongs to
  const getCurrentSection = (): 'basicCriteria' | 'hiringContext' | 'review' => {
    return STEPS[currentStep].section;
  };

  const renderReviewContent = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-border p-6">
        <h3 className="text-xl font-semibold text-primary mb-6">Search Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Basic Criteria Review */}
          <div>
            <h4 className="text-lg font-medium text-primary mb-4">Role Details</h4>
            <div className="space-y-4">
              {data.basicCriteria.roleTitle && data.basicCriteria.roleTitle.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-secondary">Role Titles</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.basicCriteria.roleTitle.map((title) => (
                      <span
                        key={title}
                        className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-primary"
                      >
                        {title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {data.basicCriteria.industry && (
                <div>
                  <p className="text-sm font-medium text-secondary">Industry</p>
                  <p className="text-base text-primary">{data.basicCriteria.industry}</p>
                </div>
              )}
              
              {data.basicCriteria.experienceLevel && (
                <div>
                  <p className="text-sm font-medium text-secondary">Experience Level</p>
                  <p className="text-base text-primary">{data.basicCriteria.experienceLevel}</p>
                </div>
              )}
              
              {data.basicCriteria.skills && data.basicCriteria.skills.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-secondary">Required Skills</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.basicCriteria.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-primary"
                      >
                        {skill.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Hiring Context Review */}
          <div>
            <h4 className="text-lg font-medium text-primary mb-4">Hiring Context</h4>
            <div className="space-y-4">
              {data.hiringContext.goal && (
                <div>
                  <p className="text-sm font-medium text-secondary">Primary Goal</p>
                  <p className="text-base text-primary">{data.hiringContext.goal}</p>
                </div>
              )}
              
              {data.hiringContext.companyStage && (
                <div>
                  <p className="text-sm font-medium text-secondary">Company Stage</p>
                  <p className="text-base text-primary">{data.hiringContext.companyStage}</p>
                </div>
              )}

              {data.hiringContext.context && (
                <div>
                  <p className="text-sm font-medium text-secondary">Context Description</p>
                  <p className="text-base text-primary">{data.hiringContext.context}</p>
                </div>
              )}
              
              {data.hiringContext.milestones && data.hiringContext.milestones.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-secondary">Key Milestones</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.hiringContext.milestones.map((milestone) => (
                      <span
                        key={milestone.id}
                        className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-primary"
                      >
                        {milestone.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {data.hiringContext.accomplishments && data.hiringContext.accomplishments.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-secondary">Expected Accomplishments</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.hiringContext.accomplishments.map((accomplishment) => (
                      <span
                        key={accomplishment.id}
                        className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-primary"
                      >
                        {accomplishment.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {data.hiringContext.culturalValues && data.hiringContext.culturalValues.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-secondary">Cultural Values</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.hiringContext.culturalValues.map((value) => (
                      <span
                        key={value.id}
                        className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-primary"
                      >
                        {value.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={handleBack}
            className="px-4 py-2 text-secondary hover:text-primary flex items-center"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-1" />
            Back
          </button>
          <button
            onClick={() => onComplete(data)}
            className="px-6 py-2 bg-accent-blue text-white rounded-md hover:bg-accent-blue/90 flex items-center"
          >
            Find Candidates
            <CheckCircleIcon className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    );
  };

  // Render the selection summary panel
  const renderSelectionSummary = () => {
    if (!hasAnySelections()) {
      return (
        <div className="mb-4 p-4 bg-white rounded-lg border border-[#e5e7eb] text-center">
          <p className="text-secondary text-sm">Make selections to see your search criteria here</p>
        </div>
      );
    }

    const currentSection = getCurrentSection();
    
    return (
      <div className="p-4 bg-white rounded-lg border border-[#e5e7eb] max-w-2xl mx-auto">
        {/* Two-column layout for selections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Criteria Section */}
          {sectionHasValues('basicCriteria') && (
            <div className={`${currentSection === 'basicCriteria' ? 'relative after:absolute after:left-0 after:top-0 after:h-full after:w-1 after:bg-accent-blue after:rounded-full' : ''} pl-4`}>
              <h4 className="text-primary font-medium text-sm mb-3 uppercase tracking-wide">
                Basic Criteria
              </h4>
              <div className="space-y-2">
                {data.basicCriteria.roleTitle && data.basicCriteria.roleTitle.length > 0 && (
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-accent-blue mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-secondary">Role Titles: </span>
                      <span className="text-sm text-primary">
                        {data.basicCriteria.roleTitle.join(', ')}
                      </span>
                    </div>
                  </div>
                )}
                
                {data.basicCriteria.industry && (
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-accent-blue mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-secondary">Industry: </span>
                      <span className="text-sm text-primary">{data.basicCriteria.industry}</span>
                    </div>
                  </div>
                )}
                
                {data.basicCriteria.experienceLevel && (
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-accent-blue mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-secondary">Experience: </span>
                      <span className="text-sm text-primary">{data.basicCriteria.experienceLevel}</span>
                    </div>
                  </div>
                )}
                
                {data.basicCriteria.skills && data.basicCriteria.skills.length > 0 && (
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-accent-blue mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-secondary">Skills: </span>
                      <span className="text-sm text-primary">
                        {data.basicCriteria.skills.map(skill => skill.label).join(', ')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Hiring Context Section */}
          {sectionHasValues('hiringContext') && (
            <div className={`${currentSection === 'hiringContext' ? 'relative after:absolute after:left-0 after:top-0 after:h-full after:w-1 after:bg-accent-blue after:rounded-full' : ''} pl-4`}>
              <h4 className="text-primary font-medium text-sm mb-3 uppercase tracking-wide">
                Hiring Context
              </h4>
              <div className="space-y-2">
                {data.hiringContext.goal && (
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-accent-blue mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-secondary">Goal: </span>
                      <span className="text-sm text-primary">{data.hiringContext.goal}</span>
                    </div>
                  </div>
                )}
                
                {data.hiringContext.companyStage && (
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-accent-blue mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-secondary">Company Stage: </span>
                      <span className="text-sm text-primary">{data.hiringContext.companyStage}</span>
                    </div>
                  </div>
                )}
                
                {data.hiringContext.milestones && data.hiringContext.milestones.length > 0 && (
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-accent-blue mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-secondary">Milestones: </span>
                      <span className="text-sm text-primary">
                        {data.hiringContext.milestones.map(item => item.label).join(', ')}
                      </span>
                    </div>
                  </div>
                )}
                
                {data.hiringContext.accomplishments && data.hiringContext.accomplishments.length > 0 && (
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-accent-blue mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-secondary">Accomplishments: </span>
                      <span className="text-sm text-primary">
                        {data.hiringContext.accomplishments.map(item => item.label).join(', ')}
                      </span>
                    </div>
                  </div>
                )}
                
                {data.hiringContext.culturalValues && data.hiringContext.culturalValues.length > 0 && (
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-accent-blue mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-secondary">Cultural Values: </span>
                      <span className="text-sm text-primary">
                        {data.hiringContext.culturalValues.map(item => item.label).join(', ')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Show/Hide toggle only on mobile */}
        <div className="md:hidden mt-4 text-center">
          <button 
            className="text-xs text-secondary hover:text-primary transition-colors inline-flex items-center"
            onClick={() => setSummaryExpanded(!summaryExpanded)}
          >
            {summaryExpanded ? (
              <>
                <span>Hide details ▲</span>
              </>
            ) : (
              <>
                <span>Show details ▼</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderField = (field: Question) => {
    switch (field.type) {
      case 'select':
        const selectFieldValue = field.section === 'basicCriteria' 
          ? data.basicCriteria[field.id as keyof typeof data.basicCriteria]
          : data.hiringContext[field.id as keyof typeof data.hiringContext];
        
        // Make sure we always pass a string value to select, not an array or Tag object
        let finalSelectValue = '';
        
        if (Array.isArray(selectFieldValue)) {
          finalSelectValue = selectFieldValue.length > 0 ? String(selectFieldValue[0]) : '';
        } else if (typeof selectFieldValue === 'object' && selectFieldValue !== null) {
          finalSelectValue = 'label' in selectFieldValue ? String(selectFieldValue.label) : '';
        } else if (selectFieldValue !== null && selectFieldValue !== undefined) {
          finalSelectValue = String(selectFieldValue);
        }
        
        return (
          <select
            value={finalSelectValue}
            onChange={(e) => updateField(field.id, field.section, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select {field.title}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'tags':
        if (field.id === 'roleTitle') {
          const currentValue = data.basicCriteria.roleTitle;
          const roleTitleTag = currentValue.map(title => ({
            id: title.toLowerCase().replace(/\s+/g, '-'),
            label: title,
            category: ROLE_TITLES_TAGS.find(role => role.label === title)?.category || ''
          }));

          return (
            <InteractiveTagInput
              tags={roleTitleTag}
              onTagsChange={(tags) => {
                const selectedCategory = tags[0]?.category;
                if (tags.length > 0 && !selectedCategory) {
                  toast.error('Invalid role selection');
                  return;
                }
                if (tags.length > 1 && tags.some(tag => tag.category !== selectedCategory)) {
                  toast.error('You can only select roles from the same category');
                  return;
                }
                updateField(field.id, field.section, tags.map(tag => tag.label));
              }}
              suggestions={ROLE_TITLES_TAGS}
              placeholder="Type to search for role titles..."
              maxTags={5}
              allowCustom={false}
            />
          );
        }

        const tagsFieldValue = field.section === 'basicCriteria'
          ? data.basicCriteria[field.id as keyof typeof data.basicCriteria]
          : data.hiringContext[field.id as keyof typeof data.hiringContext];

        return (
          <InteractiveTagInput
            tags={tagsFieldValue as Tag[] || []}
            onTagsChange={(tags) => updateField(field.id, field.section, tags)}
            suggestions={field.suggestions || []}
            placeholder={`Type to search for ${field.title.toLowerCase()}...`}
            maxTags={field.maxTags || 3}
          />
        );
      case 'review':
        return renderReviewContent();
      default:
        return null;
    }
  };

  const currentQuestion = STEPS[currentStep];

  return (
    <div className="bg-[#f9fafb] min-h-[600px] w-full max-w-3xl mx-auto">
      <div className="mb-8">
        <ProgressBar 
          steps={STEPS.length} 
          currentStep={currentStep} 
          colors={{
            completed: '#3B82F6',
            current: '#3B82F6',
            pending: '#e5e7eb'
          }}
        />
      </div>

      <div className="min-h-[400px] flex flex-col gap-6">
        {/* Form Content */}
        <div className="w-full mx-auto">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              <div className="bg-white rounded-xl p-8 shadow-md border border-[#e5e7eb] max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-primary mb-2">
                  {currentQuestion.title}
                </h2>
                <p className="text-secondary mb-6">
                  {currentQuestion.description}
                </p>
                
                <div className="mb-6">
                  {renderField(currentQuestion)}
                </div>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {error}
                  </div>
                )}
                
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className={`
                      px-6 py-3 rounded-lg font-medium transition-all duration-200
                      ${currentStep === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-primary border border-[#e5e7eb] hover:border-blue-500 hover:text-blue-500'
                      }
                    `}
                  >
                    Back
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleNext}
                    className={`
                      px-6 py-3 rounded-lg font-medium text-white transition-all duration-200
                      bg-blue-500 hover:bg-blue-600
                    `}
                  >
                    {currentStep === STEPS.length - 1 ? 'Complete Search' : 'Continue'}
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Selection Summary Panel - Below the form */}
        {hasAnySelections() && (
          <div className="w-full max-w-2xl mx-auto mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-[#e5e7eb] pt-6"
            >
              <h3 className="text-primary font-semibold mb-4 text-center text-lg">Your Selections</h3>
              {renderSelectionSummary()}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
} 