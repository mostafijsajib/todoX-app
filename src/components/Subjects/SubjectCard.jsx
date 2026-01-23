/**
 * 📚 SubjectCard Component
 * Clean, minimal subject cards with subtle styling
 */

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/constants/Colors';

const SubjectCard = ({
  subject,
  taskCount = 0,
  completedCount = 0,
  onPress,
  onLongPress,
  style,
}) => {
  // Calculate progress percentage
  const progress = taskCount > 0 ? (completedCount / taskCount) * 100 : 0;
  const isComplete = taskCount > 0 && completedCount === taskCount;

  // Convert hex to rgba for opacity
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Get status message
  const getStatusMessage = () => {
    if (taskCount === 0) return 'No tasks yet';
    if (isComplete) return 'All done!';
    const remaining = taskCount - completedCount;
    return `${remaining} remaining`;
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.touchable}
      >
        <View style={styles.card}>
          <View style={[styles.accentBar, { backgroundColor: subject.color }]} />
          {/* Main content */}
          <View style={styles.content}>
            <View style={styles.topRow}>
              {/* Icon */}
              <View style={[styles.iconContainer, { backgroundColor: hexToRgba(subject.color, 0.12) }]}>
                <Ionicons
                  name={subject.icon || 'book'}
                  size={22}
                  color={subject.color}
                />
                {/* Complete badge */}
                {isComplete && (
                  <View style={styles.completeBadge}>
                    <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                  </View>
                )}
              </View>

              {taskCount > 0 && (
                <View style={[styles.progressPill, { backgroundColor: hexToRgba(subject.color, 0.12) }]}>
                  <Ionicons name="analytics" size={12} color={subject.color} />
                  <Text style={[styles.progressPillText, { color: subject.color }]}>
                    {Math.round(progress)}%
                  </Text>
                </View>
              )}
            </View>

            {/* Subject name */}
            <Text style={styles.subjectName} numberOfLines={2}>
              {subject.name}
            </Text>

            {/* Status message */}
            <Text style={[styles.statusMessage, isComplete && styles.statusComplete]}>
              {getStatusMessage()}
            </Text>

            {/* Stats row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="list-outline" size={14} color={colors.textTertiary} />
                <Text style={styles.statText}>{taskCount} tasks</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="checkmark-circle-outline" size={14} color={colors.success} />
                <Text style={[styles.statText, { color: colors.success }]}>{completedCount} done</Text>
              </View>
            </View>

            {/* Progress bar */}
            {taskCount > 0 && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${progress}%`,
                        backgroundColor: isComplete ? colors.success : subject.color,
                      },
                    ]}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: spacing.xs,
    minHeight: 170,
    maxWidth: '48%',
  },
  touchable: {
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  accentBar: {
    height: 4,
    width: '100%',
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  progressPillText: {
    fontSize: typography.xs,
    fontWeight: '700',
  },
  completeBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  subjectName: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    lineHeight: 24,
  },
  statusMessage: {
    fontSize: typography.xs,
    color: colors.textTertiary,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  statusComplete: {
    color: colors.success,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  progressContainer: {
    marginTop: 'auto',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
});

export default SubjectCard;
