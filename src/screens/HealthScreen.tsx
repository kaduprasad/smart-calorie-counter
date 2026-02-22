import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BMICalculator } from '../components';

export const HealthScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="heart" size={28} color="#FF7B00" />
          <Text style={styles.title}> Health</Text>
        </View>
        <Text style={styles.subtitle}>Track your health metrics</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* BMI Calculator */}
        <View style={styles.section}>
          <BMICalculator />
        </View>

        {/* Placeholder for future health tools */}
        <View style={styles.section}>
          <View style={styles.comingSoonCard}>
            <Ionicons name="fitness-outline" size={32} color="#D1D5DB" />
            <Text style={styles.comingSoonTitle}>More Health Tools</Text>
            <Text style={styles.comingSoonText}>
              Water intake tracker, sleep tracker, and more coming soon!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  comingSoonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderStyle: 'dashed',
  },
  comingSoonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 12,
  },
  comingSoonText: {
    fontSize: 13,
    color: '#D1D5DB',
    textAlign: 'center',
    marginTop: 4,
  },
});
