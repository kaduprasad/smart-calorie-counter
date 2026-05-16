import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NumericInput } from './NumericInput';
import { UserData } from '../types';
import { saveUserData, getUserData } from '../services/userDataService';
import { useSettings } from '../context/SettingsContext';
import { STORAGE_KEYS, VALIDATION } from '../common/constants';
import { COLORS } from '../common/colors';
import { getLocalDateString } from '../utils/utils';
import { onboardingModalStyles as styles } from './styles/onboardingModalStyles';

const ONBOARDING_COMPLETE_KEY = 'onboarding_complete';

const ACTIVITY_LEVELS: { value: UserData['activityLevel']; label: string; desc: string }[] = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
  { value: 'lightly_active', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
  { value: 'moderately_active', label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
  { value: 'very_active', label: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
  { value: 'extra_active', label: 'Extra Active', desc: 'Very hard exercise, physical job' },
];

interface OnboardingModalProps {
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(false);
  const { settings, updateSettings, setGender } = useSettings();

  // Form state
  const [gender, setGenderState] = useState<'male' | 'female' | undefined>(undefined);
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<UserData['activityLevel']>(undefined);
  const [calorieGoal, setCalorieGoal] = useState(settings.dailyCalorieGoal.toString());

  useEffect(() => {
    checkShouldShow();
  }, []);

  const checkShouldShow = async () => {
    try {
      const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
      if (completed) return; // Already completed onboarding

      // Also check if user already has data (app upgrade case)
      const userData = await getUserData();
      if (userData.currentWeight || userData.height || userData.gender) {
        // User already has data, mark onboarding as done
        await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
        return;
      }

      setVisible(true);
    } catch {
      // Silently fail — don't block user
    }
  };

  const handleSave = useCallback(async () => {
    const today = getLocalDateString(new Date());
    const userData: UserData = {};

    if (gender) {
      userData.gender = gender;
      setGender(gender);
    }

    if (age) {
      const ageNum = parseInt(age);
      if (ageNum >= VALIDATION.AGE.MIN && ageNum <= VALIDATION.AGE.MAX) {
        // Store as birth year approximation
        const birthYear = new Date().getFullYear() - ageNum;
        userData.dateOfBirth = `${birthYear}-01-01`;
      }
    }

    if (height) {
      const heightNum = parseFloat(height);
      if (heightNum >= VALIDATION.HEIGHT_CM.MIN && heightNum <= VALIDATION.HEIGHT_CM.MAX) {
        userData.height = heightNum;
      }
    }

    if (weight) {
      const weightNum = parseFloat(weight);
      if (weightNum >= VALIDATION.WEIGHT_KG.MIN && weightNum <= VALIDATION.WEIGHT_KG.MAX) {
        userData.initialWeight = weightNum;
        userData.initialWeightDate = today;
        userData.currentWeight = weightNum;
        userData.currentWeightDate = today;
      }
    }

    if (activityLevel) {
      userData.activityLevel = activityLevel;
    }

    // Save user data
    await saveUserData(userData);

    // Save calorie goal if changed
    const goalNum = parseInt(calorieGoal);
    if (!isNaN(goalNum) && goalNum >= VALIDATION.CALORIE_GOAL.MIN && goalNum <= VALIDATION.CALORIE_GOAL.MAX) {
      await updateSettings({ ...settings, dailyCalorieGoal: goalNum });
    }

    // Mark onboarding complete
    await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
    setVisible(false);
    onComplete();
  }, [gender, age, height, weight, activityLevel, calorieGoal, settings, updateSettings, setGender, onComplete]);

  const handleSkip = useCallback(async () => {
    await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
    setVisible(false);
    onComplete();
  }, [onComplete]);

  const hasMinimumData = !!(gender && weight);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <MaterialCommunityIcons name="food-apple" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Welcome! Let's set you up</Text>
            <Text style={styles.headerSubtitle}>
              This helps us calculate accurate calorie & macro targets
            </Text>
          </View>

          {/* Form */}
          <ScrollView
            style={{ maxHeight: 400 }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            persistentScrollbar={true}
          >
            {/* Gender */}
            <Text style={[styles.sectionLabel, styles.sectionLabelFirst]}>Gender *</Text>
            <View style={styles.genderRow}>
              <TouchableOpacity
                style={[styles.genderBtn, gender === 'male' && styles.genderBtnActive]}
                onPress={() => setGenderState('male')}
              >
                <Ionicons
                  name="male"
                  size={18}
                  color={gender === 'male' ? COLORS.primary : COLORS.textSecondary}
                />
                <Text style={[styles.genderBtnText, gender === 'male' && styles.genderBtnTextActive]}>
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderBtn, gender === 'female' && styles.genderBtnActive]}
                onPress={() => setGenderState('female')}
              >
                <Ionicons
                  name="female"
                  size={18}
                  color={gender === 'female' ? COLORS.primary : COLORS.textSecondary}
                />
                <Text style={[styles.genderBtnText, gender === 'female' && styles.genderBtnTextActive]}>
                  Female
                </Text>
              </TouchableOpacity>
            </View>

            {/* Age */}
            <Text style={styles.sectionLabel}>Age</Text>
            <View style={styles.inputRow}>
              <NumericInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                allowDecimal={false}
                maxLength={3}
                placeholder="e.g. 28"
                placeholderTextColor={COLORS.textPlaceholder}
              />
              <Text style={styles.inputUnit}>years</Text>
            </View>

            {/* Height */}
            <Text style={styles.sectionLabel}>Height</Text>
            <View style={styles.inputRow}>
              <NumericInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                allowDecimal={true}
                maxDecimalPlaces={1}
                maxLength={5}
                placeholder="e.g. 170"
                placeholderTextColor={COLORS.textPlaceholder}
              />
              <Text style={styles.inputUnit}>cm</Text>
            </View>

            {/* Weight */}
            <Text style={styles.sectionLabel}>Current Weight *</Text>
            <View style={styles.inputRow}>
              <NumericInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                allowDecimal={true}
                maxDecimalPlaces={1}
                maxLength={5}
                placeholder="e.g. 70"
                placeholderTextColor={COLORS.textPlaceholder}
              />
              <Text style={styles.inputUnit}>kg</Text>
            </View>

            {/* Activity Level */}
            <Text style={styles.sectionLabel}>Activity Level</Text>
            <View style={styles.activityGrid}>
              {ACTIVITY_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level.value}
                  style={[styles.activityBtn, activityLevel === level.value && styles.activityBtnActive]}
                  onPress={() => setActivityLevel(level.value)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.activityBtnText, activityLevel === level.value && styles.activityBtnTextActive]}>
                      {level.label}
                    </Text>
                    <Text style={styles.activityBtnDesc}>{level.desc}</Text>
                  </View>
                  {activityLevel === level.value && (
                    <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Calorie Goal */}
            <Text style={styles.sectionLabel}>Daily Calorie Goal</Text>
            <View style={styles.inputRow}>
              <NumericInput
                style={styles.input}
                value={calorieGoal}
                onChangeText={setCalorieGoal}
                allowDecimal={false}
                maxLength={5}
                placeholder="2000"
                placeholderTextColor={COLORS.textPlaceholder}
              />
              <Text style={styles.inputUnit}>cal/day</Text>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.saveBtn, !hasMinimumData && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={!hasMinimumData}
              activeOpacity={0.8}
            >
              <Text style={[styles.saveBtnText, !hasMinimumData && styles.saveBtnTextDisabled]}>
                Get Started
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
              <Text style={styles.skipBtnText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
