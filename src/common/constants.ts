import { AppSettings, MacroTargets } from '../types';

// ─── App Identity ───────────────────────────────────────────────────────
export const APP_NAME = 'Smart Calorie Tracker';
export const APP_LOCALE = 'en-IN';

// ─── API Configuration ──────────────────────────────────────────────────
export const OPEN_FOOD_FACTS_API_URL = 'https://world.openfoodfacts.org/cgi/search.pl';
export const CALORIE_NINJAS_API_URL = 'https://api.calorieninjas.com/v1/nutrition';
export const USDA_FOOD_DATA_API_URL = 'https://api.nal.usda.gov/fdc/v1';
export const REMOTE_FOODS_URL =
  'https://raw.githubusercontent.com/kaduprasad/smart-calorie-counter/main/data/remote-foods.json';
export const USER_AGENT = 'CalorieCounter-MaharashtrianFood/1.0';

// ─── AsyncStorage Keys ──────────────────────────────────────────────────
export const STORAGE_KEYS = {
  DAILY_LOGS: 'daily_logs',
  CUSTOM_FOODS: 'custom_foods',
  SETTINGS: 'app_settings',
  WEIGHT_ENTRIES: 'weight_entries',
  EXERCISE_ENTRIES: 'exercise_entries',
  REMOTE_FOODS: 'remote_foods_cache',
  REMOTE_FOODS_VERSION: 'remote_foods_version',
  USER_DATA: 'user_data',
  PINNED_FOODS: 'pinned_foods',
} as const;

// ─── Default Settings ───────────────────────────────────────────────────
export const DEFAULT_CALORIE_GOAL = 2000;
export const DEFAULT_EXERCISE_GOAL = 300;
export const DEFAULT_NOTIFICATION_HOUR = 22;
export const DEFAULT_NOTIFICATION_MINUTE = 0;

export const DEFAULT_SETTINGS: AppSettings = {
  notificationEnabled: true,
  notificationTime: {
    hour: DEFAULT_NOTIFICATION_HOUR,
    minute: DEFAULT_NOTIFICATION_MINUTE,
  },
  dailyCalorieGoal: DEFAULT_CALORIE_GOAL,
  exerciseCalorieGoal: DEFAULT_EXERCISE_GOAL,
  weightGoal: undefined,
};

// ─── Macro Nutrition Defaults ───────────────────────────────────────────
export const DEFAULT_MACRO_TARGETS: MacroTargets = {
  protein: 60,
  fat: 65,
  fiber: 25,
};

export const CALORIES_PER_GRAM_FAT = 9;
export const FAT_CALORIES_FRACTION = 0.275;
export const FIBER_GRAMS_PER_1000_CAL = 14;

export const PROTEIN_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.0,
  lightly_active: 1.2,
  moderately_active: 1.4,
  very_active: 1.6,
  extra_active: 1.8,
};

// ─── Validation Ranges ──────────────────────────────────────────────────
export const VALIDATION = {
  AGE: { MIN: 10, MAX: 120 },
  HEIGHT_CM: { MIN: 50, MAX: 300 },
  WEIGHT_KG: { MIN: 20, MAX: 500 },
  CALORIE_GOAL: { MIN: 500, MAX: 10000 },
  EXERCISE_GOAL: { MIN: 0, MAX: 5000 },
  WEIGHT_GOAL: { MIN: 30, MAX: 300 },
} as const;

// ─── BMI Thresholds ─────────────────────────────────────────────────────
export const BMI = {
  UNDERWEIGHT: 18.5,
  OVERWEIGHT: 25,
  OBESE: 30,
  HEALTHY_MIN: 18.5,
  HEALTHY_MAX: 24.9,
  SCALE_MIN: 15,
  SCALE_MAX: 40,
} as const;

// ─── Health & Calorie Science ───────────────────────────────────────────
export const CALORIES_PER_KG_BODY_WEIGHT = 7700;
export const MIN_CALORIES_FOR_VALID_DAY = 1000;

// ─── Pagination / Limits ────────────────────────────────────────────────
export const FOOD_LIST_PAGE_SIZE = 50;
export const RECENT_FOODS_LIMIT = 30;
export const MAX_ONLINE_SEARCH_RESULTS = 20;
export const OPEN_FOOD_FACTS_PAGE_SIZE = 20;
export const VOICE_SEARCH_RESULT_LIMIT = 5;

// ─── Network ────────────────────────────────────────────────────────────
export const REMOTE_FOODS_FETCH_TIMEOUT_MS = 8000;

// ─── Notifications ──────────────────────────────────────────────────────
export const NOTIFICATION_CHANNEL_ID = 'daily-reminder';
export const NOTIFICATION_CHANNEL_NAME = 'Daily Reminder';
