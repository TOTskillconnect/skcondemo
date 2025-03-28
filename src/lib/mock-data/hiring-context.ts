export interface HiringContextSuggestion {
  id: string;
  label: string;
  category: 'goal' | 'milestone' | 'accomplishment' | 'cultural-value';
  description?: string;
}

export const HIRING_CONTEXT_SUGGESTIONS: HiringContextSuggestion[] = [
  // Goals
  {
    id: 'scale-product',
    label: 'Scale an existing product',
    category: 'goal',
    description: 'Growing user base and improving performance of current product',
  },
  {
    id: 'launch-mvp',
    label: 'Launch MVP',
    category: 'goal',
    description: 'Building and launching first version of product',
  },
  {
    id: 'expand-team',
    label: 'Expand team capabilities',
    category: 'goal',
    description: 'Adding new skills and expertise to the team',
  },
  {
    id: 'new-product',
    label: 'Build new product line',
    category: 'goal',
    description: 'Developing additional products or features',
  },
  {
    id: 'improve-infra',
    label: 'Improve technical infrastructure',
    category: 'goal',
    description: 'Enhancing system architecture and development processes',
  },
  {
    id: 'enhance-ux',
    label: 'Enhance user experience',
    category: 'goal',
    description: 'Improving product usability and design',
  },
  
  // Milestones
  {
    id: 'user-growth',
    label: 'Scale to 50K users',
    category: 'milestone',
    description: 'Growing user base to 50,000 active users',
  },
  {
    id: 'revenue-target',
    label: 'Reach $1M ARR',
    category: 'milestone',
    description: 'Achieving $1M annual recurring revenue',
  },
  {
    id: 'team-size',
    label: 'Grow team to 20',
    category: 'milestone',
    description: 'Expanding team size to 20 members',
  },
  {
    id: 'market-expansion',
    label: 'Expand to 3 markets',
    category: 'milestone',
    description: 'Entering 3 new geographic markets',
  },
  {
    id: 'product-launch',
    label: 'Launch beta version',
    category: 'milestone',
    description: 'Releasing beta version of product',
  },
  {
    id: 'partnership',
    label: 'Secure 5 key partnerships',
    category: 'milestone',
    description: 'Establishing 5 strategic partnerships',
  },
  
  // Accomplishments
  {
    id: 'performance',
    label: 'Improve system performance',
    category: 'accomplishment',
    description: 'Enhancing system speed and reliability',
  },
  {
    id: 'automation',
    label: 'Automate key processes',
    category: 'accomplishment',
    description: 'Streamlining operations through automation',
  },
  {
    id: 'security',
    label: 'Enhance security measures',
    category: 'accomplishment',
    description: 'Strengthening system security',
  },
  {
    id: 'scalability',
    label: 'Improve system scalability',
    category: 'accomplishment',
    description: 'Making system more scalable',
  },
  {
    id: 'reliability',
    label: 'Increase system reliability',
    category: 'accomplishment',
    description: 'Improving system uptime and stability',
  },
  {
    id: 'efficiency',
    label: 'Optimize resource usage',
    category: 'accomplishment',
    description: 'Making better use of system resources',
  },
  
  // Cultural Values
  {
    id: 'innovation',
    label: 'Innovation',
    category: 'cultural-value',
    description: 'Fostering creative and innovative solutions',
  },
  {
    id: 'collaboration',
    label: 'Collaboration',
    category: 'cultural-value',
    description: 'Working together effectively as a team',
  },
  {
    id: 'ownership',
    label: 'Ownership',
    category: 'cultural-value',
    description: 'Taking responsibility for outcomes',
  },
  {
    id: 'customer-focus',
    label: 'Customer Focus',
    category: 'cultural-value',
    description: 'Prioritizing customer needs and satisfaction',
  },
  {
    id: 'data-driven',
    label: 'Data-Driven',
    category: 'cultural-value',
    description: 'Making decisions based on data and metrics',
  },
  {
    id: 'continuous-learning',
    label: 'Continuous Learning',
    category: 'cultural-value',
    description: 'Encouraging ongoing skill development',
  },
];

export const getHiringContextSuggestions = (
  query: string,
  category?: HiringContextSuggestion['category']
): HiringContextSuggestion[] => {
  const normalizedQuery = query.toLowerCase().trim();
  
  return HIRING_CONTEXT_SUGGESTIONS
    .filter(suggestion => 
      (!category || suggestion.category === category) &&
      (suggestion.label.toLowerCase().includes(normalizedQuery) ||
       suggestion.description?.toLowerCase().includes(normalizedQuery))
    )
    .slice(0, 5); // Limit to 5 suggestions
}; 