/**
 * Animation constants and configurations for TodoX app
 * Neomorphic design - Softer, more organic animations
 */

import { Easing } from 'react-native';

/**
 * Spring animation configurations
 * Optimized for neomorphic tactile interactions
 */
export const springConfigs = {
  // Neomorphic soft - Gentle, organic for general use
  neoSoft: {
    damping: 25,
    mass: 1.5,
    stiffness: 90,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },

  // Neomorphic button - Playful but controlled for buttons
  neoButton: {
    damping: 18,
    mass: 0.8,
    stiffness: 250,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },

  // Neomorphic card - Smooth entrance for cards
  neoCard: {
    damping: 22,
    mass: 1.0,
    stiffness: 150,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },

  // Neomorphic modal - Elegant presentation
  neoModal: {
    damping: 28,
    mass: 1.2,
    stiffness: 180,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },

  // Legacy configs (kept for backwards compatibility)
  gentle: {
    damping: 25,
    mass: 1.5,
    stiffness: 90,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },

  bouncy: {
    damping: 18,
    mass: 0.8,
    stiffness: 250,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },

  stiff: {
    damping: 25,
    mass: 0.5,
    stiffness: 300,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },

  soft: {
    damping: 30,
    mass: 1.2,
    stiffness: 100,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },

  modal: {
    damping: 28,
    mass: 1.2,
    stiffness: 180,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

/**
 * Timing configurations for standard animations
 */
export const timingConfigs = {
  // Neomorphic-specific timings
  neoPress: {
    duration: 150,
    easing: Easing.bezier(0.4, 0.0, 0.2, 1), // Quick press
  },

  neoRelease: {
    duration: 200,
    easing: Easing.bezier(0.0, 0.0, 0.2, 1), // Smooth release
  },

  neoFade: {
    duration: 300,
    easing: Easing.out(Easing.cubic),
  },

  // Standard timings
  instant: {
    duration: 100,
    easing: Easing.out(Easing.cubic),
  },

  fast: {
    duration: 200,
    easing: Easing.out(Easing.cubic),
  },

  normal: {
    duration: 300,
    easing: Easing.out(Easing.cubic),
  },

  slow: {
    duration: 450,
    easing: Easing.out(Easing.cubic),
  },

  // Legacy configs
  glass: {
    duration: 400,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  },

  bounce: {
    duration: 600,
    easing: Easing.bounce,
  },

  elastic: {
    duration: 700,
    easing: Easing.elastic(1.2),
  },
};

/**
 * Animation durations in milliseconds
 */
export const durations = {
  instant: 0,
  veryFast: 100,
  fast: 200,
  normal: 300,
  moderate: 400,
  slow: 500,
  verySlow: 700,
  slowest: 1000,
};

/**
 * Easing curves for different animation types
 */
export const easings = {
  linear: Easing.linear,
  easeIn: Easing.in(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),
  cubic: Easing.bezier(0.4, 0.0, 0.2, 1),
  entrance: Easing.bezier(0.0, 0.0, 0.2, 1),
  exit: Easing.bezier(0.4, 0.0, 1, 1),
  sharp: Easing.bezier(0.4, 0.0, 0.6, 1),
  smooth: Easing.bezier(0.25, 0.1, 0.25, 1),
};

/**
 * Preset animation configurations for common UI patterns
 */
export const presets = {
  // Neomorphic button press (tactile depth change)
  neoButton: {
    press: {
      from: { scale: 1, translateY: 0, shadowOpacity: 0.3 },
      to: { scale: 0.98, translateY: 2, shadowOpacity: 0.1 },
      timing: timingConfigs.neoPress,
    },
    release: {
      from: { scale: 0.98, translateY: 2, shadowOpacity: 0.1 },
      to: { scale: 1, translateY: 0, shadowOpacity: 0.3 },
      spring: springConfigs.neoButton,
    },
  },

  // Neomorphic card entrance
  neoCard: {
    entrance: {
      from: { translateY: 30, opacity: 0, scale: 0.95 },
      to: { translateY: 0, opacity: 1, scale: 1 },
      spring: springConfigs.neoCard,
    },
    exit: {
      from: { translateY: 0, opacity: 1, scale: 1 },
      to: { translateY: -30, opacity: 0, scale: 0.95 },
      spring: springConfigs.neoSoft,
    },
  },

  // Modal animations
  modal: {
    slideUp: {
      from: { translateY: 1000, opacity: 0 },
      to: { translateY: 0, opacity: 1 },
      spring: springConfigs.neoModal,
    },
    slideDown: {
      from: { translateY: 0, opacity: 1 },
      to: { translateY: 1000, opacity: 0 },
      spring: springConfigs.neoModal,
    },
    fade: {
      from: { opacity: 0, scale: 0.95 },
      to: { opacity: 1, scale: 1 },
      timing: timingConfigs.neoFade,
    },
  },

  // Legacy button animations
  button: {
    press: {
      from: { scale: 1 },
      to: { scale: 0.98 },
      timing: timingConfigs.neoPress,
    },
    release: {
      from: { scale: 0.98 },
      to: { scale: 1 },
      spring: springConfigs.neoButton,
    },
  },

  // Card animations
  card: {
    entrance: {
      from: { translateY: 30, opacity: 0, scale: 0.95 },
      to: { translateY: 0, opacity: 1, scale: 1 },
      spring: springConfigs.neoCard,
    },
    exit: {
      from: { translateY: 0, opacity: 1, scale: 1 },
      to: { translateY: -30, opacity: 0, scale: 0.95 },
      spring: springConfigs.neoSoft,
    },
  },

  // Glass effect animations (legacy)
  glass: {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
      timing: timingConfigs.glass,
    },
    grow: {
      from: { scale: 0.8, opacity: 0 },
      to: { scale: 1, opacity: 1 },
      spring: springConfigs.soft,
    },
  },

  // Floating element animations
  float: {
    up: {
      from: { translateY: 0 },
      to: { translateY: -5 },
      timing: { ...timingConfigs.slow, easing: easings.easeInOut },
    },
    down: {
      from: { translateY: -5 },
      to: { translateY: 0 },
      timing: { ...timingConfigs.slow, easing: easings.easeInOut },
    },
  },
};

/**
 * Stagger delays for list animations (in milliseconds)
 */
export const staggerDelays = {
  veryShort: 30,
  short: 50,
  normal: 100,
  long: 150,
  veryLong: 200,
};

/**
 * Particle animation configurations for backgrounds
 */
export const particleConfigs = {
  slow: {
    count: 10,
    speed: 0.5,
    size: { min: 2, max: 4 },
    opacity: { min: 0.1, max: 0.3 },
  },
  normal: {
    count: 20,
    speed: 1,
    size: { min: 2, max: 6 },
    opacity: { min: 0.15, max: 0.4 },
  },
  fast: {
    count: 30,
    speed: 2,
    size: { min: 3, max: 8 },
    opacity: { min: 0.2, max: 0.5 },
  },
};

/**
 * Glow animation configurations
 */
export const glowConfigs = {
  pulse: {
    from: { opacity: 0.3 },
    to: { opacity: 0.8 },
    duration: 1500,
    loop: true,
    easing: easings.easeInOut,
  },
  breathe: {
    from: { scale: 1, opacity: 0.4 },
    to: { scale: 1.1, opacity: 0.8 },
    duration: 2000,
    loop: true,
    easing: easings.easeInOut,
  },
};

/**
 * Success animation configurations
 */
export const successConfigs = {
  checkmark: {
    duration: 600,
    spring: springConfigs.bouncy,
  },
  confetti: {
    count: 50,
    duration: 3000,
    spread: 360,
    gravity: 0.5,
  },
};

/**
 * Loading animation configurations
 */
export const loadingConfigs = {
  spinner: {
    duration: 1000,
    easing: Easing.linear,
    loop: true,
  },
  shimmer: {
    duration: 1500,
    easing: Easing.linear,
    loop: true,
  },
  pulse: {
    duration: 1200,
    easing: easings.easeInOut,
    loop: true,
  },
};
