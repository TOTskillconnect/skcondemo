'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { mockAssessmentReports, AssessmentReport } from '@/lib/mock-data/assessment-reports';

export default function AssessmentReportsPage() {
  const [reports, setReports] = useState<AssessmentReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with reduced timeout for faster loading
    const timer = setTimeout(() => {
      setReports(mockAssessmentReports);
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer); // Clean up timer on unmount
  }, []);

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not completed';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-mauve-12">Assessment Reports</h1>
        <p className="text-secondary mt-2">
          View detailed reports on candidate performance with context and role fit analysis
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-gold"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {reports.map((report) => (
            <Link href={`/assessment/reports/${report.id}`} key={report.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-border rounded-lg hover:border-accent-gold/50 transition-colors p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-mauve-12">{report.title}</h2>
                    <p className="text-secondary text-sm mt-1">
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)} • {report.subType} • {report.candidates.length} candidates
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>

                <div className="mt-4 bg-gray-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-mauve-11 mb-2">Assessment Context</h3>
                  <p className="text-secondary text-sm line-clamp-2">{report.context}</p>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-4">
                  <div className="bg-white p-3 rounded-md border border-border">
                    <p className="text-xs text-secondary">Completion</p>
                    <p className="text-xl font-semibold text-mauve-12">{report.completionRate}%</p>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-border">
                    <p className="text-xs text-secondary">Avg. Score</p>
                    <p className="text-xl font-semibold text-mauve-12">{report.averageScore}%</p>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-border">
                    <p className="text-xs text-secondary">Context Fit</p>
                    <p className="text-xl font-semibold text-accent-gold">{report.averageContextFit}%</p>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-border">
                    <p className="text-xs text-secondary">Role Fit</p>
                    <p className="text-xl font-semibold text-accent-gold">{report.averageRoleFit}%</p>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center text-sm text-secondary">
                    <span>Created: {formatDate(report.dateCreated)}</span>
                    <span className="mx-2">•</span>
                    <span>Completed: {formatDate(report.dateCompleted)}</span>
                  </div>
                  <span className="text-accent-gold text-sm font-medium">View Report →</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 