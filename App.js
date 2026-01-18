import { StyleSheet, View, SafeAreaView, ActivityIndicator, StatusBar as RNStatusBar, Platform} from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/store';
import { palette } from './src/constants/Theme';
import MainNavigator from './src/navigation/MainNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SystemBars } from 'react-native-edge-to-edge';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { migrateToStudyPlanner } from './src/utils/migration';
import { ToastProvider } from '@/components/UI';
import { getDataLocalStorage } from '@/utils/storage';
import { setGrades, setSemesters, setCurrentSemester } from '@/store/Grade/grade';
import { setSettings } from '@/store/Settings/settings';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

/**
 * Main application component that sets up the app environment
 * including fonts, state providers, and navigation with dark theme
 */
export default function App() {
  // Load custom fonts
  const [fontsLoaded, fontError] = useFonts({
    'NicoMoji-Regular': require('./src/assets/fonts/NicoMoji-Regular.ttf'),
  });

  // Hide splash screen once fonts are loaded or if there's an error
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  // Initialize edge-to-edge for Android
  useEffect(() => {
    if (Platform.OS === 'android') {
      SystemBars.setHidden(false);
    }
  }, []);

  // Don't render until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
          <Provider store={store}>
            <ToastProvider>
              <RNStatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
              <View style={styles.container}>
                {fontsLoaded ? (
                  <NavigationContainer>
                    <AppNavigator />
                  </NavigationContainer>
                ) : (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={palette.primary[500]} />
                  </View>
                )}
              </View>
            </ToastProvider>
          </Provider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

/**
 * AppNavigator component - runs migration and displays main app
 */
const AppNavigator = () => {
  const [isReady, setIsReady] = useState(false);
  const dispatch = useDispatch();

  // Run migration and load additional data on app startup
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 1. Run migration
        console.log('[App] Running data migration...');
        const result = await migrateToStudyPlanner();
        if (result.success) {
          if (result.alreadyMigrated) {
            console.log('[App] Data already migrated');
          } else {
            console.log('[App] Migration completed successfully:', result.stats);
          }
        } else {
          console.error('[App] Migration failed:', result.error);
        }

        // 2. Load grades data
        console.log('[App] Loading grades data...');
        const [grades, semesters, currentSemester] = await Promise.all([
          getDataLocalStorage('grades'),
          getDataLocalStorage('semesters'),
          getDataLocalStorage('current_semester'),
        ]);
        
        if (grades) dispatch(setGrades(grades));
        if (semesters) dispatch(setSemesters(semesters));
        if (currentSemester) dispatch(setCurrentSemester(currentSemester));

        // 3. Load app settings
        console.log('[App] Loading settings...');
        const settings = await getDataLocalStorage('app_settings');
        if (settings) dispatch(setSettings(settings));

      } catch (error) {
        console.error('[App] Error during initialization:', error);
      } finally {
        setIsReady(true);
      }
    };

    initializeApp();
  }, [dispatch]);

  // Show loading indicator while migration runs
  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={palette.primary[500]} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MainNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.gray[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.gray[50],
  },
});
