import React, { useState } from 'react';
import { Tag } from '@/lib/types/search';
import InteractiveTagInput from '@/components/wizard/InteractiveTagInput';
import { ROLE_TITLES_TAGS, INDUSTRIES, TECHNICAL_SKILLS_EXPANDED as TECHNICAL_SKILLS, SOFT_SKILLS_EXPANDED as SOFT_SKILLS, BUSINESS_SKILLS } from '@/lib/utils/search';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface BasicCriteriaFormProps {
  formData: {
    roleTitle: string[];
    industry?: string;
    experienceLevel?: string;
    skills: Tag[];
    goal?: string;
    companyStage?: string;
    milestones: string[];
    culturalValues: string[];
    verification: {
      requireSkillVerification: boolean;
      requireIdentityVerification: boolean;
      requireRoleplayVerification: boolean;
    };
    location: {
      cities: string[];
      remoteOnly: boolean;
    };
  };
  handleChange: (field: string, value: any) => void;
}

export default function BasicCriteriaForm({
  formData,
  handleChange,
}: BasicCriteriaFormProps) {
  const [selectedRoleCategory, setSelectedRoleCategory] = useState<string | null>(null);

  // Combine all skill types for the InteractiveTagInput
  const allSkillOptions = [
    ...TECHNICAL_SKILLS,
    ...SOFT_SKILLS,
    ...BUSINESS_SKILLS
  ];

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const handleRoleTitleChange = (newTags: Tag[]) => {
    if (newTags.length === 0) {
      setSelectedRoleCategory(null);
      handleChange('roleTitle', []);
      return;
    }

    const newRoleCategory = newTags[0].category || null;
    
    // If this is the first role being selected, set the category
    if (!selectedRoleCategory) {
      setSelectedRoleCategory(newRoleCategory);
      handleChange('roleTitle', newTags.map(tag => tag.label));
      return;
    }

    // If trying to add a role from a different category, prevent it
    if (newRoleCategory !== selectedRoleCategory) {
      toast.error(`You can only select roles from the ${selectedRoleCategory} category`);
      return;
    }

    handleChange('roleTitle', newTags.map(tag => tag.label));
  };

  const handleSkillsChange = (newTags: Tag[]) => {
    handleChange('skills', newTags);
  };

  return (
    <div className="space-y-6">
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#e5e7eb] hover:border-[#1ad3bb]"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={0}
        whileHover={{ y: -5 }}
      >
        <label className="block text-[#043444] font-medium mb-2 text-lg">
          Role Title <span className="text-red-500">*</span>
        </label>
        <InteractiveTagInput
          tags={(formData.roleTitle || []).map(title => ({
            id: title.toLowerCase().replace(/\s+/g, '-'),
            label: title,
            category: selectedRoleCategory || ''
          }))}
          onTagsChange={handleRoleTitleChange}
          suggestions={ROLE_TITLES_TAGS}
          placeholder="Select role titles..."
          maxTags={5}
          allowCustom={false}
        />
        {selectedRoleCategory && (
          <p className="mt-1 text-sm text-gray-500">
            Selected category: {selectedRoleCategory}
          </p>
        )}
        <p className="mt-3 text-sm text-[#735365]">
          Choose the specific role you're hiring for. This helps us match candidates with the right title and expertise.
        </p>
      </motion.div>

      <motion.div 
        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#e5e7eb] hover:border-[#1ad3bb]"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={1}
        whileHover={{ y: -5 }}
      >
        <label htmlFor="industry" className="block text-[#043444] font-medium mb-2 text-lg">
          Industry
        </label>
        <select
          id="industry"
          value={formData.industry || ''}
          onChange={(e) => handleChange('industry', e.target.value)}
          className="w-full p-3 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#1ad3bb] focus:border-[#1ad3bb] transition-all duration-200"
        >
          <option value="">Select an industry</option>
          {INDUSTRIES.map(industry => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>
        <p className="mt-3 text-sm text-[#735365]">
          Specify your company's industry to find candidates with relevant domain experience and knowledge.
        </p>
      </motion.div>

      <motion.div 
        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#e5e7eb] hover:border-[#1ad3bb]"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={2}
        whileHover={{ y: -5 }}
      >
        <label htmlFor="experienceLevel" className="block text-[#043444] font-medium mb-2 text-lg">
          Experience Level
        </label>
        <select
          id="experienceLevel"
          value={formData.experienceLevel || ''}
          onChange={(e) => handleChange('experienceLevel', e.target.value)}
          className="w-full p-3 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#1ad3bb] focus:border-[#1ad3bb] transition-all duration-200"
        >
          <option value="">Select experience level</option>
          <option value="entry">Entry Level (0-2 years)</option>
          <option value="mid">Mid Level (2-5 years)</option>
          <option value="senior">Senior Level (5-8 years)</option>
          <option value="lead">Lead (8+ years)</option>
        </select>
        <p className="mt-3 text-sm text-[#735365]">
          Select the experience level you're targeting. This helps match candidates with appropriate career stage and expertise.
        </p>
      </motion.div>

      <motion.div 
        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#e5e7eb] hover:border-[#1ad3bb]"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={3}
        whileHover={{ y: -5 }}
      >
        <label className="block text-[#043444] font-medium mb-2 text-lg">
          Skills (Select up to 5)
        </label>
        <InteractiveTagInput
          tags={formData.skills || []}
          onTagsChange={handleSkillsChange}
          placeholder="Type to search for skills..."
          suggestions={allSkillOptions}
          maxTags={5}
        />
        <p className="mt-3 text-sm text-[#735365]">
          Add skills that are crucial for this role. Include both technical and soft skills to find well-rounded candidates.
        </p>
      </motion.div>
    </div>
  );
} 