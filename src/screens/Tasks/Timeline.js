import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/Colors';
import useTasks from '@/hooks/useTasks';
import useSubjects from '@/hooks/useSubjects';
import {
  TimelineHeader,
  TimelineMenuDropdown,
  timelineStyles,
  getCalendarTheme,
  getDate,
  getEventColor,
  formatTimeDisplay,
} from '@/components/Timeline';
import { TaskDetailModal } from '@/components/Tasks';
import AddTaskButton from '@/components/AddTaskButton';

/**
 * Timeline Screen
 * Visual timeline view of study tasks
 */
export default function Timeline() {
  const { task_list, updateTask, completeTask, uncompleteTask, deleteTask, isLoading, loadTasksFromStorage } = useTasks();
  const { subjects } = useSubjects();

  // State
  const [selectedDate, setSelectedDate] = useState(getDate());
  const [showMenu, setShowMenu] = useState(false);
  const [filterBy, setFilterBy] = useState('all');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Animation
  const headerOpacity = useRef(new Animated.Value(1)).current;

  // Get marked dates for calendar
  const markedDates = useMemo(() => {
    const dates = {};
    task_list?.forEach((task) => {
      if (task.date) {
        const dateStr = task.date.split('T')[0];
        dates[dateStr] = {
          marked: true,
          dotColor: getEventColor(task.priority),
        };
      }
    });

    // Mark selected date
    dates[selectedDate] = {
      ...dates[selectedDate],
      selected: true,
      selectedColor: colors.primary,
    };

    return dates;
  }, [task_list, selectedDate]);

  // Filter tasks for selected date
  const filteredTasks = useMemo(() => {
    if (!task_list) return [];

    return task_list
      .filter((task) => {
        // Filter by date
        if (!task.date) return false;
        const taskDate = task.date.split('T')[0];
        if (taskDate !== selectedDate) return false;

        // Filter by priority
        if (filterBy !== 'all' && task.priority !== filterBy) return false;

        return true;
      })
      .sort((a, b) => {
        // Sort by time
        if (a.startTime && b.startTime) {
          return a.startTime.localeCompare(b.startTime);
        }
        if (a.startTime) return -1;
        if (b.startTime) return 1;
        return 0;
      });
  }, [task_list, selectedDate, filterBy]);

  // Get subject for task
  const getSubjectForTask = useCallback(
    (subjectId) => {
      return subjects?.find((s) => s.id === subjectId);
    },
    [subjects]
  );

  // Handlers
  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
  };

  const handleTodayPress = () => {
    setSelectedDate(getDate());
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadTasksFromStorage();
    setIsRefreshing(false);
  };

  const handleTaskPress = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleToggleComplete = async (task) => {
    if (task.is_completed) {
      await uncompleteTask(task.id);
    } else {
      await completeTask(task.id);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    return await updateTask(updatedTask.id, updatedTask);
  };

  const handleDeleteTask = async (taskId) => {
    const success = await deleteTask(taskId);
    if (success) {
      setShowTaskModal(false);
      setSelectedTask(null);
    }
    return success;
  };

  // Render task item - Modernized design
  const renderTaskItem = ({ item }) => {
    const subject = getSubjectForTask(item.subjectId);
    const priorityColor = getEventColor(item.priority);

    return (
      <TouchableOpacity
        style={styles.taskCardContainer}
        onPress={() => handleTaskPress(item)}
        activeOpacity={0.8}
      >
        <BlurView intensity={10} tint="light" style={styles.taskCard}>
          <View style={styles.taskCardContent}>
            <View style={styles.taskHeader}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  item.is_completed && styles.checkboxCompleted,
                ]}
                onPress={() => handleToggleComplete(item)}
                activeOpacity={0.7}
              >
                {item.is_completed && (
                  <Ionicons name="checkmark" size={14} color={colors.white} />
                )}
              </TouchableOpacity>
              <View style={styles.taskInfo}>
                <Text
                  style={[
                    styles.taskTitle,
                    item.is_completed && styles.taskTitleCompleted,
                  ]}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                {item.startTime && (
                  <View style={styles.taskTimeContainer}>
                    <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
                    <Text style={styles.taskTime}>
                      {formatTimeDisplay(item.startTime)}
                      {item.endTime && ` - ${formatTimeDisplay(item.endTime)}`}
                    </Text>
                  </View>
                )}
              </View>
              <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]} />
            </View>

            {subject && (
              <View style={styles.taskSubject}>
                <View style={styles.subjectBadge}>
                  <Ionicons
                    name={subject.icon || 'bookmark'}
                    size={12}
                    color={subject.color || colors.primary}
                  />
                  <Text
                    style={[styles.subjectText, { color: subject.color || colors.primary }]}
                  >
                    {subject.name}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </BlurView>
      </TouchableOpacity>
    );
  };

  // Loading state
  if (isLoading && !isRefreshing) {
    return (
      <SafeAreaView style={timelineStyles.safeArea} edges={['top']}>
        <View style={timelineStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={timelineStyles.safeArea} edges={['top']}>
      <TimelineHeader
        currentDate={selectedDate}
        onMenuPress={() => setShowMenu(true)}
        onTodayPress={handleTodayPress}
        taskCount={filteredTasks.length}
        headerOpacity={headerOpacity}
      />

      <Calendar
        current={selectedDate}
        onDayPress={handleDateSelect}
        markedDates={markedDates}
        theme={getCalendarTheme()}
        enableSwipeMonths
        style={styles.calendar}
        hideExtraDays={true}
        firstDay={1}
      />

      <View style={styles.taskListContainer}>
        <BlurView intensity={15} tint="light" style={styles.taskListHeader}>
          <View style={styles.taskListHeaderContent}>
            <Text style={styles.taskListTitle}>
              {filteredTasks.length} {filteredTasks.length === 1 ? 'Task' : 'Tasks'}
            </Text>
            <View style={styles.taskListBadge}>
              <Text style={styles.taskListBadgeText}>{selectedDate}</Text>
            </View>
          </View>
        </BlurView>

        {filteredTasks.length > 0 ? (
          <FlatList
            data={filteredTasks}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.taskList}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={colors.primary}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIllustration}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="calendar-outline" size={48} color={colors.primary} />
              </View>
              <View style={styles.emptyDecorativeElements}>
                <View style={[styles.decorativeDot, styles.dot1]} />
                <View style={[styles.decorativeDot, styles.dot2]} />
                <View style={[styles.decorativeDot, styles.dot3]} />
              </View>
            </View>
            <View style={styles.emptyContent}>
              <Text style={styles.emptyTitle}>No tasks scheduled</Text>
              <Text style={styles.emptySubtitle}>
                Your calendar is clear for this day. Add a study task to get started.
              </Text>
              <TouchableOpacity 
                style={styles.emptyActionButton}
                onPress={() => {/* Add task logic */}}
                activeOpacity={0.8}
              >
                <View style={styles.emptyActionContent}>
                  <Ionicons name="add-circle" size={18} color={colors.primary} />
                  <Text style={styles.emptyActionText}>Add task</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <TimelineMenuDropdown
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        filterBy={filterBy}
        onFilterChange={setFilterBy}
        onRefresh={handleRefresh}
      />

      <TaskDetailModal
        visible={showTaskModal}
        task={selectedTask}
        onClose={() => {
          setShowTaskModal(false);
          setSelectedTask(null);
        }}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        onComplete={handleToggleComplete}
      />

      <AddTaskButton defaultDate={selectedDate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.backgroundSecondary,
  },
  taskListContainer: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  taskListHeader: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  taskListHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  taskListTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.2,
  },
  taskListBadge: {
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  taskListBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  taskList: {
    paddingBottom: 120,
    paddingTop: spacing.sm,
  },
  taskCardContainer: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.card,
  },
  taskCard: {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  taskCardContent: {
    padding: spacing.lg,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    marginTop: 2,
    backgroundColor: colors.surface,
  },
  checkboxCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 22,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  taskTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: 4,
  },
  taskTime: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  priorityIndicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
    marginLeft: spacing.sm,
    marginTop: 2,
  },
  taskSubject: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  subjectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.backgroundTertiary,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 4,
  },
  subjectText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl * 2,
  },
  emptyIllustration: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  emptyDecorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorativeDot: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: colors.primarySoft,
  },
  dot1: {
    width: 16,
    height: 16,
    top: -5,
    right: -5,
  },
  dot2: {
    width: 10,
    height: 10,
    bottom: 15,
    left: -8,
  },
  dot3: {
    width: 12,
    height: 12,
    top: 25,
    left: -10,
  },
  emptyContent: {
    alignItems: 'center',
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  emptyActionButton: {
    marginTop: spacing.md,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  emptyActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  emptyActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 0.2,
  },
});
