import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Vibration,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ReanimatedAnimated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';
import { palette, radius, space, font, shadowPresets, gradients } from '../../constants/Theme';
import { useExams, useToastOperations } from '@/hooks';
import { useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { validateExamForm } from '@/utils/validation';

/**
 * 🎨 Color Utilities
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const lightenColor = (hex, percent) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const amt = Math.round(2.55 * percent);
  const r = Math.min(255, rgb.r + amt);
  const g = Math.min(255, rgb.g + amt);
  const b = Math.min(255, rgb.b + amt);

  return rgbToHex(r, g, b);
};

const darkenColor = (hex, percent) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const amt = Math.round(2.55 * percent);
  const r = Math.max(0, rgb.r - amt);
  const g = Math.max(0, rgb.g - amt);
  const b = Math.max(0, rgb.b - amt);

  return rgbToHex(r, g, b);
};

const generateGradientFromColor = (hexColor) => {
  return [lightenColor(hexColor, 15), darkenColor(hexColor, 10)];
};

/**
 * 📍 Countdown Badge Component
 */
const CountdownBadge = ({ daysUntil, isUrgent }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isUrgent) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isUrgent]);

  const emoji = daysUntil < 0 ? '✅' : daysUntil === 0 ? '🔥' :
                daysUntil <= 3 ? '🚨' : '📅';

  const text = daysUntil < 0 ? 'Past' : daysUntil === 0 ? 'Today!' :
               daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`;

  return (
    <Animated.View
      style={[
        styles.countdownBadge,
        isUrgent && styles.countdownBadgeUrgent,
        { transform: [{ scale: pulseAnim }] }
      ]}
    >
      <Text style={styles.countdownEmoji}>{emoji}</Text>
      <Text style={styles.countdownText}>{text}</Text>
    </Animated.View>
  );
};

/**
 * 🏷️ Topic Chip Component
 */
const TopicChip = ({ topic, onRemove, index }) => (
  <ReanimatedAnimated.View
    entering={FadeIn.delay(index * 50).springify()}
    exiting={FadeOut.duration(200)}
    style={styles.topicChipWrapper}
  >
    <LinearGradient
      colors={['#EEF2FF', '#E0E7FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.topicChipGradient}
    >
      <Ionicons name="bookmark" size={14} color={palette.primary[500]} />
      <Text style={styles.topicChipText}>{topic}</Text>
      <TouchableOpacity
        onPress={onRemove}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.topicRemoveButton}
        accessibilityLabel={`Remove ${topic}`}
        accessibilityRole="button"
      >
        <Ionicons name="close-circle" size={18} color={palette.primary[400]} />
      </TouchableOpacity>
    </LinearGradient>
  </ReanimatedAnimated.View>
);

/**
 * 📝 Section Card Component
 */
const SectionCard = ({ title, icon, iconColor, children, style }) => (
  <View style={[styles.sectionCard, style]}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleRow}>
        <View style={[styles.sectionIconBg, { backgroundColor: iconColor + '20' }]}>
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
    </View>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
);

/**
 * 📋 Subject Preview Card Component
 */
const SubjectPreviewCard = ({ subject, onPress }) => (
  <TouchableOpacity
    style={[
      styles.subjectPreviewCard,
      { borderColor: subject.color + '40' }
    ]}
    onPress={onPress}
    activeOpacity={0.7}
    accessibilityLabel={`Selected subject: ${subject.name}. Tap to change`}
    accessibilityRole="button"
  >
    <LinearGradient
      colors={[subject.color + '15', subject.color + '08']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.subjectPreviewGradient}
    >
      <View style={[styles.subjectPreviewIcon, { backgroundColor: subject.color + '20' }]}>
        <Ionicons name={subject.icon} size={24} color={subject.color} />
      </View>
      <View style={styles.subjectPreviewInfo}>
        <Text style={styles.subjectPreviewLabel}>Selected Subject</Text>
        <Text style={styles.subjectPreviewName}>{subject.name}</Text>
        <View style={styles.subjectPreviewMeta}>
          <View style={[styles.subjectPreviewBadge, { backgroundColor: subject.color + '1A' }]}>
            <View style={[styles.subjectPreviewBadgeDot, { backgroundColor: subject.color }]} />
            <Text style={[styles.subjectPreviewBadgeText, { color: subject.color }]}>Active</Text>
          </View>
        </View>
      </View>
      <View style={styles.subjectPreviewChevron}>
        <Ionicons name="chevron-down" size={18} color={palette.gray[500]} />
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

/**
 * 🎓 Main Exam Form Modal Component
 * Premium redesigned with dynamic theming and enhanced UX
 */
const ExamFormModal = ({ visible, onClose, exam }) => {
  const { addExam, updateExam, deleteExam } = useExams();
  const { examOperations, toast } = useToastOperations();
  const subjects = useSelector((state) => state.subject?.subjects || []);

  const [formData, setFormData] = useState({
    title: '',
    subjectId: null,
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: 120,
    location: '',
    topics: [],
    notes: '',
  });

  const [topicInput, setTopicInput] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Animation refs
  const shakeAnims = {
    title: useRef(new Animated.Value(0)).current,
    subject: useRef(new Animated.Value(0)).current,
    date: useRef(new Animated.Value(0)).current,
    duration: useRef(new Animated.Value(0)).current,
  };

  useEffect(() => {
    if (exam) {
      setFormData({
        title: exam.title || '',
        subjectId: exam.subjectId || null,
        date: exam.date || new Date().toISOString().split('T')[0],
        time: exam.time || '09:00',
        duration: exam.duration || 120,
        location: exam.location || '',
        topics: exam.topics || [],
        notes: exam.notes || '',
      });
    } else {
      setFormData({
        title: '',
        subjectId: null,
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        duration: 120,
        location: '',
        topics: [],
        notes: '',
      });
    }
    setErrors({});
    setFocusedInput(null);
    setTopicInput('');
    setShowSubjectPicker(false);
    setIsSaving(false);
  }, [exam, visible]);

  /**
   * Shake animation for error fields
   */
  const shakeAnimation = (field) => {
    const anim = shakeAnims[field];
    if (!anim) return;

    Animated.sequence([
      Animated.timing(anim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(anim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  /**
   * Handle save with enhanced validation
   */
  const handleSave = async () => {
    const validation = validateExamForm(formData, subjects);
    setErrors(validation.errors);

    if (!validation.isValid) {
      const firstErrorField = Object.keys(validation.errors)[0];
      shakeAnimation(firstErrorField);

      // Use toast instead of alert
      if (toast) {
        toast.error('Please fix the errors before saving');
      }

      if (Platform.OS === 'ios') {
        Vibration.vibrate([0, 50, 50, 50]);
      }
      return;
    }

    setIsSaving(true);

    if (Platform.OS === 'ios') {
      Vibration.vibrate(10);
    }

    try {
      if (exam) {
        await examOperations.update(() => updateExam(exam.id, formData));
      } else {
        await examOperations.add(() => addExam({
          id: Date.now().toString(),
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));
      }
      onClose();
    } catch (error) {
      console.error('Error saving exam:', error);
      if (toast) {
        toast.error('Failed to save exam. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to save exam. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Handle delete with confirmation
   */
  const handleDelete = () => {
    Alert.alert(
      'Delete Exam',
      'Are you sure you want to delete this exam?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExam(exam.id);
              onClose();
            } catch (error) {
              console.error('Error deleting exam:', error);
              if (toast) {
                toast.error('Failed to delete exam. Please try again.');
              } else {
                Alert.alert('Error', 'Failed to delete exam. Please try again.');
              }
            }
          },
        },
      ]
    );
  };

  /**
   * Handle topic operations
   */
  const handleAddTopic = () => {
    if (topicInput.trim()) {
      setFormData(prev => ({
        ...prev,
        topics: [...prev.topics, topicInput.trim()],
      }));
      setTopicInput('');
    }
  };

  const handleRemoveTopic = (index) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index),
    }));
  };

  /**
   * Date formatting
   */
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  /**
   * Calculate days until exam
   */
  const getDaysUntil = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const examDate = new Date(formData.date);
    const diffTime = examDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  /**
   * Get selected subject and dynamic header gradient
   */
  const selectedSubject = subjects.find(s => s.id === formData.subjectId);

  const headerGradient = useMemo(() => {
    if (selectedSubject?.color) {
      return generateGradientFromColor(selectedSubject.color);
    }
    return exam ? gradients.primary : gradients.accent;
  }, [selectedSubject, exam]);

  const daysUntil = getDaysUntil();
  const isUrgent = daysUntil >= 0 && daysUntil <= 3;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
          accessibilityLabel="Close modal"
          accessibilityRole="button"
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.modalContainer}>
            {/* Dynamic Gradient Header */}
            <LinearGradient
              colors={headerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientHeader}
            >
              <View style={styles.headerContent}>
                <View style={styles.headerLeft}>
                  <View style={styles.headerIconCircle}>
                    <Ionicons
                      name={exam ? "pencil" : "ribbon"}
                      size={24}
                      color="#FFFFFF"
                    />
                  </View>
                  <View>
                    <Text style={styles.headerTitle}>
                      {exam ? 'Edit Exam' : 'New Exam'}
                    </Text>
                    <Text style={styles.headerSubtitle}>
                      {exam ? 'Update exam details' : 'Track your upcoming exam'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                  accessibilityLabel="Close"
                  accessibilityRole="button"
                >
                  <Ionicons name="close-circle" size={32} color="rgba(255,255,255,0.9)" />
                </TouchableOpacity>
              </View>

              {/* Enhanced Countdown Badge */}
              {formData.date && (
                <View style={styles.countdownContainer}>
                  <CountdownBadge daysUntil={daysUntil} isUrgent={isUrgent} />
                </View>
              )}
            </LinearGradient>

            {/* Form Content */}
            <ScrollView
              style={styles.form}
              contentContainerStyle={styles.formContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Subject Preview Card (if selected) */}
              {selectedSubject && (
                <ReanimatedAnimated.View entering={FadeIn.duration(300)}>
                  <SubjectPreviewCard
                    subject={selectedSubject}
                    onPress={() => setShowSubjectPicker(!showSubjectPicker)}
                  />
                </ReanimatedAnimated.View>
              )}

              {/* Basic Info Card */}
              <SectionCard
                title="Exam Details"
                icon="document-text"
                iconColor={palette.primary[500]}
              >
                {/* Title Input */}
                <Animated.View style={{ transform: [{ translateX: shakeAnims.title }] }}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                      Exam Title <Text style={styles.required}>*</Text>
                    </Text>
                    <View style={[
                      styles.inputContainer,
                      focusedInput === 'title' && styles.inputFocused,
                      errors.title && styles.inputError
                    ]}>
                      <Ionicons name="create-outline" size={20} color={palette.primary[500]} />
                      <TextInput
                        style={styles.textInput}
                        value={formData.title}
                        onChangeText={(text) => {
                          setFormData(prev => ({ ...prev, title: text }));
                          if (errors.title) setErrors(prev => ({ ...prev, title: null }));
                        }}
                        onFocus={() => setFocusedInput('title')}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="e.g., Midterm Examination"
                        placeholderTextColor={palette.gray[400]}
                        accessibilityLabel="Exam title"
                      />
                    </View>
                    {errors.title && (
                      <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={14} color={palette.error[500]} />
                        <Text style={styles.errorText}>{errors.title}</Text>
                      </View>
                    )}
                  </View>
                </Animated.View>

                {/* Subject Selector */}
                <Animated.View style={{ transform: [{ translateX: shakeAnims.subject }] }}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                      Subject <Text style={styles.required}>*</Text>
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.inputContainer,
                        showSubjectPicker && styles.inputFocused,
                        errors.subject && styles.inputError
                      ]}
                      onPress={() => setShowSubjectPicker(!showSubjectPicker)}
                      accessibilityLabel="Select subject"
                      accessibilityRole="button"
                    >
                      <Ionicons name="library" size={20} color={palette.secondary[500]} />
                      {selectedSubject ? (
                        <Text style={styles.selectedText}>{selectedSubject.name}</Text>
                      ) : (
                        <Text style={styles.placeholderText}>Select Subject</Text>
                      )}
                      <Ionicons
                        name={showSubjectPicker ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={palette.gray[500]}
                        style={styles.iconRight}
                      />
                    </TouchableOpacity>

                    {showSubjectPicker && (
                      <Animated.View entering={FadeIn.duration(200)} style={styles.picker}>
                        <ScrollView style={styles.pickerScroll} nestedScrollEnabled>
                          {subjects.length === 0 ? (
                            <View style={styles.emptySubjects}>
                              <Text style={styles.emptySubjectsText}>No subjects available</Text>
                              <Text style={styles.emptySubjectsHint}>Create a subject first</Text>
                            </View>
                          ) : (
                            subjects.map((subject, index) => (
                              <TouchableOpacity
                                key={subject.id}
                                style={[
                                  styles.pickerOption,
                                  index === subjects.length - 1 && styles.pickerOptionLast
                                ]}
                                onPress={() => {
                                  setFormData(prev => ({ ...prev, subjectId: subject.id }));
                                  setShowSubjectPicker(false);
                                  if (errors.subject) setErrors(prev => ({ ...prev, subject: null }));
                                }}
                                accessibilityLabel={subject.name}
                                accessibilityRole="button"
                              >
                                <View style={[styles.subjectColorDot, { backgroundColor: subject.color }]} />
                                <Ionicons name={subject.icon} size={20} color={subject.color} />
                                <Text style={styles.pickerOptionText}>{subject.name}</Text>
                                {formData.subjectId === subject.id && (
                                  <Ionicons name="checkmark-circle" size={20} color={palette.primary[500]} />
                                )}
                              </TouchableOpacity>
                            ))
                          )}
                        </ScrollView>
                      </Animated.View>
                    )}
                    {errors.subject && (
                      <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={14} color={palette.error[500]} />
                        <Text style={styles.errorText}>{errors.subject}</Text>
                      </View>
                    )}
                  </View>
                </Animated.View>
              </SectionCard>

              {/* Schedule Card */}
              <SectionCard
                title="Schedule"
                icon="time"
                iconColor={palette.secondary[500]}
              >
                <View style={styles.row}>
                  {/* Date Input */}
                  <Animated.View style={[styles.flex1, { transform: [{ translateX: shakeAnims.date }] }]}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>
                        Date <Text style={styles.required}>*</Text>
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.inputContainer,
                          errors.date && styles.inputError
                        ]}
                        onPress={() => setShowDatePicker(true)}
                        accessibilityLabel="Select date"
                        accessibilityRole="button"
                      >
                        <Ionicons name="calendar-outline" size={20} color={palette.primary[500]} />
                        <Text style={styles.dateText}>{formatDate(formData.date)}</Text>
                      </TouchableOpacity>
                      {errors.date && (
                        <View style={styles.errorContainer}>
                          <Ionicons name="alert-circle" size={14} color={palette.error[500]} />
                          <Text style={styles.errorText}>{errors.date}</Text>
                        </View>
                      )}
                    </View>
                  </Animated.View>

                  {/* Time Input */}
                  <View style={styles.flex1}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Time</Text>
                      <View style={styles.inputContainer}>
                        <Ionicons name="time-outline" size={20} color={palette.secondary[500]} />
                        <TextInput
                          style={styles.textInput}
                          value={formData.time}
                          onChangeText={(text) => setFormData(prev => ({ ...prev, time: text }))}
                          placeholder="09:00"
                          placeholderTextColor={palette.gray[400]}
                          accessibilityLabel="Exam time"
                        />
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.row}>
                  {/* Duration Input */}
                  <Animated.View style={[styles.flex1, { transform: [{ translateX: shakeAnims.duration }] }]}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Duration</Text>
                      <View style={[
                        styles.inputContainer,
                        errors.duration && styles.inputError
                      ]}>
                        <Ionicons name="hourglass-outline" size={20} color={palette.warning[500]} />
                        <TextInput
                          style={styles.textInput}
                          value={formData.duration.toString()}
                          onChangeText={(text) => {
                            const num = parseInt(text) || 0;
                            setFormData(prev => ({ ...prev, duration: num }));
                            if (errors.duration) setErrors(prev => ({ ...prev, duration: null }));
                          }}
                          keyboardType="number-pad"
                          placeholder="120"
                          placeholderTextColor={palette.gray[400]}
                          accessibilityLabel="Exam duration in minutes"
                        />
                        <Text style={styles.unitLabel}>min</Text>
                      </View>
                      {errors.duration && (
                        <View style={styles.errorContainer}>
                          <Ionicons name="alert-circle" size={14} color={palette.error[500]} />
                          <Text style={styles.errorText}>{errors.duration}</Text>
                        </View>
                      )}
                    </View>
                  </Animated.View>

                  {/* Location Input */}
                  <View style={styles.flex1}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Location</Text>
                      <View style={styles.inputContainer}>
                        <Ionicons name="location-outline" size={20} color={palette.error[500]} />
                        <TextInput
                          style={styles.textInput}
                          value={formData.location}
                          onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                          placeholder="Room 305"
                          placeholderTextColor={palette.gray[400]}
                          accessibilityLabel="Exam location"
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </SectionCard>

              {/* Topics Card */}
              <SectionCard
                title={`Topics to Cover ${formData.topics.length > 0 ? `(${formData.topics.length})` : ''}`}
                icon="list"
                iconColor={palette.accent[500]}
              >
                <View style={styles.topicsInputContainer}>
                  <TextInput
                    style={styles.topicInput}
                    value={topicInput}
                    onChangeText={setTopicInput}
                    placeholder="Add a topic (e.g., Chapter 5)"
                    placeholderTextColor={palette.gray[400]}
                    onSubmitEditing={handleAddTopic}
                    returnKeyType="done"
                    accessibilityLabel="Add topic"
                  />
                  <TouchableOpacity
                    style={styles.addTopicButton}
                    onPress={handleAddTopic}
                    disabled={!topicInput.trim()}
                    accessibilityLabel="Add topic button"
                    accessibilityRole="button"
                  >
                    <LinearGradient
                      colors={topicInput.trim() ? gradients.primary : ['#E2E8F0', '#CBD5E1']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.addTopicGradient}
                    >
                      <Ionicons
                        name="add-circle"
                        size={24}
                        color={topicInput.trim() ? "#FFFFFF" : palette.gray[400]}
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {formData.topics.length > 0 && (
                  <View style={styles.topicsList}>
                    {formData.topics.map((topic, index) => (
                      <TopicChip
                        key={index}
                        topic={topic}
                        onRemove={() => handleRemoveTopic(index)}
                        index={index}
                      />
                    ))}
                  </View>
                )}
              </SectionCard>

              {/* Notes Card */}
              <SectionCard
                title="Preparation Notes"
                icon="create"
                iconColor={palette.success[500]}
                style={styles.lastCard}
              >
                <TextInput
                  style={styles.textArea}
                  value={formData.notes}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
                  placeholder="Add notes about your preparation strategy, important resources, or study tips..."
                  placeholderTextColor={palette.gray[400]}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  accessibilityLabel="Preparation notes"
                />
              </SectionCard>

              {/* Bottom Spacing */}
              <View style={{ height: 80 }} />
            </ScrollView>

            {/* Enhanced Action Buttons */}
            <View style={styles.actions}>
              {exam && (
                <TouchableOpacity
                  style={styles.deleteIconButton}
                  onPress={handleDelete}
                  activeOpacity={0.7}
                  accessibilityLabel="Delete exam"
                  accessibilityRole="button"
                >
                  <Ionicons name="trash-outline" size={24} color={palette.error[500]} />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  exam && styles.saveButtonWithDelete
                ]}
                onPress={handleSave}
                activeOpacity={0.8}
                disabled={isSaving}
                accessibilityLabel={exam ? 'Update exam' : 'Create exam'}
                accessibilityRole="button"
              >
                <LinearGradient
                  colors={headerGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.saveButtonGradient}
                >
                  {isSaving ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Ionicons
                        name={exam ? "checkmark-circle" : "add-circle"}
                        size={22}
                        color="#FFFFFF"
                      />
                      <Text style={styles.saveButtonText}>
                        {exam ? 'Update Exam' : 'Create Exam'}
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Date Picker */}
            {showDatePicker && (
              <DateTimePicker
                value={new Date(formData.date)}
                mode="date"
                display="default"
                onChange={(_event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setFormData(prev => ({
                      ...prev,
                      date: selectedDate.toISOString().split('T')[0],
                    }));
                    if (errors.date) setErrors(prev => ({ ...prev, date: null }));
                  }
                }}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Overlay and Modal Structure
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  keyboardView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: space[4],
    paddingVertical: space[4],
  },
  modalContainer: {
    width: '100%',
    maxWidth: 420,
    height: '88%',
    minHeight: 520,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    ...shadowPresets.xl,
    overflow: 'hidden',
  },

  // Header Styles
  gradientHeader: {
    paddingHorizontal: space[6],
    paddingTop: space[6],
    paddingBottom: space[4],
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIconCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: space[3],
  },
  headerTitle: {
    fontSize: font.size.xl,
    fontWeight: font.weight.bold,
    color: '#FFFFFF',
    marginBottom: space[1],
  },
  headerSubtitle: {
    fontSize: font.size.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  closeButton: {
    padding: space[1],
    marginTop: -space[2],
    marginRight: -space[2],
  },
  countdownContainer: {
    marginTop: space[3],
    alignSelf: 'flex-start',
  },

  // Countdown Badge
  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: space[3],
    paddingVertical: space[2],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  countdownBadgeUrgent: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    borderColor: 'rgba(239, 68, 68, 1)',
  },
  countdownEmoji: {
    fontSize: font.size.lg,
    marginRight: space[2],
  },
  countdownText: {
    fontSize: font.size.sm,
    fontWeight: font.weight.medium,
    color: '#FFFFFF',
  },

  // Form Styles
  form: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  formContent: {
    padding: space[6],
    paddingBottom: space[8],
  },

  // Section Card
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: space[4],
    marginBottom: space[4],
    borderWidth: 1,
    borderColor: palette.gray[100],
    ...shadowPresets.sm,
  },
  lastCard: {
    marginBottom: 0,
  },
  sectionHeader: {
    marginBottom: space[3],
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIconBg: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: space[2],
  },
  sectionTitle: {
    fontSize: font.size.lg,
    fontWeight: font.weight.semibold,
    color: palette.gray[900],
  },
  sectionContent: {
    // Content spacing handled by children
  },

  // Subject Preview Card
  subjectPreviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    marginBottom: space[4],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.gray[200],
    ...shadowPresets.sm,
  },
  subjectPreviewGradient: {
    padding: space[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  subjectPreviewIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectPreviewInfo: {
    flex: 1,
  },
  subjectPreviewLabel: {
    fontSize: font.size.xs,
    color: palette.gray[500],
    marginBottom: space[1],
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  subjectPreviewName: {
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
    color: palette.gray[900],
    marginBottom: space[2],
  },
  subjectPreviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectPreviewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space[2],
    paddingVertical: space[1],
    borderRadius: radius.full,
  },
  subjectPreviewBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    marginRight: space[1],
  },
  subjectPreviewBadgeText: {
    fontSize: font.size.sm,
    fontWeight: font.weight.medium,
  },
  subjectPreviewChevron: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: palette.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Input Styles
  inputGroup: {
    marginBottom: space[4],
  },
  label: {
    fontSize: font.size.sm,
    fontWeight: font.weight.medium,
    color: palette.gray[700],
    marginBottom: space[2],
  },
  required: {
    color: palette.error[500],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.gray[50],
    borderWidth: 1,
    borderColor: palette.gray[200],
    borderRadius: radius.md,
    paddingHorizontal: space[3],
    paddingVertical: space[3],
    minHeight: 48,
  },
  inputFocused: {
    borderColor: palette.primary[500],
    backgroundColor: '#FFFFFF',
    ...shadowPresets.sm,
  },
  inputError: {
    borderColor: palette.error[500],
    backgroundColor: palette.error[50],
  },
  textInput: {
    flex: 1,
    fontSize: font.size.base,
    color: palette.gray[900],
    marginLeft: space[2],
    paddingVertical: 0,
  },
  selectedText: {
    flex: 1,
    fontSize: font.size.base,
    color: palette.gray[900],
    marginLeft: space[2],
  },
  placeholderText: {
    flex: 1,
    fontSize: font.size.base,
    color: palette.gray[400],
    marginLeft: space[2],
  },
  iconRight: {
    marginLeft: space[2],
  },
  dateText: {
    flex: 1,
    fontSize: font.size.base,
    color: palette.gray[900],
    marginLeft: space[2],
  },
  unitLabel: {
    fontSize: font.size.sm,
    color: palette.gray[500],
    marginLeft: space[2],
  },

  // Error Styles
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: space[2],
  },
  errorText: {
    fontSize: font.size.sm,
    color: palette.error[600],
    marginLeft: space[1],
  },

  // Picker Styles
  picker: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: palette.gray[200],
    borderRadius: radius.md,
    marginTop: space[2],
    maxHeight: 200,
    ...shadowPresets.md,
  },
  pickerScroll: {
    maxHeight: 200,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: space[3],
    borderBottomWidth: 1,
    borderBottomColor: palette.gray[100],
  },
  pickerOptionLast: {
    borderBottomWidth: 0,
  },
  subjectColorDot: {
    width: 12,
    height: 12,
    borderRadius: radius.full,
    marginRight: space[2],
  },
  pickerOptionText: {
    flex: 1,
    fontSize: font.size.base,
    color: palette.gray[900],
    marginLeft: space[2],
  },

  // Empty States
  emptySubjects: {
    padding: space[4],
    alignItems: 'center',
  },
  emptySubjectsText: {
    fontSize: font.size.base,
    color: palette.gray[600],
    marginBottom: space[1],
  },
  emptySubjectsHint: {
    fontSize: font.size.sm,
    color: palette.gray[400],
  },

  // Layout Helpers
  row: {
    flexDirection: 'row',
    gap: space[3],
  },
  flex1: {
    flex: 1,
  },

  // Topics Styles
  topicsInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: space[3],
  },
  topicInput: {
    flex: 1,
    backgroundColor: palette.gray[50],
    borderWidth: 1,
    borderColor: palette.gray[200],
    borderRadius: radius.md,
    paddingHorizontal: space[3],
    paddingVertical: space[3],
    fontSize: font.size.base,
    color: palette.gray[900],
    minHeight: 48,
  },
  addTopicButton: {
    marginLeft: space[2],
  },
  addTopicGradient: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
  },
  topicChipWrapper: {
    marginBottom: space[2],
  },
  topicChipGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space[3],
    paddingVertical: space[2],
    borderRadius: radius.lg,
  },
  topicChipText: {
    fontSize: font.size.sm,
    color: palette.primary[700],
    marginLeft: space[1],
    marginRight: space[2],
  },
  topicRemoveButton: {
    marginLeft: space[1],
  },

  // Text Area
  textArea: {
    backgroundColor: palette.gray[50],
    borderWidth: 1,
    borderColor: palette.gray[200],
    borderRadius: radius.md,
    padding: space[3],
    fontSize: font.size.base,
    color: palette.gray[900],
    minHeight: 100,
    textAlignVertical: 'top',
  },

  // Action Buttons
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space[6],
    paddingVertical: space[4],
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: palette.gray[100],
    ...shadowPresets.sm,
  },
  deleteIconButton: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: palette.error[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: space[3],
  },
  saveButton: {
    flex: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  saveButtonWithDelete: {
    marginLeft: 0,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space[3],
    paddingHorizontal: space[4],
  },
  saveButtonText: {
    fontSize: font.size.base,
    fontWeight: font.weight.semibold,
    color: '#FFFFFF',
    marginLeft: space[2],
  },
});

export default ExamFormModal;
