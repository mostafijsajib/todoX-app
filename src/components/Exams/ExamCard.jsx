import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/Colors';
import CountdownBadge from './CountdownBadge';

/**
 * 🎓 ExamCard Component
 * Beautiful exam cards with countdown and subject integration
 */
const ExamCard = ({ exam, subject, onPress, variant = 'normal', index = 0 }) => {
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const delay = index * 100;
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  /**
   * Check if exam is urgent (within 7 days)
   */
  const isUrgent = () => {
    const today = new Date();
    const examDate = new Date(exam.date);
    const diffDays = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  /**
   * Format date for display
   */
  const formatDate = () => {
    const date = new Date(exam.date);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  /**
   * Format topics preview
   */
  const getTopicsPreview = () => {
    if (!exam.topics || exam.topics.length === 0) return null;
    return exam.topics.slice(0, 3);
  };

  const isLarge = variant === 'large';
  const subjectColor = subject?.color || colors.primary;
  const urgent = isUrgent();
  const topics = getTopicsPreview();

  return (
    <Animated.View
      style={[
        styles.container,
        isLarge && styles.containerLarge,
        {
          transform: [
            { scale: scaleAnim },
            { translateY: slideAnim },
          ],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.touchable}>
        <LinearGradient
          colors={[subjectColor + '12', subjectColor + '05']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, urgent && styles.cardUrgent]}
        >
          {/* Left accent bar */}
          <View style={[styles.accentBar, { backgroundColor: subjectColor }]} />
          
          {/* Urgent indicator */}
          {urgent && (
            <View style={styles.urgentBadge}>
              <Ionicons name="flame" size={10} color={colors.white} />
              <Text style={styles.urgentText}>SOON</Text>
            </View>
          )}

          <View style={styles.content}>
            {/* Top row: Subject & Countdown */}
            <View style={styles.topRow}>
              <View style={styles.subjectSection}>
                {subject && (
                  <View style={[styles.subjectBadge, { backgroundColor: subjectColor + '20' }]}>
                    <Ionicons
                      name={subject.icon || 'book'}
                      size={isLarge ? 16 : 14}
                      color={subjectColor}
                    />
                    <Text style={[styles.subjectName, { color: subjectColor }]} numberOfLines={1}>
                      {subject.name}
                    </Text>
                  </View>
                )}
                
                {/* Exam title */}
                <Text style={[styles.title, isLarge && styles.titleLarge]} numberOfLines={2}>
                  {exam.title}
                </Text>
              </View>

              <CountdownBadge
                examDate={exam.date}
                size={isLarge ? 'large' : 'medium'}
              />
            </View>

            {/* Details row */}
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Ionicons name="calendar" size={14} color={colors.textTertiary} />
                <Text style={styles.detailText}>{formatDate()}</Text>
              </View>

              {exam.time && (
                <View style={styles.detailItem}>
                  <Ionicons name="time" size={14} color={colors.textTertiary} />
                  <Text style={styles.detailText}>{exam.time}</Text>
                </View>
              )}

              {exam.location && (
                <View style={styles.detailItem}>
                  <Ionicons name="location" size={14} color={colors.textTertiary} />
                  <Text style={styles.detailText} numberOfLines={1}>{exam.location}</Text>
                </View>
              )}
            </View>

            {/* Topics chips */}
            {topics && topics.length > 0 && (
              <View style={styles.topicsSection}>
                <View style={styles.topicsHeader}>
                  <Ionicons name="list" size={12} color={colors.textTertiary} />
                  <Text style={styles.topicsLabel}>Topics to study</Text>
                </View>
                <View style={styles.topicsContainer}>
                  {topics.map((topic, idx) => (
                    <View
                      key={idx}
                      style={[styles.topicChip, { backgroundColor: subjectColor + '15' }]}
                    >
                      <Text style={[styles.topicText, { color: subjectColor }]} numberOfLines={1}>
                        {topic}
                      </Text>
                    </View>
                  ))}
                  {exam.topics.length > 3 && (
                    <View style={styles.moreTopics}>
                      <Text style={styles.moreTopicsText}>
                        +{exam.topics.length - 3}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Quick actions for large variant */}
            {isLarge && (
              <View style={styles.actionsRow}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: subjectColor + '15' }]}>
                  <Ionicons name="book-outline" size={16} color={subjectColor} />
                  <Text style={[styles.actionText, { color: subjectColor }]}>Study</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="create-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  containerLarge: {
    marginBottom: spacing.md,
  },
  touchable: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  card: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.card,
  },
  cardUrgent: {
    borderColor: colors.error + '30',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  urgentBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.error,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    zIndex: 1,
  },
  urgentText: {
    fontSize: typography.xxs,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.5,
  },
  content: {
    padding: spacing.md,
    paddingLeft: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  subjectSection: {
    flex: 1,
    marginRight: spacing.md,
  },
  subjectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  subjectName: {
    fontSize: typography.sm,
    fontWeight: '600',
  },
  title: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: typography.lg * 1.3,
  },
  titleLarge: {
    fontSize: typography.xl,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  topicsSection: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  topicsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  topicsLabel: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  topicChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    maxWidth: '45%',
  },
  topicText: {
    fontSize: typography.xs,
    fontWeight: '500',
  },
  moreTopics: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
  },
  moreTopicsText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colors.textTertiary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
  },
  actionText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});

export default ExamCard;
