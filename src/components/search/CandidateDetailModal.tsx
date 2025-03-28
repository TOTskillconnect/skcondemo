'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
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

interface CandidateDetailModalProps {
  candidate: Candidate;
  isOpen: boolean;
  onClose: () => void;
}

export default function CandidateDetailModal({
  candidate,
  isOpen,
  onClose
}: CandidateDetailModalProps) {
  // Helper functions to handle different candidate data structures
  const getExperienceYears = () => {
    if (typeof candidate.experience === 'number') {
      return candidate.experience;
    } else if (candidate.experience && typeof candidate.experience === 'object') {
      return candidate.experience.years;
    }
    return 0;
  };

  const getAvailabilityStatus = () => {
    if (typeof candidate.availability === 'string') {
      return candidate.availability;
    } else if (candidate.availability && typeof candidate.availability === 'object') {
      return candidate.availability.status;
    }
    return 'Unknown';
  };

  const getLocation = () => {
    if (typeof candidate.location === 'string') {
      return candidate.location;
    } else if (candidate.location && typeof candidate.location === 'object') {
      return `${candidate.location.city}, ${candidate.location.country}${candidate.location.remote ? ' (Remote)' : ''}`;
    }
    return 'Unknown';
  };

  const getTechnicalSkills = () => {
    if (Array.isArray(candidate.skills)) {
      return candidate.skills.map((skill, index) => ({
        id: index.toString(),
        label: skill
      }));
    } else if (candidate.skills && typeof candidate.skills === 'object' && Array.isArray(candidate.skills.technical)) {
      return candidate.skills.technical;
    }
    return [];
  };

  const getSoftSkills = () => {
    if (candidate.skills && 
        typeof candidate.skills === 'object' && 
        'soft' in candidate.skills && 
        Array.isArray(candidate.skills.soft)) {
      return candidate.skills.soft;
    }
    return [];
  };

  const getProfileImage = () => {
    return candidate.avatar || candidate.photoUrl || '/placeholder-avatar.png';
  };

  // Helper to get hiring context data from either hiringContext or context property
  const getHiringContext = () => {
    const context = {
      goal: candidate.hiringContext?.goal || '',
      companyStage: candidate.hiringContext?.companyStage || '',
      milestones: candidate.hiringContext?.milestones || [],
      accomplishments: candidate.hiringContext?.accomplishments || [],
      culturalValues: candidate.hiringContext?.culturalValues || candidate.context?.culturalValues || []
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
                         hiringContext.accomplishments.length > 0 ||
                         hiringContext.culturalValues.length > 0;

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
            className="fixed inset-4 md:inset-10 bg-white rounded-lg shadow-xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  aria-label="Back to search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h2 className="text-xl font-semibold text-gray-900">Candidate Profile</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="flex items-start mb-6">
                  <CandidateAvatar
                    name={candidate.name}
                    photoUrl={candidate.photoUrl}
                    size="lg"
                    className="mr-4"
                  />
                  <div>
                    <h2 className="text-2xl font-semibold text-mauve-12 mb-1">
                      {candidate.name}
                    </h2>
                    <p className="text-lg text-mauve-11">{candidate.title}</p>
                  </div>
                </div>
                
                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column - Skills */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Technical Skills */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {getTechnicalSkills().map((skill: { id: string; label: string }) => (
                          <span key={skill.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent-gold/10 text-accent-gold">
                            {skill.label}
                          </span>
                        ))}
                        {getTechnicalSkills().length === 0 && (
                          <p className="text-gray-500 text-sm">No technical skills listed</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Soft Skills */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Soft Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {getSoftSkills().map((skill) => (
                          <span key={skill.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-600">
                            {skill.label}
                          </span>
                        ))}
                        {getSoftSkills().length === 0 && (
                          <p className="text-gray-500 text-sm">No soft skills listed</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Verification */}
                    {candidate.verification && candidate.verification.length > 0 && (
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Verification</h3>
                        <div className="space-y-2">
                          {candidate.verification.map((verification, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-6 h-6 flex items-center justify-center bg-green-100 rounded-full">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                                </svg>
                              </div>
                              <span className="text-sm text-gray-700">{verification.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Right Column - Hiring Context */}
                  <div className="space-y-6">
                    {hasHiringContext && (
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Hiring Context Match</h3>
                        
                        {hiringContext.goal && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Goal:</h4>
                            <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-sm">
                              {hiringContext.goal}
                            </div>
                          </div>
                        )}
                        
                        {hiringContext.companyStage && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Company Stage:</h4>
                            <div className="bg-green-50 text-green-700 px-3 py-2 rounded-md text-sm">
                              {hiringContext.companyStage}
                            </div>
                          </div>
                        )}
                        
                        {hiringContext.milestones.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Milestones:</h4>
                            <div className="space-y-2">
                              {hiringContext.milestones.map((milestone, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                  <span className="text-sm text-gray-700">{milestone}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {hiringContext.accomplishments.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Achievements:</h4>
                            <div className="space-y-2">
                              {hiringContext.accomplishments.map((achievement, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                                  <span className="text-sm text-gray-700">{achievement}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {hiringContext.culturalValues.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Cultural Values:</h4>
                            <div className="flex flex-wrap gap-2">
                              {hiringContext.culturalValues.map((value, index) => (
                                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-600">
                                  {value}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Contact Section */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact</h3>
                      <Button className="w-full bg-accent-gold hover:bg-accent-gold/90 transition-colors">
                        Contact Candidate
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="px-4 text-gray-700 border-gray-300 hover:bg-gray-100"
                >
                  Back to Search
                </Button>
                <Button className="px-4 bg-accent-gold hover:bg-accent-gold/90 transition-colors">
                  Contact Candidate
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 