'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Candidate } from '@/lib/types/search';
import { roleSpecificCandidates } from '@/lib/mock-data/role-specific-candidates';
import Image from 'next/image';

interface SavedShortlist {
  id: string;
  name: string;
  notes: string;
  candidates: string[];
  createdAt: string;
}

export default function SavedShortlists() {
  const [savedShortlists, setSavedShortlists] = useState<SavedShortlist[]>([]);
  const [expandedShortlist, setExpandedShortlist] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'candidates'>('date');

  useEffect(() => {
    // TODO: Replace with actual API call
    const mockShortlists: SavedShortlist[] = [
      {
        id: '1',
        name: 'Frontend Developers',
        notes: 'Top candidates for frontend position',
        candidates: ['1', '2', '3'],
        createdAt: '2024-03-20T10:00:00Z',
      },
      {
        id: '2',
        name: 'Product Managers',
        notes: 'Potential PM candidates',
        candidates: ['4', '5'],
        createdAt: '2024-03-19T15:30:00Z',
      },
    ];
    setSavedShortlists(mockShortlists);
  }, []);

  const getCandidateById = (id: string): Candidate | undefined => {
    return roleSpecificCandidates.find(c => c.id === id);
  };

  const handleDeleteShortlist = (id: string) => {
    setSavedShortlists(savedShortlists.filter(s => s.id !== id));
    if (expandedShortlist === id) {
      setExpandedShortlist(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const sortedShortlists = [...savedShortlists].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return b.candidates.length - a.candidates.length;
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-primary">Saved Shortlists</h2>
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'candidates')}
            className="text-sm border border-border rounded-md px-2 py-1"
          >
            <option value="date">Sort by Date</option>
            <option value="candidates">Sort by Candidates</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {sortedShortlists.map((shortlist) => (
          <motion.div
            key={shortlist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-border rounded-lg hover:border-accent-gold/50 transition-colors"
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-primary">{shortlist.name}</h3>
                  <p className="text-sm text-secondary mt-1">
                    {shortlist.candidates.length} candidates • Created {formatDate(shortlist.createdAt)}
                  </p>
                  {shortlist.notes && (
                    <p className="text-sm text-secondary mt-2">{shortlist.notes}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setExpandedShortlist(
                      expandedShortlist === shortlist.id ? null : shortlist.id
                    )}
                    className="text-accent-gold hover:text-accent-gold/80"
                  >
                    {expandedShortlist === shortlist.id ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => handleDeleteShortlist(shortlist.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {expandedShortlist === shortlist.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-border"
                >
                  <div className="p-4 space-y-4">
                    {shortlist.candidates.map((candidateId) => {
                      const candidate = getCandidateById(candidateId);
                      if (!candidate) return null;

                      return (
                        <div
                          key={candidateId}
                          className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="relative w-12 h-12 rounded-full overflow-hidden">
                            <Image
                              src={candidate.photoUrl || '/placeholder-avatar.png'}
                              alt={candidate.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-primary">
                              {candidate.name}
                            </h4>
                            <p className="text-sm text-secondary">
                              {candidate.title}
                            </p>
                            <div className="mt-1 flex items-center space-x-2">
                              <span className="text-sm text-accent-gold">
                                {candidate.matchScore}% match
                              </span>
                              <span className="text-gray-300">•</span>
                              <span className="text-sm text-secondary">
                                {candidate.experience.years} years
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 