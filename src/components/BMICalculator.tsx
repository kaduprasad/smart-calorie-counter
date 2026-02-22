import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { NumericInput } from './NumericInput';
import { UserData, BMIResult } from '../types';
import {
  getUserData,
  updateHeight,
  calculateBMI,
  getBMICategoryInfo,
} from '../services/userDataService';
import { styles } from './styles/bmiCalculatorStyles';

interface BMICalculatorProps {
  onDataUpdate?: (userData: UserData) => void;
}

export const BMICalculator: React.FC<BMICalculatorProps> = ({ onDataUpdate }) => {
  const [userData, setUserData] = useState<UserData>({});
  const [heightInput, setHeightInput] = useState('');
  const [weightInput, setWeightInput] = useState(''); // Temporary weight for BMI calculation only
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  // Calculate BMI from input fields (not from saved data)
  const bmiResult = useMemo(() => {
    const height = parseFloat(heightInput);
    const weight = parseFloat(weightInput);
    
    if (height && weight && height >= 50 && height <= 300 && weight >= 20 && weight <= 500) {
      return calculateBMI(height, weight);
    }
    return null;
  }, [heightInput, weightInput]);

  const loadUserData = async () => {
    try {
      const data = await getUserData();
      setUserData(data);
      setHeightInput(data.height?.toString() || '');
      // Pre-fill weight input with current weight for reference
      setWeightInput(data.currentWeight?.toString() || '');
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveHeight = async () => {
    const height = parseFloat(heightInput);

    if (isNaN(height) || height < 50 || height > 300) {
      Alert.alert('Invalid Height', 'Please enter height between 50 and 300 cm');
      return;
    }

    try {
      const updated = await updateHeight(height);
      setUserData(updated);
      onDataUpdate?.(updated);
      Alert.alert('Success', `Height saved: ${height} cm`);
    } catch (error) {
      Alert.alert('Error', 'Failed to save height');
    }
  };

  // Calculate weight change: Profile weight (from settings) vs BMI input weight
  const getWeightProgress = () => {
    const profileWeight = userData.currentWeight;
    const bmiInputWeight = parseFloat(weightInput);
    
    if (!profileWeight || isNaN(bmiInputWeight) || bmiInputWeight <= 0) {
      return null;
    }
    
    const change = Math.round((bmiInputWeight - profileWeight) * 10) / 10;
    const percentage = Math.round((change / profileWeight) * 1000) / 10;
    
    return {
      profileWeight,
      bmiInputWeight,
      change,
      percentage,
    };
  };

  const weightProgress = getWeightProgress();
  const categoryInfo = bmiResult ? getBMICategoryInfo(bmiResult.category) : null;

  // Calculate BMI position on scale (BMI 15-40 range for display)
  const getBMIScalePosition = (bmi: number) => {
    const minBMI = 15;
    const maxBMI = 40;
    return Math.max(0, Math.min(100, ((bmi - minBMI) / (maxBMI - minBMI)) * 100));
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="human" size={24} color="#8B5CF6" />
        </View>
        <View>
          <Text style={styles.title}>BMI Calculator</Text>
          <Text style={styles.subtitle}>Track your body mass index</Text>
        </View>
      </View>

      {/* Input Section */}
      <View style={styles.inputSection}>
        {/* Height Input */}
        <View style={styles.inputGroup}>
          <View style={styles.inputLabelRow}>
            <MaterialCommunityIcons name="human-male-height" size={18} color="#6B7280" />
            <Text style={styles.inputLabel}>Height</Text>
          </View>
          <View style={styles.inputRow}>
            <NumericInput
              style={styles.input}
              value={heightInput}
              onChangeText={setHeightInput}
              allowDecimal={true}
              maxDecimalPlaces={1}
              placeholder="170"
              placeholderTextColor="#9CA3AF"
            />
            <Text style={styles.unit}>cm</Text>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveHeight}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
          {userData.height && (
            <Text style={styles.savedValue}>Current: {userData.height} cm</Text>
          )}
        </View>

        {/* Weight Input - For BMI calculation only, not saved */}
        <View style={styles.inputGroup}>
          <View style={styles.inputLabelRow}>
            <MaterialCommunityIcons name="scale-bathroom" size={18} color="#6B7280" />
            <Text style={styles.inputLabel}>Weight (for BMI)</Text>
          </View>
          <View style={styles.inputRow}>
            <NumericInput
              style={[styles.input, { flex: 1 }]}
              value={weightInput}
              onChangeText={setWeightInput}
              allowDecimal={true}
              maxDecimalPlaces={1}
              placeholder="70"
              placeholderTextColor="#9CA3AF"
            />
            <Text style={styles.unit}>kg</Text>
          </View>
          <Text style={styles.savedValue}>
            Enter weight to calculate BMI (not saved)
          </Text>
        </View>
      </View>

      {/* Weight Progress - Compare Profile weight vs BMI input weight */}
      {weightProgress && (
        <View style={styles.weightProgressSection}>
          <Text style={styles.progressTitle}>Weight Progress</Text>
          <View style={styles.weightProgressRow}>
            <View style={styles.weightStat}>
              <Text style={styles.weightStatLabel}>Profile</Text>
              <Text style={styles.weightStatValue}>{weightProgress.profileWeight} kg</Text>
              {userData.currentWeightDate && (
                <Text style={styles.weightStatDate}>{userData.currentWeightDate}</Text>
              )}
            </View>
            <View style={styles.weightChangeStat}>
              <Ionicons
                name={weightProgress.change >= 0 ? 'arrow-up' : 'arrow-down'}
                size={20}
                color={weightProgress.change >= 0 ? '#EF4444' : '#10B981'}
              />
              <Text
                style={[
                  styles.weightChangeValue,
                  { color: weightProgress.change >= 0 ? '#EF4444' : '#10B981' },
                ]}
              >
                {weightProgress.change > 0 ? '+' : ''}{weightProgress.change} kg
              </Text>
              <Text style={styles.weightChangePercent}>
                ({weightProgress.percentage > 0 ? '+' : ''}{weightProgress.percentage}%)
              </Text>
            </View>
            <View style={styles.weightStat}>
              <Text style={styles.weightStatLabel}>Current</Text>
              <Text style={styles.weightStatValue}>{weightProgress.bmiInputWeight} kg</Text>
              <Text style={styles.weightStatDate}>from input</Text>
            </View>
          </View>
        </View>
      )}

      {/* BMI Result */}
      {bmiResult && categoryInfo && (
        <View style={styles.bmiResultSection}>
          <Text style={styles.bmiTitle}>Your BMI</Text>
          
          {/* BMI Value */}
          <View style={styles.bmiValueContainer}>
            <Text style={[styles.bmiValue, { color: categoryInfo.color }]}>
              {bmiResult.bmi}
            </Text>
            <View style={[styles.categoryBadge, { backgroundColor: categoryInfo.color + '20' }]}>
              <Text style={[styles.categoryText, { color: categoryInfo.color }]}>
                {categoryInfo.label}
              </Text>
            </View>
          </View>
          <Text style={styles.categoryDescription}>{categoryInfo.description}</Text>

          {/* BMI Scale */}
          <View style={styles.bmiScaleContainer}>
            <View style={styles.bmiScale}>
              <View style={[styles.bmiZone, styles.bmiUnderweight]} />
              <View style={[styles.bmiZone, styles.bmiNormal]} />
              <View style={[styles.bmiZone, styles.bmiOverweight]} />
              <View style={[styles.bmiZone, styles.bmiObese]} />
              {/* Position indicator */}
              <View
                style={[
                  styles.bmiIndicator,
                  { left: `${getBMIScalePosition(bmiResult.bmi)}%` },
                ]}
              >
                <View style={styles.bmiIndicatorTriangle} />
              </View>
            </View>
            {/* Labels positioned to match zone boundaries */}
            <View style={styles.bmiLabels}>
              <Text style={[styles.bmiLabel, { position: 'absolute', left: 0 }]}>15</Text>
              <Text style={[styles.bmiLabel, { position: 'absolute', left: '14%', marginLeft: -8 }]}>18.5</Text>
              <Text style={[styles.bmiLabel, { position: 'absolute', left: '40%', marginLeft: -6 }]}>25</Text>
              <Text style={[styles.bmiLabel, { position: 'absolute', left: '60%', marginLeft: -6 }]}>30</Text>
              <Text style={[styles.bmiLabel, { position: 'absolute', right: 0 }]}>40</Text>
            </View>
          </View>

          {/* Healthy Weight Range */}
          <View style={styles.healthyRangeContainer}>
            <Ionicons name="fitness" size={16} color="#10B981" />
            <Text style={styles.healthyRangeText}>
              Healthy weight for your height: {bmiResult.healthyWeightRange.min} - {bmiResult.healthyWeightRange.max} kg
            </Text>
          </View>
        </View>
      )}

      {/* No Data Message */}
      {!bmiResult && (
        <View style={styles.noDataContainer}>
          <MaterialCommunityIcons name="scale-off" size={40} color="#D1D5DB" />
          <Text style={styles.noDataText}>
            Enter your height and weight to calculate BMI
          </Text>
        </View>
      )}
    </View>
  );
};
