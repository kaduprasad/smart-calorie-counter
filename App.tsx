import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/context/AppContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SplashScreen } from './src/components';
import {
  setupNotificationListener,
  setupNotificationResponseListener,
} from './src/services/notifications';

const MIN_SPLASH_DURATION = 2000; // Minimum time to show splash screen (ms)

const AppContent: React.FC = () => {
  const { isLoading: isDataLoading } = useApp();
  const [showSplash, setShowSplash] = useState(true);
  const [splashTimerDone, setSplashTimerDone] = useState(false);

  useEffect(() => {
    // Setup notification listeners
    const unsubscribeReceived = setupNotificationListener((notification) => {
      console.log('Notification received:', notification);
    });

    const unsubscribeResponse = setupNotificationResponseListener((response) => {
      console.log('Notification response:', response);
    });

    // Minimum splash duration timer
    const timer = setTimeout(() => {
      setSplashTimerDone(true);
    }, MIN_SPLASH_DURATION);

    return () => {
      unsubscribeReceived();
      unsubscribeResponse();
      clearTimeout(timer);
    };
  }, []);

  // Hide splash when both data is loaded AND minimum time has passed
  useEffect(() => {
    if (!isDataLoading && splashTimerDone) {
      // Small delay for smooth transition
      const hideTimer = setTimeout(() => {
        setShowSplash(false);
      }, 300);
      return () => clearTimeout(hideTimer);
    }
  }, [isDataLoading, splashTimerDone]);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator />
    </>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </SafeAreaProvider>
  );
}
