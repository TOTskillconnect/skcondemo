'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchFilters as SearchFiltersType, Tag } from '@/lib/types/search';
import InteractiveTagInput from '../wizard/InteractiveTagInput';
import { SKILL_OPTIONS } from '@/lib/data/form-options';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  onClose: () => void;
}

export default function SearchFilters({
  filters,
  onFiltersChange,
  onClose,
}: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSkillChange = (skills: Tag[]) => {
    onFiltersChange({
      ...filters,
      skills,
    });
  };

  const handleExperienceChange = (field: 'minYears' | 'minStartupYears', value: number) => {
    onFiltersChange({
      ...filters,
      experience: {
        ...filters.experience,
        [field]: value,
      },
    });
  };

  const handleVerificationChange = (field: keyof typeof filters.verification, value: boolean) => {
    onFiltersChange({
      ...filters,
      verification: {
        ...filters.verification,
        [field]: value,
      },
    });
  };

  return (
    <div className="bg-white rounded-lg border border-[#e5e7eb] p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#735365]">Filters</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#735365] hover:text-[#fbb130] transition-colors"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#735365] mb-2">
            Required Skills
          </label>
          <InteractiveTagInput
            tags={filters.skills}
            onTagsChange={handleSkillChange}
            suggestions={SKILL_OPTIONS}
            placeholder="Add required skills..."
            maxTags={5}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#735365] mb-2">
            Experience
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#735365] mb-1">
                Minimum Years
              </label>
              <input
                type="number"
                value={filters.experience.minYears}
                onChange={(e) => handleExperienceChange('minYears', parseInt(e.target.value))}
                className="w-full p-2 border border-[#e5e7eb] rounded-md text-[#735365] focus:ring-2 focus:ring-[#fbb130]/20 focus:border-[#fbb130]"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm text-[#735365] mb-1">
                Startup Experience
              </label>
              <input
                type="number"
                value={filters.experience.minStartupYears}
                onChange={(e) => handleExperienceChange('minStartupYears', parseInt(e.target.value))}
                className="w-full p-2 border border-[#e5e7eb] rounded-md text-[#735365] focus:ring-2 focus:ring-[#fbb130]/20 focus:border-[#fbb130]"
                min="0"
              />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-[#735365] mb-2">
                  Verification Requirements
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.verification.requireSkillVerification}
                      onChange={(e) => handleVerificationChange('requireSkillVerification', e.target.checked)}
                      className="rounded border-[#e5e7eb] text-accent-gold focus:ring-accent-gold"
                    />
                    <span className="text-sm text-[#735365]">Skill Verification</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.verification.requireIdentityVerification}
                      onChange={(e) => handleVerificationChange('requireIdentityVerification', e.target.checked)}
                      className="rounded border-[#e5e7eb] text-accent-gold focus:ring-accent-gold"
                    />
                    <span className="text-sm text-[#735365]">Identity Verification</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.verification.requireRoleplayVerification}
                      onChange={(e) => handleVerificationChange('requireRoleplayVerification', e.target.checked)}
                      className="rounded border-[#e5e7eb] text-accent-gold focus:ring-accent-gold"
                    />
                    <span className="text-sm text-[#735365]">Roleplay Assessment</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#735365] mb-2">
                  Availability
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.availability.immediate}
                      onChange={(e) =>
                        onFiltersChange({
                          ...filters,
                          availability: {
                            ...filters.availability,
                            immediate: e.target.checked,
                          },
                        })
                      }
                      className="rounded border-[#e5e7eb] text-accent-gold focus:ring-accent-gold"
                    />
                    <span className="text-sm text-[#735365]">Immediate Start</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-[#735365]">Within</span>
                    <input
                      type="number"
                      value={filters.availability.withinWeeks}
                      onChange={(e) =>
                        onFiltersChange({
                          ...filters,
                          availability: {
                            ...filters.availability,
                            withinWeeks: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-16 p-2 border border-[#e5e7eb] rounded-md text-[#735365] focus:ring-2 focus:ring-[#fbb130]/20 focus:border-[#fbb130]"
                      min="1"
                    />
                    <span className="text-sm text-[#735365]">weeks</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    // Apply filters
                    onFiltersChange({...filters});
                  }}
                  className="w-full py-2 bg-[#fbb130] text-white rounded-md hover:bg-[#fbb130]/90 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 