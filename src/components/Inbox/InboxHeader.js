import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/constants/Colors';

/**
 * InboxHeader Component
 * Modern header with glassmorphism effects and smooth animations
 */
const InboxHeader = ({
  title = 'Tasks',
  subtitle,
  taskCount = 0,
  completedCount = 0,
  onMenuPress,
  onSelectionModeToggle,
  isSelectionMode = false,
  selectedCount = 0,
  onSelectAll,
  onCancelSelection,
  onExitSelectionMode,
  onBulkComplete,
  headerOpacity = { current: 1 },
}) => {
  const pendingCount = taskCount - completedCount;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isSelectionMode) {
      Animated.spring(slideAnim, {
        toValue: 1,
        tension: 100,
        friction: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isSelectionMode]);

  const handleButtonPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Calculate progress
  const progressPercentage = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

  if (isSelectionMode) {
    return (
      <View style={styles.container}>
        <View style={styles.selectionHeader}>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={onExitSelectionMode || onCancelSelection}
          >
            <Ionicons name="close" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          
          <View style={styles.selectionInfo}>
            <Text style={styles.selectionCount}>
              {selectedCount} selected
            </Text>
          </View>

          <View style={styles.selectionActions}>
            {selectedCount > 0 && (
              <TouchableOpacity 
                style={[styles.actionButton, styles.completeButton]}
                onPress={onBulkComplete}
              >
                <Ionicons name="checkmark-done" size={18} color="#FFF" />
                <Text style={styles.completeButtonText}>Done</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={onSelectAll}
            >
              <Ionicons name="checkbox-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? (
            <Text style={styles.subtitle}>{subtitle}</Text>
          ) : taskCount > 0 ? (
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={[styles.statDot, { backgroundColor: colors.warning }]} />
                <Text style={styles.statText}>{pendingCount} pending</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <View style={[styles.statDot, { backgroundColor: colors.success }]} />
                <Text style={styles.statText}>{completedCount} done</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.subtitle}>No tasks yet</Text>
          )}
        </View>

        {/* Actions */}
        <View style={styles.headerActions}>
          {taskCount > 0 && (
            <>
              {/* Progress Ring */}
              <View style={styles.progressContainer}>
                <View style={styles.progressRing}>
                  <View style={[styles.progressFill, { 
                    backgroundColor: progressPercentage === 100 ? colors.success : colors.primary 
                  }]} />
                  <Text style={styles.progressText}>{progressPercentage}%</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={onSelectionModeToggle}
                onPressIn={handleButtonPressIn}
                onPressOut={handleButtonPressOut}
              >
                <Ionicons name="checkbox-outline" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </>
          )}
          
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={onMenuPress}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressContainer: {
    marginRight: 4,
  },
  progressRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    opacity: 0.15,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectionInfo: {
    flex: 1,
    alignItems: 'center',
  },
  selectionCount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  selectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  completeButton: {
    backgroundColor: colors.success,
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default InboxHeader;
