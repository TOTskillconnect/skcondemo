'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const candidateCount = searchParams.get('candidates') || '1';
  const assessmentType = searchParams.get('type') || 'assessment';
  
  // Get assessment type label
  const getAssessmentTypeLabel = (type: string) => {
    switch (type) {
      case 'technical':
        return 'Technical Challenge';
      case 'behavioral':
        return 'Behavioral Game';
      case 'values':
        return 'Values Assessment';
      case 'life-story':
        return 'Life Story Q&A';
      default:
        return 'Assessment';
    }
  };
  
  // If no query params, redirect to dashboard
  useEffect(() => {
    if (!searchParams.has('candidates') && !searchParams.has('type')) {
      router.push('/dashboard');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto p-8"
      >
        <div className="w-16 h-16 bg-accent-green/10 text-accent-green rounded-full flex items-center justify-center mx-auto mb-6">
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </motion.svg>
        </div>
        
        <h1 className="text-3xl font-bold text-primary mb-4">
          Assessment Sent Successfully!
        </h1>
        
        <p className="text-secondary mb-4">
          Your {getAssessmentTypeLabel(assessmentType)} has been sent to {candidateCount} candidate{candidateCount !== '1' ? 's' : ''}. 
          They will receive an email with instructions to complete it.
        </p>
        
        <p className="text-sm text-secondary mb-8">
          You've provided clear context for what you want the candidates to demonstrate.
          You'll be notified when candidates complete their assessments.
        </p>

        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="block w-full bg-accent-green text-white px-6 py-3 rounded-md hover:bg-accent-green/90"
          >
            Return to Dashboard
          </Link>
          
          <Link
            href="/assessment"
            className="block w-full bg-white text-accent-green border border-accent-green px-6 py-3 rounded-md hover:bg-accent-green/5"
          >
            Create Another Assessment
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function AssessmentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
} 