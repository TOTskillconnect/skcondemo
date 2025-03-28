import { Candidate, Tag } from '@/lib/types/search';

// Create a set of tags for skills
const TECHNICAL_SKILLS: Tag[] = [
  { id: 'javascript', label: 'JavaScript', category: 'frontend' },
  { id: 'typescript', label: 'TypeScript', category: 'frontend' },
  { id: 'react', label: 'React', category: 'frontend' },
  { id: 'nextjs', label: 'Next.js', category: 'frontend' },
  { id: 'tailwind', label: 'Tailwind CSS', category: 'frontend' },
  { id: 'nodejs', label: 'Node.js', category: 'backend' },
  { id: 'python', label: 'Python', category: 'backend' },
  { id: 'java', label: 'Java', category: 'backend' },
  { id: 'go', label: 'Go', category: 'backend' },
  { id: 'postgresql', label: 'PostgreSQL', category: 'database' },
  { id: 'mongodb', label: 'MongoDB', category: 'database' },
  { id: 'redis', label: 'Redis', category: 'database' },
  { id: 'aws', label: 'AWS', category: 'devops' },
  { id: 'docker', label: 'Docker', category: 'devops' },
  { id: 'kubernetes', label: 'Kubernetes', category: 'devops' },
  { id: 'graphql', label: 'GraphQL', category: 'api' },
  { id: 'rest', label: 'REST', category: 'api' },
  { id: 'tensorflow', label: 'TensorFlow', category: 'ml' },
  { id: 'pytorch', label: 'PyTorch', category: 'ml' },
  { id: 'figma', label: 'Figma', category: 'design' },
];

const SOFT_SKILLS: Tag[] = [
  { id: 'leadership', label: 'Leadership', category: 'management' },
  { id: 'communication', label: 'Communication', category: 'interpersonal' },
  { id: 'problem-solving', label: 'Problem Solving', category: 'analytical' },
  { id: 'collaboration', label: 'Collaboration', category: 'interpersonal' },
  { id: 'strategic', label: 'Strategic Thinking', category: 'analytical' },
  { id: 'agile', label: 'Agile', category: 'methodology' },
  { id: 'project-management', label: 'Project Management', category: 'management' },
  { id: 'data-analysis', label: 'Data Analysis', category: 'analytical' },
];

// Create basic verification badges
const createVerificationBadges = (types: Array<'skill' | 'identity' | 'roleplay'>) => {
  return types.map(type => {
    let label = '';
    let icon = '';
    
    switch (type) {
      case 'skill':
        label = 'Skill Verified';
        icon = '💻';
        break;
      case 'identity':
        label = 'Identity Verified';
        icon = '✅';
        break;
      case 'roleplay':
        label = 'Roleplay Verified';
        icon = '🎭';
        break;
    }
    
    return {
      type,
      label,
      icon,
      verifiedAt: new Date().toISOString().split('T')[0]
    };
  });
};

// Expanded industry options
export const INDUSTRIES = [
  'Software & SaaS',
  'FinTech',
  'OceanTech',
  'HealthTech & Wellness',
  'EdTech',
  'E-commerce & RetailTech',
  'PropTech',
  'InsurTech',
  'Blockchain & Crypto',
  'Artificial Intelligence (AI)',
  'Big Data & Analytics',
  'Cybersecurity',
  'Transportation & Logistics',
  'Energy & CleanTech',
  'Media & AdTech',
  'HR Tech',
  'FoodTech & AgriTech',
  'Hardware & IoT',
  'Gaming & AR/VR',
  'Travel & Hospitality Tech',
  'Consumer Apps & Platforms',
  'Manufacturing & Production',
  'Energy & Sustainability',
  'Nonprofit & Social Impact',
  'Consulting & Business Services',
  'Arts & Creative Industries',
  'Local Services & Small Businesses'
];

// Expanded role title options for search wizard
export const ROLE_TITLES_TAGS: Tag[] = [
  // Technical roles
  { id: 'frontend-developer', label: 'Frontend Developer', category: 'Technical' },
  { id: 'backend-developer', label: 'Backend Developer', category: 'Technical' },
  { id: 'full-stack-developer', label: 'Full Stack Developer', category: 'Technical' },
  { id: 'devops-engineer', label: 'DevOps Engineer', category: 'Technical' },
  { id: 'data-scientist', label: 'Data Scientist', category: 'Technical' },
  { id: 'machine-learning-engineer', label: 'Machine Learning Engineer', category: 'Technical' },
  { id: 'qa-engineer', label: 'QA Engineer', category: 'Technical' },
  { id: 'systems-architect', label: 'Systems Architect', category: 'Technical' },
  { id: 'mobile-developer', label: 'Mobile Developer', category: 'Technical' },
  { id: 'security-engineer', label: 'Security Engineer', category: 'Technical' },
  // Business roles
  { id: 'product-manager', label: 'Product Manager', category: 'Business' },
  { id: 'project-manager', label: 'Project Manager', category: 'Business' },
  { id: 'business-analyst', label: 'Business Analyst', category: 'Business' },
  { id: 'customer-success-manager', label: 'Customer Success Manager', category: 'Business' },
  { id: 'account-manager', label: 'Account Manager', category: 'Business' },
  // Leadership and management
  { id: 'engineering-manager', label: 'Engineering Manager', category: 'Leadership' },
  { id: 'cto', label: 'CTO', category: 'Leadership' },
  { id: 'marketing-manager', label: 'Marketing Manager', category: 'Leadership' },
  { id: 'sales-director', label: 'Sales Director', category: 'Leadership' },
  { id: 'hr-manager', label: 'HR Manager', category: 'Leadership' },
  { id: 'operations-lead', label: 'Operations Lead', category: 'Leadership' },
  { id: 'finance-analyst', label: 'Finance Analyst', category: 'Leadership' },
  { id: 'coo', label: 'COO', category: 'Leadership' },
  // Sales roles
  { id: 'senior-sales-executive', label: 'Senior Sales Executive', category: 'Sales' },
  { id: 'enterprise-account-executive', label: 'Enterprise Account Executive', category: 'Sales' },
  { id: 'sales-development-manager', label: 'Sales Development Manager', category: 'Sales' },
  { id: 'sales-account-manager', label: 'Account Manager', category: 'Sales' },
  { id: 'sales-operations-manager', label: 'Sales Operations Manager', category: 'Sales' },
  { id: 'technical-sales-manager', label: 'Technical Sales Manager', category: 'Sales' },
  { id: 'technical-sales-director', label: 'Technical Sales Director', category: 'Sales' }
];

