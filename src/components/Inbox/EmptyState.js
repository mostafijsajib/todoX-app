import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/constants/Colors';

/**
 * EmptyState Component
 * Beautiful animated empty state with glassmorphism design
 */
const EmptyState = ({
  icon = 'checkmark-done-outline',
  title = 'All caught up!',
  subtitle = 'Add a new task to get started on your study goals',
  iconColor = colors.primary,
  variant = 'default', // 'default', 'minimal', 'celebration'
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animation for icon
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    float.start();

    return () => float.stop();
  }, []);

  const getIconConfig = () => {
    switch (variant) {
      case 'celebration':
        return { name: 'trophy', color: '#FFD700', bgColor: '#FFD70015' };
      case 'minimal':
        return { name: icon, color: colors.textTertiary, bgColor: colors.surface };
      default:
        return { name: icon, color: iconColor, bgColor: `${iconColor}15` };
    }
  };

  const { name: iconName, color: iconFinalColor, bgColor } = getIconConfig();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Decorative background circles */}
      <View style={styles.decorativeContainer}>
        <View style={[styles.decorativeCircle, styles.circle1]} />
        <View style={[styles.decorativeCircle, styles.circle2]} />
        <View style={[styles.decorativeCircle, styles.circle3]} />
      </View>

      {/* Main content */}
      <Animated.View
        style={[
          styles.iconWrapper,
          { backgroundColor: bgColor },
          { transform: [{ translateY: floatAnim }] },
        ]}
      >
        <View style={[styles.iconInner, { backgroundColor: `${iconFinalColor}10` }]}>
          <Ionicons name={iconName} size={48} color={iconFinalColor} />
        </View>
      </Animated.View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {/* Decorative dots */}
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, { backgroundColor: colors.primary }]} />
        <View style={[styles.dot, { backgroundColor: colors.secondary }]} />
        <View style={[styles.dot, { backgroundColor: colors.success }]} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl * 1.5,
    position: 'relative',
  },
  decorativeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.5,
  },
  circle1: {
    width: 200,
    height: 200,
    backgroundColor: `${colors.primary}08`,
  },
  circle2: {
    width: 150,
    height: 150,
    backgroundColor: `${colors.secondary}08`,
    transform: [{ translateX: 50 }, { translateY: -30 }],
  },
  circle3: {
    width: 100,
    height: 100,
    backgroundColor: `${colors.primary}10`,
    transform: [{ translateX: -60 }, { translateY: 40 }],
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
    paddingHorizontal: spacing.md,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.6,
  },
});

export default EmptyState;
