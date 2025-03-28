'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Candidate } from '@/lib/types/search';
import Image from 'next/image';
import CompareCandidatesModal from './CompareCandidatesModal';
import CandidateDetailModal from './CandidateDetailModal';
import CandidateAvatar from '../common/CandidateAvatar';

// Define the CandidateWithHiringContext type if not imported
interface CandidateWithHiringContext extends Candidate {
  hiringContextMatchScore: number;
  hiringContext?: {
    goal?: string;
    companyStage?: string;
    milestones: string[];
    accomplishments: string[];
    culturalValues: string[];
  };
}

interface ShortlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  shortlistedCandidates: CandidateWithHiringContext[];
  onRemoveFromShortlist: (candidateId: string) => void;
  onViewProfile: (candidateId: string) => void;
}

interface SavedShortlist {
  id: string;
  name: string;
  notes: string;
  candidates: string[];
  createdAt: string;
}

export default function ShortlistDrawer({
  isOpen,
  onClose,
  shortlistedCandidates,
  onRemoveFromShortlist,
  onViewProfile,
}: ShortlistDrawerProps) {
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [shortlistName, setShortlistName] = useState('');
  const [shortlistNotes, setShortlistNotes] = useState('');
  const [candidatesToCompare, setCandidatesToCompare] = useState<string[]>([]);
  const [viewingCandidate, setViewingCandidate] = useState<CandidateWithHiringContext | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleCompareToggle = (candidateId: string) => {
    setCandidatesToCompare(prev => {
      if (prev.includes(candidateId)) {
        return prev.filter(id => id !== candidateId);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, candidateId];
    });
  };

  const handleSaveShortlist = () => {
    if (shortlistName.trim() && shortlistedCandidates.length > 0) {
      const newShortlist: SavedShortlist = {
        id: Date.now().toString(),
        name: shortlistName.trim(),
        notes: shortlistNotes.trim(),
        candidates: shortlistedCandidates.map(c => c.id),
        createdAt: new Date().toISOString(),
      };

      // Get existing shortlists
      const existingShortlists = JSON.parse(localStorage.getItem('savedShortlists') || '[]');
      
      // Add new shortlist
      localStorage.setItem('savedShortlists', JSON.stringify([...existingShortlists, newShortlist]));
      
      // Reset form and close modal
      setShortlistName('');
      setShortlistNotes('');
      setShowSaveModal(false);
    }
  };

  const candidatesForComparison = shortlistedCandidates.filter(candidate =>
    candidatesToCompare.includes(candidate.id)
  );

  const handleViewCandidate = (candidateId: string) => {
    const candidate = shortlistedCandidates.find(c => c.id === candidateId);
    if (candidate) {
      setViewingCandidate(candidate);
      setIsDetailModalOpen(true);
      // Still call the parent handler
      onViewProfile(candidateId);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50"
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-[#e5e7eb]">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-primary">
                    Shortlist ({shortlistedCandidates.length})
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-mauve-9 hover:text-primary"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                {shortlistedCandidates.length === 0 ? (
                  <div className="p-4 text-center text-primary">
                    No candidates in shortlist
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    {shortlistedCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="flex items-start space-x-4 p-4 bg-white border border-gray-100 hover:border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <CandidateAvatar
                          name={candidate.name}
                          photoUrl={candidate.photoUrl}
                          size="sm"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-primary">
                            {candidate.name}
                          </h3>
                          <p className="text-sm text-primary">
                            {candidate.title}
                          </p>
                          <div className="mt-3 flex items-center space-x-2">
                            <button
                              onClick={() => handleViewCandidate(candidate.id)}
                              className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-accent-gold/10 text-accent-gold hover:bg-accent-gold/15 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View
                            </button>
                            <button
                              onClick={() => onRemoveFromShortlist(candidate.id)}
                              className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove
                            </button>
                            <button
                              onClick={() => handleCompareToggle(candidate.id)}
                              className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium transition-colors ${
                                candidatesToCompare.includes(candidate.id)
                                  ? 'bg-gold-4 text-gold-11 hover:bg-gold-5'
                                  : 'bg-mauve-4 text-primary hover:bg-mauve-5'
                              }`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              {candidatesToCompare.includes(candidate.id)
                                ? 'Selected for Compare'
                                : 'Select to Compare'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {shortlistedCandidates.length > 0 && (
                <div className="p-4 border-t border-[#e5e7eb] space-y-3">
                  {/* Compare Selected button */}
                  {candidatesToCompare.length >= 2 && (
                    <button
                      onClick={() => setShowCompareModal(true)}
                      className="w-full px-4 py-2.5 bg-accent-gold text-white rounded-md hover:bg-accent-gold/90 transition-colors flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Compare Selected ({candidatesToCompare.length}/3)
                    </button>
                  )}
                  
                  {/* Information about comparison selection */}
                  {candidatesToCompare.length === 1 && (
                    <div className="text-center text-sm text-primary mb-2">
                      Select at least one more candidate to compare
                    </div>
                  )}
                  
                  {candidatesToCompare.length === 0 && shortlistedCandidates.length >= 2 && (
                    <div className="text-center text-sm text-primary mb-2">
                      Select candidates to compare them
                    </div>
                  )}
                  
                  <button
                    onClick={() => setShowSaveModal(true)}
                    className="w-full px-4 py-2.5 bg-white text-primary border border-mauve-7 rounded-md hover:bg-mauve-3 transition-colors flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save Shortlist
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Compare Modal */}
          <CompareCandidatesModal
            isOpen={showCompareModal}
            onClose={() => setShowCompareModal(false)}
            candidates={candidatesForComparison}
            onRemoveFromComparison={handleCompareToggle}
          />

          {/* Candidate Detail Modal */}
          {viewingCandidate && (
            <CandidateDetailModal
              candidate={viewingCandidate}
              isOpen={isDetailModalOpen}
              onClose={() => setIsDetailModalOpen(false)}
            />
          )}

          {/* Save Shortlist Modal */}
          {showSaveModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-semibold text-primary">
                    Save Shortlist
                  </h2>
                  <button
                    onClick={() => setShowSaveModal(false)}
                    className="text-mauve-9 hover:text-primary p-1 rounded-full hover:bg-mauve-3"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={shortlistName}
                      onChange={(e) => setShortlistName(e.target.value)}
                      placeholder="Enter shortlist name..."
                      className="w-full p-2.5 border border-mauve-7 rounded-md focus:ring-2 focus:ring-gold-8/20 focus:border-gold-8 text-primary shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Notes
                    </label>
                    <textarea
                      value={shortlistNotes}
                      onChange={(e) => setShortlistNotes(e.target.value)}
                      placeholder="Add any notes about this shortlist..."
                      className="w-full p-2.5 border border-mauve-7 rounded-md focus:ring-2 focus:ring-gold-8/20 focus:border-gold-8 text-primary shadow-sm"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowSaveModal(false)}
                    className="px-4 py-2 border border-mauve-7 rounded-md text-primary shadow-sm hover:bg-mauve-3 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveShortlist}
                    disabled={!shortlistName.trim()}
                    className="px-4 py-2 bg-gold-9 text-white rounded-md shadow-sm hover:bg-gold-10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
} 