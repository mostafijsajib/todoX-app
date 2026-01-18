import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/Colors';
import { useToast } from '@/components/UI';

const GRADE_TYPES = [
  { id: 'exam', label: 'Exam', icon: 'document-text' },
  { id: 'assignment', label: 'Assignment', icon: 'clipboard' },
  { id: 'quiz', label: 'Quiz', icon: 'help-circle' },
  { id: 'project', label: 'Project', icon: 'folder' },
  { id: 'midterm', label: 'Midterm', icon: 'book' },
  { id: 'final', label: 'Final', icon: 'ribbon' },
  { id: 'other', label: 'Other', icon: 'ellipsis-horizontal' },
];

/**
 * Grade Form Modal
 * Form for adding/editing grades with score, weight, and type
 */
const GradeFormModal = ({
  visible,
  onClose,
  onSubmit,
  subjects = [],
  initialData = null,
  currentSemester = null,
}) => {
  const toast = useToast();
  
  const [title, setTitle] = useState(initialData?.title || '');
  const [subjectId, setSubjectId] = useState(initialData?.subjectId || '');
  const [type, setType] = useState(initialData?.type || 'assignment');
  const [score, setScore] = useState(initialData?.score?.toString() || '');
  const [maxScore, setMaxScore] = useState(initialData?.maxScore?.toString() || '100');
  const [weight, setWeight] = useState(initialData?.weight?.toString() || '1');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [semester, setSemester] = useState(initialData?.semester || currentSemester || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);

  const handleSubmit = () => {
    // Validation
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!subjectId) {
      toast.error('Please select a subject');
      return;
    }
    if (!score || isNaN(parseFloat(score))) {
      toast.error('Please enter a valid score');
      return;
    }
    if (!maxScore || isNaN(parseFloat(maxScore))) {
      toast.error('Please enter a valid max score');
      return;
    }

    const gradeData = {
      id: initialData?.id,
      title: title.trim(),
      subjectId,
      type,
      score: parseFloat(score),
      maxScore: parseFloat(maxScore),
      weight: parseFloat(weight) || 1,
      date,
      semester: semester.trim(),
      notes: notes.trim(),
    };

    onSubmit(gradeData);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setSubjectId('');
    setType('assignment');
    setScore('');
    setMaxScore('100');
    setWeight('1');
    setDate(new Date().toISOString().split('T')[0]);
    setSemester(currentSemester || '');
    setNotes('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const selectedSubject = subjects.find((s) => s.id === subjectId);
  const percentage = score && maxScore ? ((parseFloat(score) / parseFloat(maxScore)) * 100).toFixed(1) : '0';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {initialData ? 'Edit Grade' : 'Add Grade'}
            </Text>
            <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.formScrollView}
            contentContainerStyle={styles.formContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Title Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Chapter 5 Quiz"
                placeholderTextColor={colors.textPlaceholder}
              />
            </View>

            {/* Subject Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Subject</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowSubjectPicker(!showSubjectPicker)}
              >
                {selectedSubject ? (
                  <View style={styles.selectedSubject}>
                    <View
                      style={[
                        styles.subjectColor,
                        { backgroundColor: selectedSubject.color || colors.primary },
                      ]}
                    />
                    <Text style={styles.pickerButtonText}>{selectedSubject.name}</Text>
                  </View>
                ) : (
                  <Text style={styles.pickerPlaceholder}>Select a subject</Text>
                )}
                <Ionicons
                  name={showSubjectPicker ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>

              {showSubjectPicker && (
                <View style={styles.subjectList}>
                  {subjects.map((subject) => (
                    <TouchableOpacity
                      key={subject.id}
                      style={[
                        styles.subjectItem,
                        subjectId === subject.id && styles.subjectItemSelected,
                      ]}
                      onPress={() => {
                        setSubjectId(subject.id);
                        setShowSubjectPicker(false);
                      }}
                    >
                      <View
                        style={[
                          styles.subjectColor,
                          { backgroundColor: subject.color || colors.primary },
                        ]}
                      />
                      <Text style={styles.subjectItemText}>{subject.name}</Text>
                      {subjectId === subject.id && (
                        <Ionicons name="checkmark" size={18} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Grade Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Type</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.typeContainer}
              >
                {GRADE_TYPES.map((gradeType) => (
                  <TouchableOpacity
                    key={gradeType.id}
                    style={[
                      styles.typeButton,
                      type === gradeType.id && styles.typeButtonSelected,
                    ]}
                    onPress={() => setType(gradeType.id)}
                  >
                    <Ionicons
                      name={gradeType.icon}
                      size={16}
                      color={type === gradeType.id ? colors.white : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.typeButtonText,
                        type === gradeType.id && styles.typeButtonTextSelected,
                      ]}
                    >
                      {gradeType.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Score Inputs */}
            <View style={styles.scoreRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: spacing.sm }]}>
                <Text style={styles.label}>Score</Text>
                <TextInput
                  style={styles.input}
                  value={score}
                  onChangeText={setScore}
                  placeholder="85"
                  placeholderTextColor={colors.textPlaceholder}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: spacing.sm }]}>
                <Text style={styles.label}>Max Score</Text>
                <TextInput
                  style={styles.input}
                  value={maxScore}
                  onChangeText={setMaxScore}
                  placeholder="100"
                  placeholderTextColor={colors.textPlaceholder}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Percentage Preview */}
            <View style={styles.percentagePreview}>
              <Text style={styles.percentageLabel}>Grade:</Text>
              <Text style={[
                styles.percentageValue,
                parseFloat(percentage) >= 90 ? styles.gradeA :
                parseFloat(percentage) >= 80 ? styles.gradeB :
                parseFloat(percentage) >= 70 ? styles.gradeC :
                parseFloat(percentage) >= 60 ? styles.gradeD :
                styles.gradeF
              ]}>
                {percentage}%
              </Text>
            </View>

            {/* Weight Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Weight (%)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="e.g., 20 for 20%"
                placeholderTextColor={colors.textPlaceholder}
                keyboardType="decimal-pad"
              />
              <Text style={styles.hint}>How much this counts towards your final grade</Text>
            </View>

            {/* Semester Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Semester</Text>
              <TextInput
                style={styles.input}
                value={semester}
                onChangeText={setSemester}
                placeholder="e.g., Spring 2026"
                placeholderTextColor={colors.textPlaceholder}
              />
            </View>

            {/* Notes Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Additional notes..."
                placeholderTextColor={colors.textPlaceholder}
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: spacing.xs,
  },
  modalTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: typography.weights.semibold,
  },
  formScrollView: {
    flex: 1,
  },
  formContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: typography.sizes.xs,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  pickerButtonText: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  pickerPlaceholder: {
    fontSize: typography.sizes.md,
    color: colors.textPlaceholder,
  },
  selectedSubject: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  subjectList: {
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  subjectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  subjectItemSelected: {
    backgroundColor: colors.primarySoft,
  },
  subjectItemText: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  typeButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  typeButtonTextSelected: {
    color: colors.white,
  },
  scoreRow: {
    flexDirection: 'row',
  },
  percentagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  percentageLabel: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  percentageValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  gradeA: { color: colors.success },
  gradeB: { color: colors.info },
  gradeC: { color: colors.warning },
  gradeD: { color: colors.warning },
  gradeF: { color: colors.error },
});

export default GradeFormModal;
