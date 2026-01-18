import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/constants/Colors';

/**
 * 📅 CountdownBadge Component
 * Animated countdown timer for exams with urgency indicators
 */
const CountdownBadge = ({ examDate, size = 'medium', showLabel = true }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  
  /**
   * Calculate days until exam
   */
  const getDaysUntil = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(examDate);
    exam.setHours(0, 0, 0, 0);
    const diffTime = exam - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const days = getDaysUntil();
  const isUrgent = days >= 0 && days <= 3;
  const isPast = days < 0;

  // Pulse animation for urgent exams
  useEffect(() => {
    if (isUrgent && !isPast) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.6,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [isUrgent, isPast]);

  /**
   * Get color based on urgency
   */
  const getColor = () => {
    if (isPast) return colors.textTertiary;
    if (days === 0) return colors.error;
    if (days <= 3) return colors.error;
    if (days <= 7) return colors.warning;
    if (days <= 14) return colors.info;
    return colors.success;
  };

  /**
   * Get emoji based on status
   */
  const getEmoji = () => {
    if (isPast) return '✓';
    if (days === 0) return '🚨';
    if (days <= 3) return '⚠️';
    if (days <= 7) return '📚';
    return '📅';
  };

  /**
   * Get label text
   */
  const getLabel = () => {
    if (isPast) return 'Completed';
    if (days === 0) return 'TODAY!';
    if (days === 1) return 'Tomorrow';
    if (days <= 7) return `${days} days`;
    const weeks = Math.floor(days / 7);
    if (weeks === 1) return '1 week';
    if (weeks < 4) return `${weeks} weeks`;
    const months = Math.floor(days / 30);
    if (months === 1) return '1 month';
    return `${months} months`;
  };

  const color = getColor();

  const sizeStyles = {
    small: {
      containerSize: 56,
      badgeSize: 44,
      fontSize: typography.md,
      labelSize: typography.xxs,
      iconSize: 10,
    },
    medium: {
      containerSize: 72,
      badgeSize: 56,
      fontSize: typography.xl,
      labelSize: typography.xs,
      iconSize: 12,
    },
    large: {
      containerSize: 96,
      badgeSize: 72,
      fontSize: typography.xxl,
      labelSize: typography.sm,
      iconSize: 14,
    },
  };

  const { containerSize, badgeSize, fontSize, labelSize, iconSize } = sizeStyles[size];

  return (
    <View style={[styles.container, { width: containerSize }]}>
      <Animated.View
        style={[
          styles.badgeWrapper,
          { transform: [{ scale: isUrgent ? pulseAnim : 1 }] },
        ]}
      >
        {/* Glow effect for urgent */}
        {isUrgent && !isPast && (
          <Animated.View
            style={[
              styles.glow,
              {
                width: badgeSize + 16,
                height: badgeSize + 16,
                borderRadius: (badgeSize + 16) / 2,
                backgroundColor: color,
                opacity: glowAnim,
              },
            ]}
          />
        )}
        
        {/* Main badge */}
        <View
          style={[
            styles.badge,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              backgroundColor: color + '18',
              borderColor: color + '50',
            },
          ]}
        >
          {/* Inner ring */}
          <View
            style={[
              styles.innerRing,
              {
                width: badgeSize - 8,
                height: badgeSize - 8,
                borderRadius: (badgeSize - 8) / 2,
                borderColor: color,
              },
            ]}
          >
            <Text style={[styles.daysText, { fontSize, color }]}>
              {isPast ? '✓' : days}
            </Text>
          </View>
        </View>
      </Animated.View>
      
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text
            style={[
              styles.label,
              { fontSize: labelSize, color },
              isUrgent && !isPast && styles.labelUrgent,
            ]}
          >
            {getLabel()}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  badgeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  innerRing: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  daysText: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  labelContainer: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
  },
  label: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  labelUrgent: {
    textTransform: 'uppercase',
  },
});

export default CountdownBadge;
