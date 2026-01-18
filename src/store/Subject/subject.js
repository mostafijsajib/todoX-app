import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  subjects: [],
  loading: false,
  error: null,
};

const subjectSlice = createSlice({
  name: 'subject',
  initialState,
  reducers: {
    // Set all subjects (load from storage)
    setSubjects: (state, action) => {
      state.subjects = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Add a new subject
    addSubject: (state, action) => {
      state.subjects.push(action.payload);
      state.error = null;
    },

    // Update an existing subject
    updateSubject: (state, action) => {
      const index = state.subjects.findIndex(
        (subject) => subject.id === action.payload.id
      );
      if (index !== -1) {
        state.subjects[index] = {
          ...state.subjects[index],
          ...action.payload,
          updated_at: new Date().toISOString(),
        };
      }
      state.error = null;
    },

    // Delete a subject
    deleteSubject: (state, action) => {
      state.subjects = state.subjects.filter(
        (subject) => subject.id !== action.payload
      );
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
  setSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
  setLoading,
  setError,
  clearError,
} = subjectSlice.actions;

// Selectors
export const selectAllSubjects = (state) => state.subject.subjects;
export const selectSubjectById = (state, subjectId) =>
  state.subject.subjects.find((subject) => subject.id === subjectId);
export const selectSubjectsLoading = (state) => state.subject.loading;
export const selectSubjectsError = (state) => state.subject.error;

// Export reducer
export default subjectSlice.reducer;
