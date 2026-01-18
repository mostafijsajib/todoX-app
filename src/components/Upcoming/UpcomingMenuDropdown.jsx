import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import { upcomingStyles } from './UpcomingStyles';

/**
 * UpcomingMenuDropdown Component
 * Dropdown menu for filtering and sorting upcoming tasks
 */
const UpcomingMenuDropdown = ({
  visible,
  onClose,
  filterBy,
  sortBy,
  onFilterChange,
  onSortChange,
  showCompleted,
  onToggleCompleted,
}) => {
  const filterOptions = [
    { key: 'all', label: 'All Tasks', icon: 'list-outline' },
    { key: 'study', label: 'Study Tasks', icon: 'book-outline' },
    { key: 'assignment', label: 'Assignments', icon: 'document-text-outline' },
    { key: 'revision', label: 'Revision', icon: 'refresh-outline' },
    { key: 'exam', label: 'Exam Prep', icon: 'school-outline' },
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
      <Pressable style={{ flex: 1 }} onPress={onClose}>
        <View style={upcomingStyles.menuContainer}>
          <Text
            style={{
              fontSize: 12,
              color: colors.textTertiary,
              marginLeft: 12,
              marginBottom: 4,
              fontWeight: '600',
              textTransform: 'uppercase',
            }}
          >
            Filter
          </Text>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                upcomingStyles.menuItem,
                filterBy === option.key && upcomingStyles.menuItemActive,
              ]}
              onPress={() => {
                onFilterChange(option.key);
                onClose();
              }}
            >
              <Ionicons
                name={option.icon}
                size={18}
                color={filterBy === option.key ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  upcomingStyles.menuItemText,
                  filterBy === option.key && upcomingStyles.menuItemActiveText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}

          <View
            style={{
              height: 1,
              backgroundColor: colors.border,
              marginVertical: 8,
            }}
          />

          <Text
            style={{
              fontSize: 12,
              color: colors.textTertiary,
              marginLeft: 12,
              marginBottom: 4,
              fontWeight: '600',
              textTransform: 'uppercase',
            }}
          >
            Sort
          </Text>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                upcomingStyles.menuItem,
                sortBy === option.key && upcomingStyles.menuItemActive,
              ]}
              onPress={() => {
                onSortChange(option.key);
                onClose();
              }}
            >
              <Ionicons
                name={option.icon}
                size={18}
                color={sortBy === option.key ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  upcomingStyles.menuItemText,
                  sortBy === option.key && upcomingStyles.menuItemActiveText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}

          <View
            style={{
              height: 1,
              backgroundColor: colors.border,
              marginVertical: 8,
            }}
          />

          <TouchableOpacity
            style={[upcomingStyles.menuItem]}
            onPress={() => {
              onToggleCompleted();
              onClose();
            }}
          >
            <Ionicons
              name={showCompleted ? 'eye-outline' : 'eye-off-outline'}
              size={18}
              color={colors.textSecondary}
            />
            <Text style={upcomingStyles.menuItemText}>
              {showCompleted ? 'Hide Completed' : 'Show Completed'}
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

export default UpcomingMenuDropdown;
