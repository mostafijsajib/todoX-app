import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Vibration,
  Animated,
  Dimensions,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { 
  palette, 
  gradients, 
  radius, 
  space, 
  font, 
  shadowPresets 
} from '@/constants/Theme';

const { width } = Dimensions.get('window');

// Timer modes
const MODES = {
  FOCUS: { name: 'Focus', duration: 25, color: palette.primary[500], gradient: gradients.primary },
  SHORT_BREAK: { name: 'Short Break', duration: 5, color: palette.success[500], gradient: gradients.success },
  LONG_BREAK: { name: 'Long Break', duration: 15, color: palette.secondary[500], gradient: gradients.secondary },
};

/**
 * 🍅 Focus Timer / Pomodoro Component
 * Helps students manage study sessions with timed intervals
 */
const FocusTimer = ({ visible, onClose, task }) => {
  const [mode, setMode] = useState('FOCUS');
  const [timeRemaining, setTimeRemaining] = useState(MODES.FOCUS.duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);

  const timerRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const currentMode = MODES[mode];
  const totalTime = currentMode.duration * 60;
  const progress = 1 - (timeRemaining / totalTime);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Pulse animation for running timer
  useEffect(() => {
    if (isRunning) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRunning]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeRemaining]);

  // Track focus time
  useEffect(() => {
    if (isRunning && mode === 'FOCUS') {
      const interval = setInterval(() => {
        setTotalFocusTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning, mode]);

  // Handle timer completion
  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Vibration.vibrate([0, 200, 100, 200, 100, 200]);

    if (mode === 'FOCUS') {
      setSessions(prev => prev + 1);
      // After 4 focus sessions, suggest a long break
      if ((sessions + 1) % 4 === 0) {
        setMode('LONG_BREAK');
        setTimeRemaining(MODES.LONG_BREAK.duration * 60);
      } else {
        setMode('SHORT_BREAK');
        setTimeRemaining(MODES.SHORT_BREAK.duration * 60);
      }
    } else {
      setMode('FOCUS');
      setTimeRemaining(MODES.FOCUS.duration * 60);
    }
  }, [mode, sessions]);

  // Toggle timer
  const toggleTimer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRunning(!isRunning);
  };

  // Reset timer
  const resetTimer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsRunning(false);
    setTimeRemaining(MODES[mode].duration * 60);
  };

  // Switch mode
  const switchMode = (newMode) => {
    if (isRunning) return;
    Haptics.selectionAsync();
    setMode(newMode);
    setTimeRemaining(MODES[newMode].duration * 60);
  };

  // Skip to next
  const skipToNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleTimerComplete();
  };

  // Circle progress
  const circleSize = width * 0.65;
  const strokeWidth = 8;
  const radius_val = (circleSize - strokeWidth) / 2;
  const circumference = radius_val * 2 * Math.PI;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={palette.neutral[600]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Focus Timer</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Mode Selector */}
        <View style={styles.modeSelector}>
          {Object.entries(MODES).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.modeButton,
                mode === key && { backgroundColor: value.color + '15' },
              ]}
              onPress={() => switchMode(key)}
              disabled={isRunning}
            >
              <Text style={[
                styles.modeButtonText,
                mode === key && { color: value.color, fontWeight: font.weight.semibold },
              ]}>
                {value.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Task Info */}
        {task && (
          <View style={styles.taskInfo}>
            <Ionicons name="book-outline" size={16} color={palette.neutral[500]} />
            <Text style={styles.taskInfoText} numberOfLines={1}>{task.title}</Text>
          </View>
        )}

        {/* Timer Display */}
        <View style={styles.timerContainer}>
          <Animated.View style={[styles.timerCircle, { transform: [{ scale: pulseAnim }] }]}>
            {/* Background Circle */}
            <View style={[styles.circleBackground, { width: circleSize, height: circleSize }]}>
              {/* SVG would be better but we'll use a simple approach */}
              <View style={[
                styles.progressRing,
                { 
                  width: circleSize, 
                  height: circleSize, 
                  borderRadius: circleSize / 2,
                  borderColor: currentMode.color + '20',
                }
              ]} />
              
              {/* Progress overlay */}
              <View style={[
                styles.progressFill,
                {
                  width: circleSize,
                  height: circleSize,
                  borderRadius: circleSize / 2,
                  borderTopColor: currentMode.color,
                  borderRightColor: progress > 0.25 ? currentMode.color : 'transparent',
                  borderBottomColor: progress > 0.5 ? currentMode.color : 'transparent',
                  borderLeftColor: progress > 0.75 ? currentMode.color : 'transparent',
                  transform: [{ rotate: '-90deg' }],
                }
              ]} />

              {/* Inner content */}
              <View style={styles.timerContent}>
                <Text style={[styles.timerText, { color: currentMode.color }]}>
                  {formatTime(timeRemaining)}
                </Text>
                <Text style={styles.timerLabel}>{currentMode.name}</Text>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.secondaryButton} onPress={resetTimer}>
            <Ionicons name="refresh" size={24} color={palette.neutral[600]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.mainButton} onPress={toggleTimer}>
            <LinearGradient
              colors={currentMode.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.mainButtonGradient}
            >
              <Ionicons 
                name={isRunning ? 'pause' : 'play'} 
                size={32} 
                color="#FFF" 
              />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={skipToNext}>
            <Ionicons name="play-skip-forward" size={24} color={palette.neutral[600]} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: palette.primary[50] }]}>
              <Ionicons name="checkmark-circle" size={20} color={palette.primary[500]} />
            </View>
            <View>
              <Text style={styles.statValue}>{sessions}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: palette.success[50] }]}>
              <Ionicons name="timer" size={20} color={palette.success[500]} />
            </View>
            <View>
              <Text style={styles.statValue}>{Math.floor(totalFocusTime / 60)}m</Text>
              <Text style={styles.statLabel}>Focus Time</Text>
            </View>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <View style={styles.tipIcon}>
            <Ionicons name="bulb-outline" size={18} color={palette.warning[500]} />
          </View>
          <Text style={styles.tipText}>
            Take regular breaks to maintain focus and prevent burnout. 
            After 4 focus sessions, take a longer break!
          </Text>
        </View>
      </View>
    </Modal>
  );
};

