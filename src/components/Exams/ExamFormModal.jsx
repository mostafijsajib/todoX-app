import { useState, useEffect } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/constants/Colors';
import { useExams, useSubjects, useToastOperations } from '@/hooks';
import { useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { validateExamForm } from '@/utils/validation';

/**
 * ExamFormModal Component
 * Modal for creating and editing exams
 */
const ExamFormModal = ({ visible, onClose, exam }) => {
  const { addExam, updateExam, deleteExam } = useExams();
  const { examOperations } = useToastOperations();
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
  }, [exam, visible]);

  /**
   * Handle save with validation
   */
  const handleSave = async () => {
    // Run validation
    const validation = validateExamForm(formData, subjects);
    setErrors(validation.errors);
    
    if (!validation.isValid) {
      // Show first error as alert
      const firstError = Object.values(validation.errors)[0];
      Alert.alert('Validation Error', firstError);
      return;
    }

    if (Platform.OS === 'ios') {
      Vibration.vibrate(10);
    }

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
  };

  /**
   * Handle delete
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
            await deleteExam(exam.id);
            onClose();
          },
        },
      ]
    );
  };

  /**
   * Handle add topic
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

  /**
   * Handle remove topic
   */
  const handleRemoveTopic = (index) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index),
    }));
  };

  /**
   * Get selected subject
   */
  const selectedSubject = subjects.find(s => s.id === formData.subjectId);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{exam ? 'Edit Exam' : 'New Exam'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView
            style={styles.form}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Exam Title *</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                placeholder="e.g., Midterm Exam"
                placeholderTextColor={colors.textPlaceholder}
              />
            </View>

            {/* Subject */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Subject *</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowSubjectPicker(!showSubjectPicker)}
              >
                {selectedSubject ? (
                  <View style={styles.selectedSubject}>
                    <Ionicons name={selectedSubject.icon} size={20} color={selectedSubject.color} />
                    <Text style={styles.pickerButtonText}>{selectedSubject.name}</Text>
                  </View>
                ) : (
                  <Text style={[styles.pickerButtonText, { color: colors.textPlaceholder }]}>
                    Select Subject
                  </Text>
                )}
                <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              {showSubjectPicker && (
                <View style={styles.picker}>
                  {subjects.map(subject => (
                    <TouchableOpacity
                      key={subject.id}
                      style={styles.pickerOption}
                      onPress={() => {
                        setFormData(prev => ({ ...prev, subjectId: subject.id }));
                        setShowSubjectPicker(false);
                      }}
                    >
                      <Ionicons name={subject.icon} size={20} color={subject.color} />
                      <Text style={styles.pickerOptionText}>{subject.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Date & Time */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Date *</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.inputText}>{formData.date}</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: spacing.md }]}>
                <Text style={styles.label}>Time</Text>
                <TextInput
                  style={styles.input}
                  value={formData.time}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, time: text }))}
                  placeholder="09:00"
                  placeholderTextColor={colors.textPlaceholder}
                />
              </View>
            </View>

            {/* Duration & Location */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Duration (min)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.duration.toString()}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, duration: parseInt(text) || 0 }))}
                  keyboardType="number-pad"
                  placeholder="120"
                  placeholderTextColor={colors.textPlaceholder}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: spacing.md }]}>
                <Text style={styles.label}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={formData.location}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                  placeholder="Room 305"
                  placeholderTextColor={colors.textPlaceholder}
                />
              </View>
            </View>

            {/* Topics */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Topics</Text>
              <View style={styles.topicsInput}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  value={topicInput}
                  onChangeText={setTopicInput}
                  placeholder="Add a topic"
                  placeholderTextColor={colors.textPlaceholder}
                  onSubmitEditing={handleAddTopic}
                />
                <TouchableOpacity
                  style={styles.addTopicButton}
                  onPress={handleAddTopic}
                >
                  <Ionicons name="add" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {formData.topics.length > 0 && (
                <View style={styles.topicsList}>
                  {formData.topics.map((topic, index) => (
                    <View key={index} style={styles.topicChip}>
                      <Text style={styles.topicChipText}>{topic}</Text>
                      <TouchableOpacity onPress={() => handleRemoveTopic(index)}>
                        <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Notes */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.notes}
                onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
                placeholder="Preparation notes..."
                placeholderTextColor={colors.textPlaceholder}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            {exam && (
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton, !exam && { flex: 1 }]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>{exam ? 'Update' : 'Create'}</Text>
            </TouchableOpacity>
          </View>

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={new Date(formData.date)}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setFormData(prev => ({
                    ...prev,
                    date: selectedDate.toISOString().split('T')[0],
                  }));
                }
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  form: {
    padding: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputText: {
    fontSize: typography.md,
    color: colors.textPrimary,
  },
  textArea: {
    minHeight: 90,
  },
  row: {
    flexDirection: 'row',
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pickerButtonText: {
    fontSize: typography.md,
    color: colors.textPrimary,
  },
  selectedSubject: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  picker: {
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerOptionText: {
    fontSize: typography.md,
    color: colors.textPrimary,
  },
  topicsInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  addTopicButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  topicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  topicChipText: {
    fontSize: typography.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: colors.error + '20',
  },
  deleteButtonText: {
    fontSize: typography.md,
    fontWeight: '600',
    color: colors.error,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    fontSize: typography.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ExamFormModal;
