import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyLog, FoodItem, AppSettings, FoodLogEntry, WeightEntry, ExerciseEntry } from '../types';
import { getLocalDateString, getTodayDate, formatDate } from '../utils/utils';

// Re-export utility functions for backward compatibility
export { getLocalDateString, getTodayDate, formatDate };

const KEYS = {
  DAILY_LOGS: 'daily_logs',
  CUSTOM_FOODS: 'custom_foods',
  SETTINGS: 'app_settings',
  WEIGHT_ENTRIES: 'weight_entries',
  EXERCISE_ENTRIES: 'exercise_entries',
};

const DEFAULT_SETTINGS: AppSettings = {
  notificationEnabled: true,
  notificationTime: {
    hour: 22,
    minute: 0,
  },
  dailyCalorieGoal: 2000,
  exerciseCalorieGoal: 300,
  weightGoal: undefined,
};

// Daily Logs Storage
export const getAllDailyLogs = async (): Promise<{ [date: string]: DailyLog }> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.DAILY_LOGS);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting daily logs:', error);
    return {};
  }
};

export const getDailyLog = async (date: string): Promise<DailyLog | null> => {
  try {
    const allLogs = await getAllDailyLogs();
    return allLogs[date] || null;
  } catch (error) {
    console.error('Error getting daily log:', error);
    return null;
  }
};

export const saveDailyLog = async (log: DailyLog): Promise<void> => {
  try {
    const allLogs = await getAllDailyLogs();
    allLogs[log.date] = log;
    await AsyncStorage.setItem(KEYS.DAILY_LOGS, JSON.stringify(allLogs));
  } catch (error) {
    console.error('Error saving daily log:', error);
    throw error;
  }
};

export const addFoodEntry = async (date: string, entry: FoodLogEntry): Promise<DailyLog> => {
  try {
    let log = await getDailyLog(date);
    
    if (!log) {
      log = {
        date,
        entries: [],
        totalCalories: 0,
      };
    }

    log.entries.push(entry);
    log.totalCalories = calculateTotalCalories(log.entries);
    
    await saveDailyLog(log);
    return log;
  } catch (error) {
    console.error('Error adding food entry:', error);
    throw error;
  }
};

export const removeFoodEntry = async (date: string, entryId: string): Promise<DailyLog> => {
  try {
    let log = await getDailyLog(date);
    
    if (!log) {
      throw new Error('Log not found');
    }

    log.entries = log.entries.filter(e => e.id !== entryId);
    log.totalCalories = calculateTotalCalories(log.entries);
    
    await saveDailyLog(log);
    return log;
  } catch (error) {
    console.error('Error removing food entry:', error);
    throw error;
  }
};

export const updateFoodEntry = async (
  date: string, 
  entryId: string, 
  quantity: number
): Promise<DailyLog> => {
  try {
    let log = await getDailyLog(date);
    
    if (!log) {
      throw new Error('Log not found');
    }

    const entryIndex = log.entries.findIndex(e => e.id === entryId);
    if (entryIndex !== -1) {
      log.entries[entryIndex].quantity = quantity;
    }
    log.totalCalories = calculateTotalCalories(log.entries);
    
    await saveDailyLog(log);
    return log;
  } catch (error) {
    console.error('Error updating food entry:', error);
    throw error;
  }
};

const calculateTotalCalories = (entries: FoodLogEntry[]): number => {
  return entries.reduce((total, entry) => {
    return total + entry.foodItem.caloriesPerUnit * entry.quantity;
  }, 0);
};

// Custom Foods Storage
export const getCustomFoods = async (): Promise<FoodItem[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.CUSTOM_FOODS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting custom foods:', error);
    return [];
  }
};

export const saveCustomFood = async (food: FoodItem): Promise<void> => {
  try {
    const customFoods = await getCustomFoods();
    customFoods.push(food);
    await AsyncStorage.setItem(KEYS.CUSTOM_FOODS, JSON.stringify(customFoods));
  } catch (error) {
    console.error('Error saving custom food:', error);
    throw error;
  }
};

