import { createSlice, createSelector } from '@reduxjs/toolkit';

/**
 * Task Data Model for Student Study Planner
 * 
 * Task Structure:
 * {
 *   id: string,
 *   title: string,
 *   summary: string (optional description),
 *   subjectId: string (required - links to subject),
 *   examId: string (optional - links to exam),
 *   date: string (YYYY-MM-DD format),
 *   startTime: string (HH:mm format),
 *   endTime: string (HH:mm format),
 *   priority: 'high' | 'medium' | 'low',
 *   category: string (task type: study, assignment, revision, practice),
 *   reminder: boolean,
 *   reminderTime: string (minutes before),
 *   subTasks: Array<{ id, title, completed }>,
 *   is_completed: boolean,
 *   completed_timestamp: string | null,
 *   created_at: string,
 *   updated_at: string,
 * }
 */

const initialState = {
  task_list: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    // Set all tasks (load from storage)
    setTasks: (state, action) => {
      state.task_list = action.payload || [];
      state.loading = false;
      state.error = null;
    },

    // Add a new study task
    addTask: (state, action) => {
      state.task_list.unshift(action.payload);
      state.error = null;
    },

    // Update an existing task
    updateTask: (state, action) => {
      const index = state.task_list.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.task_list[index] = {
          ...state.task_list[index],
          ...action.payload,
          updated_at: new Date().toISOString(),
        };
      }
      state.error = null;
    },

    // Delete a task
    deleteTask: (state, action) => {
      state.task_list = state.task_list.filter(
        (task) => task.id !== action.payload
      );
      state.error = null;
    },

    // Mark task as complete
    completeTask: (state, action) => {
      const taskId = action.payload;
      const task = state.task_list.find((t) => t.id === taskId);
      if (task) {
        task.is_completed = true;
        task.completed_timestamp = new Date().toISOString();
        task.updated_at = new Date().toISOString();
      }
      state.error = null;
    },

    // Restore task (mark as incomplete)
    uncompleteTask: (state, action) => {
      const taskId = action.payload;
      const task = state.task_list.find((t) => t.id === taskId);
      if (task) {
        task.is_completed = false;
        task.completed_timestamp = null;
        task.updated_at = new Date().toISOString();
      }
      state.error = null;
    },

    // Bulk update tasks (for batch operations)
    bulkUpdateTasks: (state, action) => {
      const updatedTasks = action.payload;
      updatedTasks.forEach((updatedTask) => {
        const index = state.task_list.findIndex((task) => task.id === updatedTask.id);
        if (index !== -1) {
          state.task_list[index] = {
            ...state.task_list[index],
            ...updatedTask,
            updated_at: new Date().toISOString(),
          };
        }
      });
      state.error = null;
    },

    // Bulk delete tasks
    bulkDeleteTasks: (state, action) => {
      const taskIds = action.payload;
      state.task_list = state.task_list.filter(
        (task) => !taskIds.includes(task.id)
      );
      state.error = null;
    },

    // Link task to subject
    linkTaskToSubject: (state, action) => {
      const { taskId, subjectId } = action.payload;
      const task = state.task_list.find((t) => t.id === taskId);
      if (task) {
        task.subjectId = subjectId;
        task.updated_at = new Date().toISOString();
      }
      state.error = null;
    },

    // Link task to exam
    linkTaskToExam: (state, action) => {
      const { taskId, examId } = action.payload;
      const task = state.task_list.find((t) => t.id === taskId);
      if (task) {
        task.examId = examId;
        task.updated_at = new Date().toISOString();
      }
      state.error = null;
    },

    // Toggle subtask completion
    toggleSubTask: (state, action) => {
      const { taskId, subTaskId } = action.payload;
      const task = state.task_list.find((t) => t.id === taskId);
      if (task && task.subTasks) {
        const subTask = task.subTasks.find((st) => st.id === subTaskId);
        if (subTask) {
          subTask.completed = !subTask.completed;
          task.updated_at = new Date().toISOString();
        }
      }
      state.error = null;
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear all tasks
    clearTasks: (state) => {
      state.task_list = [];
      state.error = null;
    },
  },
});

