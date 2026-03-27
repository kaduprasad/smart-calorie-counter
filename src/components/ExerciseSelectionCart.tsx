import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { ExerciseType, TimeUnit } from '../types';
import { EXERCISE_DATA } from '../data/exercises';
import { calculateCaloriesBurnt, estimateDistanceFromDuration } from '../services/exerciseService';
import { NumericInput } from './NumericInput';
import { IncrementButton, DecrementButton } from './IncrementDecrementButton';

export interface SelectedExercise {
  type: ExerciseType;
  duration: number; // in minutes
  distance?: number;
  calories: number;
}

interface ExerciseSelectionCartProps {
  selectedExercises: SelectedExercise[];
  userWeight: number;
  onUpdateExercise: (type: ExerciseType, updates: Partial<SelectedExercise>) => void;
  onRemoveExercise: (type: ExerciseType) => void;
  onAddAll: () => void;
  onClearAll: () => void;
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

export const ExerciseSelectionCart: React.FC<ExerciseSelectionCartProps> = ({
  selectedExercises,
  userWeight,
  onUpdateExercise,
  onRemoveExercise,
  onAddAll,
  onClearAll,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (selectedExercises.length === 0) {
    return null;
  }

  const totalCalories = selectedExercises.reduce((sum, ex) => sum + ex.calories, 0);
  const totalDuration = selectedExercises.reduce((sum, ex) => sum + ex.duration, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.headerLeft}>
          <View style={styles.cartBadge}>
            <MaterialCommunityIcons name="run-fast" size={16} color="#FFFFFF" />
            <Text style={styles.cartCount}>{selectedExercises.length}</Text>
          </View>
          <Text style={styles.headerTitle}>Selected Workouts</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.totalStats}>
            {totalDuration} min • {totalCalories} kcal
          </Text>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#4CAF50"
          />
        </View>
      </TouchableOpacity>

      {/* Expanded Content */}
      {isExpanded && (
        <View style={styles.content}>
          <ScrollView
            style={styles.itemsList}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
          >
            {selectedExercises.map((exercise) => (
              <ExerciseCartItem
                key={exercise.type}
                exercise={exercise}
                userWeight={userWeight}
                onUpdate={(updates) => onUpdateExercise(exercise.type, updates)}
                onRemove={() => onRemoveExercise(exercise.type)}
              />
            ))}
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.clearButton} onPress={onClearAll}>
              <Ionicons name="trash-outline" size={16} color="#FF5252" />
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addAllButton} onPress={onAddAll}>
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
              <Text style={styles.addAllText}>Add All ({selectedExercises.length})</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

// Individual exercise cart item component
interface ExerciseCartItemProps {
  exercise: SelectedExercise;
  userWeight: number;
  onUpdate: (updates: Partial<SelectedExercise>) => void;
  onRemove: () => void;
}

const ExerciseCartItem: React.FC<ExerciseCartItemProps> = ({ 
  exercise, 
  userWeight,
  onUpdate, 
  onRemove 
}) => {
  const [durationInput, setDurationInput] = useState(exercise.duration.toString());
  const exerciseData = EXERCISE_DATA[exercise.type];

  const MAX_DURATION_MINS = 600; // 10 hours

  const handleDurationChange = useCallback((text: string) => {
    const parsed = parseFloat(text);
    if (!isNaN(parsed) && parsed > MAX_DURATION_MINS) {
      text = MAX_DURATION_MINS.toString();
    }
    setDurationInput(text);
    const duration = parseFloat(text);
    if (!isNaN(duration) && duration > 0) {
      const capped = Math.min(duration, MAX_DURATION_MINS);
      const distanceKm = exerciseData.hasDistance 
        ? estimateDistanceFromDuration(exercise.type, capped)
        : undefined;
      const calories = calculateCaloriesBurnt(exercise.type, capped, userWeight, distanceKm);
      onUpdate({ 
        duration: capped, 
        distance: distanceKm,
        calories 
      });
    }
  }, [exercise.type, userWeight, exerciseData.hasDistance, onUpdate]);

  const handleIncrement = () => {
    const newDuration = Math.min(exercise.duration + 5, MAX_DURATION_MINS);
    setDurationInput(newDuration.toString());
    const distanceKm = exerciseData.hasDistance 
      ? estimateDistanceFromDuration(exercise.type, newDuration)
      : undefined;
    const calories = calculateCaloriesBurnt(exercise.type, newDuration, userWeight, distanceKm);
    onUpdate({ duration: newDuration, distance: distanceKm, calories });
  };

  const handleDecrement = () => {
    if (exercise.duration > 5) {
      const newDuration = exercise.duration - 5;
      setDurationInput(newDuration.toString());
      const distanceKm = exerciseData.hasDistance 
        ? estimateDistanceFromDuration(exercise.type, newDuration)
        : undefined;
      const calories = calculateCaloriesBurnt(exercise.type, newDuration, userWeight, distanceKm);
      onUpdate({ duration: newDuration, distance: distanceKm, calories });
    }
  };

  return (
    <View style={styles.cartItem}>
      <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
        <Ionicons name="close-circle" size={20} color="#FF5252" />
      </TouchableOpacity>

      <View style={styles.exerciseIcon}>
        <ExerciseIcon type={exercise.type} size={20} color="#4CAF50" />
      </View>

      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>
          {exerciseData.name}
        </Text>
        {exercise.distance && (
          <Text style={styles.itemDistance}>
            ~{exercise.distance.toFixed(1)} km
          </Text>
        )}
      </View>

      <View style={styles.durationControls}>
        <DecrementButton onPress={handleDecrement} size="small" color="#4CAF50" />
        <View style={styles.durationInputWrapper}>
          <NumericInput
            style={styles.durationInput}
            value={durationInput}
            onChangeText={handleDurationChange}
            allowDecimal={false}
            maxLength={3}
          />
          <Text style={styles.durationUnit}>min</Text>
        </View>
        <IncrementButton onPress={handleIncrement} size="small" color="#4CAF50" />
      </View>

      <View style={styles.caloriesBox}>
        <Text style={styles.caloriesValue}>{exercise.calories}</Text>
        <Text style={styles.caloriesUnit}>kcal</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0FFF4',
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#B2DFDB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#E8F5E9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cartBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  cartCount: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    flexShrink: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  totalStats: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  content: {
    padding: 12,
    paddingTop: 4,
  },
  itemsList: {
    maxHeight: 200,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
    flexWrap: 'nowrap',
  },
  removeBtn: {
    marginRight: 4,
  },
  exerciseIcon: {
    display: 'none',
  },
  itemInfo: {
    flex: 0,
    width: 50,
    marginRight: 6,
  },
  itemName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333333',
  },
  itemDistance: {
    fontSize: 11,
    color: '#666666',
  },
  durationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
    flexShrink: 0,
  },
  durationBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  durationBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    lineHeight: 18,
  },
  durationInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  durationInput: {
    width: 40,
    height: 26,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    paddingHorizontal: 2,
    paddingVertical: 0,
  },
  durationUnit: {
    fontSize: 11,
    color: '#666666',
    marginLeft: 2,
  },
  caloriesBox: {
    alignItems: 'flex-end',
    minWidth: 40,
    flexShrink: 0,
  },
  caloriesValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4CAF50',
  },
  caloriesUnit: {
    fontSize: 10,
    color: '#66BB6A',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#C8E6C9',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FFEBEE',
    gap: 6,
  },
  clearText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF5252',
  },
  addAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    gap: 6,
  },
  addAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
