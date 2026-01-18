import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  addExam as addExamAction,
  updateExam as updateExamAction,
  deleteExam as deleteExamAction,
  linkTaskToExam as linkTaskToExamAction,
  unlinkTaskFromExam as unlinkTaskFromExamAction,
  setExams,
  setLoading,
  setError,
} from '../store/Exam/exam';
import { storeDataLocalStorage, getDataLocalStorage } from '../utils/storage';

// Storage key for exams
export const EXAM_STORAGE_KEY = 'exams';

/**
 * Custom hook for managing exams with Redux and AsyncStorage synchronization
 * Provides CRUD operations and exam-specific utilities
 */
const useExams = () => {
  const dispatch = useDispatch();

  // Get exam state from Redux store
  const { exams, loading, error } = useSelector((state) => state.exam);

  // Get tasks for progress calculation
  const tasks = useSelector((state) => state.task.task_list);

  /**
   * Load exams from AsyncStorage into Redux store
   */
  const loadExamsFromStorage = useCallback(async () => {
    try {
      const storedExams = await getDataLocalStorage(EXAM_STORAGE_KEY);
      dispatch(setExams(storedExams || []));
      return storedExams || [];
    } catch (error) {
      console.error('Error loading exams from storage:', error);
      dispatch(setError('Failed to load exams'));
      return [];
    }
  }, [dispatch]);

  /**
   * Save exams to AsyncStorage
   */
  const saveExamsToStorage = useCallback(
    async (examsToSave) => {
      try {
        await storeDataLocalStorage(EXAM_STORAGE_KEY, examsToSave);
        return true;
      } catch (error) {
        console.error('Error saving exams to storage:', error);
        dispatch(setError('Failed to save exams to storage'));
        return false;
      }
    },
    [dispatch]
  );

  /**
   * Add a new exam
   */
  const addExam = useCallback(
    async (examData) => {
      try {
        dispatch(setLoading(true));

        // Create new exam with proper data structure
        const newExam = {
          id: examData.id || `exam-${Date.now()}`,
          title: examData.title,
          subjectId: examData.subjectId,
          date: examData.date,
          time: examData.time || '09:00',
          duration: examData.duration || 60,
          location: examData.location || '',
          topics: examData.topics || [],
          notes: examData.notes || '',
          linkedTaskIds: examData.linkedTaskIds || [],
          reminderEnabled: examData.reminderEnabled || false,
          reminderTime: examData.reminderTime || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Get updated exam list
        const updatedExams = [...exams, newExam];

        // Save to AsyncStorage first
        const success = await saveExamsToStorage(updatedExams);

        if (success) {
          // Update Redux store
          dispatch(addExamAction(newExam));
          dispatch(setError(null));
          return { success: true, exam: newExam };
        }

        return { success: false, error: 'Failed to save to storage' };
      } catch (error) {
        console.error('Error adding exam:', error);
        dispatch(setError('Failed to add exam'));
        return { success: false, error: error.message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, exams, saveExamsToStorage]
  );

  /**
   * Update an existing exam
   */
  const updateExam = useCallback(
    async (examId, updates) => {
      try {
        dispatch(setLoading(true));

        const examIndex = exams.findIndex((e) => e.id === examId);

        if (examIndex === -1) {
          throw new Error('Exam not found');
        }

        // Create updated exam
        const updatedExam = {
          ...exams[examIndex],
          ...updates,
          updated_at: new Date().toISOString(),
        };

        // Create new exams array with the update
        const updatedExams = [...exams];
        updatedExams[examIndex] = updatedExam;

        // Save to AsyncStorage first
        const success = await saveExamsToStorage(updatedExams);

        if (success) {
          // Update Redux store
          dispatch(updateExamAction(updatedExam));
          dispatch(setError(null));
          return { success: true, exam: updatedExam };
        }

        return { success: false, error: 'Failed to save to storage' };
      } catch (error) {
        console.error('Error updating exam:', error);
        dispatch(setError('Failed to update exam'));
        return { success: false, error: error.message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, exams, saveExamsToStorage]
  );

  /**
   * Delete an exam
   */
  const deleteExam = useCallback(
    async (examId) => {
      try {
        dispatch(setLoading(true));

        // Remove exam from list
        const updatedExams = exams.filter((e) => e.id !== examId);

        // Save to AsyncStorage first
        const success = await saveExamsToStorage(updatedExams);

        if (success) {
          // Update Redux store
          dispatch(deleteExamAction(examId));
          dispatch(setError(null));
          return { success: true };
        }

        return { success: false, error: 'Failed to save to storage' };
      } catch (error) {
        console.error('Error deleting exam:', error);
        dispatch(setError('Failed to delete exam'));
        return { success: false, error: error.message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, exams, saveExamsToStorage]
  );

  /**
   * Link a task to an exam
   */
  const linkTaskToExam = useCallback(
    async (examId, taskId) => {
      try {
        const exam = exams.find((e) => e.id === examId);
        if (!exam) {
          throw new Error('Exam not found');
        }

        // Avoid duplicates
        if (exam.linkedTaskIds.includes(taskId)) {
          return { success: true, exam };
        }

        // Update exam with new linked task
        const updatedExam = {
          ...exam,
          linkedTaskIds: [...exam.linkedTaskIds, taskId],
          updated_at: new Date().toISOString(),
        };

        const examIndex = exams.findIndex((e) => e.id === examId);
        const updatedExams = [...exams];
        updatedExams[examIndex] = updatedExam;

        // Save to AsyncStorage
        const success = await saveExamsToStorage(updatedExams);

        if (success) {
          // Update Redux store
          dispatch(linkTaskToExamAction({ examId, taskId }));
          return { success: true, exam: updatedExam };
        }

        return { success: false, error: 'Failed to save to storage' };
      } catch (error) {
        console.error('Error linking task to exam:', error);
        return { success: false, error: error.message };
      }
    },
    [dispatch, exams, saveExamsToStorage]
  );

  /**
   * Unlink a task from an exam
   */
  const unlinkTaskFromExam = useCallback(
    async (examId, taskId) => {
      try {
        const exam = exams.find((e) => e.id === examId);
        if (!exam) {
          throw new Error('Exam not found');
        }

        // Update exam removing the linked task
        const updatedExam = {
          ...exam,
          linkedTaskIds: exam.linkedTaskIds.filter((id) => id !== taskId),
          updated_at: new Date().toISOString(),
        };

        const examIndex = exams.findIndex((e) => e.id === examId);
        const updatedExams = [...exams];
        updatedExams[examIndex] = updatedExam;

        // Save to AsyncStorage
        const success = await saveExamsToStorage(updatedExams);

        if (success) {
          // Update Redux store
          dispatch(unlinkTaskFromExamAction({ examId, taskId }));
          return { success: true, exam: updatedExam };
        }

        return { success: false, error: 'Failed to save to storage' };
      } catch (error) {
        console.error('Error unlinking task from exam:', error);
        return { success: false, error: error.message };
      }
    },
    [dispatch, exams, saveExamsToStorage]
  );

  /**
   * Calculate countdown in days until exam
   */
  const getExamCountdown = useCallback((examDate) => {
    const now = new Date();
    const exam = new Date(examDate);

    // Reset time to midnight for accurate day calculation
    now.setHours(0, 0, 0, 0);
    exam.setHours(0, 0, 0, 0);

    const diffTime = exam - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }, []);

  /**
   * Get exam preparation progress (% of linked tasks completed)
   */
  const getExamProgress = useCallback(
    (examId) => {
      const exam = exams.find((e) => e.id === examId);
      if (!exam || exam.linkedTaskIds.length === 0) {
        return 0;
      }

      const linkedTasks = tasks.filter((task) =>
        exam.linkedTaskIds.includes(task.id)
      );
      const completedTasks = linkedTasks.filter((task) => task.is_completed);

      return Math.round((completedTasks.length / linkedTasks.length) * 100);
    },
    [exams, tasks]
  );

  /**
   * Get upcoming exams (next 7 days)
   */
  const getUpcomingExams = useCallback(() => {
    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return exams
      .filter((exam) => {
        const examDate = new Date(exam.date);
        return examDate >= now && examDate <= sevenDaysLater;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [exams]);

  /**
   * Get exams for this week
   */
  const getExamsThisWeek = useCallback(() => {
    return getUpcomingExams();
  }, [getUpcomingExams]);

  /**
   * Get exam by ID
   */
  const getExamById = useCallback(
    (examId) => {
      return exams.find((e) => e.id === examId);
    },
    [exams]
  );

  /**
   * Get exams by subject
   */
  const getExamsBySubject = useCallback(
    (subjectId) => {
      return exams.filter((e) => e.subjectId === subjectId);
    },
    [exams]
  );

  return {
    // State
    exams,
    loading,
    error,

    // CRUD operations
    loadExamsFromStorage,
    addExam,
    updateExam,
    deleteExam,

    // Task linking
    linkTaskToExam,
    unlinkTaskFromExam,

    // Utility functions
    getExamById,
    getExamsBySubject,
    getExamCountdown,
    getExamProgress,
    getUpcomingExams,
    getExamsThisWeek,
  };
};

export default useExams;
