/**
 * FloatingElement Component
 * Container with depth shadow and elevation effects
 * Creates floating appearance with colored glow
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { colors, borderRadius } from '../../constants/Colors';

const FloatingElement = ({
  children,
  style,
  elevation = 'medium', // low, medium, high
  glowColor = null,
  shadowIntensity = 'medium', // light, medium, heavy
  animate = false, // Enable floating animation
  animationDuration = 2000,
  ...props
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animate) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: animationDuration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: animationDuration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animate, animationDuration]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  // Elevation-based shadow styles
  const elevationStyles = {
    low: {
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
      elevation: 4,
    },
    high: {
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 16,
      elevation: 8,
    },
  };

  // Shadow intensity
  const intensityMap = {
    light: 0.2,
    medium: 0.3,
    heavy: 0.4,
  };

  const shadowOpacity = intensityMap[shadowIntensity] || intensityMap.medium;

  const shadowColor = glowColor || colors.shadow.heavy;

  return (
    <Animated.View
      style={[
        styles.container,
        elevationStyles[elevation],
        {
          shadowColor,
          shadowOpacity,
          transform: animate ? [{ translateY }] : [],
        },
        style,
      ]}
      {...props}
    >
      {glowColor && (
        <View
          style={[
            styles.glow,
            elevationStyles[elevation],
            {
              backgroundColor: glowColor,
              opacity: 0.3,
            },
          ]}
        />
      )}
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
  },
  glow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: borderRadius.lg,
    zIndex: -1,
  },
});

export default FloatingElement;
