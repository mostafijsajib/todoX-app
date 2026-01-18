import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/Colors';
import { useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getPriorityColor } from '@/utils/gnFunc';
import { validateTaskForm } from '@/utils/validation';
import { useToast } from '@/components/UI';

/**
 * TaskDetailModal Component
 * Modal for viewing and editing study task details
 * Student-focused with subject display and study progress tracking
 */
const TaskDetailModal = ({
  visible,
  task,
  onClose,
  onUpdate,
  onDelete,
  onToggleComplete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subjects = useSelector((state) => state.subject?.subjects || []);
  const toast = useToast();

  useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
      setIsEditing(false);
    }
  }, [task]);

  const handleClose = () => {
    setIsEditing(false);
    setEditedTask(null);
    onClose();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedTask({ ...task });
    setIsEditing(false);
  };

  const handleSave = async () => {
    // Validate form
    const validation = validateTaskForm(editedTask);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      Alert.alert('Validation Error', firstError);
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedTask = {
        ...editedTask,
        title: editedTask.title.trim(),
        summary: editedTask.summary?.trim() || '',
        updated_at: new Date().toISOString(),
      };

      if (onUpdate) {
        await onUpdate(task.id, updatedTask);
        toast.success('Task updated successfully');
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this study task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (onDelete) {
              await onDelete(task.id);
            }
            handleClose();
          },
        },
      ]
    );
  };

  const handleToggleComplete = async () => {
    if (onToggleComplete) {
      await onToggleComplete(task.id);
    }
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date && editedTask) {
      setEditedTask({
        ...editedTask,
        date: date.toISOString().split('T')[0],
      });
    }
  };

  const handleStartTimeChange = (event, time) => {
    setShowStartTimePicker(false);
    if (time && editedTask) {
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      setEditedTask({
        ...editedTask,
        startTime: `${hours}:${minutes}`,
      });
    }
  };

  const handleEndTimeChange = (event, time) => {
    setShowEndTimePicker(false);
    if (time && editedTask) {
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      setEditedTask({
        ...editedTask,
        endTime: `${hours}:${minutes}`,
      });
    }
  };

  const getSubjectById = (subjectId) => {
    return subjects.find((s) => s.id === subjectId);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No date set';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const isOverdue = () => {
    if (!task?.date) return false;
    const taskDate = new Date(task.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return taskDate < today && !task.is_completed && !task.isCompleted;
  };

  const getDaysUntilDue = () => {
    if (!task?.date) return null;
    const taskDate = new Date(task.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);
    const diffTime = taskDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      study: 'book-outline',
      assignment: 'document-text-outline',
      revision: 'refresh-outline',
      practice: 'fitness-outline',
      project: 'folder-outline',
      reading: 'library-outline',
    };
    return icons[category] || 'checkbox-outline';
  };

  const priorities = [
    { key: 'high', label: 'High', color: colors.error },
    { key: 'medium', label: 'Medium', color: colors.warning },
    { key: 'low', label: 'Low', color: colors.success },
  ];

  if (!task || !editedTask) return null;

  const subject = getSubjectById(task.subjectId);
  const priorityColor = getPriorityColor(task.priority);
  const isCompleted = task.is_completed || task.isCompleted;
  const daysUntilDue = getDaysUntilDue();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.headerButton}>
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Task' : 'Study Task'}
          </Text>

          {isEditing ? (
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
              disabled={isSubmitting}
            >
              <Text style={styles.saveButtonText}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleEdit} style={styles.headerButton}>
              <Ionicons name="create-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Subject Badge (if available) */}
          {subject && (
            <View style={styles.subjectBadgeContainer}>
              <View style={[styles.subjectBadge, { backgroundColor: subject.color + '20' }]}>
                <View style={[styles.subjectDot, { backgroundColor: subject.color }]} />
                <Text style={[styles.subjectBadgeText, { color: subject.color }]}>
                  {subject.name}
                </Text>
              </View>
            </View>
          )}

          {/* Completion Status */}
          <TouchableOpacity
            style={styles.completionRow}
            onPress={handleToggleComplete}
            disabled={isEditing}
          >
            <View
              style={[
                styles.checkbox,
                isCompleted && styles.checkboxCompleted,
              ]}
            >
              {isCompleted && (
                <Ionicons name="checkmark" size={16} color={colors.textOnPrimary} />
              )}
            </View>
            <Text
              style={[
                styles.completionText,
                isCompleted && styles.completionTextCompleted,
              ]}
            >
              {isCompleted ? 'Completed! Great job! 🎉' : 'Mark as complete'}
            </Text>
          </TouchableOpacity>

          {/* Title */}
          {isEditing ? (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title *</Text>
              <TextInput
                style={styles.textInput}
                value={editedTask.title}
                onChangeText={(text) =>
                  setEditedTask({ ...editedTask, title: text })
                }
                placeholder="Task title"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
          ) : (
            <View style={styles.titleContainer}>
              <Text
                style={[
                  styles.title,
                  isCompleted && styles.titleCompleted,
                ]}
              >
                {task.title}
              </Text>
              {isOverdue() && (
                <View style={styles.overdueBadge}>
                  <Ionicons name="warning" size={12} color={colors.error} />
                  <Text style={styles.overdueText}>Overdue</Text>
                </View>
              )}
              {!isOverdue() && daysUntilDue !== null && daysUntilDue >= 0 && daysUntilDue <= 3 && (
                <View style={[styles.overdueBadge, { backgroundColor: colors.warning + '20' }]}>
                  <Text style={[styles.overdueText, { color: colors.warning }]}>
                    {daysUntilDue === 0 ? 'Due Today' : `${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''} left`}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Description */}
          {isEditing ? (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Notes</Text>
              <TextInput
                style={[styles.textInput, styles.textAreaInput]}
                value={editedTask.summary}
                onChangeText={(text) =>
                  setEditedTask({ ...editedTask, summary: text })
                }
                placeholder="Add notes..."
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          ) : (
            task.summary && (
              <Text style={styles.description}>{task.summary}</Text>
            )
          )}

          {/* Details Section */}
          <View style={styles.detailsSection}>
            {/* Date */}
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              </View>
              {isEditing ? (
                <TouchableOpacity
                  style={styles.detailButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.detailValue}>{formatDate(editedTask.date)}</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Due Date</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      isOverdue() && styles.detailValueOverdue,
                    ]}
                  >
                    {formatDate(task.date)}
                  </Text>
                </View>
              )}
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={editedTask.date ? new Date(editedTask.date) : new Date()}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
              />
            )}

            {/* Time */}
            {(task.startTime || task.endTime || isEditing) && (
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="time-outline" size={20} color={colors.secondary} />
                </View>
                {isEditing ? (
                  <View style={styles.timeEditRow}>
                    <TouchableOpacity
                      style={styles.timeButton}
                      onPress={() => setShowStartTimePicker(true)}
                    >
                      <Text style={styles.detailValue}>
                        {editedTask.startTime ? formatTime(editedTask.startTime) : 'Start'}
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.timeSeparator}>-</Text>
                    <TouchableOpacity
                      style={styles.timeButton}
                      onPress={() => setShowEndTimePicker(true)}
                    >
                      <Text style={styles.detailValue}>
                        {editedTask.endTime ? formatTime(editedTask.endTime) : 'End'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Study Time</Text>
                    <Text style={styles.detailValue}>
                      {task.startTime && formatTime(task.startTime)}
                      {task.startTime && task.endTime && ' - '}
                      {task.endTime && formatTime(task.endTime)}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {showStartTimePicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                display="spinner"
                onChange={handleStartTimeChange}
              />
            )}

            {showEndTimePicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                display="spinner"
                onChange={handleEndTimeChange}
              />
            )}

            {/* Priority */}
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="flag-outline" size={20} color={priorityColor} />
              </View>
              {isEditing ? (
                <View style={styles.priorityEditContainer}>
                  {priorities.map((p) => (
                    <TouchableOpacity
                      key={p.key}
                      style={[
                        styles.priorityOption,
                        editedTask.priority === p.key && {
                          backgroundColor: p.color + '20',
                          borderColor: p.color,
                        },
                      ]}
                      onPress={() =>
                        setEditedTask({ ...editedTask, priority: p.key })
                      }
                    >
                      <View
                        style={[styles.priorityDot, { backgroundColor: p.color }]}
                      />
                      <Text
                        style={[
                          styles.priorityOptionText,
                          editedTask.priority === p.key && { color: p.color },
                        ]}
                      >
                        {p.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Priority</Text>
                  <View style={styles.priorityBadge}>
                    <View
                      style={[styles.priorityDot, { backgroundColor: priorityColor }]}
                    />
                    <Text style={[styles.detailValue, { color: priorityColor }]}>
                      {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1) || 'None'}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Task Type */}
            {task.category && (
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name={getCategoryIcon(task.category)} size={20} color={colors.info} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Task Type</Text>
                  <Text style={styles.detailValue}>
                    {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                  </Text>
                </View>
              </View>
            )}

            {/* Subject Selection (Edit mode) */}
            {isEditing && subjects.length > 0 && (
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="school-outline" size={20} color={colors.primary} />
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.subjectEditContainer}
                >
                  {subjects.map((s) => (
                    <TouchableOpacity
                      key={s.id}
                      style={[
                        styles.subjectOption,
                        editedTask.subjectId === s.id && styles.subjectOptionActive,
                      ]}
                      onPress={() =>
                        setEditedTask({ ...editedTask, subjectId: s.id })
                      }
                    >
                      <View
                        style={[
                          styles.subjectColorDot,
                          { backgroundColor: s.color || colors.primary },
                        ]}
                      />
                      <Text
                        style={[
                          styles.subjectOptionText,
                          editedTask.subjectId === s.id && styles.subjectOptionTextActive,
                        ]}
                      >
                        {s.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Subtasks Section */}
          {task.subTasks && task.subTasks.length > 0 && (
            <View style={styles.subtasksSection}>
              <Text style={styles.sectionTitle}>Checklist</Text>
              {task.subTasks.map((subtask, index) => (
                <View key={subtask.id || index} style={styles.subtaskItem}>
                  <Ionicons
                    name={subtask.completed ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={subtask.completed ? colors.success : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.subtaskText,
                      subtask.completed && styles.subtaskTextCompleted,
                    ]}
                  >
                    {subtask.title}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Action Buttons */}
          {!isEditing && (
            <View style={styles.actionsSection}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Ionicons name="trash-outline" size={20} color={colors.error} />
                <Text style={styles.deleteButtonText}>Delete Task</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Cancel Edit Button */}
          {isEditing && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelEdit}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}

          {/* Bottom spacer */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  saveButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: colors.textOnPrimary,
    fontSize: typography.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  subjectBadgeContainer: {
    marginBottom: spacing.md,
  },
  subjectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  subjectDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  subjectBadgeText: {
    fontSize: typography.sm,
    fontWeight: typography.fontWeight.medium,
  },
  completionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  checkboxCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  completionText: {
    fontSize: typography.md,
    color: colors.textSecondary,
  },
  completionTextCompleted: {
    color: colors.success,
    fontWeight: typography.fontWeight.medium,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  overdueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  overdueText: {
    fontSize: typography.xs,
    color: colors.error,
    fontWeight: typography.fontWeight.medium,
  },
  description: {
    fontSize: typography.md,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: typography.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textAreaInput: {
    minHeight: 90,
    paddingTop: spacing.md,
  },
  detailsSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: typography.xs,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: typography.md,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  detailValueOverdue: {
    color: colors.error,
  },
  detailButton: {
    flex: 1,
    paddingVertical: spacing.xs,
  },
  timeEditRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeButton: {
    flex: 1,
    paddingVertical: spacing.xs,
  },
  timeSeparator: {
    color: colors.textTertiary,
    marginHorizontal: spacing.sm,
  },
  priorityEditContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priorityOptionText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  subjectEditContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  subjectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  subjectOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  subjectOptionText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  subjectOptionTextActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  subjectColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.xs,
  },
  subtasksSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  subtaskText: {
    fontSize: typography.md,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  subtaskTextCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  actionsSection: {
    marginTop: spacing.md,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.error + '15',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  deleteButtonText: {
    fontSize: typography.md,
    color: colors.error,
    fontWeight: typography.fontWeight.medium,
    marginLeft: spacing.sm,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  cancelButtonText: {
    fontSize: typography.md,
    color: colors.textSecondary,
  },
});

export default TaskDetailModal;
