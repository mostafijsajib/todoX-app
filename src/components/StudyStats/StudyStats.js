import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import {
  palette,
  gradients,
  radius,
  space,
  font,
  shadowPresets,
  achievements,
} from '@/constants/Theme';

const { width } = Dimensions.get('window');

/**
 * 📊 Study Statistics Component
 * Shows student's study progress, streaks, and achievements
 */
const StudyStats = () => {
  const tasks = useSelector((state) => state.task.task_list || []);
  const subjects = useSelector((state) => state.subject?.subjects || []);
  const exams = useSelector((state) => state.exam?.exams || []);

  // Calculate statistics
  const stats = useMemo(() => {
    const completed = tasks.filter(t => t.is_completed || t.isCompleted);
    const total = tasks.length;
    
    // Calculate streak
    const calculateStreak = () => {
      if (completed.length === 0) return 0;
      
      const completedDates = new Set();
      completed.forEach(task => {
        if (task.completed_timestamp) {
          const date = new Date(task.completed_timestamp);
          completedDates.add(date.toISOString().split('T')[0]);
        }
      });
      
      const datesArray = Array.from(completedDates).sort().reverse();
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < datesArray.length; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const checkDateStr = checkDate.toISOString().split('T')[0];
        
        if (datesArray.includes(checkDateStr)) {
          streak++;
        } else if (i > 0) {
          break;
        }
      }
      
      return streak;
    };

    // Calculate focus time
    const calculateFocusTime = () => {
      let totalMinutes = 0;
      completed.forEach(task => {
        if (task.startTime && task.endTime) {
          const [startH, startM] = task.startTime.split(':').map(Number);
          const [endH, endM] = task.endTime.split(':').map(Number);
          totalMinutes += (endH * 60 + endM) - (startH * 60 + startM);
        } else {
          totalMinutes += 30; // Estimate 30 min per task
        }
      });
      return Math.round(totalMinutes / 60);
    };

    // Tasks per day this week
    const getWeeklyData = () => {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = new Date();
      const weekData = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayTasks = completed.filter(t => {
          if (!t.completed_timestamp) return false;
          return t.completed_timestamp.split('T')[0] === dateStr;
        });
        
        weekData.push({
          day: days[date.getDay()],
          count: dayTasks.length,
          isToday: i === 0,
        });
      }
      
      return weekData;
    };

    // Subject breakdown
    const getSubjectBreakdown = () => {
      const breakdown = {};
      tasks.forEach(task => {
        const subject = subjects.find(s => s.id === task.subjectId);
        const name = subject?.name || 'Other';
        const color = subject?.color || palette.neutral[400];
        
        if (!breakdown[name]) {
          breakdown[name] = { count: 0, completed: 0, color };
        }
        breakdown[name].count++;
        if (task.is_completed || task.isCompleted) {
          breakdown[name].completed++;
        }
      });
      
      return Object.entries(breakdown)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    };

    const streak = calculateStreak();
    const focusHours = calculateFocusTime();
    const weeklyData = getWeeklyData();
    const subjectBreakdown = getSubjectBreakdown();
    const completionRate = total > 0 ? Math.round((completed.length / total) * 100) : 0;

    return {
      streak,
      focusHours,
      weeklyData,
      subjectBreakdown,
      completionRate,
      totalCompleted: completed.length,
      totalTasks: total,
      subjects: subjects.length,
      upcomingExams: exams.filter(e => new Date(e.date) >= new Date()).length,
    };
  }, [tasks, subjects, exams]);

  // Determine unlocked achievements
  const unlockedAchievements = useMemo(() => {
    const unlocked = [];
    
    if (stats.totalCompleted >= 1) unlocked.push('firstTask');
    if (stats.streak >= 3) unlocked.push('streak3');
    if (stats.streak >= 7) unlocked.push('streak7');
    if (stats.streak >= 30) unlocked.push('streak30');
    if (stats.focusHours >= 2) unlocked.push('focused');
    if (stats.subjects >= 5) unlocked.push('organized');
    if (stats.upcomingExams >= 3) unlocked.push('examReady');
    
    return unlocked;
  }, [stats]);

  const maxWeeklyCount = Math.max(...stats.weeklyData.map(d => d.count), 1);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Main Stats Cards */}
      <Animated.View entering={FadeInUp.duration(500)} style={styles.mainStats}>
        {/* Streak Card */}
        <View style={styles.mainStatCard}>
          <LinearGradient
            colors={gradients.accent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mainStatGradient}
          >
            <Ionicons name="flame" size={32} color="#FFF" />
            <Text style={styles.mainStatValue}>{stats.streak}</Text>
            <Text style={styles.mainStatLabel}>Day Streak</Text>
          </LinearGradient>
        </View>

        {/* Focus Time Card */}
        <View style={styles.mainStatCard}>
          <LinearGradient
            colors={gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mainStatGradient}
          >
            <Ionicons name="timer" size={32} color="#FFF" />
            <Text style={styles.mainStatValue}>{stats.focusHours}h</Text>
            <Text style={styles.mainStatLabel}>Focus Time</Text>
          </LinearGradient>
        </View>

        {/* Completion Rate Card */}
        <View style={styles.mainStatCard}>
          <LinearGradient
            colors={gradients.success}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mainStatGradient}
          >
            <Ionicons name="checkmark-done-circle" size={32} color="#FFF" />
            <Text style={styles.mainStatValue}>{stats.completionRate}%</Text>
            <Text style={styles.mainStatLabel}>Complete</Text>
          </LinearGradient>
        </View>
      </Animated.View>

      {/* Weekly Activity */}
      <Animated.View entering={FadeInUp.delay(100).duration(500)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={[styles.sectionIcon, { backgroundColor: palette.primary[50] }]}>
              <Ionicons name="bar-chart" size={18} color={palette.primary[500]} />
            </View>
            <Text style={styles.sectionTitle}>Weekly Activity</Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartContainer}>
            {stats.weeklyData.map((day, index) => (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View 
                    style={[
                      styles.bar,
                      { 
                        height: `${(day.count / maxWeeklyCount) * 100}%`,
                        backgroundColor: day.isToday ? palette.primary[500] : palette.primary[200],
                      }
                    ]} 
                  />
                </View>
                <Text style={[
                  styles.barLabel,
                  day.isToday && styles.barLabelActive
                ]}>
                  {day.day}
                </Text>
                <Text style={styles.barCount}>{day.count}</Text>
              </View>
            ))}
          </View>
        </View>
      </Animated.View>

      {/* Subject Breakdown */}
      {stats.subjectBreakdown.length > 0 && (
        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.sectionIcon, { backgroundColor: palette.secondary[50] }]}>
                <Ionicons name="library" size={18} color={palette.secondary[500]} />
              </View>
              <Text style={styles.sectionTitle}>By Subject</Text>
            </View>
          </View>

          <View style={styles.subjectCard}>
            {stats.subjectBreakdown.map((subject, index) => (
              <View key={index} style={styles.subjectRow}>
                <View style={styles.subjectInfo}>
                  <View style={[styles.subjectDot, { backgroundColor: subject.color }]} />
                  <Text style={styles.subjectName}>{subject.name}</Text>
                </View>
                <View style={styles.subjectProgress}>
                  <View style={styles.subjectProgressBar}>
                    <View 
                      style={[
                        styles.subjectProgressFill,
                        { 
                          width: `${(subject.completed / subject.count) * 100}%`,
                          backgroundColor: subject.color,
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.subjectCount}>
                    {subject.completed}/{subject.count}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>
      )}

      {/* Achievements */}
      <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={[styles.sectionIcon, { backgroundColor: palette.warning[50] }]}>
              <Ionicons name="trophy" size={18} color={palette.warning[500]} />
            </View>
            <Text style={styles.sectionTitle}>Achievements</Text>
          </View>
          <Text style={styles.achievementCount}>
            {unlockedAchievements.length}/{Object.keys(achievements).length}
          </Text>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.achievementsScroll}
          contentContainerStyle={styles.achievementsContent}
        >
          {Object.entries(achievements).map(([key, achievement]) => {
            const isUnlocked = unlockedAchievements.includes(key);
            
            return (
              <View 
                key={key} 
                style={[
                  styles.achievementCard,
                  !isUnlocked && styles.achievementCardLocked
                ]}
              >
                <View style={[
                  styles.achievementIcon,
                  isUnlocked && { backgroundColor: palette.warning[100] }
                ]}>
                  <Ionicons 
                    name={achievement.icon} 
                    size={24} 
                    color={isUnlocked ? palette.warning[500] : palette.neutral[300]} 
                  />
                </View>
                <Text style={[
                  styles.achievementTitle,
                  !isUnlocked && styles.achievementTitleLocked
                ]}>
                  {achievement.title}
                </Text>
                <Text style={styles.achievementDescription} numberOfLines={2}>
                  {achievement.description}
                </Text>
                {!isUnlocked && (
                  <View style={styles.lockedBadge}>
                    <Ionicons name="lock-closed" size={10} color={palette.neutral[400]} />
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </Animated.View>

      {/* Quick Stats Summary */}
      <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.section}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Ionicons name="checkmark-circle" size={20} color={palette.success[500]} />
              <Text style={styles.summaryValue}>{stats.totalCompleted}</Text>
              <Text style={styles.summaryLabel}>Tasks Done</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="library" size={20} color={palette.primary[500]} />
              <Text style={styles.summaryValue}>{stats.subjects}</Text>
              <Text style={styles.summaryLabel}>Subjects</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="ribbon" size={20} color={palette.warning[500]} />
              <Text style={styles.summaryValue}>{stats.upcomingExams}</Text>
              <Text style={styles.summaryLabel}>Exams</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      <View style={{ height: space[20] }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.neutral[50],
  },

  // Main Stats
  mainStats: {
    flexDirection: 'row',
    paddingHorizontal: space[5],
    paddingTop: space[4],
    gap: space[3],
  },
  mainStatCard: {
    flex: 1,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadowPresets.md,
  },
  mainStatGradient: {
    padding: space[4],
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  mainStatValue: {
    fontSize: font.size['3xl'],
    fontWeight: font.weight.bold,
    color: '#FFF',
    marginTop: space[2],
  },
  mainStatLabel: {
    fontSize: font.size.xs,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: font.weight.medium,
    marginTop: space[0.5],
  },

  // Section
  section: {
    paddingHorizontal: space[5],
    marginTop: space[6],
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

  // Chart
  chartCard: {
    backgroundColor: palette.neutral[0],
    borderRadius: radius.xl,
    padding: space[4],
    ...shadowPresets.sm,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 120,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    height: 80,
    width: 24,
    backgroundColor: palette.neutral[100],
    borderRadius: radius.md,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: radius.md,
    minHeight: 4,
  },
  barLabel: {
    fontSize: font.size['2xs'],
    color: palette.neutral[400],
    marginTop: space[2],
    fontWeight: font.weight.medium,
  },
  barLabelActive: {
    color: palette.primary[500],
    fontWeight: font.weight.semibold,
  },
  barCount: {
    fontSize: font.size['2xs'],
    color: palette.neutral[500],
    marginTop: space[0.5],
  },

  // Subject Breakdown
  subjectCard: {
    backgroundColor: palette.neutral[0],
    borderRadius: radius.xl,
    padding: space[4],
    ...shadowPresets.sm,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space[2],
  },
  subjectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    flex: 1,
  },
  subjectDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  subjectName: {
    fontSize: font.size.sm,
    fontWeight: font.weight.medium,
    color: palette.neutral[700],
  },
  subjectProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  subjectProgressBar: {
    width: 60,
    height: 6,
    backgroundColor: palette.neutral[100],
    borderRadius: 3,
    overflow: 'hidden',
  },
  subjectProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  subjectCount: {
    fontSize: font.size.xs,
    color: palette.neutral[500],
    width: 40,
    textAlign: 'right',
  },

  // Achievements
  achievementCount: {
    fontSize: font.size.sm,
    color: palette.neutral[500],
  },
  achievementsScroll: {
    marginHorizontal: -space[5],
  },
  achievementsContent: {
    paddingHorizontal: space[5],
    gap: space[3],
  },
  achievementCard: {
    width: 120,
    backgroundColor: palette.neutral[0],
    borderRadius: radius.xl,
    padding: space[3],
    alignItems: 'center',
    ...shadowPresets.sm,
  },
  achievementCardLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: palette.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space[2],
  },
  achievementTitle: {
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: palette.neutral[900],
    textAlign: 'center',
    marginBottom: space[1],
  },
  achievementTitleLocked: {
    color: palette.neutral[500],
  },
  achievementDescription: {
    fontSize: font.size['2xs'],
    color: palette.neutral[500],
    textAlign: 'center',
    lineHeight: 14,
  },
  lockedBadge: {
    position: 'absolute',
    top: space[2],
    right: space[2],
  },

  // Summary
  summaryCard: {
    backgroundColor: palette.neutral[0],
    borderRadius: radius.xl,
    padding: space[4],
    ...shadowPresets.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: font.size.xl,
    fontWeight: font.weight.bold,
    color: palette.neutral[900],
    marginTop: space[1],
  },
  summaryLabel: {
    fontSize: font.size.xs,
    color: palette.neutral[500],
    marginTop: space[0.5],
  },
});

export default StudyStats;
