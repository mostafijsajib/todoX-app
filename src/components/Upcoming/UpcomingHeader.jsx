import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import { upcomingStyles } from './UpcomingStyles';

/**
 * UpcomingHeader Component
 * Header for the Upcoming screen with actions
 */
const UpcomingHeader = ({
  totalTasks = 0,
  completedTasks = 0,
  onMenuPress,
  onTodayPress,
  headerOpacity,
}) => {
  const pendingTasks = totalTasks - completedTasks;

  return (
    <Animated.View style={[upcomingStyles.headerContainer, { opacity: headerOpacity }]}>
      <View style={upcomingStyles.headerContent}>
        <View>
          <Text style={upcomingStyles.headerTitle}>Upcoming Tasks</Text>
          <Text style={upcomingStyles.headerSubtitle}>
            {pendingTasks} pending • {completedTasks} done
          </Text>
        </View>
        <View style={upcomingStyles.headerActions}>
          <TouchableOpacity
            style={upcomingStyles.headerButton}
            onPress={onTodayPress}
          >
            <Ionicons name="today-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={upcomingStyles.headerButton}
            onPress={onMenuPress}
          >
            <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default UpcomingHeader;
