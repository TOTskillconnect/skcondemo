'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CandidatesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/search');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Redirecting to candidate search...</p>
    </div>
  );
} 