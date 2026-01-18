import { storeDataLocalStorage, getDataLocalStorage } from './storage';

// Migration version to track which migrations have been run
const MIGRATION_VERSION = 'migration_v1_student_planner';

/**
 * Default subject icons based on common category names
 */
const categoryToIconMap = {
  work: 'briefcase-outline',
  personal: 'person-outline',
  shopping: 'cart-outline',
  health: 'fitness-outline',
  finance: 'cash-outline',
  learning: 'book-outline',
  // Fallback for student subjects
  math: 'calculator-outline',
  science: 'flask-outline',
  english: 'library-outline',
  history: 'time-outline',
  art: 'color-palette-outline',
};

/**
 * Default subject colors palette
 */
const defaultColors = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#10B981', // Green
  '#F59E0B', // Orange
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#EF4444', // Red
  '#06B6D4', // Cyan
];

/**
 * Generate a unique ID
 */
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get icon for category/subject name
 */
const getIconForName = (name) => {
  const lowerName = name?.toLowerCase() || '';
  return categoryToIconMap[lowerName] || 'book-outline';
};

/**
 * Main migration function: Convert TodoX to Student Study Planner
 * This runs ONCE on first launch after updating to the new version
 */
export const migrateToStudyPlanner = async () => {
  try {
    console.log('[Migration] Checking if migration is needed...');

    // 1. Check if migration has already been run
    const migrationCompleted = await getDataLocalStorage(MIGRATION_VERSION);
    if (migrationCompleted) {
      console.log('[Migration] Already completed. Skipping.');
      return { success: true, alreadyMigrated: true };
    }

    console.log('[Migration] Starting migration to Student Study Planner...');

    // 2. Create backup of existing data
    console.log('[Migration] Creating backup...');
    const tasks = (await getDataLocalStorage('tasks')) || [];
    const completedTasks = (await getDataLocalStorage('completed_tasks')) || [];
    const categories = (await getDataLocalStorage('categories')) || [];

    await storeDataLocalStorage('backup_tasks', tasks);
    await storeDataLocalStorage('backup_completed_tasks', completedTasks);
    await storeDataLocalStorage('backup_categories', categories);

    // 3. Create default subjects from existing categories
    console.log('[Migration] Creating subjects from categories...');
    const defaultSubjects = categories.map((cat, index) => ({
      id: `subject-${generateId()}`,
      name: cat.label || cat.value || cat.name || 'General',
      color: cat.color || defaultColors[index % defaultColors.length],
      icon: cat.icon || getIconForName(cat.label || cat.value),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Add a default "General" subject if no categories exist
    if (defaultSubjects.length === 0) {
      defaultSubjects.push({
        id: `subject-${generateId()}`,
        name: 'General',
        color: '#6366F1', // Indigo
        icon: 'book-outline',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    // 4. Create a mapping from old category names to new subject IDs
    const categoryToSubjectMap = {};
    categories.forEach((cat, index) => {
      const categoryKey = cat.value || cat.label || cat.name || 'Inbox';
      categoryToSubjectMap[categoryKey] = defaultSubjects[index]?.id || defaultSubjects[0].id;
    });

    // Add fallback mapping for common categories
    const generalSubjectId = defaultSubjects[0].id;
    categoryToSubjectMap['Inbox'] = generalSubjectId;
    categoryToSubjectMap['inbox'] = generalSubjectId;

    console.log('[Migration] Category to Subject mapping:', categoryToSubjectMap);

    // 5. Migrate tasks to new structure with student fields
    console.log('[Migration] Migrating tasks...');
    const migratedTasks = tasks.map((task) => {
      const category = task.category || 'Inbox';
      const subjectId = categoryToSubjectMap[category] || generalSubjectId;

      return {
        // Keep existing fields
        id: task.id,
        title: task.title,
        summary: task.summary || '',
        priority: task.priority || 'medium',
        reminder: task.reminder || false,
        date: task.date || new Date().toISOString().split('T')[0],
        startTime: task.startTime || null,
        endTime: task.endTime || null,
        subTask: task.subTask || [],
        is_completed: task.is_completed || false,
        completed_timestamp: task.completed_timestamp || null,
        created_at: task.created_at || new Date().toISOString(),
        updated_at: task.updated_at || new Date().toISOString(),

        // NEW: Add student-focused fields
        subjectId: subjectId, // Map from category
        examId: null, // No exam links initially
        type: 'other', // Default task type
        estimatedDuration: 60, // Default 1 hour
        difficulty: 'medium', // Default difficulty
        notes: '', // Empty notes initially

        // REMOVE: Don't include category field anymore (replaced by subjectId)
      };
    });

    // 6. Migrate completed tasks similarly
    const migratedCompletedTasks = completedTasks.map((task) => {
      const category = task.category || 'Inbox';
      const subjectId = categoryToSubjectMap[category] || generalSubjectId;

      return {
        ...task,
        subjectId: subjectId,
        examId: null,
        type: 'other',
        estimatedDuration: 60,
        difficulty: 'medium',
        notes: '',
      };
    });

    // 7. Initialize empty exams and study blocks
    console.log('[Migration] Initializing empty exams and study blocks...');
    const emptyExams = [];
    const emptyStudyBlocks = [];

    // 8. Save all migrated data
    console.log('[Migration] Saving migrated data...');
    await storeDataLocalStorage('subjects', defaultSubjects);
    await storeDataLocalStorage('tasks', migratedTasks);
    await storeDataLocalStorage('completed_tasks', migratedCompletedTasks);
    await storeDataLocalStorage('exams', emptyExams);
    await storeDataLocalStorage('study_blocks', emptyStudyBlocks);

    // 9. Mark migration as complete
    await storeDataLocalStorage(MIGRATION_VERSION, true);

    console.log('[Migration] Migration completed successfully!');
    console.log(`[Migration] Migrated ${migratedTasks.length} tasks and ${migratedCompletedTasks.length} completed tasks`);
    console.log(`[Migration] Created ${defaultSubjects.length} subjects`);

    return {
      success: true,
      stats: {
        tasksMigrated: migratedTasks.length,
        completedTasksMigrated: migratedCompletedTasks.length,
        subjectsCreated: defaultSubjects.length,
      },
    };
  } catch (error) {
    console.error('[Migration] Error during migration:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Rollback migration (restore from backup)
 * Use only if migration fails
 */
export const rollbackMigration = async () => {
  try {
    console.log('[Migration] Rolling back migration...');

    const backupTasks = await getDataLocalStorage('backup_tasks');
    const backupCompletedTasks = await getDataLocalStorage('backup_completed_tasks');
    const backupCategories = await getDataLocalStorage('backup_categories');

    if (backupTasks) {
      await storeDataLocalStorage('tasks', backupTasks);
    }
    if (backupCompletedTasks) {
      await storeDataLocalStorage('completed_tasks', backupCompletedTasks);
    }
    if (backupCategories) {
      await storeDataLocalStorage('categories', backupCategories);
    }

    // Clear migration flag
    await storeDataLocalStorage(MIGRATION_VERSION, false);

    console.log('[Migration] Rollback completed');
    return { success: true };
  } catch (error) {
    console.error('[Migration] Error during rollback:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if migration is needed
 */
export const isMigrationNeeded = async () => {
  const migrationCompleted = await getDataLocalStorage(MIGRATION_VERSION);
  return !migrationCompleted;
};
