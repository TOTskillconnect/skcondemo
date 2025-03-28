import { SearchDraft, SearchWizardData } from '@/lib/types/search';

const DRAFTS_STORAGE_KEY = 'skillconnect_search_drafts';

export function saveDraft(data: SearchWizardData, name: string): SearchDraft {
  const drafts = getDrafts();
  const draft: SearchDraft = {
    id: data.id || crypto.randomUUID(),
    name,
    data: {
      ...data,
      id: data.id || crypto.randomUUID(),
      name,
      lastModified: new Date().toISOString(),
    },
    lastModified: new Date().toISOString(),
  };

  const existingIndex = drafts.findIndex((d) => d.id === draft.id);
  if (existingIndex >= 0) {
    drafts[existingIndex] = draft;
  } else {
    drafts.push(draft);
  }

  localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
  return draft;
}

export function getDrafts(): SearchDraft[] {
  if (typeof window === 'undefined') return [];
  
  const draftsJson = localStorage.getItem(DRAFTS_STORAGE_KEY);
  if (!draftsJson) return [];
  
  return JSON.parse(draftsJson);
}

export function getDraft(id: string): SearchDraft | undefined {
  const drafts = getDrafts();
  return drafts.find((draft) => draft.id === id);
}

export function deleteDraft(id: string): void {
  const drafts = getDrafts();
  const filteredDrafts = drafts.filter((draft) => draft.id !== id);
  localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(filteredDrafts));
}

export function formatLastModified(date: string): string {
  const lastModified = new Date(date);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - lastModified.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return lastModified.toLocaleDateString();
} 