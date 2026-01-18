/**
 * 🎓 Study Planner Design System
 * Modern Minimalist Premium Theme
 *
 * Design Philosophy:
 * - Clean white backgrounds with subtle blue accents
 * - Professional blue palette for focus and trust
 * - Crisp minimal design with clear visual hierarchy
 * - Smooth, purposeful animations with premium feel
 */

export const colors = {
  // 🎨 Primary Brand Colors - Professional Blue palette
  primary: '#2563EB', // Deep blue - main accent
  primaryDark: '#1E40AF',
  primaryLight: '#3B82F6',
  primarySoft: 'rgba(37, 99, 235, 0.08)',
  primaryUltraSoft: 'rgba(37, 99, 235, 0.04)',

  // Secondary - Indigo for variety and depth
  secondary: '#4F46E5',
  secondaryDark: '#4338CA',
  secondaryLight: '#6366F1',
  secondarySoft: 'rgba(79, 70, 229, 0.08)',

  // Accent colors for highlights
  accent: '#0EA5E9', // Sky blue for highlights
  accentCyan: '#06B6D4',
  accentTeal: '#14B8A6',
  accentPurple: '#8B5CF6',

  // ☀️ Modern Minimalist Backgrounds - Clean whites with subtle grays
  background: '#FFFFFF', // Pure white main background
  backgroundSecondary: '#F8FAFC', // Subtle gray-blue tint
  backgroundTertiary: '#F1F5F9', // Light gray-blue for sections
  surface: '#FFFFFF', // Card surfaces - pure white
  surfaceElevated: '#FFFFFF', // Elevated elements
  surfaceHighlight: '#F0F9FF', // Highlighted areas - soft blue tint
  cardBackground: '#FFFFFF', // Solid card background
  overlay: 'rgba(15, 23, 42, 0.6)', // Dark overlay for modals

  // 📝 Text Colors - Clean slate grays for readability
  text: '#0F172A', // Slate 900 - primary text
  textPrimary: '#0F172A', // Deep slate for headings
  textSecondary: '#475569', // Slate 600 - secondary text
  textTertiary: '#64748B', // Slate 500 - muted text
  textQuaternary: '#94A3B8', // Slate 400 - subtle text
  textOnPrimary: '#FFFFFF',
  textOnDark: '#FFFFFF',
  textPlaceholder: '#94A3B8',

  // ✅ Status Colors - Professional and clear
  success: '#10B981', // Emerald green - clear success
  successLight: '#34D399',
  successDark: '#059669',
  successSoft: 'rgba(16, 185, 129, 0.08)',

  warning: '#F59E0B', // Amber - clear warning
  warningLight: '#FBBF24',
  warningDark: '#D97706',
  warningSoft: 'rgba(245, 158, 11, 0.08)',

  error: '#EF4444', // Red - clear error
  errorLight: '#F87171',
  errorDark: '#DC2626',
  errorSoft: 'rgba(239, 68, 68, 0.08)',

  info: '#0EA5E9', // Sky blue - clear info
  infoLight: '#38BDF8',
  infoDark: '#0284C7',
  infoSoft: 'rgba(14, 165, 233, 0.08)',

  // 🔲 Borders & Dividers - Clean subtle grays
  border: '#E2E8F0', // Slate 200 - clear borders
  borderLight: '#F1F5F9', // Slate 100 - subtle borders
  borderDark: '#CBD5E1', // Slate 300 - pronounced borders
  borderFocused: '#2563EB', // Primary blue for focus
  divider: '#F1F5F9', // Very subtle dividers
  borderGlass: 'rgba(226, 232, 240, 0.6)', // Keep for compatibility

  // 📋 Task Status
  completed: '#10B981',
  completedBg: 'rgba(16, 185, 129, 0.08)',
  pending: '#F59E0B',
  pendingBg: 'rgba(245, 158, 11, 0.08)',
  overdue: '#EF4444',
  overdueBg: 'rgba(239, 68, 68, 0.08)',
  inProgress: '#2563EB',
  inProgressBg: 'rgba(37, 99, 235, 0.08)',

  // 🚨 Priority Colors
  highPriority: '#EF4444',
  highPriorityBg: 'rgba(239, 68, 68, 0.08)',
  mediumPriority: '#F59E0B',
  mediumPriorityBg: 'rgba(245, 158, 11, 0.08)',
  lowPriority: '#10B981',
  lowPriorityBg: 'rgba(16, 185, 129, 0.08)',

  // 👆 Interactive States
  hover: 'rgba(37, 99, 235, 0.04)',
  pressed: 'rgba(37, 99, 235, 0.12)',
  focus: 'rgba(37, 99, 235, 0.16)',
  disabled: '#F1F5F9', // Light gray
  disabledText: '#94A3B8',
  ripple: 'rgba(37, 99, 235, 0.20)',

  // 🌟 Modern Clean Shadows - Subtle depth
  shadow: {
    // Light shadow
    light: 'rgba(148, 163, 184, 0.05)',
    lightOffset: { width: 0, height: -1 },
    lightBlur: 2,

    // Dark shadow (main depth)
    dark: 'rgba(15, 23, 42, 0.08)', // Subtle slate shadow
    darkOffset: { width: 0, height: 2 },
    darkBlur: 8,

    // Additional shadow intensities
    softShadow: 'rgba(15, 23, 42, 0.04)',
    mediumShadow: 'rgba(15, 23, 42, 0.08)',
    heavyShadow: 'rgba(15, 23, 42, 0.12)',
    glow: 'rgba(37, 99, 235, 0.2)',
    soft: 'rgba(15, 23, 42, 0.03)',
    card: 'rgba(15, 23, 42, 0.05)',
  },

  // 🌈 Gradients - Professional blue themed
  gradients: {
    primary: ['#2563EB', '#3B82F6'], // Blue gradient
    primaryDark: ['#1E40AF', '#2563EB'], // Dark blue
    primarySoft: ['rgba(37, 99, 235, 0.08)', 'rgba(59, 130, 246, 0.04)'],
    secondary: ['#4F46E5', '#6366F1'], // Indigo gradient
    sky: ['#0EA5E9', '#38BDF8'], // Sky blue (3-color option)
    coolGlow: ['#0EA5E9', '#3B82F6'], // Cool blue glow
    ocean: ['#0284C7', '#0EA5E9'], // Ocean gradient
    purple: ['#8B5CF6', '#A78BFA'], // Purple gradient
    success: ['#10B981', '#34D399'], // Emerald
    warning: ['#F59E0B', '#FBBF24'], // Amber
    error: ['#EF4444', '#F87171'], // Red
    info: ['#0EA5E9', '#38BDF8'], // Sky
    card: ['#FFFFFF', '#F8FAFC'], // Subtle card gradient
    header: ['#F8FAFC', '#FFFFFF'], // Header gradient
    glass: ['rgba(255, 255, 255, 0.95)', 'rgba(248, 250, 252, 0.9)'],
    glassCard: ['rgba(255, 255, 255, 0.98)', 'rgba(255, 255, 255, 0.92)'],
  },

  // 🔮 Glass - Clean white glass for modern feel
  glass: {
    ultraLight: 'rgba(255, 255, 255, 0.4)',
    light: 'rgba(255, 255, 255, 0.6)',
    medium: 'rgba(255, 255, 255, 0.8)',
    heavy: 'rgba(255, 255, 255, 0.92)',
    solid: 'rgba(255, 255, 255, 0.98)',
    border: 'rgba(226, 232, 240, 0.8)',
    borderSoft: 'rgba(226, 232, 240, 0.4)',
    overlay: 'rgba(15, 23, 42, 0.6)',
    card: 'rgba(255, 255, 255, 0.95)',
    cardHover: 'rgba(248, 250, 252, 1)',
    input: 'rgba(255, 255, 255, 0.98)',
    button: 'rgba(255, 255, 255, 0.92)',
    modal: 'rgba(255, 255, 255, 1)',
    frosted: 'rgba(248, 250, 252, 0.98)',
  },

  // ✨ Glow Effects - Professional blue themed
  glow: {
    primary: 'rgba(37, 99, 235, 0.3)',
    primaryStrong: 'rgba(37, 99, 235, 0.5)',
    secondary: 'rgba(79, 70, 229, 0.3)',
    success: 'rgba(16, 185, 129, 0.3)',
    warning: 'rgba(245, 158, 11, 0.3)',
    error: 'rgba(239, 68, 68, 0.3)',
    info: 'rgba(14, 165, 233, 0.3)',
    white: 'rgba(255, 255, 255, 0.8)',
  },

  // 🌫️ Blur Levels - Enhanced for glass effect
  blur: {
    xs: 4,
    light: 8,
    medium: 12,
    heavy: 20,
    ultra: 28,
    extreme: 40,
  },

  // 🎯 Utility Colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // 🌅 Blue Shades for variety
  blue: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB', // Primary
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // 📂 Category Colors - Professional palette
  categories: {
    homework: '#2563EB',    // Blue - Assignments
    study: '#8B5CF6',       // Purple - Study sessions
    project: '#10B981',     // Emerald - Projects
    reading: '#F59E0B',     // Amber - Reading
    revision: '#4F46E5',    // Indigo - Revision
    practice: '#0EA5E9',    // Sky - Practice
    research: '#6366F1',    // Light indigo - Research
    other: '#64748B',       // Slate - Other
  },

  // 📚 Subject Color Palette - Professional variety
  subjectColors: {
    mathematics: '#2563EB',   // Blue
    science: '#10B981',       // Emerald
    physics: '#0EA5E9',       // Sky blue
    chemistry: '#F59E0B',     // Amber
    biology: '#34D399',       // Light emerald
    english: '#8B5CF6',       // Purple
    literature: '#A78BFA',    // Light purple
    history: '#FBBF24',       // Gold
    geography: '#38BDF8',     // Light sky
    art: '#EC4899',           // Pink
    music: '#F472B6',         // Light pink
    languages: '#C084FC',     // Light purple
    computerScience: '#3B82F6', // Light blue
    economics: '#F59E0B',     // Amber
    psychology: '#8B5CF6',    // Purple
    default: '#2563EB',       // Primary blue
  },

  // 🏆 Achievement/Motivation Colors
  streak: '#F59E0B', // Amber
  milestone: '#10B981', // Emerald
  badge: '#2563EB', // Blue
  star: '#FBBF24', // Gold

  // 📊 Chart/Graph Colors - Professional palette
  chart: {
    primary: '#2563EB',
    secondary: '#8B5CF6',
    tertiary: '#10B981',
    quaternary: '#0EA5E9',
    quinary: '#F59E0B',
  },
};

