import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/constants/Colors';

/**
 * TimelineCalendarHeader Component
 * Custom month header for the Timeline calendar
 */
const TimelineCalendarHeader = ({
  month,
  onPressLeft,
  onPressRight,
}) => {
  const monthDate = new Date(month.timestamp);
  const monthName = monthDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
      }}
    >
      <TouchableOpacity
        onPress={onPressLeft}
        style={{
          padding: spacing.sm,
        }}
      >
        <Ionicons name="chevron-back" size={20} color={colors.primary} />
      </TouchableOpacity>

      <Text
        style={{
          fontSize: typography.sizes.lg,
          fontWeight: typography.weights.semibold,
          color: colors.textPrimary,
        }}
      >
        {monthName}
      </Text>

      <TouchableOpacity
        onPress={onPressRight}
        style={{
          padding: spacing.sm,
        }}
      >
        <Ionicons name="chevron-forward" size={20} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

export default TimelineCalendarHeader;
