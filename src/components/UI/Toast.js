/**
 * Toast Notification Component
 * Professional toast notifications with animations
 */
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/Colors';

const TOAST_DURATION = 3000;

const toastConfig = {
  success: {
    icon: 'checkmark-circle',
    backgroundColor: colors.success,
    iconColor: '#FFFFFF',
  },
  error: {
    icon: 'alert-circle',
    backgroundColor: colors.error,
    iconColor: '#FFFFFF',
  },
  warning: {
    icon: 'warning',
    backgroundColor: colors.warning,
    iconColor: '#FFFFFF',
  },
  info: {
    icon: 'information-circle',
    backgroundColor: colors.info,
    iconColor: '#FFFFFF',
  },
};

const Toast = ({ 
  visible, 
  message, 
  type = 'info', 
  onHide,
  duration = TOAST_DURATION,
  action,
  actionLabel,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Show toast
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide?.();
    });
  };

  if (!visible) return null;

  const config = toastConfig[type] || toastConfig.info;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + spacing.sm,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={[styles.toast, { backgroundColor: config.backgroundColor }]}>
        <View style={styles.iconContainer}>
          <Ionicons name={config.icon} size={22} color={config.iconColor} />
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
        {action && actionLabel && (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => {
              action();
              hideToast();
            }}
          >
            <Text style={styles.actionLabel}>{actionLabel}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.closeButton} onPress={hideToast}>
          <Ionicons name="close" size={18} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    zIndex: 9999,
    elevation: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  message: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  actionButton: {
    marginLeft: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: borderRadius.sm,
  },
  actionLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: '#FFFFFF',
  },
  closeButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
});

export default Toast;
