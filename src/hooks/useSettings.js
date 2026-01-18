import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import {
  setSettings,
  updateSetting,
  updateMultipleSettings,
  toggleSetting,
  resetSettings,
  setLoading,
  setError,
  selectAllSettings,
  selectNotifications,
  selectStudyReminders,
  selectExamAlerts,
  selectDailyDigest,
  selectDarkMode,
  selectHapticFeedback,
  selectGradingScale,
  selectTargetGPA,
  selectSettingsLoading,
  selectSettingsError,
} from '../store/Settings/settings';
import { storeDataLocalStorage, getDataLocalStorage } from '../utils/storage';

// Storage key for settings
const STORAGE_KEY = 'app_settings';

/**
 * Custom hook for managing app settings with Redux and AsyncStorage synchronization
 * Provides operations that automatically sync between Redux store and local storage
 */
const useSettings = () => {
  const dispatch = useDispatch();

  // Get settings state from Redux store
  const settings = useSelector(selectAllSettings);
  const notifications = useSelector(selectNotifications);
  const studyReminders = useSelector(selectStudyReminders);
  const examAlerts = useSelector(selectExamAlerts);
  const dailyDigest = useSelector(selectDailyDigest);
  const darkMode = useSelector(selectDarkMode);
  const hapticFeedback = useSelector(selectHapticFeedback);
  const gradingScale = useSelector(selectGradingScale);
  const targetGPA = useSelector(selectTargetGPA);
  const loading = useSelector(selectSettingsLoading);
  const error = useSelector(selectSettingsError);

  // Load settings from storage on mount
  const loadSettings = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const storedSettings = await getDataLocalStorage(STORAGE_KEY);
      if (storedSettings) {
        dispatch(setSettings(storedSettings));
      }
      dispatch(setLoading(false));
      return true;
    } catch (err) {
      dispatch(setError('Failed to load settings'));
      return false;
    }
  }, [dispatch]);

  // Save settings to storage
  const saveSettingsToStorage = useCallback(async (newSettings) => {
    try {
      await storeDataLocalStorage(STORAGE_KEY, newSettings);
      return true;
    } catch (err) {
      dispatch(setError('Failed to save settings'));
      return false;
    }
  }, [dispatch]);

  // Update a single setting and persist
  const setSetting = useCallback(async (key, value) => {
    try {
      dispatch(updateSetting({ key, value }));
      
      // Get current settings and update
      const currentSettings = await getDataLocalStorage(STORAGE_KEY) || {};
      const newSettings = { ...currentSettings, [key]: value };
      await saveSettingsToStorage(newSettings);
      
      return true;
    } catch (err) {
      dispatch(setError('Failed to update setting'));
      return false;
    }
  }, [dispatch, saveSettingsToStorage]);

  // Toggle a boolean setting and persist
  const toggleSettingValue = useCallback(async (key) => {
    try {
      dispatch(toggleSetting(key));
      
      // Get current settings and toggle
      const currentSettings = await getDataLocalStorage(STORAGE_KEY) || {};
      const newSettings = { ...currentSettings, [key]: !currentSettings[key] };
      await saveSettingsToStorage(newSettings);
      
      return true;
    } catch (err) {
      dispatch(setError('Failed to toggle setting'));
      return false;
    }
  }, [dispatch, saveSettingsToStorage]);

  // Update multiple settings at once
  const setMultipleSettings = useCallback(async (updates) => {
    try {
      dispatch(updateMultipleSettings(updates));
      
      // Get current settings and merge updates
      const currentSettings = await getDataLocalStorage(STORAGE_KEY) || {};
      const newSettings = { ...currentSettings, ...updates };
      await saveSettingsToStorage(newSettings);
      
      return true;
    } catch (err) {
      dispatch(setError('Failed to update settings'));
      return false;
    }
  }, [dispatch, saveSettingsToStorage]);

  // Reset all settings to defaults
  const resetAllSettings = useCallback(async () => {
    try {
      dispatch(resetSettings());
      await storeDataLocalStorage(STORAGE_KEY, null);
      return true;
    } catch (err) {
      dispatch(setError('Failed to reset settings'));
      return false;
    }
  }, [dispatch]);

  return {
    // State
    settings,
    notifications,
    studyReminders,
    examAlerts,
    dailyDigest,
    darkMode,
    hapticFeedback,
    gradingScale,
    targetGPA,
    loading,
    error,
    
    // Actions
    loadSettings,
    setSetting,
    toggleSettingValue,
    setMultipleSettings,
    resetAllSettings,
  };
};

export default useSettings;
