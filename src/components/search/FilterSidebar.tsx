import { SearchWizardData } from '@/lib/types/search';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import InteractiveTagInput from '@/components/wizard/InteractiveTagInput';
import { HIRING_GOAL_SUGGESTIONS, MILESTONE_SUGGESTIONS, ACCOMPLISHMENT_SUGGESTIONS, CULTURAL_VALUE_SUGGESTIONS } from '@/lib/data/form-options';
import { cn } from '@/lib/utils';

interface Tag {
  id: string;
  label: string;
}

interface InteractiveTagInputProps {
  tags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  suggestions?: Array<{ id: string; label: string; category?: string }>;
  placeholder?: string;
  maxTags?: number;
  className?: string;
}

interface SavedSearch {
  id: string;
  name: string;
  criteria: SearchWizardData;
}

interface FilterSidebarProps {
  filters: {
    roleTitle: string[];
    industry: string;
    experienceLevel: string;
    skills: string[];
    goal: string;
    companyStage: string;
    milestones: string[];
    accomplishments: string[];
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
  onFilterChange: (filters: any) => void;
  savedSearches: SavedSearch[];
  onLoadSearch: (searchId: string) => void;
  onSaveSearch: () => void;
}

export function FilterSidebar({
  filters,
  onFilterChange,
  savedSearches,
  onLoadSearch,
  onSaveSearch,
}: FilterSidebarProps) {
  const handleFilterChange = (key: string, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const handleVerificationChange = (key: string, value: boolean) => {
    onFilterChange({
      ...filters,
      verification: {
        ...filters.verification,
        [key]: value,
      },
    });
  };

  const handleLocationChange = (key: string, value: any) => {
    onFilterChange({
      ...filters,
      location: {
        ...filters.location,
        [key]: value,
      },
    });
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-gray-8 p-6 space-y-6")}>
      <div>
        <h3 className="text-lg font-medium text-mauve-11 mb-4">Saved Searches</h3>
        <div className="space-y-2">
          <Select onChange={onLoadSearch}>
            <SelectTrigger>
              <SelectValue placeholder="Select a saved search" />
            </SelectTrigger>
            <SelectContent>
              {savedSearches.map(search => (
                <SelectItem key={search.id} value={search.id}>
                  <span className="text-mauve-11">{search.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="w-full bg-gold-9 text-white hover:bg-gold-10 transition-colors"
            onClick={onSaveSearch}
          >
            Save Current Search
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-mauve-11 mb-4">Basic Criteria</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-mauve-11 mb-1">
              Role Title
            </label>
            <Select
              value={filters.roleTitle[0] || ''}
              onChange={(e) => onFilterChange('roleTitle', [e.target.value])}
            >
              <option value="">Select role title</option>
              {/* Add your role title options here */}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-mauve-11 mb-1">
              Industry
            </label>
            <Input
              value={filters.industry}
              onChange={(e) => handleFilterChange('industry', e.target.value)}
              placeholder="e.g., Fintech"
              className="border-mauve-7 text-mauve-11 placeholder:text-mauve-9"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mauve-11 mb-1">
              Experience Level
            </label>
            <Select
              value={filters.experienceLevel}
              onValueChange={(value) => handleFilterChange('experienceLevel', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="mid">Mid Level</SelectItem>
                <SelectItem value="senior">Senior Level</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-mauve-11 mb-1">
              Skills
            </label>
            <InteractiveTagInput
              tags={filters.skills.map(skill => ({ id: skill, label: skill }))}
              onTagsChange={(tags) => handleFilterChange('skills', tags.map(t => t.label))}
              placeholder="Add skills"
              maxTags={5}
              suggestions={[]}
              className="border-mauve-7 text-mauve-11"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-mauve-11 mb-4">Hiring Context</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-mauve-11 mb-1">
              Hiring Goal
            </label>
            <InteractiveTagInput
              tags={filters.goal ? [{ id: filters.goal, label: filters.goal }] : []}
              onTagsChange={(tags) => handleFilterChange('goal', tags[0]?.label || '')}
              suggestions={HIRING_GOAL_SUGGESTIONS}
              placeholder="Select hiring goal"
              maxTags={1}
              className="border-mauve-7 text-mauve-11"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mauve-11 mb-1">
              Company Stage
            </label>
            <Select
              value={filters.companyStage}
              onValueChange={(value) => handleFilterChange('companyStage', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select company stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seed">Seed</SelectItem>
                <SelectItem value="seriesA">Series A</SelectItem>
                <SelectItem value="seriesB">Series B</SelectItem>
                <SelectItem value="seriesC">Series C</SelectItem>
                <SelectItem value="seriesD">Series D+</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-mauve-11 mb-1">
              Milestones
            </label>
            <InteractiveTagInput
              tags={filters.milestones.map(milestone => ({ id: milestone, label: milestone }))}
              onTagsChange={(tags) => handleFilterChange('milestones', tags.map(t => t.label))}
              suggestions={MILESTONE_SUGGESTIONS}
              placeholder="Add milestones"
              maxTags={3}
              className="border-mauve-7 text-mauve-11"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mauve-11 mb-1">
              Achievements
            </label>
            <InteractiveTagInput
              tags={filters.accomplishments.map(achievement => ({ id: achievement, label: achievement }))}
              onTagsChange={(tags) => handleFilterChange('accomplishments', tags.map(t => t.label))}
              suggestions={ACCOMPLISHMENT_SUGGESTIONS}
              placeholder="Add achievements"
              maxTags={3}
              className="border-mauve-7 text-mauve-11"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mauve-11 mb-1">
              Cultural Values
            </label>
            <InteractiveTagInput
              tags={filters.culturalValues.map(value => ({ id: value, label: value }))}
              onTagsChange={(tags) => handleFilterChange('culturalValues', tags.map(t => t.label))}
              suggestions={CULTURAL_VALUE_SUGGESTIONS}
              placeholder="Add cultural values"
              maxTags={3}
              className="border-mauve-7 text-mauve-11"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-mauve-11 mb-4">Verification Requirements</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <Checkbox
              id="skillVerification"
              checked={filters.verification.requireSkillVerification}
              onCheckedChange={(checked) => handleVerificationChange('requireSkillVerification', checked as boolean)}
              className="border-mauve-7 data-[state=checked]:bg-gold-9 data-[state=checked]:border-gold-9"
            />
            <label htmlFor="skillVerification" className="ml-2 text-sm text-mauve-11">
              Require Skill Verification
            </label>
          </div>

          <div className="flex items-center">
            <Checkbox
              id="identityVerification"
              checked={filters.verification.requireIdentityVerification}
              onCheckedChange={(checked) => handleVerificationChange('requireIdentityVerification', checked as boolean)}
              className="border-mauve-7 data-[state=checked]:bg-gold-9 data-[state=checked]:border-gold-9"
            />
            <label htmlFor="identityVerification" className="ml-2 text-sm text-mauve-11">
              Require Identity Verification
            </label>
          </div>

          <div className="flex items-center">
            <Checkbox
              id="roleplayVerification"
              checked={filters.verification.requireRoleplayVerification}
              onCheckedChange={(checked) => handleVerificationChange('requireRoleplayVerification', checked as boolean)}
              className="border-mauve-7 data-[state=checked]:bg-gold-9 data-[state=checked]:border-gold-9"
            />
            <label htmlFor="roleplayVerification" className="ml-2 text-sm text-mauve-11">
              Require Roleplay Verification
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-mauve-11 mb-4">Location</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-mauve-11 mb-1">
              Cities
            </label>
            <InteractiveTagInput
              tags={filters.location.cities.map(city => ({ id: city, label: city }))}
              onTagsChange={(tags) => handleLocationChange('cities', tags.map(t => t.label))}
              placeholder="Add cities"
              maxTags={3}
              suggestions={[]}
              className="border-mauve-7 text-mauve-11"
            />
          </div>

          <div className="flex items-center">
            <Checkbox
              id="remoteOnly"
              checked={filters.location.remoteOnly}
              onCheckedChange={(checked) => handleLocationChange('remoteOnly', checked as boolean)}
              className="border-mauve-7 data-[state=checked]:bg-gold-9 data-[state=checked]:border-gold-9"
            />
            <label htmlFor="remoteOnly" className="ml-2 text-sm text-mauve-11">
              Remote Only
            </label>
          </div>
        </div>
      </div>
    </div>
  );
} 