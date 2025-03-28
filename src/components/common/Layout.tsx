'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/dashboard" className="flex items-center">
                <span className="text-xl font-bold text-primary">SkillConnect</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/search"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/search' 
                    ? 'bg-accent-gold text-white' 
                    : 'text-secondary hover:text-primary'
                }`}
              >
                Search
              </Link>
              <Link 
                href="/assessment"
                className={clsx('px-3 py-2 rounded-md text-sm font-medium', 
                  pathname === '/assessment' 
                  ? 'bg-accent-gold text-white' 
                  : 'text-secondary hover:text-primary'
                )}
              >
                Assessment
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
} 