import { Candidate } from "@/lib/types/search";
import { MOCK_CANDIDATES } from "@/data/mock-candidates";

// Randomly select 3-5 candidates for each assessment report
const getRandomCandidates = () => {
  const shuffled = [...MOCK_CANDIDATES].sort(() => 0.5 - Math.random());
  const count = Math.floor(Math.random() * 3) + 3; // 3-5 candidates
  return shuffled.slice(0, count).map(candidate => ({
    ...candidate,
    assessmentId: Math.floor(Math.random() * 5) + 1, // Random assessment ID between 1-5
    assessmentStatus: getRandomStatus(),
    contextFitScore: Math.floor(Math.random() * 31) + 70, // 70-100
    roleFitScore: Math.floor(Math.random() * 31) + 70, // 70-100
    completionTime: Math.floor(Math.random() * 60) + 30, // 30-90 minutes
    strengths: getRandomStrengths(),
    improvement: getRandomImprovements(),
    technicalScore: Math.floor(Math.random() * 31) + 70, // 70-100
    communicationScore: Math.floor(Math.random() * 31) + 70, // 70-100
    problemSolvingScore: Math.floor(Math.random() * 31) + 70, // 70-100
    culturalFitScore: Math.floor(Math.random() * 31) + 70, // 70-100
    detailedResponses: getRandomResponses(),
  }));
};

const getRandomStatus = () => {
  const statuses = ['completed', 'in_progress', 'pending'];
  const weights = [0.7, 0.2, 0.1]; // 70% completed, 20% in progress, 10% pending
  const random = Math.random();
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random < sum) return statuses[i];
  }
  return statuses[0];
};

const getRandomStrengths = () => {
  const allStrengths = [
    'Strong problem decomposition',
    'Excellent code quality',
    'Clear communication',
    'Detailed explanations',
    'Efficient solutions',
    'Creative approach',
    'Great attention to edge cases',
    'Strong technical knowledge',
    'Excellent understanding of context',
    'Insightful questions',
    'Great time management'
  ];
  
  const shuffled = [...allStrengths].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 3) + 2); // 2-4 strengths
};

const getRandomImprovements = () => {
  const allImprovements = [
    'Consider edge cases more thoroughly',
    'Explain reasoning more clearly',
    'Improve code efficiency',
    'Better understanding of business context needed',
    'More attention to detail required',
    'Could improve technical depth',
    'Needs better time management',
    'Communication could be clearer',
    'Should ask more clarifying questions'
  ];
  
  const shuffled = [...allImprovements].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 2) + 1); // 1-2 improvements
};

const getRandomResponses = () => {
  return [
    {
      question: 'Describe your approach to solving the given problem',
      answer: 'I first analyzed the requirements thoroughly to understand the context. Then, I broke down the problem into smaller components and addressed each one systematically.',
      score: Math.floor(Math.random() * 31) + 70 // 70-100
    },
    {
      question: 'How would you implement this solution in a production environment?',
      answer: 'For production, I would ensure proper error handling, add comprehensive logging, implement automated testing, and set up monitoring to track performance and issues.',
      score: Math.floor(Math.random() * 31) + 70 // 70-100
    },
    {
      question: 'How does your solution address the specific business context?',
      answer: 'My solution directly addresses the target users\' needs by focusing on the key pain points mentioned in the context. I prioritized features that would deliver the most value based on the described business goals.',
      score: Math.floor(Math.random() * 31) + 70 // 70-100
    }
  ];
};

export interface AssessmentReport {
  id: string;
  title: string;
  type: string;
  subType: string;
  dateCreated: string;
  dateCompleted: string | null;
  context: string;
  candidates: Array<any>; // Candidate with assessment data
  completionRate: number;
  averageScore: number;
  averageContextFit: number;
  averageRoleFit: number;
  skillGaps: Array<{skill: string, gap: number}>;
  status: 'completed' | 'in_progress' | 'pending';
}

