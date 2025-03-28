import { Candidate, Tag } from '@/lib/types/search';

export const salesCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Olivia Carter',
    title: 'Senior SaaS Sales Executive',
    experience: {
      years: 8,
      startupYears: 5,
      notableProjects: [
        'Stripe Partnership Program',
        'Shopify Enterprise Sales Initiative',
        'Sales Team Expansion Project'
      ]
    },
    matchScore: 95,
    skills: {
      technical: [
        { id: 'h1', label: 'Enterprise SaaS sales' },
        { id: 'h2', label: 'CRM (Salesforce)' },
        { id: 'h3', label: 'Negotiation' },
        { id: 'h4', label: 'Pipeline management' }
      ],
      soft: [
        { id: 's1', label: 'Persuasive communication' },
        { id: 's2', label: 'Team leadership' },
        { id: 's3', label: 'Adaptability' },
        { id: 's4', label: 'Strategic thinking' }
      ]
    },
    context: {
      startupStages: ['Series A', 'Series B'],
      industries: ['SaaS', 'Fintech'],
      achievements: [
        'Grew annual revenue from $250K to $1.5M in 12 months',
        'Consistently achieved 120% of quarterly sales quotas',
        'Built and trained a high-performing sales team of 6 reps'
      ]
    },
    hiringContext: {
      goal: 'Scale sales team and revenue for Series B growth',
      companyStage: 'Series B',
      milestones: [
        'Promoted to Senior Sales Executive after driving rapid company growth',
        'Successfully closed strategic partnerships with Stripe and Shopify'
      ],
      accomplishments: [
        'Grew annual revenue from $250K to $1.5M in 12 months',
        'Consistently achieved 120% of quarterly sales quotas',
        'Built and trained a high-performing sales team of 6 reps'
      ],
      culturalValues: ['Leadership', 'Growth-mindset', 'Strategic thinking']
    },
    verification: [
      {
        type: 'skill',
        label: 'Enterprise Sales',
        icon: '💼',
        verifiedAt: '2024-02-01'
      }
    ],
    availability: {
      status: 'available',
      startDate: '2024-03-01'
    },
    location: {
      city: 'San Francisco',
      country: 'USA',
      remote: true
    },
    lastVerified: '2024-02-01'
  },
  {
    id: '2',
    name: 'Marcus Rivera',
    title: 'Enterprise Account Executive',
    experience: {
      years: 10,
      startupYears: 6,
      notableProjects: [
        'Fortune 500 Enterprise Deals',
        'CloudWave Sales Excellence Program',
        'Strategic Account Management Framework'
      ]
    },
    matchScore: 92,
    skills: {
      technical: [
        { id: 'h1', label: 'Complex deal management' },
        { id: 'h2', label: 'Solution selling' },
        { id: 'h3', label: 'Technical product demonstrations' }
      ],
      soft: [
        { id: 's1', label: 'Relationship building' },
        { id: 's2', label: 'Active listening' },
        { id: 's3', label: 'Resilience' },
        { id: 's4', label: 'Executive presence' }
      ]
    },
    context: {
      startupStages: ['Growth stage', 'Enterprise'],
      industries: ['B2B Software', 'Cloud Solutions'],
      achievements: [
        'Closed multiple enterprise deals exceeding $500K each',
        'Exceeded annual sales targets by 30% for three consecutive years',
        'Generated over $1M in annual recurring revenue'
      ]
    },
    hiringContext: {
      goal: 'Expand enterprise sales presence',
      companyStage: 'Growth stage',
      milestones: [
        'Awarded "Top Account Executive" (2023) at CloudWave',
        'Successfully secured major contracts with Fortune 500 companies'
      ],
      accomplishments: [
        'Closed multiple enterprise deals exceeding $500K each',
        'Exceeded annual sales targets by 30% for three consecutive years',
        'Generated over $1M in annual recurring revenue'
      ],
      culturalValues: ['Excellence', 'Customer focus', 'Innovation']
    },
    verification: [
      {
        type: 'skill',
        label: 'Enterprise Sales',
        icon: '💼',
        verifiedAt: '2024-01-15'
      }
    ],
    availability: {
      status: 'available',
      startDate: '2024-04-01'
    },
    location: {
      city: 'New York',
      country: 'USA',
      remote: true
    },
    lastVerified: '2024-01-15'
  },
  {
    id: '3',
    name: 'Sarah Chen',
    title: 'Sales Development Manager',
    experience: {
      years: 7,
      startupYears: 4,
      notableProjects: [
        'SDR Team Expansion',
        'Sales Process Optimization',
        'Lead Generation Strategy'
      ]
    },
    matchScore: 88,
    skills: {
      technical: [
        { id: 'h1', label: 'Sales development' },
        { id: 'h2', label: 'Lead qualification' },
        { id: 'h3', label: 'Sales automation tools' }
      ],
      soft: [
        { id: 's1', label: 'Team management' },
        { id: 's2', label: 'Process optimization' },
        { id: 's3', label: 'Mentoring' }
      ]
    },
    context: {
      startupStages: ['Seed', 'Series A'],
      industries: ['MarTech', 'AdTech'],
      achievements: [
        'Built and scaled SDR team from 3 to 15 members',
        'Increased qualified lead generation by 200%',
        'Implemented new sales automation system'
      ]
    },
    hiringContext: {
      goal: 'Build and scale SDR team',
      companyStage: 'Series A',
      milestones: [
        'Promoted to SDR Manager within 2 years',
        'Achieved highest team performance metrics'
      ],
      accomplishments: [
        'Built and scaled SDR team from 3 to 15 members',
        'Increased qualified lead generation by 200%',
        'Implemented new sales automation system'
      ],
      culturalValues: ['Leadership', 'Innovation', 'Collaboration']
    },
    verification: [
      {
        type: 'skill',
        label: 'Sales Development',
        icon: '📈',
        verifiedAt: '2024-01-20'
      }
    ],
    availability: {
      status: 'available',
      startDate: '2024-03-15'
    },
    location: {
      city: 'Boston',
      country: 'USA',
      remote: true
    },
    lastVerified: '2024-01-20'
  },
  {
    id: '4',
    name: 'David Park',
    title: 'Strategic Account Manager',
    experience: {
      years: 9,
      startupYears: 5,
      notableProjects: [
        'Key Account Growth Program',
        'Customer Success Framework',
        'Revenue Expansion Initiative'
      ]
    },
    matchScore: 90,
    skills: {
      technical: [
        { id: 'h1', label: 'Account management' },
        { id: 'h2', label: 'Revenue forecasting' },
        { id: 'h3', label: 'Customer success' }
      ],
      soft: [
        { id: 's1', label: 'Strategic planning' },
        { id: 's2', label: 'Client relationship' },
        { id: 's3', label: 'Problem solving' }
      ]
    },
    context: {
      startupStages: ['Series B', 'Series C'],
      industries: ['Enterprise Software', 'Cloud Infrastructure'],
      achievements: [
        'Managed $5M+ portfolio of strategic accounts',
        'Achieved 95% customer retention rate',
        'Drove 40% YoY account expansion'
      ]
    },
    hiringContext: {
      goal: 'Drive strategic account growth',
      companyStage: 'Series B',
      milestones: [
        'Top Strategic Account Manager 2023',
        'Led successful enterprise expansion program'
      ],
      accomplishments: [
        'Managed $5M+ portfolio of strategic accounts',
        'Achieved 95% customer retention rate',
        'Drove 40% YoY account expansion'
      ],
      culturalValues: ['Customer success', 'Excellence', 'Integrity']
    },
    verification: [
      {
        type: 'skill',
        label: 'Strategic Account Management',
        icon: '🎯',
        verifiedAt: '2024-01-25'
      }
    ],
    availability: {
      status: 'available',
      startDate: '2024-04-01'
    },
    location: {
      city: 'Seattle',
      country: 'USA',
      remote: true
    },
    lastVerified: '2024-01-25'
  },
  {
    id: '5',
    name: 'Emily Rodriguez',
    title: 'Sales Operations Manager',
    experience: {
      years: 6,
      startupYears: 3,
      notableProjects: [
        'Sales Tech Stack Optimization',
        'Revenue Operations Integration',
        'Sales Analytics Dashboard'
      ]
    },
    matchScore: 87,
    skills: {
      technical: [
        { id: 'h1', label: 'Sales operations' },
        { id: 'h2', label: 'Data analytics' },
        { id: 'h3', label: 'Process automation' }
      ],
      soft: [
        { id: 's1', label: 'Cross-functional leadership' },
        { id: 's2', label: 'Project management' },
        { id: 's3', label: 'Change management' }
      ]
    },
    context: {
      startupStages: ['Series A', 'Series B'],
      industries: ['B2B Tech', 'Analytics'],
      achievements: [
        'Reduced sales cycle by 40% through process optimization',
        'Implemented new sales tech stack saving $100K annually',
        'Built comprehensive sales analytics framework'
      ]
    },
    hiringContext: {
      goal: 'Optimize sales operations',
      companyStage: 'Series A',
      milestones: [
        'Led successful sales operations transformation',
        'Achieved highest sales efficiency metrics'
      ],
      accomplishments: [
        'Reduced sales cycle by 40% through process optimization',
        'Implemented new sales tech stack saving $100K annually',
        'Built comprehensive sales analytics framework'
      ],
      culturalValues: ['Data-driven', 'Efficiency', 'Innovation']
    },
    verification: [
      {
        type: 'skill',
        label: 'Sales Operations',
        icon: '⚙️',
        verifiedAt: '2024-02-01'
      }
    ],
    availability: {
      status: 'available',
      startDate: '2024-03-15'
    },
    location: {
      city: 'Austin',
      country: 'USA',
      remote: true
    },
    lastVerified: '2024-02-01'
  },
  {
    id: '6',
    name: 'Michael Chang',
    title: 'Enterprise Sales Director',
    experience: {
      years: 12,
      startupYears: 7,
      notableProjects: [
        'Global Enterprise Expansion',
        'Sales Leadership Program',
        'Enterprise Deal Framework'
      ]
    },
    matchScore: 94,
    skills: {
      technical: [
        { id: 'h1', label: 'Enterprise sales' },
        { id: 'h2', label: 'Sales strategy' },
        { id: 'h3', label: 'Deal structuring' }
      ],
      soft: [
        { id: 's1', label: 'Executive presence' },
        { id: 's2', label: 'Strategic thinking' },
        { id: 's3', label: 'Team leadership' }
      ]
    },
    context: {
      startupStages: ['Series B', 'Series C'],
      industries: ['Enterprise Software', 'Cloud Security'],
      achievements: [
        'Closed $10M+ in enterprise deals annually',
        'Built and led team of 12 enterprise AEs',
        'Established enterprise sales playbook'
      ]
    },
    hiringContext: {
      goal: 'Scale enterprise sales division',
      companyStage: 'Series B',
      milestones: [
        'Promoted to Enterprise Sales Director',
        'Achieved record-breaking enterprise revenue'
      ],
      accomplishments: [
        'Closed $10M+ in enterprise deals annually',
        'Built and led team of 12 enterprise AEs',
        'Established enterprise sales playbook'
      ],
      culturalValues: ['Leadership', 'Excellence', 'Results-driven']
    },
    verification: [
      {
        type: 'skill',
        label: 'Enterprise Sales Leadership',
        icon: '👔',
        verifiedAt: '2024-01-30'
      }
    ],
    availability: {
      status: 'available',
      startDate: '2024-04-01'
    },
    location: {
      city: 'Chicago',
      country: 'USA',
      remote: true
    },
    lastVerified: '2024-01-30'
  },
  {
    id: '7',
    name: 'Rachel Foster',
    title: 'Sales Enablement Manager',
    experience: {
      years: 8,
      startupYears: 4,
      notableProjects: [
        'Sales Training Program',
        'Onboarding Framework',
        'Sales Content Strategy'
      ]
    },
    matchScore: 89,
    skills: {
      technical: [
        { id: 'h1', label: 'Sales enablement' },
        { id: 'h2', label: 'Training development' },
        { id: 'h3', label: 'Content strategy' }
      ],
      soft: [
        { id: 's1', label: 'Communication' },
        { id: 's2', label: 'Coaching' },
        { id: 's3', label: 'Program management' }
      ]
    },
    context: {
      startupStages: ['Series A', 'Series B'],
      industries: ['SaaS', 'EdTech'],
      achievements: [
        'Reduced new hire ramp time by 50%',
        'Created comprehensive sales playbook',
        'Improved win rates by 35%'
      ]
    },
    hiringContext: {
      goal: 'Build sales enablement function',
      companyStage: 'Series A',
      milestones: [
        'Established sales enablement department',
        'Developed award-winning training program'
      ],
      accomplishments: [
        'Reduced new hire ramp time by 50%',
        'Created comprehensive sales playbook',
        'Improved win rates by 35%'
      ],
      culturalValues: ['Learning', 'Collaboration', 'Growth']
    },
    verification: [
      {
        type: 'skill',
        label: 'Sales Enablement',
        icon: '📚',
        verifiedAt: '2024-02-05'
      }
    ],
    availability: {
      status: 'available',
      startDate: '2024-03-15'
    },
    location: {
      city: 'Denver',
      country: 'USA',
      remote: true
    },
    lastVerified: '2024-02-05'
  }
]; 