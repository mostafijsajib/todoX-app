import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  addSubject as addSubjectAction,
  updateSubject as updateSubjectAction,
  deleteSubject as deleteSubjectAction,
  setSubjects,
  setLoading,
  setError,
} from '../store/Subject/subject';
import { storeDataLocalStorage, getDataLocalStorage } from '../utils/storage';
import { CustomAlert } from '../components/UI/CustomAlert';

// Storage key for subjects
export const SUBJECT_STORAGE_KEY = 'subjects';

/**
 * Custom hook for managing subjects with Redux and AsyncStorage synchronization
 * Provides CRUD operations that automatically sync between Redux store and local storage
 */
const useSubjects = () => {
  const dispatch = useDispatch();

  // Get subject state from Redux store
  const { subjects, loading, error } = useSelector((state) => state.subject);

  // Also get related data for dependency validation
  const tasks = useSelector((state) => state.task.task_list);
  const exams = useSelector((state) => state.exam.exams);
  const studyBlocks = useSelector((state) => state.schedule.study_blocks);

  /**
   * Load subjects from AsyncStorage into Redux store
   */
  const loadSubjectsFromStorage = useCallback(async () => {
    try {
      const storedSubjects = await getDataLocalStorage(SUBJECT_STORAGE_KEY);
      dispatch(setSubjects(storedSubjects || []));
      return storedSubjects || [];
    } catch (error) {
      console.error('Error loading subjects from storage:', error);
      dispatch(setError('Failed to load subjects'));
      return [];
    }
  }, [dispatch]);

  /**
   * Save subjects to AsyncStorage
   */
  const saveSubjectsToStorage = useCallback(
    async (subjectsToSave) => {
      try {
        await storeDataLocalStorage(SUBJECT_STORAGE_KEY, subjectsToSave);
        return true;
      } catch (error) {
        console.error('Error saving subjects to storage:', error);
        dispatch(setError('Failed to save subjects to storage'));
        return false;
      }
    },
    [dispatch]
  );

  /**
   * Validate if a subject can be deleted (no dependencies)
   * Returns object with canDelete flag and dependency counts
   */
  const canDeleteSubject = useCallback(
    (subjectId) => {
      const dependentTasks = tasks.filter((t) => t.subjectId === subjectId);
      const dependentExams = exams.filter((e) => e.subjectId === subjectId);
      const dependentBlocks = studyBlocks.filter(
        (b) => b.subjectId === subjectId
      );

      return {
        canDelete:
          dependentTasks.length === 0 &&
          dependentExams.length === 0 &&
          dependentBlocks.length === 0,
        taskCount: dependentTasks.length,
        examCount: dependentExams.length,
        blockCount: dependentBlocks.length,
      };
    },
    [tasks, exams, studyBlocks]
  );

  /**
   * Add a new subject
   */
  const addSubject = useCallback(
    async (subjectData) => {
      try {
        dispatch(setLoading(true));

        // Create new subject with proper data structure
        const newSubject = {
          id: subjectData.id || `subject-${Date.now()}`,
          name: subjectData.name,
          color: subjectData.color,
          icon: subjectData.icon || 'book-outline',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Get updated subject list (including the new subject)
        const updatedSubjects = [...subjects, newSubject];

        // Save to AsyncStorage first
        const success = await saveSubjectsToStorage(updatedSubjects);

        if (success) {
          // Update Redux store only after successful storage
          dispatch(addSubjectAction(newSubject));
          dispatch(setError(null));
          return { success: true, subject: newSubject };
        }

        return { success: false, error: 'Failed to save to storage' };
      } catch (error) {
        console.error('Error adding subject:', error);
        dispatch(setError('Failed to add subject'));
        return { success: false, error: error.message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, subjects, saveSubjectsToStorage]
  );

  /**
   * Update an existing subject
   */
  const updateSubject = useCallback(
    async (subjectId, updates) => {
      try {
        dispatch(setLoading(true));

        const subjectIndex = subjects.findIndex((s) => s.id === subjectId);

        if (subjectIndex === -1) {
          throw new Error('Subject not found');
        }

        // Create updated subject
        const updatedSubject = {
          ...subjects[subjectIndex],
          ...updates,
          updated_at: new Date().toISOString(),
        };

        // Create new subjects array with the update
        const updatedSubjects = [...subjects];
        updatedSubjects[subjectIndex] = updatedSubject;

        // Save to AsyncStorage first
        const success = await saveSubjectsToStorage(updatedSubjects);

        if (success) {
          // Update Redux store
          dispatch(updateSubjectAction(updatedSubject));
          dispatch(setError(null));
          return { success: true, subject: updatedSubject };
        }

        return { success: false, error: 'Failed to save to storage' };
      } catch (error) {
        console.error('Error updating subject:', error);
        dispatch(setError('Failed to update subject'));
        return { success: false, error: error.message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, subjects, saveSubjectsToStorage]
  );

  /**
   * Delete a subject (with dependency validation)
   */
  const deleteSubject = useCallback(
    async (subjectId) => {
      try {
        dispatch(setLoading(true));

        // Validate no dependencies
        const validation = canDeleteSubject(subjectId);

        if (!validation.canDelete) {
          // Build dependency message
          const dependencyParts = [];
          if (validation.taskCount > 0) {
            dependencyParts.push(
              `${validation.taskCount} task${validation.taskCount > 1 ? 's' : ''}`
            );
          }
          if (validation.examCount > 0) {
            dependencyParts.push(
              `${validation.examCount} exam${validation.examCount > 1 ? 's' : ''}`
            );
          }
          if (validation.blockCount > 0) {
            dependencyParts.push(
              `${validation.blockCount} study block${
                validation.blockCount > 1 ? 's' : ''
              }`
            );
          }

          const subject = subjects.find((s) => s.id === subjectId);
          const errorMessage = `Cannot delete ${
            subject?.name || 'this subject'
          } - ${dependencyParts.join(', ')} depend on it.\n\nPlease reassign or delete dependent items first.`;

          // Show alert to user
          CustomAlert({
            title: 'Cannot Delete Subject',
            message: errorMessage,
            buttons: [{ text: 'OK' }],
          });

          return {
            success: false,
            error: errorMessage,
            validation,
          };
        }

        // Remove subject from list
        const updatedSubjects = subjects.filter((s) => s.id !== subjectId);

        // Save to AsyncStorage first
        const success = await saveSubjectsToStorage(updatedSubjects);

        if (success) {
          // Update Redux store
          dispatch(deleteSubjectAction(subjectId));
          dispatch(setError(null));
          return { success: true };
        }

        return { success: false, error: 'Failed to save to storage' };
      } catch (error) {
        console.error('Error deleting subject:', error);
        dispatch(setError('Failed to delete subject'));
        return { success: false, error: error.message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, subjects, saveSubjectsToStorage, canDeleteSubject]
  );

  /**
   * Get subject by ID
   */
  const getSubjectById = useCallback(
    (subjectId) => {
      return subjects.find((s) => s.id === subjectId);
    },
    [subjects]
  );

  return {
    // State
    subjects,
    loading,
    error,

    // CRUD operations
    loadSubjectsFromStorage,
    addSubject,
    updateSubject,
    deleteSubject,

    // Utility functions
    getSubjectById,
    canDeleteSubject,
  };
};

export default useSubjects;
