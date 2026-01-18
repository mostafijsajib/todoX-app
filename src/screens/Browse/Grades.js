import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/Colors';
import { useGrades, useSubjects } from '@/hooks';
import { useToast } from '@/components/UI';
import { GradeFormModal, GradeCard, GPASummaryCard } from '@/components/Grades';
import { selectAllSubjects } from '@/store/Subject/subject';

/**
 * Grades Screen
 * Track academic grades, calculate GPA, and view grade history
 */
const Grades = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const subjects = useSelector(selectAllSubjects);

  // Grade hook
  const {
    grades,
    semesters,
    currentSemester,
    overallGPA,
    loading,
    loadGrades,
    addGrade,
    updateGrade,
    deleteGrade,
    setActiveSemester,
    getGradeStats,
  } = useGrades();

  // Local state
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Load data on mount
  useEffect(() => {
    loadGrades();
  }, []);

  // Get grade statistics
  const stats = useMemo(() => getGradeStats(), [grades]);

  // Filter grades
  const filteredGrades = useMemo(() => {
    let result = [...grades];
    
    if (selectedFilter === 'semester' && currentSemester) {
      result = result.filter((g) => g.semester === currentSemester);
    } else if (selectedFilter !== 'all') {
      result = result.filter((g) => g.type === selectedFilter);
    }
    
    // Sort by date (newest first)
    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [grades, selectedFilter, currentSemester]);

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadGrades();
    setRefreshing(false);
  };

  const handleAddGrade = async (gradeData) => {
    const result = await addGrade(gradeData);
    if (result) {
      toast.success('Grade added successfully!');
    } else {
      toast.error('Failed to add grade');
    }
  };

  const handleUpdateGrade = async (gradeData) => {
    const result = await updateGrade(gradeData.id, gradeData);
    if (result) {
      toast.success('Grade updated successfully!');
    } else {
      toast.error('Failed to update grade');
    }
  };

  const handleDeleteGrade = (gradeId) => {
    Alert.alert(
      'Delete Grade',
      'Are you sure you want to delete this grade?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteGrade(gradeId);
            if (result) {
              toast.success('Grade deleted');
            } else {
              toast.error('Failed to delete grade');
            }
          },
        },
      ]
    );
  };

  const handleEditGrade = (grade) => {
    setEditingGrade(grade);
    setShowForm(true);
  };

  const handleFormSubmit = (gradeData) => {
    if (editingGrade) {
      handleUpdateGrade(gradeData);
    } else {
      handleAddGrade(gradeData);
    }
    setEditingGrade(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGrade(null);
  };

  // Filter options
  const filterOptions = [
    { id: 'all', label: 'All', icon: 'grid' },
    { id: 'exam', label: 'Exams', icon: 'document-text' },
    { id: 'assignment', label: 'Assignments', icon: 'clipboard' },
    { id: 'quiz', label: 'Quizzes', icon: 'help-circle' },
    { id: 'project', label: 'Projects', icon: 'folder' },
  ];

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* GPA Summary Card */}
      <GPASummaryCard
        gpa={overallGPA}
        totalGrades={stats.totalGrades}
        averageScore={stats.averageScore}
        subjectsCount={stats.subjectsWithGrades}
      />

      {/* Filter Pills */}
      <View style={styles.filterContainer}>
        <FlatList
          data={filterOptions}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterPill,
                selectedFilter === item.id && styles.filterPillActive,
              ]}
              onPress={() => setSelectedFilter(item.id)}
            >
              <Ionicons
                name={item.icon}
                size={14}
                color={selectedFilter === item.id ? colors.white : colors.textSecondary}
              />
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === item.id && styles.filterTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {selectedFilter === 'all' ? 'All Grades' : `${filterOptions.find(f => f.id === selectedFilter)?.label || 'Grades'}`}
        </Text>
        <Text style={styles.gradeCount}>{filteredGrades.length} records</Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="school-outline" size={64} color={colors.textTertiary} />
      <Text style={styles.emptyTitle}>No Grades Yet</Text>
      <Text style={styles.emptyText}>
        Start tracking your academic performance by adding your first grade.
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => setShowForm(true)}
      >
        <Ionicons name="add" size={20} color={colors.white} />
        <Text style={styles.emptyButtonText}>Add First Grade</Text>
      </TouchableOpacity>
    </View>
  );

  const renderGradeItem = ({ item }) => {
    const subject = subjects.find((s) => s.id === item.subjectId);
    return (
      <GradeCard
        grade={item}
        subject={subject}
        onPress={() => handleEditGrade(item)}
        onDelete={() => handleDeleteGrade(item.id)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Grades & GPA</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(true)}
        >
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <FlatList
        data={filteredGrades}
        keyExtractor={(item) => item.id}
        renderItem={renderGradeItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={grades.length === 0 ? renderEmptyState : null}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      />

      {/* FAB */}
      {grades.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowForm(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color={colors.white} />
        </TouchableOpacity>
      )}

      {/* Grade Form Modal */}
      <GradeFormModal
        visible={showForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        subjects={subjects}
        initialData={editingGrade}
        currentSemester={currentSemester}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  addButton: {
    padding: spacing.xs,
  },
  headerContainer: {
    paddingBottom: spacing.md,
  },
  filterContainer: {
    marginTop: spacing.md,
  },
  filterList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  filterTextActive: {
    color: colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  gradeCount: {
    fontSize: typography.sizes.sm,
    color: colors.textTertiary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  emptyButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.colored,
  },
});

export default Grades;
