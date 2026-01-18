import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/Colors';

/**
 * GPA Summary Card Component
 * Displays overall GPA with visual indicator and statistics
 */
const GPASummaryCard = ({ gpa, totalGrades, averageScore, subjectsCount }) => {
  const getGPAColor = (gpaValue) => {
    const numGPA = parseFloat(gpaValue);
    if (numGPA >= 3.7) return colors.success;
    if (numGPA >= 3.0) return colors.info;
    if (numGPA >= 2.0) return colors.warning;
    return colors.error;
  };

  const getGPAGradient = (gpaValue) => {
    const numGPA = parseFloat(gpaValue);
    if (numGPA >= 3.7) return colors.gradients.success;
    if (numGPA >= 3.0) return colors.gradients.cool;
    if (numGPA >= 2.0) return colors.gradients.warning;
    return ['#EF4444', '#DC2626'];
  };

  const getGPALabel = (gpaValue) => {
    const numGPA = parseFloat(gpaValue);
    if (numGPA >= 3.7) return "Dean's List";
    if (numGPA >= 3.5) return 'Excellent';
    if (numGPA >= 3.0) return 'Good Standing';
    if (numGPA >= 2.5) return 'Satisfactory';
    if (numGPA >= 2.0) return 'Passing';
    return 'Needs Improvement';
  };

  const gpaValue = parseFloat(gpa) || 0;
  const gpaPercentage = (gpaValue / 4.0) * 100;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getGPAGradient(gpa)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Main GPA Display */}
        <View style={styles.mainSection}>
          <View style={styles.gpaCircle}>
            <Text style={styles.gpaValue}>{gpa || '0.00'}</Text>
            <Text style={styles.gpaLabel}>GPA</Text>
          </View>
          <View style={styles.gpaInfo}>
            <Text style={styles.gpaStatus}>{getGPALabel(gpa)}</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(gpaPercentage, 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{gpaPercentage.toFixed(0)}% of 4.0</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="document-text" size={18} color="rgba(255,255,255,0.9)" />
            <Text style={styles.statValue}>{totalGrades || 0}</Text>
            <Text style={styles.statLabel}>Grades</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="trending-up" size={18} color="rgba(255,255,255,0.9)" />
            <Text style={styles.statValue}>{averageScore || 0}%</Text>
            <Text style={styles.statLabel}>Average</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="library" size={18} color="rgba(255,255,255,0.9)" />
            <Text style={styles.statValue}>{subjectsCount || 0}</Text>
            <Text style={styles.statLabel}>Subjects</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.colored,
  },
  gradient: {
    padding: spacing.lg,
  },
  mainSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  gpaCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  gpaValue: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  gpaLabel: {
    fontSize: typography.sizes.xs,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  gpaInfo: {
    flex: 1,
  },
  gpaStatus: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 4,
  },
  progressText: {
    fontSize: typography.sizes.xs,
    color: 'rgba(255,255,255,0.8)',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.white,
    marginTop: spacing.xxs,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.xxs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});

export default GPASummaryCard;
