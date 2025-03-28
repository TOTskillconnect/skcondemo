import { Candidate } from '@/lib/types/search';
import { MOCK_CANDIDATES } from '@/lib/utils/search';

// Log the loading of mock candidates for debugging
console.log(`Loading role-specific candidates module with ${MOCK_CANDIDATES?.length || 0} candidates`);

// Check if MOCK_CANDIDATES is properly imported
if (!MOCK_CANDIDATES || MOCK_CANDIDATES.length === 0) {
  console.error('Failed to load MOCK_CANDIDATES data!');
}

// Fallback data in case MOCK_CANDIDATES is not available
const FALLBACK_CANDIDATES: Candidate[] = Array(5).fill(null).map((_, i) => ({
  id: `fallback-${i}`,
  name: `Test Candidate ${i+1}`,
  title: `Fallback Role ${i+1}`,
  photoUrl: '',
  experience: { years: 5, startupYears: 2, notableProjects: [] },
  skills: { technical: [], soft: [] },
  verification: [],
  availability: { status: 'available', startDate: new Date().toISOString().split('T')[0] },
  location: { city: 'Test City', country: 'Test Country', remote: true },
  context: { industries: [], startupStages: [], achievements: [], culturalValues: [] },
  matchScore: 75,
  lastVerified: new Date().toISOString().split('T')[0]
}));

// Use our diverse candidate pool for role-specific candidates
export const roleSpecificCandidates = MOCK_CANDIDATES?.length > 0 ? MOCK_CANDIDATES : FALLBACK_CANDIDATES; 