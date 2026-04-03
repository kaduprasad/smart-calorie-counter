import React, { useRef, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../../context/SettingsContext';
import { styles } from './styles/settingsScreenStyles';
import { UserInfoSection } from '../../components';
import { useFocusEffect } from '@react-navigation/native';
import { GoalsSection } from './GoalsSection';
import { ExerciseGoalSection } from './ExerciseGoalSection';
import { ReminderSection } from './ReminderSection';
import { AboutSection } from './AboutSection';
import { AccountSection } from './AccountSection';

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, []),
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="settings" size={28} color="#FF7B00" />
          <Text style={styles.title}> Settings</Text>
        </View>
        <Text style={styles.subtitle}>Customize your app</Text>
      </View>

      <ScrollView ref={scrollRef} style={styles.scrollView}>
        <AccountSection />

        <View style={styles.section}>
          <UserInfoSection />
        </View>

        <GoalsSection settings={settings} updateSettings={updateSettings} />
        <ExerciseGoalSection settings={settings} updateSettings={updateSettings} />
        <ReminderSection settings={settings} updateSettings={updateSettings} />
        <AboutSection />
      </ScrollView>
    </SafeAreaView>
  );
};
