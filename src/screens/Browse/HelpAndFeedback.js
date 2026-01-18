import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/Colors';

/**
 * HelpAndFeedback Screen
 * Help resources and feedback options
 */
const HelpAndFeedback = () => {
  const navigation = useNavigation();

  const faqItems = [
    {
      question: 'How do I create a study task?',
      answer: 'Tap the + button on any screen to create a new study task. You can assign it to a subject, set a due date, priority, and add subtasks.',
    },
    {
      question: 'How do I link tasks to subjects?',
      answer: 'When creating or editing a task, tap on "Subject" to select from your created subjects. Tasks will then appear grouped under that subject.',
    },
    {
      question: 'How do I set up exam reminders?',
      answer: 'Go to Browse > Exam Planner and add your exams. You can set reminder notifications that will alert you before the exam date.',
    },
    {
      question: 'Can I create a study timetable?',
      answer: 'Yes! Go to Browse > Study Timetable to create recurring study blocks. These help you plan your weekly study schedule.',
    },
    {
      question: 'How do I view completed tasks?',
      answer: 'Go to Browse > Completed Tasks to see all your finished study tasks. You can also restore tasks if needed.',
    },
  ];

  const handleEmail = () => {
    Linking.openURL('mailto:support@studyplanner.app?subject=Student Study Planner Feedback');
  };

  const handleRateApp = () => {
    const appStoreUrl = Platform.OS === 'ios'
      ? 'https://apps.apple.com/app/student-study-planner' // Update with actual App Store ID when published
      : 'https://play.google.com/store/apps/details?id=com.studentstudyplanner'; // Update with actual package name
    Linking.openURL(appStoreUrl);
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Feedback</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Ionicons name="help-circle" size={48} color={colors.primary} />
          </View>
          <Text style={styles.heroTitle}>How can we help?</Text>
          <Text style={styles.heroSubtitle}>
            Find answers to common questions or get in touch
          </Text>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.sectionContent}>
            {faqItems.map((item, index) => (
              <View key={index} style={styles.faqItem}>
                <View style={styles.faqQuestion}>
                  <Ionicons
                    name="help-circle-outline"
                    size={18}
                    color={colors.primary}
                    style={styles.faqIcon}
                  />
                  <Text style={styles.faqQuestionText}>{item.question}</Text>
                </View>
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <View style={styles.sectionContent}>
            <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
              <View style={[styles.contactIcon, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="mail-outline" size={22} color={colors.primary} />
              </View>
              <View style={styles.contactContent}>
                <Text style={styles.contactLabel}>Send Feedback</Text>
                <Text style={styles.contactDescription}>
                  Share your thoughts and suggestions
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactItem} onPress={handleRateApp}>
              <View style={[styles.contactIcon, { backgroundColor: colors.warning + '15' }]}>
                <Ionicons name="star-outline" size={22} color={colors.warning} />
              </View>
              <View style={styles.contactContent}>
                <Text style={styles.contactLabel}>Rate the App</Text>
                <Text style={styles.contactDescription}>
                  If you enjoy Study Planner, please rate us!
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactItem} onPress={handlePrivacyPolicy}>
              <View style={[styles.contactIcon, { backgroundColor: colors.info + '15' }]}>
                <Ionicons name="shield-checkmark-outline" size={22} color={colors.info} />
              </View>
              <View style={styles.contactContent}>
                <Text style={styles.contactLabel}>Privacy Policy</Text>
                <Text style={styles.contactDescription}>
                  How we handle your data
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Study Tips</Text>
          <View style={styles.tipsCard}>
            <Ionicons name="bulb" size={24} color={colors.warning} />
            <View style={styles.tipsContent}>
              <Text style={styles.tipsTitle}>Pomodoro Technique</Text>
              <Text style={styles.tipsText}>
                Study for 25 minutes, take a 5-minute break. After 4 sessions, take a longer 15-30 minute break.
              </Text>
            </View>
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
  heroSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  heroSubtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  section: {
    paddingTop: spacing.md,
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
  faqItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  faqIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  faqAnswer: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    paddingLeft: 26,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  contactDescription: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tipsCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.warning + '10',
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  tipsContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  tipsTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  tipsText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default HelpAndFeedback;
