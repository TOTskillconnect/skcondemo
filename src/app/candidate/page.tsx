'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MOCK_CANDIDATES } from '@/data/mock-candidates';

// Define a flexible type that works with both data structures
interface Candidate {
  id: string;
  name: string;
  title: string;
  experience: number | { years: number };
  matchScore: number;
  availability: string | { status: string };
  location: string | { city: string; country: string; remote?: boolean };
  skills: string[] | { technical: Array<{ id: string; label: string }>, soft?: Array<{ id: string; label: string }> };
  description?: string;
  avatar?: string;
  photoUrl?: string;
}

export default function CandidatePage() {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const foundCandidate = MOCK_CANDIDATES.find((c) => c.id === id);
      if (foundCandidate) {
        setCandidate(foundCandidate as unknown as Candidate);
      }
    }
  }, [searchParams]);

  // Helper functions to handle different data structures
  const getExperienceYears = (exp: Candidate['experience']) => {
    if (typeof exp === 'number') {
      return exp;
    } else if (exp && typeof exp === 'object') {
      return exp.years;
    }
    return 0;
  };

  const getAvailabilityStatus = (avail: Candidate['availability']) => {
    if (typeof avail === 'string') {
      return avail;
    } else if (avail && typeof avail === 'object') {
      return avail.status;
    }
    return 'Unknown';
  };

  const getLocation = (loc: Candidate['location']) => {
    if (typeof loc === 'string') {
      return loc;
    } else if (loc && typeof loc === 'object') {
      return `${loc.city}, ${loc.country}`;
    }
    return 'Unknown';
  };

  if (!candidate) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Candidate not found</h1>
          <p className="text-gray-600 mb-6">The candidate you are looking for does not exist or has been removed.</p>
          <Link href="/search">
            <button className="px-4 py-2 bg-accent-teal text-white rounded-md hover:bg-accent-teal/90">
              Return to Candidate Pool
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
              <p className="text-lg text-gray-600">{candidate.title}</p>
            </div>
            <Link href="/search">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                Back to Search
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Basic Information</h2>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-600">Experience:</span> 
                  <span>{getExperienceYears(candidate.experience)} years</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Match Score:</span> 
                  <span>{candidate.matchScore}%</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Availability:</span> 
                  <span>{getAvailabilityStatus(candidate.availability)}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Location:</span> 
                  <span>{getLocation(candidate.location)}</span>
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(candidate.skills) 
                  ? candidate.skills.map((skill, index) => (
                      <span key={index} className="bg-accent-teal/10 text-accent-teal px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))
                  : ('technical' in candidate.skills && candidate.skills.technical) 
                    ? candidate.skills.technical.map((skill) => (
                        <span key={skill.id} className="bg-accent-teal/10 text-accent-teal px-3 py-1 rounded-full text-sm">
                          {skill.label}
                        </span>
                      ))
                    : null
                }
              </div>
            </div>
          </div>

          {candidate.description && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold mb-3">About</h2>
              <p className="text-gray-700">
                {candidate.description}
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <button className="px-4 py-2 bg-accent-teal text-white rounded-md hover:bg-accent-teal/90 mr-2">
              Contact Candidate
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 