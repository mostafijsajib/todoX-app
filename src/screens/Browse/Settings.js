import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/Colors';
import { useToast } from '@/components/UI';
import { clearAllLocalStorage, getDataLocalStorage } from '@/utils/storage';
import { setTasks } from '@/store/Task/task';
import { setSubjects } from '@/store/Subject/subject';
import { setExams } from '@/store/Exam/exam';
import { setStudyBlocks } from '@/store/Schedule/schedule';
import { useSettings } from '@/hooks';

/**
 * Settings Screen
 * App settings and preferences with working data management and persistence
 */
const Settings = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const toast = useToast();
  
  // Use persistent settings from hook
  const {
    notifications,
    studyReminders,
    examAlerts,
    dailyDigest,
    darkMode,
    hapticFeedback,
    loading: settingsLoading,
    loadSettings,
    setSetting,
  } = useSettings();

  const [isClearing, setIsClearing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Setting toggle handlers with persistence
  const handleToggleSetting = async (key, currentValue) => {
    await setSetting(key, !currentValue);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your tasks, subjects, exams, and study blocks. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            setIsClearing(true);
            try {
              const success = await clearAllLocalStorage();
              
              if (success) {
                dispatch(setTasks([]));
                dispatch(setSubjects([]));
                dispatch(setExams([]));
                dispatch(setStudyBlocks([]));
                toast.success('All data has been cleared successfully');
              } else {
                throw new Error('Failed to clear storage');
              }
            } catch (error) {
              toast.error('Failed to clear data. Please try again.');
            } finally {
              setIsClearing(false);
            }
          },
        },
      ]
    );
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const [tasks, completedTasks, subjects, exams, studyBlocks] = await Promise.all([
        getDataLocalStorage('tasks'),
        getDataLocalStorage('completed_tasks'),
        getDataLocalStorage('subjects'),
        getDataLocalStorage('exams'),
        getDataLocalStorage('study_blocks'),
      ]);

      const exportData = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        appName: 'Student Study Planner',
        data: {
          tasks: tasks || [],
          completedTasks: completedTasks || [],
          subjects: subjects || [],
          exams: exams || [],
          studyBlocks: studyBlocks || [],
        },
        stats: {
          totalTasks: (tasks?.length || 0) + (completedTasks?.length || 0),
          activeTasks: tasks?.length || 0,
          completedTasks: completedTasks?.length || 0,
          subjects: subjects?.length || 0,
          exams: exams?.length || 0,
          studyBlocks: studyBlocks?.length || 0,
        },
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      
      await Share.share({
        message: jsonString,
        title: 'Study Planner Data Export',
      });

      toast.success('Data exported successfully');
    } catch (error) {
      if (error.message !== 'User cancelled') {
        toast.error('Failed to export data. Please try again.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const renderSettingItem = ({
    icon,
    label,
    description,
    value,
    onToggle,
    showToggle = true,
    onPress,
    iconColor = colors.textSecondary,
    danger = false,
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress || (showToggle ? undefined : () => {})}
      disabled={showToggle}
      activeOpacity={showToggle ? 1 : 0.7}
    >
      <View style={[styles.settingIcon, { backgroundColor: iconColor + '15' }]}>
        <Ionicons name={icon} size={20} color={danger ? colors.error : iconColor} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingLabel, danger && { color: colors.error }]}>
          {label}
        </Text>
        {description && (
          <Text style={styles.settingDescription}>{description}</Text>
        )}
      </View>
      {showToggle ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.primary + '60' }}
          thumbColor={value ? colors.primary : colors.textTertiary}
        />
      ) : (
        <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.sectionContent}>
            {renderSettingItem({
              icon: 'notifications-outline',
              label: 'Push Notifications',
              description: 'Enable all notifications',
              value: notifications,
              onToggle: () => handleToggleSetting('notifications', notifications),
              iconColor: colors.primary,
            })}
            {renderSettingItem({
              icon: 'alarm-outline',
              label: 'Study Reminders',
              description: 'Get reminded before study sessions',
              value: studyReminders,
              onToggle: () => handleToggleSetting('studyReminders', studyReminders),
              iconColor: colors.info,
            })}
            {renderSettingItem({
              icon: 'school-outline',
              label: 'Exam Alerts',
              description: 'Countdown reminders for exams',
              value: examAlerts,
              onToggle: () => handleToggleSetting('examAlerts', examAlerts),
              iconColor: colors.warning,
            })}
            {renderSettingItem({
              icon: 'mail-outline',
              label: 'Daily Digest',
              description: 'Morning summary of your day',
              value: dailyDigest,
              onToggle: () => handleToggleSetting('dailyDigest', dailyDigest),
              iconColor: colors.secondary,
            })}
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.sectionContent}>
            {renderSettingItem({
              icon: 'moon-outline',
              label: 'Dark Mode',
              description: 'Use dark theme',
              value: darkMode,
              onToggle: () => handleToggleSetting('darkMode', darkMode),
              iconColor: colors.textSecondary,
            })}
            {renderSettingItem({
              icon: 'phone-portrait-outline',
              label: 'Haptic Feedback',
              description: 'Vibration on interactions',
              value: hapticFeedback,
              onToggle: () => handleToggleSetting('hapticFeedback', hapticFeedback),
              iconColor: colors.textSecondary,
            })}
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <View style={styles.sectionContent}>
            {renderSettingItem({
              icon: 'download-outline',
              label: 'Export Data',
              description: 'Download your study data',
              showToggle: false,
              onPress: handleExportData,
              iconColor: colors.info,
            })}
            {renderSettingItem({
              icon: 'trash-outline',
              label: 'Clear All Data',
              description: 'Delete all tasks and subjects',
              showToggle: false,
              onPress: handleClearData,
              iconColor: colors.error,
              danger: true,
            })}
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.sectionContent}>
            {renderSettingItem({
              icon: 'information-circle-outline',
              label: 'App Version',
              description: '1.0.0',
              showToggle: false,
              iconColor: colors.textSecondary,
            })}
          </View>
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
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  section: {
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionContent: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  settingDescription: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default Settings;
