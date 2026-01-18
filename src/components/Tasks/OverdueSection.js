import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TaskItem from '../Inbox/TaskItem';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/Colors';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * OverdueSection Component
 *
 * Displays overdue tasks in a collapsible section with soft warning colors.
 * Designed to handle overdue tasks without creating anxiety.
 *
 * Props:
 * - tasks: Array of overdue task objects
 * - subjects: Array of subject objects for task rendering
 * - onTaskPress: Function called when a task is tapped
 * - onCompleteTask: Function called when task is marked complete
 * - isSelectionMode: Boolean for bulk selection mode
 * - selectedTaskIds: Array of selected task IDs
 * - onSelectTask: Function called when task is selected
 */
const OverdueSection = ({
  tasks = [],
  subjects = [],
  onTaskPress,
  onCompleteTask,
  isSelectionMode = false,
  selectedTaskIds = [],
  onSelectTask,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!tasks || tasks.length === 0) {
    return null;
  }

  const overdueCount = tasks.length;
  const completedCount = tasks.filter(t => t.is_completed || t.isCompleted).length;
  const progressPercent = overdueCount > 0 ? (completedCount / overdueCount) * 100 : 0;

  // Get subject by ID
  const getSubjectById = (subjectId) => {
    return subjects.find(s => s.id === subjectId);
  };

  // Toggle expand/collapse with animation
  const toggleExpand = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        300,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity
      )
    );
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
      {/* Collapsible Header */}
      <Pressable
        onPress={toggleExpand}
        style={({ pressed }) => [
          styles.header,
          pressed && styles.headerPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${overdueCount} overdue tasks. ${isExpanded ? 'Collapse' : 'Expand'} section`}
        accessibilityHint="Tap to view overdue tasks that need rescheduling"
      >
        <View style={styles.headerLeft}>
          {/* Warning Icon */}
          <View style={styles.iconContainer}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={colors.error}
            />
          </View>

          {/* Text Content */}
          <View style={styles.headerText}>
            <Text style={styles.title}>
              {overdueCount} task{overdueCount !== 1 ? 's' : ''} need{overdueCount === 1 ? 's' : ''} rescheduling
            </Text>
            <Text style={styles.subtitle}>
              {isExpanded ? 'Tap to collapse' : 'Tap to review and update'}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* Mini Progress Indicator */}
          {progressPercent > 0 && (
            <View style={styles.miniProgressContainer}>
              <View
                style={[
                  styles.miniProgressBar,
                  { width: `${progressPercent}%` }
                ]}
              />
            </View>
          )}

          {/* Chevron Icon */}
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={colors.textSecondary}
          />
        </View>
      </Pressable>

      {/* Expandable Task List */}
      {isExpanded && (
        <View style={styles.taskList}>
          {tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              subject={getSubjectById(task.subjectId)}
              onPress={() => onTaskPress && onTaskPress(task)}
              onToggleComplete={() => onCompleteTask && onCompleteTask(task)}
              isSelectionMode={isSelectionMode}
              isSelected={selectedTaskIds.includes(task.id)}
              onSelect={() => onSelectTask && onSelectTask(task.id)}
            />
          ))}

          {/* Helper Text */}
          <View style={styles.helperTextContainer}>
            <Ionicons
              name="information-circle-outline"
              size={14}
              color={colors.textTertiary}
            />
            <Text style={styles.helperText}>
              Tap a task to reschedule or mark as complete
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.screen,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.errorSoft,
    overflow: 'hidden',
    ...shadows.neo2,
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    backgroundColor: colors.errorSoft,
  },

  headerPressed: {
    opacity: 0.7,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: typography.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.errorDark,
    marginBottom: 2,
  },

  subtitle: {
    fontSize: typography.xs,
    fontWeight: typography.fontWeight.normal,
    color: colors.textSecondary,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  // Mini Progress Bar
  miniProgressContainer: {
    width: 40,
    height: 4,
    backgroundColor: colors.errorSoft,
    borderRadius: borderRadius.xs,
    overflow: 'hidden',
  },

  miniProgressBar: {
    height: '100%',
    backgroundColor: colors.error,
    borderRadius: borderRadius.xs,
  },

  // Task List Styles
  taskList: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },

  taskItemSpacing: {
    marginTop: spacing.sm,
  },

  // Helper Text
  helperTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.xs,
  },

  helperText: {
    fontSize: typography.xs,
    fontWeight: typography.fontWeight.normal,
    color: colors.textTertiary,
  },
});

export default OverdueSection;
