import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DailyLog, FoodItem, FoodLogEntry, AppSettings } from '../types';
import {
  getDailyLog,
  addFoodEntry,
  removeFoodEntry,
  updateFoodEntry,
  getCustomFoods,
  saveCustomFood,
  deleteCustomFood,
  getSettings,
  saveSettings,
  getTodayDate,
  getAllDailyLogs,
  getRecentFoods,
} from '../services/storage';
import { scheduleDailyReminder } from '../services/notifications';
import { maharashtrianFoods } from '../data/foods';

interface AppContextType {
  // State
  todayLog: DailyLog | null;
  customFoods: FoodItem[];
  allFoods: FoodItem[];
  settings: AppSettings;
  recentFoods: FoodItem[];
  allLogs: { [date: string]: DailyLog };
  isLoading: boolean;
  selectedDate: string;

  // Actions
  setSelectedDate: (date: string) => void;
  addFood: (food: FoodItem, quantity: number) => Promise<void>;
  removeFood: (entryId: string) => Promise<void>;
  updateQuantity: (entryId: string, quantity: number) => Promise<void>;
  createCustomFood: (food: FoodItem) => Promise<void>;
  removeCustomFood: (foodId: string) => Promise<void>;
  updateSettings: (settings: AppSettings) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [customFoods, setCustomFoods] = useState<FoodItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    notificationEnabled: true,
    notificationTime: { hour: 22, minute: 0 },
    dailyCalorieGoal: 2000,
    exerciseCalorieGoal: 300,
  });
  const [recentFoods, setRecentFoods] = useState<FoodItem[]>([]);
  const [allLogs, setAllLogs] = useState<{ [date: string]: DailyLog }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  // Combine default foods with custom foods
  const allFoods = [...maharashtrianFoods, ...customFoods];

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [log, customs, appSettings, recent, logs] = await Promise.all([
        getDailyLog(selectedDate),
        getCustomFoods(),
        getSettings(),
        getRecentFoods(),
        getAllDailyLogs(),
      ]);

      setTodayLog(log);
      setCustomFoods(customs);
      setSettings(appSettings);
      setRecentFoods(recent);
      setAllLogs(logs);

      // Schedule notification
      await scheduleDailyReminder(appSettings);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addFood = async (food: FoodItem, quantity: number) => {
    const entry: FoodLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      foodItem: food,
      quantity,
      timestamp: Date.now(),
    };

    const updatedLog = await addFoodEntry(selectedDate, entry);
    setTodayLog(updatedLog);
    setAllLogs(prev => ({ ...prev, [selectedDate]: updatedLog }));
    
    // Update recent foods
    const recent = await getRecentFoods();
    setRecentFoods(recent);
  };

  const removeFood = async (entryId: string) => {
    const updatedLog = await removeFoodEntry(selectedDate, entryId);
    setTodayLog(updatedLog);
    setAllLogs(prev => ({ ...prev, [selectedDate]: updatedLog }));
  };

  const updateQuantity = async (entryId: string, quantity: number) => {
    const updatedLog = await updateFoodEntry(selectedDate, entryId, quantity);
    setTodayLog(updatedLog);
    setAllLogs(prev => ({ ...prev, [selectedDate]: updatedLog }));
  };

  const createCustomFood = async (food: FoodItem) => {
    await saveCustomFood(food);
    setCustomFoods(prev => [...prev, food]);
  };

  const removeCustomFood = async (foodId: string) => {
    await deleteCustomFood(foodId);
    setCustomFoods(prev => prev.filter(f => f.id !== foodId));
  };

  const updateSettings = async (newSettings: AppSettings) => {
    await saveSettings(newSettings);
    setSettings(newSettings);

    // Reschedule notification
    await scheduleDailyReminder(newSettings);
  };

  const refreshData = async () => {
    await loadData();
  };

  return (
    <AppContext.Provider
      value={{
        todayLog,
        customFoods,
        allFoods,
        settings,
        recentFoods,
        allLogs,
        isLoading,
        selectedDate,
        setSelectedDate,
        addFood,
        removeFood,
        updateQuantity,
        createCustomFood,
        removeCustomFood,
        updateSettings,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
