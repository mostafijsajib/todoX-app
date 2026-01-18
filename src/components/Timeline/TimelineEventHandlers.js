import { useCallback } from 'react';
import { Alert } from 'react-native';
import useTasks from '@/hooks/useTasks';

/**
 * useTimelineEventHandlers Hook
 * Custom hook for handling Timeline events and interactions
 */
export const useTimelineEventHandlers = ({
  setShowMenu,
  setShowTaskModal,
  setSelectedTask,
  setFilterBy,
  setIsRefreshing,
  task_list,
}) => {
  const { updateTask, deleteTask, loadTasksFromStorage } = useTasks();

  const handleEventPress = useCallback((event) => {
    const task = task_list?.find(t => t.id === event.id);
    if (task) {
      setSelectedTask(task);
      setShowTaskModal(true);
    }
  }, [task_list, setSelectedTask, setShowTaskModal]);

  const handleDateChange = useCallback((date) => {
    return date;
  }, []);

  const handleFilterChange = useCallback((filter) => {
    setFilterBy(filter);
    setShowMenu(false);
  }, [setFilterBy, setShowMenu]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadTasksFromStorage();
    setIsRefreshing(false);
  }, [loadTasksFromStorage, setIsRefreshing]);

  const handleUpdateTask = useCallback(async (updatedTask) => {
    try {
      const success = await updateTask(updatedTask.id, updatedTask);
      if (!success) {
        Alert.alert('Error', 'Failed to update task');
      }
      return success;
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Failed to update task');
      return false;
    }
  }, [updateTask]);

  const handleDeleteTask = useCallback(async (taskId) => {
    try {
      const success = await deleteTask(taskId);
      if (success) {
        setShowTaskModal(false);
        setSelectedTask(null);
      } else {
        Alert.alert('Error', 'Failed to delete task');
      }
      return success;
    } catch (error) {
      console.error('Error deleting task:', error);
      Alert.alert('Error', 'Failed to delete task');
      return false;
    }
  }, [deleteTask, setShowTaskModal, setSelectedTask]);

  const handleCloseTaskModal = useCallback(() => {
    setShowTaskModal(false);
    setSelectedTask(null);
  }, [setShowTaskModal, setSelectedTask]);

  const handleToggleMenu = useCallback(() => {
    setShowMenu(prev => !prev);
  }, [setShowMenu]);

  const handleCloseMenu = useCallback(() => {
    setShowMenu(false);
  }, [setShowMenu]);

  return {
    handleEventPress,
    handleDateChange,
    handleFilterChange,
    handleRefresh,
    handleUpdateTask,
    handleDeleteTask,
    handleCloseTaskModal,
    handleToggleMenu,
    handleCloseMenu,
  };
};

export default useTimelineEventHandlers;
