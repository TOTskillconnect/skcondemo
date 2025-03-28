'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import CandidateAvatar from '../common/CandidateAvatar';

interface Skill {
  id: string;
  label: string;
}

// Define a type that works with our actual data structure
interface Candidate {
  id: string;
  name: string;
  title: string;
  experience: number | { years: number };
  matchScore: number;
  availability: string | { status: string };
  location: string | { city: string; country: string; remote: boolean };
  skills: string[] | { technical: Array<{ id: string; label: string }>, soft: Array<{ id: string; label: string }> };
  avatar?: string;
  photoUrl?: string;
  verification?: Array<{ type: string; label: string; icon: string }>;
  hiringContext?: {
    goal?: string;
    companyStage?: string;
    milestones?: string[];
    accomplishments?: string[];
    culturalValues?: string[];
  };
  context?: {
    startupStages?: string[];
    industries?: string[];
    achievements?: string[];
    culturalValues?: string[];
  };
}

interface CompareCandidatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: Candidate[];
  onRemoveFromComparison: (candidateId: string) => void;
}

export default function CompareCandidatesModal({
  isOpen,
  onClose,
  candidates,
  onRemoveFromComparison,
}: CompareCandidatesModalProps) {
  // Helper functions to handle different data structures
  const getExperienceYears = (candidate: Candidate) => {
    if (typeof candidate.experience === 'number') {
      return candidate.experience;
    } else if (candidate.experience && typeof candidate.experience === 'object') {
      return candidate.experience.years;
    }
    return 0;
  };

  const getAvailabilityStatus = (candidate: Candidate) => {
    if (typeof candidate.availability === 'string') {
      return candidate.availability;
    } else if (candidate.availability && typeof candidate.availability === 'object') {
      return candidate.availability.status;
    }
    return 'Unknown';
  };

  const getSkills = (candidate: Candidate) => {
    if (Array.isArray(candidate.skills)) {
      return candidate.skills.slice(0, 5).map((skill, index) => ({
        id: index.toString(),
        label: skill
      }));
    } else if (candidate.skills && typeof candidate.skills === 'object' && Array.isArray(candidate.skills.technical)) {
      return candidate.skills.technical.slice(0, 5);
    }
    return [];
  };

  const getProfileImage = (candidate: Candidate) => {
    return candidate.avatar || candidate.photoUrl || '/placeholder-avatar.png';
  };

  const getLocation = (candidate: Candidate) => {
    if (typeof candidate.location === 'string') {
      return candidate.location;
    } else if (candidate.location && typeof candidate.location === 'object') {
      return `${candidate.location.city}, ${candidate.location.country}${candidate.location.remote ? ' (Remote)' : ''}`;
    }
    return 'Unknown';
  };

  const getHiringContext = (candidate: Candidate) => {
    const context = {
      goal: candidate.hiringContext?.goal || '',
      companyStage: candidate.hiringContext?.companyStage || '',
      milestones: candidate.hiringContext?.milestones || [],
      accomplishments: candidate.hiringContext?.accomplishments || []
    };

    // If we don't have hiringContext data, try to use data from the context property
    if (!context.goal && !context.companyStage && !context.milestones.length && !context.accomplishments.length) {
      // Map achievements from context to accomplishments if they exist
      if (candidate.context?.achievements && candidate.context.achievements.length > 0) {
        context.accomplishments = candidate.context.achievements;
      }

      // Add startupStages from context to companyStage if they exist
      if (candidate.context?.startupStages && candidate.context.startupStages.length > 0) {
        context.companyStage = candidate.context.startupStages[0]; // Use the first one as primary stage
      }
    }

    return context;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-10 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Compare Candidates
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                    aria-label="Close"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {candidates.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="text-6xl mb-4">👥</div>
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        No candidates selected for comparison
                      </p>
                      <p className="text-gray-500 max-w-md">
                        Select 2-3 candidates from your shortlist to compare their skills and qualifications side by side.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="p-4 font-medium text-mauve-12 border-b border-mauve-6 bg-white sticky left-0 z-10">
                            Match Score
                          </td>
                          {candidates.map((candidate, index) => (
                            <td key={candidate.id} className={`p-4 border-b border-mauve-6 ${index % 2 === 0 ? 'bg-white hover:bg-mauve-2' : 'bg-mauve-2 hover:bg-mauve-3'} transition-colors`}>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent-gold/10 text-accent-gold border border-accent-gold/10">
                                {candidate.matchScore}%
                              </span>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-4 font-medium text-mauve-12 border-b border-mauve-6 bg-white sticky left-0 z-10">
                            Experience
                          </td>
                          {candidates.map((candidate, index) => (
                            <td key={candidate.id} className={`p-4 border-b border-mauve-6 ${index % 2 === 0 ? 'bg-white hover:bg-mauve-2' : 'bg-mauve-2 hover:bg-mauve-3'} transition-colors`}>
                              <span className="text-gray-900">{getExperienceYears(candidate)} years</span>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-4 font-medium text-mauve-12 border-b border-mauve-6 bg-white sticky left-0 z-10">
                            Availability
                          </td>
                          {candidates.map((candidate, index) => (
                            <td key={candidate.id} className={`p-4 border-b border-mauve-6 ${index % 2 === 0 ? 'bg-white hover:bg-mauve-2' : 'bg-mauve-2 hover:bg-mauve-3'} transition-colors`}>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gold-4 text-gold-11">
                                {getAvailabilityStatus(candidate)}
                              </span>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-4 font-medium text-mauve-12 border-b border-mauve-6 bg-white sticky left-0 z-10">
                            Location
                          </td>
                          {candidates.map((candidate, index) => (
                            <td key={candidate.id} className={`p-4 border-b border-mauve-6 ${index % 2 === 0 ? 'bg-white hover:bg-mauve-2' : 'bg-mauve-2 hover:bg-mauve-3'} transition-colors`}>
                              <span className="text-mauve-12">{getLocation(candidate)}</span>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-4 font-medium text-mauve-12 border-b border-mauve-6 bg-white sticky left-0 z-10">
                            Skills
                          </td>
                          {candidates.map((candidate, index) => (
                            <td key={candidate.id} className={`p-4 border-b border-mauve-6 ${index % 2 === 0 ? 'bg-white hover:bg-mauve-2' : 'bg-mauve-2 hover:bg-mauve-3'} transition-colors`}>
                              <div className="flex flex-wrap gap-1.5">
                                {getSkills(candidate).map((skill) => (
                                  <span 
                                    key={skill.id}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold-4 text-gold-11 border border-gold-6"
                                  >
                                    {skill.label}
                                  </span>
                                ))}
                                {getSkills(candidate).length === 0 && (
                                  <span className="text-sm text-mauve-11">No skills listed</span>
                                )}
                              </div>
                            </td>
                          ))}
                        </tr>
                        
                        {/* Hiring Context Section */}
                        <tr>
                          <td colSpan={candidates.length + 1} className="p-4 bg-gradient-to-r from-mauve-3 to-mauve-2 border-y-2 border-mauve-6">
                            <span className="text-sm font-semibold text-mauve-12">Hiring Context</span>
                          </td>
                        </tr>
                        
                        <tr>
                          <td className="p-4 font-medium text-mauve-12 border-b border-mauve-6 bg-white sticky left-0 z-10">
                            Goal
                          </td>
                          {candidates.map((candidate, index) => {
                            const hiringContext = getHiringContext(candidate);
                            return (
                              <td key={candidate.id} className={`p-4 border-b border-mauve-6 ${index % 2 === 0 ? 'bg-white hover:bg-mauve-2' : 'bg-mauve-2 hover:bg-mauve-3'} transition-colors`}>
                                {hiringContext.goal ? (
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gold-4 text-gold-11 border border-gold-6">
                                    {hiringContext.goal}
                                  </span>
                                ) : (
                                  <span className="text-sm text-mauve-11">Not specified</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                        
                        <tr>
                          <td className="p-4 font-medium text-mauve-12 border-b border-mauve-6 bg-white sticky left-0 z-10">
                            Company Stage
                          </td>
                          {candidates.map((candidate, index) => {
                            const hiringContext = getHiringContext(candidate);
                            return (
                              <td key={candidate.id} className={`p-4 border-b border-mauve-6 ${index % 2 === 0 ? 'bg-white hover:bg-mauve-2' : 'bg-mauve-2 hover:bg-mauve-3'} transition-colors`}>
                                {hiringContext.companyStage ? (
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gold-4 text-gold-11 border border-gold-6">
                                    {hiringContext.companyStage}
                                  </span>
                                ) : (
                                  <span className="text-sm text-mauve-11">Not specified</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                        
                        <tr>
                          <td className="p-4 font-medium text-mauve-12 border-b border-mauve-6 bg-white sticky left-0 z-10">
                            Milestones
                          </td>
                          {candidates.map((candidate, index) => {
                            const hiringContext = getHiringContext(candidate);
                            return (
                              <td key={candidate.id} className={`p-4 border-b border-mauve-6 ${index % 2 === 0 ? 'bg-white hover:bg-mauve-2' : 'bg-mauve-2 hover:bg-mauve-3'} transition-colors`}>
                                <div className="flex flex-wrap gap-1.5">
                                  {hiringContext.milestones.map((milestone, index) => (
                                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold-4 text-gold-11 border border-gold-6">
                                      {milestone}
                                    </span>
                                  ))}
                                  {hiringContext.milestones.length === 0 && (
                                    <span className="text-sm text-mauve-11">No milestones listed</span>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                        
                        <tr>
                          <td className="p-4 font-medium text-mauve-12 border-b border-mauve-6 bg-white sticky left-0 z-10">
                            Achievements
                          </td>
                          {candidates.map((candidate, index) => {
                            const hiringContext = getHiringContext(candidate);
                            return (
                              <td key={candidate.id} className={`p-4 border-b border-mauve-6 ${index % 2 === 0 ? 'bg-white hover:bg-mauve-2' : 'bg-mauve-2 hover:bg-mauve-3'} transition-colors`}>
                                <div className="flex flex-wrap gap-1.5">
                                  {hiringContext.accomplishments.map((achievement, index) => (
                                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold-4 text-gold-11 border border-gold-6">
                                      {achievement}
                                    </span>
                                  ))}
                                  {hiringContext.accomplishments.length === 0 && (
                                    <span className="text-sm text-mauve-11">No achievements listed</span>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              
              <div className="border-t border-mauve-6 p-4 bg-mauve-2">
                <div className="flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-white text-mauve-11 border border-mauve-6 rounded-md shadow-sm hover:bg-mauve-3 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 