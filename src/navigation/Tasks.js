import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import Today from '@/screens/Tasks/Today';
import Timetable from '@/screens/Tasks/Timetable';
import Subjects from '@/screens/Tasks/Subjects';
import Exams from '@/screens/Tasks/Exams';
import More from '@/screens/Tasks/More';
import { colors, spacing, borderRadius, shadows } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolateColor,
} from 'react-native-reanimated';

const Tab = createBottomTabNavigator();

/**
 * Custom Tab Bar Icon with animation
 */
const TabIcon = ({ focused, iconName, iconNameFocused, color }) => {
    return (
        <View style={[styles.iconWrapper, focused && styles.iconWrapperFocused]}>
            {focused && (
                <View style={styles.iconGlow} />
            )}
            <Ionicons
                name={focused ? iconNameFocused : iconName}
                size={focused ? 26 : 24}
                color={color}
            />
        </View>
    );
};

/**
 * 🎓 StudyFlow - Main Navigation
 * Modern bottom tab navigation with student-focused tabs
 */
export default function Tasks() {
    return (
        <Tab.Navigator
            initialRouteName='Today'
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarLabelPosition: 'below-icon',
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textTertiary,
                tabBarIconStyle: styles.tabBarIcon,
                tabBarItemStyle: styles.tabBarItem,
                tabBarHideOnKeyboard: true,
            }}
        >
            <Tab.Screen
                name="Today"
                component={Today}
                options={{
                    tabBarLabel: 'Today',
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon
                            focused={focused}
                            iconName="sunny-outline"
                            iconNameFocused="sunny"
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Timetable"
                component={Timetable}
                options={{
                    tabBarLabel: 'Schedule',
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon
                            focused={focused}
                            iconName="grid-outline"
                            iconNameFocused="grid"
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Subjects"
                component={Subjects}
                options={{
                    tabBarLabel: 'Subjects',
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon
                            focused={focused}
                            iconName="library-outline"
                            iconNameFocused="library"
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Exams"
                component={Exams}
                options={{
                    tabBarLabel: 'Exams',
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon
                            focused={focused}
                            iconName="ribbon-outline"
                            iconNameFocused="ribbon"
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="More"
                component={More}
                options={{
                    tabBarLabel: 'More',
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon
                            focused={focused}
                            iconName="apps-outline"
                            iconNameFocused="apps"
                            color={color}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        height: Platform.OS === 'ios' ? 88 : 70,
        paddingBottom: Platform.OS === 'ios' ? 28 : 10,
        paddingTop: 10,
        paddingHorizontal: spacing.sm,
        ...shadows.medium,
    },
    tabBarLabel: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 4,
        letterSpacing: 0.2,
    },
    tabBarIcon: {
        marginTop: 4,
    },
    tabBarItem: {
        paddingVertical: 4,
    },
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 32,
        borderRadius: borderRadius.lg,
    },
    iconWrapperFocused: {
        backgroundColor: colors.primarySoft,
    },
    iconGlow: {
        position: 'absolute',
        width: 44,
        height: 32,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primary,
        opacity: 0.15,
    },
});
