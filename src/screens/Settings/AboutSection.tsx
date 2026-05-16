import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { APP_NAME } from '../../common/constants';
import { styles } from './styles/settingsScreenStyles';

export const AboutSection: React.FC = () => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionTitleRow}>
        <Ionicons name="information-circle" size={18} color="#FF7B00" />
        <Text style={styles.sectionTitleInRow}>About</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.aboutTitleRow}>
          <Ionicons name="restaurant" size={20} color="#FF7B00" />
          <Text style={styles.aboutText}>{APP_NAME}</Text>
        </View>
        <Text style={styles.aboutDescription}>
          Track your daily food intake with a comprehensive database of Indian dishes
          specializing in Maharashtrian foods.
        </Text>
        <View style={styles.features}>
          {[
            '1030+ Indian & international food items',
            '370+ remote food database (auto-updated)',
            '16 food categories',
            'USDA online food search with macros',
            'Recipe builder from 120+ ingredients',
            'BMR, TDEE & BMI calculator',
            'Exercise tracking (30+ types)',
            'Net calorie tracking',
            'Voice input for food logging',
            'Weight tracking with charts',
            'Custom dish creation',
            'First-time onboarding setup',
            'History & statistics',
            'Daily reminders',
          ].map((feature) => (
            <View key={feature} style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.featureItem}>{feature}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.disclaimer}>
          Disclaimer: Nutritional values are approximate and may vary based on
          preparation methods, portion sizes, and ingredient brands. This app is
          intended for general tracking purposes only and should not be used as a
          substitute for professional dietary or medical advice.
        </Text>
      </View>
    </View>
  );
};
