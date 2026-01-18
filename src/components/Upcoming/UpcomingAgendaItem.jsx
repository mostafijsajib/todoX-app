import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/constants/Colors';
import { upcomingStyles } from './UpcomingStyles';
import { getPriorityColor, getCategoryIcon } from './UpcomingCalendarTheme';

/**
 * UpcomingAgendaItem Component
 * Renders a single task item in the upcoming agenda
 */
const UpcomingAgendaItem = memo(({
  task,
  subject,
  onPress,
  onToggleComplete,
}) => {
  if (!task) return null;

  const isCompleted = task.is_completed;
  const priorityColor = getPriorityColor(task.priority);
  const categoryIcon = getCategoryIcon(task.category);

  const formatTime = (startTime, endTime) => {
    if (!startTime) return null;
    
    const formatTimeStr = (time) => {
      if (!time) return '';
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };

    if (endTime) {
      return `${formatTimeStr(startTime)} - ${formatTimeStr(endTime)}`;
    }
    return formatTimeStr(startTime);
  };

  const timeDisplay = formatTime(task.startTime, task.endTime);

  return (
    <TouchableOpacity
      style={[
        upcomingStyles.agendaItemContainer,
        { borderLeftColor: subject?.color || colors.primary },
      ]}
      onPress={() => onPress(task)}
      activeOpacity={0.7}
    >
      <View style={upcomingStyles.agendaItemHeader}>
        <TouchableOpacity
          style={[
            upcomingStyles.checkboxContainer,
            isCompleted && upcomingStyles.checkboxCompleted,
          ]}
          onPress={() => onToggleComplete(task)}
        >
          {isCompleted && (
            <Ionicons name="checkmark" size={14} color={colors.textOnPrimary} />
          )}
        </TouchableOpacity>
        
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Text
            style={[
              upcomingStyles.agendaItemTitle,
              isCompleted && upcomingStyles.agendaItemTitleCompleted,
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>
          
          {timeDisplay && (
            <Text style={upcomingStyles.agendaItemTime}>
              <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
              {' '}{timeDisplay}
            </Text>
          )}
        </View>
      </View>

      {subject && (
        <View style={upcomingStyles.agendaItemSubject}>
          <View
            style={[
              upcomingStyles.agendaItemSubjectBadge,
              { backgroundColor: (subject.color || colors.primary) + '20' },
            ]}
          >
            <Ionicons
              name={subject.icon || 'bookmark'}
              size={12}
              color={subject.color || colors.primary}
            />
            <Text
              style={[
                upcomingStyles.agendaItemSubjectText,
                { color: subject.color || colors.primary, marginLeft: 4 },
              ]}
            >
              {subject.name}
            </Text>
          </View>
        </View>
      )}

      {task.summary && (
        <Text
          style={upcomingStyles.agendaItemSummary}
          numberOfLines={2}
        >
          {task.summary}
        </Text>
      )}

      <View style={upcomingStyles.agendaItemFooter}>
        {task.priority && (
          <View
            style={[
              upcomingStyles.priorityBadge,
              { backgroundColor: priorityColor + '15' },
            ]}
          >
            <Ionicons name="flag" size={10} color={priorityColor} />
            <Text style={[upcomingStyles.priorityText, { color: priorityColor }]}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Text>
          </View>
        )}

        {task.category && (
          <View style={upcomingStyles.categoryBadge}>
            <Ionicons name={categoryIcon} size={10} color={colors.textSecondary} />
            <Text style={upcomingStyles.categoryText}>
              {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
            </Text>
          </View>
        )}

        {task.subTasks && task.subTasks.length > 0 && (
          <View style={upcomingStyles.categoryBadge}>
            <Ionicons name="list-outline" size={10} color={colors.textSecondary} />
            <Text style={upcomingStyles.categoryText}>
              {task.subTasks.filter(st => st.completed).length}/{task.subTasks.length}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
});

UpcomingAgendaItem.displayName = 'UpcomingAgendaItem';

export default UpcomingAgendaItem;
