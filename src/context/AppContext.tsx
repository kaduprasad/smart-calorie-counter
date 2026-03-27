import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { DailyLog, FoodItem, FoodLogEntry, AppSettings, MacroTotals, MacroTargets, UserData } from '../types';
import { FoodIndex, getFoodIndex } from '../naturalLanguageProcessingEngine';
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
  getPinnedFoodIds,
  togglePinnedFood,
} from '../services/storage';
import { scheduleDailyReminder } from '../services/notifications';
import { maharashtrianFoods } from '../data/foods';
import { getCachedRemoteFoods, fetchRemoteFoods } from '../services/remoteFoodService';
import { getUserData } from '../services/userDataService';
import { calculateMacroTargets } from '../utils/macroTargets';
import { DEFAULT_SETTINGS, DEFAULT_MACRO_TARGETS } from '../common/constants';

interface AppContextType {
  // State
  todayLog: DailyLog | null;
  customFoods: FoodItem[];
  allFoods: FoodItem[];
  foodIndex: FoodIndex;
  settings: AppSettings;
  recentFoods: FoodItem[];
  pinnedFoodIds: string[];
  allLogs: { [date: string]: DailyLog };
  isLoading: boolean;
  selectedDate: string;
  macroTotals: MacroTotals;
  macroTargets: MacroTargets;

  // Actions
  setSelectedDate: (date: string) => void;
  addFood: (food: FoodItem, quantity: number) => Promise<void>;
  removeFood: (entryId: string) => Promise<void>;
  updateQuantity: (entryId: string, quantity: number) => Promise<void>;
  createCustomFood: (food: FoodItem) => Promise<void>;
  removeCustomFood: (foodId: string) => Promise<void>;
  updateSettings: (settings: AppSettings) => Promise<void>;
  togglePinFood: (foodId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Cache for initial load to prevent redundant data fetching
let cachedSettings: AppSettings | null = null;
let cachedCustomFoods: FoodItem[] | null = null;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [customFoods, setCustomFoods] = useState<FoodItem[]>(cachedCustomFoods || []);
  const [settings, setSettings] = useState<AppSettings>(cachedSettings || DEFAULT_SETTINGS);
  const [recentFoods, setRecentFoods] = useState<FoodItem[]>([]);
  const [pinnedFoodIds, setPinnedFoodIds] = useState<string[]>([]);
  const [allLogs, setAllLogs] = useState<{ [date: string]: DailyLog }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [macroTargets, setMacroTargets] = useState<MacroTargets>(DEFAULT_MACRO_TARGETS);
  const [remoteFoods, setRemoteFoods] = useState<FoodItem[]>([]);
  const hasInitialLoad = React.useRef(false);

  // Combine default + remote + custom foods (stable ref via useMemo)
  const allFoods = useMemo(
    () => [...maharashtrianFoods, ...remoteFoods, ...customFoods],
    [remoteFoods, customFoods],
  );

  // Build / return cached food index (O(n) once, then O(1) on re-renders)
  const foodIndex = useMemo(() => getFoodIndex(allFoods), [allFoods]);

  // Compute macro totals from today's log entries
  const macroTotals = useMemo<MacroTotals>(() => {
    if (!todayLog || todayLog.entries.length === 0) {
      return { protein: 0, fat: 0, fiber: 0 };
    }
    return todayLog.entries.reduce(
      (acc, entry) => {
        const qty = entry.quantity;
        const food = entry.foodItem;
        return {
          protein: acc.protein + Math.round((food.proteinPerUnit || 0) * qty),
          fat: acc.fat + Math.round((food.fatPerUnit || 0) * qty),
          fiber: acc.fiber + Math.round((food.fiberPerUnit || 0) * qty),
        };
      },
      { protein: 0, fat: 0, fiber: 0 },
    );
  }, [todayLog]);

  const loadData = useCallback(async () => {
    // Only show loading on initial load or date change
    const isInitialLoad = !hasInitialLoad.current;
    if (isInitialLoad) {
      setIsLoading(true);
    }

    try {
      // For initial load, fetch everything in parallel
      if (isInitialLoad) {
        const [log, customs, appSettings, recent, logs, userData, cachedRemote, pinned] = await Promise.all([
          getDailyLog(selectedDate),
          getCustomFoods(),
          getSettings(),
          getRecentFoods(),
          getAllDailyLogs(),
          getUserData(),
          getCachedRemoteFoods(),
          getPinnedFoodIds(),
        ]);

        setTodayLog(log);
        setCustomFoods(customs);
        setSettings(appSettings);
        setRecentFoods(recent);
        setPinnedFoodIds(pinned);
        setAllLogs(logs);
        setMacroTargets(calculateMacroTargets(userData));
        setRemoteFoods(cachedRemote);

        // Cache settings and custom foods for faster subsequent opens
        cachedSettings = appSettings;
        cachedCustomFoods = customs;

        // Schedule notification
        await scheduleDailyReminder(appSettings);
        hasInitialLoad.current = true;

        // Fetch latest remote foods in the background (non-blocking)
        fetchRemoteFoods().then(setRemoteFoods);
      } else {
        // For date changes, only fetch what's needed
        const [log, logs] = await Promise.all([
          getDailyLog(selectedDate),
          getAllDailyLogs(),
        ]);
        setTodayLog(log);
        setAllLogs(logs);
      }
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

  const togglePinFood = async (foodId: string) => {
    const updated = await togglePinnedFood(foodId);
    setPinnedFoodIds(updated);
  };

  return (
    <AppContext.Provider
      value={{
        todayLog,
        customFoods,
        allFoods,
        foodIndex,
        settings,
        recentFoods,
        pinnedFoodIds,
        allLogs,
        isLoading,
        selectedDate,
        macroTotals,
        macroTargets,
        setSelectedDate,
        addFood,
        removeFood,
        updateQuantity,
        createCustomFood,
        removeCustomFood,
        updateSettings,
        togglePinFood,
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
