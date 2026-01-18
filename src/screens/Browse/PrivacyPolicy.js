import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, borderRadius } from '@/constants/Colors';

/**
 * Privacy Policy Screen
 * Displays the app's privacy policy
 */
const PrivacyPolicy = () => {
  const navigation = useNavigation();

  const privacyPolicyContent = `# Student Study Planner Privacy Policy

**Effective Date:** 2025/11/17  
**Last Updated:** 2026/01/08

## 1. Introduction

Welcome to Student Study Planner. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Student Study Planner mobile application ("App"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.

## 2. Information We Collect

### 2.1 Personal Information
When you use our App, we may collect the following types of information:

- **Account Information**: Email address, full name, and password (collected during registration)
- **Authentication Data**: Login status and session information stored locally on your device
- **Profile Information**: User preferences and settings

### 2.2 Task and Productivity Data
- **Task Information**: Task titles, descriptions, categories, priorities, dates, and times
- **Sub-tasks**: Related sub-task information
- **Completion Data**: Task completion status and timestamps
- **Calendar Data**: Scheduled dates and times for tasks and reminders

### 2.3 App Usage Data
- **Settings and Preferences**: Notification preferences, sound settings, theme preferences, and other app configurations
- **Usage Patterns**: How you interact with the app features
- **Device Information**: Device type, operating system version, and app version

### 2.4 Local Storage Data
All user data is stored locally on your device using:
- **AsyncStorage**: For persistent data storage
- **Local Cache**: For improved app performance
- **Redux Store**: For in-memory state management

## 3. How We Use Your Information

We use the collected information for the following purposes:

### 3.1 Core Functionality
- **Task Management**: Creating, updating, organizing, and tracking your tasks and to-do lists
- **User Authentication**: Managing your account access and session
- **Personalization**: Customizing your app experience based on your preferences
- **Notifications**: Sending reminders and alerts for scheduled tasks

### 3.2 App Improvement
- **Performance Optimization**: Improving app performance and user experience
- **Feature Development**: Developing new features and functionalities
- **Bug Fixes**: Identifying and resolving technical issues

## 4. Data Storage and Security

### 4.1 Local Storage
- All your data is stored locally on your device
- No data is transmitted to external servers unless you explicitly choose to sync or backup
- We use industry-standard encryption for any data that needs to be secured

### 4.2 Data Security Measures
- **Encryption**: Data is encrypted using AES-256 encryption
- **Access Controls**: Strict access controls to prevent unauthorized access
- **Regular Updates**: Security patches and updates are applied regularly

## 5. Data Sharing and Disclosure

We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy:

### 5.1 With Your Consent
- When you explicitly agree to share data for specific purposes

### 5.2 Legal Requirements
- When required by law or to protect our rights and safety

### 5.3 Service Providers
- Third-party services that help us operate the app (with your explicit consent)

## 6. Your Rights and Choices

### 6.1 Data Access
- You can access all your data stored in the app at any time
- Export your data in standard formats

### 6.2 Data Deletion
- Delete your account and all associated data
- Request deletion of specific data points

### 6.3 Data Portability
- Export your data to use with other services

## 7. Children's Privacy

Our App is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we can take necessary action.

## 8. Changes to This Privacy Policy

We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.

## 9. Contact Us

If you have any questions about this Privacy Policy, please contact us:

- **Email:** support@studyplanner.app
- **App Support:** In-app feedback form

## 10. Consent

By using our App, you consent to this Privacy Policy.`;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.content}>{privacyPolicyContent}</Text>
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
    padding: spacing.lg,
  },
  content: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    lineHeight: 24,
  },
});

export default PrivacyPolicy;