import { ExerciseType } from '../types';
import { EXERCISE_DATA, DEFAULT_BODY_WEIGHT } from '../data/exercises';

/**
 * Calculate calories burned based on exercise type, duration, and optional distance
 * Uses MET (Metabolic Equivalent of Task) values for time-based calculation
 * Uses calories per km for distance-based exercises when distance is provided
 * 
 * @param type - The type of exercise
 * @param durationMins - Duration in minutes
 * @param weight - Body weight in kg (defaults to 70kg)
 * @param distanceKm - Optional distance in km for distance-based exercises
 * @returns Estimated calories burned (rounded to nearest integer)
 */
export const calculateCaloriesBurnt = (
  type: ExerciseType,
  durationMins: number,
  weight: number = DEFAULT_BODY_WEIGHT,
  distanceKm?: number
): number => {
  const exerciseData = EXERCISE_DATA[type];

  // For distance-based exercises, calculate from distance if provided
  if (exerciseData.hasDistance && distanceKm && distanceKm > 0 && exerciseData.caloriesPerKm) {
    return Math.round(exerciseData.caloriesPerKm * weight * distanceKm);
  }

  // Otherwise, calculate from MET value and time
  // Calories = MET × weight (kg) × time (hours)
  const hours = durationMins / 60;
  return Math.round(exerciseData.met * weight * hours);
};

/**
 * Estimate distance from duration based on average speed
 * Only applicable for distance-based exercises (running, walking, hiking)
 * 
 * @param type - The type of exercise
 * @param durationMins - Duration in minutes
 * @returns Estimated distance in km (rounded to 1 decimal place), or 0 if not applicable
 */
export const estimateDistanceFromDuration = (
  type: ExerciseType,
  durationMins: number
): number => {
  const exerciseData = EXERCISE_DATA[type];
  if (!exerciseData.hasDistance || !exerciseData.avgSpeedKmh) return 0;
  
  const hours = durationMins / 60;
  return Math.round(exerciseData.avgSpeedKmh * hours * 10) / 10; // Round to 1 decimal
};

/**
 * Estimate duration from distance based on average speed
 * Only applicable for distance-based exercises
 * 
 * @param type - The type of exercise
 * @param distanceKm - Distance in km
 * @returns Estimated duration in minutes (rounded), or 0 if not applicable
 */
export const estimateDurationFromDistance = (
  type: ExerciseType,
  distanceKm: number
): number => {
  const exerciseData = EXERCISE_DATA[type];
  if (!exerciseData.hasDistance || !exerciseData.avgSpeedKmh) return 0;
  
  const hours = distanceKm / exerciseData.avgSpeedKmh;
  return Math.round(hours * 60);
};

/**
 * Get exercise display name
 */
export const getExerciseName = (type: ExerciseType): string => {
  return EXERCISE_DATA[type].name;
};

/**
 * Check if an exercise type supports distance tracking
 */
export const exerciseHasDistance = (type: ExerciseType): boolean => {
  return EXERCISE_DATA[type].hasDistance;
};

/**
 * Get MET value for an exercise
 */
export const getExerciseMET = (type: ExerciseType): number => {
  return EXERCISE_DATA[type].met;
};

/**
 * Format exercise summary for display
 * @example "30 min • 4.0 km • 280 kcal"
 */
export const formatExerciseSummary = (
  durationMins: number,
  caloriesBurnt: number,
  distanceKm?: number
): string => {
  const parts: string[] = [`${durationMins} min`];
  
  if (distanceKm) {
    parts.push(`${distanceKm} km`);
  }
  
  parts.push(`${caloriesBurnt} kcal`);
  
  return parts.join(' • ');
};
