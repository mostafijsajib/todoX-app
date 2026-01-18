/**
 * Haptic feedback utilities for TodoX app
 * Provides consistent haptic feedback across the app
 * Uses expo-haptics for iOS and Android support
 */

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Check if haptics are available on the device
 */
const isHapticsAvailable = Platform.OS === 'ios' || Platform.OS === 'android';

/**
 * Light impact haptic feedback
 * Use for: Button presses, subtle interactions
 */
export const light = async () => {
  if (!isHapticsAvailable) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (error) {
    console.warn('Haptics light feedback failed:', error);
  }
};

/**
 * Medium impact haptic feedback
 * Use for: Toggle switches, selection changes
 */
export const medium = async () => {
  if (!isHapticsAvailable) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (error) {
    console.warn('Haptics medium feedback failed:', error);
  }
};

/**
 * Heavy impact haptic feedback
 * Use for: Important actions, deletions
 */
export const heavy = async () => {
  if (!isHapticsAvailable) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch (error) {
    console.warn('Haptics heavy feedback failed:', error);
  }
};

/**
 * Success notification haptic
 * Use for: Task completion, successful saves
 */
export const success = async () => {
  if (!isHapticsAvailable) return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    console.warn('Haptics success feedback failed:', error);
  }
};

/**
 * Warning notification haptic
 * Use for: Warnings, important notices
 */
export const warning = async () => {
  if (!isHapticsAvailable) return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch (error) {
    console.warn('Haptics warning feedback failed:', error);
  }
};

/**
 * Error notification haptic
 * Use for: Errors, failed actions
 */
export const error = async () => {
  if (!isHapticsAvailable) return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch (error) {
    console.warn('Haptics error feedback failed:', error);
  }
};

/**
 * Selection change haptic
 * Use for: Picker changes, scrolling through options
 */
export const selection = async () => {
  if (!isHapticsAvailable) return;
  try {
    await Haptics.selectionAsync();
  } catch (error) {
    console.warn('Haptics selection feedback failed:', error);
  }
};

/**
 * Task-specific haptic patterns
 */
export const patterns = {
  // Task completed - Success with light impact
  taskComplete: async () => {
    await success();
    setTimeout(() => light(), 100);
  },

  // Task deleted - Heavy impact
  taskDelete: async () => {
    await heavy();
  },

  // Task created - Medium impact
  taskCreate: async () => {
    await medium();
  },

  // Swipe action - Light impact
  swipe: async () => {
    await light();
  },

  // Long press - Medium impact
  longPress: async () => {
    await medium();
  },

  // Button press - Light impact
  buttonPress: async () => {
    await light();
  },

  // Toggle switch - Selection
  toggle: async () => {
    await selection();
  },

  // Voice recording start - Medium impact
  voiceRecordStart: async () => {
    await medium();
  },

  // Voice recording stop - Medium impact followed by light
  voiceRecordStop: async () => {
    await medium();
    setTimeout(() => light(), 80);
  },

  // Error pattern - Error followed by light impact
  errorPattern: async () => {
    await error();
    setTimeout(() => light(), 100);
  },

  // Celebration pattern - Multiple light impacts
  celebration: async () => {
    await success();
    setTimeout(() => light(), 100);
    setTimeout(() => light(), 200);
    setTimeout(() => light(), 300);
  },
};

/**
 * Conditional haptic feedback based on user preferences
 * This can be extended to check user settings
 */
export const conditionalHaptic = async (hapticFunction, userPreferences = {}) => {
  const { hapticsEnabled = true } = userPreferences;

  if (hapticsEnabled && isHapticsAvailable) {
    await hapticFunction();
  }
};

/**
 * Export all haptic functions as default object
 */
export default {
  light,
  medium,
  heavy,
  success,
  warning,
  error,
  selection,
  patterns,
  conditionalHaptic,
  isAvailable: isHapticsAvailable,
};
