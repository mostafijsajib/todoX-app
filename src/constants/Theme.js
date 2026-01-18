/**
 * 🎨 Study Planner Premium Theme System
 * Modern, Clean, Student-Focused Design
 * 
 * Design Philosophy:
 * - Clean, distraction-free interface
 * - Soft gradients and smooth animations
 * - Accessible color contrasts
 * - Gamification elements for motivation
 */

// Color Palette - Modern Premium
export const palette = {
  // Primary - Vibrant Blue (Trust, Focus)
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1', // Main
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },

  // Secondary - Teal (Growth, Balance)
  secondary: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6', // Main
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
  },

  // Accent - Amber (Energy, Achievement)
  accent: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B', // Main
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Success - Emerald
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981', // Main
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },

  // Warning - Orange
  warning: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316', // Main
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },

  // Error - Rose
  error: {
    50: '#FFF1F2',
    100: '#FFE4E6',
    200: '#FECDD3',
    300: '#FDA4AF',
    400: '#FB7185',
    500: '#F43F5E', // Main
    600: '#E11D48',
    700: '#BE123C',
    800: '#9F1239',
    900: '#881337',
  },

  // Neutral - Slate
  neutral: {
    0: '#FFFFFF',
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
  // Alias for backward compatibility
  gray: {
    0: '#FFFFFF',
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
};

// Gradients
export const gradients = {
  primary: ['#6366F1', '#8B5CF6'],
  primarySoft: ['#EEF2FF', '#E0E7FF'],
  secondary: ['#14B8A6', '#06B6D4'],
  accent: ['#F59E0B', '#FBBF24'],
  success: ['#10B981', '#34D399'],
  warning: ['#F97316', '#FB923C'],
  error: ['#F43F5E', '#FB7185'],
  
  // Special gradients
  sunrise: ['#F59E0B', '#EF4444', '#EC4899'],
  ocean: ['#06B6D4', '#3B82F6', '#8B5CF6'],
  forest: ['#10B981', '#059669', '#047857'],
  sunset: ['#F97316', '#F43F5E', '#EC4899'],
  
  // Card gradients
  card: ['#FFFFFF', '#F8FAFC'],
  cardHover: ['#F8FAFC', '#F1F5F9'],
  
  // Achievement gradients
  gold: ['#F59E0B', '#D97706'],
  silver: ['#94A3B8', '#64748B'],
  bronze: ['#F97316', '#C2410C'],
};

// Shadows
export const shadowPresets = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  colored: (color = '#6366F1') => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  }),
  glow: (color = '#6366F1') => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 0,
  }),
};

// Border Radius
export const radius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

// Spacing
export const space = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
};

// Typography
export const font = {
  size: {
    '2xs': 10,
    xs: 11,
    sm: 12,
    base: 14,
    md: 15,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
    '6xl': 40,
  },
  // Alias for backward compatibility
  sizes: {
    '2xs': 10,
    xs: 11,
    sm: 12,
    base: 14,
    md: 15,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
    '6xl': 40,
  },
  weight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  // Alias for backward compatibility
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.65,
    loose: 1.8,
  },
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 1,
  },
};

// Animation durations
export const duration = {
  instant: 0,
  fastest: 100,
  fast: 200,
  normal: 300,
  slow: 400,
  slower: 500,
  slowest: 700,
};

// Spring configs for react-native-reanimated
export const springs = {
  gentle: { damping: 20, stiffness: 150 },
  wobbly: { damping: 10, stiffness: 150 },
  stiff: { damping: 20, stiffness: 300 },
  bouncy: { damping: 10, stiffness: 200 },
  smooth: { damping: 25, stiffness: 120 },
};

// Subject colors for consistency
export const subjectColors = [
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#F43F5E', // Rose
  '#F97316', // Orange
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
];

// Category icons and colors
export const categories = {
  study: { icon: 'book', color: '#6366F1', label: 'Study' },
  assignment: { icon: 'document-text', color: '#F59E0B', label: 'Assignment' },
  homework: { icon: 'pencil', color: '#F97316', label: 'Homework' },
  revision: { icon: 'refresh-circle', color: '#8B5CF6', label: 'Revision' },
  practice: { icon: 'bulb', color: '#10B981', label: 'Practice' },
  project: { icon: 'folder', color: '#3B82F6', label: 'Project' },
  reading: { icon: 'library', color: '#14B8A6', label: 'Reading' },
  exam: { icon: 'school', color: '#F43F5E', label: 'Exam Prep' },
  research: { icon: 'search', color: '#06B6D4', label: 'Research' },
  other: { icon: 'ellipsis-horizontal', color: '#64748B', label: 'Other' },
};

// Priority levels
export const priorities = {
  high: { color: '#F43F5E', bgColor: '#FFF1F2', icon: 'flame', label: 'High' },
  medium: { color: '#F59E0B', bgColor: '#FFFBEB', icon: 'sunny', label: 'Medium' },
  low: { color: '#10B981', bgColor: '#ECFDF5', icon: 'leaf', label: 'Low' },
};

// Motivational quotes for students
export const motivationalQuotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Don't let what you cannot do interfere with what you can do.", author: "John Wooden" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Your limitation—it's only your imagination.", author: "Unknown" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
];

// Study tips
export const studyTips = [
  "Take short breaks every 25-30 minutes to stay focused",
  "Review your notes within 24 hours of learning",
  "Teach concepts to others to reinforce your understanding",
  "Get 7-8 hours of sleep for better memory retention",
  "Stay hydrated - your brain needs water to function well",
  "Use active recall instead of passive re-reading",
  "Create a dedicated study space free from distractions",
  "Break large tasks into smaller, manageable chunks",
  "Use the Pomodoro technique for better focus",
  "Review material multiple times over spaced intervals",
];

// Achievement badges
export const achievements = {
  firstTask: { icon: 'rocket', title: 'Getting Started', description: 'Complete your first task' },
  streak3: { icon: 'flame', title: 'On Fire', description: '3-day study streak' },
  streak7: { icon: 'medal', title: 'Week Warrior', description: '7-day study streak' },
  streak30: { icon: 'trophy', title: 'Monthly Master', description: '30-day study streak' },
  earlyBird: { icon: 'sunny', title: 'Early Bird', description: 'Complete a task before 8 AM' },
  nightOwl: { icon: 'moon', title: 'Night Owl', description: 'Complete a task after 10 PM' },
  perfectDay: { icon: 'star', title: 'Perfect Day', description: 'Complete all tasks for a day' },
  focused: { icon: 'timer', title: 'Deep Focus', description: '2+ hours of focus time' },
  organized: { icon: 'folder', title: 'Organized', description: 'Create 5 subjects' },
  examReady: { icon: 'school', title: 'Exam Ready', description: 'Track 3 exams' },
};

export default {
  palette,
  gradients,
  shadowPresets,
  radius,
  space,
  font,
  duration,
  springs,
  subjectColors,
  categories,
  priorities,
  motivationalQuotes,
  studyTips,
  achievements,
};
