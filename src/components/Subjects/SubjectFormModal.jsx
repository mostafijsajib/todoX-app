/**
 * SubjectFormModal Component
 * Modal for creating and editing subjects
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../UI/GlassCard';
import { colors, spacing, borderRadius, typography } from '../../constants/Colors';
import { BlurView } from 'expo-blur';
import { validateSubjectForm } from '../../utils/validation';
import { useSelector } from 'react-redux';

// Subject color palette
const SUBJECT_COLORS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Orange', value: '#F59E0B' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Cyan', value: '#06B6D4' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Yellow', value: '#FACC15' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Rose', value: '#F43F5E' },
];

// Subject icons
const SUBJECT_ICONS = [
  { name: 'Book', value: 'book-outline' },
  { name: 'Calculator', value: 'calculator-outline' },
  { name: 'Flask', value: 'flask-outline' },
  { name: 'Library', value: 'library-outline' },
  { name: 'Time', value: 'time-outline' },
  { name: 'Palette', value: 'color-palette-outline' },
  { name: 'Music', value: 'musical-notes-outline' },
  { name: 'Fitness', value: 'fitness-outline' },
  { name: 'Language', value: 'language-outline' },
  { name: 'Laptop', value: 'laptop-outline' },
  { name: 'Brush', value: 'brush-outline' },
  { name: 'Bulb', value: 'bulb-outline' },
];

const SubjectFormModal = ({
  visible,
  onClose,
  onSubmit,
  initialSubject = null,
  mode = 'create', // 'create' | 'edit'
}) => {
  const existingSubjects = useSelector((state) => state.subject?.subjects || []);
  const [subjectName, setSubjectName] = useState('');
  const [selectedColor, setSelectedColor] = useState(SUBJECT_COLORS[0].value);
  const [selectedIcon, setSelectedIcon] = useState(SUBJECT_ICONS[0].value);
  const [errors, setErrors] = useState({});

  // Initialize form when modal opens or subject changes
  useEffect(() => {
    if (visible) {
      if (initialSubject && mode === 'edit') {
        setSubjectName(initialSubject.name || '');
        setSelectedColor(initialSubject.color || SUBJECT_COLORS[0].value);
        setSelectedIcon(initialSubject.icon || SUBJECT_ICONS[0].value);
      } else {
        // Reset form for create mode
        setSubjectName('');
        setSelectedColor(SUBJECT_COLORS[0].value);
        setSelectedIcon(SUBJECT_ICONS[0].value);
      }
    }
  }, [visible, initialSubject, mode]);

  const handleSubmit = () => {
    const formData = {
      name: subjectName,
      color: selectedColor,
      icon: selectedIcon,
    };
    
    // Run validation
    const validation = validateSubjectForm(
      formData, 
      existingSubjects, 
      mode === 'edit' && initialSubject ? initialSubject.id : null
    );
    setErrors(validation.errors);
    
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      Alert.alert('Validation Error', firstError);
      return;
    }

    const subjectData = {
      ...(mode === 'edit' && initialSubject ? { id: initialSubject.id } : {}),
      name: subjectName.trim(),
      color: selectedColor,
      icon: selectedIcon,
    };

    onSubmit(subjectData);
    onClose();
  };

  const renderOverlay = () => {
    if (Platform.OS === 'ios') {
      return (
        <BlurView
          style={styles.overlay}
          blurType="dark"
          blurAmount={20}
          reducedTransparencyFallbackColor={colors.overlay}
        />
      );
    }
    return <View style={[styles.overlay, { backgroundColor: colors.overlay }]} />;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {renderOverlay()}

        <View style={styles.modalContent}>
          <GlassCard style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                {mode === 'edit' ? 'Edit Subject' : 'New Subject'}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              {/* Subject Name */}
              <View style={styles.section}>
                <Text style={styles.label}>Subject Name *</Text>
                <TextInput
                  style={styles.input}
                  value={subjectName}
                  onChangeText={setSubjectName}
                  placeholder="e.g., Mathematics, Physics, History..."
                  placeholderTextColor={colors.textPlaceholder}
                  autoFocus
                  maxLength={30}
                />
              </View>

              {/* Color Selection */}
              <View style={styles.section}>
                <Text style={styles.label}>Color</Text>
                <View style={styles.colorGrid}>
                  {SUBJECT_COLORS.map((color) => (
                    <TouchableOpacity
                      key={color.value}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color.value },
                        selectedColor === color.value && styles.colorOptionSelected,
                      ]}
                      onPress={() => setSelectedColor(color.value)}
                    >
                      {selectedColor === color.value && (
                        <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Icon Selection */}
              <View style={styles.section}>
                <Text style={styles.label}>Icon</Text>
                <View style={styles.iconGrid}>
                  {SUBJECT_ICONS.map((icon) => (
                    <TouchableOpacity
                      key={icon.value}
                      style={[
                        styles.iconOption,
                        selectedIcon === icon.value && {
                          backgroundColor: `${selectedColor}30`,
                          borderColor: selectedColor,
                        },
                      ]}
                      onPress={() => setSelectedIcon(icon.value)}
                    >
                      <Ionicons
                        name={icon.value}
                        size={24}
                        color={selectedIcon === icon.value ? selectedColor : colors.textSecondary}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Preview */}
              <View style={styles.section}>
                <Text style={styles.label}>Preview</Text>
                <View style={styles.previewContainer}>
                  <View
                    style={[
                      styles.previewIcon,
                      { backgroundColor: `${selectedColor}20` },
                    ]}
                  >
                    <Ionicons
                      name={selectedIcon}
                      size={32}
                      color={selectedColor}
                    />
                  </View>
                  <Text style={styles.previewText}>{subjectName || 'Subject Name'}</Text>
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.submitButton,
                  { backgroundColor: selectedColor },
                ]}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>
                  {mode === 'edit' ? 'Update' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '85%',
  },
  card: {
    paddingVertical: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  scrollView: {
    paddingHorizontal: spacing.md,
  },
  section: {
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: typography.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: colors.textPrimary,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  previewIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  previewText: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: typography.md,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  submitButton: {
    // backgroundColor set dynamically
  },
  submitButtonText: {
    fontSize: typography.md,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default SubjectFormModal;
