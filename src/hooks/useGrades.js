import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  setGrades,
  addGrade as addGradeAction,
  updateGrade as updateGradeAction,
  deleteGrade as deleteGradeAction,
  deleteGradesBySubject,
  setSemesters,
  addSemester,
  setCurrentSemester,
  setLoading,
  setError,
  clearGrades,
  selectAllGrades,
  selectGradeById,
  selectGradesBySubject,
  selectGradesBySemester,
  selectGradesByType,
  selectAllSemesters,
  selectCurrentSemester,
  selectGradesLoading,
  selectGradesError,
  selectSubjectAverage,
  selectSemesterGPA,
  selectOverallGPA,
  selectRecentGrades,
  calculateGradePercentage,
  percentageToLetterGrade,
  letterGradeToGPA,
} from '../store/Grade/grade';
import { storeDataLocalStorage, getDataLocalStorage } from '../utils/storage';

// Storage keys
const STORAGE_KEYS = {
  GRADES: 'grades',
  SEMESTERS: 'semesters',
  CURRENT_SEMESTER: 'current_semester',
};

/**
 * Custom hook for managing grades with Redux and AsyncStorage synchronization
 * Provides CRUD operations and GPA calculations
 */
const useGrades = () => {
  const dispatch = useDispatch();

  // Get grade state from Redux store
  const grades = useSelector(selectAllGrades);
  const semesters = useSelector(selectAllSemesters);
  const currentSemester = useSelector(selectCurrentSemester);
  const loading = useSelector(selectGradesLoading);
  const error = useSelector(selectGradesError);
  const overallGPA = useSelector(selectOverallGPA);
  const recentGrades = useSelector(selectRecentGrades);

  // Load grades from storage
  const loadGrades = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      
      const [storedGrades, storedSemesters, storedCurrentSemester] = await Promise.all([
        getDataLocalStorage(STORAGE_KEYS.GRADES),
        getDataLocalStorage(STORAGE_KEYS.SEMESTERS),
        getDataLocalStorage(STORAGE_KEYS.CURRENT_SEMESTER),
      ]);

      dispatch(setGrades(storedGrades || []));
      dispatch(setSemesters(storedSemesters || []));
      dispatch(setCurrentSemester(storedCurrentSemester || null));
      
      dispatch(setLoading(false));
      return true;
    } catch (err) {
      dispatch(setError('Failed to load grades'));
      return false;
    }
  }, [dispatch]);

  // Save grades to storage
  const saveGradesToStorage = useCallback(async (newGrades) => {
    try {
      await storeDataLocalStorage(STORAGE_KEYS.GRADES, newGrades);
      return true;
    } catch (err) {
      dispatch(setError('Failed to save grades'));
      return false;
    }
  }, [dispatch]);

  // Add a new grade
  const addGrade = useCallback(async (gradeData) => {
    try {
      dispatch(setLoading(true));

      const newGrade = {
        id: gradeData.id || `grade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        subjectId: gradeData.subjectId,
        title: gradeData.title,
        type: gradeData.type || 'assignment',
        score: gradeData.score,
        maxScore: gradeData.maxScore,
        weight: gradeData.weight || 1,
        date: gradeData.date || new Date().toISOString().split('T')[0],
        semester: gradeData.semester || currentSemester,
        notes: gradeData.notes || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const updatedGrades = [newGrade, ...grades];
      const success = await saveGradesToStorage(updatedGrades);

      if (success) {
        dispatch(addGradeAction(newGrade));
        
        // Also save semester if new
        if (newGrade.semester && !semesters.includes(newGrade.semester)) {
          const updatedSemesters = [...semesters, newGrade.semester];
          await storeDataLocalStorage(STORAGE_KEYS.SEMESTERS, updatedSemesters);
        }
        
        dispatch(setLoading(false));
        return newGrade;
      }

      dispatch(setLoading(false));
      return null;
    } catch (err) {
      dispatch(setError('Failed to add grade'));
      return null;
    }
  }, [dispatch, grades, currentSemester, semesters, saveGradesToStorage]);

  // Update a grade
  const updateGrade = useCallback(async (gradeId, updates) => {
    try {
      dispatch(setLoading(true));

      const updatedGrades = grades.map((grade) =>
        grade.id === gradeId
          ? { ...grade, ...updates, updated_at: new Date().toISOString() }
          : grade
      );

      const success = await saveGradesToStorage(updatedGrades);

      if (success) {
        dispatch(updateGradeAction({ id: gradeId, ...updates }));
        dispatch(setLoading(false));
        return true;
      }

      dispatch(setLoading(false));
      return false;
    } catch (err) {
      dispatch(setError('Failed to update grade'));
      return false;
    }
  }, [dispatch, grades, saveGradesToStorage]);

  // Delete a grade
  const deleteGrade = useCallback(async (gradeId) => {
    try {
      dispatch(setLoading(true));

      const updatedGrades = grades.filter((grade) => grade.id !== gradeId);
      const success = await saveGradesToStorage(updatedGrades);

      if (success) {
        dispatch(deleteGradeAction(gradeId));
        dispatch(setLoading(false));
        return true;
      }

      dispatch(setLoading(false));
      return false;
    } catch (err) {
      dispatch(setError('Failed to delete grade'));
      return false;
    }
  }, [dispatch, grades, saveGradesToStorage]);

  // Delete all grades for a subject
  const deleteSubjectGrades = useCallback(async (subjectId) => {
    try {
      dispatch(setLoading(true));

      const updatedGrades = grades.filter((grade) => grade.subjectId !== subjectId);
      const success = await saveGradesToStorage(updatedGrades);

      if (success) {
        dispatch(deleteGradesBySubject(subjectId));
        dispatch(setLoading(false));
        return true;
      }

      dispatch(setLoading(false));
      return false;
    } catch (err) {
      dispatch(setError('Failed to delete subject grades'));
      return false;
    }
  }, [dispatch, grades, saveGradesToStorage]);

  // Add a new semester
  const addNewSemester = useCallback(async (semesterName) => {
    try {
      if (semesters.includes(semesterName)) {
        return false;
      }

      const updatedSemesters = [...semesters, semesterName];
      await storeDataLocalStorage(STORAGE_KEYS.SEMESTERS, updatedSemesters);
      dispatch(addSemester(semesterName));
      return true;
    } catch (err) {
      dispatch(setError('Failed to add semester'));
      return false;
    }
  }, [dispatch, semesters]);

  // Set current semester
  const setActiveSemester = useCallback(async (semesterName) => {
    try {
      await storeDataLocalStorage(STORAGE_KEYS.CURRENT_SEMESTER, semesterName);
      dispatch(setCurrentSemester(semesterName));
      return true;
    } catch (err) {
      dispatch(setError('Failed to set semester'));
      return false;
    }
  }, [dispatch]);

  // Get grades by subject
  const getGradesBySubject = useCallback((subjectId) => {
    return grades.filter((grade) => grade.subjectId === subjectId);
  }, [grades]);

  // Get grades by semester
  const getGradesBySemester = useCallback((semester) => {
    return grades.filter((grade) => grade.semester === semester);
  }, [grades]);

  // Calculate subject average
  const getSubjectAverage = useCallback((subjectId) => {
    const subjectGrades = grades.filter((g) => g.subjectId === subjectId);
    if (subjectGrades.length === 0) return null;

    let totalWeight = 0;
    let weightedSum = 0;

    subjectGrades.forEach((grade) => {
      const percentage = calculateGradePercentage(grade);
      const weight = grade.weight || 1;
      weightedSum += percentage * weight;
      totalWeight += weight;
    });

    const average = totalWeight > 0 ? weightedSum / totalWeight : 0;
    return {
      percentage: average.toFixed(1),
      letterGrade: percentageToLetterGrade(average),
      gpa: letterGradeToGPA(percentageToLetterGrade(average)),
      gradeCount: subjectGrades.length,
    };
  }, [grades]);

  // Get stats summary
  const getGradeStats = useCallback(() => {
    if (grades.length === 0) {
      return {
        totalGrades: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        subjectsWithGrades: 0,
      };
    }

    const percentages = grades.map((g) => calculateGradePercentage(g));
    const uniqueSubjects = new Set(grades.map((g) => g.subjectId));

    return {
      totalGrades: grades.length,
      averageScore: (percentages.reduce((a, b) => a + b, 0) / percentages.length).toFixed(1),
      highestScore: Math.max(...percentages).toFixed(1),
      lowestScore: Math.min(...percentages).toFixed(1),
      subjectsWithGrades: uniqueSubjects.size,
    };
  }, [grades]);

  // Clear all grades
  const clearAllGrades = useCallback(async () => {
    try {
      await storeDataLocalStorage(STORAGE_KEYS.GRADES, []);
      dispatch(clearGrades());
      return true;
    } catch (err) {
      dispatch(setError('Failed to clear grades'));
      return false;
    }
  }, [dispatch]);

  return {
    // State
    grades,
    semesters,
    currentSemester,
    loading,
    error,
    overallGPA,
    recentGrades,

    // Actions
    loadGrades,
    addGrade,
    updateGrade,
    deleteGrade,
    deleteSubjectGrades,
    addNewSemester,
    setActiveSemester,
    clearAllGrades,

    // Getters
    getGradesBySubject,
    getGradesBySemester,
    getSubjectAverage,
    getGradeStats,

    // Utilities
    calculateGradePercentage,
    percentageToLetterGrade,
    letterGradeToGPA,
  };
};

export default useGrades;
