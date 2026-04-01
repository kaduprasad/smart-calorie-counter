import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { DailyLog, FoodItem, FoodLogEntry, MacroTotals } from '../types';
import {
  getDailyLog,
  addFoodEntry,
  removeFoodEntry,
  updateFoodEntry,
  getTodayDate,
  getAllDailyLogs,
} from '../services/storage';

interface LogContextType {
  todayLog: DailyLog | null;
  allLogs: { [date: string]: DailyLog };
  selectedDate: string;
  macroTotals: MacroTotals;
  isLoading: boolean;
  setSelectedDate: (date: string) => void;
  addFood: (food: FoodItem, quantity: number) => Promise<void>;
  removeFood: (entryId: string) => Promise<void>;
  updateQuantity: (entryId: string, quantity: number) => Promise<void>;
  refreshData: () => Promise<void>;
  loadLogs: (date?: string) => Promise<void>;
}

// Callback ref so LogContext can tell FoodContext to refresh recent foods
let onFoodAddedCallback: (() => Promise<void>) | null = null;
export const setOnFoodAddedCallback = (cb: () => Promise<void>) => {
  onFoodAddedCallback = cb;
};

const LogContext = createContext<LogContextType | undefined>(undefined);

export const LogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [allLogs, setAllLogs] = useState<{ [date: string]: DailyLog }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDateState] = useState(getTodayDate());

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

  const loadLogs = useCallback(async (date?: string) => {
    const d = date || selectedDate;
    const [log, logs] = await Promise.all([
      getDailyLog(d),
      getAllDailyLogs(),
    ]);
    setTodayLog(log);
    setAllLogs(logs);
    setIsLoading(false);
  }, [selectedDate]);

  const setSelectedDate = useCallback((date: string) => {
    setSelectedDateState(date);
  }, []);

  // Re-fetch log when selectedDate changes (skip initial mount — orchestrator handles that)
  const hasInit = useRef(false);
  useEffect(() => {
    if (!hasInit.current) {
      hasInit.current = true;
      return;
    }
    loadLogs(selectedDate);
  }, [selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const addFood = useCallback(async (food: FoodItem, quantity: number) => {
    const entry: FoodLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      foodItem: food,
      quantity,
      timestamp: Date.now(),
    };

    const updatedLog = await addFoodEntry(selectedDate, entry);
    setTodayLog(updatedLog);
    setAllLogs(prev => ({ ...prev, [selectedDate]: updatedLog }));

    // Notify FoodContext to refresh recent foods
    if (onFoodAddedCallback) {
      await onFoodAddedCallback();
    }
  }, [selectedDate]);

  const removeFood = useCallback(async (entryId: string) => {
    const updatedLog = await removeFoodEntry(selectedDate, entryId);
    setTodayLog(updatedLog);
    setAllLogs(prev => ({ ...prev, [selectedDate]: updatedLog }));
  }, [selectedDate]);

  const updateQuantity = useCallback(async (entryId: string, quantity: number) => {
    const updatedLog = await updateFoodEntry(selectedDate, entryId, quantity);
    setTodayLog(updatedLog);
    setAllLogs(prev => ({ ...prev, [selectedDate]: updatedLog }));
  }, [selectedDate]);

  const refreshData = useCallback(async () => {
    await loadLogs();
  }, [loadLogs]);

  return (
    <LogContext.Provider
      value={{
        todayLog,
        allLogs,
        selectedDate,
        macroTotals,
        isLoading,
        setSelectedDate,
        addFood,
        removeFood,
        updateQuantity,
        refreshData,
        loadLogs,
      }}
    >
      {children}
    </LogContext.Provider>
  );
};

export const useLog = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLog must be used within a LogProvider');
  }
  return context;
};
