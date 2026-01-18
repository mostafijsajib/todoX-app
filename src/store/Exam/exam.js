import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  exams: [],
  loading: false,
  error: null,
};

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    // Set all exams (load from storage)
    setExams: (state, action) => {
      state.exams = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Add a new exam
    addExam: (state, action) => {
      state.exams.push(action.payload);
      state.error = null;
    },

    // Update an existing exam
    updateExam: (state, action) => {
      const index = state.exams.findIndex(
        (exam) => exam.id === action.payload.id
      );
      if (index !== -1) {
        state.exams[index] = {
          ...state.exams[index],
          ...action.payload,
          updated_at: new Date().toISOString(),
        };
      }
      state.error = null;
    },

    // Delete an exam
    deleteExam: (state, action) => {
      state.exams = state.exams.filter((exam) => exam.id !== action.payload);
      state.error = null;
    },

    // Link a task to an exam
    linkTaskToExam: (state, action) => {
      const { examId, taskId } = action.payload;
      const exam = state.exams.find((e) => e.id === examId);
      if (exam && !exam.linkedTaskIds.includes(taskId)) {
        exam.linkedTaskIds.push(taskId);
        exam.updated_at = new Date().toISOString();
      }
      state.error = null;
    },

    // Unlink a task from an exam
    unlinkTaskFromExam: (state, action) => {
      const { examId, taskId } = action.payload;
      const exam = state.exams.find((e) => e.id === examId);
      if (exam) {
        exam.linkedTaskIds = exam.linkedTaskIds.filter((id) => id !== taskId);
        exam.updated_at = new Date().toISOString();
      }
      state.error = null;
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
  },
});

// Export actions
export const {
  setExams,
  addExam,
  updateExam,
  deleteExam,
  linkTaskToExam,
  unlinkTaskFromExam,
  setLoading,
  setError,
  clearError,
} = examSlice.actions;

// Selectors
export const selectAllExams = (state) => state.exam.exams;

export const selectExamById = (state, examId) =>
  state.exam.exams.find((exam) => exam.id === examId);

export const selectExamsBySubject = (state, subjectId) =>
  state.exam.exams.filter((exam) => exam.subjectId === subjectId);

// Get upcoming exams (next 7 days)
export const selectUpcomingExams = (state) => {
  const now = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  return state.exam.exams
    .filter((exam) => {
      const examDate = new Date(exam.date);
      return examDate >= now && examDate <= sevenDaysLater;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

// Calculate exam preparation progress
export const selectExamProgress = (state, examId) => {
  const exam = state.exam.exams.find((e) => e.id === examId);
  if (!exam || exam.linkedTaskIds.length === 0) {
    return 0;
  }

  const tasks = state.task?.task_list || [];
  const linkedTasks = tasks.filter((task) =>
    exam.linkedTaskIds.includes(task.id)
  );
  const completedTasks = linkedTasks.filter((task) => task.is_completed);

  return Math.round((completedTasks.length / linkedTasks.length) * 100);
};

export const selectExamsLoading = (state) => state.exam.loading;
export const selectExamsError = (state) => state.exam.error;

// Export reducer
export default examSlice.reducer;
