/**
 * 📚 SubjectCard Component
 * Beautiful subject cards with progress visualization
 * Student-focused design with motivational elements
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography, shadows } from '@/constants/Colors';

const SubjectCard = ({
  subject,
  taskCount = 0,
  completedCount = 0,
  onPress,
  onLongPress,
  style,
  index = 0,
}) => {
  // Calculate progress percentage
  const progress = taskCount > 0 ? (completedCount / taskCount) * 100 : 0;
  const isComplete = taskCount > 0 && completedCount === taskCount;
  
  // Animations
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Staggered entrance animation
    const delay = index * 80;
    
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 800,
      delay: delay + 300,
      useNativeDriver: false,
    }).start();
  }, [progress, index]);
  
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  // Get gradient colors based on subject color
  const getGradientColors = () => {
    const baseColor = subject.color || colors.primary;
    return [baseColor + '15', baseColor + '08'];
  };

  // Get status message
  const getStatusMessage = () => {
    if (taskCount === 0) return 'Start adding tasks';
    if (isComplete) return '✨ All done!';
    const remaining = taskCount - completedCount;
    return `${remaining} task${remaining !== 1 ? 's' : ''} left`;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.touchable}
      >
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          {/* Colored accent bar */}
          <View style={[styles.accentBar, { backgroundColor: subject.color }]} />
          
          {/* Decorative background circle */}
          <View style={[styles.decorativeCircle, { backgroundColor: subject.color + '10' }]} />
          
          {/* Main content */}
          <View style={styles.content}>
            {/* Icon with glow effect */}
            <View style={styles.iconSection}>
              <View style={[styles.iconGlow, { backgroundColor: subject.color + '30' }]} />
              <View style={[styles.iconContainer, { backgroundColor: subject.color + '25' }]}>
                <Ionicons
                  name={subject.icon || 'book'}
                  size={28}
                  color={subject.color}
                />
              </View>
              {isComplete && (
                <View style={styles.completeBadge}>
                  <Ionicons name="checkmark" size={10} color={colors.white} />
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

            {/* Progress section */}
            <View style={styles.progressSection}>
              {/* Stats row */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Ionicons name="layers-outline" size={12} color={colors.textTertiary} />
                  <Text style={styles.statText}>{taskCount}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Ionicons name="checkmark-circle" size={12} color={colors.success} />
                  <Text style={[styles.statText, { color: colors.success }]}>{completedCount}</Text>
                </View>
              </View>

              {/* Progress bar */}
              {taskCount > 0 && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <Animated.View
                      style={[
                        styles.progressFill,
                        {
                          width: progressWidth,
                          backgroundColor: isComplete ? colors.success : subject.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.progressPercent, { color: subject.color }]}>
                    {Math.round(progress)}%
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Shimmer effect for complete subjects */}
          {isComplete && (
            <View style={styles.shimmer} />
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: spacing.xs,
    minHeight: 180,
    maxWidth: '50%',
  },
  touchable: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    position: 'relative',
    ...shadows.card,
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  decorativeCircle: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconGlow: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    top: -4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  completeBadge: {
    position: 'absolute',
    bottom: 0,
    right: '30%',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  subjectName: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xxs,
    letterSpacing: 0.2,
  },
  statusMessage: {
    fontSize: typography.xs,
    color: colors.textTertiary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  statusComplete: {
    color: colors.success,
    fontWeight: '600',
  },
  progressSection: {
    marginTop: 'auto',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  statText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  progressPercent: {
    fontSize: typography.xxs,
    fontWeight: '700',
    minWidth: 32,
    textAlign: 'right',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.success + '30',
    borderRadius: borderRadius.xl,
  },
});

export default SubjectCard;