/**
 * 📐 Spacing System - Enhanced for neomorphic breathing room
 */
export const spacing = {
  xxs: 4,     // Was 2 - better touch targets
  xs: 8,      // Was 4 - increased minimum
  sm: 12,     // Was 8 - more generous
  md: 16,     // Was 12 - standard spacing
  lg: 20,     // Was 16 - more breathing room
  xl: 28,     // Was 24 - generous spacing
  xxl: 36,    // Was 32 - section spacing
  xxxl: 52,   // Was 48 - large sections
  section: 20,   // Was 16 - more separation
  card: 16,      // Was 14 - improved padding
  screen: 20,    // Was 16 - screen edges
  itemGap: 12,   // Was 10 - list items
  chipGap: 8,    // NEW - for badges/chips
};

/**
 * 🔤 Typography System - Professional compact design (15% reduction)
 */
export const typography = {
  // Direct access sizes (reduced by 15% for more compact, professional look)
  xxs: 9,    // 10 * 0.85 = 8.5 ≈ 9
  xs: 10,    // 12 * 0.85 = 10.2 ≈ 10
  sm: 12,    // 14 * 0.85 = 11.9 ≈ 12
  md: 14,    // 16 * 0.85 = 13.6 ≈ 14
  lg: 15,    // 18 * 0.85 = 15.3 ≈ 15
  xl: 18,    // 21 * 0.85 = 17.85 ≈ 18
  xxl: 20,   // 24 * 0.85 = 20.4 ≈ 20
  xxxl: 26,  // 30 * 0.85 = 25.5 ≈ 26
  display: 31, // 36 * 0.85 = 30.6 ≈ 31
  hero: 41,  // 48 * 0.85 = 40.8 ≈ 41

  // Nested structure
  sizes: {
    xxs: 9,
    xs: 10,
    sm: 12,
    md: 14,
    lg: 15,
    xl: 18,
    xxl: 20,
    xxxl: 26,
    display: 31,
    hero: 41,
  },

  fontSize: {
    xxs: 9,
    xs: 10,
    sm: 12,
    base: 14,
    lg: 15,
    xl: 18,
    '2xl': 20,
    '3xl': 26,
    '4xl': 31,
    '5xl': 41,
  },
  
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900', // NEW - ultra emphasis
  },

  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900', // NEW - ultra emphasis
  },

  lineHeight: {
    tight: 1.2,      // Was 1.15 - headings
    snug: 1.35,      // Was 1.3 - subheadings
    normal: 1.5,     // Was 1.45 - body text (improved readability)
    relaxed: 1.65,   // Was 1.6 - large body text
    loose: 1.85,     // Was 1.8 - extra spacing
  },

  letterSpacing: {
    tighter: -0.5,   // NEW - tight headings
    tight: -0.25,    // Was -0.3 - headings
    normal: 0,
    wide: 0.4,       // Was 0.3 - small caps
    wider: 0.8,      // Was 0.6 - uppercase labels
    widest: 1.2,     // NEW - extra wide
  },
};

