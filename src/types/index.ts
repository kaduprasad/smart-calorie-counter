// Food item from the database
export interface FoodItem {
  id: string;
  name: string;
  nameMarathi?: string;
  category: FoodCategory;
  caloriesPerUnit: number;
  unit: FoodUnit;
  unitWeight?: number; // weight in grams for one unit
  isCustom?: boolean;
  searchKeywords?: string[]; // Alternative names for search (Hindi, Marathi, English)
}

export type FoodCategory = 
  | 'breads' 
  | 'rice' 
  | 'dal' 
  | 'vegetables' 
  | 'snacks' 
  | 'sweets' 
  | 'beverages' 
  | 'dairy' 
  | 'fruits'
  | 'chutneys'
  | 'pickles'
  | 'custom';

export type FoodUnit = 
  | 'piece' 
  | 'cup' 
  | 'bowl' 
  | 'plate' 
  | 'glass' 
  | 'tablespoon' 
  | 'teaspoon'
  | 'grams'
  | 'ml'
  | 'serving'
  | 'slice'
  | 'packet'
  | 'scoop'
  | 'serving (10 pcs)'
  | 'serving (10 halves)'
  | 'serving (3 pcs)'
  | 'serving (5 pcs)';

// Food log entry for a specific day
export interface FoodLogEntry {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  timestamp: number;
}

// Daily food log
export interface DailyLog {
  date: string; // YYYY-MM-DD format
  entries: FoodLogEntry[];
  totalCalories: number;
}

// Custom dish created by user
export interface CustomDish {
  id: string;
  name: string;
  caloriesPerGram: number;
  defaultServingGrams: number;
  createdAt: number;
}

// App settings
export interface AppSettings {
  notificationEnabled: boolean;
  notificationTime: {
    hour: number;
    minute: number;
  };
  dailyCalorieGoal: number;
  exerciseCalorieGoal: number; // daily exercise calorie burn goal
  weightGoal?: number; // target weight in kg
}

// Weight entry for tracking
export interface WeightEntry {
  date: string; // YYYY-MM-DD format
  weight: number; // in kg
  timestamp: number;
}

// Category display info
export interface CategoryInfo {
  id: FoodCategory;
  name: string;
  icon: string;
}

// Exercise types
export type ExerciseType = 
  | 'running'
  | 'walking'
  | 'cycling'
  | 'hiking'
  | 'badminton'
  | 'table_tennis'
  | 'swimming';

export type TimeUnit = 'minutes' | 'hours';

// Exercise entry for tracking
export interface ExerciseEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  exerciseType: ExerciseType;
  duration: number; // in minutes
  distance?: number; // in km, for distance-based exercises
  caloriesBurnt: number;
  isCaloriesOverridden: boolean;
  timestamp: number;
}
