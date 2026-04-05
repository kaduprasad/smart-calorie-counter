import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NumericInput } from '../../components/NumericInput';
import { AnimatedSaveButton } from '../../components/AnimatedSaveButton';
import { AppSettings } from '../../types';
import { VALIDATION } from '../../common/constants';
import { styles } from './styles/settingsScreenStyles';

interface GoalsSectionProps {
  settings: AppSettings;
  updateSettings: (settings: AppSettings) => Promise<void>;
}

export const GoalsSection: React.FC<GoalsSectionProps> = ({ settings, updateSettings }) => {
  const [calorieGoal, setCalorieGoal] = useState(settings.dailyCalorieGoal.toString());
  const [weightGoal, setWeightGoal] = useState(settings.weightGoal?.toString() || '');

  const handleSaveCalorieGoal = async (): Promise<boolean> => {
    const goalNum = parseInt(calorieGoal);
    if (isNaN(goalNum) || goalNum < VALIDATION.CALORIE_GOAL.MIN || goalNum > VALIDATION.CALORIE_GOAL.MAX) {
      Alert.alert('Invalid Goal', `Please enter a goal between ${VALIDATION.CALORIE_GOAL.MIN} and ${VALIDATION.CALORIE_GOAL.MAX} calories`);
      return false;
    }
    await updateSettings({ ...settings, dailyCalorieGoal: goalNum });
    return true;
  };

  const handleSaveWeightGoal = async (): Promise<boolean> => {
    if (!weightGoal) {
      await updateSettings({ ...settings, weightGoal: undefined });
      return true;
    }
    const goalNum = parseFloat(weightGoal);
    if (isNaN(goalNum) || goalNum < VALIDATION.WEIGHT_GOAL.MIN || goalNum > VALIDATION.WEIGHT_GOAL.MAX) {
      Alert.alert('Invalid Goal', `Please enter a weight between ${VALIDATION.WEIGHT_GOAL.MIN} and ${VALIDATION.WEIGHT_GOAL.MAX} kg`);
      return false;
    }
    await updateSettings({ ...settings, weightGoal: goalNum });
    return true;
  };

  return (
    <View style={styles.goalsRow}>
      <View style={styles.goalCard}>
        <View style={styles.goalCardHeader}>
          <View style={styles.goalCardIcon}>
            <MaterialCommunityIcons name="target" size={16} color="#FF7B00" />
          </View>
          <Text style={styles.goalCardLabel}>Calorie{'\n'}Goal</Text>
        </View>
        <View style={{ alignSelf: 'stretch' }}>
          <View style={styles.goalCardInputRow}>
            <NumericInput
              style={styles.goalCardInput}
              value={calorieGoal}
              onChangeText={setCalorieGoal}
              allowDecimal={false}
              placeholder="2000"
            />
            <Text style={styles.goalCardUnit}>cal</Text>
          </View>
          <AnimatedSaveButton onSave={handleSaveCalorieGoal} style={{ marginTop: 10, borderRadius: 12 }} />
        </View>
        <Text style={styles.goalCardHint}>
          Target: {settings.dailyCalorieGoal} cal
        </Text>
      </View>

      <View style={styles.goalCard}>
        <View style={styles.goalCardHeader}>
          <View style={styles.goalCardIcon}>
            <MaterialCommunityIcons name="scale-bathroom" size={16} color="#FF7B00" />
          </View>
          <Text style={styles.goalCardLabel}>Weight{'\n'}Goal</Text>
        </View>
        <View style={{ alignSelf: 'stretch' }}>
          <View style={styles.goalCardInputRow}>
            <NumericInput
              style={styles.goalCardInput}
              value={weightGoal}
              onChangeText={setWeightGoal}
              allowDecimal={true}
              maxDecimalPlaces={1}
              placeholder="70"
            />
            <Text style={styles.goalCardUnit}>kg</Text>
          </View>
          <AnimatedSaveButton onSave={handleSaveWeightGoal} style={{ marginTop: 10, borderRadius: 12 }} />
        </View>
        <Text style={styles.goalCardHint}>
          {settings.weightGoal ? `Target: ${settings.weightGoal} kg` : 'Set your target'}
        </Text>
      </View>
    </View>
  );
};
