import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  SectionList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/Colors';
import useTasks from '@/hooks/useTasks';
import useSubjects from '@/hooks/useSubjects';
import {
  UpcomingHeader,
  UpcomingMenuDropdown,
  UpcomingAgendaItem,
  upcomingStyles,
  getUpcomingCalendarTheme,
  getPriorityColor,
} from '@/components/Upcoming';
import { TaskDetailModal } from '@/components/Tasks';
import AddTaskButton from '@/components/AddTaskButton';

/**
 * Upcoming Screen
 * Calendar view with upcoming study tasks
 */
export default function Upcoming() {
  const { task_list, updateTask, completeTask, uncompleteTask, deleteTask, isLoading, loadTasksFromStorage } = useTasks();
  const { subjects } = useSubjects();

  // State
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showMenu, setShowMenu] = useState(false);
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showCompleted, setShowCompleted] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [calendarExpanded, setCalendarExpanded] = useState(true);

  // Animation
  const headerOpacity = useRef(new Animated.Value(1)).current;

  // Get today and future dates
  const today = new Date().toISOString().split('T')[0];

  // Get marked dates for calendar
  const markedDates = useMemo(() => {
    const dates = {};
    task_list?.forEach((task) => {
      if (task.date) {
        const dateStr = task.date.split('T')[0];
        const existingDots = dates[dateStr]?.dots || [];
        const priorityColor = getPriorityColor(task.priority);

        dates[dateStr] = {
          dots: [...existingDots, { color: priorityColor }].slice(0, 3),
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

  // Filter and group tasks
  const groupedTasks = useMemo(() => {
    if (!task_list) return [];

    // Filter tasks
    let filtered = task_list.filter((task) => {
      // Only upcoming or today's tasks
      if (!task.date) return false;
      const taskDate = task.date.split('T')[0];
      if (taskDate < today && !showCompleted) return false;

      // Filter by category
      if (filterBy !== 'all' && task.category !== filterBy) return false;

      // Filter completed
      if (!showCompleted && task.is_completed) return false;

      return true;
    });

    // Sort tasks
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      filtered = filtered.sort((a, b) => {
        return (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
      });
    } else if (sortBy === 'subject') {
      filtered = filtered.sort((a, b) => {
        const subjectA = subjects?.find((s) => s.id === a.subjectId)?.name || 'ZZZ';
        const subjectB = subjects?.find((s) => s.id === b.subjectId)?.name || 'ZZZ';
        return subjectA.localeCompare(subjectB);
      });
    }

    // Group by date
    const grouped = {};
    filtered.forEach((task) => {
      const dateStr = task.date.split('T')[0];
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(task);
    });

    // Sort each group by time if sort is by date
    if (sortBy === 'date') {
      Object.keys(grouped).forEach((date) => {
        grouped[date] = grouped[date].sort((a, b) => {
          if (a.startTime && b.startTime) {
            return a.startTime.localeCompare(b.startTime);
          }
          if (a.startTime) return -1;
          if (b.startTime) return 1;
          return 0;
        });
      });
    }

    // Convert to section list format
    return Object.keys(grouped)
      .sort()
      .map((date) => ({
        title: formatSectionDate(date),
        date,
        data: grouped[date],
      }));
  }, [task_list, filterBy, sortBy, showCompleted, subjects, today]);

  // Format section date
  const formatSectionDate = (dateStr) => {
    const date = new Date(dateStr);
    const todayDate = new Date(today);

    const diffDays = Math.ceil((date - todayDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays <= 7) return date.toLocaleDateString('en-US', { weekday: 'long' });

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get subject for task
  const getSubjectForTask = useCallback(
    (subjectId) => {
      return subjects?.find((s) => s.id === subjectId);
    },
    [subjects]
  );

  // Statistics
  const stats = useMemo(() => {
    if (!task_list) return { total: 0, completed: 0 };

    const upcoming = task_list.filter((t) => {
      if (!t.date) return false;
      return t.date.split('T')[0] >= today;
    });

    return {
      total: upcoming.length,
      completed: upcoming.filter((t) => t.is_completed).length,
    };
  }, [task_list, today]);

  // Handlers
  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
  };

  const handleTodayPress = () => {
    setSelectedDate(today);
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

  // Render section header
  const renderSectionHeader = ({ section }) => (
    <View
      style={[
        styles.sectionHeader,
        section.date === today && styles.sectionHeaderToday,
      ]}
    >
      <Text
        style={[
          styles.sectionTitle,
          section.date === today && styles.sectionTitleToday,
        ]}
      >
        {section.title}
      </Text>
      <Text style={styles.sectionCount}>
        {section.data.length} {section.data.length === 1 ? 'task' : 'tasks'}
      </Text>
    </View>
  );

  // Loading state
  if (isLoading && !isRefreshing) {
    return (
      <SafeAreaView style={upcomingStyles.safeArea} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={upcomingStyles.safeArea} edges={['top']}>
      <UpcomingHeader
        totalTasks={stats.total}
        completedTasks={stats.completed}
        onMenuPress={() => setShowMenu(true)}
        onTodayPress={handleTodayPress}
        headerOpacity={headerOpacity}
      />

      {calendarExpanded && (
        <Calendar
          current={selectedDate}
          onDayPress={handleDateSelect}
          markedDates={markedDates}
          markingType="multi-dot"
          theme={getUpcomingCalendarTheme()}
          enableSwipeMonths
          style={styles.calendar}
        />
      )}

      <TouchableOpacity
        style={styles.calendarToggle}
        onPress={() => setCalendarExpanded(!calendarExpanded)}
      >
        <Ionicons
          name={calendarExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.textTertiary}
        />
      </TouchableOpacity>

      {groupedTasks.length > 0 ? (
        <SectionList
          sections={groupedTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UpcomingAgendaItem
              task={item}
              subject={getSubjectForTask(item.subjectId)}
              onPress={handleTaskPress}
              onToggleComplete={handleToggleComplete}
            />
          )}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled
        />
      ) : (
        <View style={upcomingStyles.emptyAgendaContainer}>
          <Ionicons name="calendar-outline" size={48} color={colors.textTertiary} />
          <Text style={upcomingStyles.emptyAgendaText}>No upcoming tasks</Text>
          <Text style={upcomingStyles.emptyAgendaSubtext}>
            Create a study task to get started
          </Text>
        </View>
      )}

      <UpcomingMenuDropdown
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        filterBy={filterBy}
        sortBy={sortBy}
        onFilterChange={setFilterBy}
        onSortChange={setSortBy}
        showCompleted={showCompleted}
        onToggleCompleted={() => setShowCompleted(!showCompleted)}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  calendarToggle: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  list: {
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionHeaderToday: {
    backgroundColor: colors.primary + '10',
  },
  sectionTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  sectionTitleToday: {
    color: colors.primary,
  },
  sectionCount: {
    fontSize: typography.sizes.sm,
    color: colors.textTertiary,
  },
});
