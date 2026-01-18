import React, { useRef, useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/Colors';
import { selectAllTasks, selectCompletedTasks } from '@/store/Task/task';
import { useGrades } from '@/hooks';
import { GlobalSearch } from '@/components/Search';

const { width } = Dimensions.get('window');

/**
 * 📱 Browse Menu Screen
 * Beautiful navigation hub for study tools and settings
 */
const Menu = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Get real task data from Redux
  const allTasks = useSelector(selectAllTasks);
  const completedTasks = useSelector(selectCompletedTasks);
  
  // Get grade data
  const { overallGPA, loadGrades } = useGrades();

  // Load grades on mount
  useEffect(() => {
    loadGrades();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Calculate real statistics
  const quickStats = useMemo(() => {
    // Calculate streak (consecutive days with completed tasks)
    const calculateStreak = () => {
      if (completedTasks.length === 0) return 0;
      
      const sortedTasks = [...completedTasks]
        .filter(t => t.completed_timestamp)
        .sort((a, b) => new Date(b.completed_timestamp) - new Date(a.completed_timestamp));
      
      if (sortedTasks.length === 0) return 0;
      
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const completedDates = new Set();
      sortedTasks.forEach(task => {
        const date = new Date(task.completed_timestamp);
        date.setHours(0, 0, 0, 0);
        completedDates.add(date.toISOString().split('T')[0]);
      });
      
      const datesArray = Array.from(completedDates).sort().reverse();
      
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

    // Calculate total focus time (estimate from completed tasks)
    const calculateFocusHours = () => {
      let totalMinutes = 0;
      completedTasks.forEach(task => {
        if (task.startTime && task.endTime) {
          const [startH, startM] = task.startTime.split(':').map(Number);
          const [endH, endM] = task.endTime.split(':').map(Number);
          totalMinutes += (endH * 60 + endM) - (startH * 60 + startM);
        } else {
          // Estimate 30 minutes per task if no time specified
          totalMinutes += 30;
        }
      });
      return (totalMinutes / 60).toFixed(1);
    };

    const streak = calculateStreak();
    const focusHours = calculateFocusHours();
    const completedCount = completedTasks.length;

    return [
      { 
        icon: 'flame', 
        label: 'Streak', 
        value: streak > 0 ? `${streak} day${streak !== 1 ? 's' : ''}` : '0 days', 
        color: colors.warning 
      },
      { 
        icon: 'trophy', 
        label: 'Tasks', 
        value: `${completedCount} done`, 
        color: colors.success 
      },
      { 
        icon: 'school', 
        label: 'GPA', 
        value: overallGPA || 'N/A', 
        color: colors.info 
      },
    ];
  }, [completedTasks, overallGPA]);

  // Search state
  const [showSearch, setShowSearch] = useState(false);

  const menuSections = [
    {
      title: '📚 Study Tools',
      items: [
        {
          icon: 'library',
          label: 'My Subjects',
          screen: 'Subjects',
          description: 'Manage your courses',
          color: colors.primary,
          gradient: colors.gradients.primary,
        },
        {
          icon: 'ribbon',
          label: 'Exam Planner',
          screen: 'Exams',
          description: 'Track exam dates',
          color: colors.warning,
          gradient: colors.gradients.warning,
        },
        {
          icon: 'grid',
          label: 'Study Schedule',
          screen: 'Timetable',
          description: 'Weekly timetable',
          color: colors.info,
          gradient: colors.gradients.cool,
        },
      ],
    },
    {
      title: '📋 Task Views',
      items: [
        {
          icon: 'checkmark-done-circle',
          label: 'Completed Tasks',
          screen: 'CompletedTask',
          description: 'View finished work',
          color: colors.success,
          gradient: colors.gradients.success,
        },
        {
          icon: 'git-branch',
          label: 'Timeline',
          screen: 'Timeline',
          description: 'Visual task timeline',
          color: colors.secondary,
          gradient: colors.gradients.secondary,
        },
        {
          icon: 'stats-chart',
          label: 'Grades & GPA',
          screen: 'Grades',
          description: 'Track your academic performance',
          color: colors.primary,
          gradient: colors.gradients.primary,
        },
      ],
    },
    {
      title: '⚙️ Settings',
      items: [
        {
          icon: 'settings',
          label: 'Preferences',
          screen: 'Settings',
          description: 'App settings',
          color: colors.textSecondary,
          gradient: ['#64748B', '#94A3B8'],
        },
        {
          icon: 'help-circle',
          label: 'Help & Feedback',
          screen: 'HelpAndFeedback',
          description: 'Get support',
          color: colors.info,
          gradient: colors.gradients.cool,
        },
      ],
    },
  ];

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Global Search */}
      <GlobalSearch visible={showSearch} onClose={() => setShowSearch(false)} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={colors.gradients.primary}
                style={styles.avatar}
              >
                <Ionicons name="person" size={28} color={colors.white} />
              </LinearGradient>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.greeting}>Welcome back! 👋</Text>
              <Text style={styles.headerTitle}>Study Dashboard</Text>
            </View>
            {/* Search Button */}
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => setShowSearch(true)}
            >
              <Ionicons name="search" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          {/* Quick Stats */}
          <View style={styles.statsRow}>
            {quickStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Ionicons name={stat.icon} size={18} color={stat.color} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <Animated.View
            key={sectionIndex}
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 20],
                    outputRange: [0, 20 + sectionIndex * 10],
                  }),
                }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.menuItem,
                    itemIndex === section.items.length - 1 && styles.menuItemLast,
                  ]}
                  onPress={() => handleNavigation(item.screen)}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemLeft}>
                    <LinearGradient
                      colors={item.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.iconContainer}
                    >
                      <Ionicons name={item.icon} size={20} color={colors.white} />
                    </LinearGradient>
                    <View style={styles.menuItemContent}>
                      <Text style={styles.menuItemLabel}>{item.label}</Text>
                      <Text style={styles.menuItemDescription}>{item.description}</Text>
                    </View>
                  </View>
                  <View style={styles.chevronContainer}>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={colors.textTertiary}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        ))}

        {/* Motivational Card */}
        <View style={styles.motivationCard}>
          <LinearGradient
            colors={colors.gradients.aurora}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.motivationGradient}
          >
            <View style={styles.motivationContent}>
              <Text style={styles.motivationEmoji}>🎯</Text>
              <View style={styles.motivationText}>
                <Text style={styles.motivationTitle}>Stay Focused!</Text>
                <Text style={styles.motivationSubtitle}>
                  You're making great progress. Keep it up!
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLogo}>
            <Ionicons name="school" size={20} color={colors.primary} />
            <Text style={styles.footerText}>StudyFlow</Text>
          </View>
          <Text style={styles.versionText}>Version 2.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  // Header
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    marginRight: spacing.md,
    ...shadows.medium,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  greeting: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xxs,
  },
  headerTitle: {
    fontSize: typography.xxl,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: typography.xs,
    color: colors.textTertiary,
    marginTop: spacing.xxs,
  },
  // Sections
  section: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  sectionContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemLabel: {
    fontSize: typography.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  menuItemDescription: {
    fontSize: typography.sm,
    color: colors.textTertiary,
    marginTop: 2,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Motivation Card
  motivationCard: {
    margin: spacing.lg,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.colored,
  },
  motivationGradient: {
    padding: spacing.lg,
  },
  motivationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  motivationEmoji: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  motivationText: {
    flex: 1,
  },
  motivationTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xxs,
  },
  motivationSubtitle: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.85)',
  },
  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginTop: spacing.md,
  },
  footerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  footerText: {
    fontSize: typography.md,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  versionText: {
    fontSize: typography.xs,
    color: colors.textQuaternary,
  },
});

export default Menu;
