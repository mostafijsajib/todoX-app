/**
 * GlassContainer Component
 * Full-screen or section container with glassmorphism effect
 * Includes gradient backgrounds and optional particle overlays
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { colors } from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

const GlassContainer = ({
  children,
  style,
  gradient = 'primary', // primary, secondary, warm, cool, sunset, ocean, custom
  customGradient = null,
  particles = false,
  particleAnimation = null, // Optional Lottie animation for particles
  intensity = 'medium', // light, medium, dark
  overlay = true,
  ...props
}) => {
  // Gradient color mappings
  const gradientMap = {
    primary: colors.gradients.primary,
    secondary: colors.gradients.secondary,
    warm: colors.gradients.warm,
    cool: colors.gradients.cool,
    sunset: colors.gradients.sunset,
    ocean: colors.gradients.ocean,
    custom: customGradient || colors.gradients.primary,
  };

  const gradientColors = gradientMap[gradient] || gradientMap.primary;

  // Overlay opacity based on intensity
  const overlayOpacityMap = {
    light: 0.5,
    medium: 0.7,
    dark: 0.85,
  };

  const overlayOpacity = overlayOpacityMap[intensity] || overlayOpacityMap.medium;

  return (
    <View style={[styles.container, style]} {...props}>
      {/* Gradient Background */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Dark Overlay for better readability */}
        {overlay && (
          <View
            style={[
              styles.overlay,
              { backgroundColor: `rgba(26, 26, 26, ${overlayOpacity})` },
            ]}
          />
        )}

        {/* Particle Animation Overlay */}
        {particles && particleAnimation && (
          <View style={styles.particleContainer}>
            <LottieView
              source={particleAnimation}
              autoPlay
              loop
              style={styles.particles}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>{children}</View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  particles: {
    width: width,
    height: height,
  },
  content: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
});

export default GlassContainer;
