import { createSlice } from '@reduxjs/toolkit';

/**
 * Category slice for task categorization
 * Categories represent task types: study, assignment, revision, practice, etc.
 */

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    // Set all categories (load from storage)
    setCategories: (state, action) => {
      state.categories = action.payload || [];
      state.loading = false;
      state.error = null;
    },

    // Add a new category
    addCategory: (state, action) => {
      state.categories.push(action.payload);
      state.error = null;
    },

    // Update an existing category
    updateCategory: (state, action) => {
      const index = state.categories.findIndex(
        (category) => category.id === action.payload.id || category.name === action.payload.name
      );
      if (index !== -1) {
        state.categories[index] = {
          ...state.categories[index],
          ...action.payload,
          updated_at: new Date().toISOString(),
        };
      }
      state.error = null;
    },

    // Delete a category
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload && category.name !== action.payload
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

    // Clear all categories
    clearCategories: (state) => {
      state.categories = [];
      state.error = null;
    },
  },
});

// Export actions
export const {
  setCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  setLoading,
  setError,
  clearError,
  clearCategories,
} = categorySlice.actions;

// Selectors
export const selectAllCategories = (state) => state.category.categories;
export const selectCategoryById = (state, categoryId) =>
  state.category.categories.find((category) => category.id === categoryId);
export const selectCategoryByName = (state, name) =>
  state.category.categories.find((category) => category.name === name);
export const selectCategoriesLoading = (state) => state.category.loading;
export const selectCategoriesError = (state) => state.category.error;

// Export reducer
export default categorySlice.reducer;
