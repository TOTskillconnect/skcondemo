import { Candidate, SearchFilters } from '../types/search';

export interface Skill {
  id: string;
  label: string;
  icon: string;
}

// Expanded technical skills
export const TECHNICAL_SKILLS: Skill[] = [
  // Frontend
  { id: 'react', label: 'React', icon: '⚛️' },
  { id: 'vue', label: 'Vue.js', icon: '⚡' },
  { id: 'angular', label: 'Angular', icon: '🔄' },
  { id: 'typescript', label: 'TypeScript', icon: '📘' },
  { id: 'javascript', label: 'JavaScript', icon: '🟡' },
  { id: 'nextjs', label: 'Next.js', icon: '▲' },
  { id: 'tailwind', label: 'Tailwind CSS', icon: '🎨' },
  { id: 'sass', label: 'SASS', icon: '💅' },
  
  // Backend
  { id: 'nodejs', label: 'Node.js', icon: '🟢' },
  { id: 'python', label: 'Python', icon: '🐍' },
  { id: 'java', label: 'Java', icon: '☕' },
  { id: 'go', label: 'Go', icon: '🐹' },
  { id: 'rust', label: 'Rust', icon: '🦀' },
  { id: 'graphql', label: 'GraphQL', icon: '📊' },
  { id: 'rest', label: 'REST APIs', icon: '🔌' },
  
  // Databases
  { id: 'postgresql', label: 'PostgreSQL', icon: '🐘' },
  { id: 'mongodb', label: 'MongoDB', icon: '🍃' },
  { id: 'redis', label: 'Redis', icon: '🔴' },
  { id: 'elasticsearch', label: 'Elasticsearch', icon: '🔍' },
  
  // Cloud & DevOps
  { id: 'aws', label: 'AWS', icon: '☁️' },
  { id: 'gcp', label: 'Google Cloud', icon: '🌤️' },
  { id: 'azure', label: 'Azure', icon: '🔵' },
  { id: 'docker', label: 'Docker', icon: '🐳' },
  { id: 'kubernetes', label: 'Kubernetes', icon: '⚙️' },
  { id: 'terraform', label: 'Terraform', icon: '🏗️' },
  { id: 'jenkins', label: 'Jenkins', icon: '🤖' },
  
  // Mobile
  { id: 'react-native', label: 'React Native', icon: '📱' },
  { id: 'flutter', label: 'Flutter', icon: '🦋' },
  { id: 'ios', label: 'iOS', icon: '🍎' },
  { id: 'android', label: 'Android', icon: '🤖' },
  
  // AI/ML
  { id: 'tensorflow', label: 'TensorFlow', icon: '🧠' },
  { id: 'pytorch', label: 'PyTorch', icon: '🔥' },
  { id: 'scikit-learn', label: 'Scikit-learn', icon: '📊' },
  { id: 'numpy', label: 'NumPy', icon: '🔢' },
  { id: 'pandas', label: 'Pandas', icon: '📑' }
];

// Expanded soft skills
export const SOFT_SKILLS: Skill[] = [
  { id: 'leadership', label: 'Team Leadership', icon: '👥' },
  { id: 'mentoring', label: 'Technical Mentoring', icon: '🎓' },
  { id: 'communication', label: 'Communication', icon: '💬' },
  { id: 'problem-solving', label: 'Problem Solving', icon: '🧩' },
  { id: 'agile', label: 'Agile', icon: '🔄' },
  { id: 'project-management', label: 'Project Management', icon: '📊' },
  { id: 'strategic', label: 'Strategic Planning', icon: '🎯' },
  { id: 'collaboration', label: 'Team Collaboration', icon: '🤝' },
  { id: 'adaptability', label: 'Adaptability', icon: '🔄' },
  { id: 'creativity', label: 'Creativity', icon: '💡' }
];

