'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { mockAssessmentReports, AssessmentReport } from '@/lib/mock-data/assessment-reports';

// Lazy load components for better performance
const ReportMetricsCard = lazy(() => import('@/components/assessment/ReportMetricsCard'));
const CandidatePerformanceCard = lazy(() => import('@/components/assessment/CandidatePerformanceCard'));
const SkillGapChart = lazy(() => import('@/components/assessment/SkillGapChart'));
const ContextFitCard = lazy(() => import('@/components/assessment/ContextFitCard'));

// Loading fallback component
const ComponentLoader = () => (
  <div className="w-full h-32 bg-gray-100 animate-pulse rounded-md"></div>
);

export default function AssessmentReportDetail() {
  const params = useParams();
  const [report, setReport] = useState<AssessmentReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'candidates' | 'context' | 'export'>('overview');

  useEffect(() => {
    // Simulate API call to get report data
    const timer = setTimeout(() => {
      const reportId = params.id as string;
      const foundReport = mockAssessmentReports.find(r => r.id === reportId);
      
      if (foundReport) {
        setReport(foundReport);
      }
      
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer); // Clean up timer on unmount
  }, [params.id]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not completed';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-gold"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-mauve-12 mb-2">Report Not Found</h2>
          <p className="text-secondary mb-6">The assessment report you're looking for doesn't exist.</p>
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
      <div className="mb-6">
        <div className="flex items-center mb-1">
          <Link
            href="/assessment/reports"
            className="text-secondary hover:text-mauve-12 mr-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-mauve-12">{report.title}</h1>
        </div>
        <div className="flex items-center text-sm text-secondary">
          <span>{report.type.charAt(0).toUpperCase() + report.type.slice(1)} • {report.subType}</span>
          <span className="mx-2">•</span>
          <span>Created on {formatDate(report.dateCreated)}</span>
          {report.dateCompleted && (
            <>
              <span className="mx-2">•</span>
              <span>Completed on {formatDate(report.dateCompleted)}</span>
            </>
          )}
        </div>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-border mb-6">
        <nav className="-mb-px flex">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-6 font-medium text-sm ${activeTab === 'overview' 
              ? 'border-b-2 border-accent-gold text-mauve-12' 
              : 'text-secondary hover:text-mauve-12 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`py-4 px-6 font-medium text-sm ${activeTab === 'candidates' 
              ? 'border-b-2 border-accent-gold text-mauve-12' 
              : 'text-secondary hover:text-mauve-12 hover:border-gray-300'
            }`}
          >
            Candidates ({report.candidates.length})
          </button>
          <button
            onClick={() => setActiveTab('context')}
            className={`py-4 px-6 font-medium text-sm ${activeTab === 'context' 
              ? 'border-b-2 border-accent-gold text-mauve-12' 
              : 'text-secondary hover:text-mauve-12 hover:border-gray-300'
            }`}
          >
            Context Analysis
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`py-4 px-6 font-medium text-sm ${activeTab === 'export' 
              ? 'border-b-2 border-accent-gold text-mauve-12' 
              : 'text-secondary hover:text-mauve-12 hover:border-gray-300'
            }`}
          >
            Export
          </button>
        </nav>
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Suspense fallback={<ComponentLoader />}>
              <ReportMetricsCard 
                title="Completion Rate" 
                value={report.completionRate} 
                icon="📊"
                colorScheme="blue"
              />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <ReportMetricsCard 
                title="Average Score" 
                value={report.averageScore} 
                icon="📈"
                colorScheme="neutral"
              />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <ReportMetricsCard 
                title="Context Fit" 
                value={report.averageContextFit} 
                icon="🔍"
                colorScheme="coral"
              />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <ReportMetricsCard 
                title="Role Fit" 
                value={report.averageRoleFit} 
                icon="👤"
                colorScheme="green"
              />
            </Suspense>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <Suspense fallback={<ComponentLoader />}>
                <SkillGapChart skillGaps={report.skillGaps} />
              </Suspense>
            </div>
            <div>
              <div className="bg-white rounded-md border border-border p-4">
                <h3 className="text-sm font-medium text-mauve-12 mb-4">Assessment Context</h3>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-sm text-secondary">{report.context}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-mauve-12 mb-2">Key Insights</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-accent-gold mr-2">•</span>
                      <p className="text-sm text-secondary">{report.averageContextFit}% average context understanding</p>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent-gold mr-2">•</span>
                      <p className="text-sm text-secondary">{report.averageRoleFit}% average role fit</p>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent-gold mr-2">•</span>
                      <p className="text-sm text-secondary">Top skill gap: {report.skillGaps[0].skill} ({report.skillGaps[0].gap}%)</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-medium text-mauve-12 mt-8 mb-4">Top Performing Candidates</h3>
          <div className="grid gap-4">
            {report.candidates.slice(0, 3).map((candidate, index) => (
              <Suspense key={candidate.id} fallback={<ComponentLoader />}>
                <CandidatePerformanceCard candidate={candidate} index={index} />
              </Suspense>
            ))}
            {report.candidates.length > 3 && (
              <button
                onClick={() => setActiveTab('candidates')}
                className="text-sm text-accent-gold hover:text-accent-gold/80 font-medium mt-2"
              >
                View All {report.candidates.length} Candidates →
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Candidates tab */}
      {activeTab === 'candidates' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium text-mauve-12">Candidate Performance</h3>
            <div className="flex items-center space-x-2">
              <select className="text-sm border border-border rounded-md py-1 px-2">
                <option>Sort by Name</option>
                <option>Sort by Context Fit ↓</option>
                <option>Sort by Role Fit ↓</option>
                <option>Sort by Status</option>
              </select>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search candidates..."
                  className="text-sm border border-border rounded-md py-1 pl-8 pr-2"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {report.candidates.map((candidate, index) => (
              <Suspense key={candidate.id} fallback={<ComponentLoader />}>
                <CandidatePerformanceCard candidate={candidate} index={index} />
              </Suspense>
            ))}
          </div>
        </motion.div>
      )}

      {/* Context Analysis tab */}
      {activeTab === 'context' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-2 gap-6">
            <Suspense fallback={<ComponentLoader />}>
              <ContextFitCard 
                context={report.context} 
                averageContextFit={report.averageContextFit} 
              />
            </Suspense>

            <div className="space-y-6">
              <div className="bg-white rounded-md border border-border p-4">
                <h3 className="text-sm font-medium text-mauve-12 mb-4">Candidate Context Responses</h3>
                
                <div className="space-y-4">
                  {report.candidates.slice(0, 3).map((candidate) => (
                    <div key={candidate.id} className="p-3 border border-border rounded-md hover:border-accent-gold/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-mauve-12">{candidate.name}</h4>
                        <span className="text-sm text-accent-gold font-medium">{candidate.contextFitScore}% fit</span>
                      </div>
                      
                      {candidate.detailedResponses.slice(0, 1).map((response: {
                        question: string;
                        answer: string;
                        score: number;
                      }, i: number) => (
                        <div key={i}>
                          <p className="text-xs text-secondary mb-1">Response to context question:</p>
                          <p className="text-sm text-mauve-11 italic">"{response.answer.slice(0, 120)}..."</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-md border border-border p-4">
                <h3 className="text-sm font-medium text-mauve-12 mb-4">Context-Based Recommendations</h3>
                
                <div className="space-y-3">
                  <div className="p-3 border-l-4 border-accent-gold bg-accent-gold/5 rounded-r-md">
                    <h4 className="text-sm font-medium text-mauve-12 mb-1">Onboarding Focus</h4>
                    <p className="text-sm text-secondary">
                      {report.averageContextFit > 85 
                        ? "Minimal context reinforcement needed during onboarding. Focus on role-specific training."
                        : "Emphasize business context during onboarding to strengthen understanding of company needs."
                      }
                    </p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-teal-500 bg-teal-50 rounded-r-md">
                    <h4 className="text-sm font-medium text-mauve-12 mb-1">Next Assessment</h4>
                    <p className="text-sm text-secondary">
                      {report.averageContextFit > 85 
                        ? "Future assessments can challenge candidates with more nuanced context scenarios."
                        : "Consider simplifying or clarifying the context in future assessments."
                      }
                    </p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-gray-400 bg-gray-50 rounded-r-md">
                    <h4 className="text-sm font-medium text-mauve-12 mb-1">Interview Strategy</h4>
                    <p className="text-sm text-secondary">
                      For interviews, probe more deeply on {report.skillGaps[0].skill.toLowerCase()} to address the primary skill gap.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Export tab */}
      {activeTab === 'export' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-md border border-border p-6"
        >
          <h3 className="text-lg font-medium text-mauve-12 mb-4">Export Assessment Report</h3>
          
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="p-4 border border-dashed border-border rounded-md flex flex-col items-center justify-center hover:border-accent-gold/50 hover:bg-accent-gold/5 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-gold mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="font-medium text-mauve-12">PDF Report</p>
              <p className="text-xs text-secondary mt-1">Full assessment details</p>
            </div>
            
            <div className="p-4 border border-dashed border-border rounded-md flex flex-col items-center justify-center hover:border-accent-gold/50 hover:bg-accent-gold/5 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-gold mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="font-medium text-mauve-12">CSV Export</p>
              <p className="text-xs text-secondary mt-1">Raw data for analysis</p>
            </div>
            
            <div className="p-4 border border-dashed border-border rounded-md flex flex-col items-center justify-center hover:border-accent-gold/50 hover:bg-accent-gold/5 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-gold mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <p className="font-medium text-mauve-12">Share Report</p>
              <p className="text-xs text-secondary mt-1">Send to team members</p>
            </div>
          </div>
          
          <div className="border-t border-border pt-6">
            <h4 className="text-sm font-medium text-mauve-12 mb-4">Export Settings</h4>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input type="checkbox" id="include-candidates" className="h-4 w-4 text-accent-gold" defaultChecked />
                <label htmlFor="include-candidates" className="ml-2 text-sm text-secondary">Include individual candidate data</label>
              </div>
              
              <div className="flex items-center">
                <input type="checkbox" id="include-context" className="h-4 w-4 text-accent-gold" defaultChecked />
                <label htmlFor="include-context" className="ml-2 text-sm text-secondary">Include context analysis</label>
              </div>
              
              <div className="flex items-center">
                <input type="checkbox" id="include-recommendations" className="h-4 w-4 text-accent-gold" defaultChecked />
                <label htmlFor="include-recommendations" className="ml-2 text-sm text-secondary">Include recommendations</label>
              </div>
              
              <div className="flex items-center">
                <input type="checkbox" id="include-charts" className="h-4 w-4 text-accent-gold" defaultChecked />
                <label htmlFor="include-charts" className="ml-2 text-sm text-secondary">Include visualizations and charts</label>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 