import { UserData, MacroTargets } from '../types';
import { calculateTDEE } from '../components/UserInfoSection';

// Default macro targets (generic, based on 2000 cal diet)
const DEFAULT_MACRO_TARGETS: MacroTargets = {
  protein: 50, // grams
  fat: 65,     // grams
  fiber: 25,   // grams
};

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
  const proteinMultipliers: Record<string, number> = {
    sedentary: 0.8,
    lightly_active: 1.0,
    moderately_active: 1.2,
    very_active: 1.4,
    extra_active: 1.6,
  };
  const proteinMultiplier = proteinMultipliers[userData.activityLevel] || 0.8;
  const protein = Math.round(userData.currentWeight * proteinMultiplier);

  // Fat: ~27.5% of total calories (9 cal per gram)
  const fat = Math.round((tdee * 0.275) / 9);

  // Fiber: 14 g per 1000 calories
  const fiber = Math.round((tdee * 14) / 1000);

  return { protein, fat, fiber };
};
