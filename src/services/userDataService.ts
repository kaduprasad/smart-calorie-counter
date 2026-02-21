import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserData, BMIResult } from '../types';
import { getLocalDateString } from '../utils/utils';

const USER_DATA_KEY = 'user_data';

/**
 * Get user data from storage
 */
export const getUserData = async (): Promise<UserData> => {
  try {
    const data = await AsyncStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting user data:', error);
    return {};
  }
};

/**
 * Save user data to storage
 */
export const saveUserData = async (userData: UserData): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

/**
 * Update user's height
 */
export const updateHeight = async (height: number): Promise<UserData> => {
  const userData = await getUserData();
  userData.height = height;
  await saveUserData(userData);
  return userData;
};

/**
 * Update user's weight - handles initial vs current weight logic
 * If no initial weight exists, sets both initial and current
 * Otherwise, only updates current weight
 */
export const updateWeight = async (weight: number): Promise<UserData> => {
  const userData = await getUserData();
  const today = getLocalDateString(new Date());

  if (!userData.initialWeight) {
    // First time setting weight - set as initial
    userData.initialWeight = weight;
    userData.initialWeightDate = today;
  }

  // Always update current weight
  userData.currentWeight = weight;
  userData.currentWeightDate = today;

  await saveUserData(userData);
  return userData;
};

/**
 * Reset initial weight (useful if user wants to start fresh)
 */
export const resetInitialWeight = async (): Promise<UserData> => {
  const userData = await getUserData();
  const today = getLocalDateString(new Date());

  if (userData.currentWeight) {
    userData.initialWeight = userData.currentWeight;
    userData.initialWeightDate = today;
  }

  await saveUserData(userData);
  return userData;
};

/**
 * Update user's gender
 */
export const updateGender = async (gender: 'male' | 'female'): Promise<UserData> => {
  const userData = await getUserData();
  userData.gender = gender;
  await saveUserData(userData);
  return userData;
};

/**
 * Update user's date of birth
 */
export const updateDateOfBirth = async (dateOfBirth: string): Promise<UserData> => {
  const userData = await getUserData();
  userData.dateOfBirth = dateOfBirth;
  await saveUserData(userData);
  return userData;
};

/**
 * Update user's activity level
 */
export const updateActivityLevel = async (
  activityLevel: UserData['activityLevel']
): Promise<UserData> => {
  const userData = await getUserData();
  userData.activityLevel = activityLevel;
  await saveUserData(userData);
  return userData;
};

/**
 * Calculate BMI from height and weight
 * @param heightCm - Height in centimeters
 * @param weightKg - Weight in kilograms
 * @returns BMI result with category and healthy weight range
 */
export const calculateBMI = (heightCm: number, weightKg: number): BMIResult | null => {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
    return null;
  }

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const roundedBMI = Math.round(bmi * 10) / 10;

  // Determine BMI category
  let category: BMIResult['category'];
  if (bmi < 18.5) {
    category = 'underweight';
  } else if (bmi < 25) {
    category = 'normal';
  } else if (bmi < 30) {
    category = 'overweight';
  } else {
    category = 'obese';
  }

  // Calculate healthy weight range (BMI 18.5 - 24.9)
  const healthyWeightMin = Math.round(18.5 * heightM * heightM * 10) / 10;
  const healthyWeightMax = Math.round(24.9 * heightM * heightM * 10) / 10;

  return {
    bmi: roundedBMI,
    category,
    healthyWeightRange: {
      min: healthyWeightMin,
      max: healthyWeightMax,
    },
  };
};

/**
 * Get BMI category display info
 */
export const getBMICategoryInfo = (category: BMIResult['category']) => {
  const categoryInfo = {
    underweight: {
      label: 'Underweight',
      color: '#3B82F6', // Blue
      description: 'Below normal weight range',
    },
    normal: {
      label: 'Normal',
      color: '#10B981', // Green
      description: 'Healthy weight range',
    },
    overweight: {
      label: 'Overweight',
      color: '#F59E0B', // Orange
      description: 'Above normal weight range',
    },
    obese: {
      label: 'Obese',
      color: '#EF4444', // Red
      description: 'Significantly above normal range',
    },
  };

  return categoryInfo[category];
};

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dateOfBirth: string): number | null => {
  if (!dateOfBirth) return null;

  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

/**
 * Calculate weight change from initial weight
 */
export const getWeightChange = (userData: UserData): { change: number; percentage: number } | null => {
  if (!userData.initialWeight || !userData.currentWeight) {
    return null;
  }

  const change = Math.round((userData.currentWeight - userData.initialWeight) * 10) / 10;
  const percentage = Math.round((change / userData.initialWeight) * 1000) / 10;

  return { change, percentage };
};
