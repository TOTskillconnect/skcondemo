'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CandidateDetailModal from './CandidateDetailModal';
import CandidateAvatar from '../common/CandidateAvatar';

// Define a type that works with our actual data structure
interface Candidate {
  id: string;
  name: string;
  title: string;
  experience: number | { years: number };
  matchScore: number;
  availability?: string | { status: string };
  location?: string | { city: string; country: string; remote: boolean };
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

interface CandidateCardProps {
  candidate: Candidate;
  isShortlisted?: boolean;
  onShortlistToggle?: (candidateId: string) => void;
  onViewProfile?: (candidateId: string) => void;
}

export function CandidateCard({ candidate, isShortlisted = false, onShortlistToggle, onViewProfile }: CandidateCardProps) {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const handleViewProfile = () => {
    // Open the detail modal instead of navigating
    setIsDetailModalOpen(true);
    
    // Also call the onViewProfile callback if provided
    if (onViewProfile) {
      onViewProfile(candidate.id);
    }
  };
  
  // Helper function to handle different candidate data structures
  const getExperienceYears = () => {
    if (typeof candidate.experience === 'number') {
      return candidate.experience;
    } else if (candidate.experience && typeof candidate.experience === 'object') {
      return candidate.experience.years;
    }
    return 0;
  };

  const getSkills = () => {
    if (Array.isArray(candidate.skills)) {
      return candidate.skills.slice(0, 3).map((skill, index) => ({
        id: index.toString(),
        label: skill
      }));
    } else if (candidate.skills && typeof candidate.skills === 'object' && Array.isArray(candidate.skills.technical)) {
      return candidate.skills.technical.slice(0, 3);
    }
    return [];
  };

  const getPhotoUrl = (candidate: Candidate) => {
    // Try to use the provided photo URL first
    if (candidate.photoUrl) {
      return candidate.photoUrl;
    }
    // If no photo URL, generate one using UI Avatars
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=random&size=150`;
  };

  // Helper to get hiring context data from either hiringContext or context property
  const getHiringContext = () => {
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
  
  const hiringContext = getHiringContext();
  const hasHiringContext = hiringContext.goal || 
                          hiringContext.companyStage || 
                          hiringContext.milestones.length > 0 || 
                          hiringContext.accomplishments.length > 0;
  
  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-sm hover:shadow-md overflow-hidden border border-mauve-6 hover:border-mauve-8 transition-all duration-200 cursor-pointer group"
        onClick={handleViewProfile}
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex">
              <CandidateAvatar
                name={candidate.name}
                photoUrl={candidate.photoUrl}
                size="md"
                className="mr-3"
              />
              <div>
                <Link href={`/candidate?id=${candidate.id}`} onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-lg font-semibold text-mauve-12 group-hover:text-accent-blue transition-colors">
                    {candidate.name}
                  </h3>
                </Link>
                <p className="text-sm text-mauve-11">{candidate.title}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-blue-100 rounded-full px-2 py-1">
                <span className="text-sm font-medium text-blue-600">{candidate.matchScore}%</span>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShortlistToggle && onShortlistToggle(candidate.id);
                }}
                className={`p-2 rounded-full hover:bg-mauve-3 ${isShortlisted ? 'bg-accent-blue/10' : ''} transition-colors`}
                aria-label={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
                title={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill={isShortlisted ? "currentColor" : "none"}
                  stroke="currentColor" 
                  className={`w-6 h-6 ${isShortlisted ? 'text-accent-blue' : 'text-primary'} transition-colors`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center mb-2">
              <span className="text-xs uppercase font-medium text-mauve-11 tracking-wider">Skills</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {getSkills().map((skill) => (
                <span key={skill.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-blue/10 text-accent-blue border border-accent-blue/10">
                  {skill.label}
                </span>
              ))}
              {getSkills().length === 0 && (
                <span className="text-xs text-mauve-10">No skills listed</span>
              )}
            </div>
          </div>
          
          {hasHiringContext && (
            <div className="border-t border-mauve-6 pt-3 mt-3">
              <div className="text-xs uppercase font-medium text-mauve-11 tracking-wider mb-3">Hiring Context Match</div>
              
              {hiringContext.goal && (
                <div className="mb-3">
                  <div className="flex items-center mb-1.5">
                    <span className="text-xs font-medium text-mauve-11">Goal</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600 border border-blue-200">
                      {hiringContext.goal}
                    </span>
                  </div>
                </div>
              )}

              {hiringContext.companyStage && (
                <div className="mb-3">
                  <div className="flex items-center mb-1.5">
                    <span className="text-xs font-medium text-mauve-11">Company Stage</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600 border border-blue-200">
                      {hiringContext.companyStage}
                    </span>
                  </div>
                </div>
              )}

              {hiringContext.milestones.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center mb-1.5">
                    <span className="text-xs font-medium text-mauve-11">Milestones</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {hiringContext.milestones.slice(0, 2).map((milestone, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600 border border-blue-200">
                        {milestone}
                      </span>
                    ))}
                    {hiringContext.milestones.length > 2 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-mauve-3 text-mauve-11 border border-mauve-7">
                        +{hiringContext.milestones.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {hiringContext.accomplishments.length > 0 && (
                <div>
                  <div className="flex items-center mb-1.5">
                    <span className="text-xs font-medium text-mauve-11">Achievements</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {hiringContext.accomplishments.slice(0, 2).map((achievement, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600 border border-blue-200">
                        {achievement}
                      </span>
                    ))}
                    {hiringContext.accomplishments.length > 2 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-mauve-3 text-mauve-11 border border-mauve-7">
                        +{hiringContext.accomplishments.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Candidate Detail Modal */}
      <CandidateDetailModal
        candidate={candidate}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </>
  );
} 