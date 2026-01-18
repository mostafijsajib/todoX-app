import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInUp,
  FadeInDown,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  SlideInRight,
  Layout,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

// Components
import AddTaskButton from '@/components/AddTaskButton/index';
import TaskDetailModal from '@/components/Tasks/TaskDetailModal';
import { useToast } from '@/components/UI';

// Hooks
import useTasks from '@/hooks/useTasks';

// Theme
import { 
  palette, 
  gradients, 
  radius, 
  space, 
  font, 
  shadowPresets,
  motivationalQuotes,
  priorities,
  categories,
} from '@/constants/Theme';

const { width } = Dimensions.get('window');

/**
 * 🏠 Dashboard Screen
 * Modern, gamified student dashboard with focus on productivity
 */
const Dashboard = () => {
  const tasks = useSelector((state) => state.task.task_list || []);
  const subjects = useSelector((state) => state.subject?.subjects || []);
  const exams = useSelector((state) => state.exam?.exams || []);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [greeting, setGreeting] = useState('');
  const [quote, setQuote] = useState(motivationalQuotes[0]);

  const { loadTasksFromStorage, bulkCompleteTask, updateTask, deleteTask, getCompletedTasks } = useTasks();
  const toast = useToast();

  // Set greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else if (hour < 21) setGreeting('Good evening');
    else setGreeting('Good night');

    // Random quote
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  }, []);

  // Load tasks
  useEffect(() => {
    loadTasksFromStorage();
  }, []);

  // Get today's date
  const getTodayString = () => new Date().toISOString().split('T')[0];

  // Filter tasks
  const todayTasks = useMemo(() => {
    const today = getTodayString();
    const todayDate = new Date(today);
    return tasks.filter(task => {
      if (task.is_completed || task.isCompleted) return false;
      const taskDate = new Date(task.date);
      return taskDate.toDateString() === todayDate.toDateString();
    });
  }, [tasks]);

  const overdueTasks = useMemo(() => {
    const today = getTodayString();
    const todayDate = new Date(today);
    return tasks.filter(task => {
      if (task.is_completed || task.isCompleted) return false;
      const taskDate = new Date(task.date);
      return taskDate < todayDate;
    });
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return tasks.filter(task => {
      if (task.is_completed || task.isCompleted) return false;
      const taskDate = new Date(task.date);
      return taskDate > today && taskDate <= nextWeek;
    }).slice(0, 5);
  }, [tasks]);

  // Upcoming exams
  const upcomingExams = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return exams
      .filter(e => new Date(e.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  }, [exams]);

  // Stats
  const stats = useMemo(() => {
    const completed = tasks.filter(t => t.is_completed || t.isCompleted).length;
    const total = tasks.length;
    const todayComplete = todayTasks.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, todayComplete, progress, overdue: overdueTasks.length };
  }, [tasks, todayTasks, overdueTasks]);

  // Handlers
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadTasksFromStorage();
    setIsRefreshing(false);
  };

  const handleTaskPress = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleCompleteTask = async (task) => {
    await bulkCompleteTask([task.id]);
    toast.success('Task completed! 🎉');
  };

  const getSubjectById = (id) => subjects.find(s => s.id === id);

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={palette.primary[500]}
          />
        }
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{greeting} 👋</Text>
              <Text style={styles.headerTitle}>Student</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color={palette.neutral[700]} />
              {stats.overdue > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>{stats.overdue}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Motivational Quote */}
          <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.quoteCard}>
            <LinearGradient
              colors={gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.quoteGradient}
            >
              <Ionicons name="sparkles" size={20} color="#FFF" style={{ opacity: 0.8 }} />
              <Text style={styles.quoteText}>"{quote.text}"</Text>
              <Text style={styles.quoteAuthor}>— {quote.author}</Text>
            </LinearGradient>
          </Animated.View>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.statsSection}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#EEF2FF', '#E0E7FF']}
                style={styles.statIconBg}
              >
                <Ionicons name="checkmark-circle" size={22} color={palette.primary[500]} />
              </LinearGradient>
              <Text style={styles.statValue}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={['#ECFDF5', '#D1FAE5']}
                style={styles.statIconBg}
              >
                <Ionicons name="today" size={22} color={palette.success[500]} />
              </LinearGradient>
              <Text style={styles.statValue}>{todayTasks.length}</Text>
              <Text style={styles.statLabel}>Today</Text>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={['#FFF7ED', '#FFEDD5']}
                style={styles.statIconBg}
              >
                <Ionicons name="flame" size={22} color={palette.warning[500]} />
              </LinearGradient>
              <Text style={styles.statValue}>{upcomingTasks.length}</Text>
              <Text style={styles.statLabel}>Upcoming</Text>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={overdueTasks.length > 0 ? ['#FFF1F2', '#FFE4E6'] : ['#F8FAFC', '#F1F5F9']}
                style={styles.statIconBg}
              >
                <Ionicons 
                  name="alert-circle" 
                  size={22} 
                  color={overdueTasks.length > 0 ? palette.error[500] : palette.neutral[400]} 
                />
              </LinearGradient>
              <Text style={[styles.statValue, overdueTasks.length > 0 && { color: palette.error[500] }]}>
                {overdueTasks.length}
              </Text>
              <Text style={styles.statLabel}>Overdue</Text>
            </View>
          </View>
        </Animated.View>

        {/* Progress Ring */}
        <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.progressSection}>
          <View style={styles.progressCard}>
            <View style={styles.progressRing}>
              <View style={styles.progressRingInner}>
                <Text style={styles.progressValue}>{stats.progress}%</Text>
                <Text style={styles.progressLabel}>Complete</Text>
              </View>
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.progressTitle}>Weekly Progress</Text>
              <Text style={styles.progressSubtitle}>
                {stats.completed} of {stats.total} tasks completed
              </Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressBarFill, { width: `${stats.progress}%` }]} />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Overdue Tasks */}
        {overdueTasks.length > 0 && (
          <Animated.View entering={FadeInUp.delay(450).duration(500)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <View style={[styles.sectionIcon, { backgroundColor: palette.error[50] }]}>
                  <Ionicons name="alert-circle" size={18} color={palette.error[500]} />
                </View>
                <Text style={styles.sectionTitle}>Overdue</Text>
              </View>
              <View style={styles.badge}>
                <Text style={[styles.badgeText, { color: palette.error[500] }]}>{overdueTasks.length}</Text>
              </View>
            </View>
            <View style={styles.taskList}>
              {overdueTasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  subject={getSubjectById(task.subjectId)}
                  onPress={() => handleTaskPress(task)}
                  onComplete={() => handleCompleteTask(task)}
                  isOverdue
                  index={index}
                />
              ))}
            </View>
          </Animated.View>
        )}

        {/* Today's Tasks */}
        <Animated.View entering={FadeInUp.delay(500).duration(500)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.sectionIcon, { backgroundColor: palette.primary[50] }]}>
                <Ionicons name="today" size={18} color={palette.primary[500]} />
              </View>
              <Text style={styles.sectionTitle}>Today's Focus</Text>
            </View>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See all</Text>
              <Ionicons name="chevron-forward" size={16} color={palette.primary[500]} />
            </TouchableOpacity>
          </View>

          {todayTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="checkmark-circle" size={48} color={palette.success[400]} />
              </View>
              <Text style={styles.emptyTitle}>All caught up! 🎉</Text>
              <Text style={styles.emptySubtitle}>No tasks for today. Time to relax or plan ahead.</Text>
            </View>
          ) : (
            <View style={styles.taskList}>
              {todayTasks.slice(0, 5).map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  subject={getSubjectById(task.subjectId)}
                  onPress={() => handleTaskPress(task)}
                  onComplete={() => handleCompleteTask(task)}
                  index={index}
                />
              ))}
            </View>
          )}
        </Animated.View>

        {/* Upcoming Exams */}
        {upcomingExams.length > 0 && (
          <Animated.View entering={FadeInUp.delay(600).duration(500)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <View style={[styles.sectionIcon, { backgroundColor: palette.warning[50] }]}>
                  <Ionicons name="ribbon" size={18} color={palette.warning[500]} />
                </View>
                <Text style={styles.sectionTitle}>Upcoming Exams</Text>
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.examsScroll}>
              {upcomingExams.map((exam, index) => {
                const subject = getSubjectById(exam.subjectId);
                const daysUntil = Math.ceil((new Date(exam.date) - new Date()) / (1000 * 60 * 60 * 24));
                
                return (
                  <Animated.View
                    key={exam.id}
                    entering={SlideInRight.delay(index * 100).duration(400)}
                    style={styles.examCard}
                  >
                    <LinearGradient
                      colors={daysUntil <= 3 ? gradients.error : gradients.warning}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.examGradient}
                    >
                      <View style={styles.examDays}>
                        <Text style={styles.examDaysValue}>{daysUntil}</Text>
                        <Text style={styles.examDaysLabel}>days</Text>
                      </View>
                      <View style={styles.examInfo}>
                        <Text style={styles.examTitle} numberOfLines={1}>{exam.title}</Text>
                        <Text style={styles.examSubject} numberOfLines={1}>
                          {subject?.name || 'No subject'}
                        </Text>
                      </View>
                    </LinearGradient>
                  </Animated.View>
                );
              })}
            </ScrollView>
          </Animated.View>
        )}

        {/* Bottom spacing for FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <AddTaskButton defaultDate={new Date()} />

      {/* Task Detail Modal */}
      <TaskDetailModal
        visible={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        task={selectedTask}
        onUpdate={updateTask}
        onDelete={deleteTask}
      />
    </SafeAreaView>
  );
};

