/**
 * SkeletonLoader Component
 * Professional skeleton loading animations
 */
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { colors, spacing, borderRadius } from '@/constants/Colors';

/**
 * Base skeleton element with shimmer animation
 */
const SkeletonElement = ({ 
  width = '100%', 
  height = 20, 
  borderRadius: radius = borderRadius.sm,
  style,
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: radius,
          opacity,
        },
        style,
      ]}
    />
  );
};

/**
 * Task item skeleton
 */
export const TaskItemSkeleton = () => (
  <View style={styles.taskItem}>
    <View style={styles.taskLeft}>
      <SkeletonElement width={24} height={24} borderRadius={12} />
    </View>
    <View style={styles.taskContent}>
      <SkeletonElement width="80%" height={16} />
      <View style={styles.taskMeta}>
        <SkeletonElement width={60} height={12} />
        <SkeletonElement width={40} height={12} style={{ marginLeft: spacing.sm }} />
      </View>
    </View>
  </View>
);

/**
 * Subject card skeleton
 */
export const SubjectCardSkeleton = () => (
  <View style={styles.subjectCard}>
    <SkeletonElement width={48} height={48} borderRadius={borderRadius.md} />
    <SkeletonElement width="60%" height={16} style={{ marginTop: spacing.sm }} />
    <SkeletonElement width="40%" height={12} style={{ marginTop: spacing.xs }} />
  </View>
);

/**
 * Exam card skeleton
 */
export const ExamCardSkeleton = () => (
  <View style={styles.examCard}>
    <View style={styles.examHeader}>
      <SkeletonElement width={40} height={40} borderRadius={borderRadius.md} />
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <SkeletonElement width="70%" height={16} />
        <SkeletonElement width="40%" height={12} style={{ marginTop: spacing.xs }} />
      </View>
    </View>
    <View style={styles.examFooter}>
      <SkeletonElement width={80} height={24} borderRadius={borderRadius.sm} />
      <SkeletonElement width={60} height={24} borderRadius={borderRadius.sm} />
    </View>
  </View>
);

/**
 * Stats card skeleton
 */
export const StatsCardSkeleton = () => (
  <View style={styles.statsCard}>
    <SkeletonElement width={32} height={32} borderRadius={16} />
    <SkeletonElement width={40} height={24} style={{ marginTop: spacing.sm }} />
    <SkeletonElement width={60} height={12} style={{ marginTop: spacing.xs }} />
  </View>
);

/**
 * Full screen loading skeleton for Today screen
 */
export const TodayScreenSkeleton = () => (
  <View style={styles.todaySkeleton}>
    {/* Header skeleton */}
    <View style={styles.headerSkeleton}>
      <SkeletonElement width={100} height={32} />
      <SkeletonElement width={150} height={16} style={{ marginTop: spacing.xs }} />
    </View>
    
    {/* Stats row skeleton */}
    <View style={styles.statsRow}>
      <StatsCardSkeleton />
      <StatsCardSkeleton />
      <StatsCardSkeleton />
    </View>
    
    {/* Progress bar skeleton */}
    <View style={styles.progressSkeleton}>
      <SkeletonElement width="100%" height={8} borderRadius={4} />
    </View>
    
    {/* Task list skeleton */}
    <View style={styles.taskListSkeleton}>
      <TaskItemSkeleton />
      <TaskItemSkeleton />
      <TaskItemSkeleton />
      <TaskItemSkeleton />
    </View>
  </View>
);

/**
 * List loading skeleton
 */
export const ListSkeleton = ({ count = 5, ItemComponent = TaskItemSkeleton }) => (
  <View style={styles.listSkeleton}>
    {Array.from({ length: count }).map((_, index) => (
      <ItemComponent key={index} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.backgroundTertiary,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  taskLeft: {
    marginRight: spacing.md,
  },
  taskContent: {
    flex: 1,
  },
  taskMeta: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  subjectCard: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginRight: spacing.md,
    width: 140,
    alignItems: 'center',
  },
  examCard: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  examHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  examFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  statsCard: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  todaySkeleton: {
    flex: 1,
    padding: spacing.screen,
  },
  headerSkeleton: {
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  progressSkeleton: {
    marginBottom: spacing.lg,
  },
  taskListSkeleton: {
    flex: 1,
  },
  listSkeleton: {
    flex: 1,
  },
});

export default SkeletonElement;
