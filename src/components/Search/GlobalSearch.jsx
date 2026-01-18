import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/Colors';
import { selectAllTasks } from '@/store/Task/task';
import { selectAllSubjects } from '@/store/Subject/subject';
import { selectAllExams } from '@/store/Exam/exam';
import { debounce } from 'lodash';

/**
 * Global Search Component
 * Searches across tasks, subjects, and exams
 */
const GlobalSearch = ({ visible, onClose }) => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Get all data from Redux
  const tasks = useSelector(selectAllTasks);
  const subjects = useSelector(selectAllSubjects);
  const exams = useSelector(selectAllExams);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { tasks: [], subjects: [], exams: [] };

    const query = searchQuery.toLowerCase().trim();

    const filteredTasks = tasks.filter(
      (task) =>
        task.title?.toLowerCase().includes(query) ||
        task.summary?.toLowerCase().includes(query) ||
        task.category?.toLowerCase().includes(query)
    );

    const filteredSubjects = subjects.filter(
      (subject) => subject.name?.toLowerCase().includes(query)
    );

    const filteredExams = exams.filter(
      (exam) =>
        exam.title?.toLowerCase().includes(query) ||
        exam.location?.toLowerCase().includes(query) ||
        exam.topics?.some((topic) => topic.toLowerCase().includes(query))
    );

    return {
      tasks: filteredTasks,
      subjects: filteredSubjects,
      exams: filteredExams,
    };
  }, [searchQuery, tasks, subjects, exams]);

  // Combined results based on selected category
  const combinedResults = useMemo(() => {
    const results = [];

    if (selectedCategory === 'all' || selectedCategory === 'tasks') {
      searchResults.tasks.forEach((item) =>
        results.push({ ...item, type: 'task' })
      );
    }

    if (selectedCategory === 'all' || selectedCategory === 'subjects') {
      searchResults.subjects.forEach((item) =>
        results.push({ ...item, type: 'subject' })
      );
    }

    if (selectedCategory === 'all' || selectedCategory === 'exams') {
      searchResults.exams.forEach((item) =>
        results.push({ ...item, type: 'exam' })
      );
    }

    return results;
  }, [searchResults, selectedCategory]);

  const totalResults =
    searchResults.tasks.length +
    searchResults.subjects.length +
    searchResults.exams.length;

  const handleClearSearch = () => {
    setSearchQuery('');
    Keyboard.dismiss();
  };

  const handleItemPress = (item) => {
    Keyboard.dismiss();
    onClose();

    // Navigate based on item type
    switch (item.type) {
      case 'task':
        // Navigate to Today screen with task details
        navigation.navigate('Today');
        break;
      case 'subject':
        navigation.navigate('Subjects');
        break;
      case 'exam':
        navigation.navigate('Exams');
        break;
    }
  };

  const getItemIcon = (type) => {
    switch (type) {
      case 'task':
        return 'checkbox-outline';
      case 'subject':
        return 'library-outline';
      case 'exam':
        return 'ribbon-outline';
      default:
        return 'document-outline';
    }
  };

  const getItemColor = (item) => {
    if (item.type === 'subject') {
      return item.color || colors.primary;
    }
    if (item.type === 'task') {
      const priority = item.priority;
      if (priority === 'high') return colors.error;
      if (priority === 'medium') return colors.warning;
      return colors.success;
    }
    return colors.info;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const categories = [
    { id: 'all', label: 'All', count: totalResults },
    { id: 'tasks', label: 'Tasks', count: searchResults.tasks.length },
    { id: 'subjects', label: 'Subjects', count: searchResults.subjects.length },
    { id: 'exams', label: 'Exams', count: searchResults.exams.length },
  ];

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.resultIcon, { backgroundColor: getItemColor(item) + '20' }]}>
        <Ionicons
          name={getItemIcon(item.type)}
          size={20}
          color={getItemColor(item)}
        />
      </View>
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle} numberOfLines={1}>
          {item.title || item.name}
        </Text>
        <View style={styles.resultMeta}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
          {item.date && (
            <Text style={styles.dateText}>{formatDate(item.date)}</Text>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </TouchableOpacity>
  );

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search tasks, subjects, exams..."
            placeholderTextColor={colors.textPlaceholder}
            autoFocus
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filters */}
      {searchQuery.length > 0 && (
        <View style={styles.categoryContainer}>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryPill,
                  selectedCategory === item.id && styles.categoryPillActive,
                ]}
                onPress={() => setSelectedCategory(item.id)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === item.id && styles.categoryTextActive,
                  ]}
                >
                  {item.label}
                </Text>
                <View
                  style={[
                    styles.countBadge,
                    selectedCategory === item.id && styles.countBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      selectedCategory === item.id && styles.countTextActive,
                    ]}
                  >
                    {item.count}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Results */}
      {searchQuery.length > 0 ? (
        combinedResults.length > 0 ? (
          <FlatList
            data={combinedResults}
            keyExtractor={(item) => `${item.type}-${item.id}`}
            renderItem={renderSearchResult}
            contentContainerStyle={styles.resultsList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptyText}>
              Try searching with different keywords
            </Text>
          </View>
        )
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={48} color={colors.textTertiary} />
          <Text style={styles.emptyTitle}>Search your study data</Text>
          <Text style={styles.emptyText}>
            Find tasks, subjects, and exams quickly
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingTop: 50, // Account for status bar
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    paddingVertical: spacing.xs,
  },
  cancelButton: {
    marginLeft: spacing.md,
    paddingVertical: spacing.sm,
  },
  cancelText: {
    fontSize: typography.sizes.md,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  categoryContainer: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryList: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  categoryTextActive: {
    color: colors.white,
  },
  countBadge: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  countText: {
    fontSize: typography.sizes.xs,
    color: colors.textTertiary,
    fontWeight: typography.weights.medium,
  },
  countTextActive: {
    color: colors.white,
  },
  resultsList: {
    padding: spacing.md,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xxs,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  typeBadge: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  typeText: {
    fontSize: typography.sizes.xs,
    color: colors.textTertiary,
    textTransform: 'capitalize',
  },
  dateText: {
    fontSize: typography.sizes.xs,
    color: colors.textTertiary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default GlobalSearch;
