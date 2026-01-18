import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { palette, gradients, radius, space, font, shadowPresets } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import ExamCard from '../../components/Exams/ExamCard';
import ExamFormModal from '../../components/Exams/ExamFormModal';
import { useExams } from '../../hooks';

const { width } = Dimensions.get('window');

/**
 * 🎓 Exams Screen
 * Beautiful exam tracker with countdown and motivation
 */
const Exams = () => {
  const exams = useSelector((state) => state.exam?.exams || []);
  const subjects = useSelector((state) => state.subject?.subjects || []);
  const [showExamForm, setShowExamForm] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [activeFilter, setActiveFilter] = useState('upcoming');
  const { loadExamsFromStorage } = useExams();

  // Animations
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    loadExamsFromStorage();
    
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
    ]).start();
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
      {/* Decorative elements */}
      <View style={styles.emptyDecorative}>
        <View style={[styles.decorCircle, styles.decorCircle1]} />
        <View style={[styles.decorCircle, styles.decorCircle2]} />
      </View>
      
      <View style={styles.emptyContent}>
        <View style={styles.emptyIconContainer}>
          <LinearGradient
            colors={gradients.warning}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.emptyIconGradient}
          >
            <Ionicons name="ribbon" size={40} color="#FFFFFF" />
          </LinearGradient>
        </View>
        
        <Text style={styles.emptyTitle}>Track Your Exams</Text>
        <Text style={styles.emptySubtitle}>
          Add upcoming exams to stay prepared and never miss an important date! 📅
        </Text>
        
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={handleAddExam}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.emptyButtonGradient}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.emptyButtonText}>Add First Exam</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  /**
   * Render header with stats
   */
  const renderHeader = () => (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: headerOpacity,
          transform: [{ translateY: headerSlide }],
        },
      ]}
    >
      {/* Title Row */}
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.headerTitle}>Exam Planner</Text>
          <Text style={styles.headerSubtitle}>
            {examStats.upcoming.length} upcoming • {examStats.urgent.length} urgent
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddExam}
          activeOpacity={0.85}
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
          >
            <Ionicons
              name={filter.icon}
              size={14}
              color={activeFilter === filter.key ? palette.primary[500] : palette.gray[400]}
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
    </Animated.View>
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
            <Ionicons name="flash" size={18} color={palette.warning[500]} />
            <Text style={styles.sectionTitle}>Next Up</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Focus on this one! 💪</Text>
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
        <Text style={styles.upcomingCount}>
          {filteredExams.length - 1} more
        </Text>
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
    paddingTop: space[3],
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space[3],
  },
  headerTitle: {
    fontSize: font.size['2xl'],
    fontWeight: font.weight.extrabold,
    color: palette.gray[900],
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: font.size.sm,
    color: palette.gray[400],
    marginTop: space[0.5],
  },
  addButton: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadowPresets.md,
  },
  addButtonGradient: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Filter Tabs
  filterContainer: {
    marginBottom: space[3],
  },
  filterContent: {
    gap: space[2],
    paddingRight: space[3],
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
    paddingHorizontal: space[3],
    paddingVertical: space[2],
    borderRadius: radius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: palette.gray[200],
  },
  filterTabActive: {
    backgroundColor: palette.primary[50],
    borderColor: palette.primary[200],
  },
  filterTabText: {
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: palette.gray[400],
  },
  filterTabTextActive: {
    color: palette.primary[600],
  },
  filterBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: palette.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space[1],
  },
  filterBadgeActive: {
    backgroundColor: palette.primary[500],
  },
  filterBadgeText: {
    fontSize: font.size['2xs'],
    fontWeight: font.weight.bold,
    color: palette.gray[400],
  },
  filterBadgeTextActive: {
    color: '#FFFFFF',
  },
  // Content
  listContent: {
    paddingHorizontal: space[4],
    paddingBottom: 120,
    flexGrow: 1,
  },
  nextExamContainer: {
    marginBottom: space[4],
  },
  sectionHeader: {
    marginBottom: space[3],
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
  },
  sectionTitle: {
    fontSize: font.size.lg,
    fontWeight: font.weight.extrabold,
    color: palette.gray[900],
  },
  sectionSubtitle: {
    fontSize: font.size.sm,
    color: palette.gray[500],
    marginTop: space[0.5],
  },
  upcomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space[3],
    paddingTop: space[3],
    borderTopWidth: 1,
    borderTopColor: palette.gray[200],
  },
  upcomingTitle: {
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: palette.gray[900],
  },
  upcomingCount: {
    fontSize: font.size.sm,
    color: palette.gray[400],
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: space[6],
    paddingTop: space[10],
    minHeight: 400,
  },
  emptyDecorative: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 999,
  },
  decorCircle1: {
    width: 200,
    height: 200,
    backgroundColor: palette.warning[100],
    top: -50,
    right: -50,
  },
  decorCircle2: {
    width: 150,
    height: 150,
    backgroundColor: palette.primary[100],
    bottom: 50,
    left: -30,
  },
  emptyContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  emptyIconContainer: {
    marginBottom: space[4],
    borderRadius: 40,
    overflow: 'hidden',
    ...shadowPresets.lg,
  },
  emptyIconGradient: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: font.size['2xl'],
    fontWeight: font.weight.extrabold,
    color: palette.gray[900],
    textAlign: 'center',
    marginBottom: space[2],
  },
  emptySubtitle: {
    fontSize: font.size.md,
    color: palette.gray[500],
    textAlign: 'center',
    lineHeight: font.size.md * 1.5,
    marginBottom: space[6],
    maxWidth: 280,
  },
  emptyButton: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadowPresets.md,
  },
  emptyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingHorizontal: space[6],
    paddingVertical: space[3],
  },
  emptyButtonText: {
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: '#FFFFFF',
  },
});

export default Exams;