// Export actions
export const {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  completeTask,
  uncompleteTask,
  bulkUpdateTasks,
  bulkDeleteTasks,
  linkTaskToSubject,
  linkTaskToExam,
  toggleSubTask,
  setLoading,
  setError,
  clearError,
  clearTasks,
} = taskSlice.actions;

// ============ SELECTORS ============

// Basic selectors
export const selectAllTasks = (state) => state.task.task_list;
export const selectTaskById = (state, taskId) =>
  state.task.task_list.find((task) => task.id === taskId);
export const selectTasksLoading = (state) => state.task.loading;
export const selectTasksError = (state) => state.task.error;

// Helper function to check if task is completed (handles both field names)
const isTaskCompleted = (task) => task.is_completed || task.isCompleted;

// ============ MEMOIZED SELECTORS ============

// Filter by subject (memoized)
export const selectTasksBySubject = createSelector(
  [selectAllTasks, (_, subjectId) => subjectId],
  (tasks, subjectId) => tasks.filter((task) => task.subjectId === subjectId)
);

// Filter by exam (memoized)
export const selectTasksByExam = createSelector(
  [selectAllTasks, (_, examId) => examId],
  (tasks, examId) => tasks.filter((task) => task.examId === examId)
);

// Completed tasks (memoized)
export const selectCompletedTasks = createSelector(
  [selectAllTasks],
  (tasks) => tasks.filter((task) => isTaskCompleted(task))
);

// Pending (incomplete) tasks (memoized)
export const selectPendingTasks = createSelector(
  [selectAllTasks],
  (tasks) => tasks.filter((task) => !isTaskCompleted(task))
);

// Today's tasks (memoized)
export const selectTodayTasks = createSelector(
  [selectAllTasks],
  (tasks) => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter((task) => {
      if (isTaskCompleted(task)) return false;
      return task.date === today;
    });
  }
);

// Overdue tasks (memoized)
export const selectOverdueTasks = createSelector(
  [selectAllTasks],
  (tasks) => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter((task) => {
      if (isTaskCompleted(task)) return false;
      return task.date && task.date < today;
    });
  }
);

// Upcoming tasks - next 7 days (memoized)
export const selectUpcomingTasks = createSelector(
  [selectAllTasks],
  (tasks) => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const todayStr = today.toISOString().split('T')[0];
    const nextWeekStr = nextWeek.toISOString().split('T')[0];
    
    return tasks.filter((task) => {
      if (isTaskCompleted(task)) return false;
      return task.date && task.date >= todayStr && task.date <= nextWeekStr;
    });
  }
);

// Tasks by priority (memoized)
export const selectTasksByPriority = createSelector(
  [selectAllTasks, (_, priority) => priority],
  (tasks, priority) => tasks.filter((task) => task.priority === priority && !isTaskCompleted(task))
);

// Today's Study Plan - today + overdue, sorted by priority (memoized)
export const selectTodaysStudyPlan = createSelector(
  [selectAllTasks],
  (tasks) => {
    const today = new Date().toISOString().split('T')[0];
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    
    return tasks
      .filter((task) => {
        if (isTaskCompleted(task)) return false;
        return task.date && task.date <= today;
      })
      .sort((a, b) => {
        // Sort by date first (overdue first), then by priority
        if (a.date !== b.date) {
          return a.date < b.date ? -1 : 1;
        }
        return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
      });
  }
);

// Task statistics (memoized)
export const selectTaskStats = createSelector(
  [selectAllTasks],
  (tasks) => {
    const completed = tasks.filter((t) => isTaskCompleted(t));
    const pending = tasks.filter((t) => !isTaskCompleted(t));
    const today = new Date().toISOString().split('T')[0];
    const overdue = pending.filter((t) => t.date && t.date < today);
    const todayTasks = pending.filter((t) => t.date === today);
    
    return {
      total: tasks.length,
      completed: completed.length,
      pending: pending.length,
      overdue: overdue.length,
      todayTasks: todayTasks.length,
      completionRate: tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0,
    };
  }
);

// Export reducer
export default taskSlice.reducer;
