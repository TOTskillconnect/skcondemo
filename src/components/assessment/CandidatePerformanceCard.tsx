'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

interface CandidatePerformanceProps {
  candidate: any;
  index: number;
}

export default function CandidatePerformanceCard({ candidate, index }: CandidatePerformanceProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-accent-green/10 text-accent-green';
      case 'in_progress':
        return 'bg-accent-blue/10 text-accent-blue';
      case 'pending':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 90) return 'bg-accent-green';
    if (score >= 75) return 'bg-accent-blue';
    if (score >= 60) return 'bg-blue-300';
    return 'bg-accent-coral';
  };

  // Memoize radar data to prevent recalculation on re-renders
  const radarData = useMemo(() => [
    { subject: 'Technical', A: candidate.technicalScore, fullMark: 100 },
    { subject: 'Communication', A: candidate.communicationScore, fullMark: 100 },
    { subject: 'Problem Solving', A: candidate.problemSolvingScore, fullMark: 100 },
    { subject: 'Cultural Fit', A: candidate.culturalFitScore, fullMark: 100 },
    { subject: 'Context Fit', A: candidate.contextFitScore, fullMark: 100 },
    { subject: 'Role Fit', A: candidate.roleFitScore, fullMark: 100 },
  ], [
    candidate.technicalScore, 
    candidate.communicationScore, 
    candidate.problemSolvingScore, 
    candidate.culturalFitScore, 
    candidate.contextFitScore, 
    candidate.roleFitScore
  ]);

  // Memoize context analysis text to prevent recalculation
  const contextAnalysisText = useMemo(() => {
    if (candidate.contextFitScore >= 90) {
      return 'Excellent understanding of the context and business requirements.';
    } else if (candidate.contextFitScore >= 80) {
      return 'Good grasp of the context with minor gaps in understanding.';
    } else if (candidate.contextFitScore >= 70) {
      return 'Moderate understanding of the context with some key insights missing.';
    } else {
      return 'Limited understanding of the context and business requirements.';
    }
  }, [candidate.contextFitScore]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white border border-border rounded-lg overflow-hidden shadow-sm"
    >
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative h-12 w-12 rounded-full overflow-hidden">
              <Image 
                src={candidate.avatar || candidate.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=random&size=150`}
                alt={candidate.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-mauve-12">{candidate.name}</h3>
              <p className="text-sm text-secondary">{candidate.title}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.assessmentStatus)}`}>
              {candidate.assessmentStatus.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="text-secondary hover:text-mauve-12"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div>
            <p className="text-xs text-secondary mb-1">Context Fit</p>
            <div className="flex items-center">
              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                <div
                  className={`${getProgressBarColor(candidate.contextFitScore)} h-2 rounded-full`}
                  style={{ width: `${candidate.contextFitScore}%` }}
                />
              </div>
              <span className="text-xs font-medium text-mauve-12">{candidate.contextFitScore}%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-secondary mb-1">Role Fit</p>
            <div className="flex items-center">
              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                <div
                  className={`${getProgressBarColor(candidate.roleFitScore)} h-2 rounded-full`}
                  style={{ width: `${candidate.roleFitScore}%` }}
                />
              </div>
              <span className="text-xs font-medium text-mauve-12">{candidate.roleFitScore}%</span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-mauve-12 mb-3">Performance Summary</h4>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={90} width={400} height={250} data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 12 }} />
                        <Radar
                          name="Score"
                          dataKey="A"
                          stroke="#38B2AC"
                          fill="#38B2AC"
                          fillOpacity={0.6}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-mauve-12 mb-2">Completion Time</h4>
                    <p className="text-secondary text-sm">{candidate.completionTime} minutes</p>
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-mauve-12 mb-2">Strengths</h4>
                    <ul className="space-y-1">
                      {candidate.strengths.map((strength: string, i: number) => (
                        <li key={i} className="text-sm text-secondary flex items-start">
                          <span className="text-accent-blue mr-2">✓</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {candidate.improvement && candidate.improvement.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-mauve-12 mb-2">Areas for Improvement</h4>
                      <ul className="space-y-1">
                        {candidate.improvement.map((item: string, i: number) => (
                          <li key={i} className="text-sm text-secondary flex items-start">
                            <span className="text-gray-400 mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-mauve-12 mb-2">Context Analysis</h4>
                    <div className="p-3 bg-accent-blue/5 border border-accent-blue/20 rounded-md">
                      <p className="text-sm text-secondary">
                        {contextAnalysisText}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-mauve-12 mb-3">Key Responses</h4>
                <div className="space-y-3">
                  {candidate.detailedResponses.map((response: any, i: number) => (
                    <div key={i} className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm font-medium text-mauve-12 mb-1">{response.question}</p>
                      <p className="text-sm text-secondary mb-2">{response.answer}</p>
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`${getProgressBarColor(response.score)} h-1.5 rounded-full`}
                            style={{ width: `${response.score}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-mauve-12 ml-2">{response.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Link 
                  href={`/assessment/reports/candidate/${candidate.id}`}
                  className="text-sm text-accent-gold hover:text-accent-gold/80 font-medium"
                >
                  Full Assessment Report →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 