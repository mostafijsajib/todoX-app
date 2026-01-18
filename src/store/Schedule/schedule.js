import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  study_blocks: [],
  loading: false,
  error: null,
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    // Set all study blocks (load from storage)
    setStudyBlocks: (state, action) => {
      state.study_blocks = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Add a new study block
    addStudyBlock: (state, action) => {
      state.study_blocks.push(action.payload);
      state.error = null;
    },

    // Update an existing study block
    updateStudyBlock: (state, action) => {
      const index = state.study_blocks.findIndex(
        (block) => block.id === action.payload.id
      );
      if (index !== -1) {
        state.study_blocks[index] = {
          ...state.study_blocks[index],
          ...action.payload,
          updated_at: new Date().toISOString(),
        };
      }
      state.error = null;
    },

    // Delete a study block
    deleteStudyBlock: (state, action) => {
      state.study_blocks = state.study_blocks.filter(
        (block) => block.id !== action.payload
      );
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
  },
});

// Export actions
export const {
  setStudyBlocks,
  addStudyBlock,
  updateStudyBlock,
  deleteStudyBlock,
  setLoading,
  setError,
  clearError,
} = scheduleSlice.actions;

// Selectors
export const selectAllStudyBlocks = (state) => state.schedule.study_blocks;

export const selectStudyBlockById = (state, blockId) =>
  state.schedule.study_blocks.find((block) => block.id === blockId);

// Get study blocks for a specific day of week (0-6, Sunday-Saturday)
export const selectStudyBlocksForDay = (state, dayOfWeek) =>
  state.schedule.study_blocks
    .filter((block) => block.dayOfWeek === dayOfWeek)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

// Get study blocks for a specific subject
export const selectStudyBlocksBySubject = (state, subjectId) =>
  state.schedule.study_blocks.filter((block) => block.subjectId === subjectId);

// Check if a time slot conflicts with existing blocks
export const selectTimeConflict = (state, dayOfWeek, startTime, endTime, excludeBlockId = null) => {
  const blocksForDay = state.schedule.study_blocks.filter(
    (block) => block.dayOfWeek === dayOfWeek && block.id !== excludeBlockId
  );

  const newStart = new Date(`1970-01-01T${startTime}`);
  const newEnd = new Date(`1970-01-01T${endTime}`);

  for (const block of blocksForDay) {
    const blockStart = new Date(`1970-01-01T${block.startTime}`);
    const blockEnd = new Date(`1970-01-01T${block.endTime}`);

    // Check for overlap: (StartA < EndB) and (EndA > StartB)
    if (newStart < blockEnd && newEnd > blockStart) {
      return {
        hasConflict: true,
        conflictingBlock: block,
      };
    }
  }

  return {
    hasConflict: false,
    conflictingBlock: null,
  };
};

// Get currently active study block (for current day and time)
export const selectCurrentStudyBlock = (state) => {
  const now = new Date();
  const currentDay = now.getDay(); // 0-6
  const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

  return state.schedule.study_blocks.find((block) => {
    return (
      block.dayOfWeek === currentDay &&
      block.startTime <= currentTime &&
      block.endTime >= currentTime
    );
  });
};

// Get next upcoming study block today
export const selectNextStudyBlock = (state) => {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.toTimeString().slice(0, 5);

  const upcomingBlocks = state.schedule.study_blocks
    .filter((block) => block.dayOfWeek === currentDay && block.startTime > currentTime)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return upcomingBlocks[0] || null;
};

export const selectScheduleLoading = (state) => state.schedule.loading;
export const selectScheduleError = (state) => state.schedule.error;

// Export reducer
export default scheduleSlice.reducer;