/**
 * 🎯 Semantic Typography System - Professional compact design
 * Use these for consistent component styling across the app
 */
export const semanticTypography = {
  // Display & Hero
  hero: {
    fontSize: 41,      // 48 * 0.85 = 40.8 ≈ 41
    fontWeight: '800', // extrabold
    lineHeight: 49,    // Tight for impact
    letterSpacing: -0.5,
  },
  display: {
    fontSize: 31,      // 36 * 0.85 = 30.6 ≈ 31
    fontWeight: '700', // bold
    lineHeight: 37,
    letterSpacing: -0.3,
  },

  // Headings
  h1: {
    fontSize: 24,      // 28 * 0.85 = 23.8 ≈ 24
    fontWeight: '700', // bold
    lineHeight: 29,
    letterSpacing: -0.25,
  },
  h2: {
    fontSize: 19,      // 22 * 0.85 = 18.7 ≈ 19
    fontWeight: '600', // semibold
    lineHeight: 23,
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: 15,      // 18 * 0.85 = 15.3 ≈ 15
    fontWeight: '600', // semibold
    lineHeight: 20,
    letterSpacing: 0,
  },
  h4: {
    fontSize: 13,      // 16 * 0.85 = 13.6 ≈ 13
    fontWeight: '600', // semibold
    lineHeight: 18,
    letterSpacing: 0,
  },

  // Body Text
  body: {
    fontSize: 13,      // 15 * 0.85 = 12.75 ≈ 13
    fontWeight: '400', // normal
    lineHeight: 19,
  },
  bodyMedium: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 19,
  },
  bodySemiBold: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },
  bodyLarge: {
    fontSize: 15,      // 18 * 0.85 = 15.3 ≈ 15
    fontWeight: '400',
    lineHeight: 22,
  },

  // Small Text
  caption: {
    fontSize: 10,      // 12 * 0.85 = 10.2 ≈ 10
    fontWeight: '400',
    lineHeight: 14,
  },
  captionMedium: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
  },
  small: {
    fontSize: 11,      // 13 * 0.85 = 11.05 ≈ 11
    fontWeight: '400',
    lineHeight: 15,
  },

  // UI Elements
  button: {
    fontSize: 13,      // 15 * 0.85 = 12.75 ≈ 13
    fontWeight: '600',
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  buttonLarge: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  badge: {
    fontSize: 9,       // 11 * 0.85 = 9.35 ≈ 9
    fontWeight: '600',
    lineHeight: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 11,      // 13 * 0.85 = 11.05 ≈ 11
    fontWeight: '500',
    lineHeight: 15,
    letterSpacing: 0.3,
  },

  // Input & Forms
  input: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  placeholder: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    color: colors.textPlaceholder,
  },
};

