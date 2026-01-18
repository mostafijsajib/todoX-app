/**
 * Animation Utilities
 * Helper functions for creating consistent animations throughout the app
 */

import { Animated } from 'react-native';
import { springConfigs, timingConfigs, durations, easings } from '../constants/Animations';

/**
 * Create a spring animation
 */
export const createSpring = (animatedValue, toValue, config = 'gentle') => {
  const springConfig = typeof config === 'string' ? springConfigs[config] : config;

  return Animated.spring(animatedValue, {
    toValue,
    ...springConfig,
    useNativeDriver: true,
  });
};

/**
 * Create a timing animation
 */
export const createTiming = (animatedValue, toValue, config = 'normal') => {
  const timingConfig = typeof config === 'string' ? timingConfigs[config] : config;

  return Animated.timing(animatedValue, {
    toValue,
    ...timingConfig,
    useNativeDriver: true,
  });
};

/**
 * Create a sequence of animations
 */
export const createSequence = (animations) => {
  return Animated.sequence(animations);
};

/**
 * Create parallel animations
 */
export const createParallel = (animations) => {
  return Animated.parallel(animations);
};

/**
 * Create staggered animations for lists
 */
export const createStagger = (delay, animations) => {
  return Animated.stagger(delay, animations);
};

/**
 * Fade in animation
 */
export const fadeIn = (animatedValue, duration = durations.normal) => {
  return createTiming(animatedValue, 1, { duration, easing: easings.easeIn });
};

/**
 * Fade out animation
 */
export const fadeOut = (animatedValue, duration = durations.normal) => {
  return createTiming(animatedValue, 0, { duration, easing: easings.easeOut });
};

/**
 * Scale animation
 */
export const scale = (animatedValue, toValue, config = 'bouncy') => {
  return createSpring(animatedValue, toValue, config);
};

/**
 * Slide animation
 */
export const slide = (animatedValue, toValue, duration = durations.normal) => {
  return createTiming(animatedValue, toValue, { duration, easing: easings.easeInOut });
};

/**
 * Card entrance animation (fade + slide + scale)
 */
export const cardEntrance = (opacity, translateY, scale, delay = 0) => {
  return createSequence([
    Animated.delay(delay),
    createParallel([
      fadeIn(opacity),
      createSpring(translateY, 0, 'gentle'),
      createSpring(scale, 1, 'gentle'),
    ]),
  ]);
};

/**
 * Card exit animation (fade + slide + scale)
 */
export const cardExit = (opacity, translateY, scale) => {
  return createParallel([
    fadeOut(opacity),
    createSpring(translateY, -50, 'stiff'),
    createSpring(scale, 0.9, 'stiff'),
  ]);
};

/**
 * Modal slide up animation
 */
export const modalSlideUp = (translateY) => {
  return createSpring(translateY, 0, 'modal');
};

/**
 * Modal slide down animation
 */
export const modalSlideDown = (translateY, toValue = 1000) => {
  return createSpring(translateY, toValue, 'modal');
};

/**
 * Button press animation
 */
export const buttonPress = (scale) => {
  return createSpring(scale, 0.95, 'stiff');
};

/**
 * Button release animation
 */
export const buttonRelease = (scale) => {
  return createSpring(scale, 1, 'bouncy');
};

/**
 * Pulse animation (loop)
 */
export const pulse = (animatedValue, minValue = 0.95, maxValue = 1.05, duration = 1000) => {
  return Animated.loop(
    createSequence([
      createTiming(animatedValue, maxValue, { duration: duration / 2, easing: easings.easeInOut }),
      createTiming(animatedValue, minValue, { duration: duration / 2, easing: easings.easeInOut }),
    ])
  );
};

/**
 * Rotation animation (loop)
 */
export const rotate = (animatedValue, duration = 1000) => {
  return Animated.loop(
    createTiming(animatedValue, 1, { duration, easing: easings.linear })
  );
};

/**
 * Shake animation
 */
export const shake = (animatedValue, intensity = 10) => {
  return createSequence([
    createTiming(animatedValue, intensity, { duration: 100, easing: easings.linear }),
    createTiming(animatedValue, -intensity, { duration: 100, easing: easings.linear }),
    createTiming(animatedValue, intensity, { duration: 100, easing: easings.linear }),
    createTiming(animatedValue, -intensity, { duration: 100, easing: easings.linear }),
    createTiming(animatedValue, 0, { duration: 100, easing: easings.linear }),
  ]);
};

/**
 * Success checkmark animation
 */
export const successCheckmark = (scale, opacity) => {
  return createSequence([
    createParallel([
      createSpring(scale, 1.2, 'bouncy'),
      fadeIn(opacity, durations.fast),
    ]),
    createSpring(scale, 1, 'gentle'),
  ]);
};

/**
 * Create looping animation
 */
export const createLoop = (animation, iterations = -1) => {
  return Animated.loop(animation, { iterations });
};

/**
 * Staggered list entrance animation
 */
export const staggeredListEntrance = (items, delay = 50) => {
  const animations = items.map((item) => {
    return cardEntrance(item.opacity, item.translateY, item.scale);
  });

  return createStagger(delay, animations);
};

/**
 * Interpolate color
 */
export const interpolateColor = (animatedValue, inputRange, outputRange) => {
  return animatedValue.interpolate({
    inputRange,
    outputRange,
  });
};

/**
 * Interpolate rotation
 */
export const interpolateRotation = (animatedValue, rotations = 1) => {
  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${360 * rotations}deg`],
  });
};

/**
 * Interpolate translate
 */
export const interpolateTranslate = (animatedValue, from, to) => {
  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [from, to],
  });
};

export default {
  createSpring,
  createTiming,
  createSequence,
  createParallel,
  createStagger,
  fadeIn,
  fadeOut,
  scale,
  slide,
  cardEntrance,
  cardExit,
  modalSlideUp,
  modalSlideDown,
  buttonPress,
  buttonRelease,
  pulse,
  rotate,
  shake,
  successCheckmark,
  createLoop,
  staggeredListEntrance,
  interpolateColor,
  interpolateRotation,
  interpolateTranslate,
};
