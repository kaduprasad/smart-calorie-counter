import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/context/AppContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import {
  setupNotificationListener,
  setupNotificationResponseListener,
} from './src/services/notifications';

const AppContent: React.FC = () => {
  const { isLoading } = useApp();

  useEffect(() => {
    // Setup notification listeners
    const unsubscribeReceived = setupNotificationListener((notification) => {
      console.log('Notification received:', notification);
    });

    const unsubscribeResponse = setupNotificationResponseListener((response) => {
      console.log('Notification response:', response);
    });

    return () => {
      unsubscribeReceived();
      unsubscribeResponse();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7B00" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
});
