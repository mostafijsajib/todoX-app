import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import { timelineStyles } from './TimelineStyles';

/**
 * TimelineMenuDropdown Component
 * Dropdown menu for Timeline filtering and actions
 */
const TimelineMenuDropdown = ({
  visible,
  onClose,
  filterBy,
  onFilterChange,
  onRefresh,
}) => {
  const filterOptions = [
    { key: 'all', label: 'All Tasks', icon: 'list-outline' },
    { key: 'high', label: 'High Priority', icon: 'flag', color: colors.error },
    { key: 'medium', label: 'Medium Priority', icon: 'flag', color: colors.warning },
    { key: 'low', label: 'Low Priority', icon: 'flag', color: colors.success },
  ];

  const handleFilterSelect = (filter) => {
    onFilterChange(filter);
    onClose();
  };

  const handleRefresh = () => {
    onRefresh();
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={{ flex: 1 }} onPress={onClose}>
        <View style={timelineStyles.menuContainer}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                timelineStyles.menuItem,
                filterBy === option.key && timelineStyles.menuItemActive,
              ]}
              onPress={() => handleFilterSelect(option.key)}
            >
              <Ionicons
                name={option.icon}
                size={18}
                color={option.color || (filterBy === option.key ? colors.primary : colors.textSecondary)}
              />
              <Text
                style={[
                  timelineStyles.menuItemText,
                  filterBy === option.key && timelineStyles.menuItemActiveText,
                ]}
              >
                {option.label}
              </Text>
              {filterBy === option.key && (
                <Ionicons
                  name="checkmark"
                  size={18}
                  color={colors.primary}
                  style={{ marginLeft: 'auto' }}
                />
              )}
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
            style={timelineStyles.menuItem}
            onPress={handleRefresh}
          >
            <Ionicons name="refresh-outline" size={18} color={colors.textSecondary} />
            <Text style={timelineStyles.menuItemText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

export default TimelineMenuDropdown;
