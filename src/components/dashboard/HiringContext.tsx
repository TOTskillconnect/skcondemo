'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface HiringContextData {
  id: string;
  companyStage: string;
  keyMilestones: string[];
  strategicDirection: string;
  currentHiringNeed: string;
  matchingCandidates: number;
  successRate: number;
}

export default function HiringContext() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [contexts, setContexts] = useState<HiringContextData[]>([
    {
      id: '1',
      companyStage: 'Series A',
      keyMilestones: [
        'Launch MVP',
        'Scale user base to 50K',
        'Expand to new markets'
      ],
      strategicDirection: 'Focusing on rapid user growth and market expansion',
      currentHiringNeed: 'Senior Frontend Developer for scaling our platform',
      matchingCandidates: 24,
      successRate: 85
    },
    {
      id: '2',
      companyStage: 'Series B',
      keyMilestones: [
        'Increase revenue to $10M ARR',
        'Expand team by 50%',
        'Enter international markets'
      ],
      strategicDirection: 'Revenue growth and international expansion',
      currentHiringNeed: 'VP of Sales with international experience',
      matchingCandidates: 12,
      successRate: 72
    }
  ]);

  const [newContext, setNewContext] = useState<Omit<HiringContextData, 'id'>>({
    companyStage: 'Seed',
    keyMilestones: [''],
    strategicDirection: '',
    currentHiringNeed: '',
    matchingCandidates: 0,
    successRate: 0
  });

  const handleSave = (contextId: string) => {
    setIsEditing(null);
    // TODO: Save to backend
  };

  const handleDelete = (contextId: string) => {
    setContexts(contexts.filter(c => c.id !== contextId));
  };

  const handleAddNew = () => {
    const id = Date.now().toString();
    setContexts([...contexts, { id, ...newContext }]);
    setIsAdding(false);
    setNewContext({
      companyStage: 'Seed',
      keyMilestones: [''],
      strategicDirection: '',
      currentHiringNeed: '',
      matchingCandidates: 0,
      successRate: 0
    });
  };

  const updateContext = (id: string, updates: Partial<HiringContextData>) => {
    setContexts(contexts.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const launchSearch = (context: HiringContextData) => {
    // Extract search parameters from context
    const roleTitle = context.currentHiringNeed.split(' ')[0]; // Get the role title (e.g., "Senior" from "Senior Frontend Developer")
    const roleType = context.currentHiringNeed.includes('Developer') ? 'developer' : 
                   context.currentHiringNeed.includes('Sales') ? 'sales' : 'product';
    
    // Create the search criteria directly
    const searchCriteria = {
      basicCriteria: {
        roleTitle: context.currentHiringNeed,
        industry: '',
        experienceLevel: '',
        skills: [],
      },
      hiringContext: {
        goal: roleType,
        companyStage: context.companyStage,
        milestones: context.keyMilestones.map(m => ({ id: m, label: m })),
        accomplishments: [],
        culturalValues: [],
        context: context.strategicDirection,
      },
    };
    
    // Store the search criteria directly in localStorage
    localStorage.setItem('searchCriteria', JSON.stringify(searchCriteria));
    
    // Clear any existing search results
    localStorage.removeItem('searchResults');
    
    // Add a timestamp to ensure fresh results
    localStorage.setItem('searchTimestamp', Date.now().toString());
    
    // Navigate directly to results page
    router.push('/search/results');
  };

  const renderContext = (context: HiringContextData) => {
    const editing = isEditing === context.id;
    
    return (
      <motion.div 
        key={context.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-lg border border-border shadow-card hover:shadow-card-hover transition-all p-6 mb-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-primary">
            {editing ? 
              <input 
                type="text" 
                value={context.currentHiringNeed} 
                onChange={(e) => updateContext(context.id, { currentHiringNeed: e.target.value })}
                className="p-1 border border-border rounded-md text-xl w-full"
              />
              : context.currentHiringNeed}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => editing ? handleSave(context.id) : setIsEditing(context.id)}
              className="text-accent-slate hover:text-accent-blue transition-colors"
            >
              {editing ? 'Save' : 'Edit'}
            </button>
            {editing && (
              <button
                onClick={() => setIsEditing(null)}
                className="px-4 py-2 border border-border text-secondary rounded-md hover:bg-background/80 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={() => handleDelete(context.id)}
              className="text-accent-slate hover:text-accent-coral transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Company Stage
              </label>
              {editing ? (
                <select
                  value={context.companyStage}
                  onChange={(e) => updateContext(context.id, { companyStage: e.target.value })}
                  className="w-full p-2 border border-border rounded-md"
                >
                  <option value="Pre-seed">Pre-seed</option>
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                  <option value="Series B">Series B</option>
                </select>
              ) : (
                <p className="text-primary">{context.companyStage}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Key Milestones
              </label>
              {editing ? (
                <textarea
                  value={context.keyMilestones.join('\n')}
                  onChange={(e) => updateContext(context.id, {
                    keyMilestones: e.target.value.split('\n').filter(m => m.trim())
                  })}
                  className="w-full p-2 border border-border rounded-md"
                  rows={3}
                  placeholder="Enter milestones, one per line"
                />
              ) : (
                <ul className="list-disc list-inside text-primary">
                  {context.keyMilestones.map((milestone, index) => (
                    <li key={index}>{milestone}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Strategic Direction
              </label>
              {editing ? (
                <textarea
                  value={context.strategicDirection}
                  onChange={(e) => updateContext(context.id, { strategicDirection: e.target.value })}
                  className="w-full p-2 border border-border rounded-md"
                  rows={2}
                />
              ) : (
                <p className="text-primary">{context.strategicDirection}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-accent-blue/5 p-4 rounded-lg">
            <p className="text-sm text-secondary">Matching Candidates</p>
            {editing ? (
              <input
                type="number"
                value={context.matchingCandidates}
                onChange={(e) => updateContext(context.id, { matchingCandidates: parseInt(e.target.value) || 0 })}
                className="text-2xl font-bold text-accent-blue bg-transparent border-b border-accent-blue/30 w-20"
              />
            ) : (
              <p className="text-2xl font-bold text-accent-blue">{context.matchingCandidates}</p>
            )}
          </div>
          <div className="bg-accent-green/5 p-4 rounded-lg">
            <p className="text-sm text-secondary">Success Rate</p>
            {editing ? (
              <div className="flex items-center">
                <input
                  type="number"
                  value={context.successRate}
                  onChange={(e) => updateContext(context.id, { successRate: parseInt(e.target.value) || 0 })}
                  className="text-2xl font-bold text-accent-green bg-transparent border-b border-accent-green/30 w-16"
                  min="0"
                  max="100"
                />
                <span className="text-2xl font-bold text-accent-green">%</span>
              </div>
            ) : (
              <p className="text-2xl font-bold text-accent-green">{context.successRate}%</p>
            )}
          </div>
        </div>

        {/* Launch Search Section */}
        {!editing && (
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-blue/10 text-accent-blue mr-2">
                {context.matchingCandidates} matches
              </span>
              <span className="text-xs text-secondary">based on this context</span>
            </div>
            <button
              onClick={() => launchSearch(context)}
              className="inline-flex items-center px-4 py-2 bg-accent-blue text-white rounded-md hover:bg-accent-blue/90 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Launch Search
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  const renderNewContextForm = () => {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="bg-white rounded-lg shadow-sm border border-border p-6 mb-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-primary">New Hiring Context</h3>
          <button
            onClick={() => setIsAdding(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Company Stage
              </label>
              <select
                value={newContext.companyStage}
                onChange={(e) => setNewContext({ ...newContext, companyStage: e.target.value })}
                className="w-full p-2 border border-border rounded-md"
              >
                <option value="Pre-seed">Pre-seed</option>
                <option value="Seed">Seed</option>
                <option value="Series A">Series A</option>
                <option value="Series B">Series B</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Key Milestones
              </label>
              <textarea
                value={newContext.keyMilestones.join('\n')}
                onChange={(e) => setNewContext({
                  ...newContext,
                  keyMilestones: e.target.value.split('\n').filter(m => m.trim())
                })}
                className="w-full p-2 border border-border rounded-md"
                rows={3}
                placeholder="Enter milestones, one per line"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Strategic Direction
              </label>
              <textarea
                value={newContext.strategicDirection}
                onChange={(e) => setNewContext({ ...newContext, strategicDirection: e.target.value })}
                className="w-full p-2 border border-border rounded-md"
                rows={2}
                placeholder="E.g., Focusing on rapid user growth and market expansion"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Current Hiring Need
              </label>
              <textarea
                value={newContext.currentHiringNeed}
                onChange={(e) => setNewContext({ ...newContext, currentHiringNeed: e.target.value })}
                className="w-full p-2 border border-border rounded-md"
                rows={2}
                placeholder="E.g., Senior Frontend Developer for scaling our platform"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-accent-blue/5 p-4 rounded-lg">
            <p className="text-sm text-secondary">Matching Candidates</p>
            <input
              type="number"
              value={newContext.matchingCandidates}
              onChange={(e) => setNewContext({ ...newContext, matchingCandidates: parseInt(e.target.value) || 0 })}
              className="text-2xl font-bold text-accent-blue bg-transparent border-b border-accent-blue/30 w-20"
            />
          </div>
          <div className="bg-accent-green/5 p-4 rounded-lg">
            <p className="text-sm text-secondary">Success Rate</p>
            <div className="flex items-center">
              <input
                type="number"
                value={newContext.successRate}
                onChange={(e) => setNewContext({ ...newContext, successRate: parseInt(e.target.value) || 0 })}
                className="text-2xl font-bold text-accent-green bg-transparent border-b border-accent-green/30 w-16"
                min="0"
                max="100"
              />
              <span className="text-2xl font-bold text-accent-green">%</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAddNew}
            className="flex items-center justify-center w-full p-6 border-2 border-dashed border-border rounded-lg hover:border-accent-blue hover:bg-accent-blue/5 transition-colors"
          >
            Add Context
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-primary">Hiring Contexts</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-accent-blue hover:text-accent-blue/80 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Context
          </button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && renderNewContextForm()}
        {contexts.map(context => renderContext(context))}
      </AnimatePresence>
    </div>
  );
} 