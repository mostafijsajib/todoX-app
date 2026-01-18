import React, { useRef, useEffect, useMemo, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Animated, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { selectAllTasks, selectCompletedTasks } from '@/store/Task/task';
import { useGrades } from '@/hooks';
import { GlobalSearch } from '@/components/Search';
import { StudyStats } from '@/components/StudyStats';
import { FocusTimer } from '@/components/FocusTimer';
import {
  palette,
  gradients,
  radius,
  space,
  font,
  shadowPresets,
  motivationalQuotes,
  studyTips,
} from '@/constants/Theme';

const { width } = Dimensions.get('window');

/**
 * 👤 Profile / More Screen
 * Student dashboard with stats, quick actions, and settings
 */
const ProfileMenu = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Get data from Redux
  const allTasks = useSelector(selectAllTasks);
  const completedTasks = useSelector(selectCompletedTasks);
  const subjects = useSelector((state) => state.subject?.subjects || []);
  const exams = useSelector((state) => state.exam?.exams || []);
  
  const { overallGPA, loadGrades } = useGrades();

  // State
  const [showSearch, setShowSearch] = useState(false);
  const [showFocusTimer, setShowFocusTimer] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [currentTip, setCurrentTip] = useState(studyTips[0]);

  // Load data
  useEffect(() => {
    loadGrades();
    setCurrentTip(studyTips[Math.floor(Math.random() * studyTips.length)]);
  }, []);

  // Animations
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

  // Calculate streak
  const streak = useMemo(() => {
    if (completedTasks.length === 0) return 0;
    
    const completedDates = new Set();
    completedTasks.forEach(t => {
      if (t.completed_timestamp) {
        completedDates.add(new Date(t.completed_timestamp).toISOString().split('T')[0]);
      }
    });
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const checkDateStr = checkDate.toISOString().split('T')[0];
      
      if (completedDates.has(checkDateStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  }, [completedTasks]);

  // Menu sections
  const menuSections = [
    {
      title: 'Quick Actions',
      items: [
        {
          icon: 'timer',
          label: 'Focus Timer',
          description: 'Pomodoro study sessions',
          color: palette.primary[500],
          gradient: gradients.primary,
          onPress: () => setShowFocusTimer(true),
        },
        {
          icon: 'stats-chart',
          label: 'Study Statistics',
          description: 'View your progress',
          color: palette.secondary[500],
          gradient: gradients.secondary,
          onPress: () => setShowStats(true),
        },
        {
          icon: 'search',
          label: 'Search',
          description: 'Find tasks & subjects',
          color: palette.accent[500],
          gradient: gradients.accent,
          onPress: () => setShowSearch(true),
        },
      ],
    },
    {
      title: 'Study Tools',
      items: [
        {
          icon: 'calendar',
          label: 'Timeline',
          screen: 'Timeline',
          description: 'Visual task timeline',
          color: palette.primary[500],
        },
        {
          icon: 'school',
          label: 'Grades & GPA',
          screen: 'Grades',
          description: 'Track academic performance',
          color: palette.success[500],
        },
        {
          icon: 'checkmark-done-circle',
          label: 'Completed Tasks',
          screen: 'CompletedTask',
          description: 'View finished work',
          color: palette.secondary[500],
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          icon: 'settings',
          label: 'Preferences',
          screen: 'Settings',
          description: 'App settings',
          color: palette.neutral[500],
        },
        {
          icon: 'help-circle',
          label: 'Help & Feedback',
          screen: 'HelpAndFeedback',
          description: 'Get support',
          color: palette.primary[400],
        },
        {
          icon: 'shield-checkmark',
          label: 'Privacy Policy',
          screen: 'PrivacyPolicy',
          description: 'Your data privacy',
          color: palette.neutral[400],
        },
      ],
    },
  ];

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Global Search Modal */}
      <GlobalSearch visible={showSearch} onClose={() => setShowSearch(false)} />
      
      {/* Focus Timer Modal */}
      <FocusTimer 
        visible={showFocusTimer} 
        onClose={() => setShowFocusTimer(false)} 
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={gradients.primary}
                style={styles.avatar}
              >
                <Ionicons name="person" size={32} color="#FFF" />
              </LinearGradient>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Student</Text>
              <Text style={styles.profileSubtitle}>Keep up the great work! 🎓</Text>
            </View>
          </View>

          {/* Quick Stats Row */}
          <View style={styles.quickStats}>
            <View style={styles.quickStatItem}>
              <View style={[styles.quickStatIcon, { backgroundColor: palette.warning[50] }]}>
                <Ionicons name="flame" size={18} color={palette.warning[500]} />
              </View>
              <Text style={styles.quickStatValue}>{streak}</Text>
              <Text style={styles.quickStatLabel}>Streak</Text>
            </View>

            <View style={styles.quickStatDivider} />

            <View style={styles.quickStatItem}>
              <View style={[styles.quickStatIcon, { backgroundColor: palette.success[50] }]}>
                <Ionicons name="checkmark-circle" size={18} color={palette.success[500]} />
              </View>
              <Text style={styles.quickStatValue}>{completedTasks.length}</Text>
              <Text style={styles.quickStatLabel}>Completed</Text>
            </View>

            <View style={styles.quickStatDivider} />

            <View style={styles.quickStatItem}>
              <View style={[styles.quickStatIcon, { backgroundColor: palette.primary[50] }]}>
                <Ionicons name="school" size={18} color={palette.primary[500]} />
              </View>
              <Text style={styles.quickStatValue}>{overallGPA || 'N/A'}</Text>
              <Text style={styles.quickStatLabel}>GPA</Text>
            </View>
          </View>
        </Animated.View>

        {/* Study Tip Card */}
        <Animated.View
          style={[
            styles.tipCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.tipIcon}>
            <Ionicons name="bulb" size={20} color={palette.warning[500]} />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Study Tip</Text>
            <Text style={styles.tipText}>{currentTip}</Text>
          </View>
        </Animated.View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <Animated.View
            key={sectionIndex}
            style={[
              styles.section,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={styles.menuItem}
                  onPress={item.onPress || (() => handleNavigation(item.screen))}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuItemIcon, { backgroundColor: item.color + '15' }]}>
                    <Ionicons name={item.icon} size={22} color={item.color} />
                  </View>
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemLabel}>{item.label}</Text>
                    <Text style={styles.menuItemDescription}>{item.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={palette.neutral[300]} />
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        ))}

        {/* App Version */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Student Study Planner v2.0</Text>
          <Text style={styles.footerSubtext}>Made with ❤️ for students</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Stats Modal */}
      {showStats && (
        <View style={styles.statsModal}>
          <SafeAreaView style={styles.statsModalInner}>
            <View style={styles.statsModalHeader}>
              <TouchableOpacity 
                style={styles.statsModalClose}
                onPress={() => setShowStats(false)}
              >
                <Ionicons name="close" size={24} color={palette.neutral[600]} />
              </TouchableOpacity>
              <Text style={styles.statsModalTitle}>Study Statistics</Text>
              <View style={{ width: 44 }} />
            </View>
            <StudyStats />
          </SafeAreaView>
        </View>
      )}
    </SafeAreaView>
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
    paddingBottom: space[8],
  },

  // Header
  header: {
    paddingHorizontal: space[5],
    paddingTop: space[4],
    paddingBottom: space[6],
    backgroundColor: palette.neutral[0],
    borderBottomLeftRadius: radius['2xl'],
    borderBottomRightRadius: radius['2xl'],
    ...shadowPresets.sm,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: space[5],
  },
  avatarContainer: {
    marginRight: space[4],
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: font.size['2xl'],
    fontWeight: font.weight.bold,
    color: palette.neutral[900],
  },
  profileSubtitle: {
    fontSize: font.size.sm,
    color: palette.neutral[500],
    marginTop: space[0.5],
  },

  // Quick Stats
  quickStats: {
    flexDirection: 'row',
    backgroundColor: palette.neutral[50],
    borderRadius: radius.xl,
    padding: space[4],
    alignItems: 'center',
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space[1],
  },
  quickStatValue: {
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
    color: palette.neutral[900],
  },
  quickStatLabel: {
    fontSize: font.size['2xs'],
    color: palette.neutral[500],
    marginTop: space[0.5],
  },
  quickStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: palette.neutral[200],
  },

  // Tip Card
  tipCard: {
    flexDirection: 'row',
    backgroundColor: palette.warning[50],
    marginHorizontal: space[5],
    marginTop: space[4],
    padding: space[4],
    borderRadius: radius.xl,
    alignItems: 'flex-start',
  },
  tipIcon: {
    marginRight: space[3],
    marginTop: space[0.5],
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: palette.warning[700],
    marginBottom: space[1],
  },
  tipText: {
    fontSize: font.size.sm,
    color: palette.neutral[700],
    lineHeight: 20,
  },

  // Section
  section: {
    marginTop: space[6],
    paddingHorizontal: space[5],
  },
  sectionTitle: {
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: palette.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: space[3],
    marginLeft: space[1],
  },
  sectionContent: {
    backgroundColor: palette.neutral[0],
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadowPresets.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: space[4],
    borderBottomWidth: 1,
    borderBottomColor: palette.neutral[100],
  },
  menuItemIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: space[3],
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemLabel: {
    fontSize: font.size.base,
    fontWeight: font.weight.medium,
    color: palette.neutral[900],
  },
  menuItemDescription: {
    fontSize: font.size.xs,
    color: palette.neutral[500],
    marginTop: space[0.5],
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingTop: space[8],
  },
  footerText: {
    fontSize: font.size.sm,
    color: palette.neutral[400],
    fontWeight: font.weight.medium,
  },
  footerSubtext: {
    fontSize: font.size.xs,
    color: palette.neutral[300],
    marginTop: space[1],
  },

  // Stats Modal
  statsModal: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: palette.neutral[50],
  },
  statsModalInner: {
    flex: 1,
  },
  statsModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    borderBottomWidth: 1,
    borderBottomColor: palette.neutral[100],
    backgroundColor: palette.neutral[0],
  },
  statsModalClose: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: palette.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsModalTitle: {
    fontSize: font.size.lg,
    fontWeight: font.weight.semibold,
    color: palette.neutral[900],
  },
});

export default ProfileMenu;
