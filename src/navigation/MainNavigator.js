import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Dashboard from '@/screens/Tasks/Today';
import Schedule from '@/screens/Tasks/Timetable';
import Subjects from '@/screens/Tasks/Subjects';
import Exams from '@/screens/Tasks/Exams';
import Profile from '@/screens/Tasks/More';
import { palette, radius, space, font, shadowPresets, springs } from '@/constants/Theme';

const Tab = createBottomTabNavigator();

/**
 * Custom Animated Tab Bar Button
 */
const AnimatedTabButton = ({ onPress, onLongPress, isFocused, icon, label }) => {
  const scale = useSharedValue(1);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(isFocused ? 1.1 : 1, springs.bouncy) },
        { translateY: withSpring(isFocused ? -2 : 0, springs.gentle) },
      ],
    };
  });

  const animatedLabelStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isFocused ? 1 : 0.7, { duration: 200 }),
      transform: [{ scale: withSpring(isFocused ? 1 : 0.95, springs.gentle) }],
    };
  });

  const animatedDotStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isFocused ? 1 : 0, { duration: 200 }),
      transform: [{ scale: withSpring(isFocused ? 1 : 0, springs.bouncy) }],
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => {
        scale.value = withSpring(0.9, springs.stiff);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, springs.bouncy);
      }}
      style={styles.tabButton}
    >
      <Animated.View style={[styles.tabButtonInner, animatedIconStyle]}>
        {isFocused && (
          <View style={styles.activeBackground} />
        )}
        <Ionicons
          name={isFocused ? icon : `${icon}-outline`}
          size={22}
          color={isFocused ? palette.primary[600] : palette.neutral[400]}
        />
      </Animated.View>
      <Animated.Text style={[
        styles.tabLabel,
        isFocused && styles.tabLabelActive,
        animatedLabelStyle
      ]}>
        {label}
      </Animated.Text>
      <Animated.View style={[styles.activeDot, animatedDotStyle]} />
    </Pressable>
  );
};

/**
 * Custom Tab Bar Component
 */
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  
  const tabConfig = {
    Dashboard: { icon: 'home', label: 'Home' },
    Schedule: { icon: 'calendar', label: 'Schedule' },
    Subjects: { icon: 'library', label: 'Subjects' },
    Exams: { icon: 'ribbon', label: 'Exams' },
    Profile: { icon: 'person', label: 'Profile' },
  };

  return (
    <View style={[
      styles.tabBar, 
      { paddingBottom: Math.max(insets.bottom, space[2]) }
    ]}>
      <View style={styles.tabBarContent}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const config = tabConfig[route.name] || { icon: 'help', label: route.name };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <AnimatedTabButton
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              isFocused={isFocused}
              routeName={route.name}
              icon={config.icon}
              label={config.label}
            />
          );
        })}
      </View>
    </View>
  );
};

/**
 * 📱 Main App Navigator
 * Modern bottom tab navigation for students
 */
export default function MainNavigator() {
  return (
    <Tab.Navigator
      initialRouteName='Dashboard'
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={Dashboard}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Schedule" 
        component={Schedule}
        options={{ title: 'Schedule' }}
      />
      <Tab.Screen 
        name="Subjects" 
        component={Subjects}
        options={{ title: 'Subjects' }}
      />
      <Tab.Screen 
        name="Exams" 
        component={Exams}
        options={{ title: 'Exams' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: palette.neutral[200],
  },
  tabBarContent: {
    flexDirection: 'row',
    paddingTop: space[2],
    paddingHorizontal: space[1],
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space[1],
  },
  tabButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 28,
    borderRadius: radius.md,
  },
  activeBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: palette.primary[50],
    borderRadius: radius.md,
  },
  tabLabel: {
    fontSize: font.size.xxs,
    fontWeight: font.weight.medium,
    color: palette.neutral[400],
    marginTop: 2,
  },
  tabLabelActive: {
    color: palette.primary[600],
    fontWeight: font.weight.semibold,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.primary[500],
    marginTop: 3,
  },
});
