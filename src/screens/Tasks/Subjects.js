import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { palette, gradients, radius, space, font, shadowPresets } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import SubjectCard from '../../components/Subjects/SubjectCard';
import SubjectFormModal from '../../components/Subjects/SubjectFormModal';
import { useSubjects } from '../../hooks';

const { width } = Dimensions.get('window');

/**
 * 📚 Subjects Screen
 * Beautiful grid view of all subjects with stats
 */
const Subjects = ({ navigation }) => {
  const subjects = useSelector((state) => state.subject?.subjects || []);
  const tasks = useSelector((state) => state.task.task_list || []);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const { loadSubjectsFromStorage } = useSubjects();

  // Animations
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;
  const statsScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    loadSubjectsFromStorage();
    
    // Header animation
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(headerSlide, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(statsScale, {
        toValue: 1,
        tension: 50,
        friction: 8,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
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
   * Render empty state - Modern and engaging
   */
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIllustration}>
        <View style={styles.emptyIconCircle}>
          <Ionicons name="library-outline" size={48} color={palette.primary[500]} />
        </View>
        <View style={styles.emptyDecorativeElements}>
          <View style={[styles.decorativeShape, styles.shape1]} />
          <View style={[styles.decorativeShape, styles.shape2]} />
          <View style={[styles.decorativeShape, styles.shape3]} />
        </View>
      </View>
      <View style={styles.emptyContent}>
        <Text style={styles.emptyTitle}>No subjects yet</Text>
        <Text style={styles.emptySubtitle}>
          Create subjects to organize your study tasks and track progress.
        </Text>
        <TouchableOpacity
          style={styles.emptyActionButton}
          onPress={handleAddSubject}
          activeOpacity={0.8}
        >
          <View style={styles.emptyActionContent}>
            <Ionicons name="add-circle" size={20} color={palette.primary[500]} />
            <Text style={styles.emptyActionText}>Create subject</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  /**
   * Render header - Modern glassmorphism design
   */
  const renderHeader = () => (
    <Animated.View
      style={[
        styles.headerContainer,
        {
          opacity: headerOpacity,
          transform: [{ translateY: headerSlide }],
        },
      ]}
    >
      <View style={styles.header}>
        {/* Title Row */}
        <View style={styles.titleRow}>
          <View style={styles.titleSection}>
            <Text style={styles.headerTitle}>Subjects</Text>
            <Text style={styles.headerSubtitle}>
              {subjects.length} subjects • {overallStats.totalTasks} tasks
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddSubject}
            activeOpacity={0.8}
          >
            <View style={styles.addButtonInner}>
              <Ionicons name="add" size={24} color={palette.primary[500]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Modern Stats Row */}
        {subjects.length > 0 && (
          <Animated.View
            style={[
              styles.statsRow,
              { transform: [{ scale: statsScale }] },
            ]}
          >
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{subjects.length}</Text>
              <Text style={styles.statLabel}>Subjects</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{overallStats.totalTasks}</Text>
              <Text style={styles.statLabel}>Tasks</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: palette.success[500] }]}>{overallStats.progress}%</Text>
              <Text style={styles.statLabel}>Complete</Text>
            </View>
          </Animated.View>
        )}
      </View>
    </Animated.View>
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
        ListHeaderComponent={renderHeader}
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
        subject={editingSubject}
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
    paddingHorizontal: space[5],
    paddingTop: space[4],
    paddingBottom: space[4],
  },
  header: {
    borderRadius: radius.xl,
    padding: space[4],
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: palette.gray[200],
    ...shadowPresets.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: space[4],
  },
  titleSection: {
    flex: 1,
  },
  headerTitle: {
    fontSize: font.size['3xl'],
    fontWeight: font.weight.extrabold,
    color: palette.gray[900],
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: font.size.sm,
    color: palette.gray[500],
    fontWeight: font.weight.medium,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  addButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.primary[50],
    borderWidth: 1,
    borderColor: palette.primary[200],
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.gray[50],
    borderRadius: radius.lg,
    paddingVertical: space[3],
    paddingHorizontal: space[4],
    borderWidth: 1,
    borderColor: palette.gray[200],
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: palette.gray[200],
  },
  statValue: {
    fontSize: font.size.xl,
    fontWeight: font.weight.bold,
    color: palette.gray[900],
    marginBottom: 2,
  },
  statLabel: {
    fontSize: font.size.xs,
    color: palette.gray[500],
    fontWeight: font.weight.semibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  listContent: {
    paddingHorizontal: space[4],
    paddingTop: space[4],
    paddingBottom: 120,
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: space[3],
  },
  // Modern Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: space[8],
    paddingTop: space[12],
  },
  emptyIllustration: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space[6],
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: palette.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    ...shadowPresets.sm,
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
    backgroundColor: palette.primary[50],
  },
  shape1: {
    width: 16,
    height: 16,
    top: -5,
    right: -5,
  },
  shape2: {
    width: 10,
    height: 10,
    bottom: 15,
    left: -8,
  },
  shape3: {
    width: 12,
    height: 12,
    top: 25,
    left: -10,
  },
  emptyContent: {
    alignItems: 'center',
    gap: space[3],
  },
  emptyTitle: {
    fontSize: font.size['2xl'],
    fontWeight: font.weight.bold,
    color: palette.gray[900],
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: font.size.sm,
    fontWeight: font.weight.normal,
    color: palette.gray[500],
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  emptyActionButton: {
    marginTop: space[3],
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: palette.primary[50],
    borderWidth: 1,
    borderColor: palette.primary[200],
  },
  emptyActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    gap: space[2],
  },
  emptyActionText: {
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: palette.primary[600],
    letterSpacing: 0.2,
  },
});

export default Subjects;
