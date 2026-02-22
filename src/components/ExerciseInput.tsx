import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { NumericInput } from './NumericInput';
import { ExerciseEntry, ExerciseType, TimeUnit } from '../types';
import { EXERCISE_DATA, EXERCISE_TYPES, DEFAULT_BODY_WEIGHT } from '../data/exercises';
import { calculateCaloriesBurnt, estimateDistanceFromDuration } from '../services/exerciseService';
import { getExerciseEntries, saveExerciseEntry, deleteExerciseEntry, getTodayDate, getSettings } from '../services/storage';

interface ExerciseInputProps {
  date: string;
  onExerciseSaved?: () => void;
}

// Helper to render exercise icon
const ExerciseIcon: React.FC<{ type: ExerciseType; size: number; color: string }> = ({ type, size, color }) => {
  const data = EXERCISE_DATA[type];
  switch (data.iconType) {
    case 'Ionicons':
      return <Ionicons name={data.icon as any} size={size} color={color} />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={data.icon as any} size={size} color={color} />;
    case 'FontAwesome5':
      return <FontAwesome5 name={data.icon as any} size={size} color={color} />;
  }
};

export const ExerciseInput: React.FC<ExerciseInputProps> = ({ date, onExerciseSaved }) => {
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingExercise, setEditingExercise] = useState<ExerciseEntry | null>(null);
  const [userWeight, setUserWeight] = useState(70); // Default weight in kg

  // Form state
  const [selectedType, setSelectedType] = useState<ExerciseType>('walking');
  const [duration, setDuration] = useState('');
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('minutes');
  const [distance, setDistance] = useState('');
  const [isDistanceManuallyEdited, setIsDistanceManuallyEdited] = useState(false);
  const [estimatedCalories, setEstimatedCalories] = useState(0);
  const [customCalories, setCustomCalories] = useState('');
  const [isCaloriesOverridden, setIsCaloriesOverridden] = useState(false);

  useEffect(() => {
    loadExercises();
    loadUserWeight();
  }, [date]);

  const loadExercises = async () => {
    setIsLoading(true);
    const entries = await getExerciseEntries(date);
    setExercises(entries);
    setIsLoading(false);
  };

  const loadUserWeight = async () => {
    // Get weight from settings or use a default
    const settings = await getSettings();
    // For now, use a reasonable default; could be extended to read from weight entries
    setUserWeight(DEFAULT_BODY_WEIGHT);
  };

  // Update estimated calories when inputs change
  useEffect(() => {
    if (!duration) {
      setEstimatedCalories(0);
      return;
    }

    const durationMins = timeUnit === 'hours' ? parseFloat(duration) * 60 : parseFloat(duration);
    if (isNaN(durationMins) || durationMins <= 0) {
      setEstimatedCalories(0);
      return;
    }

    // For distance-based exercises, auto-fill distance first if not manually edited
    let distanceKm = distance ? parseFloat(distance) : undefined;
    if (EXERCISE_DATA[selectedType].hasDistance && !isDistanceManuallyEdited) {
      const estimated = estimateDistanceFromDuration(selectedType, durationMins);
      if (estimated > 0) {
        setDistance(estimated.toString());
        distanceKm = estimated; // Use this for calorie calculation
      }
    }

    // Calculate calories using the distance (auto or manual)
    const calories = calculateCaloriesBurnt(selectedType, durationMins, userWeight, distanceKm);
    setEstimatedCalories(calories);
  }, [duration, timeUnit, selectedType, userWeight, isDistanceManuallyEdited]);

  // Recalculate calories when distance changes manually
  useEffect(() => {
    if (!duration || !isDistanceManuallyEdited) return;
    
    const durationMins = timeUnit === 'hours' ? parseFloat(duration) * 60 : parseFloat(duration);
    if (isNaN(durationMins) || durationMins <= 0) return;

    const distanceKm = distance ? parseFloat(distance) : undefined;
    const calories = calculateCaloriesBurnt(selectedType, durationMins, userWeight, distanceKm);
    setEstimatedCalories(calories);
  }, [distance]);

  // Reset distance when switching exercise type (to recalculate with new speeds)
  useEffect(() => {
    setDistance('');
    setIsDistanceManuallyEdited(false);
  }, [selectedType]);

  const resetForm = () => {
    setSelectedType('walking');
    setDuration('');
    setTimeUnit('minutes');
    setDistance('');
    setIsDistanceManuallyEdited(false);
    setEstimatedCalories(0);
    setCustomCalories('');
    setIsCaloriesOverridden(false);
    setEditingExercise(null);
  };

  const openModal = (exercise?: ExerciseEntry) => {
    if (exercise) {
      setEditingExercise(exercise);
      setSelectedType(exercise.exerciseType);
      setDuration(exercise.duration.toString());
      setTimeUnit('minutes');
      if (exercise.distance) {
        setDistance(exercise.distance.toString());
        setIsDistanceManuallyEdited(true); // Treat existing distance as manual
      } else {
        setDistance('');
        setIsDistanceManuallyEdited(false);
      }
      if (exercise.isCaloriesOverridden) {
        setIsCaloriesOverridden(true);
        setCustomCalories(exercise.caloriesBurnt.toString());
      } else {
        setCustomCalories('');
        setIsCaloriesOverridden(false);
      }
    } else {
      resetForm();
    }
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    const durationMins = timeUnit === 'hours' ? parseFloat(duration) * 60 : parseFloat(duration);
    if (isNaN(durationMins) || durationMins <= 0) {
      return;
    }

    const finalCalories = isCaloriesOverridden && customCalories
      ? parseInt(customCalories)
      : estimatedCalories;

    const entry: ExerciseEntry = {
      id: editingExercise?.id || `exercise_${Date.now()}`,
      date,
      exerciseType: selectedType,
      duration: Math.round(durationMins),
      distance: EXERCISE_DATA[selectedType].hasDistance && distance ? parseFloat(distance) : undefined,
      caloriesBurnt: finalCalories,
      isCaloriesOverridden,
      timestamp: Date.now(),
    };

    await saveExerciseEntry(entry);
    await loadExercises();
    setIsModalVisible(false);
    resetForm();
    onExerciseSaved?.();
  };

  const handleDelete = async (exerciseId: string, exerciseName: string) => {
    const confirmDelete = () => {
      deleteExerciseEntry(date, exerciseId).then(() => {
        loadExercises();
        onExerciseSaved?.();
      });
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Remove ${exerciseName} from your log?`)) {
        confirmDelete();
      }
    } else {
      Alert.alert(
        'Remove Exercise',
        `Remove ${exerciseName} from your log?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: confirmDelete },
        ]
      );
    }
  };

  const isToday = date === getTodayDate();
  const totalCalories = exercises.reduce((sum, e) => sum + e.caloriesBurnt, 0);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.headerRow}
          onPress={() => openModal()}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="run-fast" size={24} color="#4CAF50" />
          </View>
          <View style={styles.content}>
            <Text style={styles.label}>
              {isToday ? "Today's Workout" : 'Workout'}
            </Text>
            <Text style={styles.value}>
              {exercises.length > 0
                ? `${totalCalories} kcal burnt`
                : 'Tap to add'}
            </Text>
          </View>
          <View style={styles.addButton}>
            <Ionicons name="add" size={22} color="#4CAF50" />
          </View>
        </TouchableOpacity>

        {/* Exercise list */}
        {exercises.length > 0 && (
          <View style={styles.exerciseList}>
            {exercises.map((exercise) => (
              <View key={exercise.id} style={styles.exerciseItem}>
                <View style={styles.exerciseIconContainer}>
                  <ExerciseIcon
                    type={exercise.exerciseType}
                    size={18}
                    color="#4CAF50"
                  />
                </View>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>
                    {EXERCISE_DATA[exercise.exerciseType].name}
                  </Text>
                  <Text style={styles.exerciseDetails}>
                    {exercise.duration} min
                    {exercise.distance ? ` • ${exercise.distance} km` : ''}
                    {' • '}
                    {exercise.caloriesBurnt} kcal
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.exerciseEditBtn}
                  onPress={() => openModal(exercise)}
                >
                  <Ionicons name="pencil" size={14} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.exerciseDeleteBtn}
                  onPress={() => handleDelete(exercise.id, EXERCISE_DATA[exercise.exerciseType].name)}
                >
                  <Ionicons name="trash-outline" size={14} color="#FF5252" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Add/Edit Exercise Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsModalVisible(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>
                {editingExercise ? 'Edit Workout' : 'Add Workout'}
              </Text>

              {/* Exercise Type Selection */}
              <Text style={styles.fieldLabel}>Exercise Type</Text>
              <View style={styles.exerciseTypeGrid}>
                {EXERCISE_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.exerciseTypeBtn,
                      selectedType === type && styles.exerciseTypeBtnActive,
                    ]}
                    onPress={() => setSelectedType(type)}
                  >
                    <ExerciseIcon
                      type={type}
                      size={24}
                      color={selectedType === type ? '#FFFFFF' : '#4CAF50'}
                    />
                    <Text
                      style={[
                        styles.exerciseTypeName,
                        selectedType === type && styles.exerciseTypeNameActive,
                      ]}
                      numberOfLines={1}
                    >
                      {EXERCISE_DATA[type].name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Duration Input */}
              <Text style={styles.fieldLabel}>Duration</Text>
              <View style={styles.inputRow}>
                <View style={styles.durationInputContainer}>
                  <NumericInput
                    style={styles.durationInput}
                    value={duration}
                    onChangeText={setDuration}
                    allowDecimal={true}
                    maxDecimalPlaces={1}
                    placeholder="30"
                    placeholderTextColor="#AAAAAA"
                  />
                </View>
                <View style={styles.unitSelector}>
                  <TouchableOpacity
                    style={[
                      styles.unitBtn,
                      timeUnit === 'minutes' && styles.unitBtnActive,
                    ]}
                    onPress={() => setTimeUnit('minutes')}
                  >
                    <Text
                      style={[
                        styles.unitBtnText,
                        timeUnit === 'minutes' && styles.unitBtnTextActive,
                      ]}
                    >
                      min
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.unitBtn,
                      timeUnit === 'hours' && styles.unitBtnActive,
                    ]}
                    onPress={() => setTimeUnit('hours')}
                  >
                    <Text
                      style={[
                        styles.unitBtnText,
                        timeUnit === 'hours' && styles.unitBtnTextActive,
                      ]}
                    >
                      hr
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Distance Input (for distance-based exercises) */}
              {EXERCISE_DATA[selectedType].hasDistance && (
                <>
                  <Text style={styles.fieldLabel}>Distance (km)</Text>
                  <View style={styles.distanceInputContainer}>
                    <Ionicons name="location-outline" size={20} color="#888" style={styles.distanceIcon} />
                    <NumericInput
                      style={styles.distanceInput}
                      value={distance}
                      onChangeText={(text) => {
                        setDistance(text);
                        setIsDistanceManuallyEdited(true);
                      }}
                      allowDecimal={true}
                      maxDecimalPlaces={2}
                      placeholder="Auto-estimated"
                      placeholderTextColor="#AAAAAA"
                    />
                    <Text style={styles.distanceUnit}>km</Text>
                  </View>
                  <Text style={styles.fieldHint}>
                    Distance is auto-estimated based on duration. Edit to override.
                  </Text>
                </>
              )}

              {/* Calories Burnt */}
              <Text style={styles.fieldLabel}>Calories Burnt</Text>
              <View style={styles.caloriesSection}>
                <View style={styles.estimatedCaloriesBox}>
                  <MaterialCommunityIcons name="fire" size={24} color="#FF5722" />
                  <View style={styles.caloriesTextContainer}>
                    <Text style={styles.estimatedCaloriesLabel}>Estimated</Text>
                    <Text style={styles.estimatedCaloriesValue}>
                      {estimatedCalories} kcal
                    </Text>
                  </View>
                </View>
                
                <TouchableOpacity
                  style={styles.overrideToggle}
                  onPress={() => {
                    setIsCaloriesOverridden(!isCaloriesOverridden);
                    if (!isCaloriesOverridden) {
                      setCustomCalories(estimatedCalories.toString());
                    }
                  }}
                >
                  <Ionicons
                    name={isCaloriesOverridden ? 'checkbox' : 'square-outline'}
                    size={20}
                    color="#4CAF50"
                  />
                  <Text style={styles.overrideToggleText}>Override</Text>
                </TouchableOpacity>

                {isCaloriesOverridden && (
                  <View style={styles.customCaloriesContainer}>
                    <NumericInput
                      style={styles.customCaloriesInput}
                      value={customCalories}
                      onChangeText={setCustomCalories}
                      allowDecimal={false}
                      placeholder="Enter calories"
                      placeholderTextColor="#AAAAAA"
                    />
                    <Text style={styles.customCaloriesUnit}>kcal</Text>
                  </View>
                )}
              </View>

              {/* Met Info */}
              <View style={styles.metInfoBox}>
                <Ionicons name="information-circle-outline" size={16} color="#888" />
                <Text style={styles.metInfoText}>
                  Based on MET value of {EXERCISE_DATA[selectedType].met} for {EXERCISE_DATA[selectedType].name.toLowerCase()}
                  {' '}and 70kg body weight
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setIsModalVisible(false);
                    resetForm();
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    (!duration || parseFloat(duration) <= 0) && styles.saveButtonDisabled,
                  ]}
                  onPress={handleSave}
                  disabled={!duration || parseFloat(duration) <= 0}
                >
                  <Text style={styles.saveButtonText}>
                    {editingExercise ? 'Update' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  label: {
    fontSize: 12,
    color: '#888888',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 2,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseList: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  exerciseIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: 10,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  exerciseDetails: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  exerciseEditBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  exerciseDeleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444444',
    marginBottom: 8,
    marginTop: 12,
  },
  exerciseTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exerciseTypeBtn: {
    width: '31%',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  exerciseTypeBtnActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  exerciseTypeName: {
    fontSize: 11,
    color: '#444444',
    marginTop: 4,
    textAlign: 'center',
  },
  exerciseTypeNameActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  durationInputContainer: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  durationInput: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    paddingVertical: 12,
    textAlign: 'center',
  },
  unitSelector: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
  },
  unitBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  unitBtnActive: {
    backgroundColor: '#4CAF50',
  },
  unitBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  unitBtnTextActive: {
    color: '#FFFFFF',
  },
  distanceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  distanceIcon: {
    marginRight: 8,
  },
  distanceInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    paddingVertical: 12,
  },
  distanceUnit: {
    fontSize: 16,
    color: '#888888',
    marginLeft: 8,
  },
  fieldHint: {
    fontSize: 11,
    color: '#888888',
    marginTop: 4,
    fontStyle: 'italic',
  },
  caloriesSection: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 12,
  },
  estimatedCaloriesBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  caloriesTextContainer: {
    flex: 1,
  },
  estimatedCaloriesLabel: {
    fontSize: 12,
    color: '#888888',
  },
  estimatedCaloriesValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF5722',
  },
  overrideToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#FFE082',
  },
  overrideToggleText: {
    fontSize: 14,
    color: '#444444',
  },
  customCaloriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
  },
  customCaloriesInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    paddingVertical: 10,
    textAlign: 'center',
  },
  customCaloriesUnit: {
    fontSize: 14,
    color: '#888888',
  },
  metInfoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 12,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  metInfoText: {
    flex: 1,
    fontSize: 11,
    color: '#888888',
    lineHeight: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
