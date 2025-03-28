'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_CANDIDATES } from '@/lib/utils/search';
import { Button } from '@/components/ui/button';

interface CandidateDetailPageProps {
  params: {
    id: string;
  };
}

export default function CandidateDetailPage({ params }: CandidateDetailPageProps) {
  const router = useRouter();
  const candidate = MOCK_CANDIDATES.find(c => c.id === params.id);
  
  if (!candidate) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Candidate not found</h1>
        <p className="mb-8">The candidate you're looking for doesn't exist or has been removed.</p>
        <Link href="/candidates/pool">
          <Button>Back to Candidate Pool</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-8">
          <Link href="/candidates/pool">
            <Button variant="outline" size="sm">← Back to Candidate Pool</Button>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">{candidate.name}</h1>
        <p className="text-xl text-gray-600 mb-4">{candidate.title}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Experience:</span> {candidate.experience.years} years</p>
              <p><span className="font-medium">Match Score:</span> {candidate.matchScore}%</p>
              <p><span className="font-medium">Availability:</span> {candidate.availability.status}</p>
              <p><span className="font-medium">Location:</span> {candidate.location.city}, {candidate.location.country}</p>
              <p><span className="font-medium">Remote:</span> {candidate.location.remote ? 'Yes' : 'No'}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.technical.map(skill => (
                <span 
                  key={skill.id} 
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill.label}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-gray-500 text-sm">This is a simplified candidate profile page.</p>
        </div>
      </div>
    </div>
  );
} 