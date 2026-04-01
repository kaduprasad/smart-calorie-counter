import React, { useEffect, useCallback } from 'react';
import { SettingsProvider, useSettings } from './SettingsContext';
import { FoodProvider, useFood } from './FoodContext';
import { LogProvider, useLog, setOnFoodAddedCallback } from './LogContext';
import { scheduleDailyReminder } from '../services/notifications';

/**
 * Orchestrator that loads all data on mount and wires cross-context callbacks.
 */
const AppOrchestrator: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loadSettings, loadMacroTargets } = useSettings();
  const { loadFoods, refreshRecentFoods } = useFood();
  const { loadLogs } = useLog();

  // Wire the cross-context callback: when food is added to log, refresh recent foods
  useEffect(() => {
    setOnFoodAddedCallback(refreshRecentFoods);
  }, [refreshRecentFoods]);

  // Single coordinated initial load
  useEffect(() => {
    const init = async () => {
      const [settings] = await Promise.all([
        loadSettings(),
        loadMacroTargets(),
        loadFoods(),
        loadLogs(),
      ]);
      await scheduleDailyReminder(settings);
    };
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
};

/**
 * Top-level provider that nests Settings → Food → Log → Orchestrator.
 * Order matters: inner providers can depend on outer ones.
 */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SettingsProvider>
      <FoodProvider>
        <LogProvider>
          <AppOrchestrator>
            {children}
          </AppOrchestrator>
        </LogProvider>
      </FoodProvider>
    </SettingsProvider>
  );
};

/**
 * Backward-compatible hook that composes all three contexts.
 * Screens can use this during migration, then switch to specific hooks.
 */
export const useApp = () => {
  const settings = useSettings();
  const food = useFood();
  const log = useLog();

  return {
    // Settings
    settings: settings.settings,
    macroTargets: settings.macroTargets,
    updateSettings: settings.updateSettings,
    // Food
    allFoods: food.allFoods,
    foodIndex: food.foodIndex,
    customFoods: food.customFoods,
    recentFoods: food.recentFoods,
    pinnedFoodIds: food.pinnedFoodIds,
    createCustomFood: food.createCustomFood,
    removeCustomFood: food.removeCustomFood,
    togglePinFood: food.togglePinFood,
    // Logs
    todayLog: log.todayLog,
    allLogs: log.allLogs,
    selectedDate: log.selectedDate,
    macroTotals: log.macroTotals,
    isLoading: log.isLoading,
    setSelectedDate: log.setSelectedDate,
    addFood: log.addFood,
    removeFood: log.removeFood,
    updateQuantity: log.updateQuantity,
    refreshData: log.refreshData,
  };
};
