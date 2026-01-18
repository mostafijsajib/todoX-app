import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/constants/Colors';

/**
 * UpcomingCalendarHeader Component
 * Custom header for the expandable calendar
 */
const UpcomingCalendarHeader = ({
  month,
  onPressLeft,
  onPressRight,
  onPressToday,
}) => {
  const monthDate = new Date(month.timestamp);
  const monthName = monthDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const isCurrentMonth = () => {
    const today = new Date();
    return (
      monthDate.getMonth() === today.getMonth() &&
      monthDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.background,
      }}
    >
      <TouchableOpacity
        onPress={onPressLeft}
        style={{
          padding: spacing.sm,
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="chevron-back" size={20} color={colors.primary} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onPressToday}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
        disabled={isCurrentMonth()}
      >
        <Text
          style={{
            fontSize: typography.sizes.lg,
            fontWeight: typography.weights.semibold,
            color: colors.textPrimary,
          }}
        >
          {monthName}
        </Text>
        {!isCurrentMonth() && (
          <Ionicons
            name="return-down-back-outline"
            size={16}
            color={colors.primary}
            style={{ marginLeft: spacing.xs }}
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onPressRight}
        style={{
          padding: spacing.sm,
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="chevron-forward" size={20} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

export default UpcomingCalendarHeader;
