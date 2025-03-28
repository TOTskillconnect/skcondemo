'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Candidate } from '@/lib/types/search';
import { useRouter } from 'next/navigation';
import Toast from '@/components/common/Toast';
import { roleSpecificCandidates } from '@/lib/mock-data/role-specific-candidates';
import Image from 'next/image';
import { XMarkIcon as XIcon, CheckIcon } from '@heroicons/react/24/outline';

interface AssessmentWizardProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCandidates?: Candidate[];
}

type AssessmentStep = 'goal' | 'type' | 'details' | 'candidates' | 'context' | 'preview';

interface TopicItem {
  id: string;
  value: string;
}

interface AssessmentFormData {
  goal: string;
  type: string;
  subType: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: TopicItem[];
  candidates: Candidate[];
  name: string;
  context: string;
  status: 'draft' | 'active' | 'template';
}

interface SavedAssessment {
  id: string;
  name: string;
  goal: string;
  type: string;
  subType: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: TopicItem[];
  candidates: string[]; // Store candidate IDs
  context: string;
  status: 'draft' | 'active' | 'template';
  createdAt: string;
  lastModified: string;
}

const assessmentTypes = [
  {
    id: 'technical',
    label: 'Technical Challenges',
    description: 'Evaluate coding skills, system design, and technical problem-solving',
    icon: '💻',
    subtypes: [
      { id: 'frontend', label: 'Front-end Coding Challenge' },
      { id: 'backend', label: 'Back-end Development Task' },
      { id: 'system-design', label: 'System Design Exercise' },
      { id: 'algorithms', label: 'Algorithm & Data Structures' },
    ],
  },
  {
    id: 'behavioral',
    label: 'Behavioral Games',
    description: 'Assess communication, teamwork, and stress handling abilities',
    icon: '🎮',
    subtypes: [
      { id: 'communication', label: 'Communication Exercise' },
      { id: 'teamwork', label: 'Team Collaboration Scenario' },
      { id: 'stress', label: 'Stress Management Challenge' },
      { id: 'leadership', label: 'Leadership Simulation' },
    ],
  },
  {
    id: 'values',
    label: 'Value Prompts',
    description: 'Evaluate cultural alignment and decision-making approach',
    icon: '🎯',
    subtypes: [
      { id: 'cultural', label: 'Cultural Fit Assessment' },
      { id: 'decision-making', label: 'Scenario-based Decision Making' },
      { id: 'ethics', label: 'Ethical Dilemmas' },
      { id: 'work-style', label: 'Work Style Preferences' },
    ],
  },
  {
    id: 'life-story',
    label: 'Life Story Q&A',
    description: 'Understand personality, motivations, and career journey',
    icon: '📖',
    subtypes: [
      { id: 'career', label: 'Career Journey Discussion' },
      { id: 'motivations', label: 'Motivation & Goals' },
      { id: 'achievements', label: 'Key Achievements' },
      { id: 'challenges', label: 'Overcoming Challenges' },
    ],
  },
];

// ShortlistSelect Component
interface ShortlistSelectProps {
  onSelectCandidates: (candidates: Candidate[]) => void;
  currentlySelected: Candidate[];
}

interface SavedShortlist {
  id: string;
  name: string;
  notes: string;
  candidates: string[];
  createdAt: string;
}

