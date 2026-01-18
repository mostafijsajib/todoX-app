import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/Colors';

/**
 * MenuDropdown Component
 * Beautiful dropdown menu with smooth animations
 */
const MenuDropdown = ({
  visible,
  onClose,
  filterBy = 'all',
  sortBy = 'date',
  onFilterChange,
  onSortChange,
  showCompleted = true,
  onToggleCompleted,
  onRefresh,
  onEnterSelectionMode,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 300,
          friction: 15,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  const filterOptions = [
    { key: 'all', label: 'All Tasks', icon: 'layers-outline' },
    { key: 'high', label: 'High Priority', icon: 'flame', color: '#FF6B6B' },
    { key: 'medium', label: 'Medium Priority', icon: 'sunny', color: '#FFB347' },
    { key: 'low', label: 'Low Priority', icon: 'leaf', color: '#77DD77' },
  ];

  const sortOptions = [
    { key: 'date', label: 'By Date', icon: 'calendar-outline' },
    { key: 'priority', label: 'By Priority', icon: 'flag-outline' },
    { key: 'subject', label: 'By Subject', icon: 'bookmark-outline' },
  ];

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.menuContainer,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Options</Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => {
                onRefresh?.();
                onClose();
              }}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: `${colors.info}15` }]}>
                <Ionicons name="refresh" size={18} color={colors.info} />
              </View>
              <Text style={styles.quickActionText}>Refresh</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => {
                onEnterSelectionMode?.();
                onClose();
              }}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="checkbox-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.quickActionText}>Select</Text>
            </TouchableOpacity>

            {onToggleCompleted && (
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => {
                  onToggleCompleted();
                  onClose();
                }}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: `${colors.success}15` }]}>
                  <Ionicons
                    name={showCompleted ? 'eye-outline' : 'eye-off-outline'}
                    size={18}
                    color={colors.success}
                  />
                </View>
                <Text style={styles.quickActionText}>
                  {showCompleted ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.divider} />

          {/* Filter Section */}
          <Text style={styles.sectionLabel}>Filter by Priority</Text>
          <View style={styles.optionsGrid}>
            {filterOptions.map((option) => {
              const isActive = filterBy === option.key;
              return (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.optionChip,
                    isActive && { 
                      backgroundColor: `${option.color || colors.primary}15`,
                      borderColor: option.color || colors.primary,
                    },
                  ]}
                  onPress={() => {
                    onFilterChange?.(option.key);
                    onClose();
                  }}
                >
                  <Ionicons
                    name={option.icon}
                    size={16}
                    color={option.color || (isActive ? colors.primary : colors.textSecondary)}
                  />
                  <Text
                    style={[
                      styles.optionChipText,
                      isActive && { color: option.color || colors.primary, fontWeight: '600' },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.divider} />

          {/* Sort Section */}
          <Text style={styles.sectionLabel}>Sort by</Text>
          <View style={styles.sortOptions}>
            {sortOptions.map((option) => {
              const isActive = sortBy === option.key;
              return (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.sortOption,
                    isActive && styles.sortOptionActive,
                  ]}
                  onPress={() => {
                    onSortChange?.(option.key);
                    onClose();
                  }}
                >
                  <Ionicons
                    name={option.icon}
                    size={18}
                    color={isActive ? colors.primary : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.sortOptionText,
                      isActive && styles.sortOptionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {isActive && (
                    <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    right: spacing.md,
    top: 100,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.md,
    minWidth: 280,
    maxWidth: 320,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.large,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  quickAction: {
    alignItems: 'center',
    gap: 6,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
    marginHorizontal: -spacing.md,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    gap: 6,
  },
  optionChipText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sortOptions: {
    gap: 4,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 10,
  },
  sortOptionActive: {
    backgroundColor: `${colors.primary}10`,
  },
  sortOptionText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sortOptionTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default MenuDropdown;
