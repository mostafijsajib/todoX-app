import { colors } from '@/constants/Colors';

/**
 * Calendar Theme for Upcoming component
 * Customizes react-native-calendars appearance
 */
export const getUpcomingCalendarTheme = () => ({
  backgroundColor: colors.background,
  calendarBackground: colors.background,
  textSectionTitleColor: colors.textSecondary,
  textSectionTitleDisabledColor: colors.textTertiary,
  selectedDayBackgroundColor: colors.primary,
  selectedDayTextColor: colors.textOnPrimary,
  todayTextColor: colors.primary,
  todayBackgroundColor: 'transparent',
  dayTextColor: colors.textPrimary,
  textDisabledColor: colors.textTertiary,
  dotColor: colors.primary,
  selectedDotColor: colors.textOnPrimary,
  disabledDotColor: colors.textTertiary,
  arrowColor: colors.primary,
  disabledArrowColor: colors.textTertiary,
  monthTextColor: colors.textPrimary,
  indicatorColor: colors.primary,
  textDayFontWeight: '400',
  textMonthFontWeight: '600',
  textDayHeaderFontWeight: '500',
  textDayFontSize: 14,
  textMonthFontSize: 16,
  textDayHeaderFontSize: 12,
  agendaDayTextColor: colors.textPrimary,
  agendaDayNumColor: colors.textPrimary,
  agendaTodayColor: colors.primary,
  agendaKnobColor: colors.primary,
  stylesheet: {
    expandable: {
      main: {
        knobContainer: {
          backgroundColor: colors.background,
          paddingTop: 10,
        },
        knob: {
          width: 40,
          height: 4,
          borderRadius: 2,
          backgroundColor: colors.border,
        },
      },
    },
  },
});

/**
 * Get marking style for a date with tasks
 */
export const getDateMarking = (hasTask, isSelected) => {
  const marking = {};

  if (hasTask) {
    marking.marked = true;
    marking.dotColor = colors.primary;
  }

  if (isSelected) {
    marking.selected = true;
    marking.selectedColor = colors.primary;
  }

  return marking;
};

/**
 * Get priority color
 */
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return colors.error;
    case 'medium':
      return colors.warning;
    case 'low':
      return colors.success;
    default:
      return colors.textSecondary;
  }
};

/**
 * Get category icon
 */
export const getCategoryIcon = (category) => {
  switch (category) {
    case 'study':
      return 'book-outline';
    case 'assignment':
      return 'document-text-outline';
    case 'revision':
      return 'refresh-outline';
    case 'practice':
      return 'bulb-outline';
    case 'project':
      return 'folder-outline';
    case 'reading':
      return 'reader-outline';
    case 'exam':
      return 'school-outline';
    default:
      return 'checkbox-outline';
  }
};

export default getUpcomingCalendarTheme;
