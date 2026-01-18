import { createSlice, createSelector } from '@reduxjs/toolkit';

/**
 * Grade Store for Student Study Planner
 * Manages academic grades, GPA calculation, and grade tracking
 * 
 * Grade Structure:
 * {
 *   id: string,
 *   subjectId: string (required - links to subject),
 *   title: string (assignment/exam name),
 *   type: 'exam' | 'assignment' | 'quiz' | 'project' | 'midterm' | 'final' | 'other',
 *   score: number (points earned),
 *   maxScore: number (maximum possible points),
 *   weight: number (percentage weight, e.g., 20 for 20%),
 *   date: string (YYYY-MM-DD format),
 *   semester: string (e.g., "Fall 2025", "Spring 2026"),
 *   notes: string (optional),
 *   created_at: string,
 *   updated_at: string,
 * }
 */

const initialState = {
  grades: [],
  semesters: [], // List of semesters like ["Fall 2025", "Spring 2026"]
  currentSemester: null,
  loading: false,
  error: null,
};

const gradeSlice = createSlice({
  name: 'grade',
  initialState,
  reducers: {
    // Set all grades (load from storage)
    setGrades: (state, action) => {
      state.grades = action.payload || [];
      state.loading = false;
      state.error = null;
    },

    // Add a new grade
    addGrade: (state, action) => {
      state.grades.unshift(action.payload);
      // Auto-add semester if new
      if (action.payload.semester && !state.semesters.includes(action.payload.semester)) {
        state.semesters.push(action.payload.semester);
      }
      state.error = null;
    },

    // Update an existing grade
    updateGrade: (state, action) => {
      const index = state.grades.findIndex(
        (grade) => grade.id === action.payload.id
      );
      if (index !== -1) {
        state.grades[index] = {
          ...state.grades[index],
          ...action.payload,
          updated_at: new Date().toISOString(),
        };
      }
      state.error = null;
    },

    // Delete a grade
    deleteGrade: (state, action) => {
      state.grades = state.grades.filter(
        (grade) => grade.id !== action.payload
      );
      state.error = null;
    },

    // Bulk delete grades by subject
    deleteGradesBySubject: (state, action) => {
      state.grades = state.grades.filter(
        (grade) => grade.subjectId !== action.payload
      );
      state.error = null;
    },

    // Set semesters
    setSemesters: (state, action) => {
      state.semesters = action.payload || [];
    },

    // Add a new semester
    addSemester: (state, action) => {
      if (!state.semesters.includes(action.payload)) {
        state.semesters.push(action.payload);
      }
    },

    // Set current semester
    setCurrentSemester: (state, action) => {
      state.currentSemester = action.payload;
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear all grades
    clearGrades: (state) => {
      state.grades = [];
      state.error = null;
    },
  },
});

// Export actions
export const {
  setGrades,
  addGrade,
  updateGrade,
  deleteGrade,
  deleteGradesBySubject,
  setSemesters,
  addSemester,
  setCurrentSemester,
  setLoading,
  setError,
  clearError,
  clearGrades,
} = gradeSlice.actions;

// ============ SELECTORS ============

// Basic selectors
export const selectAllGrades = (state) => state.grade.grades;
export const selectGradeById = (state, gradeId) =>
  state.grade.grades.find((grade) => grade.id === gradeId);
export const selectGradesLoading = (state) => state.grade.loading;
export const selectGradesError = (state) => state.grade.error;
export const selectAllSemesters = (state) => state.grade.semesters;
export const selectCurrentSemester = (state) => state.grade.currentSemester;

// Filter by subject
export const selectGradesBySubject = (state, subjectId) =>
  state.grade.grades.filter((grade) => grade.subjectId === subjectId);

// Filter by semester
export const selectGradesBySemester = (state, semester) =>
  state.grade.grades.filter((grade) => grade.semester === semester);

// Filter by type
export const selectGradesByType = (state, type) =>
  state.grade.grades.filter((grade) => grade.type === type);

// ============ MEMOIZED SELECTORS ============

// Calculate percentage for a single grade
export const calculateGradePercentage = (grade) => {
  if (!grade || grade.maxScore === 0) return 0;
  return (grade.score / grade.maxScore) * 100;
};

// Convert percentage to letter grade
export const percentageToLetterGrade = (percentage) => {
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 63) return 'D';
  if (percentage >= 60) return 'D-';
  return 'F';
};