function ShortlistSelect({ onSelectCandidates, currentlySelected }: ShortlistSelectProps) {
  const [savedShortlists, setSavedShortlists] = useState<SavedShortlist[]>([]);
  const [selectedShortlist, setSelectedShortlist] = useState<string | null>(null);
  const [shortlistCandidates, setShortlistCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  useEffect(() => {
    // Load saved shortlists from localStorage
    try {
      const loadedShortlists = JSON.parse(localStorage.getItem('savedShortlists') || '[]');
      setSavedShortlists(loadedShortlists);
      console.log(`Loaded ${loadedShortlists.length} shortlists`);
    } catch (err) {
      console.error('Error loading shortlists:', err);
      setErrorMessage('Failed to load shortlists. Please try again.');
    }
  }, []);
  
  useEffect(() => {
    if (selectedShortlist) {
      setIsLoading(true);
      setErrorMessage(null);
      
      try {
        // Load candidates for the selected shortlist
        const shortlist = savedShortlists.find(s => s.id === selectedShortlist);
        if (shortlist) {
          console.log(`Selected shortlist: ${shortlist.name} with ${shortlist.candidates.length} candidates`);
          
          // Check if candidate data is available
          if (!roleSpecificCandidates || roleSpecificCandidates.length === 0) {
            throw new Error('Candidate data is not available');
          }
          
          // Get candidate details from the candidate pool
          const candidates = shortlist.candidates
            .map(id => getCandidateById(id))
            .filter(Boolean) as Candidate[];
          
          setShortlistCandidates(candidates);
          console.log(`Loaded ${candidates.length} candidates from shortlist`);
          
          // Automatically add all candidates from the shortlist that aren't already selected
          const candidatesToAdd = candidates.filter(c => 
            !currentlySelected.some(sc => sc.id === c.id)
          );
          
          if (candidatesToAdd.length > 0) {
            console.log(`Adding ${candidatesToAdd.length} new candidates to assessment`);
            onSelectCandidates(candidatesToAdd);
          } else {
            console.log('No new candidates to add - all are already selected');
          }
        } else {
          console.error('Selected shortlist not found');
          setErrorMessage('Selected shortlist not found');
        }
      } catch (err) {
        console.error('Error loading shortlist candidates:', err);
        setErrorMessage('Failed to load candidates from shortlist');
      } finally {
        setIsLoading(false);
      }
    }
  }, [selectedShortlist, savedShortlists, currentlySelected, onSelectCandidates]);
  
  const getCandidateById = (id: string): Candidate | undefined => {
    // This would be a lookup in the candidate pool
    return roleSpecificCandidates.find(c => c.id === id);
  };
  
  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {errorMessage}
        </div>
      )}
      
      {savedShortlists.length === 0 ? (
        <div className="p-4 text-center border border-dashed border-border rounded-md">
          <p className="text-secondary mb-2">No saved shortlists found.</p>
          <p className="text-sm text-secondary">Create a shortlist from the search page first.</p>
        </div>
      ) : (
        <>
          {/* Shortlist selection dropdown */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-primary">Select a shortlist</label>
            <select
              value={selectedShortlist || ''}
              onChange={(e) => setSelectedShortlist(e.target.value || null)}
              className="w-full p-2 border border-border rounded-md"
            >
              <option value="">-- Select a shortlist --</option>
              {savedShortlists.map(sl => (
                <option key={sl.id} value={sl.id}>
                  {sl.name} ({sl.candidates.length} candidates)
                </option>
              ))}
            </select>
          </div>
          
          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-3">
              <p className="text-secondary">Loading candidates...</p>
            </div>
          )}
          
          {/* Candidate display */}
          {selectedShortlist && !isLoading && shortlistCandidates.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-accent-blue font-medium">
                  {shortlistCandidates.length} candidates from this shortlist
                </p>
                
                <p className="text-xs text-secondary">
                  {shortlistCandidates.filter(c => 
                    currentlySelected.some(sc => sc.id === c.id)
                  ).length} added to assessment
                </p>
              </div>
              
              <div className="max-h-60 overflow-y-auto space-y-2 border border-border rounded-md p-2 mt-3">
                {shortlistCandidates.map(candidate => {
                  const isAlreadySelected = currentlySelected.some(c => c.id === candidate.id);
                  
                  return (
                    <div
                      key={candidate.id}
                      className={`p-2 rounded-md flex items-center justify-between ${
                        isAlreadySelected ? 'bg-accent-blue/5' : 'bg-white'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-primary">{candidate.name}</p>
                        <p className="text-sm text-secondary">{candidate.title}</p>
                      </div>
                      
                      {isAlreadySelected ? (
                        <span className="text-xs px-2 py-1 bg-accent-blue/10 text-accent-blue rounded">
                          Added
                        </span>
                      ) : (
                        <button
                          onClick={() => onSelectCandidates([candidate])}
                          className="text-xs px-2 py-1 bg-accent-blue/10 text-accent-blue rounded hover:bg-accent-blue/20"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {selectedShortlist && !isLoading && shortlistCandidates.length === 0 && (
            <p className="text-secondary text-center p-4 border border-border rounded-md">
              No candidates in this shortlist
            </p>
          )}
        </>
      )}
    </div>
  );
}

// CandidateSearch Component
interface CandidateSearchProps {
  onSelectCandidates: (candidates: Candidate[]) => void;
  currentlySelected: Candidate[];
}

function CandidateSearch({ onSelectCandidates, currentlySelected }: CandidateSearchProps) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Candidate[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Create a local reference to the candidates
  const [candidatePool, setCandidatePool] = useState<Candidate[]>([]);
  
  // Initialize candidate pool
  useEffect(() => {
    try {
      // Check if roleSpecificCandidates is available
      if (!roleSpecificCandidates) {
        console.error('No candidates available in the data pool');
        setError('Unable to load candidate data');
        return;
      }
      
      console.log(`CandidateSearch component loaded with ${roleSpecificCandidates.length} available candidates`);
      setCandidatePool(roleSpecificCandidates);
      
      // Pre-select any candidates that are already selected
      if (currentlySelected.length > 0) {
        const preSelected = roleSpecificCandidates.filter(candidate => 
          currentlySelected.some(c => c.id === candidate.id)
        );
        
        if (preSelected.length > 0) {
          console.log(`Pre-selecting ${preSelected.length} candidates that are already in assessment`);
          setSelectedCandidates(preSelected);
        }
      }
    } catch (err) {
      console.error('Error initializing candidate search:', err);
      setError('Error loading candidates');
    }
  }, [currentlySelected]);
  
  // Search effect - filter candidates based on query
  useEffect(() => {
    if (!candidatePool || candidatePool.length === 0) {
      setError('No candidates available to search');
      return;
    }
    
    setError(null);
    
    if (query.length >= 2) {
      setIsLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        try {
          const lowercaseQuery = query.toLowerCase();
          
          const filtered = candidatePool.filter(candidate => {
            return (
              candidate.name.toLowerCase().includes(lowercaseQuery) ||
              candidate.title.toLowerCase().includes(lowercaseQuery)
            );
          });
          
          console.log(`Found ${filtered.length} candidates matching "${query}"`);
          setSearchResults(filtered);
        } catch (err) {
          console.error('Error filtering candidates:', err);
          setError('Error searching candidates');
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
    }
  }, [query, candidatePool]);
  
  const toggleCandidateSelection = (candidate: Candidate) => {
    const isSelected = selectedCandidates.some(c => c.id === candidate.id);
    
    if (isSelected) {
      setSelectedCandidates(selectedCandidates.filter(c => c.id !== candidate.id));
    } else {
      setSelectedCandidates([...selectedCandidates, candidate]);
    }
  };
  
  const addSelectedCandidates = () => {
    if (selectedCandidates.length > 0) {
      const newCandidates = selectedCandidates.filter(candidate => 
        !currentlySelected.some(c => c.id === candidate.id)
      );
      
      if (newCandidates.length > 0) {
        console.log(`Adding ${newCandidates.length} candidates to assessment`);
        onSelectCandidates(newCandidates);
        setQuery('');
        setSearchResults([]);
      } else {
        console.log('All selected candidates are already in the assessment');
      }
    }
  };
  
  const addAllSearchResults = () => {
    if (searchResults.length > 0) {
      const newCandidates = searchResults.filter(candidate => 
        !currentlySelected.some(c => c.id === candidate.id)
      );
      
      if (newCandidates.length > 0) {
        console.log(`Adding all ${newCandidates.length} search results to assessment`);
        onSelectCandidates(newCandidates);
        setQuery('');
        setSearchResults([]);
      }
    }
  };
  
  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
    setSelectedCandidates([]);
  };
  
  return (
    <div className="space-y-4">
      <div className="p-2 border border-border rounded-md mb-2">
        <div className="flex items-center bg-white rounded-md overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-secondary mx-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search candidates by name or title..."
            className="flex-1 p-2 focus:outline-none text-primary"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="p-2 text-secondary hover:text-primary"
            >
              <XIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      
      {isLoading && (
        <div className="text-center p-4">
          <p className="text-secondary">Searching...</p>
        </div>
      )}
      
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {!isLoading && !error && query.length > 0 && query.length < 2 && (
        <div className="p-4 text-center">
          <p className="text-secondary">Enter at least 2 characters to search</p>
        </div>
      )}
      
      {!isLoading && !error && query.length >= 2 && searchResults.length === 0 && (
        <div className="p-4 text-center border border-border rounded-md">
          <p className="text-secondary">No candidates found matching "{query}"</p>
        </div>
      )}
      
      {!isLoading && !error && searchResults.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-secondary">Found {searchResults.length} candidates</p>
            
            <div className="flex space-x-2">
              {selectedCandidates.length > 0 && selectedCandidates.length !== searchResults.length && (
                <button
                  onClick={addSelectedCandidates}
                  className="text-xs px-3 py-1 bg-accent-blue text-white rounded-md hover:bg-accent-blue/90"
                >
                  Add Selected ({selectedCandidates.length})
                </button>
              )}
              
              <button
                onClick={addAllSearchResults}
                className="text-xs px-3 py-1 bg-white border border-accent-blue text-accent-blue rounded-md hover:bg-accent-blue/5"
              >
                Add All
              </button>
            </div>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {searchResults.map(candidate => {
              const isSelected = selectedCandidates.some(c => c.id === candidate.id);
              const isAlreadyAdded = currentlySelected.some(c => c.id === candidate.id);
              
              return (
                <div
                  key={candidate.id}
                  className={`p-3 border rounded-md flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-accent-blue bg-accent-blue/5'
                      : isAlreadyAdded
                      ? 'border-gray-200 bg-gray-50'
                      : 'border-border bg-white hover:border-accent-blue/30'
                  }`}
                  onClick={() => toggleCandidateSelection(candidate)}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                      isSelected ? 'bg-accent-blue border-accent-blue text-white' : 'border-gray-300'
                    }`}>
                      {isSelected && <CheckIcon className="w-4 h-4" />}
                    </div>
                    
                    <div>
                      <p className="font-medium text-primary">{candidate.name}</p>
                      <p className="text-sm text-secondary">{candidate.title}</p>
                    </div>
                  </div>
                  
                  {isAlreadyAdded && !isSelected && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      Already Added
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AssessmentWizard({ isOpen, onClose, selectedCandidates = [] }: AssessmentWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<AssessmentStep>('goal');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [showCandidateSelector, setShowCandidateSelector] = useState<'shortlist' | 'search' | null>(null);
  
  const [formData, setFormData] = useState<AssessmentFormData>({
    goal: '',
    type: '',
    subType: '',
    difficulty: 'intermediate',
    topics: [],
    candidates: selectedCandidates,
    name: '',
    context: '',
    status: 'active',
  });

  // Add console log to debug candidate loading
  useEffect(() => {
    try {
      console.log(`AssessmentWizard loaded with ${roleSpecificCandidates?.length || 'unknown'} candidates in candidate pool`);
      if (roleSpecificCandidates && roleSpecificCandidates.length > 0) {
        console.log('First few candidates:', roleSpecificCandidates.slice(0, 3));
      } else {
        console.error('No candidates found in roleSpecificCandidates!');
        // Check import path
        console.log('Role specific candidates import path:', require.resolve('@/lib/mock-data/role-specific-candidates'));
      }
    } catch (err) {
      console.error('Error loading candidates:', err);
    }
  }, []);

  const handleNext = () => {
    setErrorMessage(null);
    
    // Validate current step
    if (currentStep === 'goal' && !formData.goal.trim()) {
      setErrorMessage("Please specify an assessment goal");
      return;
    }
    
    if (currentStep === 'type' && !formData.type) {
      setErrorMessage("Please select an assessment type");
      return;
    }
    
    if (currentStep === 'context' && !formData.context.trim()) {
      setErrorMessage("Please provide context for the assessment");
      return;
    }
    
    const steps: AssessmentStep[] = ['goal', 'type', 'details', 'candidates', 'context', 'preview'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    const steps: AssessmentStep[] = ['goal', 'type', 'details', 'candidates', 'context', 'preview'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = () => {
    // Validation
    if (formData.candidates.length === 0) {
      setErrorMessage("Please select at least one candidate");
      return;
    }
    
    if (!formData.goal.trim()) {
      setErrorMessage("Please specify an assessment goal");
      return;
    }
    
    if (!formData.type) {
      setErrorMessage("Please select an assessment type");
      return;
    }
    
    // If we pass validation
    try {
      // TODO: Implement actual assessment submission API call
      console.log('Assessment data:', formData);
      
      // Redirect to success page with query params
      router.push(`/assessment/success?candidates=${formData.candidates.length}&type=${formData.type}`);
    } catch (error) {
      setErrorMessage("Failed to submit assessment. Please try again.");
      console.error(error);
    }
  };

  const saveAsTemplate = () => {
    if (!formData.name.trim()) {
      setErrorMessage("Please provide a name for your template");
      return;
    }
    
    const template: SavedAssessment = {
      id: Date.now().toString(),
      name: formData.name,
      goal: formData.goal,
      type: formData.type,
      subType: formData.subType,
      difficulty: formData.difficulty,
      topics: formData.topics,
      candidates: [], // Don't save candidates in template
      context: formData.context,
      status: 'template',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    
    // Get existing templates
    const existingTemplates = JSON.parse(localStorage.getItem('assessmentTemplates') || '[]');
    localStorage.setItem('assessmentTemplates', JSON.stringify([...existingTemplates, template]));
    
    setShowToast(true);
    setToastMessage("Assessment template saved successfully");
    setToastType("success");
  };

  const saveAsDraft = () => {
    const draft: SavedAssessment = {
      id: Date.now().toString(),
      name: formData.name || `Draft Assessment ${new Date().toLocaleDateString()}`,
      goal: formData.goal,
      type: formData.type,
      subType: formData.subType,
      difficulty: formData.difficulty,
      topics: formData.topics,
      candidates: formData.candidates.map(c => c.id),
      context: formData.context,
      status: 'draft',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    
    // Get existing drafts
    const existingDrafts = JSON.parse(localStorage.getItem('assessmentDrafts') || '[]');
    localStorage.setItem('assessmentDrafts', JSON.stringify([...existingDrafts, draft]));
    
    setShowToast(true);
    setToastMessage("Assessment saved as draft");
    setToastType("success");
  };

  const updateFormData = (field: keyof AssessmentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCandidate = (candidate: Candidate) => {
    if (!formData.candidates.find(c => c.id === candidate.id)) {
      updateFormData('candidates', [...formData.candidates, candidate]);
    }
  };

  const addCandidates = (candidates: Candidate[]) => {
    // Filter out duplicates
    const newCandidates = candidates.filter(
      candidate => !formData.candidates.some(c => c.id === candidate.id)
    );
    
    updateFormData('candidates', [...formData.candidates, ...newCandidates]);
    setShowCandidateSelector(null);
  };

  const removeCandidate = (candidateId: string) => {
    updateFormData('candidates', formData.candidates.filter(c => c.id !== candidateId));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary">Create New Assessment</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            {/* Error Message */}
            {errorMessage && (
              <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-md">
                {errorMessage}
              </div>
            )}
            
            {/* Progress Steps */}
            <div className="flex items-center justify-between mt-6">
              {['goal', 'type', 'details', 'candidates', 'context', 'preview'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === step
                        ? 'bg-accent-green text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < 5 && (
                    <div
                      className={`w-12 h-0.5 mx-1 ${
                        currentStep === step
                          ? 'bg-accent-green'
                          : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {currentStep === 'goal' && (
                <motion.div
                  key="goal"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      Why do you want to request an assessment?
                    </h3>
                    <p className="text-secondary mb-4">
                      This helps us tailor the assessment to your specific needs.
                    </p>
                    <textarea
                      value={formData.goal}
                      onChange={(e) => updateFormData('goal', e.target.value)}
                      placeholder="e.g., Validate backend development skills, Check cultural alignment, Assess leadership potential"
                      className="w-full p-3 border border-border rounded-md"
                      rows={3}
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 'type' && (
                <motion.div
                  key="type"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      Choose Assessment Type
                    </h3>
                    <p className="text-secondary mb-6">
                      Select the type of assessment that best fits your needs.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {assessmentTypes.map((type) => (
                        <div key={type.id}>
                          <div
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              formData.type === type.id
                                ? 'border-accent-green ring-2 ring-accent-green/20 bg-accent-green/5'
                                : 'border-border hover:border-accent-green/40 hover:bg-gray-50'
                            }`}
                            onClick={() => {
                              updateFormData('type', type.id);
                              // Reset subType when type changes
                              updateFormData('subType', '');
                            }}
                          >
                            <div className="flex items-center mb-2">
                              <span className="text-2xl mr-2">{type.icon}</span>
                              <h4 className="text-lg font-medium text-primary">{type.label}</h4>
                            </div>
                            <p className="text-secondary text-sm">{type.description}</p>
                          </div>

                          {/* Subtypes dropdown */}
                          <AnimatePresence>
                            {formData.type === type.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-2"
                              >
                                <select
                                  value={formData.subType}
                                  onChange={(e) => updateFormData('subType', e.target.value)}
                                  className="w-full p-2.5 border border-accent-green/20 rounded-md text-sm bg-white focus:ring-2 focus:ring-accent-green/20 focus:border-accent-green"
                                >
                                  <option value="">Select a specific type...</option>
                                  {type.subtypes.map((subtype) => (
                                    <option key={subtype.id} value={subtype.id}>
                                      {subtype.label}
                                    </option>
                                  ))}
                                </select>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      Assessment Details
                    </h3>
                    <p className="text-secondary mb-6">
                      Customize the assessment parameters to match your requirements.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Difficulty Level
                        </label>
                        <div className="flex space-x-4">
                          {['beginner', 'intermediate', 'advanced'].map((level) => (
                            <label
                              key={level}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <input
                                type="radio"
                                value={level}
                                checked={formData.difficulty === level}
                                onChange={(e) => updateFormData('difficulty', e.target.value)}
                                className="text-accent-blue"
                              />
                              <span className="text-secondary capitalize">{level}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Topics/Focus Areas
                        </label>
                        <div className="space-y-3">
                          {formData.topics.length === 0 && (
                            <p className="text-sm text-secondary italic">Add topics or focus areas for this assessment</p>
                          )}
                          
                          {formData.topics.map((topic, index) => (
                            <div key={topic.id} className="flex items-center space-x-2">
                              <textarea
                                value={topic.value}
                                onChange={(e) => {
                                  const updatedTopics = [...formData.topics];
                                  updatedTopics[index].value = e.target.value;
                                  updateFormData('topics', updatedTopics);
                                }}
                                placeholder="e.g., React & Redux, Python Data Structures, Leadership in conflict scenarios"
                                className="flex-1 p-2 border border-border rounded-md"
                                rows={2}
                              />
                              <button
                                onClick={() => {
                                  const updatedTopics = formData.topics.filter((_, i) => i !== index);
                                  updateFormData('topics', updatedTopics);
                                }}
                                className="text-accent-blue hover:text-accent-blue/80 text-sm flex items-center"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                          
                          <button
                            onClick={() => {
                              updateFormData('topics', [
                                ...formData.topics,
                                { id: Date.now().toString(), value: '' }
                              ]);
                            }}
                            className="text-accent-blue hover:text-accent-blue/80 text-sm flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add Another Topic
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Assessment Name (for saving as draft/template)
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => updateFormData('name', e.target.value)}
                          placeholder="e.g., Frontend Developer Assessment, Leadership Evaluation"
                          className="w-full p-2 border border-border rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 'candidates' && (
                <motion.div
                  key="candidates"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      Select Candidates
                    </h3>
                    <p className="text-secondary mb-6">
                      Choose who should receive this assessment.
                    </p>
                    
                    {/* Selected Candidates */}
                    <div className="space-y-4 mb-6">
                      <h4 className="font-medium text-primary">Selected Candidates</h4>
                      {formData.candidates.length === 0 ? (
                        <p className="text-sm text-secondary italic">No candidates selected yet</p>
                      ) : (
                        <div className="space-y-2">
                          {formData.candidates.map((candidate) => (
                            <div
                              key={candidate.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                            >
                              <div>
                                <p className="font-medium text-primary">{candidate.name}</p>
                                <p className="text-sm text-secondary">{candidate.title}</p>
                              </div>
                              <button
                                onClick={() => removeCandidate(candidate.id)}
                                className="text-accent-blue hover:text-accent-blue/80 text-sm flex items-center"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Add Candidates Options */}
                    {!showCandidateSelector ? (
                      <div className="space-y-2">
                        <h4 className="font-medium text-primary">Add Candidates</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button
                            onClick={() => setShowCandidateSelector('shortlist')}
                            className="p-4 border border-dashed border-border rounded-md text-primary hover:border-accent-green hover:bg-accent-green/5 flex flex-col items-center justify-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            Select from Shortlists
                          </button>
                          
                          <button
                            onClick={() => setShowCandidateSelector('search')}
                            className="p-4 border border-dashed border-border rounded-md text-primary hover:border-accent-green hover:bg-accent-green/5 flex flex-col items-center justify-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Search Candidates
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 border border-border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-primary">
                            {showCandidateSelector === 'shortlist' ? 'Select from Shortlists' : 'Search Candidates'}
                          </h4>
                          <button
                            onClick={() => setShowCandidateSelector(null)}
                            className="text-secondary hover:text-primary"
                          >
                            &times;
                          </button>
                        </div>
                        
                        {showCandidateSelector === 'shortlist' ? (
                          <ShortlistSelect 
                            onSelectCandidates={addCandidates} 
                            currentlySelected={formData.candidates}
                          />
                        ) : (
                          <CandidateSearch 
                            onSelectCandidates={addCandidates}
                            currentlySelected={formData.candidates}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 'context' && (
                <motion.div
                  key="context"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      Assessment Context
                    </h3>
                    <p className="text-secondary mb-6">
                      Provide specific context for what you want the candidate to be able to do.
                      This helps candidates understand your exact expectations.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Unique Context & Expectations
                        </label>
                        <textarea
                          value={formData.context}
                          onChange={(e) => updateFormData('context', e.target.value)}
                          placeholder="Describe what you specifically want the candidate to be able to do or demonstrate. Be as detailed as possible about your requirements and expectations."
                          className="w-full p-3 border border-border rounded-md"
                          rows={6}
                        />
                        <p className="text-xs text-secondary mt-2">
                          Example: "We need someone who can build a scalable API with Node.js that handles
                          payments, integrates with our existing database, and can support 10,000 concurrent users.
                          The ideal candidate should demonstrate knowledge of security best practices and error handling."
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 'preview' && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      Preview Assessment
                    </h3>
                    <p className="text-secondary mb-6">
                      Review your assessment details before sending.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                      <div>
                        <h4 className="font-medium text-primary">Assessment Goal</h4>
                        <p className="text-secondary mt-1">{formData.goal}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-primary">Type</h4>
                        <p className="text-secondary mt-1">
                          {assessmentTypes.find(t => t.id === formData.type)?.label}
                          {formData.subType && ` - ${assessmentTypes.find(t => t.id === formData.type)?.subtypes.find(s => s.id === formData.subType)?.label}`}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-primary">Difficulty</h4>
                        <p className="text-secondary mt-1 capitalize">{formData.difficulty}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-primary">Topics</h4>
                        <p className="text-secondary mt-1">{formData.topics.map(t => t.value).join(', ')}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-primary">Context</h4>
                        <p className="text-secondary mt-1">{formData.context}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-primary">Selected Candidates</h4>
                        <div className="mt-2 space-y-1">
                          {formData.candidates.map((candidate) => (
                            <p key={candidate.id} className="text-secondary">
                              {candidate.name} - {candidate.title}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 'goal'}
                className="px-4 py-2 text-primary hover:text-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-primary hover:text-secondary"
                >
                  Cancel
                </button>
                
                <button
                  onClick={saveAsDraft}
                  className="px-4 py-2 border border-accent-green text-accent-green rounded-md hover:bg-accent-green/10"
                >
                  Save as Draft
                </button>
                
                {currentStep === 'preview' ? (
                  <>
                    <button
                      onClick={() => setIsSavingTemplate(true)}
                      className="px-4 py-2 border border-accent-green text-accent-green rounded-md hover:bg-accent-green/10"
                    >
                      Save as Template
                    </button>
                    
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-accent-green text-white rounded-md hover:bg-accent-green/90"
                    >
                      Send Assessment
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 bg-accent-green text-white rounded-md hover:bg-accent-green/90"
                  >
                    Continue
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Template Saving Modal */}
      {isSavingTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-primary">
                Save as Template
              </h2>
              <button
                onClick={() => setIsSavingTemplate(false)}
                className="text-mauve-9 hover:text-primary p-1 rounded-full hover:bg-mauve-3"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Enter template name..."
                  className="w-full p-2.5 border border-mauve-7 rounded-md focus:ring-2 focus:ring-gold-8/20 focus:border-gold-8 text-primary shadow-sm"
                />
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setIsSavingTemplate(false)}
                  className="px-4 py-2 text-primary hover:text-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    saveAsTemplate();
                    setIsSavingTemplate(false);
                  }}
                  className="px-4 py-2 bg-accent-green text-white rounded-md hover:bg-accent-green/90"
                >
                  Save Template
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
} 