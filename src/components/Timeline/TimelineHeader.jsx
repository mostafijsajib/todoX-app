import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import { timelineStyles } from './TimelineStyles';
import { getFormattedDate } from './TimelineConstants';

/**
 * TimelineHeader Component
 * Header for the Timeline screen with title and actions
 */
const TimelineHeader = ({
  currentDate,
  onMenuPress,
  onTodayPress,
  taskCount = 0,
  headerOpacity,
}) => {
  const formattedDate = getFormattedDate(currentDate);

  return (
    <Animated.View style={[timelineStyles.headerContainer, { opacity: headerOpacity }]}>
      <View style={timelineStyles.headerContent}>
        <View>
          <Text style={timelineStyles.headerTitle}>Study Timeline</Text>
          <Text style={timelineStyles.headerSubtitle}>
            {formattedDate} • {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
          </Text>
        </View>
        <View style={timelineStyles.headerActions}>
          <TouchableOpacity
            style={timelineStyles.headerButton}
            onPress={onTodayPress}
          >
            <Ionicons name="today-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={timelineStyles.headerButton}
            onPress={onMenuPress}
          >
            <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default TimelineHeader;
