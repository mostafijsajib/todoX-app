import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/Colors';
import { calculateGradePercentage, percentageToLetterGrade } from '@/store/Grade/grade';

/**
 * Grade Card Component
 * Displays individual grade with score, percentage, and letter grade
 */
const GradeCard = ({ grade, subject, onPress, onDelete }) => {
  const percentage = calculateGradePercentage(grade);
  const letterGrade = percentageToLetterGrade(percentage);

  const getGradeColor = (letter) => {
    if (letter.startsWith('A')) return colors.success;
    if (letter.startsWith('B')) return colors.info;
    if (letter.startsWith('C')) return colors.warning;
    if (letter.startsWith('D')) return colors.warning;
    return colors.error;
  };

  const getTypeIcon = (type) => {
    const icons = {
      exam: 'document-text',
      assignment: 'clipboard',
      quiz: 'help-circle',
      project: 'folder',
      midterm: 'book',
      final: 'ribbon',
      other: 'ellipsis-horizontal',
    };
    return icons[type] || 'document';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        {/* Type Icon */}
        <View style={[styles.typeIcon, { backgroundColor: (subject?.color || colors.primary) + '20' }]}>
          <Ionicons
            name={getTypeIcon(grade.type)}
            size={20}
            color={subject?.color || colors.primary}
          />
        </View>

        {/* Grade Info */}
        <View style={styles.gradeInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {grade.title}
          </Text>
          <View style={styles.metaRow}>
            {subject && (
              <View style={styles.subjectBadge}>
                <View
                  style={[
                    styles.subjectDot,
                    { backgroundColor: subject.color || colors.primary },
                  ]}
                />
                <Text style={styles.subjectText} numberOfLines={1}>
                  {subject.name}
                </Text>
              </View>
            )}
            <Text style={styles.dateText}>{formatDate(grade.date)}</Text>
          </View>
        </View>
      </View>

      {/* Score Section */}
      <View style={styles.rightSection}>
        <View style={[styles.gradeCircle, { borderColor: getGradeColor(letterGrade) }]}>
          <Text style={[styles.letterGrade, { color: getGradeColor(letterGrade) }]}>
            {letterGrade}
          </Text>
        </View>
        <Text style={styles.scoreText}>
          {grade.score}/{grade.maxScore}
        </Text>
        <Text style={styles.percentageText}>{percentage.toFixed(0)}%</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
  },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  gradeInfo: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xxs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  subjectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.sm,
  },
  subjectDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  subjectText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    maxWidth: 80,
  },
  dateText: {
    fontSize: typography.sizes.xs,
    color: colors.textTertiary,
  },
  rightSection: {
    alignItems: 'center',
  },
  gradeCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xxs,
  },
  letterGrade: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  scoreText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  percentageText: {
    fontSize: typography.sizes.xs,
    color: colors.textTertiary,
  },
});

export default GradeCard;
