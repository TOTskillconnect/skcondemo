import { SearchWizardData } from '@/lib/types/search';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateBasicCriteria(data: SearchWizardData): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.basicCriteria.roleTitle.trim()) {
    errors.push({
      field: 'roleTitle',
      message: 'Please select a role',
    });
  }

  if (!data.basicCriteria.industry.trim()) {
    errors.push({
      field: 'industry',
      message: 'Please select an industry',
    });
  }

  if (!data.basicCriteria.experienceLevel.trim()) {
    errors.push({
      field: 'experienceLevel',
      message: 'Please select experience level',
    });
  }

  if (data.basicCriteria.skills.length === 0) {
    errors.push({
      field: 'skills',
      message: 'Please add at least one required skill',
    });
  }

  return errors;
}

export function validateHiringContext(data: SearchWizardData): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.hiringContext.goal) {
    errors.push({
      field: 'goal',
      message: 'Please add a hiring goal',
    });
  }

  if (!data.hiringContext.companyStage.trim()) {
    errors.push({
      field: 'companyStage',
      message: 'Please select company stage',
    });
  }

  if (data.hiringContext.milestones.length === 0) {
    errors.push({
      field: 'milestones',
      message: 'Please add at least one key milestone',
    });
  }

  if (data.hiringContext.accomplishments.length === 0) {
    errors.push({
      field: 'accomplishments',
      message: 'Please add at least one expected accomplishment',
    });
  }

  if (data.hiringContext.culturalValues.length === 0) {
    errors.push({
      field: 'culturalValues',
      message: 'Please add at least one cultural value',
    });
  }

  return errors;
}

export function validateStep(step: number, data: SearchWizardData): ValidationError[] {
  const errors: ValidationError[] = [];

  switch (step) {
    case 0:
      if (!data.basicCriteria.roleTitle) {
        errors.push({
          field: 'roleTitle',
          message: 'Please select a role/position',
        });
      }
      if (!data.basicCriteria.industry) {
        errors.push({
          field: 'industry',
          message: 'Please select an industry',
        });
      }
      if (!data.basicCriteria.experienceLevel) {
        errors.push({
          field: 'experienceLevel',
          message: 'Please select an experience level',
        });
      }
      if (data.basicCriteria.skills.length === 0) {
        errors.push({
          field: 'skills',
          message: 'Please add at least one required skill',
        });
      }
      break;

    case 1:
      if (!data.hiringContext.goal) {
        errors.push({
          field: 'goal',
          message: 'Please add a hiring goal',
        });
      }
      if (!data.hiringContext.companyStage) {
        errors.push({
          field: 'companyStage',
          message: 'Please select your company stage',
        });
      }
      if (data.hiringContext.milestones.length === 0) {
        errors.push({
          field: 'milestones',
          message: 'Please add at least one key milestone',
        });
      }
      if (data.hiringContext.accomplishments.length === 0) {
        errors.push({
          field: 'accomplishments',
          message: 'Please add at least one expected accomplishment',
        });
      }
      if (data.hiringContext.culturalValues.length === 0) {
        errors.push({
          field: 'culturalValues',
          message: 'Please add at least one cultural value',
        });
      }
      break;
  }

  return errors;
} 