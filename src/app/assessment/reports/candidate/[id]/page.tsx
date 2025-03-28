'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, PolarRadiusAxis,
  BarChart, Bar, Cell
} from 'recharts';
import { mockAssessmentReports, AssessmentReport } from '@/lib/mock-data/assessment-reports';

export default function CandidateAssessmentReport() {
  const params = useParams();
  const [report, setReport] = useState<AssessmentReport | null>(null);
  const [candidate, setCandidate] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('overview');

  // Simulate API call to get candidate data
  useEffect(() => {
    const timer = setTimeout(() => {
      const candidateId = params.id as string;
      
      // Find candidate in any assessment
      let foundCandidate = null;
      let foundReport = null;
      
      for (const assessmentReport of mockAssessmentReports) {
        const candidate = assessmentReport.candidates.find(c => c.id === candidateId);
        if (candidate) {
          foundCandidate = candidate;
          foundReport = assessmentReport;
          break;
        }
      }
      
      if (foundCandidate && foundReport) {
        setCandidate(foundCandidate);
        setReport(foundReport);
      }
      
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [params.id]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not completed';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-teal-100 text-teal-800';
      case 'in_progress':
        return 'bg-accent-gold/10 text-accent-gold';
      case 'pending':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 90) return 'bg-teal-500';
    if (score >= 75) return 'bg-accent-gold';
    if (score >= 60) return 'bg-orange-400';
    return 'bg-red-400';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-gold"></div>
      </div>
    );
  }

  // Not found state
  if (!candidate || !report) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-mauve-12 mb-2">Candidate Report Not Found</h2>
          <p className="text-secondary mb-6">The candidate assessment report you're looking for doesn't exist.</p>
          <Link 
            href="/assessment/reports"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-accent-gold text-white hover:bg-accent-gold/90"
          >
            Back to Reports
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with navigation */}
      <div className="mb-6">
        <div className="flex items-center mb-1">
          <Link
            href={`/assessment/reports/${report.id}`}
            className="text-secondary hover:text-mauve-12 mr-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-mauve-12">Candidate Assessment Report</h1>
        </div>
        <div className="flex items-center text-sm text-secondary">
          <span>{report.title}</span>
          <span className="mx-2">•</span>
          <span>Completed on {formatDate(report.dateCompleted)}</span>
        </div>
      </div>

      {/* Candidate Overview Card */}
      <div className="bg-white rounded-lg border border-border p-6 mb-8">
        <div className="flex items-start">
          <div className="relative h-20 w-20 rounded-full overflow-hidden mr-6">
            <Image
              src={candidate.avatar || candidate.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=random&size=150`}
              alt={candidate.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-mauve-12">{candidate.name}</h2>
                <p className="text-secondary">{candidate.title}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(candidate.assessmentStatus)}`}>
                {candidate.assessmentStatus.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </span>
            </div>
            
            <div className="grid grid-cols-4 gap-6 mt-6">
              <div>
                <p className="text-sm text-secondary mb-1">Completion Time</p>
                <p className="text-lg font-semibold text-mauve-12">{candidate.completionTime} min</p>
              </div>
              <div>
                <p className="text-sm text-secondary mb-1">Overall Score</p>
                <p className="text-lg font-semibold text-accent-gold">{Math.round((candidate.technicalScore + candidate.communicationScore + candidate.problemSolvingScore + candidate.culturalFitScore + candidate.contextFitScore + candidate.roleFitScore) / 6)}%</p>
              </div>
              <div>
                <p className="text-sm text-secondary mb-1">Context Fit</p>
                <p className="text-lg font-semibold text-accent-gold">{candidate.contextFitScore}%</p>
              </div>
              <div>
                <p className="text-sm text-secondary mb-1">Role Fit</p>
                <p className="text-lg font-semibold text-accent-gold">{candidate.roleFitScore}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="border-b border-border mb-8">
        <nav className="flex">
          {['overview', 'skills', 'context', 'responses', 'recommendations'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`py-4 px-6 font-medium text-sm ${
                activeSection === section
                  ? 'border-b-2 border-accent-gold text-mauve-12'
                  : 'text-secondary hover:text-mauve-12 hover:border-gray-300'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Section Content */}
      <div className="mb-8">
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-3 gap-8">
              {/* Performance Radar Chart */}
              <div className="col-span-2 bg-white rounded-lg border border-border p-6">
                <h3 className="text-lg font-medium text-mauve-12 mb-4">Performance Overview</h3>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={150} width={500} height={320} data={[
                      { subject: 'Technical', value: candidate.technicalScore, fullMark: 100 },
                      { subject: 'Communication', value: candidate.communicationScore, fullMark: 100 },
                      { subject: 'Problem Solving', value: candidate.problemSolvingScore, fullMark: 100 },
                      { subject: 'Cultural Fit', value: candidate.culturalFitScore, fullMark: 100 },
                      { subject: 'Context Fit', value: candidate.contextFitScore, fullMark: 100 },
                      { subject: 'Role Fit', value: candidate.roleFitScore, fullMark: 100 },
                    ]}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 12 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6B7280' }} />
                      <Radar
                        name="Performance"
                        dataKey="value"
                        stroke="#FBB130"
                        fill="#FBB130"
                        fillOpacity={0.5}
                      />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-xs text-secondary mb-1">Technical</p>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`${getProgressBarColor(candidate.technicalScore)} h-2 rounded-full`}
                          style={{ width: `${candidate.technicalScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-mauve-12">{candidate.technicalScore}%</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-xs text-secondary mb-1">Communication</p>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`${getProgressBarColor(candidate.communicationScore)} h-2 rounded-full`}
                          style={{ width: `${candidate.communicationScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-mauve-12">{candidate.communicationScore}%</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-xs text-secondary mb-1">Problem Solving</p>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`${getProgressBarColor(candidate.problemSolvingScore)} h-2 rounded-full`}
                          style={{ width: `${candidate.problemSolvingScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-mauve-12">{candidate.problemSolvingScore}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Strengths and Areas for Improvement */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-border p-6">
                  <h3 className="text-lg font-medium text-mauve-12 mb-4">Strengths</h3>
                  <ul className="space-y-3">
                    {candidate.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-accent-gold mr-2">✓</span>
                        <span className="text-secondary">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg border border-border p-6">
                  <h3 className="text-lg font-medium text-mauve-12 mb-4">Areas for Improvement</h3>
                  {candidate.improvement && candidate.improvement.length > 0 ? (
                    <ul className="space-y-3">
                      {candidate.improvement.map((item: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-gray-400 mr-2">•</span>
                          <span className="text-secondary">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-secondary">No specific improvement areas identified.</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Assessment Context */}
            <div className="bg-white rounded-lg border border-border p-6 mt-8">
              <h3 className="text-lg font-medium text-mauve-12 mb-4">Assessment Context</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-secondary">{report.context}</p>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Skills Section */}
        {activeSection === 'skills' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Technical Skills */}
            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="text-lg font-medium text-mauve-12 mb-6">Skill Breakdown</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-mauve-12">Technical Skills</h4>
                    <span className="text-sm font-medium text-accent-gold">{candidate.technicalScore}%</span>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Code Quality', score: candidate.technicalScore - Math.floor(Math.random() * 7) },
                          { name: 'Architecture', score: candidate.technicalScore - Math.floor(Math.random() * 10) },
                          { name: 'Best Practices', score: candidate.technicalScore + Math.floor(Math.random() * 5) },
                          { name: 'Testing', score: candidate.technicalScore - Math.floor(Math.random() * 15) },
                          { name: 'Performance', score: candidate.technicalScore - Math.floor(Math.random() * 8) },
                        ]}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Bar dataKey="score" fill="#FBB130" radius={[0, 4, 4, 0]}>
                          {[
                            { name: 'Code Quality', score: 85 },
                            { name: 'Architecture', score: 78 },
                            { name: 'Best Practices', score: 92 },
                            { name: 'Testing', score: 72 },
                            { name: 'Performance', score: 80 },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.score >= 90 ? '#14B8A6' : '#FBB130'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-mauve-12">Communication Skills</h4>
                      <span className="text-sm font-medium text-accent-gold">{candidate.communicationScore}%</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-xs text-secondary">Clarity</p>
                          <p className="text-xs text-secondary">{candidate.communicationScore + Math.floor(Math.random() * 5)}%</p>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-accent-gold rounded-full"
                            style={{ width: `${candidate.communicationScore + Math.floor(Math.random() * 5)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-xs text-secondary">Explanation</p>
                          <p className="text-xs text-secondary">{candidate.communicationScore - Math.floor(Math.random() * 8)}%</p>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-accent-gold rounded-full"
                            style={{ width: `${candidate.communicationScore - Math.floor(Math.random() * 8)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-xs text-secondary">Responsiveness</p>
                          <p className="text-xs text-secondary">{candidate.communicationScore + Math.floor(Math.random() * 3)}%</p>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-accent-gold rounded-full"
                            style={{ width: `${candidate.communicationScore + Math.floor(Math.random() * 3)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-mauve-12">Problem Solving</h4>
                      <span className="text-sm font-medium text-accent-gold">{candidate.problemSolvingScore}%</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-xs text-secondary">Analysis</p>
                          <p className="text-xs text-secondary">{candidate.problemSolvingScore - Math.floor(Math.random() * 5)}%</p>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-accent-gold rounded-full"
                            style={{ width: `${candidate.problemSolvingScore - Math.floor(Math.random() * 5)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-xs text-secondary">Creativity</p>
                          <p className="text-xs text-secondary">{candidate.problemSolvingScore + Math.floor(Math.random() * 7)}%</p>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-accent-gold rounded-full"
                            style={{ width: `${candidate.problemSolvingScore + Math.floor(Math.random() * 7)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-xs text-secondary">Efficiency</p>
                          <p className="text-xs text-secondary">{candidate.problemSolvingScore - Math.floor(Math.random() * 10)}%</p>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-accent-gold rounded-full"
                            style={{ width: `${candidate.problemSolvingScore - Math.floor(Math.random() * 10)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Compare to Requirements */}
            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="text-lg font-medium text-mauve-12 mb-4">Skills Gap Analysis</h3>
              <p className="text-secondary mb-4">Comparison of candidate skills against assessment requirements</p>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={report.skillGaps.map(gap => ({
                      name: gap.skill,
                      required: 100 - gap.gap,
                      actual: Math.max(40, 100 - gap.gap - Math.floor(Math.random() * 30))
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Bar dataKey="required" name="Required Level" fill="#D7C1CB" />
                    <Bar dataKey="actual" name="Candidate Level" fill="#FBB130" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Context Section */}
        {activeSection === 'context' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Context Understanding */}
            <div className="bg-white rounded-lg border border-border p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-medium text-mauve-12">Context Understanding</h3>
                  <p className="text-secondary mt-1">How well the candidate understood and addressed the business context</p>
                </div>
                <div className="bg-accent-gold/10 rounded-full px-4 py-2">
                  <span className="text-xl font-bold text-accent-gold">{candidate.contextFitScore}%</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-mauve-12 mb-2">Assessment Context</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-secondary">{report.context}</p>
                </div>
              </div>
              
              <div className="p-4 rounded-md border-l-4 border-accent-gold bg-accent-gold/5">
                <h4 className="text-sm font-medium text-mauve-12 mb-2">Context Analysis</h4>
                <p className="text-secondary">
                  {candidate.contextFitScore >= 90 ? (
                    'Excellent understanding of the context and business requirements. The candidate clearly grasped the nuances of the business scenario and applied solutions that directly addressed the specific needs.'
                  ) : candidate.contextFitScore >= 80 ? (
                    'Good grasp of the context with minor gaps in understanding. The candidate addressed most key points of the business scenario, but missed some subtle nuances that could be important.'
                  ) : candidate.contextFitScore >= 70 ? (
                    'Moderate understanding of the context with some key insights missing. The candidate understood the basic requirements but didn\'t fully connect their solutions to the business needs.'
                  ) : (
                    'Limited understanding of the context and business requirements. The candidate\'s approach showed gaps in understanding how their solutions would address the specific business scenario.'
                  )}
                </p>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-mauve-12 mb-3">Context Fit Scale</h4>
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-red-400" style={{ width: '25%' }}></div>
                  <div className="absolute top-0 left-[25%] h-full bg-orange-400" style={{ width: '25%' }}></div>
                  <div className="absolute top-0 left-[50%] h-full bg-accent-gold" style={{ width: '25%' }}></div>
                  <div className="absolute top-0 left-[75%] h-full bg-teal-500" style={{ width: '25%' }}></div>
                  <div className="absolute top-0 left-0 h-full bg-black opacity-20" 
                       style={{ width: `${Math.min(100 - candidate.contextFitScore, 100)}%`, left: `${candidate.contextFitScore}%` }}></div>
                  <div className="absolute top-0 h-full w-2 bg-white border-2 border-gray-800 rounded-full" 
                       style={{ left: `calc(${candidate.contextFitScore}% - 4px)` }}></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-secondary">
                  <span>Poor</span>
                  <span>Basic</span>
                  <span>Good</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>
            
            {/* Key Context Insights */}
            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="text-lg font-medium text-mauve-12 mb-4">Key Context Insights</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-mauve-12 mb-3">Strengths</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-teal-50 border-l-4 border-teal-500 rounded-r-md">
                      <p className="text-sm text-secondary">
                        {candidate.contextFitScore >= 80 
                          ? "Strong alignment with business requirements and goals"
                          : "Basic understanding of primary business objectives"}
                      </p>
                    </div>
                    <div className="p-3 bg-accent-gold/5 border-l-4 border-accent-gold rounded-r-md">
                      <p className="text-sm text-secondary">
                        {candidate.contextFitScore >= 75
                          ? "Considered realistic implementation constraints"
                          : "Acknowledged some implementation considerations"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-mauve-12 mb-3">Areas for Improvement</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 border-l-4 border-gray-400 rounded-r-md">
                      <p className="text-sm text-secondary">
                        {candidate.contextFitScore >= 85
                          ? "Could further prioritize features based on business impact"
                          : "Needs to better prioritize features by business value"}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 border-l-4 border-gray-400 rounded-r-md">
                      <p className="text-sm text-secondary">
                        {candidate.contextFitScore >= 80
                          ? "Consider broader stakeholder perspectives"
                          : "Need to consider diverse stakeholder requirements"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Responses Section */}
        {activeSection === 'responses' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-medium text-mauve-12">Detailed Responses</h3>
                <p className="text-secondary mt-1">The candidate's responses to key assessment questions</p>
              </div>
              
              <div className="divide-y divide-border">
                {candidate.detailedResponses.map((response: any, i: number) => (
                  <div key={i} className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-md font-medium text-mauve-12">{response.question}</h4>
                      <div className="bg-accent-gold/10 rounded-full px-3 py-1">
                        <span className="text-sm font-medium text-accent-gold">{response.score}%</span>
                      </div>
                    </div>
                    <p className="text-secondary whitespace-pre-line mb-4">{response.answer}</p>
                    <div>
                      <h5 className="text-sm font-medium text-mauve-12 mb-2">Analysis</h5>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-secondary">
                          {response.score >= 90 
                            ? "Excellent response that fully addresses the question with insightful details and considerations."
                            : response.score >= 80 
                            ? "Strong response that covers most key points with good reasoning and examples."
                            : response.score >= 70
                            ? "Good response that addresses the basic requirements but lacks some depth or specificity."
                            : "Adequate response that partially addresses the question but misses important considerations."}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-secondary">Response Quality</p>
                        <p className="text-xs text-secondary">{response.score}%</p>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-2 ${getProgressBarColor(response.score)} rounded-full`}
                          style={{ width: `${response.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="text-lg font-medium text-mauve-12 mb-4">Response Pattern Analysis</h3>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={candidate.detailedResponses.map((response: any, index: number) => ({
                      name: `Q${index + 1}`,
                      score: response.score,
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      name="Response Score"
                      stroke="#FBB130"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="average"
                      name="Average"
                      stroke="#94A3B8"
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h4 className="text-sm font-medium text-mauve-12 mb-2">Key Observations</h4>
                <p className="text-sm text-secondary">
                  {Math.max(...candidate.detailedResponses.map((r: any) => r.score)) - 
                   Math.min(...candidate.detailedResponses.map((r: any) => r.score)) > 20 
                    ? "Significant variation in response quality across different questions, indicating uneven understanding or expertise in different areas."
                    : "Consistent response quality across all questions, suggesting well-rounded understanding of the assessment topics."
                  }
                </p>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Recommendations Section */}
        {activeSection === 'recommendations' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Hiring Recommendation */}
            <div className="bg-white rounded-lg border border-border p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-medium text-mauve-12">Hiring Recommendation</h3>
                  <p className="text-secondary mt-1">Based on overall assessment performance</p>
                </div>
                
                {/* Dynamic recommendation based on scores */}
                {(() => {
                  const avgScore = Math.round(
                    (candidate.technicalScore + 
                     candidate.communicationScore + 
                     candidate.problemSolvingScore + 
                     candidate.contextFitScore + 
                     candidate.roleFitScore) / 5
                  );
                  
                  if (avgScore >= 85) {
                    return (
                      <div className="bg-teal-100 text-teal-800 rounded-full px-4 py-2 font-medium">
                        Strong Hire
                      </div>
                    );
                  } else if (avgScore >= 75) {
                    return (
                      <div className="bg-accent-gold/10 text-accent-gold rounded-full px-4 py-2 font-medium">
                        Hire
                      </div>
                    );
                  } else if (avgScore >= 65) {
                    return (
                      <div className="bg-orange-100 text-orange-800 rounded-full px-4 py-2 font-medium">
                        Consider
                      </div>
                    );
                  } else {
                    return (
                      <div className="bg-red-100 text-red-800 rounded-full px-4 py-2 font-medium">
                        Not Recommended
                      </div>
                    );
                  }
                })()}
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-md">
                  <h4 className="text-sm font-medium text-mauve-12 mb-2">Summary</h4>
                  <p className="text-secondary">
                    {(() => {
                      const avgScore = Math.round(
                        (candidate.technicalScore + 
                         candidate.communicationScore + 
                         candidate.problemSolvingScore +
                         candidate.contextFitScore +
                         candidate.roleFitScore) / 5
                      );
                      
                      if (avgScore >= 85) {
                        return `${candidate.name} demonstrated exceptional performance across all assessment areas, with particular strengths in ${candidate.strengths[0].toLowerCase()} and ${candidate.strengths[1]?.toLowerCase() || 'technical knowledge'}. Strong understanding of business context and excellent problem-solving abilities make them a strong candidate for the role.`;
                      } else if (avgScore >= 75) {
                        return `${candidate.name} showed solid performance in most assessment areas, with good skills in ${candidate.strengths[0].toLowerCase()}. Their understanding of business context was adequate, and they demonstrated good problem-solving capabilities.`;
                      } else if (avgScore >= 65) {
                        return `${candidate.name} met basic requirements in most assessment areas but showed inconsistent performance. While they have strengths in ${candidate.strengths[0].toLowerCase()}, there are significant areas for improvement, particularly in ${candidate.improvement[0]?.toLowerCase() || 'technical depth'}.`;
                      } else {
                        return `${candidate.name} did not meet several key requirements for this role. Significant gaps were identified in ${candidate.improvement[0]?.toLowerCase() || 'technical knowledge'} and ${candidate.improvement[1]?.toLowerCase() || 'problem-solving approach'}.`;
                      }
                    })()}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Next Steps */}
            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="text-lg font-medium text-mauve-12 mb-4">Recommended Next Steps</h3>
              
              <div className="space-y-4">
                {(() => {
                  const avgScore = Math.round(
                    (candidate.technicalScore + 
                     candidate.communicationScore + 
                     candidate.problemSolvingScore + 
                     candidate.contextFitScore + 
                     candidate.roleFitScore) / 5
                  );
                  
                  if (avgScore >= 85) {
                    return (
                      <>
                        <div className="p-3 border-l-4 border-teal-500 bg-teal-50 rounded-r-md">
                          <h4 className="text-sm font-medium text-mauve-12 mb-1">Proceed to Final Interview</h4>
                          <p className="text-sm text-secondary">
                            Schedule a final interview focused on team fit and specific project scenarios.
                          </p>
                        </div>
                        
                        <div className="p-3 border-l-4 border-accent-gold bg-accent-gold/5 rounded-r-md">
                          <h4 className="text-sm font-medium text-mauve-12 mb-1">Discuss Compensation</h4>
                          <p className="text-sm text-secondary">
                            Prepare competitive offer based on candidate's strong performance and skill set.
                          </p>
                        </div>
                      </>
                    );
                  } else if (avgScore >= 75) {
                    return (
                      <>
                        <div className="p-3 border-l-4 border-accent-gold bg-accent-gold/5 rounded-r-md">
                          <h4 className="text-sm font-medium text-mauve-12 mb-1">Technical Follow-up</h4>
                          <p className="text-sm text-secondary">
                            Schedule a focused follow-up interview to address specific technical areas.
                          </p>
                        </div>
                        
                        <div className="p-3 border-l-4 border-gray-400 bg-gray-50 rounded-r-md">
                          <h4 className="text-sm font-medium text-mauve-12 mb-1">Team Interview</h4>
                          <p className="text-sm text-secondary">
                            Assess cultural fit with potential team members and direct manager.
                          </p>
                        </div>
                      </>
                    );
                  } else if (avgScore >= 65) {
                    return (
                      <>
                        <div className="p-3 border-l-4 border-orange-400 bg-orange-50 rounded-r-md">
                          <h4 className="text-sm font-medium text-mauve-12 mb-1">Additional Assessment</h4>
                          <p className="text-sm text-secondary">
                            Consider a focused assessment addressing specific areas of concern.
                          </p>
                        </div>
                        
                        <div className="p-3 border-l-4 border-gray-400 bg-gray-50 rounded-r-md">
                          <h4 className="text-sm font-medium text-mauve-12 mb-1">Consider Alternative Roles</h4>
                          <p className="text-sm text-secondary">
                            Evaluate if the candidate might be better suited for a different position.
                          </p>
                        </div>
                      </>
                    );
                  } else {
                    return (
                      <div className="p-3 border-l-4 border-red-400 bg-red-50 rounded-r-md">
                        <h4 className="text-sm font-medium text-mauve-12 mb-1">Conclude Process</h4>
                        <p className="text-sm text-secondary">
                          Thank the candidate for their time and conclude the hiring process.
                        </p>
                      </div>
                    );
                  }
                })()}
                
                <div className="p-3 border-l-4 border-gray-400 bg-gray-50 rounded-r-md">
                  <h4 className="text-sm font-medium text-mauve-12 mb-1">Document Insights</h4>
                  <p className="text-sm text-secondary">
                    Record key observations and feedback for future reference.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Export Options */}
            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="text-lg font-medium text-mauve-12 mb-4">Report Actions</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <button className="p-4 border border-dashed border-border rounded-md flex flex-col items-center justify-center hover:border-accent-gold/50 hover:bg-accent-gold/5 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-gold mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="font-medium text-mauve-12">Export PDF</p>
                  <p className="text-xs text-secondary mt-1">Detailed report</p>
                </button>
                
                <button className="p-4 border border-dashed border-border rounded-md flex flex-col items-center justify-center hover:border-accent-gold/50 hover:bg-accent-gold/5 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-gold mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <p className="font-medium text-mauve-12">Share Report</p>
                  <p className="text-xs text-secondary mt-1">With team</p>
                </button>
                
                <button className="p-4 border border-dashed border-border rounded-md flex flex-col items-center justify-center hover:border-accent-gold/50 hover:bg-accent-gold/5 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-gold mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <p className="font-medium text-mauve-12">Add Notes</p>
                  <p className="text-xs text-secondary mt-1">Personal feedback</p>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 