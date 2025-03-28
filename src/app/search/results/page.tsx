'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SearchWizardData, SearchResultsState, SearchFilters, Candidate, Tag } from '@/lib/types/search';
import { mockCandidates, defaultFilters } from '@/lib/mock-data/search-results';
import { CandidateCard } from '@/components/search/CandidateCard';
import ShortlistDrawer from '@/components/search/ShortlistDrawer';
import { default as FiltersPanel } from '@/components/search/SearchFilters';
import { roleSpecificCandidates } from '@/lib/mock-data/role-specific-candidates';
import { useRouter } from 'next/navigation';

// Function to get min years from experience level
function getMinYearsFromExperienceLevel(level?: string): number {
  switch (level) {
    case '0-2-years': return 0;
    case '2-5-years': return 2;
    case '5-8-years': return 5;
    case '8-12-years': return 8;
    case '12-plus-years': return 12;
    case 'entry': return 0;
    case 'mid': return 2;
    case 'senior': return 5;
    case 'lead': return 8;
    default: return 0;
  }
}

// Improve the candidate matching score calculation
function calculateHiringContextMatchScore(candidate: Candidate, searchCriteria: SearchWizardData): number {
  let score = 60; // Base score
  const maxScore = 100;
  
  try {
  // Match based on company stage
  if (searchCriteria.hiringContext?.companyStage && 
        candidate.context?.startupStages?.some(stage => 
          stage.toLowerCase().includes(searchCriteria.hiringContext.companyStage.toLowerCase()) ||
          searchCriteria.hiringContext.companyStage.toLowerCase().includes(stage.toLowerCase())
        )) {
    score += 5;
  }
  
  // Match based on industry
  if (searchCriteria.basicCriteria?.industry) {
      const industry = searchCriteria.basicCriteria.industry;
    if (candidate.context?.industries?.some(i => 
      i.toLowerCase().includes(industry.toLowerCase()) ||
      industry.toLowerCase().includes(i.toLowerCase())
    )) {
      score += 5;
    }
  }
  
  // Match based on skills
  const searchSkills = searchCriteria.basicCriteria?.skills || [];
  if (searchSkills.length > 0) {
    const candidateSkills = [
      ...(candidate.skills.technical || []),
      ...(candidate.skills.soft || [])
    ];
    
    // Convert search skills to an array of lowercase string labels
    const searchSkillLabels: string[] = [];
    
    searchSkills.forEach((skill: Tag | string) => {
      if (typeof skill === 'string') {
        searchSkillLabels.push(skill.toLowerCase());
      } else if (skill && typeof skill === 'object' && 'label' in skill) {
        searchSkillLabels.push(skill.label.toLowerCase());
      }
    });
    
    const candidateSkillLabels = candidateSkills.map(s => s.label.toLowerCase());
    
    // Calculate skill match percentage
    let matchedSkills = 0;
    searchSkillLabels.forEach((searchSkill: string) => {
      if (candidateSkillLabels.some(candidateSkill => 
        candidateSkill.includes(searchSkill) || searchSkill.includes(candidateSkill)
      )) {
        matchedSkills++;
      }
    });
    
    if (searchSkillLabels.length > 0) {
      const skillMatchPercentage = matchedSkills / searchSkillLabels.length;
        score += Math.floor(skillMatchPercentage * 20); // Up to 20 points for skills
    }
  }
  
  // Match based on experience level
  if (searchCriteria.basicCriteria?.experienceLevel) {
    const minYears = getMinYearsFromExperienceLevel(searchCriteria.basicCriteria.experienceLevel);
    if (candidate.experience.years >= minYears) {
      score += 5;
    }
  }
    
    // Match based on context keywords
    if (searchCriteria.hiringContext?.context) {
      const contextDescription = searchCriteria.hiringContext.context.toLowerCase();
      
      // Extract keywords from context
      const commonWords = ['and', 'the', 'to', 'of', 'in', 'on', 'with', 'for', 'a', 'an', 'our', 'we', 'is', 'are'];
      const contextKeywords = contextDescription.split(/\s+/)
        .map((word: string) => word.replace(/[.,;:!?()"']/g, ''))
        .filter((word: string) => word.length > 3 && !commonWords.includes(word));
      
      // Check if candidate has matching keywords in their profile
      let keywordMatches = 0;
      
      // Check candidate title
      const title = candidate.title.toLowerCase();
      contextKeywords.forEach((keyword: string) => {
        if (title.includes(keyword)) keywordMatches++;
      });
      
      // Check candidate context
      if (candidate.context.about) {
        const about = candidate.context.about.toLowerCase();
        contextKeywords.forEach((keyword: string) => {
          if (about.includes(keyword)) keywordMatches++;
        });
      }
      
      // Check achievements
      candidate.context.achievements.forEach((achievement: string) => {
        contextKeywords.forEach((keyword: string) => {
          if (achievement.toLowerCase().includes(keyword)) keywordMatches++;
        });
      });
      
      if (contextKeywords.length > 0) {
        const keywordMatchScore = Math.min(10, keywordMatches * 2); // Max 10 points for context keywords
        score += keywordMatchScore;
      }
    }
  
  // Clamp score between 60-100
  return Math.min(Math.max(score, 60), maxScore);
  } catch (err) {
    console.error('Error calculating match score:', err);
    return 60; // Return base score on error
  }
}

export default function SearchResultsPage() {
  const router = useRouter();
  const [searchCriteria, setSearchCriteria] = useState<any>(null);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [showShortlist, setShowShortlist] = useState(false);
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
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

  // Initialize data and error handling
  useEffect(() => {
    try {
      // Verify we have proper candidates data
      if (!roleSpecificCandidates || !Array.isArray(roleSpecificCandidates) || roleSpecificCandidates.length === 0) {
        console.error('Role-specific candidates data is missing or empty');
        setError('Failed to load candidate data. Please try again later.');
        setIsLoading(false);
        return;
      }
      
      // Check for stored search criteria
      const storedCriteria = localStorage.getItem('searchCriteria');
      console.log('Stored Criteria:', storedCriteria);
      
      if (!storedCriteria) {
        console.log('No search criteria found, redirecting to wizard');
        router.push('/search/wizard');
        return;
      }

      const parsedCriteria = JSON.parse(storedCriteria);
      console.log('Parsed Criteria:', parsedCriteria);
      setSearchCriteria(parsedCriteria);
      
      // Check for search context and extract keywords
      const searchContext = parsedCriteria.hiringContext?.context || '';
      let contextKeywords: string[] = [];
      
      if (searchContext) {
        // Extract meaningful keywords from the context, removing common words
        const commonWords = ['and', 'the', 'to', 'of', 'in', 'on', 'with', 'for', 'a', 'an', 'our', 'we', 'is', 'are'];
        const allWords = searchContext.toLowerCase().split(/\s+/)
          .map((word: string) => word.replace(/[.,;:!?()"']/g, '')) // Remove punctuation
          .filter((word: string) => word.length > 3 && !commonWords.includes(word)); // Filter common words and short words
        
        // Count word frequency to find most important terms
        const wordCount = new Map<string, number>();
        allWords.forEach((word: string) => {
          wordCount.set(word, (wordCount.get(word) || 0) + 1);
        });
        
        // Sort by frequency and take top keywords
        contextKeywords = Array.from(wordCount.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(entry => entry[0]);
          
        console.log('Extracted context keywords:', contextKeywords);
      }
      
      // Create context-based skills for filtering
      let contextSkills: Tag[] = [];
      if (contextKeywords.length > 0) {
        contextSkills = contextKeywords.map(keyword => ({
          id: `context-${keyword}`,
          label: keyword,
          category: 'context'
        }));
      }
      
      // Initialize filters from search criteria with extracted keywords
      setFilters({
        roleTitle: parsedCriteria.basicCriteria?.roleTitle || [],
        industry: parsedCriteria.basicCriteria?.industry || '',
        experienceLevel: parsedCriteria.basicCriteria?.experienceLevel || '',
        skills: [...(parsedCriteria.basicCriteria?.skills || []), ...contextSkills].map(skill => 
          typeof skill === 'string' ? skill : skill.label
        ),
        goal: parsedCriteria.hiringContext?.goal || '',
        companyStage: parsedCriteria.hiringContext?.companyStage || '',
        milestones: parsedCriteria.hiringContext?.milestones?.map((m: any) => typeof m === 'string' ? m : m.label) || [],
        accomplishments: parsedCriteria.hiringContext?.accomplishments?.map((a: any) => typeof a === 'string' ? a : a.label) || [],
        culturalValues: parsedCriteria.hiringContext?.culturalValues?.map((v: any) => typeof v === 'string' ? v : v.label) || [],
        context: searchContext || '',
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

      // Let the existing useEffect handle filtering
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading search criteria:', err);
      setError('Failed to load search criteria. Please try again.');
      
      // Display all candidates as fallback
      if (roleSpecificCandidates && roleSpecificCandidates.length > 0) {
        setFilteredCandidates(roleSpecificCandidates);
      }
      
      setIsLoading(false);
    }
  }, [router]);

  // Modify the useEffect that handles filtering
  useEffect(() => {
    // Skip filtering if we have an error
    if (error) return;
    
    // Make sure we have valid data
    if (!roleSpecificCandidates || !Array.isArray(roleSpecificCandidates) || roleSpecificCandidates.length === 0) {
      setError('No candidate data available.');
      return;
    }
    
    // Always start with all available candidates
    let filtered = [...roleSpecificCandidates];
    let appliedFilters = false;
    console.log('Total candidates before filtering:', filtered.length);
    
    try {
      // Calculate hiring context match scores for all candidates - with error handling
      if (searchCriteria) {
        filtered = filtered.map(candidate => {
          try {
            return {
              ...candidate,
              hiringContextMatchScore: calculateHiringContextMatchScore(candidate, searchCriteria)
            };
          } catch (err) {
            console.error('Error calculating match score for candidate:', candidate.id, err);
            return {
              ...candidate,
              hiringContextMatchScore: 60 // Default score on error
            };
          }
        });
      }
      
      // Apply basic criteria filters - but make them more lenient
      
      // Role filter with broader matching
      if (searchCriteria?.basicCriteria?.roleTitle) {
        appliedFilters = true;
        const roleValue = searchCriteria.basicCriteria.roleTitle.toLowerCase();
        
        // Try exact matches first
        const exactMatches = filtered.filter(candidate => 
          candidate.title.toLowerCase() === roleValue
        );
        
        // If we have exact matches, use those
        if (exactMatches.length > 0) {
          filtered = exactMatches;
        } else {
          // Otherwise try partial matches
          const partialMatches = filtered.filter(candidate => 
            candidate.title.toLowerCase().includes(roleValue) || 
            roleValue.includes(candidate.title.toLowerCase())
          );
          
          // If we have partial matches, use those
          if (partialMatches.length > 0) {
            filtered = partialMatches;
          } else {
            // If still no matches, try word-level matching
            const roleWords = roleValue.split(/\s+/).filter((word: string) => word.length > 3);
            
            if (roleWords.length > 0) {
              const wordMatches = filtered.filter(candidate => {
                const titleWords = candidate.title.toLowerCase().split(/\s+/);
                return roleWords.some((roleWord: string) => 
                  titleWords.some((titleWord: string) => 
                    titleWord.includes(roleWord) || roleWord.includes(titleWord)
                  )
                );
              });
              
              if (wordMatches.length > 0) {
                filtered = wordMatches;
              }
              // If still no matches, we'll keep all candidates - addressed at the end
            }
          }
        }
        
        console.log('After role filter:', filtered.length);
      }
      
      // Industry filter - more lenient
      if (searchCriteria?.basicCriteria?.industry) {
        appliedFilters = true;
        const industryValue = searchCriteria.basicCriteria.industry.toLowerCase();
        
        const industryMatches = filtered.filter(candidate => 
          candidate.context && candidate.context.industries && 
          candidate.context.industries.some(i => 
            i.toLowerCase().includes(industryValue) || 
            industryValue.includes(i.toLowerCase())
          )
        );
        
        if (industryMatches.length > 0) {
          filtered = industryMatches;
        }
        
        console.log('After industry filter:', filtered.length);
      }
      
      // Skills filter - improved lenient matching
      if (searchCriteria?.basicCriteria?.skills && searchCriteria.basicCriteria.skills.length > 0) {
        appliedFilters = true;
        // Get all skill labels from skills array
        const skillLabels = searchCriteria.basicCriteria.skills.map((skill: any) => 
          typeof skill === 'string' ? skill.toLowerCase() : (skill.label || skill.id || '').toLowerCase()
        ).filter(Boolean);
        
        if (skillLabels.length > 0) {
          const skillsMatches = filtered.filter(candidate => {
            // Get all skill labels from candidate
            const candidateSkillLabels = [
              ...(candidate.skills.technical || []).map(s => s.label.toLowerCase()),
              ...(candidate.skills.soft || []).map(s => s.label.toLowerCase())
            ];
            
            // For lenient matching, require at least one skill match
            return skillLabels.some((skillLabel: string) => 
              candidateSkillLabels.some(candidateSkill => 
                candidateSkill.includes(skillLabel) || 
                skillLabel.includes(candidateSkill)
              )
            );
          });
          
          if (skillsMatches.length > 0) {
            filtered = skillsMatches;
          }
        }
        
        console.log('After skills filter:', filtered.length);
      }
      
      // Experience level filter - more lenient
      if (searchCriteria?.basicCriteria?.experienceLevel) {
        appliedFilters = true;
        const levelToYears: { [key: string]: [number, number] } = {
          'entry': [0, 2],
          'mid': [2, 5],
          'senior': [5, 8],
          'lead': [8, 100],
          '0-2-years': [0, 2],
          '2-5-years': [2, 5],
          '5-8-years': [5, 8],
          '8-12-years': [8, 12],
          '12-plus-years': [12, 100]
        };
        
        const level = searchCriteria.basicCriteria.experienceLevel;
        
        if (level in levelToYears) {
          const [minYears, maxYears] = levelToYears[level];
          
          const experienceMatches = filtered.filter(candidate =>
            candidate.experience.years >= minYears &&
            (level === 'lead' || level === '12-plus-years' || candidate.experience.years <= maxYears)
          );
          
          if (experienceMatches.length > 0) {
            filtered = experienceMatches;
          }
        }
        
        console.log('After experience filter:', filtered.length);
      }
      
      // Hiring context filters - make these lenient too
      if (searchCriteria?.hiringContext) {
        // Company stage filter
        if (searchCriteria.hiringContext.companyStage) {
          appliedFilters = true;
          const stageValue = searchCriteria.hiringContext.companyStage.toLowerCase();
          
          const stageMatches = filtered.filter(candidate => 
            candidate.context && 
            candidate.context.startupStages &&
            candidate.context.startupStages.some(stage => 
              stage.toLowerCase().includes(stageValue) || 
              stageValue.includes(stage.toLowerCase())
            )
          );
          
          if (stageMatches.length > 0) {
            filtered = stageMatches;
          }
          
          console.log('After company stage filter:', filtered.length);
        }
        
        // Additional hiring context filters can be added here
      }
      
      // IMPORTANT: If no results after applying filters, show all candidates
      if (filtered.length === 0 && appliedFilters) {
        console.log('No results after filtering, showing all candidates');
        filtered = roleSpecificCandidates.map(candidate => {
          try {
            return {
              ...candidate,
              hiringContextMatchScore: calculateHiringContextMatchScore(candidate, searchCriteria || {
                basicCriteria: { roleTitle: '', industry: '', experienceLevel: '', skills: [] },
                hiringContext: { goal: '', companyStage: '', milestones: [], accomplishments: [], culturalValues: [] }
              })
            };
          } catch (err) {
            console.error('Error calculating match score for all candidates fallback:', candidate.id, err);
            return {
              ...candidate,
              hiringContextMatchScore: 60 // Default score on error
            };
          }
        });
      }
      
      // Sort by match score
      filtered.sort((a, b) => {
        const scoreA = a.hiringContextMatchScore || a.matchScore || 0;
        const scoreB = b.hiringContextMatchScore || b.matchScore || 0;
        return scoreB - scoreA;
      });
      
      console.log('Final candidates count:', filtered.length);
      setFilteredCandidates(filtered);
      
      // Clear any previous errors if we successfully filtered
      if (error) setError(null);
    } catch (err) {
      console.error('Error filtering candidates:', err);
      // Fallback to showing all candidates if there's an error
      setFilteredCandidates(roleSpecificCandidates);
      setError('An error occurred while filtering candidates. Showing all candidates instead.');
    }
  }, [searchCriteria, roleSpecificCandidates, error]);

  const handleFilter = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleShortlistToggle = (candidateId: string) => {
    setShortlist((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleViewProfile = (candidateId: string) => {
    // Just log the ID, the CandidateCard now handles showing the detail modal
    console.log(`Viewing profile for candidate ${candidateId}`);
  };

  // Calculate pagination
  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return a component that shows progress while loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center h-96">
            <div className="w-16 h-16 border-4 border-[#fbb130] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#735365]">Loading search results...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
            <p className="text-sm mt-2">
              {filteredCandidates.length > 0 
                ? "We're showing all available candidates as a fallback." 
                : "Please try adjusting your search criteria or start a new search."}
            </p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar with filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full md:w-64 lg:w-72 shrink-0"
            >
              <FiltersPanel
                filters={filters} 
                onFiltersChange={handleFilter} 
                onClose={() => setShowFilters(false)}
              />
            </motion.div>
          )}

          {/* Main content */}
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-[#735365] mb-1">
                  {filteredCandidates.length} Candidates
                </h1>
                <p className="text-[#735365]/80">
                  {searchCriteria?.basicCriteria?.roleTitle || 'All roles'}
                  {searchCriteria?.basicCriteria?.industry
                    ? ` in ${searchCriteria.basicCriteria.industry}`
                    : ''}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 bg-white border border-[#e5e7eb] rounded-md text-[#735365] hover:bg-gray-50"
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
                <button
                  onClick={() => setShowShortlist(true)}
                  className="p-2 bg-[#fbb130] text-white rounded-md hover:bg-[#fbb130]/90 relative"
                >
                  Shortlist
                  {shortlist.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent-teal text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {shortlist.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Display grid of candidate cards */}
            {paginatedCandidates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedCandidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onShortlistToggle={handleShortlistToggle}
                    isShortlisted={shortlist.includes(candidate.id)}
                    onViewProfile={handleViewProfile}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg border border-[#e5e7eb] p-6">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-xl font-semibold text-[#735365] mb-2">
                  No candidates found
                </h2>
                <p className="text-[#735365] text-center mb-4">
                  Try adjusting your search criteria to find more candidates.
                </p>
                <button
                  onClick={() => router.push('/search/wizard')}
                  className="px-4 py-2 bg-[#fbb130] text-white rounded-md hover:bg-[#fbb130]/90"
                >
                  Start New Search
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="inline-flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-[#e5e7eb] rounded-md text-[#735365] disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1.5 border rounded-md ${
                          page === currentPage
                            ? 'bg-[#fbb130] text-white'
                            : 'border-[#e5e7eb] text-[#735365]'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 border border-[#e5e7eb] rounded-md text-[#735365] disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shortlist drawer */}
      <ShortlistDrawer
        isOpen={showShortlist}
        onClose={() => setShowShortlist(false)}
        shortlistedCandidates={filteredCandidates.filter((c) =>
          shortlist.includes(c.id)
        )}
        onRemoveFromShortlist={handleShortlistToggle}
        onViewProfile={handleViewProfile}
      />
    </div>
  );
}