// Keep the original ROLE_TITLES array for backward compatibility
export const ROLE_TITLES = ROLE_TITLES_TAGS.map(tag => tag.label);

// Expanded technical skills
export const TECHNICAL_SKILLS_EXPANDED = [
  { id: 'react', label: 'React' },
  { id: 'node', label: 'Node.js' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'aws', label: 'AWS' },
  { id: 'docker', label: 'Docker' },
  { id: 'kubernetes', label: 'Kubernetes' },
  { id: 'mongodb', label: 'MongoDB' },
  { id: 'sql', label: 'SQL' },
  { id: 'graphql', label: 'GraphQL' },
  { id: 'vue', label: 'Vue.js' },
  { id: 'angular', label: 'Angular' },
  { id: 'django', label: 'Django' },
  { id: 'flutter', label: 'Flutter' },
  { id: 'swift', label: 'Swift' },
  { id: 'kotlin', label: 'Kotlin' },
  { id: 'rust', label: 'Rust' },
  { id: 'go', label: 'Go' },
  { id: 'terraform', label: 'Terraform' },
  { id: 'ml', label: 'Machine Learning' },
  { id: 'ai', label: 'Artificial Intelligence' },
  { id: 'datavis', label: 'Data Visualization' },
  { id: 'cloud', label: 'Cloud Computing' },
  { id: 'devops', label: 'DevOps' },
  { id: 'testing', label: 'Automated Testing' },
  { id: 'ci-cd', label: 'CI/CD' }
];

// Expanded soft skills
export const SOFT_SKILLS_EXPANDED = [
  { id: 'communication', label: 'Communication' },
  { id: 'teamwork', label: 'Teamwork' },
  { id: 'problem-solving', label: 'Problem Solving' },
  { id: 'time-management', label: 'Time Management' },
  { id: 'critical-thinking', label: 'Critical Thinking' },
  { id: 'adaptability', label: 'Adaptability' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'creativity', label: 'Creativity' },
  { id: 'emotional-intelligence', label: 'Emotional Intelligence' },
  { id: 'conflict-resolution', label: 'Conflict Resolution' },
  { id: 'project-management', label: 'Project Management' },
  { id: 'strategic-planning', label: 'Strategic Planning' },
  { id: 'budgeting', label: 'Budgeting' },
  { id: 'market-research', label: 'Market Research' },
  { id: 'sales', label: 'Sales' },
  { id: 'customer-relations', label: 'Customer Relations' },
  { id: 'mentoring', label: 'Mentoring' },
  { id: 'negotiation', label: 'Negotiation' }
];

// Expanded business skills (new category)
export const BUSINESS_SKILLS = [
  { id: 'product-strategy', label: 'Product Strategy' },
  { id: 'agile', label: 'Agile Methodologies' },
  { id: 'scrum', label: 'Scrum' },
  { id: 'user-research', label: 'User Research' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'growth', label: 'Growth Strategies' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'content-strategy', label: 'Content Strategy' },
  { id: 'seo', label: 'SEO' },
  { id: 'social-media', label: 'Social Media' },
  { id: 'sales', label: 'Sales' },
  { id: 'fundraising', label: 'Fundraising' },
  { id: 'financial-planning', label: 'Financial Planning' },
  { id: 'operations', label: 'Operations' },
  { id: 'supply-chain', label: 'Supply Chain' },
  { id: 'hr', label: 'Human Resources' }
];

// Expanded cultural values
export const CULTURAL_VALUES = [
  { id: 'innovation', label: 'Innovation' },
  { id: 'teamwork', label: 'Teamwork' },
  { id: 'customer-focus', label: 'Customer Focus' },
  { id: 'integrity', label: 'Integrity' },
  { id: 'diversity', label: 'Diversity & Inclusion' },
  { id: 'transparency', label: 'Transparency' },
  { id: 'work-life-balance', label: 'Work-Life Balance' },
  { id: 'accountability', label: 'Accountability' },
  { id: 'continuous-learning', label: 'Continuous Learning' },
  { id: 'excellence', label: 'Excellence' },
  { id: 'social-responsibility', label: 'Social Responsibility' },
  { id: 'passion', label: 'Passion' },
  { id: 'entrepreneurship', label: 'Entrepreneurship' },
  { id: 'adaptability', label: 'Adaptability' }
];

