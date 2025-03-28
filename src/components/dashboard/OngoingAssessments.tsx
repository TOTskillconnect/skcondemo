'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface OngoingAssessment {
  id: string;
  title: string;
  type: string;
  candidates: {
    id: string;
    name: string;
    title: string;
    status: 'pending' | 'in_progress' | 'completed';
    progress?: number;
  }[];
  deadline: string;
  createdAt: string;
}

export default function OngoingAssessments() {
  const [assessments, setAssessments] = useState<OngoingAssessment[]>([]);
  const [expandedAssessment, setExpandedAssessment] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with actual API call
    const mockAssessments: OngoingAssessment[] = [
      {
        id: '1',
        title: 'Frontend Technical Assessment',
        type: 'technical',
        candidates: [
          {
            id: '1',
            name: 'John Doe',
            title: 'Senior Frontend Developer',
            status: 'in_progress',
            progress: 65
          },
          {
            id: '2',
            name: 'Jane Smith',
            title: 'Frontend Developer',
            status: 'pending',
            progress: 0
          },
        ],
        deadline: '2024-03-25T23:59:59Z',
        createdAt: '2024-03-20T10:00:00Z',
      },
      {
        id: '2',
        title: 'Product Manager Behavioral Assessment',
        type: 'behavioral',
        candidates: [
          {
            id: '3',
            name: 'Mike Johnson',
            title: 'Product Manager',
            status: 'completed',
            progress: 100
          },
        ],
        deadline: '2024-03-23T23:59:59Z',
        createdAt: '2024-03-19T15:30:00Z',
      },
    ];
    setAssessments(mockAssessments);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-accent-green/10 text-accent-green';
      case 'in_progress':
        return 'bg-accent-blue/10 text-accent-blue';
      default:
        return 'bg-accent-slate/10 text-accent-slate';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleSendReminder = (assessmentId: string) => {
    // TODO: Implement reminder functionality
    console.log('Sending reminder for assessment:', assessmentId);
  };

  const handleViewDetails = (assessmentId: string) => {
    // Navigate to assessment report page
    window.location.href = `/assessment/reports/${assessmentId}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-card border border-border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-primary">Ongoing Assessments</h2>
        <Link
          href="/assessment"
          className="text-accent-blue hover:text-accent-blue/80"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {assessments.map((assessment) => (
          <motion.div
            key={assessment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-border rounded-lg p-4 hover:border-accent-blue/50 hover:shadow-card-hover transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-primary">{assessment.title}</h3>
                <p className="text-sm text-secondary capitalize">{assessment.type}</p>
              </div>
              <div className="text-sm text-secondary">
                Due {formatDate(assessment.deadline)}
              </div>
            </div>

            <div className="space-y-2">
              {assessment.candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-primary">
                          {candidate.name}
                        </p>
                        <p className="text-xs text-secondary">{candidate.title}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          candidate.status
                        )}`}
                      >
                        {candidate.status.replace('_', ' ')}
                      </span>
                    </div>
                    {candidate.progress !== undefined && (
                      <div className="mt-2">
                        <div className="h-1 bg-background rounded-full">
                          <div
                            className={`h-full rounded-full ${
                              candidate.status === 'completed'
                                ? 'bg-accent-green'
                                : 'bg-accent-blue'
                            }`}
                            style={{ width: `${candidate.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-secondary mt-1">
                          {candidate.progress}% complete
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <Link
                href={`/assessment/reports/${assessment.id}`}
                className="text-sm text-accent-blue hover:text-accent-blue/80"
              >
                View Details
              </Link>
              <button
                onClick={() => handleSendReminder(assessment.id)}
                className="text-sm text-accent-blue hover:text-accent-blue/80"
              >
                Send Reminder
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 