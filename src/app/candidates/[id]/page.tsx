'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CandidateProfileProps {
  params: { id: string };
}

export default function CandidateProfilePage({ params }: CandidateProfileProps) {
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (id) {
      router.replace(`/candidate?id=${id}`);
    }
  }, [id, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Redirecting to candidate profile...</p>
    </div>
  );
} 