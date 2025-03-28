'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SavedShortlists from '@/components/dashboard/SavedShortlists';
import OngoingAssessments from '@/components/dashboard/OngoingAssessments';
import AssessmentWizard from '@/components/assessment/AssessmentWizard';
import Statistics from '@/components/dashboard/Statistics';
import HiringContext from '@/components/dashboard/HiringContext';
import RecentActivity from '@/components/dashboard/RecentActivity';

export default function DashboardPage() {
  const [showAssessmentWizard, setShowAssessmentWizard] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
        <div className="flex space-x-4">
          <Link
            href="/search"
            className="flex items-center px-4 py-2 bg-accent-blue text-white rounded-md hover:bg-accent-blue/90 transition-colors"
          >
            <span className="mr-2">🔍</span>
            Start New Search
          </Link>
          <Link
            href="/candidates/pool"
            className="flex items-center px-4 py-2 bg-accent-green text-white rounded-md hover:bg-accent-green/90 transition-colors"
          >
            <span className="mr-2">👥</span>
            Browse All Candidates
          </Link>
          <button
            onClick={() => setShowAssessmentWizard(true)}
            className="flex items-center px-4 py-2 bg-accent-coral text-white rounded-md hover:bg-accent-coral/90 transition-colors"
          >
            <span className="mr-2">📝</span>
            Setup Assessment
          </button>
        </div>
      </div>

      {/* Statistics Section */}
      <Statistics />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hiring Context */}
        <div className="lg:col-span-2">
          <HiringContext />
        </div>

        {/* Activity Feed */}
        <div className="space-y-8">
          <RecentActivity />
        </div>
      </div>

      {/* Secondary Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ongoing Assessments */}
        <OngoingAssessments />
        
        {/* Saved Shortlists */}
        <SavedShortlists />
      </div>

      {/* Assessment Wizard */}
      <AssessmentWizard
        isOpen={showAssessmentWizard}
        onClose={() => setShowAssessmentWizard(false)}
      />
    </div>
  );
} 