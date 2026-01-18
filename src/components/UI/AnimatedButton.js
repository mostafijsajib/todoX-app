/**
 * AnimatedButton Component
 * Glass button with spring animations and haptic feedback
 * Supports multiple variants and icon integration
 */

import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Platform,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors, borderRadius, spacing, typography } from '../../constants/Colors';
import haptics from '../../utils/haptics';

const AnimatedButton = ({
  onPress,
  title,
  icon,
  iconPosition = 'left', // left, right
  variant = 'primary', // primary, secondary, ghost, glass
  size = 'medium', // small, medium, large
  disabled = false,
  loading = false,
  glassEffect = true,
  hapticFeedback = true,
  style,
  textStyle,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;

    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      damping: 15,
      stiffness: 300,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;

    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 10,
      stiffness: 180,
    }).start();
  };

  const handlePress = () => {
    if (disabled || loading) return;

    if (hapticFeedback) {
      haptics.light();
    }

    onPress?.();
  };

  // Variant styles
  const variantStyles = {
    primary: {
      backgroundColor: colors.primary,
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: colors.secondary,
      borderWidth: 0,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border,
    },
    glass: {
      backgroundColor: colors.glass.medium,
      borderWidth: 1,
      borderColor: colors.glass.border,
    },
  };

  // Size styles
  const sizeStyles = {
    small: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      minHeight: 36,
    },
    medium: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      minHeight: 48,
    },
    large: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.lg,
      minHeight: 56,
    },
  };

  // Text size styles
  const textSizeStyles = {
    small: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
    },
    medium: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
    },
    large: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
    },
  };

  const buttonContent = (
    <View style={styles.contentContainer}>
      {icon && iconPosition === 'left' && (
        <View style={styles.iconLeft}>{icon}</View>
      )}
      {title && (
        <Text
          style={[
            styles.text,
            textSizeStyles[size],
            variant === 'ghost' && { color: colors.textPrimary },
            textStyle,
          ]}
        >
          {loading ? 'Loading...' : title}
        </Text>
      )}
      {icon && iconPosition === 'right' && (
        <View style={styles.iconRight}>{icon}</View>
      )}
    </View>
  );

  const buttonStyle = [
    styles.button,
    variantStyles[variant],
    sizeStyles[size],
    disabled && styles.disabled,
    style,
  ];

  // Glass variant with BlurView on iOS
  if (variant === 'glass' && glassEffect && Platform.OS === 'ios') {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          disabled={disabled || loading}
          activeOpacity={0.8}
          {...props}
        >
          <View style={buttonStyle}>
            <BlurView
              style={styles.blurView}
              blurType="dark"
              blurAmount={colors.blur.medium}
              reducedTransparencyFallbackColor={colors.surface}
            >
              {buttonContent}
            </BlurView>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // Standard button with optional gradient for primary/secondary
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        {...props}
      >
        <View style={buttonStyle}>
          {(variant === 'primary' || variant === 'secondary') && (
            <LinearGradient
              colors={
                variant === 'primary'
                  ? [colors.primary, colors.primaryDark]
                  : [colors.secondary, colors.secondaryDark]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            />
          )}
          {buttonContent}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.textOnPrimary,
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default AnimatedButton;
