import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NumericInput } from '../../components/NumericInput';
import { AnimatedSaveButton } from '../../components/AnimatedSaveButton';
import { AppSettings } from '../../types';
import { VALIDATION } from '../../common/constants';
import { styles } from './styles/settingsScreenStyles';

interface ExerciseGoalSectionProps {
  settings: AppSettings;
  updateSettings: (settings: AppSettings) => Promise<void>;
}

export const ExerciseGoalSection: React.FC<ExerciseGoalSectionProps> = ({ settings, updateSettings }) => {
  const [exerciseGoal, setExerciseGoal] = useState(settings.exerciseCalorieGoal.toString());

  const handleSave = async (): Promise<boolean> => {
    const goalNum = parseInt(exerciseGoal);
    if (isNaN(goalNum) || goalNum < VALIDATION.EXERCISE_GOAL.MIN || goalNum > VALIDATION.EXERCISE_GOAL.MAX) {
      Alert.alert('Invalid Goal', `Please enter a goal between ${VALIDATION.EXERCISE_GOAL.MIN} and ${VALIDATION.EXERCISE_GOAL.MAX} calories`);
      return false;
    }
    await updateSettings({ ...settings, exerciseCalorieGoal: goalNum });
    return true;
  };

  return (
    <View style={styles.section}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardIconContainer, { backgroundColor: '#E8F5E9' }]}>
            <MaterialCommunityIcons name="run-fast" size={20} color="#4CAF50" />
          </View>
          <Text style={styles.cardTitle}>Exercise Goal</Text>
        </View>
        <Text style={styles.goalDescription}>
          Daily calorie burn target from workouts
        </Text>
        <View style={styles.exerciseGoalRow}>
            <NumericInput
              style={styles.exerciseGoalInput}
              value={exerciseGoal}
              onChangeText={setExerciseGoal}
              allowDecimal={false}
              placeholder="300"
            />
            <Text style={styles.exerciseGoalUnit}>cal</Text>
          </View>
        <AnimatedSaveButton onSave={handleSave} color="#4CAF50" style={{ marginTop: 10, borderRadius: 12 }} />
        <Text style={styles.goalCardHint}>
          Target: {settings.exerciseCalorieGoal} cal/day
        </Text>
      </View>
    </View>
  );
};
