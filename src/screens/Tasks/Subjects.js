import { useState, useEffect, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { palette, radius, space, font } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import SubjectCard from '../../components/Subjects/SubjectCard';
import SubjectFormModal from '../../components/Subjects/SubjectFormModal';
import { useSubjects } from '../../hooks';

/**
 * 📚 Subjects Screen
 * Premium modern grid view with enhanced visuals and animations
 */
const Subjects = () => {
  const subjects = useSelector((state) => state.subject?.subjects || []);
  const tasks = useSelector((state) => state.task.task_list || []);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const { loadSubjectsFromStorage, addSubject, updateSubject } = useSubjects();

  useEffect(() => {
    loadSubjectsFromStorage();
  }, []);

  /**
   * Calculate overall stats
   */
  const overallStats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.is_completed || t.isCompleted).length;
    const subjectsWithTasks = new Set(tasks.map(t => t.subjectId)).size;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return { totalTasks, completedTasks, subjectsWithTasks, progress };
  }, [tasks]);

  /**
   * Get task counts for a subject
   */
  const getSubjectStats = (subjectId) => {
    const subjectTasks = tasks.filter(task => task.subjectId === subjectId);
    const completed = subjectTasks.filter(task => task.is_completed || task.isCompleted).length;
    const total = subjectTasks.length;

    return { total, completed };
  };

  /**
   * Handle subject press
   */
  const handleSubjectPress = (subject) => {
    setEditingSubject(subject);
    setShowSubjectForm(true);
  };
  /**
   * Handle form submission (create/edit subject)
   */
  const handleSubjectSubmit = async (subjectData) => {
    try {
      if (editingSubject) {
        // Update existing subject
        await updateSubject(editingSubject.id, subjectData);
      } else {
        // Create new subject
        await addSubject(subjectData);
      }
    } catch (error) {
      console.error('Error saving subject:', error);
      // You might want to show a toast or alert here
    }
  };
  /**
   * Handle long press on subject
   */
  const handleSubjectLongPress = (subject) => {
    setEditingSubject(subject);
    setShowSubjectForm(true);
  };

  /**
   * Handle add new subject
   */
  const handleAddSubject = () => {
    setEditingSubject(null);
    setShowSubjectForm(true);
  };

  /**
   * Render subject card
   */
  const renderSubject = ({ item, index }) => {
    const stats = getSubjectStats(item.id);

    return (
      <SubjectCard
        subject={item}
        taskCount={stats.total}
        completedCount={stats.completed}
        onPress={() => handleSubjectPress(item)}
        onLongPress={() => handleSubjectLongPress(item)}
        index={index}
      />
    );
  };

  /**
   * Render empty state - Modern and inviting
   */
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyCard}>
        <View style={styles.emptyIllustration}>
          <View style={styles.emptyIconCircle}>
            <View style={styles.emptyIconGradient}>
              <Ionicons name="library" size={44} color={palette.primary[500]} />
            </View>
          </View>
          {/* Floating decorative elements */}
          <View style={styles.emptyDecorativeElements}>
            <View style={[styles.decorativeShape, styles.shape1]} />
            <View style={[styles.decorativeShape, styles.shape2]} />
            <View style={[styles.decorativeShape, styles.shape3]} />
            <View style={[styles.decorativeShape, styles.shape4]} />
          </View>
        </View>
        <View style={styles.emptyContent}>
          <Text style={styles.emptyTitle}>Start Your Journey</Text>
          <Text style={styles.emptySubtitle}>
            Create your first subject to organize tasks and keep progress in view.
          </Text>
          <View style={styles.emptyHints}>
            <View style={styles.emptyHintItem}>
              <Ionicons name="checkmark" size={14} color={palette.success[600]} />
              <Text style={styles.emptyHintText}>Plan by subject and reduce overwhelm</Text>
            </View>
            <View style={styles.emptyHintItem}>
              <Ionicons name="time" size={14} color={palette.secondary[500]} />
              <Text style={styles.emptyHintText}>Track deadlines at a glance</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.emptyActionButton}
            onPress={handleAddSubject}
            activeOpacity={0.8}
          >
            <View style={styles.emptyActionContent}>
              <Ionicons name="add-circle" size={22} color="#FFFFFF" />
              <Text style={styles.emptyActionText}>Create Your First Subject</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  /**
   * Render header - Premium glassmorphism design with depth
   */
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={[palette.primary[50], '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerCard}
      >
        <View style={styles.headerTopRow}>
          <View style={styles.titleSection}>
            <View style={styles.headerBadge}>
              <Ionicons name="sparkles" size={12} color={palette.primary[600]} />
              <Text style={styles.headerBadgeText}>Study Planner</Text>
            </View>
            <Text style={styles.headerTitle}>Subjects</Text>
            <Text style={styles.headerSubtitle}>
              Track focus, progress, and workload
            </Text>
            <View style={styles.headerMetaRow}>
              <View style={styles.headerMetaItem}>
                <Ionicons name="albums" size={14} color={palette.primary[500]} />
                <Text style={styles.headerMetaText}>
                  {subjects.length} {subjects.length === 1 ? 'subject' : 'subjects'}
                </Text>
              </View>
              <View style={styles.headerMetaItem}>
                <Ionicons name="list" size={14} color={palette.gray[500]} />
                <Text style={styles.headerMetaText}>
                  {overallStats.totalTasks} {overallStats.totalTasks === 1 ? 'task' : 'tasks'}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddSubject}
            activeOpacity={0.7}
          >
            <View style={styles.addButtonGradient}>
              <Ionicons name="add" size={22} color="#FFFFFF" />
            </View>
            <Text style={styles.addButtonLabel}>New</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Overall Progress</Text>
            <Text style={styles.progressValue}>{overallStats.progress}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${overallStats.progress}%` },
              ]}
            />
          </View>
          <View style={styles.progressMetaRow}>
            <View style={styles.progressMetaItem}>
              <Ionicons name="list" size={14} color={palette.primary[500]} />
              <Text style={styles.progressMetaText}>{overallStats.totalTasks} tasks</Text>
            </View>
            <View style={styles.progressMetaItem}>
              <Ionicons name="checkmark-done" size={14} color={palette.success[600]} />
              <Text style={styles.progressMetaText}>{overallStats.completedTasks} done</Text>
            </View>
            <View style={styles.progressMetaItem}>
              <Ionicons name="albums" size={14} color={palette.secondary[500]} />
              <Text style={styles.progressMetaText}>{overallStats.subjectsWithTasks} active</Text>
            </View>
          </View>
        </View>

        {subjects.length > 0 && (
          <View style={styles.statsGrid}>
            <View style={styles.statPill}>
              <View style={[styles.statPillIcon, { backgroundColor: '#EEF2FF' }]}>
                <Ionicons name="folder" size={16} color={palette.primary[500]} />
              </View>
              <View>
                <Text style={styles.statPillValue}>{subjects.length}</Text>
                <Text style={styles.statPillLabel}>Subjects</Text>
              </View>
            </View>

            <View style={styles.statPill}>
              <View style={[styles.statPillIcon, { backgroundColor: '#F0FDFA' }]}>
                <Ionicons name="calendar" size={16} color={palette.secondary[500]} />
              </View>
              <View>
                <Text style={styles.statPillValue}>{overallStats.totalTasks - overallStats.completedTasks}</Text>
                <Text style={styles.statPillLabel}>Open Tasks</Text>
              </View>
            </View>

            <View style={styles.statPill}>
              <View style={[styles.statPillIcon, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="sparkles" size={16} color={palette.success[600]} />
              </View>
              <View>
                <Text style={styles.statPillValue}>{overallStats.progress}%</Text>
                <Text style={styles.statPillLabel}>Completion</Text>
              </View>
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={subjects}
        renderItem={renderSubject}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={subjects.length > 0 ? styles.columnWrapper : undefined}
        ListHeaderComponent={renderHeader()}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />

      {/* Subject Form Modal */}
      <SubjectFormModal
        visible={showSubjectForm}
        onClose={() => {
          setShowSubjectForm(false);
          setEditingSubject(null);
        }}
        onSubmit={handleSubjectSubmit}
        initialSubject={editingSubject}
        mode={editingSubject ? 'edit' : 'create'}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.gray[50],
  },
  headerContainer: {
    paddingHorizontal: space[4],
    paddingTop: space[5],
    paddingBottom: space[3],
  },
  headerCard: {
    borderRadius: radius.xl,
    padding: space[5],
    borderWidth: 1,
    borderColor: palette.gray[100],
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space[4],
  },
  titleSection: {
    flex: 1,
  },
  headerEyebrow: {
    fontSize: font.size.xs,
    color: palette.gray[500],
    fontWeight: font.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: font.size['2xl'],
    fontWeight: font.weight.bold,
    color: palette.gray[900],
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: font.size.sm,
    color: palette.gray[500],
    fontWeight: font.weight.medium,
    marginTop: 4,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  addButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.primary[500],
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: space[4],
    borderWidth: 1,
    borderColor: palette.gray[100],
    marginBottom: space[4],
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space[3],
  },
  progressLabel: {
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: palette.gray[700],
  },
  progressValue: {
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
    color: palette.primary[600],
  },
  progressTrack: {
    height: 8,
    backgroundColor: palette.gray[100],
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: palette.primary[500],
    borderRadius: 999,
  },
  progressMetaRow: {
    marginTop: space[3],
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressMetaText: {
    fontSize: font.size.xs,
    color: palette.gray[500],
    fontWeight: font.weight.medium,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: space[2],
  },
  statPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    padding: space[3],
    borderRadius: radius.lg,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: palette.gray[100],
  },
  statPillIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statPillValue: {
    fontSize: font.size.base,
    fontWeight: font.weight.bold,
    color: palette.gray[900],
  },
  statPillLabel: {
    fontSize: font.size.xs,
    color: palette.gray[500],
    fontWeight: font.weight.medium,
  },
  listContent: {
    paddingHorizontal: space[4],
    paddingTop: space[3],
    paddingBottom: 150,
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: space[4],
  },
  // Clean Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: space[6],
    paddingTop: space[12],
  },
  emptyCard: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: palette.gray[100],
    paddingHorizontal: space[5],
    paddingVertical: space[6],
  },
  emptyIllustration: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space[6],
    width: 120,
    height: 120,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: palette.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIconGradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyDecorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorativeShape: {
    position: 'absolute',
    borderRadius: 50,
  },
  shape1: {
    width: 20,
    height: 20,
    top: 0,
    right: 10,
    backgroundColor: palette.secondary[50],
  },
  shape2: {
    width: 16,
    height: 16,
    bottom: 20,
    left: 5,
    backgroundColor: palette.accent[50],
  },
  shape3: {
    width: 14,
    height: 14,
    top: 35,
    left: -5,
    backgroundColor: palette.primary[100],
  },
  shape4: {
    width: 12,
    height: 12,
    bottom: 5,
    right: -5,
    backgroundColor: palette.success[50],
  },
  emptyContent: {
    alignItems: 'center',
    gap: space[3],
    maxWidth: 300,
  },
  emptyHints: {
    width: '100%',
    gap: space[2],
    marginTop: space[2],
  },
  emptyHintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: palette.gray[50],
    borderRadius: radius.md,
    paddingHorizontal: space[3],
    paddingVertical: space[2],
  },
  emptyHintText: {
    fontSize: font.size.xs,
    color: palette.gray[600],
    fontWeight: font.weight.medium,
    flex: 1,
  },
  emptyTitle: {
    fontSize: font.size['2xl'],
    fontWeight: font.weight.bold,
    color: palette.gray[900],
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: font.size.sm,
    fontWeight: font.weight.normal,
    color: palette.gray[500],
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyActionButton: {
    marginTop: space[3],
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: palette.primary[500],
  },
  emptyActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space[6],
    paddingVertical: space[4],
    gap: space[2],
  },
  emptyActionText: {
    fontSize: font.size.base,
    fontWeight: font.weight.bold,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});

export default Subjects;
