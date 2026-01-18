import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  SlideOutLeft,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  palette,
  radius,
  space,
  font,
  shadowPresets,
  priorities,
  categories,
} from '@/constants/Theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * 📝 Modern Task Card Component
 * Beautiful, animated task card with priority indicators and subject badges
 */
const ModernTaskCard = memo(({
  task,
  subject,
  onPress,
  onToggleComplete,
  isSelectionMode = false,
  isSelected = false,
  onSelect,
  index = 0,
}) => {
  if (!task) return null;

  const isCompleted = task.is_completed || task.isCompleted;
  const scale = useSharedValue(1);

  // Priority configuration
  const priorityConfig = priorities[task.priority] || null;

  // Category configuration  
  const categoryConfig = categories[task.category] || categories.study;

  // Subject color
  const subjectColor = subject?.color || palette.primary[500];

  // Format time to 12h format
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Calculate duration
  const getDuration = () => {
    if (!task.startTime || !task.endTime) return null;
    const [startH, startM] = task.startTime.split(':').map(Number);
    const [endH, endM] = task.endTime.split(':').map(Number);
    const minutes = (endH * 60 + endM) - (startH * 60 + startM);
    
    if (minutes <= 0) return null;
    if (minutes < 60) return `${minutes}m`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
  };

  // Check if overdue
  const isOverdue = () => {
    if (!task.date || isCompleted) return false;
    const taskDate = new Date(task.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return taskDate < today;
  };

  const overdue = isOverdue();
  const duration = getDuration();

  // Handlers
  const handlePress = useCallback(() => {
    Haptics.selectionAsync();
    if (isSelectionMode) {
      onSelect?.(task);
    } else {
      onPress?.(task);
    }
  }, [isSelectionMode, onSelect, onPress, task]);

  const handleCheckPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggleComplete?.(task);
  }, [onToggleComplete, task]);

  const handleLongPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onSelect?.(task);
  }, [onSelect, task]);

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <AnimatedPressable
      entering={FadeIn.delay(index * 50).duration(300)}
      exiting={SlideOutLeft.duration(300)}
      layout={Layout.springify()}
      style={animatedStyle}
      onPress={handlePress}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={[
        styles.container,
        isSelected && styles.containerSelected,
        overdue && styles.containerOverdue,
        isCompleted && styles.containerCompleted,
      ]}>
        {/* Left Accent Bar */}
        <View style={[
          styles.accentBar,
          { backgroundColor: isCompleted ? palette.success[400] : subjectColor }
        ]} />

        <View style={styles.content}>
          {/* Checkbox */}
          {isSelectionMode ? (
            <TouchableOpacity
              style={[
                styles.selectionBox,
                isSelected && styles.selectionBoxActive,
              ]}
              onPress={() => onSelect?.(task)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {isSelected && (
                <Ionicons name="checkmark" size={14} color="#FFF" />
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.checkbox,
                { borderColor: isCompleted ? palette.success[400] : subjectColor },
                isCompleted && styles.checkboxCompleted,
              ]}
              onPress={handleCheckPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {isCompleted && (
                <Animated.View entering={FadeIn.duration(200)}>
                  <Ionicons name="checkmark" size={14} color="#FFF" />
                </Animated.View>
              )}
            </TouchableOpacity>
          )}

          {/* Task Info */}
          <View style={styles.taskInfo}>
            {/* Title */}
            <Text
              style={[
                styles.title,
                isCompleted && styles.titleCompleted,
              ]}
              numberOfLines={2}
            >
              {task.title}
            </Text>

            {/* Meta Row */}
            <View style={styles.metaRow}>
              {/* Time */}
              {task.startTime && (
                <View style={styles.metaItem}>
                  <Ionicons 
                    name="time-outline" 
                    size={12} 
                    color={overdue ? palette.error[400] : palette.neutral[400]} 
                  />
                  <Text style={[
                    styles.metaText,
                    overdue && styles.metaTextOverdue
                  ]}>
                    {formatTime(task.startTime)}
                  </Text>
                </View>
              )}

              {/* Duration */}
              {duration && (
                <View style={styles.durationBadge}>
                  <Ionicons name="hourglass-outline" size={10} color={palette.neutral[500]} />
                  <Text style={styles.durationText}>{duration}</Text>
                </View>
              )}

              {/* Subject Badge */}
              {subject && (
                <View style={[styles.subjectBadge, { backgroundColor: subjectColor + '15' }]}>
                  <View style={[styles.subjectDot, { backgroundColor: subjectColor }]} />
                  <Text style={[styles.subjectText, { color: subjectColor }]} numberOfLines={1}>
                    {subject.name}
                  </Text>
                </View>
              )}

              {/* Category Icon */}
              {!subject && categoryConfig && (
                <View style={[styles.categoryBadge, { backgroundColor: categoryConfig.color + '15' }]}>
                  <Ionicons name={categoryConfig.icon} size={12} color={categoryConfig.color} />
                </View>
              )}
            </View>
          </View>

          {/* Right Side - Priority */}
          <View style={styles.rightSection}>
            {priorityConfig && !isCompleted && (
              <View style={[styles.priorityBadge, { backgroundColor: priorityConfig.bgColor }]}>
                <Ionicons name={priorityConfig.icon} size={14} color={priorityConfig.color} />
              </View>
            )}
            
            {/* Overdue indicator */}
            {overdue && !isCompleted && (
              <View style={styles.overdueIndicator}>
                <Ionicons name="alert-circle" size={16} color={palette.error[500]} />
              </View>
            )}

            {/* Completed indicator */}
            {isCompleted && (
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark-circle" size={18} color={palette.success[500]} />
              </View>
            )}
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.neutral[0],
    borderRadius: radius.xl,
    marginBottom: space[2],
    overflow: 'hidden',
    ...shadowPresets.xs,
  },
  containerSelected: {
    borderWidth: 2,
    borderColor: palette.primary[400],
  },
  containerOverdue: {
    borderWidth: 1,
    borderColor: palette.error[200],
    backgroundColor: palette.error[50] + '50',
  },
  containerCompleted: {
    opacity: 0.7,
  },

  // Accent Bar
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: radius.xl,
    borderBottomLeftRadius: radius.xl,
  },

  // Content
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: space[3],
    paddingHorizontal: space[4],
    paddingLeft: space[5],
  },

  // Checkbox
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: space[3],
  },
  checkboxCompleted: {
    backgroundColor: palette.success[400],
    borderColor: palette.success[400],
  },

  // Selection Box
  selectionBox: {
    width: 24,
    height: 24,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: palette.neutral[300],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: space[3],
  },
  selectionBoxActive: {
    backgroundColor: palette.primary[500],
    borderColor: palette.primary[500],
  },

  // Task Info
  taskInfo: {
    flex: 1,
    marginRight: space[2],
  },
  title: {
    fontSize: font.size.base,
    fontWeight: font.weight.medium,
    color: palette.neutral[900],
    lineHeight: 20,
    marginBottom: space[1],
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: palette.neutral[500],
  },

  // Meta Row
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: space[2],
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
  },
  metaText: {
    fontSize: font.size.xs,
    color: palette.neutral[500],
  },
  metaTextOverdue: {
    color: palette.error[500],
  },

  // Duration Badge
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[0.5],
    paddingHorizontal: space[1.5],
    paddingVertical: space[0.5],
    backgroundColor: palette.neutral[100],
    borderRadius: radius.sm,
  },
  durationText: {
    fontSize: font.size['2xs'],
    color: palette.neutral[600],
    fontWeight: font.weight.medium,
  },

  // Subject Badge
  subjectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
    paddingHorizontal: space[2],
    paddingVertical: space[0.5],
    borderRadius: radius.full,
    maxWidth: 120,
  },
  subjectDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  subjectText: {
    fontSize: font.size.xs,
    fontWeight: font.weight.medium,
  },

  // Category Badge
  categoryBadge: {
    width: 24,
    height: 24,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Right Section
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[1],
  },

  // Priority Badge
  priorityBadge: {
    width: 28,
    height: 28,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Overdue Indicator
  overdueIndicator: {
    marginTop: space[1],
  },

  // Completed Badge
  completedBadge: {
    // Optional styling
  },
});

ModernTaskCard.displayName = 'ModernTaskCard';

export default ModernTaskCard;
