import { useState, useEffect, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { palette, radius, space, font, gradients } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import ExamCard from '../../components/Exams/ExamCard';
import ExamFormModal from '../../components/Exams/ExamFormModal';
import { useExams } from '../../hooks';

/**
 * 🎓 Exams Screen - Redesigned
 * Premium exam tracker with countdown, stats, and motivation
 */
const Exams = () => {
  const exams = useSelector((state) => state.exam?.exams || []);
  const subjects = useSelector((state) => state.subject?.subjects || []);
  const [showExamForm, setShowExamForm] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [activeFilter, setActiveFilter] = useState('upcoming');
  const { loadExamsFromStorage } = useExams();

  useEffect(() => {
    loadExamsFromStorage();
  }, []);

  /**
   * Get subject by ID
   */
  const getSubject = (subjectId) => {
    return subjects.find(s => s.id === subjectId);
  };

  /**
   * Sort exams by date
   */
  const sortedExams = [...exams].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  /**
   * Get exam statistics
   */
  const examStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = sortedExams.filter(e => new Date(e.date) >= today);
    const past = sortedExams.filter(e => new Date(e.date) < today);
    const thisWeek = upcoming.filter(e => {
      const examDate = new Date(e.date);
      const weekFromNow = new Date(today);
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return examDate <= weekFromNow;
    });
    const urgent = upcoming.filter(e => {
      const examDate = new Date(e.date);
      const diffDays = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 3;
    });

    return { upcoming, past, thisWeek, urgent, total: exams.length };
  }, [sortedExams]);

  /**
   * Get filtered exams
   */
  const filteredExams = useMemo(() => {
    if (activeFilter === 'upcoming') return examStats.upcoming;
    if (activeFilter === 'thisWeek') return examStats.thisWeek;
    if (activeFilter === 'past') return examStats.past;
    return sortedExams;
  }, [activeFilter, examStats, sortedExams]);

  /**
   * Get next exam (closest upcoming)
   */
  const nextExam = examStats.upcoming.length > 0 ? examStats.upcoming[0] : null;

  /**
   * Handle exam press
   */
  const handleExamPress = (exam) => {
    setEditingExam(exam);
    setShowExamForm(true);
  };

  /**
   * Handle add exam
   */
  const handleAddExam = () => {
    setEditingExam(null);
    setShowExamForm(true);
  };

  /**
   * Render exam card
   */
  const renderExam = ({ item, index }) => {
    const subject = getSubject(item.subjectId);
    // Skip next exam if it's already shown in highlight
    if (nextExam && item.id === nextExam.id && activeFilter === 'upcoming') {
      return null;
    }

    return (
      <ExamCard
        exam={item}
        subject={subject}
        onPress={() => handleExamPress(item)}
        index={index}
      />
    );
  };

  /**
   * Render empty state
   */
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyContent}>
        <LinearGradient
          colors={['#EEF2FF', '#E0E7FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.emptyIconContainer}
        >
          <Ionicons name="ribbon" size={52} color={palette.primary[500]} />
        </LinearGradient>

        <Text style={styles.emptyTitle}>No Exams Yet</Text>
        <Text style={styles.emptySubtitle}>
          Add your upcoming exams to stay organized and track your preparation progress.
        </Text>

        <TouchableOpacity
          style={styles.emptyButton}
          onPress={handleAddExam}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.emptyButtonGradient}
          >
            <Ionicons name="add-circle" size={20} color="#FFFFFF" />
            <Text style={styles.emptyButtonText}>Add Your First Exam</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  /**
   * Render stats cards
   */
  const renderStatsCards = () => {
    if (exams.length === 0) return null;

    return (
      <View style={styles.statsContainer}>
        {/* Total Exams */}
        <View style={styles.statCard}>
          <LinearGradient
            colors={['#EEF2FF', '#E0E7FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statIconBg}
          >
            <Ionicons name="ribbon" size={20} color={palette.primary[500]} />
          </LinearGradient>
          <Text style={styles.statValue}>{examStats.total}</Text>
          <Text style={styles.statLabel}>TOTAL</Text>
        </View>

        {/* Upcoming Exams */}
        <View style={styles.statCard}>
          <LinearGradient
            colors={['#ECFDF5', '#D1FAE5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statIconBg}
          >
            <Ionicons name="calendar" size={20} color={palette.success[500]} />
          </LinearGradient>
          <Text style={styles.statValue}>{examStats.upcoming.length}</Text>
          <Text style={styles.statLabel}>UPCOMING</Text>
        </View>

        {/* Urgent Exams */}
        <View style={styles.statCard}>
          <LinearGradient
            colors={examStats.urgent.length > 0 ? ['#FFF1F2', '#FFE4E6'] : ['#F8FAFC', '#F1F5F9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statIconBg}
          >
            <Ionicons
              name={examStats.urgent.length > 0 ? "flame" : "checkmark-circle"}
              size={20}
              color={examStats.urgent.length > 0 ? palette.error[500] : palette.gray[400]}
            />
          </LinearGradient>
          <Text style={[
            styles.statValue,
            examStats.urgent.length > 0 && { color: palette.error[600] }
          ]}>
            {examStats.urgent.length}
          </Text>
          <Text style={styles.statLabel}>URGENT</Text>
        </View>
      </View>
    );
  };

  /**
   * Render header with stats
   */
  const renderHeader = () => (
    <View style={styles.header}>
      {/* Title Row */}
      <View style={styles.titleRow}>
        <View style={styles.titleSection}>
          <View style={styles.titleWithIcon}>
            <LinearGradient
              colors={gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.titleIconContainer}
            >
              <Ionicons name="ribbon" size={24} color="#FFFFFF" />
            </LinearGradient>
            <View>
              <Text style={styles.headerTitle}>My Exams</Text>
              <Text style={styles.headerSubtitle}>
                {examStats.upcoming.length} upcoming
                {examStats.urgent.length > 0 && ` • ${examStats.urgent.length} urgent`}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddExam}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addButtonGradient}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      {renderStatsCards()}

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {[
          { key: 'upcoming', label: 'Upcoming', count: examStats.upcoming.length, icon: 'calendar' },
          { key: 'thisWeek', label: 'This Week', count: examStats.thisWeek.length, icon: 'flame' },
          { key: 'past', label: 'Completed', count: examStats.past.length, icon: 'checkmark-circle' },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterTab,
              activeFilter === filter.key && styles.filterTabActive,
            ]}
            onPress={() => setActiveFilter(filter.key)}
            activeOpacity={0.7}
            accessibilityLabel={`Filter ${filter.label}`}
            accessibilityRole="button"
          >
            <Ionicons
              name={filter.icon}
              size={16}
              color={activeFilter === filter.key ? palette.primary[600] : palette.gray[500]}
            />
            <Text
              style={[
                styles.filterTabText,
                activeFilter === filter.key && styles.filterTabTextActive,
              ]}
            >
              {filter.label}
            </Text>
            <View
              style={[
                styles.filterBadge,
                activeFilter === filter.key && styles.filterBadgeActive,
              ]}
            >
              <Text
                style={[
                  styles.filterBadgeText,
                  activeFilter === filter.key && styles.filterBadgeTextActive,
                ]}
              >
                {filter.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  /**
   * Render next exam highlight
   */
  const renderNextExam = () => {
    if (!nextExam || activeFilter !== 'upcoming') return null;

    const subject = getSubject(nextExam.subjectId);

    return (
      <View style={styles.nextExamContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <LinearGradient
              colors={['#FFF7ED', '#FFEDD5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sectionIconBg}
            >
              <Ionicons name="flash" size={14} color={palette.warning[500]} />
            </LinearGradient>
            <Text style={styles.sectionTitle}>Next Up</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Focus on this one!</Text>
        </View>
        <ExamCard
          exam={nextExam}
          subject={subject}
          onPress={() => handleExamPress(nextExam)}
          variant="large"
          index={0}
        />
      </View>
    );
  };

  /**
   * Render section header for remaining exams
   */
  const renderSectionHeader = () => {
    if (!nextExam || activeFilter !== 'upcoming' || filteredExams.length <= 1) return null;

    return (
      <View style={styles.upcomingHeader}>
        <Text style={styles.upcomingTitle}>More Exams</Text>
        <View style={styles.upcomingBadge}>
          <Text style={styles.upcomingCount}>
            {filteredExams.length - 1}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={filteredExams}
        renderItem={renderExam}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <>
            {renderHeader()}
            {renderNextExam()}
            {renderSectionHeader()}
          </>
        )}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />

      {/* Exam Form Modal */}
      <ExamFormModal
        visible={showExamForm}
        onClose={() => {
          setShowExamForm(false);
          setEditingExam(null);
        }}
        exam={editingExam}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.gray[50],
  },
  header: {
    paddingHorizontal: space[4],
    paddingTop: space[4],
    paddingBottom: space[3],
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space[4],
  },
  titleSection: {
    flex: 1,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  titleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: font.size['2xl'],
    fontWeight: font.weight.bold,
    color: palette.gray[900],
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: font.size.sm,
    color: palette.gray[500],
    marginTop: 2,
    fontWeight: font.weight.medium,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  addButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Stats Cards
  statsContainer: {
    flexDirection: 'row',
    gap: space[3],
    marginBottom: space[4],
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: space[3],
    alignItems: 'center',
    gap: space[1],
    borderWidth: 1,
    borderColor: palette.gray[100],
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space[1],
  },
  statValue: {
    fontSize: font.size.xl,
    fontWeight: font.weight.bold,
    color: palette.gray[900],
  },
  statLabel: {
    fontSize: font.size['2xs'],
    fontWeight: font.weight.bold,
    color: palette.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Filter Tabs
  filterContainer: {
    marginTop: space[2],
  },
  filterContent: {
    gap: space[2],
    paddingRight: space[4],
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingHorizontal: space[4],
    paddingVertical: space[2],
    borderRadius: radius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: palette.gray[200],
  },
  filterTabActive: {
    backgroundColor: palette.primary[50],
    borderColor: palette.primary[400],
  },
  filterTabText: {
    fontSize: font.size.sm,
    fontWeight: font.weight.medium,
    color: palette.gray[600],
  },
  filterTabTextActive: {
    color: palette.primary[700],
    fontWeight: font.weight.bold,
  },
  filterBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: palette.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space[1.5],
  },
  filterBadgeActive: {
    backgroundColor: palette.primary[500],
  },
  filterBadgeText: {
    fontSize: font.size['2xs'],
    fontWeight: font.weight.bold,
    color: palette.gray[600],
  },
  filterBadgeTextActive: {
    color: '#FFFFFF',
  },

  // Content
  listContent: {
    paddingHorizontal: space[4],
    paddingBottom: 100,
  },

  // Next Exam Section
  nextExamContainer: {
    marginBottom: space[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space[3],
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  sectionIconBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: font.size.base,
    fontWeight: font.weight.bold,
    color: palette.gray[900],
  },
  sectionSubtitle: {
    fontSize: font.size.sm,
    color: palette.gray[500],
    fontWeight: font.weight.medium,
  },

  // Upcoming Header
  upcomingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    marginBottom: space[3],
    marginTop: space[2],
  },
  upcomingTitle: {
    fontSize: font.size.base,
    fontWeight: font.weight.bold,
    color: palette.gray[900],
  },
  upcomingBadge: {
    backgroundColor: palette.primary[100],
    paddingHorizontal: space[2],
    paddingVertical: space[0.5],
    borderRadius: radius.full,
  },
  upcomingCount: {
    fontSize: font.size.xs,
    fontWeight: font.weight.bold,
    color: palette.primary[700],
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space[16],
  },
  emptyContent: {
    alignItems: 'center',
    maxWidth: 280,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space[5],
  },
  emptyTitle: {
    fontSize: font.size['2xl'],
    fontWeight: font.weight.bold,
    color: palette.gray[900],
    marginBottom: space[2],
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: font.size.base,
    color: palette.gray[500],
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: space[6],
  },
  emptyButton: {
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  emptyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingHorizontal: space[5],
    paddingVertical: space[3],
  },
  emptyButtonText: {
    fontSize: font.size.base,
    fontWeight: font.weight.bold,
    color: '#FFFFFF',
  },
});

export default Exams;