/**
 * 📱 Responsive Typography - Scale based on screen size
 * Call this function with screen width to get scaled typography
 */
export const getResponsiveTypography = (screenWidth) => {
  // Mobile: < 375px → 0.92x scale
  // Standard: 375-428px → 1x scale
  // Large: > 428px → 1.05x scale

  const baseScale = screenWidth < 375 ? 0.92 : screenWidth > 428 ? 1.05 : 1;

  const scaleTypography = (obj) => {
    const scaled = {};
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object') {
        scaled[key] = {
          ...obj[key],
          fontSize: Math.round(obj[key].fontSize * baseScale),
          lineHeight: obj[key].lineHeight ? Math.round(obj[key].lineHeight * baseScale) : undefined,
        };
      }
    });
    return scaled;
  };

  return scaleTypography(semanticTypography);
};

/**
 * 🔘 Border Radius System - Softer for neomorphic style
 */
export const borderRadius = {
  none: 0,
  xs: 6,      // Was 4 - softer minimum
  sm: 10,     // Was 6 - badges
  md: 14,     // Was 10 - buttons
  lg: 18,     // Was 14 - cards
  xl: 24,     // Was 18 - large cards
  '2xl': 28,  // Was 22 - extra large
  '3xl': 32,  // Was 26 - modal corners
  '4xl': 40,  // Was 32 - hero elements
  full: 9999,
  card: 24,       // Was 18 - more pronounced
  button: 16,     // Was 14 - softer buttons
  input: 14,      // Was 12 - input fields
  badge: 12,      // Was 10 - badges
  pill: 50,
  glass: 20,      // Keep for compatibility
};

