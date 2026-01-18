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
import { palette, radius, space, font, shadowPresets } from '../../constants/Theme';
import { useSchedule } from '../../hooks';
import { useSelector } from 'react-redux';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * StudyBlockFormModal Component
 * Modal for creating and editing study blocks
 */
const StudyBlockFormModal = ({ visible, onClose, block, selectedDay = 0, selectedTime = null }) => {
  const { addStudyBlock, updateStudyBlock, deleteStudyBlock, checkTimeConflict } = useSchedule();
  const subjects = useSelector((state) => state.subject?.subjects || []);
  const [formData, setFormData] = useState({
    subjectId: null,
    dayOfWeek: 0,
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    notes: '',
    isRecurring: true,
  });
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);

  useEffect(() => {
    if (block) {
      setFormData({
        subjectId: block.subjectId || null,
        dayOfWeek: block.dayOfWeek || 0,
        startTime: block.startTime || '09:00',
        endTime: block.endTime || '10:00',
        location: block.location || '',
        notes: block.notes || '',
        isRecurring: block.isRecurring !== undefined ? block.isRecurring : true,
      });
    } else {
      setFormData({
        subjectId: null,
        dayOfWeek: selectedDay,
        startTime: selectedTime || '09:00',
        endTime: selectedTime ?
          `${(parseInt(selectedTime.split(':')[0]) + 1).toString().padStart(2, '0')}:00` :
          '10:00',
        location: '',
        notes: '',
        isRecurring: true,
      });
    }
  }, [block, visible, selectedDay, selectedTime]);

  /**
   * Handle save
   */
  const handleSave = async () => {
    if (!formData.subjectId) {
      Alert.alert('Error', 'Please select a subject');
      return;
    }

    // Check for time conflicts
    const conflict = checkTimeConflict(
      formData.dayOfWeek,
      formData.startTime,
      formData.endTime,
      block?.id
    );

    if (conflict.hasConflict) {
      Alert.alert(
        'Time Conflict',
        `This time slot conflicts with another study block.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Save Anyway',
            onPress: () => performSave(),
          },
        ]
      );
      return;
    }

    await performSave();
  };

  const performSave = async () => {
    if (Platform.OS === 'ios') {
      Vibration.vibrate(10);
    }

    const selectedSubject = subjects.find(s => s.id === formData.subjectId);

    if (block) {
      await updateStudyBlock({
        ...block,
        ...formData,
        color: selectedSubject?.color || palette.primary[500],
      });
    } else {
      await addStudyBlock({
        id: Date.now().toString(),
        ...formData,
        color: selectedSubject?.color || palette.primary[500],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    onClose();
  };

  /**
   * Handle delete
   */
  const handleDelete = () => {
    Alert.alert(
      'Delete Study Block',
      'Are you sure you want to delete this study block?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteStudyBlock(block.id);
            onClose();
          },
        },
      ]
    );
  };

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
            <Text style={styles.headerTitle}>
              {block ? 'Edit Study Block' : 'New Study Block'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color={palette.gray[600]} />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView
            style={styles.form}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
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
                  <Text style={[styles.pickerButtonText, { color: palette.gray[400] }]}>
                    Select Subject
                  </Text>
                )}
                <Ionicons name="chevron-down" size={20} color={palette.gray[500]} />
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

            {/* Day of Week */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Day of Week *</Text>
              <View style={styles.dayButtons}>
                {DAYS.map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayButton,
                      formData.dayOfWeek === index && styles.dayButtonSelected,
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, dayOfWeek: index }))}
                  >
                    <Text
                      style={[
                        styles.dayButtonText,
                        formData.dayOfWeek === index && styles.dayButtonTextSelected,
                      ]}
                    >
                      {day.slice(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Time */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Start Time *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.startTime}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, startTime: text }))}
                  placeholder="09:00"
                  placeholderTextColor={palette.gray[400]}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>End Time *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.endTime}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, endTime: text }))}
                  placeholder="10:00"
                  placeholderTextColor={palette.gray[400]}
                />
              </View>
            </View>

            {/* Location */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                placeholder="e.g., Library, Room 305"
                placeholderTextColor={palette.gray[400]}
              />
            </View>

            {/* Notes */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.notes}
                onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
                placeholder="Additional notes..."
                placeholderTextColor={palette.gray[400]}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            {block && (
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton, !block && { flex: 1 }]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>{block ? 'Update' : 'Create'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: space[4],
    borderBottomWidth: 1,
    borderBottomColor: palette.gray[200],
  },
  headerTitle: {
    fontSize: font.size.xl,
    fontWeight: font.weight.bold,
    color: palette.gray[900],
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    padding: space[4],
  },
  inputGroup: {
    marginBottom: space[4],
  },
  label: {
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: palette.gray[700],
    marginBottom: space[2],
  },
  input: {
    backgroundColor: palette.gray[50],
    borderRadius: radius.xl,
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    fontSize: font.size.md,
    color: palette.gray[900],
    borderWidth: 1,
    borderColor: palette.gray[200],
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: space[3],
  },
  row: {
    flexDirection: 'row',
    gap: space[3],
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: palette.gray[50],
    borderRadius: radius.xl,
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    borderWidth: 1,
    borderColor: palette.gray[200],
  },
  pickerButtonText: {
    fontSize: font.size.md,
    color: palette.gray[900],
  },
  selectedSubject: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  picker: {
    marginTop: space[2],
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: palette.gray[200],
    overflow: 'hidden',
    ...shadowPresets.sm,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    padding: space[4],
    borderBottomWidth: 1,
    borderBottomColor: palette.gray[100],
  },
  pickerOptionText: {
    fontSize: font.size.md,
    color: palette.gray[900],
  },
  dayButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
  },
  dayButton: {
    flex: 1,
    minWidth: 42,
    paddingVertical: space[2],
    borderRadius: radius.lg,
    backgroundColor: palette.gray[100],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.gray[200],
  },
  dayButtonSelected: {
    backgroundColor: palette.primary[500],
    borderColor: palette.primary[500],
  },
  dayButtonText: {
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: palette.gray[500],
  },
  dayButtonTextSelected: {
    color: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    gap: space[3],
    padding: space[4],
    paddingBottom: space[8],
    borderTopWidth: 1,
    borderTopColor: palette.gray[100],
  },
  actionButton: {
    flex: 1,
    paddingVertical: space[4],
    borderRadius: radius.xl,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: palette.error[50],
  },
  deleteButtonText: {
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    color: palette.error[500],
  },
  saveButton: {
    backgroundColor: palette.primary[500],
  },
  saveButtonText: {
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    color: '#FFFFFF',
  },
});

export default StudyBlockFormModal;
