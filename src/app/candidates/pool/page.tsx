'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Candidate, SearchWizardData, SearchFilters } from '@/lib/types/search';
import { MOCK_CANDIDATES } from '@/lib/utils/search';
import { calculateHiringContextMatchScore } from '@/lib/utils/search';
import { CandidateCard } from '@/components/search/CandidateCard';
import { FilterSidebar } from '@/components/search/FilterSidebar';
import ShortlistDrawer from '@/components/search/ShortlistDrawer';
import CompareCandidatesModal from '@/components/search/CompareCandidatesModal';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, SlidersHorizontal, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Tag } from '@/components/ui/tag-input';
import { Candidate as CandidateType } from '@/lib/types/candidate';

// Define saved search interface
interface SavedSearch {
  id: string;
  name: string;
  criteria: SearchWizardData;
}

// Add hiring context to candidate for match score calculation
interface CandidateWithHiringContext extends Candidate {
  hiringContextMatchScore: number;
  matchScore: number;
  lastVerified: string;
  hiringContext: {
    goal: string;
    companyStage: string;
    milestones: string[];
    accomplishments: string[];
    culturalValues: string[];
  };
}

// Define sort options
type SortOption = 'matchScore' | 'experience' | 'availability' | 'verification';

export default function CandidatePoolPage() {
  // State for candidates and filtering
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [shortlistedCandidates, setShortlistedCandidates] = useState<string[]>([]);
  const [showShortlist, setShowShortlist] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [candidatesToCompare, setCandidatesToCompare] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState<SortOption>('matchScore');
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for filters
  const [filters, setFilters] = useState<Required<SearchFilters>>({
    roleTitle: [],
    industry: '',
    experienceLevel: '',
    skills: [],
    goal: '',
    companyStage: '',
    milestones: [],
    accomplishments: [],
    culturalValues: [],
    context: '',
    verification: {
      requireSkillVerification: false,
      requireIdentityVerification: false,
      requireRoleplayVerification: false
    },
    location: {
      cities: [],
      remoteOnly: false
    }
  });

  const router = useRouter();

  // Initialize candidates on page load
  useEffect(() => {
    // In a real app, you would fetch candidates from an API
    const candidatesWithContext = MOCK_CANDIDATES.map(candidate => {
      // Calculate match score based on the current filters
      const matchScore = calculateHiringContextMatchScore(candidate, {
        hiringContext: {
          goal: filters.goal,
          companyStage: filters.companyStage,
          milestones: filters.milestones,
          accomplishments: filters.accomplishments,
          culturalValues: filters.culturalValues,
        }
      });
      
      return {
        ...candidate,
        hiringContextMatchScore: matchScore || 0, // Ensure it's always a number
      };
    });
    
    setCandidates(candidatesWithContext);
    
    // Load saved searches from localStorage
    const savedSearchesFromStorage = localStorage.getItem('savedSearches');
    if (savedSearchesFromStorage) {
      setSavedSearches(JSON.parse(savedSearchesFromStorage));
    }
    
    // Load shortlisted candidates from localStorage
    const shortlistedFromStorage = localStorage.getItem('shortlistedCandidatesPool');
    if (shortlistedFromStorage) {
      setShortlistedCandidates(JSON.parse(shortlistedFromStorage));
    }
  }, []);

  // Update filtered candidates when filters change
  useEffect(() => {
    // Update match scores based on new filters
    const updatedCandidates = candidates.map(candidate => {
      const matchScore = calculateHiringContextMatchScore(candidate, {
        hiringContext: {
          goal: filters.goal,
          companyStage: filters.companyStage,
          milestones: filters.milestones,
          accomplishments: filters.accomplishments,
          culturalValues: filters.culturalValues,
        }
      });
      
      return {
        ...candidate,
        hiringContextMatchScore: matchScore || 0, // Ensure it's always a number
      };
    });
    
    // Apply filters
    let filtered = updatedCandidates.filter(candidate => {
      // Filter by role title
      if (filters.roleTitle.length > 0 && !filters.roleTitle.some(role => 
        candidate.title.toLowerCase().includes(role.toLowerCase())
      )) {
        return false;
      }
      
      // Filter by industry
      if (filters.industry && 
          candidate.context.industries && 
          !candidate.context.industries.some(industry => 
            industry.toLowerCase().includes(filters.industry.toLowerCase())
          )) {
        return false;
      }
      
      // Filter by experience level
      if (filters.experienceLevel) {
        const years = candidate.experience.years;
        
        if (filters.experienceLevel === 'entry' && years >= 3) return false;
        if (filters.experienceLevel === 'mid' && (years < 3 || years > 6)) return false;
        if (filters.experienceLevel === 'senior' && (years < 7 || years > 10)) return false;
        if (filters.experienceLevel === 'lead' && years < 10) return false;
      }
      
      // Filter by skills
      if (filters.skills.length > 0) {
        const candidateSkills = [...candidate.skills.technical, ...candidate.skills.soft].map(skill => 
          skill.label.toLowerCase()
        );
        
        const hasAllSkills = filters.skills.every(skill => 
          candidateSkills.some(candidateSkill => 
            candidateSkill.includes(skill.toLowerCase())
          )
        );
        
        if (!hasAllSkills) return false;
      }
      
      // Filter by verification requirements
      if (filters.verification.requireSkillVerification &&
          !candidate.verification.some(v => v.type === 'skill')) {
        return false;
      }
      
      if (filters.verification.requireIdentityVerification &&
          !candidate.verification.some(v => v.type === 'identity')) {
        return false;
      }
      
      if (filters.verification.requireRoleplayVerification &&
          !candidate.verification.some(v => v.type === 'roleplay')) {
        return false;
      }
      
      // Filter by location
      if (filters.location.cities.length > 0 &&
          !filters.location.cities.some(city => 
            candidate.location.city.toLowerCase().includes(city.toLowerCase())
          )) {
        return false;
      }
      
      if (filters.location.remoteOnly && !candidate.location.remote) {
        return false;
      }
      
      return true;
    });
    
    // Sort candidates
    filtered = sortCandidates(filtered);
    
    setFilteredCandidates(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [candidates, filters, sortBy]);

  // Save shortlisted candidates to localStorage when changed
  useEffect(() => {
    localStorage.setItem('shortlistedCandidatesPool', JSON.stringify(shortlistedCandidates));
  }, [shortlistedCandidates]);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedCandidates = filteredCandidates.slice(startIndex, endIndex);

  // Function to handle filter changes
  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
    setCurrentPage(1);
  };

  // Function to reset filters
  const resetFilters = () => {
    setFilters({
      roleTitle: [],
      industry: '',
      experienceLevel: '',
      skills: [],
      goal: '',
      companyStage: '',
      milestones: [],
      accomplishments: [],
      culturalValues: [],
      context: '',
      verification: {
        requireSkillVerification: false,
        requireIdentityVerification: false,
        requireRoleplayVerification: false,
      },
      location: {
        cities: [],
        remoteOnly: false,
      },
    });
    setCurrentPage(1);
  };

  // Function to sort candidates based on selected option
  const sortCandidates = (candidates: Candidate[]) => {
    switch (sortBy) {
      case 'matchScore':
        return [...candidates].sort((a, b) => b.matchScore - a.matchScore);
      case 'experience':
        return [...candidates].sort((a, b) => b.experience.years - a.experience.years);
      case 'availability':
        const availabilityOrder: { [key: string]: number } = {
          'available': 0,
          'interviewing': 1,
          'hired': 2
        };
        return [...candidates].sort((a, b) => 
          availabilityOrder[a.availability.status] - availabilityOrder[b.availability.status]
        );
      case 'verification':
        return [...candidates].sort((a, b) => b.verification.length - a.verification.length);
      default:
        return candidates;
    }
  };

  // Function to filter candidates based on selected filters
  const filterCandidates = (candidates: Candidate[]) => {
    return candidates.filter(candidate => {
      // Filter by role title
      if (filters.roleTitle.length > 0 && !filters.roleTitle.some(role => 
        candidate.title.toLowerCase().includes(role.toLowerCase())
      )) {
        return false;
      }

      // Filter by industry
      if (filters.industry && !candidate.context.industries.some(industry => 
        industry.toLowerCase().includes(filters.industry.toLowerCase())
      )) {
        return false;
      }

      // Filter by experience level
      if (filters.experienceLevel) {
        const years = candidate.experience.years;
        
        if (filters.experienceLevel === 'entry' && years >= 3) return false;
        if (filters.experienceLevel === 'mid' && (years < 3 || years > 6)) return false;
        if (filters.experienceLevel === 'senior' && (years < 7 || years > 10)) return false;
        if (filters.experienceLevel === 'lead' && years < 10) return false;
      }

      // Filter by skills
      if (filters.skills.length > 0 && !filters.skills.every(skill => 
        [...candidate.skills.technical, ...candidate.skills.soft].some(s => 
          s.label.toLowerCase().includes(skill.toLowerCase())
        )
      )) {
        return false;
      }

      // Filter by verification requirements
      if (filters.verification.requireSkillVerification && candidate.verification.length === 0) {
        return false;
      }
      if (filters.verification.requireIdentityVerification && !candidate.verification.some(v => v.type === 'identity')) {
        return false;
      }
      if (filters.verification.requireRoleplayVerification && !candidate.verification.some(v => v.type === 'roleplay')) {
        return false;
      }

      // Filter by location
      if (filters.location.cities.length > 0 && !filters.location.cities.includes(candidate.location.city)) {
        return false;
      }
      if (filters.location.remoteOnly && !candidate.location.remote) {
        return false;
      }

      return true;
    });
  };

  // Function to save current search
  const handleSaveSearch = () => {
    const searchName = prompt('Enter a name for this search:');
    if (!searchName) return;
    
    const newSearch: SavedSearch = {
      id: `search-${Date.now()}`,
      name: searchName,
      criteria: {
        basicCriteria: {
          roleTitle: filters.roleTitle,
          industry: filters.industry,
          experienceLevel: filters.experienceLevel,
          skills: filters.skills.map(skill => ({ id: skill, label: skill })),
        },
        hiringContext: {
          goal: filters.goal,
          companyStage: filters.companyStage,
          milestones: filters.milestones?.map(milestone => ({ id: milestone, label: milestone })) || [],
          accomplishments: filters.accomplishments?.map(acc => ({ id: acc, label: acc })) || [],
          culturalValues: filters.culturalValues?.map(value => ({ id: value, label: value })) || [],
          context: filters.context,
        }
      }
    };
    
    const updatedSearches = [...savedSearches, newSearch];
    setSavedSearches(updatedSearches);
    localStorage.setItem('savedSearches', JSON.stringify(updatedSearches));
  };

  // Function to load a saved search
  const handleLoadSearch = (searchId: string) => {
    if (!searchId) return;
    
    const search = savedSearches.find(s => s.id === searchId);
    if (!search) return;
    
    setFilters({
      roleTitle: search.criteria.basicCriteria.roleTitle,
      industry: search.criteria.basicCriteria.industry,
      experienceLevel: search.criteria.basicCriteria.experienceLevel,
      skills: search.criteria.basicCriteria.skills.map(skill => skill.label),
      goal: search.criteria.hiringContext.goal,
      companyStage: search.criteria.hiringContext.companyStage,
      milestones: search.criteria.hiringContext.milestones.map(m => m.label),
      accomplishments: search.criteria.hiringContext.accomplishments.map(a => a.label),
      culturalValues: search.criteria.hiringContext.culturalValues.map(v => v.label),
      context: search.criteria.hiringContext.context,
      verification: {
        requireSkillVerification: false,
        requireIdentityVerification: false,
        requireRoleplayVerification: false
      },
      location: {
        cities: [],
        remoteOnly: false
      }
    });
  };

  // Function to toggle shortlist status for a candidate
  const handleShortlistToggle = (candidateId: string) => {
    setShortlistedCandidates(prev => {
      if (prev.includes(candidateId)) {
        return prev.filter(id => id !== candidateId);
      }
      return [...prev, candidateId];
    });
  };

  // Function to change page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const shortlistedCandidatesList = candidates.filter(candidate => 
    shortlistedCandidates.includes(candidate.id)
  );

  const candidatesForComparison = candidates.filter(candidate =>
    candidatesToCompare.includes(candidate.id)
  );

  const handleRemoveFromComparison = (candidateId: string) => {
    setCandidatesToCompare(prev => prev.filter(id => id !== candidateId));
  };

  const handleRemoveFromShortlist = (candidateId: string) => {
    setShortlistedCandidates(prev => prev.filter(id => id !== candidateId));
  };

  const handleViewProfile = (candidateId: string) => {
    // Implementation of handleViewProfile function
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              savedSearches={savedSearches}
              onLoadSearch={handleLoadSearch}
              onSaveSearch={handleSaveSearch}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-mauve-11">
                  Candidate Pool ({filteredCandidates.length})
                </h1>
                <div className="flex items-center space-x-4">
                  <Select
                    value={sortBy}
                    onChange={(value) => setSortBy(value as 'matchScore' | 'experience' | 'availability' | 'verification')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Sort by Relevance</SelectItem>
                      <SelectItem value="experience">Sort by Experience</SelectItem>
                      <SelectItem value="verification">Sort by Verification</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    className="bg-gold-9 text-white hover:bg-gold-10 transition-colors"
                    onClick={() => setShowShortlist(true)}
                  >
                    Shortlist ({shortlistedCandidates.length})
                  </Button>
                </div>
              </div>

              {displayedCandidates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedCandidates.map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      isShortlisted={shortlistedCandidates.includes(candidate.id)}
                      onShortlistToggle={handleShortlistToggle}
                      onViewProfile={handleViewProfile}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-mauve-11">No candidates found</p>
                  <Button
                    variant="outline"
                    className="mt-4 bg-gold-9 text-white hover:bg-gold-10 transition-colors"
                    onClick={resetFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="text-mauve-11 border-mauve-7 hover:bg-mauve-3"
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'default' : 'outline'}
                      onClick={() => handlePageChange(page)}
                      className={page === currentPage ? 
                        'bg-gold-9 text-white hover:bg-gold-10' : 
                        'text-mauve-11 border-mauve-7 hover:bg-mauve-3'}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="text-mauve-11 border-mauve-7 hover:bg-mauve-3"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Shortlist Drawer */}
      <ShortlistDrawer
        isOpen={showShortlist}
        onClose={() => setShowShortlist(false)}
        shortlistedCandidates={shortlistedCandidatesList}
        onRemoveFromShortlist={handleRemoveFromShortlist}
        onViewProfile={handleViewProfile}
      />

      {/* Compare Modal */}
      {showCompareModal && (
        <CompareCandidatesModal
          isOpen={showCompareModal}
          onClose={() => setShowCompareModal(false)}
          candidates={candidatesForComparison}
          onRemoveFromComparison={handleRemoveFromComparison}
        />
      )}
    </div>
  );
} 