/**
 * 🌑 Modern Minimalist Shadow Presets - Subtle, clean depth
 */
export const shadows = {
  // Level 0: No shadow
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  // Level 1: Subtle depth (inputs, subtle cards)
  neo1: {
    shadowColor: '#0F172A', // Slate shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  // Level 2: Standard cards
  neo2: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  // Level 3: Buttons, interactive elements
  neo3: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  // Level 4: Floating elements (FAB)
  neo4: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },

  // Level 5: Modals, dropdowns
  neo5: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },

  // Inset: Pressed/active states
  inset: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 0,
  },

  // Glow: Focus states, accent elements
  glow: {
    shadowColor: '#2563EB', // Primary blue glow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 0,
  },

  // Legacy aliases for backwards compatibility
  small: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  large: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  xl: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  glass: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  button: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  colored: {
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  soft: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  float: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
};

/**
 * 📏 Common Layout Values - Compact design
 */
export const layout = {
  headerHeight: 52,
  tabBarHeight: 70,
  fabSize: 52,
  fabSizeSmall: 44,
  iconSizeXS: 14,
  iconSizeSmall: 16,
  iconSizeMedium: 20,
  iconSizeLarge: 24,
  iconSizeXL: 28,
  avatarSmall: 28,
  avatarMedium: 40,
  avatarLarge: 56,
  cardMinHeight: 70,
  inputHeight: 44,
  buttonHeight: 44,
  buttonHeightSmall: 34,
  buttonHeightMini: 28,
  listItemHeight: 60,
  compactListItemHeight: 48,
};

/**
 * ⏱️ Animation Durations
 */
export const animations = {
  fastest: 80,
  fast: 150,
  normal: 250,
  slow: 350,
  slowest: 450,
  spring: {
    tension: 50,
    friction: 8,
  },
  bounce: {
    tension: 60,
    friction: 6,
  },
};

/**
 * 🎨 Glass Card Styles - Reusable glass effects
 */
export const glassStyles = {
  card: {
    backgroundColor: colors.glass.card,
    borderRadius: borderRadius.glass,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  cardSolid: {
    backgroundColor: colors.glass.heavy,
    borderRadius: borderRadius.glass,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  input: {
    backgroundColor: colors.glass.input,
    borderRadius: borderRadius.input,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    backgroundColor: colors.glass.button,
    borderRadius: borderRadius.button,
    borderWidth: 1,
    borderColor: colors.borderGlass,
  },
  modal: {
    backgroundColor: colors.glass.modal,
    borderRadius: borderRadius.card,
  },
};

/**
 * 💬 Motivational Messages for Students
 */
export const motivationalMessages = {
  morning: [
    "Good morning! Ready to ace today?",
    "Fresh start, fresh focus!",
    "New day, new achievements ahead!",
  ],
  afternoon: [
    "Keep going! You're making progress",
    "Afternoon focus mode activated",
    "Stay focused, stay productive!",
  ],
  evening: [
    "Evening review time! Almost there",
    "Wrapping up strong!",
    "Great work today! Keep it up",
  ],
  night: [
    "Late study session! Stay focused",
    "Night owl mode! You've got this",
    "One more task, then rest well!",
  ],
  completed: [
    "Well done!",
    "Task completed!",
    "Excellent work!",
    "Keep it up!",
    "You're on fire!",
  ],
  streak: [
    "day streak! Keep going!",
    "days in a row! Amazing!",
    "day streak! Unstoppable!",
  ],
};

/**
 * 🎨 Theme Configuration
 */
export const themeConfig = {
  mode: 'light',
  style: 'minimalist', // Modern minimalist
  primaryColor: 'blue', // Professional blue
  hasGlassmorphism: false, // Clean solid backgrounds
  blurEnabled: false, // Crisp, no blur
  hasNeomorphism: false, // Minimal flat design
};