// Expanded industries
const INDUSTRIES = [
  'Fintech',
  'Healthcare',
  'E-commerce',
  'SaaS',
  'AI/ML',
  'Gaming',
  'EdTech',
  'CleanTech',
  'Cybersecurity',
  'IoT',
  'Blockchain',
  'Digital Health',
  'InsurTech',
  'RegTech',
  'PropTech',
  'HRTech',
  'MarTech',
  'AdTech',
  'LegalTech',
  'AgTech',
];

// Expanded startup stages
const STARTUP_STAGES = [
  'Pre-seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C',
  'Series D',
  'IPO',
  'Acquired',
];

// Helper function to get random items from an array
const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to generate random experience
const getRandomExperience = () => {
  const years = Math.floor(Math.random() * 15) + 1;
  const startupYears = Math.floor(Math.random() * years) + 1;
  return { years, startupYears };
};

// Generate mock candidates
export const mockCandidates: Candidate[] = Array.from({ length: 50 }, (_, index) => {
  const experience = getRandomExperience();
  const technicalSkills = getRandomItems(TECHNICAL_SKILLS, Math.floor(Math.random() * 5) + 3);
  const softSkills = getRandomItems(SOFT_SKILLS, Math.floor(Math.random() * 3) + 2);
  const industries = getRandomItems(INDUSTRIES, Math.floor(Math.random() * 2) + 1);
  const startupStages = getRandomItems(STARTUP_STAGES, Math.floor(Math.random() * 2) + 1);
  
  return {
    id: `${index + 1}`,
    name: `Candidate ${index + 1}`,
    title: technicalSkills[0].label + ' Developer',
    photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(`Candidate ${index + 1}`)}&background=random&size=150`,
    experience: {
      ...experience,
      notableProjects: [
        `Led development of ${industries[0]} platform`,
        `Built scalable ${technicalSkills[0].label} application`,
        `Implemented ${technicalSkills[1].label} infrastructure`,
      ],
    },
    skills: {
      technical: technicalSkills,
      soft: softSkills,
    },
    context: {
      startupStages,
      industries,
      achievements: [
        `Led team of ${Math.floor(Math.random() * 5) + 3} developers`,
        `Reduced load time by ${Math.floor(Math.random() * 40) + 20}%`,
        `Implemented CI/CD pipeline`,
      ],
    },
    verification: [
      {
        type: 'skill' as const,
        label: `${technicalSkills[0].label} Expert`,
        icon: '🎯',
        verifiedAt: '2024-03-15',
      },
      {
        type: 'identity' as const,
        label: 'Identity Verified',
        icon: '✅',
        verifiedAt: '2024-03-10',
      },
      ...(Math.random() > 0.5 ? [{
        type: 'roleplay' as const,
        label: 'System Design Passed',
        icon: '🎮',
        verifiedAt: '2024-03-12',
      }] : []),
    ],
    availability: {
      status: Math.random() > 0.5 ? 'available' : 'interviewing',
      startDate: Math.random() > 0.5 ? '2024-04-01' : '2024-05-01',
    },
    location: {
      city: ['San Francisco', 'New York', 'London', 'Berlin', 'Singapore'][Math.floor(Math.random() * 5)],
      country: ['USA', 'UK', 'Germany', 'Singapore'][Math.floor(Math.random() * 4)],
      remote: Math.random() > 0.3,
    },
    matchScore: Math.floor(Math.random() * 20) + 80,
    lastVerified: '2024-03-20',
  };
});

export const defaultFilters: SearchFilters = {
  skills: [],
  experience: {
    minYears: 0,
    minStartupYears: 0,
  },
  location: {
    cities: [],
    remoteOnly: false,
  },
  verification: {
    requireSkillVerification: true,
    requireIdentityVerification: true,
    requireRoleplayVerification: false,
  },
  availability: {
    immediate: false,
    withinWeeks: 4,
  },
  context: {
    startupStages: [],
    industries: [],
  },
}; 