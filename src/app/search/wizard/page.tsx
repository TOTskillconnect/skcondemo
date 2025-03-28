'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FormWizard from '@/components/wizard/FormWizard';
import { SearchWizardData } from '@/lib/types/search';
import { saveDraft, getDrafts, formatLastModified } from '@/lib/utils/draft';

export default function SearchWizardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showDrafts, setShowDrafts] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [currentData, setCurrentData] = useState<SearchWizardData | null>(null);
  const [initialData, setInitialData] = useState<SearchWizardData | null>(null);

  useEffect(() => {
    // Check for query parameters to prefill the form
    const role = searchParams.get('role');
    const type = searchParams.get('type');
    const context = searchParams.get('context');
    const stage = searchParams.get('stage');
    
    if (role || context || stage) {
      console.log("Prefilling search form with context data:", { role, type, context, stage });
      
      // Create initial data from the search parameters
      const prefillData: SearchWizardData = {
        basicCriteria: {
          roleTitle: role || '',
          industry: '',
          experienceLevel: '',
          skills: [],
        },
        hiringContext: {
          goal: type || '',
          companyStage: stage || '',
          milestones: [],
          accomplishments: [],
          culturalValues: [],
          context: context || '',
        },
      };
      
      setInitialData(prefillData);
    }
    
    // Check for saved drafts
    const drafts = getDrafts();
    if (drafts.length > 0) {
      setShowDrafts(true);
    }
  }, [searchParams]);

  const handleComplete = (data: SearchWizardData) => {
    try {
      console.log('Final data:', data);
      // Store the search data in localStorage
      localStorage.setItem('searchCriteria', JSON.stringify(data));
      // Clear any existing search results
      localStorage.removeItem('searchResults');
      // Add a timestamp to ensure fresh results
      localStorage.setItem('searchTimestamp', Date.now().toString());
      // Redirect to results page
      router.push('/search/results');
    } catch (error) {
      console.error('Error saving search criteria:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleSaveDraft = () => {
    if (draftName.trim() && currentData) {
      saveDraft(currentData, draftName.trim());
      setShowSaveModal(false);
      setDraftName('');
      setShowDrafts(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Create New Search</h1>
          <button
            onClick={() => setShowSaveModal(true)}
            className="px-4 py-2 bg-white text-primary border border-border rounded-md hover:bg-gray-50"
          >
            Save Draft
          </button>
        </div>

        <FormWizard 
          initialData={initialData || undefined}
          onComplete={handleComplete} 
          onDataChange={setCurrentData} 
        />

        {showSaveModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-semibold text-primary mb-4">
                Save Search Draft
              </h2>
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="Enter draft name..."
                className="w-full p-2 border border-border rounded-md mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 text-primary hover:text-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDraft}
                  disabled={!draftName.trim() || !currentData}
                  className="px-4 py-2 bg-accent-blue text-white rounded-md hover:bg-accent-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {showDrafts && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-primary mb-4">
              Saved Drafts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getDrafts().map((draft) => (
                <div
                  key={draft.id}
                  className="bg-white p-4 rounded-lg border border-border shadow-sm hover:shadow-card hover:border-accent-blue/30 transition-all cursor-pointer"
                  onClick={() => {
                    // Load draft data
                    router.push(`/search/wizard?draft=${draft.id}`);
                  }}
                >
                  <h3 className="font-semibold text-primary mb-2">
                    {draft.name}
                  </h3>
                  <p className="text-sm text-secondary">
                    Last modified: {formatLastModified(draft.lastModified)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 