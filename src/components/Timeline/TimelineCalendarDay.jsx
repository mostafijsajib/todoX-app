import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '@/constants/Colors';
import { timelineStyles } from './TimelineStyles';

/**
 * TimelineCalendarDay Component
 * Custom day rendering for the Timeline calendar
 */
const TimelineCalendarDay = ({ date, state, marking, onPress }) => {
  const isToday = state === 'today';
  const isSelected = marking?.selected;
  const isDisabled = state === 'disabled';
  const hasEvents = marking?.marked;

  const handlePress = () => {
    if (!isDisabled && onPress) {
      onPress(date);
    }
  };

  return (
    <View
      style={[
        timelineStyles.dayContainer,
        isToday && !isSelected && timelineStyles.dayContainerToday,
        isSelected && timelineStyles.dayContainerSelected,
      ]}
      onTouchEnd={handlePress}
    >
      <Text
        style={[
          timelineStyles.dayText,
          isToday && !isSelected && timelineStyles.dayTextToday,
          isSelected && timelineStyles.dayTextSelected,
          isDisabled && { color: colors.textTertiary },
        ]}
      >
        {date.day}
      </Text>
      {hasEvents && !isSelected && (
        <View
          style={{
            position: 'absolute',
            bottom: 2,
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: marking?.dotColor || colors.primary,
          }}
        />
      )}
    </View>
  );
};

export default TimelineCalendarDay;
