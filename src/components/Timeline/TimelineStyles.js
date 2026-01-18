import { StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/Colors';

/**
 * Timeline Styles
 * Shared styles for Timeline components
 */
export const timelineStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    backgroundColor: colors.background,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
  },
  calendarContainer: {
    backgroundColor: colors.background,
    paddingBottom: spacing.sm,
  },
  eventContainer: {
    flex: 1,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginRight: spacing.xs,
    borderLeftWidth: 3,
  },
  eventTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  eventTime: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  eventSummary: {
    fontSize: typography.sizes.xs,
    color: colors.textTertiary,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: typography.sizes.sm,
    color: colors.textTertiary,
    marginTop: spacing.xs,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    position: 'absolute',
    right: spacing.md,
    top: 60,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    minWidth: 180,
    ...shadows.medium,
    zIndex: 1000,
    elevation: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  menuItemText: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  menuItemActive: {
    backgroundColor: colors.primary + '15',
  },
  menuItemActiveText: {
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  dayText: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  dayTextToday: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  dayTextSelected: {
    color: colors.textOnPrimary,
  },
  dayContainerSelected: {
    backgroundColor: colors.primary,
  },
  dayContainerToday: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
});

/**
 * Get theme for Timeline component from react-native-calendars
 */
export const getTimelineTheme = () => ({
  palette: {
    primary: {
      main: colors.primary,
      contrastText: colors.textOnPrimary,
    },
    background: {
      default: colors.background,
      paper: colors.surface,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
      disabled: colors.textTertiary,
    },
    divider: colors.border,
  },
  spacing: 4,
});

/**
 * Get theme for Calendar component from react-native-calendars
 */
export const getCalendarTheme = () => ({
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
        },
        knob: {
          backgroundColor: colors.primary,
        },
      },
    },
  },
});

export default timelineStyles;
