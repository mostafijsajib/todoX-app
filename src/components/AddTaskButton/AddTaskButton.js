import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { palette, gradients, shadowPresets, radius, space, font, categories, priorities } from '../../constants/Theme';
import { useSelector } from 'react-redux';
import useTasks from '../../hooks/useTasks';
import { generateId } from '../../utils/gnFunc';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';

/**
 * AddTaskButton Component
 * Modern floating action button with beautiful modal design
 */
const AddTaskButton = ({ style, onTaskAdded, defaultDate }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [priority, setPriority] = useState('medium');
  const [selectedDate, setSelectedDate] = useState(defaultDate || new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('study');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subjects = useSelector((state) => state.subject?.subjects || []);
  const { addTask } = useTasks();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Subtle pulse animation for FAB
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      tension: 400,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 400,
      friction: 10,
    }).start();
  };

  const openModal = () => {
    setIsModalVisible(true);
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(rotateAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      setIsModalVisible(false);
      resetForm();
    });
  };

  const resetForm = () => {
    setTitle('');
    setSummary('');
    setPriority('medium');
    setSelectedDate(defaultDate || new Date());
    setStartTime('');
    setEndTime('');
    setSelectedSubject(null);
    setSelectedCategory('study');
    setIsSubmitting(false);
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  const handleStartTimeChange = (event, time) => {
    setShowStartTimePicker(false);
    if (time) {
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      setStartTime(`${hours}:${minutes}`);
    }
  };

  const handleEndTimeChange = (event, time) => {
    setShowEndTimePicker(false);
    if (time) {
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      setEndTime(`${hours}:${minutes}`);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter a task title');
      return;
    }

    setIsSubmitting(true);

    try {
      const newTask = {
        id: generateId(),
        title: title.trim(),
        summary: summary.trim(),
        priority,
        date: selectedDate.toISOString().split('T')[0],
        startTime,
        endTime,
        subjectId: selectedSubject,
        category: selectedCategory,
        reminder: false,
        subTasks: [],
        is_completed: false,
        isCompleted: false,
        completed_timestamp: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const success = await addTask(newTask);

      if (success) {
        closeModal();
        onTaskAdded?.(newTask);
      } else {
        Alert.alert('Error', 'Failed to create task. Please try again.');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      Alert.alert('Error', 'Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '135deg'],
  });

  const priorityOptions = [
    { key: 'high', label: 'High', color: palette.error[500], icon: 'flame' },
    { key: 'medium', label: 'Medium', color: palette.warning[500], icon: 'sunny' },
    { key: 'low', label: 'Low', color: palette.success[500], icon: 'leaf' },
  ];

  const studyCategories = [
    { key: 'study', label: 'Study', icon: 'book', color: palette.primary[500] },
    { key: 'assignment', label: 'Assignment', icon: 'document-text', color: palette.secondary[500] },
    { key: 'revision', label: 'Revision', icon: 'refresh-circle', color: palette.accent[500] },
    { key: 'practice', label: 'Practice', icon: 'bulb', color: palette.warning[500] },
    { key: 'project', label: 'Project', icon: 'folder', color: '#8B5CF6' },
    { key: 'reading', label: 'Reading', icon: 'library', color: '#06B6D4' },
  ];

  const formatDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      {/* FAB Button */}
      <Animated.View
        style={[
          styles.container,
          style,
          { transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }] },
        ]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={openModal}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <View style={styles.buttonGlow} />
          <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <Ionicons name="add" size={30} color="#FFFFFF" />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal} style={styles.headerButton}>
              <Ionicons name="close" size={24} color={palette.gray[600]} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.modalTitle}>New Task</Text>
              <Text style={styles.modalSubtitle}>Create a study task</Text>
            </View>
            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Ionicons name="hourglass" size={18} color="#FFF" />
              ) : (
                <Ionicons name="checkmark" size={20} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* Title Input */}
            <View style={styles.inputSection}>
              <View style={styles.inputHeader}>
                <Ionicons name="create-outline" size={18} color={palette.primary[500]} />
                <Text style={styles.inputLabel}>Task Title</Text>
              </View>
              <TextInput
                style={styles.titleInput}
                placeholder="What do you need to study?"
                placeholderTextColor={palette.gray[400]}
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
            </View>

            {/* Notes Input */}
            <View style={styles.inputSection}>
              <View style={styles.inputHeader}>
                <Ionicons name="document-text-outline" size={18} color={palette.gray[500]} />
                <Text style={styles.inputLabel}>Notes (optional)</Text>
              </View>
              <TextInput
                style={styles.notesInput}
                placeholder="Add any details or notes..."
                placeholderTextColor={palette.gray[400]}
                value={summary}
                onChangeText={setSummary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Subject Selection */}
            {subjects.length > 0 && (
              <View style={styles.inputSection}>
                <View style={styles.inputHeader}>
                  <Ionicons name="bookmark-outline" size={18} color={palette.gray[500]} />
                  <Text style={styles.inputLabel}>Subject</Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.chipScroll}
                  contentContainerStyle={styles.chipContainer}
                >
                  {subjects.map((subject) => {
                    const isSelected = selectedSubject === subject.id;
                    return (
                      <TouchableOpacity
                        key={subject.id}
                        style={[
                          styles.subjectChip,
                          isSelected && {
                            backgroundColor: `${subject.color || palette.primary[500]}12`,
                            borderColor: subject.color || palette.primary[500],
                          },
                        ]}
                        onPress={() => setSelectedSubject(isSelected ? null : subject.id)}
                      >
                        <View
                          style={[
                            styles.subjectDot,
                            { backgroundColor: subject.color || palette.primary[500] },
                          ]}
                        />
                        <Text
                          style={[
                            styles.subjectChipText,
                            isSelected && { color: subject.color || palette.primary[500], fontWeight: '600' },
                          ]}
                        >
                          {subject.name}
                        </Text>
                        {isSelected && (
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color={subject.color || palette.primary[500]}
                            style={{ marginLeft: 4 }}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* Category Selection */}
            <View style={styles.inputSection}>
              <View style={styles.inputHeader}>
                <Ionicons name="grid-outline" size={18} color={palette.gray[500]} />
                <Text style={styles.inputLabel}>Task Type</Text>
              </View>
              <View style={styles.categoryGrid}>
                {studyCategories.map((cat) => {
                  const isSelected = selectedCategory === cat.key;
                  return (
                    <TouchableOpacity
                      key={cat.key}
                      style={[
                        styles.categoryCard,
                        isSelected && {
                          backgroundColor: `${cat.color}12`,
                          borderColor: cat.color,
                        },
                      ]}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setSelectedCategory(cat.key);
                      }}
                    >
                      <View style={[styles.categoryIconBg, { backgroundColor: `${cat.color}15` }]}>
                        <Ionicons
                          name={cat.icon}
                          size={18}
                          color={isSelected ? cat.color : palette.gray[500]}
                        />
                      </View>
                      <Text
                        style={[
                          styles.categoryLabel,
                          isSelected && { color: cat.color, fontWeight: '600' },
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Date & Time Section */}
            <View style={styles.inputSection}>
              <View style={styles.inputHeader}>
                <Ionicons name="calendar-outline" size={18} color={palette.gray[500]} />
                <Text style={styles.inputLabel}>Schedule</Text>
              </View>

              {/* Date Picker */}
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => {
                  Haptics.selectionAsync();
                  setShowDatePicker(true);
                }}
              >
                <View style={styles.dateTimeIconBg}>
                  <Ionicons name="calendar" size={20} color={palette.primary[500]} />
                </View>
                <View style={styles.dateTimeInfo}>
                  <Text style={styles.dateTimeLabel}>Due Date</Text>
                  <Text style={styles.dateTimeValue}>{formatDate(selectedDate)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={palette.gray[400]} />
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}

              {/* Time Row */}
              <View style={styles.timeRow}>
                <TouchableOpacity
                  style={[styles.timeButton, startTime && styles.timeButtonActive]}
                  onPress={() => setShowStartTimePicker(true)}
                >
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color={startTime ? palette.primary[500] : palette.gray[400]}
                  />
                  <Text style={[styles.timeText, startTime && styles.timeTextActive]}>
                    {startTime || 'Start time'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.timeDivider}>
                  <Ionicons name="arrow-forward" size={16} color={palette.gray[400]} />
                </View>

                <TouchableOpacity
                  style={[styles.timeButton, endTime && styles.timeButtonActive]}
                  onPress={() => setShowEndTimePicker(true)}
                >
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color={endTime ? palette.primary[500] : palette.gray[400]}
                  />
                  <Text style={[styles.timeText, endTime && styles.timeTextActive]}>
                    {endTime || 'End time'}
                  </Text>
                </TouchableOpacity>
              </View>

              {showStartTimePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="time"
                  display="spinner"
                  onChange={handleStartTimeChange}
                />
              )}
              {showEndTimePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="time"
                  display="spinner"
                  onChange={handleEndTimeChange}
                />
              )}
            </View>

            {/* Priority Selection */}
            <View style={styles.inputSection}>
              <View style={styles.inputHeader}>
                <Ionicons name="flag-outline" size={18} color={palette.gray[500]} />
                <Text style={styles.inputLabel}>Priority</Text>
              </View>
              <View style={styles.priorityRow}>
                {priorityOptions.map((p) => {
                  const isSelected = priority === p.key;
                  return (
                    <TouchableOpacity
                      key={p.key}
                      style={[
                        styles.priorityButton,
                        isSelected && {
                          backgroundColor: `${p.color}15`,
                          borderColor: p.color,
                        },
                      ]}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setPriority(p.key);
                      }}
                    >
                      <Ionicons
                        name={p.icon}
                        size={18}
                        color={isSelected ? p.color : palette.gray[400]}
                      />
                      <Text
                        style={[
                          styles.priorityLabel,
                          isSelected && { color: p.color, fontWeight: '600' },
                        ]}
                      >
                        {p.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    zIndex: 1000,
  },
  button: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: palette.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: palette.primary[500],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 15,
  },
  buttonGlow: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: palette.primary[500],
    opacity: 0.15,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: palette.gray[50],
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[4],
    paddingVertical: space[4],
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: palette.gray[200],
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.gray[200],
  },
  headerCenter: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: font.sizes.lg,
    fontWeight: font.weights.bold,
    color: palette.gray[900],
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: font.sizes.xs,
    color: palette.gray[500],
    marginTop: 2,
  },
  saveButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: palette.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: space[5],
  },
  inputSection: {
    marginTop: space[6],
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: space[3],
    gap: space[2],
  },
  inputLabel: {
    fontSize: font.sizes.sm,
    fontWeight: font.weights.semibold,
    color: palette.gray[600],
    letterSpacing: 0.2,
  },
  titleInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    paddingHorizontal: space[4],
    paddingVertical: space[4],
    fontSize: font.sizes.base,
    color: palette.gray[900],
    borderWidth: 1.5,
    borderColor: palette.gray[200],
    ...shadowPresets.sm,
  },
  notesInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    paddingHorizontal: space[4],
    paddingVertical: space[4],
    fontSize: font.sizes.sm,
    color: palette.gray[900],
    borderWidth: 1.5,
    borderColor: palette.gray[200],
    minHeight: 100,
    ...shadowPresets.sm,
  },
  chipScroll: {
    marginHorizontal: -20,
  },
  chipContainer: {
    paddingHorizontal: 20,
    gap: space[2],
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: space[2] + 2,
    paddingHorizontal: space[4],
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: palette.gray[200],
    backgroundColor: '#FFFFFF',
    marginRight: space[2],
    ...shadowPresets.sm,
  },
  subjectDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: space[2],
  },
  subjectChipText: {
    fontSize: font.sizes.sm,
    fontWeight: font.weights.medium,
    color: palette.gray[600],
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2] + 2,
  },
  categoryCard: {
    width: '31%',
    paddingVertical: space[3],
    paddingHorizontal: space[2],
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: palette.gray[200],
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    ...shadowPresets.sm,
  },
  categoryIconBg: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: space[2],
  },
  categoryLabel: {
    fontSize: font.sizes.xs,
    fontWeight: font.weights.medium,
    color: palette.gray[600],
    textAlign: 'center',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: space[3],
    borderWidth: 1.5,
    borderColor: palette.gray[200],
    ...shadowPresets.sm,
  },
  dateTimeIconBg: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: palette.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateTimeInfo: {
    flex: 1,
    marginLeft: space[3],
  },
  dateTimeLabel: {
    fontSize: font.sizes.xs,
    color: palette.gray[500],
    fontWeight: font.weights.medium,
  },
  dateTimeValue: {
    fontSize: font.sizes.base,
    fontWeight: font.weights.semibold,
    color: palette.gray[900],
    marginTop: 2,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: space[3],
    gap: space[2],
  },
  timeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space[3],
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: palette.gray[200],
    backgroundColor: '#FFFFFF',
    gap: space[2],
    ...shadowPresets.sm,
  },
  timeButtonActive: {
    borderColor: palette.primary[400],
    backgroundColor: palette.primary[50],
  },
  timeText: {
    fontSize: font.sizes.sm,
    fontWeight: font.weights.medium,
    color: palette.gray[500],
  },
  timeTextActive: {
    color: palette.primary[600],
  },
  timeDivider: {
    paddingHorizontal: space[1],
  },
  priorityRow: {
    flexDirection: 'row',
    gap: space[2] + 2,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space[3],
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: palette.gray[200],
    backgroundColor: '#FFFFFF',
    gap: space[1],
    ...shadowPresets.sm,
  },
  priorityLabel: {
    fontSize: font.sizes.sm,
    fontWeight: font.weights.medium,
    color: palette.gray[600],
  },
});

export default AddTaskButton;
