import { SearchProfile, AssessmentTemplate, DashboardMetrics } from '../types';

export const mockSearchProfiles: SearchProfile[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    basicCriteria: {
      roleTitle: 'Senior Frontend Developer',
      experienceLevel: '5+ years',
      industry: 'Fintech',
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    },
    hiringContext: {
      companyStage: 'Series A',
      milestones: ['Launch MVP', 'Scale to 50K users'],
      contributions: 'Lead frontend development and mentor junior developers',
      culturalValues: ['Innovation', 'Collaboration', 'Ownership'],
    },
    createdAt: '2024-03-21T10:00:00Z',
    status: 'active',
  },
  {
    id: '2',
    title: 'Product Manager',
    basicCriteria: {
      roleTitle: 'Product Manager',
      experienceLevel: '3+ years',
      industry: 'E-commerce',
      skills: ['Product Strategy', 'User Research', 'Agile', 'Data Analysis'],
    },
    hiringContext: {
      companyStage: 'Pre-seed',
      milestones: ['Product Launch', 'User Acquisition'],
      contributions: 'Drive product development and user growth',
      culturalValues: ['Customer Focus', 'Data-Driven', 'Innovation'],
    },
    createdAt: '2024-03-20T15:30:00Z',
    status: 'saved',
  },
];

export const mockAssessmentTemplates: AssessmentTemplate[] = [
  {
    id: '1',
    title: 'Frontend Technical Assessment',
    type: 'technical',
    duration: 120,
    questions: [
      {
        id: 'q1',
        type: 'coding',
        question: 'Implement a responsive navigation component using React and Tailwind CSS',
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'Which of the following is NOT a benefit of using TypeScript?',
        options: [
          'Static type checking',
          'Better IDE support',
          'Faster runtime performance',
          'Enhanced code documentation',
        ],
      },
    ],
    createdAt: '2024-03-21T09:00:00Z',
    status: 'active',
  },
  {
    id: '2',
    title: 'Product Manager Behavioral Assessment',
    type: 'behavioral',
    duration: 60,
    questions: [
      {
        id: 'q1',
        type: 'text',
        question: 'Describe a time when you had to make a difficult product decision. What was your thought process?',
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'How do you prioritize features when resources are limited?',
        options: [
          'Based on user feedback',
          'Using data analytics',
          'Following company strategy',
          'All of the above',
        ],
      },
    ],
    createdAt: '2024-03-20T14:00:00Z',
    status: 'draft',
  },
];

export const mockDashboardMetrics: DashboardMetrics = {
  activeSearches: 2,
  savedAssessments: 2,
  recentActivity: [
    {
      id: '1',
      type: 'search',
      title: 'Senior Frontend Developer',
      timestamp: '2024-03-21T10:00:00Z',
    },
    {
      id: '2',
      type: 'assessment',
      title: 'Frontend Technical Assessment',
      timestamp: '2024-03-21T09:00:00Z',
    },
    {
      id: '3',
      type: 'search',
      title: 'Product Manager',
      timestamp: '2024-03-20T15:30:00Z',
    },
  ],
}; 