import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { UserData, BMIResult } from '../types';
import {
  getUserData,
  updateHeight,
  updateWeight,
  calculateBMI,
  getBMICategoryInfo,
  getWeightChange,
} from '../services/userDataService';
import { styles } from './styles/bmiCalculatorStyles';

interface BMICalculatorProps {
  onDataUpdate?: (userData: UserData) => void;
}

export const BMICalculator: React.FC<BMICalculatorProps> = ({ onDataUpdate }) => {
  const [userData, setUserData] = useState<UserData>({});
  const [heightInput, setHeightInput] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const [bmiResult, setBmiResult] = useState<BMIResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    // Calculate BMI whenever userData changes
    if (userData.height && userData.currentWeight) {
      const result = calculateBMI(userData.height, userData.currentWeight);
      setBmiResult(result);
    } else {
      setBmiResult(null);
    }
  }, [userData]);

  const loadUserData = async () => {
    try {
      const data = await getUserData();
      setUserData(data);
      setHeightInput(data.height?.toString() || '');
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

  const handleSaveWeight = async () => {
    const weight = parseFloat(weightInput);

    if (isNaN(weight) || weight < 20 || weight > 500) {
      Alert.alert('Invalid Weight', 'Please enter weight between 20 and 500 kg');
      return;
    }

    try {
      const updated = await updateWeight(weight);
      setUserData(updated);
      onDataUpdate?.(updated);

      if (!userData.initialWeight) {
        Alert.alert('Success', `Initial weight set: ${weight} kg`);
      } else {
        Alert.alert('Success', `Weight updated: ${weight} kg`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save weight');
    }
  };

  const weightChange = getWeightChange(userData);
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
            <TextInput
              style={styles.input}
              value={heightInput}
              onChangeText={setHeightInput}
              keyboardType="decimal-pad"
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

        {/* Weight Input */}
        <View style={styles.inputGroup}>
          <View style={styles.inputLabelRow}>
            <MaterialCommunityIcons name="scale-bathroom" size={18} color="#6B7280" />
            <Text style={styles.inputLabel}>Weight</Text>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={weightInput}
              onChangeText={(text) => {
                const filtered = text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                setWeightInput(filtered);
              }}
              keyboardType="decimal-pad"
              placeholder="70"
              placeholderTextColor="#9CA3AF"
            />
            <Text style={styles.unit}>kg</Text>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveWeight}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
          {userData.currentWeight && (
            <Text style={styles.savedValue}>Current: {userData.currentWeight} kg</Text>
          )}
        </View>
      </View>

      {/* Weight Progress */}
      {weightChange && (
        <View style={styles.weightProgressSection}>
          <Text style={styles.progressTitle}>Weight Progress</Text>
          <View style={styles.weightProgressRow}>
            <View style={styles.weightStat}>
              <Text style={styles.weightStatLabel}>Initial</Text>
              <Text style={styles.weightStatValue}>{userData.initialWeight} kg</Text>
              {userData.initialWeightDate && (
                <Text style={styles.weightStatDate}>{userData.initialWeightDate}</Text>
              )}
            </View>
            <View style={styles.weightChangeStat}>
              <Ionicons
                name={weightChange.change >= 0 ? 'arrow-up' : 'arrow-down'}
                size={20}
                color={weightChange.change >= 0 ? '#EF4444' : '#10B981'}
              />
              <Text
                style={[
                  styles.weightChangeValue,
                  { color: weightChange.change >= 0 ? '#EF4444' : '#10B981' },
                ]}
              >
                {weightChange.change > 0 ? '+' : ''}{weightChange.change} kg
              </Text>
              <Text style={styles.weightChangePercent}>
                ({weightChange.percentage > 0 ? '+' : ''}{weightChange.percentage}%)
              </Text>
            </View>
            <View style={styles.weightStat}>
              <Text style={styles.weightStatLabel}>Current</Text>
              <Text style={styles.weightStatValue}>{userData.currentWeight} kg</Text>
              {userData.currentWeightDate && (
                <Text style={styles.weightStatDate}>{userData.currentWeightDate}</Text>
              )}
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
            <View style={styles.bmiLabels}>
              <Text style={styles.bmiLabel}>15</Text>
              <Text style={styles.bmiLabel}>18.5</Text>
              <Text style={styles.bmiLabel}>25</Text>
              <Text style={styles.bmiLabel}>30</Text>
              <Text style={styles.bmiLabel}>40</Text>
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
