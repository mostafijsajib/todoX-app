import { StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HelpAndFeedback from '../Browse/HelpAndFeedback';
import ProfileMenu from '../Browse/ProfileMenu';
import Settings from '../Browse/Settings';
import CompletedTask from '../Browse/CompletedTask';
import PrivacyPolicy from '../Browse/PrivacyPolicy';
import Grades from '../Browse/Grades';
import Timeline from './Timeline';
import { palette } from '@/constants/Theme';

const Stack = createNativeStackNavigator();

/**
 * Profile/More navigation component with stack navigator
 * Handles navigation between profile menu screens
 */
export default function More() {
  return (
    <View style={styles.container}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ProfileMenu" component={ProfileMenu} />
        <Stack.Screen name="HelpAndFeedback" component={HelpAndFeedback} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="CompletedTask" component={CompletedTask} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="Grades" component={Grades} />
        <Stack.Screen name="Timeline" component={Timeline} />
      </Stack.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.neutral[50],
  },
});