export const mockAssessmentReports: AssessmentReport[] = [
  {
    id: '1',
    title: 'Frontend Development Technical Assessment',
    type: 'technical',
    subType: 'frontend',
    dateCreated: '2024-03-10T10:00:00Z',
    dateCompleted: '2024-03-15T16:30:00Z',
    context: 'Build a responsive dashboard component using React and Tailwind CSS that displays user analytics data. The component should include charts, filters, and export functionality. Consider mobile responsiveness and accessibility.',
    candidates: getRandomCandidates(),
    completionRate: 85,
    averageScore: 82,
    averageContextFit: 79,
    averageRoleFit: 85,
    skillGaps: [
      { skill: 'Accessibility', gap: 15 },
      { skill: 'Performance optimization', gap: 12 },
      { skill: 'State management', gap: 8 }
    ],
    status: 'completed'
  },
  {
    id: '2',
    title: 'Product Management Case Study',
    type: 'behavioral',
    subType: 'decision-making',
    dateCreated: '2024-03-12T09:00:00Z',
    dateCompleted: '2024-03-17T11:45:00Z',
    context: 'Develop a product strategy for a SaaS startup that helps small businesses manage their inventory. The startup is facing increasing competition and needs to differentiate its offering. Consider pricing strategy, target market segmentation, and feature prioritization.',
    candidates: getRandomCandidates(),
    completionRate: 92,
    averageScore: 88,
    averageContextFit: 90,
    averageRoleFit: 85,
    skillGaps: [
      { skill: 'Financial modeling', gap: 18 },
      { skill: 'Competitive analysis', gap: 10 },
      { skill: 'User research', gap: 5 }
    ],
    status: 'completed'
  },
  {
    id: '3',
    title: 'Backend System Design Challenge',
    type: 'technical',
    subType: 'system-design',
    dateCreated: '2024-03-15T14:00:00Z',
    dateCompleted: null,
    context: 'Design a scalable backend architecture for a video streaming platform that needs to handle millions of concurrent users. Consider data storage, caching strategies, API design, and how to handle peak traffic scenarios.',
    candidates: getRandomCandidates(),
    completionRate: 60,
    averageScore: 75,
    averageContextFit: 72,
    averageRoleFit: 78,
    skillGaps: [
      { skill: 'Distributed systems', gap: 20 },
      { skill: 'Database optimization', gap: 15 },
      { skill: 'Security implementation', gap: 12 }
    ],
    status: 'in_progress'
  },
  {
    id: '4',
    title: 'Leadership & Team Collaboration Assessment',
    type: 'values',
    subType: 'leadership',
    dateCreated: '2024-03-18T11:00:00Z',
    dateCompleted: '2024-03-21T17:15:00Z',
    context: 'As an engineering team lead at a rapidly growing fintech startup, describe how you would handle a situation where your team is falling behind on a critical product launch. The team is experiencing burnout, and there is pressure from stakeholders to deliver on time.',
    candidates: getRandomCandidates(),
    completionRate: 100,
    averageScore: 92,
    averageContextFit: 94,
    averageRoleFit: 90,
    skillGaps: [
      { skill: 'Conflict resolution', gap: 8 },
      { skill: 'Work delegation', gap: 6 },
      { skill: 'Stakeholder communication', gap: 10 }
    ],
    status: 'completed'
  },
  {
    id: '5',
    title: 'Full Stack Development Project',
    type: 'technical',
    subType: 'full-stack',
    dateCreated: '2024-03-20T10:30:00Z',
    dateCompleted: null,
    context: 'Create a simple task management application with user authentication, task creation, editing, and completion features. The frontend should be built with React, and the backend with Node.js. Consider how you would implement data persistence, authentication, and real-time updates.',
    candidates: getRandomCandidates(),
    completionRate: 40,
    averageScore: 72,
    averageContextFit: 68,
    averageRoleFit: 75,
    skillGaps: [
      { skill: 'Frontend-backend integration', gap: 22 },
      { skill: 'Authentication implementation', gap: 15 },
      { skill: 'Real-time data handling', gap: 18 }
    ],
    status: 'in_progress'
  }
]; 