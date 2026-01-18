/**
 * Form Validation Utilities
 * Shared validation functions for forms across the app
 */

/**
 * Validation result type
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether validation passed
 * @property {string|null} error - Error message if validation failed
 */

/**
 * Validate required field
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {ValidationResult}
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || !value.toString().trim()) {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }
  return { isValid: true, error: null };
};

/**
 * Validate minimum length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length required
 * @param {string} fieldName - Name of the field for error message
 * @returns {ValidationResult}
 */
export const validateMinLength = (value, minLength, fieldName = 'Field') => {
  if (value && value.toString().trim().length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    };
  }
  return { isValid: true, error: null };
};

/**
 * Validate maximum length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length allowed
 * @param {string} fieldName - Name of the field for error message
 * @returns {ValidationResult}
 */
export const validateMaxLength = (value, maxLength, fieldName = 'Field') => {
  if (value && value.toString().trim().length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must be no more than ${maxLength} characters`,
    };
  }
  return { isValid: true, error: null };
};

/**
 * Validate date is not in the past
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @param {string} fieldName - Name of the field for error message
 * @param {boolean} allowToday - Whether today's date is allowed
 * @returns {ValidationResult}
 */
export const validateFutureDate = (dateString, fieldName = 'Date', allowToday = true) => {
  const inputDate = new Date(dateString);
  const today = new Date();
  
  // Reset time components for date-only comparison
  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  if (allowToday) {
    if (inputDate < today) {
      return {
        isValid: false,
        error: `${fieldName} cannot be in the past`,
      };
    }
  } else {
    if (inputDate <= today) {
      return {
        isValid: false,
        error: `${fieldName} must be in the future`,
      };
    }
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate time format (HH:mm)
 * @param {string} timeString - Time string
 * @param {string} fieldName - Name of the field for error message
 * @returns {ValidationResult}
 */
export const validateTimeFormat = (timeString, fieldName = 'Time') => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
  if (!timeRegex.test(timeString)) {
    return {
      isValid: false,
      error: `${fieldName} must be in HH:mm format`,
    };
  }
  return { isValid: true, error: null };
};

/**
 * Validate end time is after start time
 * @param {string} startTime - Start time in HH:mm format
 * @param {string} endTime - End time in HH:mm format
 * @returns {ValidationResult}
 */
export const validateTimeRange = (startTime, endTime) => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  
  if (endTotalMinutes <= startTotalMinutes) {
    return {
      isValid: false,
      error: 'End time must be after start time',
    };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate positive number
 * @param {number} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {ValidationResult}
 */
export const validatePositiveNumber = (value, fieldName = 'Value') => {
  if (typeof value !== 'number' || value <= 0) {
    return {
      isValid: false,
      error: `${fieldName} must be a positive number`,
    };
  }
  return { isValid: true, error: null };
};

/**
 * Run multiple validations and return first error or success
 * @param {ValidationResult[]} validations - Array of validation results
 * @returns {ValidationResult}
 */
export const combineValidations = (...validations) => {
  for (const validation of validations) {
    if (!validation.isValid) {
      return validation;
    }
  }
  return { isValid: true, error: null };
};

/**
 * Exam form validation
 */
export const validateExamForm = (formData, subjects = []) => {
  const errors = {};
  
  // Title validation
  const titleValidation = combineValidations(
    validateRequired(formData.title, 'Exam title'),
    validateMinLength(formData.title, 2, 'Exam title'),
    validateMaxLength(formData.title, 100, 'Exam title')
  );
  if (!titleValidation.isValid) errors.title = titleValidation.error;
  
  // Subject validation
  if (!formData.subjectId) {
    errors.subject = 'Please select a subject';
  } else {
    const subjectExists = subjects.some(s => s.id === formData.subjectId);
    if (!subjectExists) {
      errors.subject = 'Selected subject no longer exists';
    }
  }
  
  // Date validation
  const dateValidation = validateFutureDate(formData.date, 'Exam date');
  if (!dateValidation.isValid) errors.date = dateValidation.error;
  
  // Duration validation
  if (formData.duration <= 0 || formData.duration > 600) {
    errors.duration = 'Duration must be between 1 and 600 minutes';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Subject form validation
 */
export const validateSubjectForm = (formData, existingSubjects = [], currentSubjectId = null) => {
  const errors = {};
  
  // Name validation
  const nameValidation = combineValidations(
    validateRequired(formData.name, 'Subject name'),
    validateMinLength(formData.name, 2, 'Subject name'),
    validateMaxLength(formData.name, 30, 'Subject name')
  );
  if (!nameValidation.isValid) errors.name = nameValidation.error;
  
  // Check for duplicate names (case-insensitive)
  if (formData.name) {
    const normalizedName = formData.name.trim().toLowerCase();
    const duplicate = existingSubjects.find(
      s => s.id !== currentSubjectId && s.name.trim().toLowerCase() === normalizedName
    );
    if (duplicate) {
      errors.name = 'A subject with this name already exists';
    }
  }
  
  // Color validation
  if (!formData.color) {
    errors.color = 'Please select a color';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Task form validation
 */
export const validateTaskForm = (formData) => {
  const errors = {};
  
  // Title validation
  const titleValidation = combineValidations(
    validateRequired(formData.title, 'Task title'),
    validateMinLength(formData.title, 2, 'Task title'),
    validateMaxLength(formData.title, 200, 'Task title')
  );
  if (!titleValidation.isValid) errors.title = titleValidation.error;
  
  // Time range validation (if both times provided)
  if (formData.startTime && formData.endTime) {
    const timeValidation = validateTimeRange(formData.startTime, formData.endTime);
    if (!timeValidation.isValid) errors.time = timeValidation.error;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Study block form validation
 */
export const validateStudyBlockForm = (formData) => {
  const errors = {};
  
  // Subject validation
  if (!formData.subjectId) {
    errors.subject = 'Please select a subject';
  }
  
  // Day validation
  if (formData.dayOfWeek === undefined || formData.dayOfWeek < 0 || formData.dayOfWeek > 6) {
    errors.day = 'Please select a valid day';
  }
  
  // Time validation
  if (!formData.startTime || !formData.endTime) {
    errors.time = 'Please set start and end times';
  } else {
    const timeValidation = validateTimeRange(formData.startTime, formData.endTime);
    if (!timeValidation.isValid) errors.time = timeValidation.error;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateFutureDate,
  validateTimeFormat,
  validateTimeRange,
  validatePositiveNumber,
  combineValidations,
  validateExamForm,
  validateSubjectForm,
  validateTaskForm,
  validateStudyBlockForm,
};
