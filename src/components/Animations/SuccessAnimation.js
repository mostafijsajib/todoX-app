/**
 * SuccessAnimation Component
 * Displays a celebration animation when a task is completed
 * Features animated checkmark with confetti burst
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

const SuccessAnimation = ({ visible, onComplete }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const checkmarkRotate = useRef(new Animated.Value(0)).current;
  const confettiAnims = useRef(
    Array.from({ length: 20 }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(1),
      rotate: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      fadeAnim.setValue(0);
      scaleAnim.setValue(0);
      checkmarkRotate.setValue(0);
      confettiAnims.forEach(anim => {
        anim.x.setValue(0);
        anim.y.setValue(0);
        anim.opacity.setValue(1);
        anim.rotate.setValue(0);
      });

      // Checkmark animation
      Animated.sequence([
        // Fade in background
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        // Checkmark pop-in
        Animated.spring(scaleAnim, {
          toValue: 1,
          damping: 10,
          stiffness: 180,
          useNativeDriver: true,
        }),
      ]).start();

      // Checkmark rotation
      Animated.timing(checkmarkRotate, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // Confetti burst animation
      confettiAnims.forEach((anim, index) => {
        const angle = (index / confettiAnims.length) * Math.PI * 2;
        const distance = 150 + Math.random() * 100;
        const targetX = Math.cos(angle) * distance;
        const targetY = Math.sin(angle) * distance;

        Animated.parallel([
          // Movement
          Animated.timing(anim.x, {
            toValue: targetX,
            duration: 800 + Math.random() * 400,
            useNativeDriver: true,
          }),
          Animated.timing(anim.y, {
            toValue: targetY,
            duration: 800 + Math.random() * 400,
            useNativeDriver: true,
          }),
          // Fade out
          Animated.timing(anim.opacity, {
            toValue: 0,
            duration: 1000,
            delay: 200,
            useNativeDriver: true,
          }),
          // Rotation
          Animated.timing(anim.rotate, {
            toValue: Math.random() > 0.5 ? 360 : -360,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start();
      });

      // Auto dismiss
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onComplete?.();
        });
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
        },
      ]}
      pointerEvents="none"
    >
      {/* Confetti particles */}
      {confettiAnims.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.confetti,
            {
              backgroundColor: [
                colors.primary,
                colors.secondary,
                colors.success,
                colors.warning,
                colors.info,
              ][index % 5],
              transform: [
                { translateX: anim.x },
                { translateY: anim.y },
                {
                  rotate: anim.rotate.interpolate({
                    inputRange: [-360, 360],
                    outputRange: ['-360deg', '360deg'],
                  }),
                },
              ],
              opacity: anim.opacity,
            },
          ]}
        />
      ))}

      {/* Checkmark */}
      <Animated.View
        style={[
          styles.checkmarkContainer,
          {
            transform: [
              { scale: scaleAnim },
              {
                rotate: checkmarkRotate.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.checkmarkCircle}>
          <Ionicons name="checkmark" size={60} color={colors.white} />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  checkmarkContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
    borderWidth: 4,
    borderColor: colors.white,
  },
});

export default SuccessAnimation;