// Convert letter grade to GPA points
export const letterGradeToGPA = (letter) => {
  const gpaMap = {
    'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0,
  };
  return gpaMap[letter] || 0;
};

// Memoized selector for subject average
export const selectSubjectAverage = createSelector(
  [selectAllGrades, (_, subjectId) => subjectId],
  (grades, subjectId) => {
    const subjectGrades = grades.filter((g) => g.subjectId === subjectId);
    if (subjectGrades.length === 0) return null;

    // Calculate weighted average
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
      percentage: average,
      letterGrade: percentageToLetterGrade(average),
      gpa: letterGradeToGPA(percentageToLetterGrade(average)),
      gradeCount: subjectGrades.length,
    };
  }
);

// Memoized selector for semester GPA
export const selectSemesterGPA = createSelector(
  [selectAllGrades, (_, semester) => semester, (state) => state.subject?.subjects || []],
  (grades, semester, subjects) => {
    const semesterGrades = grades.filter((g) => g.semester === semester);
    if (semesterGrades.length === 0) return null;

    // Group by subject
    const subjectGrades = {};
    semesterGrades.forEach((grade) => {
      if (!subjectGrades[grade.subjectId]) {
        subjectGrades[grade.subjectId] = [];
      }
      subjectGrades[grade.subjectId].push(grade);
    });

    // Calculate GPA for each subject, then average
    let totalCredits = 0;
    let qualityPoints = 0;

    Object.entries(subjectGrades).forEach(([subjectId, grades]) => {
      const subject = subjects.find((s) => s.id === subjectId);
      const credits = subject?.credits || 3; // Default 3 credits if not specified

      // Calculate subject average
      let totalWeight = 0;
      let weightedSum = 0;
      grades.forEach((grade) => {
        const percentage = calculateGradePercentage(grade);
        const weight = grade.weight || 1;
        weightedSum += percentage * weight;
        totalWeight += weight;
      });

      const average = totalWeight > 0 ? weightedSum / totalWeight : 0;
      const gpa = letterGradeToGPA(percentageToLetterGrade(average));

      qualityPoints += gpa * credits;
      totalCredits += credits;
    });

    return totalCredits > 0 ? (qualityPoints / totalCredits).toFixed(2) : 0;
  }
);

// Memoized selector for overall GPA
export const selectOverallGPA = createSelector(
  [selectAllGrades, (state) => state.subject?.subjects || []],
  (grades, subjects) => {
    if (grades.length === 0) return null;

    // Group by subject
    const subjectGrades = {};
    grades.forEach((grade) => {
      if (!subjectGrades[grade.subjectId]) {
        subjectGrades[grade.subjectId] = [];
      }
      subjectGrades[grade.subjectId].push(grade);
    });

    let totalCredits = 0;
    let qualityPoints = 0;

    Object.entries(subjectGrades).forEach(([subjectId, grades]) => {
      const subject = subjects.find((s) => s.id === subjectId);
      const credits = subject?.credits || 3;

      let totalWeight = 0;
      let weightedSum = 0;
      grades.forEach((grade) => {
        const percentage = calculateGradePercentage(grade);
        const weight = grade.weight || 1;
        weightedSum += percentage * weight;
        totalWeight += weight;
      });

      const average = totalWeight > 0 ? weightedSum / totalWeight : 0;
      const gpa = letterGradeToGPA(percentageToLetterGrade(average));

      qualityPoints += gpa * credits;
      totalCredits += credits;
    });

    return totalCredits > 0 ? (qualityPoints / totalCredits).toFixed(2) : '0.00';
  }
);

// Recent grades (last 10)
export const selectRecentGrades = createSelector(
  [selectAllGrades],
  (grades) => {
    return [...grades]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10);
  }
);

// Export reducer
export default gradeSlice.reducer;
