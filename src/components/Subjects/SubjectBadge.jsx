/**
 * SubjectBadge Component
 * Small pill badge showing subject with icon and name
 * Used in task items and headers
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../constants/Colors';

const SubjectBadge = ({
  subject,
  size = 'medium', // 'small' | 'medium'
  showIcon = true,
  style,
}) => {
  if (!subject) {
    return null;
  }

  const sizeStyles = {
    small: {
      container: styles.containerSmall,
      icon: 12,
      text: styles.textSmall,
    },
    medium: {
      container: styles.containerMedium,
      icon: 14,
      text: styles.textMedium,
    },
  };

  const currentSize = sizeStyles[size] || sizeStyles.medium;

  return (
    <View
      style={[
        styles.container,
        currentSize.container,
        {
          backgroundColor: `${subject.color}20`,
          borderColor: `${subject.color}40`,
        },
        style,
      ]}
    >
      {showIcon && (
        <Ionicons
          name={subject.icon || 'book-outline'}
          size={currentSize.icon}
          color={subject.color}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.text,
          currentSize.text,
          { color: subject.color },
        ]}
        numberOfLines={1}
      >
        {subject.name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  containerSmall: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs / 2,
  },
  containerMedium: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  icon: {
    marginRight: spacing.xs / 2,
  },
  text: {
    fontWeight: '600',
  },
  textSmall: {
    fontSize: typography.xs,
  },
  textMedium: {
    fontSize: typography.sm,
  },
});

export default SubjectBadge;
