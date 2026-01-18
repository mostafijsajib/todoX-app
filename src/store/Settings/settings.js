import { createSlice } from '@reduxjs/toolkit';

/**
 * Settings Store for Student Study Planner
 * Manages app preferences that persist across sessions
 */

const initialState = {
  // Notification Settings
  notifications: true,
  studyReminders: true,
  examAlerts: true,
  dailyDigest: false,
  
  // Appearance Settings
  darkMode: false,
  hapticFeedback: true,
  
  // Study Settings
  defaultStudyDuration: 45, // minutes
  breakDuration: 10, // minutes
  pomodoroEnabled: false,
  
  // Academic Settings
  gradingScale: 'percentage', // 'percentage', 'letter', 'gpa'
  targetGPA: 3.5,
  currentSemester: null,
  
  // Loading state
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Set all settings (load from storage)
    setSettings: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: false,
        error: null,
      };
    },

    // Update a single setting
    updateSetting: (state, action) => {
      const { key, value } = action.payload;
      if (key in state) {
        state[key] = value;
      }
      state.error = null;
    },

    // Update multiple settings at once
    updateMultipleSettings: (state, action) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        if (key in state && key !== 'loading' && key !== 'error') {
          state[key] = value;
        }
      });
      state.error = null;
    },

    // Toggle boolean setting
    toggleSetting: (state, action) => {
      const key = action.payload;
      if (key in state && typeof state[key] === 'boolean') {
        state[key] = !state[key];
      }
      state.error = null;
    },

    // Reset to defaults
    resetSettings: () => initialState,

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// Export actions
export const {
  setSettings,
  updateSetting,
  updateMultipleSettings,
  toggleSetting,
  resetSettings,
  setLoading,
  setError,
} = settingsSlice.actions;

// Selectors
export const selectAllSettings = (state) => state.settings;
export const selectNotifications = (state) => state.settings.notifications;
export const selectStudyReminders = (state) => state.settings.studyReminders;
export const selectExamAlerts = (state) => state.settings.examAlerts;
export const selectDailyDigest = (state) => state.settings.dailyDigest;
export const selectDarkMode = (state) => state.settings.darkMode;
export const selectHapticFeedback = (state) => state.settings.hapticFeedback;
export const selectGradingScale = (state) => state.settings.gradingScale;
export const selectTargetGPA = (state) => state.settings.targetGPA;
export const selectSettingsLoading = (state) => state.settings.loading;
export const selectSettingsError = (state) => state.settings.error;

// Export reducer
export default settingsSlice.reducer;
