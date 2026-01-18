import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/Colors';
import useTasks from '@/hooks/useTasks';
import useSubjects from '@/hooks/useSubjects';
import { TaskDetailModal } from '@/components/Tasks';

/**
 * CompletedTask Screen
 * View and manage completed study tasks
 */
const CompletedTask = () => {
  const navigation = useNavigation();
  const { task_list, uncompleteTask, deleteTask, isLoading, loadTasksFromStorage } = useTasks();
  const { subject_list } = useSubjects();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Get completed tasks
  const completedTasks = useMemo(() => {
    if (!task_list) return [];
    return task_list
      .filter((task) => task.is_completed)
      .sort((a, b) => {
        // Sort by completion date (most recent first)
        const dateA = a.completedAt || a.updatedAt || a.date;
        const dateB = b.completedAt || b.updatedAt || b.date;
        return new Date(dateB) - new Date(dateA);
      });
  }, [task_list]);

  // Get subject for task
  const getSubjectForTask = useCallback(
    (subjectId) => {
      return subject_list?.find((s) => s.id === subjectId);
    },
    [subject_list]
  );

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Handlers
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadTasksFromStorage();
    setIsRefreshing(false);
  };

  const handleTaskPress = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleRestoreTask = async (task) => {
    Alert.alert(
      'Restore Task',
      `Are you sure you want to mark "${task.title}" as not completed?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          onPress: async () => {
            await uncompleteTask(task.id);
          },
        },
      ]
    );
  };

  const handleDeleteTask = async (taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task permanently?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTask(taskId);
            setShowTaskModal(false);
            setSelectedTask(null);
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    if (completedTasks.length === 0) return;

    Alert.alert(
      'Clear All Completed',
      `Are you sure you want to delete all ${completedTasks.length} completed tasks? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            for (const task of completedTasks) {
              await deleteTask(task.id);
            }
          },
        },
      ]
    );
  };

  // Render task item
  const renderTaskItem = ({ item }) => {
    const subject = getSubjectForTask(item.subjectId);

    return (
      <TouchableOpacity
        style={[
          styles.taskCard,
          { borderLeftColor: subject?.color || colors.success },
        ]}
        onPress={() => handleTaskPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.taskHeader}>
          <View style={styles.completedIcon}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          </View>
          <View style={styles.taskInfo}>
            <Text style={styles.taskTitle} numberOfLines={2}>
              {item.title}
            </Text>
            {item.date && (
              <Text style={styles.taskDate}>
                <Ionicons name="calendar-outline" size={12} color={colors.textTertiary} />
                {' '}{formatDate(item.date)}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.restoreButton}
            onPress={() => handleRestoreTask(item)}
          >
            <Ionicons name="refresh-outline" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {subject && (
          <View style={styles.taskFooter}>
            <View
              style={[
                styles.subjectBadge,
                { backgroundColor: (subject.color || colors.primary) + '20' },
              ]}
            >
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
      </TouchableOpacity>
    );
  };

  // Loading state
  if (isLoading && !isRefreshing) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Completed Tasks</Text>
          <Text style={styles.headerSubtitle}>
            {completedTasks.length} {completedTasks.length === 1 ? 'task' : 'tasks'} completed
          </Text>
        </View>
        {completedTasks.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearAll}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>

      {completedTasks.length > 0 ? (
        <FlatList
          data={completedTasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
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
          <Ionicons name="checkmark-done-outline" size={64} color={colors.textTertiary} />
          <Text style={styles.emptyText}>No completed tasks yet</Text>
          <Text style={styles.emptySubtext}>
            Complete study tasks to see them here
          </Text>
        </View>
      )}

      <TaskDetailModal
        visible={showTaskModal}
        task={selectedTask}
        onClose={() => {
          setShowTaskModal(false);
          setSelectedTask(null);
        }}
        onDelete={handleDeleteTask}
        onComplete={handleRestoreTask}
        isCompleted
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  clearButton: {
    marginLeft: 'auto',
    padding: spacing.sm,
  },
  list: {
    paddingVertical: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  taskCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderLeftWidth: 4,
    ...shadows.small,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  completedIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  taskDate: {
    fontSize: typography.sizes.sm,
    color: colors.textTertiary,
    marginTop: 4,
  },
  restoreButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  taskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingLeft: 28,
  },
  subjectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  subjectText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: typography.sizes.md,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});

export default CompletedTask;