/**
 * Floating Focus Timer Button
 */
export const FocusTimerButton = ({ onPress, isActive }) => {
  return (
    <TouchableOpacity
      style={[styles.floatingButton, isActive && styles.floatingButtonActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={isActive ? gradients.success : gradients.primary}
        style={styles.floatingButtonGradient}
      >
        <Ionicons name="timer" size={24} color="#FFF" />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.neutral[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    borderBottomWidth: 1,
    borderBottomColor: palette.neutral[100],
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: palette.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: font.size.lg,
    fontWeight: font.weight.semibold,
    color: palette.neutral[900],
  },

  // Mode Selector
  modeSelector: {
    flexDirection: 'row',
    paddingHorizontal: space[4],
    paddingVertical: space[4],
    gap: space[2],
  },
  modeButton: {
    flex: 1,
    paddingVertical: space[2.5],
    paddingHorizontal: space[3],
    borderRadius: radius.lg,
    backgroundColor: palette.neutral[100],
    alignItems: 'center',
  },
  modeButtonText: {
    fontSize: font.size.sm,
    fontWeight: font.weight.medium,
    color: palette.neutral[500],
  },

  // Task Info
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingHorizontal: space[5],
    paddingVertical: space[2],
    backgroundColor: palette.neutral[100],
    marginHorizontal: space[4],
    borderRadius: radius.lg,
  },
  taskInfoText: {
    flex: 1,
    fontSize: font.size.sm,
    color: palette.neutral[700],
    fontWeight: font.weight.medium,
  },

  // Timer
  timerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space[8],
  },
  timerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressRing: {
    position: 'absolute',
    borderWidth: 8,
  },
  progressFill: {
    position: 'absolute',
    borderWidth: 8,
  },
  timerContent: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 64,
    fontWeight: font.weight.bold,
    letterSpacing: -2,
  },
  timerLabel: {
    fontSize: font.size.lg,
    color: palette.neutral[500],
    fontWeight: font.weight.medium,
    marginTop: space[1],
  },

  // Controls
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[6],
    paddingVertical: space[6],
  },
  secondaryButton: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: palette.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    overflow: 'hidden',
    ...shadowPresets.lg,
  },
  mainButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space[8],
    paddingVertical: space[4],
    gap: space[8],
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: font.size.xl,
    fontWeight: font.weight.bold,
    color: palette.neutral[900],
  },
  statLabel: {
    fontSize: font.size.xs,
    color: palette.neutral[500],
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: palette.neutral[200],
  },

  // Tips
  tipsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[3],
    paddingHorizontal: space[5],
    paddingVertical: space[4],
    marginHorizontal: space[4],
    marginBottom: space[6],
    backgroundColor: palette.warning[50],
    borderRadius: radius.xl,
  },
  tipIcon: {
    marginTop: space[0.5],
  },
  tipText: {
    flex: 1,
    fontSize: font.size.sm,
    color: palette.neutral[700],
    lineHeight: 20,
  },

  // Floating Button
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    left: space[5],
    borderRadius: radius.full,
    overflow: 'hidden',
    ...shadowPresets.lg,
  },
  floatingButtonActive: {
    // Animation would be added here
  },
  floatingButtonGradient: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FocusTimer;
