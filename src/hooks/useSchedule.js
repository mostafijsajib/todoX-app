import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  addStudyBlock as addStudyBlockAction,
  updateStudyBlock as updateStudyBlockAction,
  deleteStudyBlock as deleteStudyBlockAction,
  setStudyBlocks,
  setLoading,
  setError,
} from '../store/Schedule/schedule';
import { storeDataLocalStorage, getDataLocalStorage } from '../utils/storage';
import { CustomAlert } from '../components/UI/CustomAlert';

// Storage key for study blocks
export const SCHEDULE_STORAGE_KEY = 'study_blocks';

/**
 * Custom hook for managing study blocks/timetable with Redux and AsyncStorage synchronization
 * Provides CRUD operations and schedule-specific utilities
 */
const useSchedule = () => {
  const dispatch = useDispatch();

  // Get schedule state from Redux store
  const { study_blocks, loading, error } = useSelector(
    (state) => state.schedule
  );

  /**
   * Load study blocks from AsyncStorage into Redux store
   */
  const loadStudyBlocksFromStorage = useCallback(async () => {
    try {
      const storedBlocks = await getDataLocalStorage(SCHEDULE_STORAGE_KEY);
      dispatch(setStudyBlocks(storedBlocks || []));
      return storedBlocks || [];
    } catch (error) {
      console.error('Error loading study blocks from storage:', error);
      dispatch(setError('Failed to load study blocks'));
      return [];
    }
  }, [dispatch]);

  /**
   * Save study blocks to AsyncStorage
   */
  const saveStudyBlocksToStorage = useCallback(
    async (blocksToSave) => {
      try {
        await storeDataLocalStorage(SCHEDULE_STORAGE_KEY, blocksToSave);
        return true;
      } catch (error) {
        console.error('Error saving study blocks to storage:', error);
        dispatch(setError('Failed to save study blocks to storage'));
        return false;
      }
    },
    [dispatch]
  );

  /**
   * Check if a time slot conflicts with existing blocks
   * Returns { hasConflict: boolean, conflictingBlock: StudyBlock | null }
   */
  const checkTimeConflict = useCallback(
    (dayOfWeek, startTime, endTime, excludeBlockId = null) => {
      const blocksForDay = study_blocks.filter(
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
    },
    [study_blocks]
  );

  /**
   * Add a new study block
   */
  const addStudyBlock = useCallback(
    async (blockData) => {
      try {
        dispatch(setLoading(true));

        // Check for time conflicts
        const conflict = checkTimeConflict(
          blockData.dayOfWeek,
          blockData.startTime,
          blockData.endTime
        );

        if (conflict.hasConflict) {
          CustomAlert({
            title: 'Time Conflict',
            message: `This time slot conflicts with an existing study block (${conflict.conflictingBlock.startTime} - ${conflict.conflictingBlock.endTime}).`,
            buttons: [{ text: 'OK' }],
          });

          return {
            success: false,
            error: 'Time conflict detected',
            conflict,
          };
        }

        // Create new study block with proper data structure
        const newBlock = {
          id: blockData.id || `block-${Date.now()}`,
          subjectId: blockData.subjectId,
          dayOfWeek: blockData.dayOfWeek, // 0-6 (Sunday-Saturday)
          startTime: blockData.startTime, // "14:00"
          endTime: blockData.endTime, // "16:00"
          location: blockData.location || '',
          notes: blockData.notes || '',
          isRecurring: blockData.isRecurring !== false, // Default true
          color: blockData.color || null, // Inherit from subject if null
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Get updated blocks list
        const updatedBlocks = [...study_blocks, newBlock];

        // Save to AsyncStorage first
        const success = await saveStudyBlocksToStorage(updatedBlocks);

        if (success) {
          // Update Redux store
          dispatch(addStudyBlockAction(newBlock));
          dispatch(setError(null));
          return { success: true, block: newBlock };
        }

        return { success: false, error: 'Failed to save to storage' };
      } catch (error) {
        console.error('Error adding study block:', error);
        dispatch(setError('Failed to add study block'));
        return { success: false, error: error.message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, study_blocks, checkTimeConflict, saveStudyBlocksToStorage]
  );

  /**
   * Update an existing study block
   * Can be called with (blockId, updates) or (blockObject)
   */
  const updateStudyBlock = useCallback(
    async (blockIdOrObject, updates) => {
      try {
        dispatch(setLoading(true));

        // Support both calling patterns
        let blockId, blockUpdates;
        if (typeof blockIdOrObject === 'object' && blockIdOrObject.id) {
          // Called with block object
          blockId = blockIdOrObject.id;
          blockUpdates = blockIdOrObject;
        } else {
          // Called with (blockId, updates)
          blockId = blockIdOrObject;
          blockUpdates = updates;
        }

        const blockIndex = study_blocks.findIndex((b) => b.id === blockId);

        if (blockIndex === -1) {
          throw new Error('Study block not found');
        }

        const currentBlock = study_blocks[blockIndex];

        // If time is being updated, check for conflicts
        if (
          blockUpdates.startTime ||
          blockUpdates.endTime ||
          blockUpdates.dayOfWeek !== undefined
        ) {
          const newStartTime = blockUpdates.startTime || currentBlock.startTime;
          const newEndTime = blockUpdates.endTime || currentBlock.endTime;
          const newDayOfWeek =
            blockUpdates.dayOfWeek !== undefined
              ? blockUpdates.dayOfWeek
              : currentBlock.dayOfWeek;

          const conflict = checkTimeConflict(
            newDayOfWeek,
            newStartTime,
            newEndTime,
            blockId
          );

          if (conflict.hasConflict) {
            CustomAlert({
              title: 'Time Conflict',
              message: `This time slot conflicts with an existing study block (${conflict.conflictingBlock.startTime} - ${conflict.conflictingBlock.endTime}).`,
              buttons: [{ text: 'OK' }],
            });

            return {
              success: false,
              error: 'Time conflict detected',
              conflict,
            };
          }
        }

        // Create updated block
        const updatedBlock = {
          ...currentBlock,
          ...blockUpdates,
          updated_at: new Date().toISOString(),
        };

        // Create new blocks array with the update
        const updatedBlocks = [...study_blocks];
        updatedBlocks[blockIndex] = updatedBlock;

        // Save to AsyncStorage first
        const success = await saveStudyBlocksToStorage(updatedBlocks);

        if (success) {
          // Update Redux store
          dispatch(updateStudyBlockAction(updatedBlock));
          dispatch(setError(null));
          return { success: true, block: updatedBlock };
        }

        return { success: false, error: 'Failed to save to storage' };
      } catch (error) {
        console.error('Error updating study block:', error);
        dispatch(setError('Failed to update study block'));
        return { success: false, error: error.message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, study_blocks, checkTimeConflict, saveStudyBlocksToStorage]
  );

  /**
   * Delete a study block
   */
  const deleteStudyBlock = useCallback(
    async (blockId) => {
      try {
        dispatch(setLoading(true));

        // Remove block from list
        const updatedBlocks = study_blocks.filter((b) => b.id !== blockId);

        // Save to AsyncStorage first
        const success = await saveStudyBlocksToStorage(updatedBlocks);

        if (success) {
          // Update Redux store
          dispatch(deleteStudyBlockAction(blockId));
          dispatch(setError(null));
          return { success: true };
        }

        return { success: false, error: 'Failed to save to storage' };
      } catch (error) {
        console.error('Error deleting study block:', error);
        dispatch(setError('Failed to delete study block'));
        return { success: false, error: error.message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, study_blocks, saveStudyBlocksToStorage]
  );

  /**
   * Get study blocks for a specific day of week (0-6, Sunday-Saturday)
   * Returns blocks sorted by start time
   */
  const getBlocksForDay = useCallback(
    (dayOfWeek) => {
      return study_blocks
        .filter((block) => block.dayOfWeek === dayOfWeek)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    },
    [study_blocks]
  );

  /**
   * Get study blocks for a specific subject
   */
  const getBlocksBySubject = useCallback(
    (subjectId) => {
      return study_blocks.filter((block) => block.subjectId === subjectId);
    },
    [study_blocks]
  );

  /**
   * Get currently active study block (for current day and time)
   */
  const getCurrentBlock = useCallback(() => {
    const now = new Date();
    const currentDay = now.getDay(); // 0-6
    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

    return study_blocks.find((block) => {
      return (
        block.dayOfWeek === currentDay &&
        block.startTime <= currentTime &&
        block.endTime >= currentTime
      );
    });
  }, [study_blocks]);

  /**
   * Get next upcoming study block today
   */
  const getNextBlock = useCallback(() => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.toTimeString().slice(0, 5);

    const upcomingBlocks = study_blocks
      .filter(
        (block) => block.dayOfWeek === currentDay && block.startTime > currentTime
      )
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    return upcomingBlocks[0] || null;
  }, [study_blocks]);

  /**
   * Get study block by ID
   */
  const getBlockById = useCallback(
    (blockId) => {
      return study_blocks.find((b) => b.id === blockId);
    },
    [study_blocks]
  );

  return {
    // State
    studyBlocks: study_blocks,
    loading,
    error,

    // CRUD operations
    loadStudyBlocksFromStorage,
    addStudyBlock,
    updateStudyBlock,
    deleteStudyBlock,

    // Utility functions
    getBlockById,
    getBlocksForDay,
    getBlocksBySubject,
    checkTimeConflict,
    getCurrentBlock,
    getNextBlock,
  };
};

export default useSchedule;
