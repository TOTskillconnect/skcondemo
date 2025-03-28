import { HiringContextSuggestion } from './hiring-context';

export interface HiringContextQuestion {
  id: string;
  question: string;
  category: 'goal' | 'milestone' | 'accomplishment' | 'cultural-value';
  suggestions: HiringContextSuggestion[];
  roleSpecific?: string[];
  stageSpecific?: string[];
}

export const HIRING_CONTEXT_QUESTIONS: HiringContextQuestion[] = [
  {
    id: 'goals-1',
    question: 'What are your primary technical goals for the next 6 months?',
    category: 'goal',
    suggestions: [
      {
        id: 'scale-product',
        label: 'Scale an existing product',
        category: 'goal',
        description: 'Focus on scaling infrastructure and performance optimization'
      },
      {
        id: 'launch-mvp',
        label: 'Launch MVP',
        category: 'goal',
        description: 'Build and launch minimum viable product'
      },
      {
        id: 'improve-performance',
        label: 'Improve system performance',
        category: 'goal',
        description: 'Optimize application speed and efficiency'
      }
    ]
  },
  {
    id: 'milestones-1',
    question: 'What key milestones do you need to achieve?',
    category: 'milestone',
    suggestions: [
      {
        id: 'scale-users',
        label: 'Scale to 50K users',
        category: 'milestone',
        description: 'Grow user base to 50,000 active users'
      },
      {
        id: 'reach-arr',
        label: 'Reach $1M ARR',
        category: 'milestone',
        description: 'Achieve $1M annual recurring revenue'
      },
      {
        id: 'launch-features',
        label: 'Launch key features',
        category: 'milestone',
        description: 'Release critical product features'
      }
    ]
  },
  {
    id: 'accomplishments-1',
    question: 'What specific accomplishments would you like to see from this hire?',
    category: 'accomplishment',
    suggestions: [
      {
        id: 'improve-performance',
        label: 'Improve system performance',
        category: 'accomplishment',
        description: 'Enhance application speed and efficiency'
      },
      {
        id: 'automate-processes',
        label: 'Automate key processes',
        category: 'accomplishment',
        description: 'Implement automation for repetitive tasks'
      },
      {
        id: 'reduce-costs',
        label: 'Reduce infrastructure costs',
        category: 'accomplishment',
        description: 'Optimize and reduce cloud infrastructure costs'
      }
    ]
  },
  {
    id: 'cultural-1',
    question: 'What cultural values are important for this role?',
    category: 'cultural-value',
    suggestions: [
      {
        id: 'innovation',
        label: 'Innovation',
        category: 'cultural-value',
        description: 'Foster creative problem-solving and new ideas'
      },
      {
        id: 'collaboration',
        label: 'Collaboration',
        category: 'cultural-value',
        description: 'Promote teamwork and cross-functional cooperation'
      },
      {
        id: 'ownership',
        label: 'Ownership',
        category: 'cultural-value',
        description: 'Encourage taking responsibility and initiative'
      }
    ]
  },
  // Role-specific questions
  {
    id: 'frontend-goals',
    question: 'What frontend development goals do you have?',
    category: 'goal',
    roleSpecific: ['Frontend Developer', 'Full Stack Developer'],
    suggestions: [
      {
        id: 'improve-ux',
        label: 'Improve user experience',
        category: 'goal',
        description: 'Enhance UI/UX design and interactions'
      },
      {
        id: 'optimize-performance',
        label: 'Optimize frontend performance',
        category: 'goal',
        description: 'Improve page load times and responsiveness'
      },
      {
        id: 'implement-design-system',
        label: 'Implement design system',
        category: 'goal',
        description: 'Create and maintain consistent UI components'
      }
    ]
  },
  {
    id: 'backend-goals',
    question: 'What backend development goals do you have?',
    category: 'goal',
    roleSpecific: ['Backend Developer', 'Full Stack Developer'],
    suggestions: [
      {
        id: 'scale-api',
        label: 'Scale API infrastructure',
        category: 'goal',
        description: 'Build scalable API architecture'
      },
      {
        id: 'improve-reliability',
        label: 'Improve system reliability',
        category: 'goal',
        description: 'Enhance system uptime and stability'
      },
      {
        id: 'optimize-database',
        label: 'Optimize database performance',
        category: 'goal',
        description: 'Improve database efficiency and queries'
      }
    ]
  },
  // Stage-specific questions
  {
    id: 'seed-stage',
    question: 'What are your immediate technical priorities as a seed-stage startup?',
    category: 'goal',
    stageSpecific: ['Seed'],
    suggestions: [
      {
        id: 'build-mvp',
        label: 'Build MVP quickly',
        category: 'goal',
        description: 'Develop minimum viable product rapidly'
      },
      {
        id: 'validate-product',
        label: 'Validate product-market fit',
        category: 'goal',
        description: 'Test and validate product with early users'
      },
      {
        id: 'establish-foundation',
        label: 'Establish technical foundation',
        category: 'goal',
        description: 'Set up scalable technical infrastructure'
      }
    ]
  },
  {
    id: 'series-a',
    question: 'What technical challenges do you face as a Series A startup?',
    category: 'goal',
    stageSpecific: ['Series A'],
    suggestions: [
      {
        id: 'scale-infrastructure',
        label: 'Scale infrastructure',
        category: 'goal',
        description: 'Build scalable technical infrastructure'
      },
      {
        id: 'improve-reliability',
        label: 'Improve system reliability',
        category: 'goal',
        description: 'Enhance system stability and performance'
      },
      {
        id: 'expand-team',
        label: 'Expand engineering team',
        category: 'goal',
        description: 'Grow and structure engineering organization'
      }
    ]
  }
];

export function getHiringContextQuestions(
  role?: string,
  stage?: string
): HiringContextQuestion[] {
  return HIRING_CONTEXT_QUESTIONS.filter(question => {
    const matchesRole = !question.roleSpecific || 
      (role && question.roleSpecific.includes(role));
    const matchesStage = !question.stageSpecific || 
      (stage && question.stageSpecific.includes(stage));
    return matchesRole && matchesStage;
  });
} 