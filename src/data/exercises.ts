import { ExerciseType } from '../types';

// MET (Metabolic Equivalent of Task) values for calorie calculation
// Calories burned = MET × weight (kg) × time (hours)
// Data sourced from Compendium of Physical Activities

export interface ExerciseDataItem {
  name: string;
  icon: string;
  iconType: 'Ionicons' | 'MaterialCommunityIcons' | 'FontAwesome5';
  met: number; // MET value
  hasDistance: boolean;
  avgSpeedKmh?: number; // Average speed for distance estimation
  caloriesPerKm?: number; // For distance-based calculation (per kg body weight)
}

export const EXERCISE_DATA: Record<ExerciseType, ExerciseDataItem> = {
  running: {
    name: 'Running',
    icon: 'run',
    iconType: 'MaterialCommunityIcons',
    met: 9.8, // jogging ~8 km/h
    hasDistance: true,
    avgSpeedKmh: 8,
    caloriesPerKm: 1.0, // ~1 kcal per kg per km
  },
  walking: {
    name: 'Walking',
    icon: 'walk',
    iconType: 'MaterialCommunityIcons',
    met: 3.8, // moderate pace
    hasDistance: true,
    avgSpeedKmh: 4.8, // ~12.5 min/km medium pace (2.4 km in 30 min)
    caloriesPerKm: 1.0, // ~70 kcal per km for 70 kg person
  },
  cycling: {
    name: 'Cycling',
    icon: 'bicycle',
    iconType: 'Ionicons',
    met: 7.5, // moderate effort
    hasDistance: false,
    avgSpeedKmh: 15,
  },
  hiking: {
    name: 'Hiking',
    icon: 'hiking',
    iconType: 'FontAwesome5',
    met: 6.0,
    hasDistance: true,
    avgSpeedKmh: 3.5, // ~17 min/km with elevation
    caloriesPerKm: 0.7,
  },
  badminton: {
    name: 'Badminton',
    icon: 'badminton',
    iconType: 'MaterialCommunityIcons',
    met: 5.5, // casual play
    hasDistance: false,
  },
  table_tennis: {
    name: 'Table Tennis',
    icon: 'table-tennis',
    iconType: 'MaterialCommunityIcons',
    met: 4.0,
    hasDistance: false,
  },
  swimming: {
    name: 'Swimming',
    icon: 'swim',
    iconType: 'MaterialCommunityIcons',
    met: 6.0, // moderate effort
    hasDistance: false,
  },
};

// List of all exercise types for iteration
export const EXERCISE_TYPES: ExerciseType[] = [
  'running',
  'walking',
  'cycling',
  'hiking',
  'badminton',
  'table_tennis',
  'swimming',
];

// Default body weight for calorie calculations (in kg)
export const DEFAULT_BODY_WEIGHT = 70;
