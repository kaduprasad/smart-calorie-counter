import React, { useReducer, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { UserData } from '../types';
import { getUserData, saveUserData } from '../services/userDataService';
import { getLocalDateString } from '../utils/utils';

interface UserInfoSectionProps {
  onDataUpdate?: (userData: UserData) => void;
}

// Form state type
interface FormState {
  userData: UserData;
  ageInput: string;
  heightInput: string;
  weightInput: string;
  selectedGender: 'male' | 'female' | undefined;
  selectedActivityLevel: UserData['activityLevel'];
  isLoading: boolean;
  hasChanges: boolean;
  showBMRTooltip: boolean;
}

// Action types
type FormAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: { userData: UserData; ageInput: string; heightInput: string; weightInput: string } }
  | { type: 'LOAD_ERROR' }
  | { type: 'SET_GENDER'; payload: 'male' | 'female' }
  | { type: 'SET_AGE'; payload: string }
  | { type: 'SET_HEIGHT'; payload: string }
  | { type: 'SET_WEIGHT'; payload: string }
  | { type: 'SET_ACTIVITY'; payload: UserData['activityLevel'] }
  | { type: 'SAVE_SUCCESS'; payload: UserData }
  | { type: 'TOGGLE_BMR_TOOLTIP' }
  | { type: 'RESET_CHANGES' };

// Initial state
const initialState: FormState = {
  userData: {},
  ageInput: '',
  heightInput: '',
  weightInput: '',
  selectedGender: undefined,
  selectedActivityLevel: undefined,
  isLoading: true,
  hasChanges: false,
  showBMRTooltip: false,
};

// Reducer function - single place for all state logic
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, isLoading: true };
    case 'LOAD_SUCCESS':
      return {
        ...state,
        isLoading: false,
        userData: action.payload.userData,
        ageInput: action.payload.ageInput,
        heightInput: action.payload.heightInput,
        weightInput: action.payload.weightInput,
        selectedGender: action.payload.userData.gender,
        selectedActivityLevel: action.payload.userData.activityLevel,
        hasChanges: false,
      };
    case 'LOAD_ERROR':
      return { ...state, isLoading: false };
    case 'SET_GENDER':
      return { ...state, selectedGender: action.payload, hasChanges: true };
    case 'SET_AGE':
      return { ...state, ageInput: action.payload, hasChanges: true };
    case 'SET_HEIGHT':
      return { ...state, heightInput: action.payload, hasChanges: true };
    case 'SET_WEIGHT':
      return { ...state, weightInput: action.payload, hasChanges: true };
    case 'SET_ACTIVITY':
      return { ...state, selectedActivityLevel: action.payload, hasChanges: true };
    case 'SAVE_SUCCESS':
      return { ...state, userData: action.payload, hasChanges: false };
    case 'TOGGLE_BMR_TOOLTIP':
      return { ...state, showBMRTooltip: !state.showBMRTooltip };
    case 'RESET_CHANGES':
      return { ...state, hasChanges: false };
    default:
      return state;
  }
}

// Activity level options with user-friendly labels
const ACTIVITY_LEVELS: Array<{
  key: UserData['activityLevel'];
  label: string;
  description: string;
  icon: string;
}> = [
  {
    key: 'sedentary',
    label: 'Sedentary',
    description: 'Little to no exercise',
    icon: 'sofa',
  },
  {
    key: 'lightly_active',
    label: 'Desk Work',
    description: 'Light exercise 1-3 days/week',
    icon: 'laptop',
  },
  {
    key: 'moderately_active',
    label: 'On-Field',
    description: 'Moderate exercise 3-5 days/week',
    icon: 'walk',
  },
  {
    key: 'very_active',
    label: 'Active',
    description: 'Hard exercise 6-7 days/week',
    icon: 'run',
  },
  {
    key: 'extra_active',
    label: 'Athlete',
    description: 'Very hard exercise & physical job',
    icon: 'weight-lifter',
  },
];