// Expanded company stages
export const COMPANY_STAGES = [
  'Pre-seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C',
  'Series D+',
  'Public',
  'Growth',
  'Mature'
];

// Expanded hiring goals
export const HIRING_GOALS = [
  'Build a new team',
  'Scale an existing team',
  'Replace a team member',
  'Add specialized expertise',
  'Expand to new markets',
  'Launch new product line',
  'Department restructuring',
  'Digital transformation',
  'Innovation focus',
  'Operational efficiency',
  'Preparing for funding',
  'Post-merger integration'
];

// Expanded milestone options
export const MILESTONE_OPTIONS = [
  { id: 'product-launch', label: 'Product Launch' },
  { id: 'market-expansion', label: 'Market Expansion' },
  { id: 'funding-round', label: 'Funding Round' },
  { id: 'revenue-milestone', label: 'Revenue Milestone' },
  { id: 'user-growth', label: 'User Growth Target' },
  { id: 'rebranding', label: 'Rebranding' },
  { id: 'tech-migration', label: 'Technology Migration' },
  { id: 'regulatory-compliance', label: 'Regulatory Compliance' },
  { id: 'acquisition', label: 'Acquisition' },
  { id: 'ipo', label: 'IPO' },
  { id: 'new-office', label: 'New Office Opening' },
  { id: 'strategic-partnership', label: 'Strategic Partnership' }
];

// Expanded accomplishment options
export const ACCOMPLISHMENT_OPTIONS = [
  { id: 'revenue-growth', label: 'Revenue Growth' },
  { id: 'cost-reduction', label: 'Cost Reduction' },
  { id: 'user-acquisition', label: 'User Acquisition' },
  { id: 'product-launch', label: 'Successful Product Launch' },
  { id: 'team-building', label: 'Team Building' },
  { id: 'process-improvement', label: 'Process Improvement' },
  { id: 'tech-transformation', label: 'Technology Transformation' },
  { id: 'client-retention', label: 'Client Retention' },
  { id: 'award-winning', label: 'Award-Winning Work' },
  { id: 'fundraising', label: 'Fundraising Success' },
  { id: 'market-share', label: 'Market Share Increase' },
  { id: 'digital-transformation', label: 'Digital Transformation' }
];

// Expanded location options
export const CITIES = [
  'San Francisco, CA',
  'New York, NY',
  'Austin, TX',
  'Boston, MA',
  'Seattle, WA',
  'Chicago, IL',
  'Los Angeles, CA',
  'Denver, CO',
  'Atlanta, GA',
  'Miami, FL',
  'Portland, OR',
  'Nashville, TN',
  'Toronto, Canada',
  'London, UK',
  'Berlin, Germany',
  'Amsterdam, Netherlands',
  'Sydney, Australia',
  'Singapore'
];