export const deleteCustomFood = async (foodId: string): Promise<void> => {
  try {
    const customFoods = await getCustomFoods();
    const filtered = customFoods.filter(f => f.id !== foodId);
    await AsyncStorage.setItem(KEYS.CUSTOM_FOODS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting custom food:', error);
    throw error;
  }
};

// Settings Storage
export const getSettings = async (): Promise<AppSettings> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error getting settings:', error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

// Get recent entries for quick access
export const getRecentFoods = async (limit: number = 10): Promise<FoodItem[]> => {
  try {
    const allLogs = await getAllDailyLogs();
    const foodCounts: { [id: string]: { food: FoodItem; count: number; lastUsed: number } } = {};
    
    Object.values(allLogs).forEach(log => {
      log.entries.forEach(entry => {
        if (foodCounts[entry.foodItem.id]) {
          foodCounts[entry.foodItem.id].count++;
          foodCounts[entry.foodItem.id].lastUsed = Math.max(
            foodCounts[entry.foodItem.id].lastUsed,
            entry.timestamp
          );
        } else {
          foodCounts[entry.foodItem.id] = {
            food: entry.foodItem,
            count: 1,
            lastUsed: entry.timestamp,
          };
        }
      });
    });

    return Object.values(foodCounts)
      .sort((a, b) => b.lastUsed - a.lastUsed)
      .slice(0, limit)
      .map(item => item.food);
  } catch (error) {
    console.error('Error getting recent foods:', error);
    return [];
  }
};

// Get weekly summary
export const getWeeklySummary = async (): Promise<{ date: string; calories: number }[]> => {
  try {
    const allLogs = await getAllDailyLogs();
    const summary: { date: string; calories: number }[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = getLocalDateString(date);
      
      summary.push({
        date: dateStr,
        calories: allLogs[dateStr]?.totalCalories || 0,
      });
    }
    
    return summary;
  } catch (error) {
    console.error('Error getting weekly summary:', error);
    return [];
  }
};

// Weight Entries Storage
export const getAllWeightEntries = async (): Promise<{ [date: string]: WeightEntry }> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.WEIGHT_ENTRIES);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting weight entries:', error);
    return {};
  }
};

export const getWeightEntry = async (date: string): Promise<WeightEntry | null> => {
  try {
    const allEntries = await getAllWeightEntries();
    return allEntries[date] || null;
  } catch (error) {
    console.error('Error getting weight entry:', error);
    return null;
  }
};

export const saveWeightEntry = async (entry: WeightEntry): Promise<void> => {
  try {
    const allEntries = await getAllWeightEntries();
    allEntries[entry.date] = entry;
    await AsyncStorage.setItem(KEYS.WEIGHT_ENTRIES, JSON.stringify(allEntries));
  } catch (error) {
    console.error('Error saving weight entry:', error);
    throw error;
  }
};

export const deleteWeightEntry = async (date: string): Promise<void> => {
  try {
    const allEntries = await getAllWeightEntries();
    delete allEntries[date];
    await AsyncStorage.setItem(KEYS.WEIGHT_ENTRIES, JSON.stringify(allEntries));
  } catch (error) {
    console.error('Error deleting weight entry:', error);
    throw error;
  }
};

export type WeightPeriod = 'week' | '15days' | 'month' | '3months';

export const getWeightHistory = async (period: WeightPeriod): Promise<WeightEntry[]> => {
  try {
    const allEntries = await getAllWeightEntries();
    const daysMap = {
      'week': 7,
      '15days': 15,
      'month': 30,
      '3months': 90,
    };
    const days = daysMap[period];
    
    const entries: WeightEntry[] = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = getLocalDateString(date);
      
      if (allEntries[dateStr]) {
        entries.push(allEntries[dateStr]);
      }
    }
    
    return entries;
  } catch (error) {
    console.error('Error getting weight history:', error);
    return [];
  }
};

// Exercise Entries Storage
export const getAllExerciseEntries = async (): Promise<{ [date: string]: ExerciseEntry[] }> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.EXERCISE_ENTRIES);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting exercise entries:', error);
    return {};
  }
};

export const getExerciseEntries = async (date: string): Promise<ExerciseEntry[]> => {
  try {
    const allEntries = await getAllExerciseEntries();
    return allEntries[date] || [];
  } catch (error) {
    console.error('Error getting exercise entries:', error);
    return [];
  }
};

export const saveExerciseEntry = async (entry: ExerciseEntry): Promise<void> => {
  try {
    const allEntries = await getAllExerciseEntries();
    if (!allEntries[entry.date]) {
      allEntries[entry.date] = [];
    }
    // Check if updating existing entry
    const existingIndex = allEntries[entry.date].findIndex(e => e.id === entry.id);
    if (existingIndex !== -1) {
      allEntries[entry.date][existingIndex] = entry;
    } else {
      allEntries[entry.date].push(entry);
    }
    await AsyncStorage.setItem(KEYS.EXERCISE_ENTRIES, JSON.stringify(allEntries));
  } catch (error) {
    console.error('Error saving exercise entry:', error);
    throw error;
  }
};

export const deleteExerciseEntry = async (date: string, entryId: string): Promise<void> => {
  try {
    const allEntries = await getAllExerciseEntries();
    if (allEntries[date]) {
      allEntries[date] = allEntries[date].filter(e => e.id !== entryId);
      if (allEntries[date].length === 0) {
        delete allEntries[date];
      }
      await AsyncStorage.setItem(KEYS.EXERCISE_ENTRIES, JSON.stringify(allEntries));
    }
  } catch (error) {
    console.error('Error deleting exercise entry:', error);
    throw error;
  }
};

export const getTodayExerciseCalories = async (date: string): Promise<number> => {
  try {
    const entries = await getExerciseEntries(date);
    return entries.reduce((sum, entry) => sum + entry.caloriesBurnt, 0);
  } catch (error) {
    console.error('Error getting today exercise calories:', error);
    return 0;
  }
};