// Helper to calculate age from date of birth
const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const UserInfoSection: React.FC<UserInfoSectionProps> = ({ onDataUpdate }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { userData, ageInput, heightInput, weightInput, selectedGender, selectedActivityLevel, isLoading, hasChanges, showBMRTooltip } = state;

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      dispatch({ type: 'LOAD_START' });
      try {
        const data = await getUserData();
        const ageStr = data.dateOfBirth ? calculateAge(data.dateOfBirth).toString() : '';
        const heightStr = data.height ? data.height.toString() : '';
        const weightStr = data.currentWeight ? data.currentWeight.toString() : '';
        dispatch({ type: 'LOAD_SUCCESS', payload: { userData: data, ageInput: ageStr, heightInput: heightStr, weightInput: weightStr } });
      } catch (error) {
        console.error('Error loading user data:', error);
        dispatch({ type: 'LOAD_ERROR' });
      }
    };
    loadUserData();
  }, []);

  // Memoized handlers to prevent unnecessary re-renders
  const handleGenderSelect = useCallback((gender: 'male' | 'female') => {
    dispatch({ type: 'SET_GENDER', payload: gender });
  }, []);

  const handleAgeChange = useCallback((text: string) => {
    dispatch({ type: 'SET_AGE', payload: text });
  }, []);

  const handleHeightChange = useCallback((text: string) => {
    dispatch({ type: 'SET_HEIGHT', payload: text });
  }, []);

  const handleWeightChange = useCallback((text: string) => {
    dispatch({ type: 'SET_WEIGHT', payload: text });
  }, []);

  const handleActivitySelect = useCallback((activityLevel: UserData['activityLevel']) => {
    dispatch({ type: 'SET_ACTIVITY', payload: activityLevel });
  }, []);

  const toggleBMRTooltip = useCallback(() => {
    dispatch({ type: 'TOGGLE_BMR_TOOLTIP' });
  }, []);

  const handleSaveProfile = useCallback(async () => {
    // Validate age if entered
    if (ageInput) {
      const age = parseInt(ageInput);
      if (isNaN(age) || age < 10 || age > 120) {
        Alert.alert('Invalid Age', 'Please enter age between 10 and 120');
        return;
      }
    }

    // Validate height if entered
    if (heightInput) {
      const height = parseFloat(heightInput);
      if (isNaN(height) || height < 50 || height > 300) {
        Alert.alert('Invalid Height', 'Please enter height between 50 and 300 cm');
        return;
      }
    }

    // Validate weight if entered
    if (weightInput) {
      const weight = parseFloat(weightInput);
      if (isNaN(weight) || weight < 20 || weight > 500) {
        Alert.alert('Invalid Weight', 'Please enter weight between 20 and 500 kg');
        return;
      }
    }

    try {
      const data = await getUserData();
      
      // Update gender
      if (selectedGender) {
        data.gender = selectedGender;
      }
      
      // Update age (as date of birth)
      if (ageInput) {
        const today = new Date();
        const birthYear = today.getFullYear() - parseInt(ageInput);
        data.dateOfBirth = `${birthYear}-01-01`;
      }

      // Update height
      if (heightInput) {
        data.height = parseFloat(heightInput);
      }

      // Update weight - handle initial vs current weight with dates
      if (weightInput) {
        const weight = parseFloat(weightInput);
        const today = getLocalDateString(new Date());
        
        // If no initial weight exists, set it as the starting point
        if (!data.initialWeight) {
          data.initialWeight = weight;
          data.initialWeightDate = today;
        }
        
        // Always update current weight
        data.currentWeight = weight;
        data.currentWeightDate = today;
      }
      
      // Update activity level
      if (selectedActivityLevel) {
        data.activityLevel = selectedActivityLevel;
      }
      
      await saveUserData(data);
      dispatch({ type: 'SAVE_SUCCESS', payload: data });
      onDataUpdate?.(data);
      Alert.alert('Success', 'Profile saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    }
  }, [ageInput, heightInput, weightInput, selectedGender, selectedActivityLevel, onDataUpdate]);

  // Calculate estimated BMR/TDEE from current form values
  const getEstimatedTDEE = useCallback((): number => {
    const height = heightInput ? parseFloat(heightInput) : 0;
    const weight = weightInput ? parseFloat(weightInput) : 0;
    const age = ageInput ? parseInt(ageInput) : 0;
    
    if (!height || !weight || !age || !selectedGender || !selectedActivityLevel) {
      return 0;
    }

    // Mifflin-St Jeor Equation for BMR
    let bmr: number;
    if (selectedGender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity multipliers
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extra_active: 1.9,
    };

    const multiplier = activityMultipliers[selectedActivityLevel] || 1.2;
    return Math.round(bmr * multiplier);
  }, [heightInput, weightInput, ageInput, selectedGender, selectedActivityLevel]);

  const estimatedTDEE = getEstimatedTDEE();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="person" size={24} color="#3B82F6" />
        </View>
        <View>
          <Text style={styles.title}>Your Profile</Text>
          <Text style={styles.subtitle}>For personalized calculations</Text>
        </View>
      </View>

      {/* Gender Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Gender</Text>
        <View style={styles.genderRow}>
          <TouchableOpacity
            style={[
              styles.genderBtn,
              selectedGender === 'male' && styles.genderBtnActive,
            ]}
            onPress={() => handleGenderSelect('male')}
          >
            <MaterialCommunityIcons
              name="gender-male"
              size={28}
              color={selectedGender === 'male' ? '#FFFFFF' : '#3B82F6'}
            />
            <Text
              style={[
                styles.genderLabel,
                selectedGender === 'male' && styles.genderLabelActive,
              ]}
            >
              Male
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.genderBtn,
              selectedGender === 'female' && styles.genderBtnFemaleActive,
            ]}
            onPress={() => handleGenderSelect('female')}
          >
            <MaterialCommunityIcons
              name="gender-female"
              size={28}
              color={selectedGender === 'female' ? '#FFFFFF' : '#EC4899'}
            />
            <Text
              style={[
                styles.genderLabel,
                selectedGender === 'female' && styles.genderLabelActive,
              ]}
            >
              Female
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Age Input */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Age</Text>
        <View style={styles.ageRow}>
          <TextInput
            style={styles.ageInput}
            value={ageInput}
            onChangeText={handleAgeChange}
            keyboardType="number-pad"
            placeholder="25"
            placeholderTextColor="#BBBBBB"
            maxLength={3}
          />
          <Text style={styles.ageUnit}>years</Text>
        </View>
      </View>

      {/* Height & Weight Row */}
      <View style={styles.section}>
        <View style={styles.measurementsRow}>
          <View style={styles.measurementField}>
            <Text style={styles.sectionLabel}>Height (cm)</Text>
            <TextInput
              style={styles.measurementInput}
              value={heightInput}
              onChangeText={handleHeightChange}
              keyboardType="decimal-pad"
              placeholder="170"
              placeholderTextColor="#BBBBBB"
              maxLength={5}
            />
          </View>
          <View style={styles.measurementField}>
            <Text style={styles.sectionLabel}>Weight (kg)</Text>
            <TextInput
              style={styles.measurementInput}
              value={weightInput}
              onChangeText={handleWeightChange}
              keyboardType="decimal-pad"
              placeholder="70"
              placeholderTextColor="#BBBBBB"
              maxLength={5}
            />
          </View>
        </View>
      </View>

      {/* Activity Level */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Activity Level</Text>
        <View style={styles.activityGrid}>
          {ACTIVITY_LEVELS.map((level) => (
            <TouchableOpacity
              key={level.key}
              style={[
                styles.activityBtn,
                selectedActivityLevel === level.key && styles.activityBtnActive,
              ]}
              onPress={() => handleActivitySelect(level.key)}
            >
              <MaterialCommunityIcons
                name={level.icon as any}
                size={24}
                color={selectedActivityLevel === level.key ? '#FFFFFF' : '#4CAF50'}
              />
              <Text
                style={[
                  styles.activityLabel,
                  selectedActivityLevel === level.key && styles.activityLabelActive,
                ]}
              >
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedActivityLevel && (
          <Text style={styles.activityDescription}>
            {ACTIVITY_LEVELS.find((l) => l.key === selectedActivityLevel)?.description}
          </Text>
        )}
      </View>

      {/* Estimated Daily Calories (BMR/TDEE) - shown when all fields are filled */}
      {estimatedTDEE > 0 && (
        <View style={styles.bmrSection}>
          <View style={styles.bmrBox}>
            <MaterialCommunityIcons name="fire" size={24} color="#FF5722" />
            <View style={styles.bmrTextContainer}>
              <View style={styles.bmrLabelRow}>
                <Text style={styles.bmrLabel}>Est. Total Daily Energy Expenditure</Text>
                <TouchableOpacity onPress={toggleBMRTooltip} style={styles.infoBtn}>
                  <Ionicons name="information-circle-outline" size={18} color="#888" />
                </TouchableOpacity>
              </View>
              <Text style={styles.bmrValue}>{estimatedTDEE} kcal/day</Text>
            </View>
          </View>
          {showBMRTooltip && (
            <View style={styles.bmrTooltip}>
              <Text style={styles.bmrTooltipText}>
                <Text style={styles.bmrTooltipBold}>BMR (Basal Metabolic Rate)</Text> is the calories your body burns at rest. 
                Combined with your activity level, we calculate <Text style={styles.bmrTooltipBold}>TDEE (Total Daily Energy Expenditure)</Text> - the total calories you need daily to maintain your current weight.
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Save Profile Button */}
      <TouchableOpacity 
        style={[styles.saveProfileBtn, !hasChanges && styles.saveProfileBtnDisabled]} 
        onPress={handleSaveProfile}
        disabled={!hasChanges}
      >
        <MaterialCommunityIcons name="content-save" size={20} color="#FFFFFF" />
        <Text style={styles.saveProfileBtnText}>Save Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

// Calculate TDEE (Total Daily Energy Expenditure)
const calculateTDEE = (userData: UserData): number => {
  if (!userData.height || !userData.currentWeight || !userData.gender || 
      !userData.dateOfBirth || !userData.activityLevel) {
    return 0;
  }

  // Calculate age
  const today = new Date();
  const birthDate = new Date(userData.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  // Mifflin-St Jeor Equation for BMR
  let bmr: number;
  if (userData.gender === 'male') {
    bmr = 10 * userData.currentWeight + 6.25 * userData.height - 5 * age + 5;
  } else {
    bmr = 10 * userData.currentWeight + 6.25 * userData.height - 5 * age - 161;
  }

  // Activity multipliers
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
  };

  const multiplier = activityMultipliers[userData.activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
};

// Export TDEE calculation for use in other components
export { calculateTDEE };

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  loadingText: {
    color: '#6B7280',
    textAlign: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    gap: 8,
  },
  genderBtnActive: {
    backgroundColor: '#3B82F6',
  },
  genderBtnFemaleActive: {
    backgroundColor: '#EC4899',
  },
  genderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  genderLabelActive: {
    color: '#FFFFFF',
  },
  ageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ageInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  ageUnit: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  saveBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  activityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#F0FDF4',
    gap: 6,
  },
  activityBtnActive: {
    backgroundColor: '#4CAF50',
  },
  activityLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#166534',
  },
  activityLabelActive: {
    color: '#FFFFFF',
  },
  activityDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    fontStyle: 'italic',
  },
  measurementsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  measurementField: {
    flex: 1,
  },
  measurementInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  bmrSection: {
    marginBottom: 8,
  },
  bmrBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  bmrTextContainer: {
    flex: 1,
  },
  bmrLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bmrLabel: {
    fontSize: 12,
    color: '#888888',
  },
  infoBtn: {
    padding: 2,
  },
  bmrValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF5722',
  },
  bmrTooltip: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  bmrTooltipText: {
    fontSize: 12,
    color: '#555555',
    lineHeight: 18,
  },
  bmrTooltipBold: {
    fontWeight: '700',
    color: '#333333',
  },
  saveProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  saveProfileBtnDisabled: {
    backgroundColor: '#9CA3AF',
  },
  saveProfileBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