// Helper function to generate a diverse set of candidates
function generateDiverseCandidates(count: number): Candidate[] {
  const candidates: Candidate[] = [];
  let id = 1;
  
  // Some fixed data for generating realistic candidates
  const CITIES = ['San Francisco', 'New York', 'London', 'Berlin', 'Singapore', 'Toronto', 'Tokyo', 'Sydney', 'Amsterdam', 'Tel Aviv'];
  const availabilityStatuses: Array<'available' | 'interviewing' | 'hired'> = ['available', 'interviewing', 'hired'];
  
  // Diverse names representing various cultural backgrounds
  const FIRST_NAMES = [
    // East Asian names
    'Wei', 'Ming', 'Li', 'Zhang', 'Yuki', 'Hiroshi', 'Kim', 'Ji-Young', 
    // South Asian names
    'Raj', 'Priya', 'Aisha', 'Arjun', 'Neha', 'Sanjay', 'Ananya', 
    // African/African American names
    'Kwame', 'Zainab', 'Jamal', 'Aaliyah', 'Malik', 'Imani', 'Darius',
    // Hispanic/Latino names
    'Sofia', 'Carlos', 'Isabella', 'Miguel', 'Elena', 'Javier', 'Carmen',
    // Middle Eastern names
    'Omar', 'Fatima', 'Ahmed', 'Layla', 'Rami', 'Yasmin', 'Hassan',
    // European/Western names
    'Emma', 'James', 'Sarah', 'Michael', 'Sophie', 'Alexander', 'Anna', 'Thomas',
    // Indigenous names
    'Nizhoni', 'Keme', 'Ayanna', 'Takoda', 'Kai'
  ];
  
  const LAST_NAMES = [
    // East Asian surnames
    'Wang', 'Zhang', 'Chen', 'Liu', 'Tanaka', 'Suzuki', 'Kim', 'Park', 
    // South Asian surnames
    'Patel', 'Sharma', 'Singh', 'Gupta', 'Desai', 'Malhotra', 
    // African/African American surnames
    'Johnson', 'Williams', 'Okafor', 'Mensah', 'Osei', 'Ibrahim', 
    // Hispanic/Latino surnames
    'Garcia', 'Rodriguez', 'Martinez', 'Lopez', 'Hernandez', 
    // Middle Eastern surnames
    'Al-Farsi', 'Hassan', 'Ali', 'Khan', 'Karimi', 
    // European/Western surnames
    'Smith', 'Brown', 'Taylor', 'Jones', 'Wilson', 'Miller', 'Davis',
    'Müller', 'Kowalski', 'Dubois', 'Rossi', 'Ivanov', 'Johansson',
    // Indigenous surnames
    'Begay', 'Yazzie', 'Notah', 'Tsosie'
  ];
  
  // Possible startup stages (different from company stages for variety)
  const STARTUP_STAGES = [
    'Pre-seed',
    'Seed',
    'Series A',
    'Series B',
    'Series C+',
    'Growth',
    'Mature'
  ];
  
  // Helper for random selection
  const getRandomItem = <T>(items: T[]): T => {
    return items[Math.floor(Math.random() * items.length)];
  };
  
  const getRandomItems = <T>(items: T[], min: number, max: number): T[] => {
    const count = min + Math.floor(Math.random() * (max - min + 1));
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  // Create a shuffled array of first and last names to ensure name diversity
  const shuffledFirstNames = [...FIRST_NAMES].sort(() => 0.5 - Math.random());
  const shuffledLastNames = [...LAST_NAMES].sort(() => 0.5 - Math.random());
  
  for (let i = 0; i < count; i++) {
    // Get a diverse name
    const firstName = shuffledFirstNames[i % shuffledFirstNames.length];
    const lastName = shuffledLastNames[i % shuffledLastNames.length];
    const fullName = `${firstName} ${lastName}`;
    
    // Generate role from ROLE_TITLES (technical, business, leadership)
    const role = getRandomItem(ROLE_TITLES_TAGS);
    
    // Generate years of experience 1-15 years
    const years = 1 + Math.floor(Math.random() * 15);
    
    // Determine experience level based on years
    let experienceLevel = { level: 'entry', label: 'Entry Level' };
    if (years > 8) experienceLevel = { level: 'lead', label: 'Lead' };
    else if (years > 5) experienceLevel = { level: 'senior', label: 'Senior' };
    else if (years > 2) experienceLevel = { level: 'mid', label: 'Mid-Level' };
    
    // Get technical skills based on role (2-5 skills)
    let technicalSkills: Tag[] = [];
    if (role.category === 'Technical') {
      technicalSkills = getRandomItems(TECHNICAL_SKILLS_EXPANDED, 2, 5);
    } else {
      // Non-technical roles still might have some technical skills
      technicalSkills = getRandomItems(TECHNICAL_SKILLS_EXPANDED, 0, 3);
    }
    
    // Get soft skills (2-4 skills)
    const softSkills = getRandomItems(SOFT_SKILLS_EXPANDED, 2, 4);
    
    // Get industries (1-2)
    const industries = getRandomItems(INDUSTRIES, 1, 2);
    
    // Get startup stages (1-2)
    const startupStages = getRandomItems(STARTUP_STAGES, 1, 2);
    
    // Get random cultural values (1-3)
    const culturalValues = getRandomItems(CULTURAL_VALUES, 1, 3).map(v => v.label);
    
    // Randomly decide if remote
    const isRemote = Math.random() > 0.5;
    
    // Generate random match score
    const matchScore = Math.floor(Math.random() * 41) + 60; // 60-100
    
    // Generate last verified date
    const lastVerified = new Date();
    lastVerified.setDate(lastVerified.getDate() - Math.floor(Math.random() * 30));
    
    // Generate a candidate
    candidates.push({
      id: String(id++),
      name: fullName,
      title: role.label,
      photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&size=150`,
      experience: {
        years: years,
        startupYears: Math.floor(1 + Math.random() * years),
        notableProjects: [
          `Built ${getRandomItem(TECHNICAL_SKILLS_EXPANDED).label} system for ${getRandomItem(industries)}`,
          `Led team of ${Math.floor(Math.random() * 10 + 1)} developers`,
          `Increased efficiency by ${Math.floor(Math.random() * 50 + 20)}%`
        ]
      },
      skills: {
        technical: technicalSkills,
        soft: softSkills
      },
      verification: createVerificationBadges(
        ['skill', ...([Math.random() > 0.5 ? 'identity' : null, Math.random() > 0.7 ? 'roleplay' : null].filter(Boolean) as any)]
      ),
      availability: {
        status: getRandomItem(availabilityStatuses),
        startDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      location: {
        city: getRandomItem(CITIES),
        country: 'USA',
        remote: isRemote
      },
      context: {
        industries: industries,
        startupStages: startupStages,
        achievements: [
          `Implemented ${getRandomItem(TECHNICAL_SKILLS_EXPANDED).label} solution`,
          `Reduced costs by ${Math.floor(Math.random() * 40 + 10)}%`,
          `Launched ${Math.floor(Math.random() * 3 + 1)} successful products`
        ],
        culturalValues: culturalValues
      },
      matchScore: matchScore,
      lastVerified: lastVerified.toISOString().split('T')[0]
    });
  }
  
  return candidates;
}

// Generate 75 diverse mock candidates
export const MOCK_CANDIDATES = generateDiverseCandidates(75);

export interface SearchCriteria {
  roleTitle: string[];
  skills: string[];
  industries: string[];
  experience: {
    minYears: number;
    maxYears: number;
  };
  location: string;
  hiringContext: {
    companyStage: string;
    accomplishments: string[];
    goals: string[];
    milestones: string[];
  };
}

// Improved match score calculation that works with our diverse candidates
export function calculateHiringContextMatchScore(candidate: Candidate, searchCriteria: any): number {
  if (!searchCriteria) return 60; // Default score
  
  let totalScore = 0;
  let maxScore = 0;
  
  // Calculate the weighted components of the score
  // 1. Hiring context score (50%)
  // 2. Skills and experience score (30%)
  // 3. Cultural values and industry match (20%)
  
  // 1. Hiring context match (50% of total)
  const hiringContextWeight = 50;
  if (searchCriteria.hiringContext) {
    let hiringContextScore = 0;
    let hiringContextFactors = 0;
    
    // Goal match (contributes 15% to hiring context score)
    if (searchCriteria.hiringContext.goal) {
      hiringContextFactors++;
      // Check for partial matches since goals are free text
      const goalTerms = searchCriteria.hiringContext.goal.toLowerCase().split(' ');
      const relevantTerms = goalTerms.filter((term: string) => term.length > 3);
      
      if (relevantTerms.length > 0) {
        // Candidate info is in different formats depending on source
        if (typeof candidate.context === 'object') {
          // Check if any of the search terms appear in various candidate fields
          const candidateInfo = [
            candidate.name,
            candidate.title,
            candidate.context.about || '',
            candidate.context.achievements?.join(' ') || '',
            // Properly access nested experience if it exists
            ...(candidate.context.experience 
              ? candidate.context.experience.map(exp => `${exp.title} ${exp.company} ${exp.description}`) 
              : []),
            // startupExperience doesn't exist in the interface, remove it
            // candidate.context.startupExperience || '',
          ].join(' ').toLowerCase();

          for (const term of relevantTerms) {
            if (candidateInfo.includes(term)) {
              hiringContextScore += 5;
              break; // Only count once even if multiple matches
            }
          }
        }
      }
    }
    
    // Company stage match (contributes 10% to hiring context score)
    if (searchCriteria.hiringContext.companyStage && candidate.context?.startupStages) {
      hiringContextFactors++;
      if (Array.isArray(candidate.context.startupStages) && 
          candidate.context.startupStages.some(stage => 
            stage.toLowerCase().includes(searchCriteria.hiringContext.companyStage.toLowerCase()) ||
            searchCriteria.hiringContext.companyStage.toLowerCase().includes(stage.toLowerCase())
          )) {
        hiringContextScore += 10;
      } else {
        // If candidate has startup experience in their achievements or experience, give partial credit
        const hasStartupExperience = 
          candidate.context.achievements?.some(achievement => 
            achievement.toLowerCase().includes('startup') ||
            achievement.toLowerCase().includes('early stage')
          ) ||
          candidate.context.experience?.some(exp =>
            exp.description.toLowerCase().includes('startup') ||
            exp.description.toLowerCase().includes('early stage')
          );
        
        if (hasStartupExperience) {
          hiringContextScore += 5;
        }
      }
    }
    
    // Milestones match (contributes 10% to hiring context score)
    if (Array.isArray(searchCriteria.hiringContext.milestones) && 
        searchCriteria.hiringContext.milestones.length > 0) {
      hiringContextFactors++;
      
      // Extract milestone labels or values
      const milestonesToMatch = searchCriteria.hiringContext.milestones.map((m: any) => 
        typeof m === 'string' ? m : (m.label || m.id || '')
      ).filter(Boolean).map((m: string) => m.toLowerCase());
      
      // Look for matches in candidate projects or experience
      let milestoneMatches = 0;
      
      // Check candidate projects
      if (candidate.context?.projects) {
        for (const project of candidate.context.projects) {
          const projectText = `${project.title || ''} ${project.description || ''}`.toLowerCase();
          milestonesToMatch.forEach((milestone: string) => {
            if (projectText.includes(milestone.toLowerCase())) {
              milestoneMatches++;
            }
          });
        }
      }
      
      // Check candidate experience
      if (candidate.context?.experience) {
        for (const exp of candidate.context.experience) {
          const expText = `${exp.title || ''} ${exp.description || ''}`.toLowerCase();
          milestonesToMatch.forEach((milestone: string) => {
            if (expText.includes(milestone.toLowerCase())) {
              milestoneMatches++;
            }
          });
        }
      }
      
      // Calculate milestone score based on number of matches
      const matchPercentage = Math.min(1, milestoneMatches / milestonesToMatch.length);
      hiringContextScore += matchPercentage * 10;
    }
    
    // Accomplishments match (contributes 10% to hiring context score)
    if (Array.isArray(searchCriteria.hiringContext.accomplishments) && 
        searchCriteria.hiringContext.accomplishments.length > 0) {
      hiringContextFactors++;
      
      // Extract accomplishment labels or values
      const accomplishmentsToMatch = searchCriteria.hiringContext.accomplishments.map((a: any) => 
        typeof a === 'string' ? a : (a.label || a.id || '')
      ).filter(Boolean).map((a: string) => a.toLowerCase());
      
      // Look for matches in candidate achievements or experience
      let accomplishmentMatches = 0;
      
      // Check candidate achievements
      if (Array.isArray(candidate.context?.achievements)) {
        candidate.context.achievements.forEach((achievement: string) => {
          accomplishmentsToMatch.forEach((accomplishment: string) => {
            if (achievement.toLowerCase().includes(accomplishment)) {
              accomplishmentMatches++;
            }
          });
        });
      }
      
      // Calculate accomplishment score based on number of matches
      const matchPercentage = Math.min(1, accomplishmentMatches / accomplishmentsToMatch.length);
      hiringContextScore += matchPercentage * 10;
    }
    
    // Cultural values match (contributes 15% to hiring context score)
    if (Array.isArray(searchCriteria.hiringContext.culturalValues) && 
        searchCriteria.hiringContext.culturalValues.length > 0) {
      hiringContextFactors++;
      
      // Extract cultural value labels
      const valuesToMatch = searchCriteria.hiringContext.culturalValues.map((v: any) => 
        typeof v === 'string' ? v : (v.label || v.id || '')
      ).filter(Boolean).map((v: string) => v.toLowerCase());
      
      // Check candidate cultural values
      let valueMatches = 0;
      if (Array.isArray(candidate.context?.culturalValues)) {
        candidate.context.culturalValues.forEach((value: string) => {
          valuesToMatch.forEach((searchValue: string) => {
            if (value.toLowerCase().includes(searchValue) || 
                searchValue.includes(value.toLowerCase())) {
              valueMatches++;
            }
          });
        });
      }
      
      // Calculate cultural values score based on number of matches
      const matchPercentage = Math.min(1, valueMatches / valuesToMatch.length);
      hiringContextScore += matchPercentage * 15;
    }
    
    // If we have any hiring context factors, add to total score
    if (hiringContextFactors > 0) {
      totalScore += (hiringContextScore / (hiringContextFactors * 15)) * hiringContextWeight;
      maxScore += hiringContextWeight;
    }
  }
  
  // 2. Skills and experience match (30% of total)
  const skillsExperienceWeight = 30;
  if (searchCriteria.basicCriteria) {
    let skillsExperienceScore = 0;
    let skillsExperienceFactors = 0;
    
    // Role title match (contributes 10% to skills score)
    if (searchCriteria.basicCriteria.roleTitle) {
      skillsExperienceFactors++;
      
      // Check exact or partial role title match
      const roleTitle = searchCriteria.basicCriteria.roleTitle.toLowerCase();
      const candidateTitle = candidate.title.toLowerCase();
      
      if (candidateTitle === roleTitle) {
        skillsExperienceScore += 10; // Exact match
      } else if (candidateTitle.includes(roleTitle) || roleTitle.includes(candidateTitle)) {
        skillsExperienceScore += 8; // Partial match
      } else {
        // Check for word-level matches
        const roleWords = roleTitle.split(' ').filter((word: string) => word.length > 3);
        const titleWords = candidateTitle.split(' ').filter((word: string) => word.length > 3);
        
        const matchingWords = roleWords.filter((word: string) => 
          titleWords.some(titleWord => titleWord.includes(word) || word.includes(titleWord))
        ).length;
        
        if (matchingWords > 0 && roleWords.length > 0) {
          skillsExperienceScore += (matchingWords / roleWords.length) * 6; // Word-level match
        }
      }
    }
    
    // Skills match (contributes 15% to skills score)
    if (Array.isArray(searchCriteria.basicCriteria.skills) && 
        searchCriteria.basicCriteria.skills.length > 0) {
      skillsExperienceFactors++;
      
      // Extract skill labels
      const skillsToMatch = searchCriteria.basicCriteria.skills.map((s: any) => 
        typeof s === 'string' ? s : (s.label || s.id || '')
      ).filter(Boolean).map((s: string) => s.toLowerCase());
      
      // Get all candidate skills
      const candidateSkills = [
        ...(candidate.skills.technical || []).map(s => s.label.toLowerCase()),
        ...(candidate.skills.soft || []).map(s => s.label.toLowerCase())
      ];
      
      // Count matching skills
      let skillMatches = 0;
      skillsToMatch.forEach((skill: string) => {
        if (candidateSkills.some(candidateSkill => 
          candidateSkill.includes(skill) || skill.includes(candidateSkill)
        )) {
          skillMatches++;
        }
      });
      
      // Calculate skills score based on percentage of matched skills
      const matchPercentage = Math.min(1, skillMatches / skillsToMatch.length);
      skillsExperienceScore += matchPercentage * 15;
    }
    
    // Experience level match (contributes 5% to skills score)
    if (searchCriteria.basicCriteria.experienceLevel) {
      skillsExperienceFactors++;
      
      // Map experience level name to years
      const levelToYears: { [key: string]: [number, number] } = {
        'entry': [0, 2],
        'mid': [2, 5],
        'senior': [5, 8],
        'lead': [8, 100]
      };
      
      const requestedLevel = searchCriteria.basicCriteria.experienceLevel;
      const candidateYears = candidate.experience.years;
      
      if (requestedLevel in levelToYears) {
        const [minYears, maxYears] = levelToYears[requestedLevel];
        
        if (candidateYears >= minYears) {
          // If candidate meets minimum years, award points
          if (candidateYears <= maxYears) {
            skillsExperienceScore += 5; // Exact match
          } else {
            skillsExperienceScore += 3; // Over-qualified
          }
        }
      }
    }
    
    // If we have any skills/experience factors, add to total score
    if (skillsExperienceFactors > 0) {
      totalScore += (skillsExperienceScore / (skillsExperienceFactors * 10)) * skillsExperienceWeight;
      maxScore += skillsExperienceWeight;
    }
  }
  
  // 3. Culture and industry match (20% of total)
  const cultureIndustryWeight = 20;
  let cultureIndustryScore = 0;
  let cultureIndustryFactors = 0;
  
  // Industry match (contributes 10% to culture/industry score)
  if (searchCriteria.basicCriteria?.industry && Array.isArray(candidate.context?.industries)) {
    cultureIndustryFactors++;
    
    const requestedIndustry = searchCriteria.basicCriteria.industry.toLowerCase();
    const candidateIndustries = candidate.context.industries.map(i => i.toLowerCase());
    
    if (candidateIndustries.some(i => i === requestedIndustry)) {
      cultureIndustryScore += 10; // Exact match
    } else if (candidateIndustries.some(i => i.includes(requestedIndustry) || requestedIndustry.includes(i))) {
      cultureIndustryScore += 7; // Partial match
    } else {
      // Check for word-level matches
      const industryWords = requestedIndustry.split(' ').filter((word: string) => word.length > 3);
      let wordMatches = 0;
      
      candidateIndustries.forEach((industry: string) => {
        const indWords = industry.split(' ').filter((word: string) => word.length > 3);
        industryWords.forEach((word: string) => {
          if (indWords.some((indWord: string) => indWord.includes(word) || word.includes(indWord))) {
            wordMatches++;
          }
        });
      });
      
      if (wordMatches > 0 && industryWords.length > 0) {
        cultureIndustryScore += (wordMatches / industryWords.length) * 5; // Word-level match
      }
    }
  }
  
  // Verification badges (contributes 10% to culture/industry score)
  cultureIndustryFactors++;
  if (Array.isArray(candidate.verification) && candidate.verification.length > 0) {
    // Award points based on number of verification badges, up to 3
    const badgeCount = Math.min(3, candidate.verification.length);
    cultureIndustryScore += (badgeCount / 3) * 10;
  }
  
  // If we have any culture/industry factors, add to total score
  if (cultureIndustryFactors > 0) {
    totalScore += (cultureIndustryScore / (cultureIndustryFactors * 10)) * cultureIndustryWeight;
    maxScore += cultureIndustryWeight;
  }
  
  // Calculate final score
  let finalScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 60;
  
  // Ensure score is between 0-100, with a minimum floor of 50 to avoid very low scores
  finalScore = Math.max(50, Math.min(100, finalScore));
  
  return finalScore;
}

// Helper function to convert years of experience to experience level
function getExperienceLevelFromYears(years: number): string {
  if (years < 2) return 'entry';
  if (years < 5) return 'mid';
  if (years < 8) return 'senior';
  return 'lead';
}

// Helper function to convert experience level to minimum years
export function getMinYearsFromExperienceLevel(level?: string): number {
  switch (level) {
    case 'entry': return 0;
    case 'mid': return 2;
    case 'senior': return 5;
    case 'lead': return 8;
    default: return 0;
  }
}

function normalizeText(text: string): string {
  // Remove punctuation, convert to lowercase, and split into words
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((word: string) => word.length > 2) // Filter out short words
    .map((word: string) => word.trim())
    .join(' ');
}

function calculateJobTitleFit(candidate: Candidate, roleTitle: string): number {
  if (!roleTitle || roleTitle.trim() === '') return 50; // Neutral score if no title

  const normalizedCandidateTitle = normalizeText(candidate.title);
  const normalizedRoleTitle = normalizeText(roleTitle);

  // Exact match
  if (normalizedCandidateTitle === normalizedRoleTitle) {
    return 100;
  }

  // Look for keywords in both titles
  const roleTitleWords = normalizedRoleTitle.split(' ');
  const candidateTitleWords = normalizedCandidateTitle.split(' ');

  let matchCount = 0;
  roleTitleWords.forEach((word: string) => {
    if (candidateTitleWords.includes(word)) {
      matchCount++;
    }
  });

  // Calculate percentage of matching words
  const totalUniqueWords = new Set([...roleTitleWords, ...candidateTitleWords]).size;
  return Math.round((matchCount / totalUniqueWords) * 100);
}

function calculateSkillsMatch(candidate: Candidate, requiredSkills: Tag[]): number {
  if (!requiredSkills || requiredSkills.length === 0) return 50; // Neutral score if no skills required

  // Extract all candidate skills
  const candidateSkills = 
    candidate.skills.technical
      .map((skill: { label: string }) => skill.label.toLowerCase())
      .concat(candidate.skills.soft
        ? candidate.skills.soft.map(s => s.label.toLowerCase()) 
        : []);

  const requiredSkillLabels = requiredSkills.map(s => s.label.toLowerCase());

  // Count matches
  let matchCount = 0;
  requiredSkillLabels.forEach((skillLabel) => {
    // Check for exact matches or skills that contain the required skill as a substring
    if (candidateSkills.some(cs => cs === skillLabel || cs.includes(skillLabel))) {
      matchCount++;
    }
  });

  return Math.round((matchCount / requiredSkillLabels.length) * 100);
}

export function searchCandidates(
  searchCriteria: SearchCriteria,
  candidates: Candidate[]
): Candidate[] {
  return candidates
    .map(candidate => {
      let matchScore = 0;
      let totalFactors = 0;

      // Role title matching with category validation
      if (searchCriteria.roleTitle && searchCriteria.roleTitle.length > 0) {
        totalFactors++;
        const selectedRoles = searchCriteria.roleTitle;
        const selectedRoleCategory = ROLE_TITLES_TAGS.find((role: Tag) => role.label === selectedRoles[0])?.category;
        
        // Validate that all selected roles are from the same category
        const allRolesSameCategory = selectedRoles.every((role: string) => 
          ROLE_TITLES_TAGS.find((r: Tag) => r.label === role)?.category === selectedRoleCategory
        );

        if (!allRolesSameCategory) {
          console.warn('Selected roles must be from the same category');
          return { ...candidate, matchScore: 0 };
        }

        // Calculate role match score
        const roleMatchScores = selectedRoles.map((roleTitle: string) => {
          const candidateTitle = candidate.title.toLowerCase();
          const roleTitleLower = roleTitle.toLowerCase();

          if (candidateTitle === roleTitleLower) {
            return 10;
          } else if (candidateTitle.includes(roleTitleLower) || roleTitleLower.includes(candidateTitle)) {
            return 8;
          } else {
            // Check for word-level matches
            const roleWords = roleTitle.split(' ').filter((word: string) => word.length > 3);
            const titleWords = candidateTitle.split(' ').filter((word: string) => word.length > 3);
            
            const matchingWords = roleWords.filter((word: string) => 
              titleWords.some(titleWord => titleWord.includes(word) || word.includes(titleWord))
            ).length;

            return (matchingWords / roleWords.length) * 5;
          }
        });

        // Take the highest match score among selected roles
        matchScore += Math.max(...roleMatchScores);
      }

      // ... rest of the existing search logic ...

      return { ...candidate, matchScore };
    });
}

export const HIRING_CONTEXT_ACCOMPLISHMENTS = [
  // Existing accomplishments
  'Led successful Series A fundraising',
  'Built and scaled engineering team',
  'Launched MVP to market',
  'Secured first enterprise customer',
  'Developed core product features',
  'Established development processes',
  'Implemented CI/CD pipeline',
  'Reduced technical debt',
  'Improved system performance',
  'Enhanced security measures',
  'Optimized database queries',
  'Automated testing processes',
  'Deployed microservices architecture',
  'Implemented monitoring systems',
  'Reduced deployment time',
  'Improved code quality',
  'Enhanced user experience',
  'Optimized resource usage',
  'Implemented agile practices',
  'Reduced bug resolution time',
  // New sales-focused accomplishments
  'Scale Series A sales',
  'Build enterprise sales team',
  'Launch international sales',
  'Shift to mid-market sales',
  'Implement consultative selling',
  'Develop channel partnerships',
  'Optimize sales operations',
  'Establish outbound sales',
  'Boost customer retention'
];

export const HIRING_CONTEXT_GOALS = [
  // Existing goals
  'Scale engineering team',
  'Improve product performance',
  'Reduce technical debt',
  'Enhance security measures',
  'Optimize resource usage',
  'Implement best practices',
  'Automate processes',
  'Improve code quality',
  'Enhance user experience',
  'Reduce deployment time',
  'Improve system reliability',
  'Optimize database performance',
  'Enhance monitoring systems',
  'Implement agile practices',
  'Reduce bug resolution time',
  'Improve team productivity',
  'Enhance collaboration',
  'Optimize development workflow',
  'Improve code maintainability',
  'Enhance system scalability',
  // New sales-focused goals
  'Rapidly grow startup revenue',
  'Accelerate SaaS customer acquisition',
  'Increase retention through upselling',
  'Secure strategic enterprise partnerships',
  'Expand outbound sales pipeline',
  'Close high-value enterprise deals',
  'Build high-performing sales team',
  'Exceed ambitious sales targets'
];

export const HIRING_CONTEXT_MILESTONES = [
  // Existing milestones
  'Team size doubled',
  'Product performance improved 50%',
  'Technical debt reduced 30%',
  'Security measures enhanced',
  'Resource usage optimized 40%',
  'Processes automated 60%',
  'Code quality improved',
  'User experience enhanced',
  'Deployment time reduced 50%',
  'System reliability improved',
  'Database performance optimized',
  'Monitoring systems enhanced',
  'Agile practices implemented',
  'Bug resolution time reduced',
  'Team productivity improved',
  'Collaboration enhanced',
  'Development workflow optimized',
  'Code maintainability improved',
  'System scalability enhanced',
  'Customer satisfaction improved',
  // New sales-focused milestones
  'Consistently surpass monthly quotas',
  'Shorten sales cycle 25%',
  'Grow customers 50% in 6 months',
  'Launch strategic sales partnership',
  'Grow MRR by 30%',
  'Enter new market successfully'
]; 