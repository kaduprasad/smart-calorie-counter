import { UserData, MacroTargets } from '../types';
import { calculateTDEE } from '../components/UserInfoSection';
import {
  DEFAULT_MACRO_TARGETS,
  PROTEIN_MULTIPLIERS,
  FAT_CALORIES_FRACTION,
  CALORIES_PER_GRAM_FAT,
  FIBER_GRAMS_PER_1000_CAL,
} from '../common/constants';

/**
 * Calculate recommended daily macronutrient targets based on user data.
 * Uses weight-based protein, TDEE-based fat, and calorie-density fiber.
 * Falls back to generic defaults if user data is incomplete.
 */
export const calculateMacroTargets = (userData?: UserData | null): MacroTargets => {
  if (
    !userData ||
    !userData.currentWeight ||
    !userData.height ||
    !userData.gender ||
    !userData.dateOfBirth ||
    !userData.activityLevel
  ) {
    return DEFAULT_MACRO_TARGETS;
  }

  const tdee = calculateTDEE(userData);
  if (tdee === 0) return DEFAULT_MACRO_TARGETS;

  // Protein: weight-based (0.8 g/kg sedentary → 1.6 g/kg extra active)
  const proteinMultiplier = PROTEIN_MULTIPLIERS[userData.activityLevel] || 0.8;
  const protein = Math.round(userData.currentWeight * proteinMultiplier);

  // Fat: ~27.5% of total calories (9 cal per gram)
  const fat = Math.round((tdee * FAT_CALORIES_FRACTION) / CALORIES_PER_GRAM_FAT);

  // Fiber: 14 g per 1000 calories
  const fiber = Math.round((tdee * FIBER_GRAMS_PER_1000_CAL) / 1000);

  return { protein, fat, fiber };
};