/**
 * Task Card Component
 */
const TaskCard = ({ task, subject, onPress, onComplete, isOverdue, index }) => {
  const priorityConfig = priorities[task.priority] || priorities.medium;
  const categoryConfig = categories[task.category] || categories.study;

  const formatTime = (time) => {
    if (!time) return '';
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 50).duration(400)}
      layout={Layout.springify()}
    >
      <Pressable
        style={({ pressed }) => [
          styles.taskCard,
          isOverdue && styles.taskCardOverdue,
          pressed && styles.taskCardPressed,
        ]}
        onPress={onPress}
      >
        {/* Left accent */}
        <View style={[styles.taskAccent, { backgroundColor: subject?.color || palette.primary[500] }]} />
        
        <View style={styles.taskContent}>
          {/* Checkbox */}
          <TouchableOpacity
            style={styles.checkbox}
            onPress={onComplete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={[styles.checkboxInner, { borderColor: subject?.color || palette.primary[500] }]} />
          </TouchableOpacity>

          {/* Task info */}
          <View style={styles.taskInfo}>
            <Text style={styles.taskTitle} numberOfLines={2}>{task.title}</Text>
            
            <View style={styles.taskMeta}>
              {/* Time */}
              {task.startTime && (
                <View style={styles.taskMetaItem}>
                  <Ionicons name="time-outline" size={12} color={palette.neutral[400]} />
                  <Text style={styles.taskMetaText}>{formatTime(task.startTime)}</Text>
                </View>
              )}
              
              {/* Subject */}
              {subject && (
                <View style={[styles.subjectBadge, { backgroundColor: subject.color + '15' }]}>
                  <View style={[styles.subjectDot, { backgroundColor: subject.color }]} />
                  <Text style={[styles.subjectText, { color: subject.color }]}>{subject.name}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Priority indicator */}
          {task.priority && (
            <View style={[styles.priorityIndicator, { backgroundColor: priorityConfig.bgColor }]}>
              <Ionicons name={priorityConfig.icon} size={14} color={priorityConfig.color} />
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.neutral[50],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: space[20],
  },

  // Header
  header: {
    paddingHorizontal: space[5],
    paddingTop: space[2],
    paddingBottom: space[4],
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space[4],
  },
  greeting: {
    fontSize: font.size.base,
    color: palette.neutral[500],
    fontWeight: font.weight.medium,
  },
  headerTitle: {
    fontSize: font.size['3xl'],
    fontWeight: font.weight.bold,
    color: palette.neutral[900],
    marginTop: space[0.5],
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: radius.xl,
    backgroundColor: palette.neutral[0],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadowPresets.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: palette.error[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: font.weight.bold,
    color: '#FFF',
  },

  // Quote Card
  quoteCard: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadowPresets.md,
  },
  quoteGradient: {
    padding: space[4],
  },
  quoteText: {
    fontSize: font.size.base,
    fontWeight: font.weight.medium,
    color: '#FFF',
    lineHeight: 22,
    marginTop: space[2],
  },
  quoteAuthor: {
    fontSize: font.size.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: space[2],
    fontStyle: 'italic',
  },

  // Stats
  statsSection: {
    paddingHorizontal: space[5],
    marginBottom: space[4],
  },
  statsRow: {
    flexDirection: 'row',
    gap: space[3],
  },
  statCard: {
    flex: 1,
    backgroundColor: palette.neutral[0],
    borderRadius: radius.xl,
    padding: space[3],
    alignItems: 'center',
    ...shadowPresets.sm,
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space[2],
  },
  statValue: {
    fontSize: font.size.xl,
    fontWeight: font.weight.bold,
    color: palette.neutral[900],
  },
  statLabel: {
    fontSize: font.size.xs,
    color: palette.neutral[500],
    marginTop: space[0.5],
  },

  // Progress Section
  progressSection: {
    paddingHorizontal: space[5],
    marginBottom: space[4],
  },
  progressCard: {
    backgroundColor: palette.neutral[0],
    borderRadius: radius.xl,
    padding: space[4],
    flexDirection: 'row',
    alignItems: 'center',
    ...shadowPresets.sm,
  },
  progressRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: palette.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: space[4],
  },
  progressRingInner: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: font.size.xl,
    fontWeight: font.weight.bold,
    color: palette.primary[500],
  },
  progressLabel: {
    fontSize: font.size['2xs'],
    color: palette.neutral[500],
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontSize: font.size.lg,
    fontWeight: font.weight.semibold,
    color: palette.neutral[900],
  },
  progressSubtitle: {
    fontSize: font.size.sm,
    color: palette.neutral[500],
    marginTop: space[0.5],
    marginBottom: space[2],
  },
  progressBar: {
    height: 6,
    backgroundColor: palette.neutral[100],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: palette.primary[500],
    borderRadius: 3,
  },

  // Section
  section: {
    paddingHorizontal: space[5],
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
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: font.size.lg,
    fontWeight: font.weight.semibold,
    color: palette.neutral[900],
  },
  badge: {
    paddingHorizontal: space[2],
    paddingVertical: space[0.5],
    borderRadius: radius.full,
    backgroundColor: palette.neutral[100],
  },
  badgeText: {
    fontSize: font.size.xs,
    fontWeight: font.weight.semibold,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[0.5],
  },
  seeAllText: {
    fontSize: font.size.sm,
    fontWeight: font.weight.medium,
    color: palette.primary[500],
  },

  // Task List
  taskList: {
    gap: space[2],
  },
  taskCard: {
    backgroundColor: palette.neutral[0],
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadowPresets.xs,
  },
  taskCardOverdue: {
    borderWidth: 1,
    borderColor: palette.error[200],
  },
  taskCardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  taskAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: space[3],
    paddingLeft: space[4],
  },
  checkbox: {
    marginRight: space[3],
  },
  checkboxInner: {
    width: 22,
    height: 22,
    borderRadius: radius.md,
    borderWidth: 2,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: font.size.base,
    fontWeight: font.weight.medium,
    color: palette.neutral[900],
    marginBottom: space[1],
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  taskMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
  },
  taskMetaText: {
    fontSize: font.size.xs,
    color: palette.neutral[500],
  },
  subjectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space[2],
    paddingVertical: space[0.5],
    borderRadius: radius.full,
    gap: space[1],
  },
  subjectDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  subjectText: {
    fontSize: font.size.xs,
    fontWeight: font.weight.medium,
  },
  priorityIndicator: {
    width: 28,
    height: 28,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: space[8],
    backgroundColor: palette.neutral[0],
    borderRadius: radius.xl,
    ...shadowPresets.xs,
  },
  emptyIconContainer: {
    marginBottom: space[3],
  },
  emptyTitle: {
    fontSize: font.size.lg,
    fontWeight: font.weight.semibold,
    color: palette.neutral[900],
    marginBottom: space[1],
  },
  emptySubtitle: {
    fontSize: font.size.sm,
    color: palette.neutral[500],
    textAlign: 'center',
    paddingHorizontal: space[8],
  },

  // Exams
  examsScroll: {
    marginHorizontal: -space[5],
    paddingHorizontal: space[5],
  },
  examCard: {
    width: 160,
    marginRight: space[3],
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadowPresets.md,
  },
  examGradient: {
    padding: space[4],
    height: 120,
    justifyContent: 'space-between',
  },
  examDays: {
    alignItems: 'flex-start',
  },
  examDaysValue: {
    fontSize: font.size['4xl'],
    fontWeight: font.weight.bold,
    color: '#FFF',
    lineHeight: 36,
  },
  examDaysLabel: {
    fontSize: font.size.sm,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: font.weight.medium,
  },
  examInfo: {
    marginTop: 'auto',
  },
  examTitle: {
    fontSize: font.size.base,
    fontWeight: font.weight.semibold,
    color: '#FFF',
  },
  examSubject: {
    fontSize: font.size.xs,
    color: 'rgba(255,255,255,0.8)',
    marginTop: space[0.5],
  },
});

export default Dashboard;
