/**
 * GlassCard Component
 * A card component with glassmorphism effect (frosted glass)
 * Supports iOS BlurView and Android opacity fallback
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
// Support both old and new theme imports
import { colors, borderRadius as oldBorderRadius, spacing } from '../../constants/Colors';
import { palette, radius, space } from '../../constants/Theme';

// Use new theme values with fallback to old
const borderRadius = radius || oldBorderRadius;

const GlassCard = ({
  children,
  style,
  blurIntensity = 'medium',
  borderGradient = false,
  glowColor = null,
  variant = 'default', // default, elevated, flat
  ...props
}) => {
  // Map blur intensity to actual values
  const blurMap = {
    light: colors.blur.light,
    medium: colors.blur.medium,
    heavy: colors.blur.heavy,
  };

  const blurAmount = blurMap[blurIntensity] || blurMap.medium;

  // Map blur intensity to background opacity for Android fallback
  const opacityMap = {
    light: colors.glass.light,
    medium: colors.glass.medium,
    heavy: colors.glass.heavy,
  };

  const backgroundColor = opacityMap[blurIntensity] || opacityMap.medium;

  // Variant-based styles
  const variantStyles = {
    default: {
      borderWidth: 1,
      borderColor: colors.glass.border,
    },
    elevated: {
      borderWidth: 1,
      borderColor: colors.glass.border,
      shadowColor: glowColor || colors.glow.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    flat: {
      borderWidth: 0,
    },
  };

  // iOS uses BlurView for true glassmorphism
  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.container, variantStyles[variant], style]} {...props}>
        <BlurView
          style={styles.blurView}
          blurType="dark"
          blurAmount={blurAmount}
          reducedTransparencyFallbackColor={colors.surface}
        >
          {borderGradient && (
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBorder}
            />
          )}
          {glowColor && variant === 'elevated' && (
            <View style={[styles.glow, { backgroundColor: glowColor }]} />
          )}
          <View style={styles.content}>{children}</View>
        </BlurView>
      </View>
    );
  }

  // Android fallback - semi-transparent background with border
  return (
    <View
      style={[
        styles.container,
        variantStyles[variant],
        { backgroundColor },
        style,
      ]}
      {...props}
    >
      {borderGradient && (
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBorder}
        />
      )}
      {glowColor && variant === 'elevated' && (
        <View style={[styles.glow, { backgroundColor: glowColor }]} />
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  blurView: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: spacing.sm + 2,
  },
  gradientBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  glow: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    opacity: 0.3,
    borderRadius: borderRadius.lg,
    zIndex: -1,
  },
});

export default GlassCard;
