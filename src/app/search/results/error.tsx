'use client';
import Link from 'next/link';

export default function SearchResultsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">
            Something went wrong
          </h1>
          <p className="text-secondary mb-8">
            We encountered an error while loading your search results. Please try
            again or start a new search.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={reset}
              className="px-4 py-2 bg-[#fbb130] text-white rounded-md hover:bg-[#fbb130]/90"
            >
              Try Again
            </button>
            <Link
              href="/search/wizard"
              className="px-4 py-2 bg-white text-primary border border-border rounded-md hover:bg-gray-50"
            >
              Start New Search
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 