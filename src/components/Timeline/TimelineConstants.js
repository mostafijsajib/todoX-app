/**
 * Timeline Constants
 * Shared constants and helper functions for the Timeline feature
 */

import { colors } from '@/constants/Colors';

/**
 * Get current date string in YYYY-MM-DD format
 */
export const getDate = (offset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().split('T')[0];
};

/**
 * Get formatted date for display
 */
export const getFormattedDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Timeline hour range configuration
 */
export const TIMELINE_CONFIG = {
  START_HOUR: 6,
  END_HOUR: 24,
  INTERVAL: 60,
};

/**
 * Convert time string to minutes
 */
export const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Convert minutes to time string
 */
export const minutesToTime = (mins) => {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * Format time for display (12-hour format)
 */
export const formatTimeDisplay = (timeStr) => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

/**
 * Get priority color for events
 */
export const getEventColor = (priority) => {
  switch (priority) {
    case 'high':
      return colors.error;
    case 'medium':
      return colors.warning;
    case 'low':
      return colors.success;
    default:
      return colors.primary;
  }
};

/**
 * Default marked dates options
 */
export const MARKED_DATE_OPTIONS = {
  marked: true,
  dotColor: colors.primary,
};

/**
 * Calendar theme configuration
 */
export const getCalendarBaseTheme = () => ({
  backgroundColor: colors.background,
  calendarBackground: colors.background,
  textSectionTitleColor: colors.textSecondary,
  selectedDayBackgroundColor: colors.primary,
  selectedDayTextColor: colors.textOnPrimary,
  todayTextColor: colors.primary,
  dayTextColor: colors.textPrimary,
  textDisabledColor: colors.textTertiary,
  dotColor: colors.primary,
  selectedDotColor: colors.textOnPrimary,
  arrowColor: colors.primary,
  monthTextColor: colors.textPrimary,
  indicatorColor: colors.primary,
  textDayFontWeight: '400',
  textMonthFontWeight: '600',
  textDayHeaderFontWeight: '500',
});
