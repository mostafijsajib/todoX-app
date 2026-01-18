import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows, semanticTypography } from '@/constants/Colors';

/**
 * TaskItem Component
 * Beautiful task card with animations and modern design
 */
const TaskItem = memo(({
  task,
  subject,
  onPress,
  onToggleComplete,
  isSelectionMode = false,
  isSelected = false,
  onSelect,
  onRemove,
}) => {
  if (!task) return null;

  const isCompleted = task.is_completed;

  // Priority configuration
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'high':
        return { color: colors.highPriority, label: 'High', icon: 'flame' };
      case 'medium':
        return { color: colors.mediumPriority, label: 'Medium', icon: 'sunny' };
      case 'low':
        return { color: colors.lowPriority, label: 'Low', icon: 'leaf' };
      default:
        return { color: colors.textTertiary, label: '', icon: null };
    }
  };

  // Category configuration
  const getCategoryConfig = (category) => {
    switch (category) {
      case 'study':
        return { icon: 'book', color: colors.categories.study };
      case 'assignment':
      case 'homework':
        return { icon: 'document-text', color: colors.categories.homework };
      case 'revision':
        return { icon: 'refresh-circle', color: colors.categories.revision };
      case 'practice':
        return { icon: 'bulb', color: colors.categories.practice };
      case 'project':
        return { icon: 'folder', color: colors.categories.project };
      case 'reading':
        return { icon: 'library', color: colors.categories.reading };
      case 'exam':
        return { icon: 'school', color: colors.error };
      default:
        return { icon: 'checkbox', color: colors.textTertiary };
    }
  };

  // Format time to 12h format
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Calculate duration between start and end time
  const getDuration = () => {
    if (!task.startTime || !task.endTime) return null;

    const [startHours, startMinutes] = task.startTime.split(':').map(Number);
    const [endHours, endMinutes] = task.endTime.split(':').map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    const durationMinutes = endTotalMinutes - startTotalMinutes;

    if (durationMinutes <= 0) return null;

    if (durationMinutes < 60) {
      return `${durationMinutes}m`;
    }

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  // Check if task is overdue
  const isOverdue = () => {
    if (!task.date || isCompleted) return false;
    const today = new Date().toISOString().split('T')[0];
    return task.date.split('T')[0] < today;
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const categoryConfig = getCategoryConfig(task.category);
  const overdue = isOverdue();
  const subjectColor = subject?.color || colors.primary;

  const handlePress = () => {
    if (isSelectionMode) {
      onSelect?.(task);
    } else {
      onPress?.(task);
    }
  };

  const handleCheckPress = () => {
    onToggleComplete?.(task);
    onRemove?.(task.id);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[
          styles.container,
          isSelected && styles.containerSelected,
          overdue && styles.containerOverdue,
        ]}
        onPress={handlePress}
        onLongPress={() => onSelect?.(task)}
        activeOpacity={0.8}
      >
        {/* Left accent bar */}
        <View style={[styles.accentBar, { backgroundColor: subjectColor }]} />

        <View style={styles.content}>
          {/* Checkbox / Selection */}
          {isSelectionMode ? (
            <TouchableOpacity
              style={[
                styles.selectionBox,
                isSelected && styles.selectionBoxSelected,
              ]}
              onPress={() => onSelect?.(task)}
            >
              {isSelected && (
                <Ionicons name="checkmark" size={14} color="#FFF" />
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.checkbox,
                isCompleted && [styles.checkboxCompleted, { backgroundColor: colors.success }],
              ]}
              onPress={handleCheckPress}
            >
              {isCompleted && (
                <Ionicons name="checkmark" size={14} color="#FFF" />
              )}
            </TouchableOpacity>
          )}

          {/* Task Info */}
          <View style={styles.taskInfo}>
            {/* Title Row */}
            <View style={styles.titleRow}>
              <Text
                style={[
                  styles.title,
                  isCompleted && styles.titleCompleted,
                ]}
                numberOfLines={2}
              >
                {task.title}
              </Text>
              
              {/* Priority indicator */}
              {task.priority && !isCompleted && (
                <View style={[styles.priorityBadge, { backgroundColor: `${priorityConfig.color}15` }]}>
                  <View style={[styles.priorityDot, { backgroundColor: priorityConfig.color }]} />
                </View>
              )}
            </View>

            {/* Meta Row */}
            <View style={styles.metaRow}>
              {/* Time */}
              {task.startTime && (
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
                  <Text style={styles.metaText}>{formatTime(task.startTime)}</Text>
                </View>
              )}

              {/* Duration Badge - NEW */}
              {getDuration() && (
                <View style={styles.durationBadge}>
                  <Ionicons name="hourglass-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.durationText}>{getDuration()}</Text>
                </View>
              )}

              {/* Category Badge */}
              {task.category && (
                <View style={[styles.categoryBadge, { backgroundColor: `${categoryConfig.color}12` }]}>
                  <Ionicons
                    name={categoryConfig.icon}
                    size={13}
                    color={categoryConfig.color}
                  />
                  <Text style={[styles.categoryText, { color: categoryConfig.color }]}>
                    {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                  </Text>
                </View>
              )}

              {/* Subject Badge */}
              {subject && (
                <View style={[styles.subjectBadge, { backgroundColor: `${subjectColor}12` }]}>
                  <Ionicons
                    name={subject.icon || 'bookmark'}
                    size={13}
                    color={subjectColor}
                  />
                  <Text
                    style={[styles.subjectText, { color: subjectColor }]}
                    numberOfLines={1}
                  >
                    {subject.name}
                  </Text>
                </View>
              )}

              {/* Overdue Badge */}
              {overdue && (
                <View style={styles.overdueBadge}>
                  <Ionicons name="alert-circle" size={13} color={colors.error} />
                  <Text style={styles.overdueText}>Overdue</Text>
                </View>
              )}
            </View>

            {/* Subtasks Progress */}
            {task.subTasks && task.subTasks.length > 0 && (
              <View style={styles.subtasksRow}>
                <View style={styles.subtasksProgress}>
                  <View
                    style={[
                      styles.subtasksProgressFill,
                      {
                        width: `${(task.subTasks.filter(st => st.completed).length / task.subTasks.length) * 100}%`,
                        backgroundColor: subjectColor,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.subtasksText}>
                  {task.subTasks.filter(st => st.completed).length}/{task.subTasks.length} subtasks
                </Text>
              </View>
            )}
          </View>

          {/* Chevron */}
          <View style={styles.chevronContainer}>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
});

TaskItem.displayName = 'TaskItem';

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.xxs,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.neo1,
  },
  containerSelected: {
    backgroundColor: `${colors.primary}08`,
    borderColor: colors.primary,
  },
  containerOverdue: {
    borderColor: `${colors.error}50`,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    borderTopLeftRadius: borderRadius.lg,
    borderBottomLeftRadius: borderRadius.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  checkboxCompleted: {
    borderColor: colors.success,
  },
  selectionBox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  selectionBoxSelected: {
    backgroundColor: colors.primary,
  },
  taskInfo: {
    flex: 1,
    paddingRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    ...semanticTypography.h3,
    color: colors.textPrimary,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  priorityBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...semanticTypography.caption,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: `${colors.primary}08`,
  },
  durationText: {
    ...semanticTypography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  categoryText: {
    fontSize: typography.xxs,
    fontWeight: '600',
  },
  subjectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    maxWidth: 100,
  },
  subjectText: {
    fontSize: typography.xxs,
    fontWeight: '600',
  },
  overdueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: `${colors.error}12`,
    gap: 4,
  },
  overdueText: {
    fontSize: typography.xxs,
    fontWeight: '600',
    color: colors.error,
  },
  subtasksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  subtasksProgress: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  subtasksProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  subtasksText: {
    fontSize: typography.xxs,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  chevronContainer: {
    justifyContent: 'center',
    paddingLeft: 4,
    paddingTop: 2,
  },
});

export default TaskItem;
