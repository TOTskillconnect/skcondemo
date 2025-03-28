'use client';

import { useState, useEffect } from 'react';
import { mockAssessmentTemplates } from '@/lib/mock-data';
import { mockAssessmentReports, AssessmentReport } from '@/lib/mock-data/assessment-reports';
import { AssessmentTemplate } from '@/lib/types';
import AssessmentWizard from '@/components/assessment/AssessmentWizard';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface SavedAssessment {
  id: string;
  name: string;
  goal: string;
  type: string;
  subType: string;
  timeLimit: number | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: {id: string; value: string}[];
  candidates: string[]; // Store candidate IDs
  status: 'draft' | 'active' | 'template';
  createdAt: string;
  lastModified: string;
  context?: string;
}

export default function AssessmentPage() {
  const [assessmentTemplates, setAssessmentTemplates] = useState<AssessmentTemplate[]>(mockAssessmentTemplates);
  const [savedTemplates, setSavedTemplates] = useState<SavedAssessment[]>([]);
  const [draftAssessments, setDraftAssessments] = useState<SavedAssessment[]>([]);
  const [assessmentReports, setAssessmentReports] = useState<AssessmentReport[]>([]);
  const [showAssessmentWizard, setShowAssessmentWizard] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'drafts' | 'reports'>('summary');
  const [searchQuery, setSearchQuery] = useState('');
  const [reportsFilter, setReportsFilter] = useState<'all' | 'ongoing' | 'completed'>('all');
  const router = useRouter();

  useEffect(() => {
    // Load saved templates from localStorage
    const templates = JSON.parse(localStorage.getItem('assessmentTemplates') || '[]');
    setSavedTemplates(templates);
    
    // Load draft assessments from localStorage
    const drafts = JSON.parse(localStorage.getItem('assessmentDrafts') || '[]');
    setDraftAssessments(drafts);

    // Load assessment reports (from mock data in real app would be API call)
    setAssessmentReports(mockAssessmentReports);
  }, []);

  // Calculate summary statistics
  const summaryStats = {
    totalAssessmentsSent: assessmentReports.length,
    completedAssessments: assessmentReports.filter(r => r.status === 'completed').length,
    totalReports: assessmentReports.length,
    totalTemplates: savedTemplates.length,
    totalCandidates: assessmentReports.reduce((sum, report) => sum + report.candidates.length, 0),
    avgContextFit: Math.round(
      assessmentReports.reduce((sum, report) => sum + report.averageContextFit, 0) / 
      (assessmentReports.length || 1)
    ),
    avgRoleFit: Math.round(
      assessmentReports.reduce((sum, report) => sum + report.averageRoleFit, 0) / 
      (assessmentReports.length || 1)
    )
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const deleteTemplate = (id: string) => {
    const updatedTemplates = savedTemplates.filter(t => t.id !== id);
    setSavedTemplates(updatedTemplates);
    localStorage.setItem('assessmentTemplates', JSON.stringify(updatedTemplates));
  };

  const deleteDraft = (id: string) => {
    const updatedDrafts = draftAssessments.filter(d => d.id !== id);
    setDraftAssessments(updatedDrafts);
    localStorage.setItem('assessmentDrafts', JSON.stringify(updatedDrafts));
  };

  // Filter reports based on status and search query
  const filteredReports = assessmentReports.filter(report => {
    // Filter by status
    if (reportsFilter === 'ongoing' && report.status !== 'in_progress') return false;
    if (reportsFilter === 'completed' && report.status !== 'completed') return false;
    
    // Filter by search query
    if (searchQuery) {
      // Check if title matches
      const titleMatch = report.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Check if any candidate name matches
      const candidateMatch = report.candidates.some(
        candidate => candidate.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      return titleMatch || candidateMatch;
    }
    
    return true;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Assessments</h1>
        <button 
          onClick={() => setShowAssessmentWizard(true)}
          className="flex items-center gap-1 px-4 py-2 bg-accent-blue text-white rounded-md hover:bg-accent-blue/90 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Create Assessment
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-border">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('summary')}
              className={`py-3 px-1 font-medium ${
                activeTab === 'summary'
                  ? 'text-primary border-b-2 border-accent-gold'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab('drafts')}
              className={`py-3 px-1 font-medium ${
                activeTab === 'drafts'
                  ? 'text-primary border-b-2 border-accent-gold'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              Drafts ({draftAssessments.length})
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-3 px-1 font-medium ${
                activeTab === 'reports'
                  ? 'text-primary border-b-2 border-accent-gold'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              Reports ({assessmentReports.length})
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'summary' && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Summary Stats */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-border hover:shadow transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl text-accent-gold">📊</span>
                    <span className="text-xs text-secondary bg-gray-100 px-2 py-1 rounded-full">
                      Total
                    </span>
                  </div>
                  <h3 className="text-sm text-secondary mb-1">Assessments Sent</h3>
                  <p className="text-3xl font-bold text-primary">{summaryStats.totalAssessmentsSent}</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-border hover:shadow transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl text-teal-500">✓</span>
                    <span className="text-xs text-secondary bg-gray-100 px-2 py-1 rounded-full">
                      Total
                    </span>
                  </div>
                  <h3 className="text-sm text-secondary mb-1">Completed Assessments</h3>
                  <p className="text-3xl font-bold text-primary">{summaryStats.completedAssessments}</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-border hover:shadow transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl text-accent-gold">📝</span>
                    <span className="text-xs text-secondary bg-gray-100 px-2 py-1 rounded-full">
                      Total
                    </span>
                  </div>
                  <h3 className="text-sm text-secondary mb-1">Templates</h3>
                  <p className="text-3xl font-bold text-primary">{summaryStats.totalTemplates}</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-border hover:shadow transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl text-accent-gold">👥</span>
                    <span className="text-xs text-secondary bg-gray-100 px-2 py-1 rounded-full">
                      Total
                    </span>
                  </div>
                  <h3 className="text-sm text-secondary mb-1">Candidates Assessed</h3>
                  <p className="text-3xl font-bold text-primary">{summaryStats.totalCandidates}</p>
                </div>
              </div>
            </div>
            
            {/* Performance Overview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-primary mb-4">Performance Overview</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-md font-medium text-mauve-12 mb-3">Average Context Fit</h3>
                    <div className="flex items-end mb-2">
                      <span className="text-3xl font-bold text-accent-gold">{summaryStats.avgContextFit}%</span>
                      <span className="text-sm text-secondary ml-2 mb-1">across all assessments</span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent-gold rounded-full" 
                        style={{ width: `${summaryStats.avgContextFit}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium text-mauve-12 mb-3">Average Role Fit</h3>
                    <div className="flex items-end mb-2">
                      <span className="text-3xl font-bold text-teal-500">{summaryStats.avgRoleFit}%</span>
                      <span className="text-sm text-secondary ml-2 mb-1">across all assessments</span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-teal-500 rounded-full" 
                        style={{ width: `${summaryStats.avgRoleFit}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Templates Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-primary">Templates</h2>
                <Link href="#" className="text-accent-gold hover:text-accent-gold/80 text-sm">View All</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedTemplates.length === 0 ? (
                  <div className="col-span-full text-center p-10 bg-gray-50 rounded-lg border border-border">
                    <p className="text-secondary mb-4">No saved templates yet.</p>
                    <button
                      onClick={() => setShowAssessmentWizard(true)}
                      className="text-accent-gold hover:underline"
                    >
                      Create your first assessment template
                    </button>
                  </div>
                ) : (
                  savedTemplates.slice(0, 3).map((template) => (
                    <div key={template.id} className="bg-white p-6 rounded-lg shadow-sm border border-border hover:shadow transition-shadow">
                      <div className="flex justify-between items-start">
                        <h2 className="text-xl font-semibold text-primary mb-2">{template.name}</h2>
                        <button
                          onClick={() => deleteTemplate(template.id)}
                          className="text-red-500 hover:text-red-600"
                          title="Delete template"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
            <div className="space-y-2">
              <p className="text-secondary">
                <span className="font-medium">Type:</span> {template.type}
                          {template.subType && ` (${template.subType})`}
              </p>
              <p className="text-secondary">
                          <span className="font-medium">Topics:</span> {template.topics.length}
                        </p>
                        {template.context && (
                          <p className="text-secondary line-clamp-2 text-sm">
                            <span className="font-medium">Context:</span> {template.context}
                          </p>
                        )}
                        <p className="text-secondary text-sm">
                          Created: {formatDate(template.createdAt)}
                        </p>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => {
                            // TODO: Load template into wizard
                            setShowAssessmentWizard(true);
                          }}
                          className="text-accent-gold hover:text-accent-gold/80"
                        >
                          Use Template
                        </button>
                      </div>
                    </div>
                  ))
                )}
                {savedTemplates.length > 3 && (
                  <div className="flex items-center justify-center col-span-full">
                    <button 
                      onClick={() => {}} 
                      className="text-accent-gold hover:text-accent-gold/80"
                    >
                      View all templates →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'drafts' && (
          <motion.div
            key="drafts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {draftAssessments.length === 0 ? (
                <div className="col-span-full text-center p-10 bg-gray-50 rounded-lg border border-border">
                  <p className="text-secondary mb-4">No draft assessments found.</p>
                  <button
                    onClick={() => setShowAssessmentWizard(true)}
                    className="text-accent-gold hover:underline"
                  >
                    Create an assessment
                  </button>
                </div>
              ) : (
                draftAssessments.map((draft) => (
                  <div key={draft.id} className="bg-white p-6 rounded-lg shadow-sm border border-border hover:shadow transition-shadow">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold text-primary mb-2">{draft.name}</h2>
                      <button
                        onClick={() => deleteDraft(draft.id)}
                        className="text-red-500 hover:text-red-600"
                        title="Delete draft"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-2">
                      <p className="text-secondary">
                        <span className="font-medium">Type:</span> {draft.type}
                        {draft.subType && ` (${draft.subType})`}
              </p>
              <p className="text-secondary">
                        <span className="font-medium">Candidates:</span> {draft.candidates.length}
                      </p>
                      {draft.context && (
                        <p className="text-secondary line-clamp-2 text-sm">
                          <span className="font-medium">Context:</span> {draft.context}
                        </p>
                      )}
                      <p className="text-secondary text-sm">
                        Last modified: {formatDate(draft.lastModified)}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => {
                          // TODO: Load draft into wizard
                          setShowAssessmentWizard(true);
                        }}
                        className="text-accent-gold hover:text-accent-gold/80"
                      >
                        Continue Editing
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'reports' && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Search and Filters */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by assessment title or candidate name..."
                  className="w-80 border border-border rounded-md py-2 px-10 focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setReportsFilter('all')}
                  className={`px-4 py-2 rounded-md ${
                    reportsFilter === 'all'
                      ? 'bg-accent-blue text-white'
                      : 'bg-background text-secondary hover:bg-background/80'
                  }`}
                >
                  All Reports
                </button>
                <button
                  onClick={() => setReportsFilter('ongoing')}
                  className={`px-4 py-2 rounded-md ${
                    reportsFilter === 'ongoing'
                      ? 'bg-accent-blue text-white'
                      : 'bg-background text-secondary hover:bg-background/80'
                  }`}
                >
                  Ongoing
                </button>
                <button
                  onClick={() => setReportsFilter('completed')}
                  className={`px-4 py-2 rounded-md ${
                    reportsFilter === 'completed'
                      ? 'bg-accent-blue text-white'
                      : 'bg-background text-secondary hover:bg-background/80'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            {/* Reports listing */}
            {filteredReports.length === 0 ? (
              <div className="text-center p-10 bg-gray-50 rounded-lg border border-border">
                <p className="text-secondary mb-4">
                  {searchQuery 
                    ? "No assessment reports found matching your search criteria." 
                    : "No assessment reports found."}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setReportsFilter('all');
                  }}
                  className="text-accent-gold hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Ongoing Assessments Section */}
                {reportsFilter !== 'completed' && filteredReports.some(r => r.status === 'in_progress') && (
                  <div>
                    <h2 className="text-xl font-semibold text-primary mb-4">Ongoing Assessments</h2>
                    <div className="grid grid-cols-1 gap-4">
                      {filteredReports
                        .filter(report => report.status === 'in_progress')
                        .map(report => (
                          <div 
                            key={report.id} 
                            className="bg-white p-6 rounded-lg shadow-sm border border-border hover:shadow transition-shadow"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-semibold text-primary">{report.title}</h3>
                                <p className="text-secondary text-sm">
                                  {report.type.charAt(0).toUpperCase() + report.type.slice(1)} • {report.subType} • Created on {formatDate(report.dateCreated)}
                                </p>
                              </div>
                              <span className="px-3 py-1 bg-accent-gold/10 text-accent-gold rounded-full text-sm font-medium">
                                In Progress
                              </span>
                            </div>
                            <div className="mt-4 grid grid-cols-4 gap-4">
                              <div>
                                <p className="text-xs text-secondary mb-1">Candidates</p>
                                <p className="font-medium">{report.candidates.length}</p>
                              </div>
                              <div>
                                <p className="text-xs text-secondary mb-1">Completion</p>
                                <p className="font-medium">{report.completionRate}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-secondary mb-1">Context Fit</p>
                                <p className="font-medium text-accent-gold">{report.averageContextFit}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-secondary mb-1">Role Fit</p>
                                <p className="font-medium text-teal-600">{report.averageRoleFit}%</p>
                              </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                              <Button 
                                onClick={() => router.push(`/assessment/reports/${report.id}`)}
                                className="mt-4"
                              >
                                View Report
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Completed Assessments Section */}
                {reportsFilter !== 'ongoing' && filteredReports.some(r => r.status === 'completed') && (
                  <div>
                    <h2 className="text-xl font-semibold text-primary mb-4">Completed Assessments</h2>
                    <div className="grid grid-cols-1 gap-4">
                      {filteredReports
                        .filter(report => report.status === 'completed')
                        .map(report => (
                          <div 
                            key={report.id} 
                            className="bg-white p-6 rounded-lg shadow-sm border border-border hover:shadow transition-shadow"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-semibold text-primary">{report.title}</h3>
                                <p className="text-secondary text-sm">
                                  {report.type.charAt(0).toUpperCase() + report.type.slice(1)} • {report.subType} • 
                                  Completed on {formatDate(report.dateCompleted || '')}
                                </p>
                              </div>
                              <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                                Completed
                              </span>
                            </div>
                            <div className="mt-4">
                              <p className="text-sm text-secondary mb-2">Top Candidates</p>
                              <div className="flex flex-wrap gap-2">
                                {report.candidates
                                  .sort((a, b) => (b.contextFitScore + b.roleFitScore) - (a.contextFitScore + a.roleFitScore))
                                  .slice(0, 3)
                                  .map(candidate => (
                                    <Link 
                                      key={candidate.id}
                                      href={`/assessment/reports/candidate/${candidate.id}`}
                                      className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                                    >
                                      {candidate.name}
                                      <span className="ml-1 text-xs text-accent-gold">
                                        {Math.round((candidate.contextFitScore + candidate.roleFitScore) / 2)}%
                                      </span>
                                    </Link>
                                  ))}
                              </div>
                            </div>
                            <div className="mt-4 grid grid-cols-4 gap-4">
                              <div>
                                <p className="text-xs text-secondary mb-1">Avg. Score</p>
                                <p className="font-medium">{report.averageScore}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-secondary mb-1">Completion</p>
                                <p className="font-medium">{report.completionRate}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-secondary mb-1">Context Fit</p>
                                <p className="font-medium text-accent-gold">{report.averageContextFit}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-secondary mb-1">Role Fit</p>
                                <p className="font-medium text-teal-600">{report.averageRoleFit}%</p>
                              </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                              <Button 
                                onClick={() => router.push(`/assessment/reports/${report.id}`)}
                                className="mt-4"
                              >
                                View Full Report
                              </Button>
            </div>
          </div>
        ))}
      </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assessment Wizard */}
      <AssessmentWizard
        isOpen={showAssessmentWizard}
        onClose={() => setShowAssessmentWizard(false)}
      />
    </div>
  );
} 