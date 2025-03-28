import React from 'react';
import { Tag } from '@/lib/types/search';
import InteractiveTagInput from '@/components/wizard/InteractiveTagInput';
import { 
  COMPANY_STAGES, 
  HIRING_CONTEXT_ACCOMPLISHMENTS, 
  HIRING_CONTEXT_GOALS, 
  HIRING_CONTEXT_MILESTONES 
} from '@/lib/utils/search';
import { motion } from 'framer-motion';

interface HiringContextFormProps {
  formData: {
    companyStage?: string;
    accomplishments: string[];
    goals: string[];
    milestones: string[];
  };
  handleChange: (field: string, value: any) => void;
}

export default function HiringContextForm({
  formData,
  handleChange,
}: HiringContextFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Stage
        </label>
        <select
          value={formData.companyStage || ''}
          onChange={(e) => handleChange('companyStage', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-blue focus:ring-accent-blue sm:text-sm"
        >
          <option value="">Select company stage</option>
          {COMPANY_STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Accomplishments
        </label>
        <InteractiveTagInput
          tags={(formData.accomplishments || []).map(accomplishment => ({
            id: accomplishment.toLowerCase().replace(/\s+/g, '-'),
            label: accomplishment
          }))}
          onTagsChange={(tags) => handleChange('accomplishments', tags.map(tag => tag.label))}
          suggestions={HIRING_CONTEXT_ACCOMPLISHMENTS.map(accomplishment => ({
            id: accomplishment.toLowerCase().replace(/\s+/g, '-'),
            label: accomplishment
          }))}
          placeholder="Select accomplishments..."
          maxTags={5}
          allowCustom={false}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Goals
        </label>
        <InteractiveTagInput
          tags={(formData.goals || []).map(goal => ({
            id: goal.toLowerCase().replace(/\s+/g, '-'),
            label: goal
          }))}
          onTagsChange={(tags) => handleChange('goals', tags.map(tag => tag.label))}
          suggestions={HIRING_CONTEXT_GOALS.map(goal => ({
            id: goal.toLowerCase().replace(/\s+/g, '-'),
            label: goal
          }))}
          placeholder="Select goals..."
          maxTags={5}
          allowCustom={false}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Milestones
        </label>
        <InteractiveTagInput
          tags={(formData.milestones || []).map(milestone => ({
            id: milestone.toLowerCase().replace(/\s+/g, '-'),
            label: milestone
          }))}
          onTagsChange={(tags) => handleChange('milestones', tags.map(tag => tag.label))}
          suggestions={HIRING_CONTEXT_MILESTONES.map(milestone => ({
            id: milestone.toLowerCase().replace(/\s+/g, '-'),
            label: milestone
          }))}
          placeholder="Select milestones..."
          maxTags={5}
          allowCustom={false}
        />
      </div>
    </div>
  );
} 