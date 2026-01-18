/**
 * useToastOperations Hook
 * Wraps async operations with toast notifications for success/error feedback
 */
import { useCallback } from 'react';
import { useToast } from '../components/UI';

/**
 * Custom hook that wraps async operations with toast notifications
 * Provides a consistent way to show feedback for CRUD operations
 */
const useToastOperations = () => {
  const toast = useToast();

  /**
   * Wrap an async operation with toast notifications
   * @param {Function} operation - Async function to execute
   * @param {Object} options - Configuration options
   * @param {string} options.successMessage - Message to show on success
   * @param {string} options.errorMessage - Message to show on error
   * @param {boolean} options.showSuccess - Whether to show success toast (default: true)
   * @param {boolean} options.showError - Whether to show error toast (default: true)
   */
  const withToast = useCallback(
    async (operation, options = {}) => {
      const {
        successMessage = 'Operation completed successfully',
        errorMessage = 'An error occurred',
        showSuccess = true,
        showError = true,
      } = options;

      try {
        const result = await operation();
        
        // Check for success in result object (for hooks that return { success: boolean })
        if (result && typeof result === 'object' && 'success' in result) {
          if (result.success && showSuccess) {
            toast.success(successMessage);
          } else if (!result.success && showError) {
            toast.error(result.error || errorMessage);
          }
          return result;
        }
        
        // For simple boolean returns or truthy values
        if (result && showSuccess) {
          toast.success(successMessage);
        }
        
        return result;
      } catch (error) {
        if (showError) {
          toast.error(error.message || errorMessage);
        }
        throw error;
      }
    },
    [toast]
  );

  /**
   * Task-specific operation helpers
   */
  const taskOperations = {
    add: (operation) =>
      withToast(operation, {
        successMessage: 'Task created successfully',
        errorMessage: 'Failed to create task',
      }),
    update: (operation) =>
      withToast(operation, {
        successMessage: 'Task updated successfully',
        errorMessage: 'Failed to update task',
      }),
    delete: (operation) =>
      withToast(operation, {
        successMessage: 'Task deleted successfully',
        errorMessage: 'Failed to delete task',
      }),
    complete: (operation) =>
      withToast(operation, {
        successMessage: 'Task completed! 🎉',
        errorMessage: 'Failed to complete task',
      }),
    restore: (operation) =>
      withToast(operation, {
        successMessage: 'Task restored',
        errorMessage: 'Failed to restore task',
      }),
  };

  /**
   * Subject-specific operation helpers
   */
  const subjectOperations = {
    add: (operation) =>
      withToast(operation, {
        successMessage: 'Subject created successfully',
        errorMessage: 'Failed to create subject',
      }),
    update: (operation) =>
      withToast(operation, {
        successMessage: 'Subject updated successfully',
        errorMessage: 'Failed to update subject',
      }),
    delete: (operation) =>
      withToast(operation, {
        successMessage: 'Subject deleted successfully',
        errorMessage: 'Failed to delete subject',
      }),
  };

  /**
   * Exam-specific operation helpers
   */
  const examOperations = {
    add: (operation) =>
      withToast(operation, {
        successMessage: 'Exam scheduled successfully',
        errorMessage: 'Failed to schedule exam',
      }),
    update: (operation) =>
      withToast(operation, {
        successMessage: 'Exam updated successfully',
        errorMessage: 'Failed to update exam',
      }),
    delete: (operation) =>
      withToast(operation, {
        successMessage: 'Exam deleted successfully',
        errorMessage: 'Failed to delete exam',
      }),
  };

  /**
   * Schedule/Timetable-specific operation helpers
   */
  const scheduleOperations = {
    add: (operation) =>
      withToast(operation, {
        successMessage: 'Study block added successfully',
        errorMessage: 'Failed to add study block',
      }),
    update: (operation) =>
      withToast(operation, {
        successMessage: 'Study block updated successfully',
        errorMessage: 'Failed to update study block',
      }),
    delete: (operation) =>
      withToast(operation, {
        successMessage: 'Study block deleted successfully',
        errorMessage: 'Failed to delete study block',
      }),
  };

  return {
    withToast,
    toast,
    taskOperations,
    subjectOperations,
    examOperations,
    scheduleOperations,
  };
};

export default useToastOperations;
