import { Text, StyleSheet } from 'react-native';
import { colors, typography } from '@/constants/Colors';

/**
 * CustomText Component
 * Reusable text with consistent styling
 */
const CustomText = ({ children, style, variant = 'body', ...props }) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'title':
        return styles.title;
      case 'subtitle':
        return styles.subtitle;
      case 'body':
        return styles.body;
      case 'caption':
        return styles.caption;
      default:
        return styles.body;
    }
  };

  return (
    <Text style={[styles.base, getVariantStyle(), style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    color: colors.textPrimary,
  },
  title: {
    fontSize: typography.xl,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: typography.lg,
    fontWeight: '600',
  },
  body: {
    fontSize: typography.md,
    fontWeight: '400',
  },
  caption: {
    fontSize: typography.sm,
    fontWeight: '400',
    color: colors.textSecondary,
  },
});

export default CustomText;
