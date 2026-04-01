import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { FoodItem } from '../types';
import { FoodIndex, getFoodIndex } from '../naturalLanguageProcessingEngine';
import {
  getCustomFoods,
  saveCustomFood,
  deleteCustomFood,
  getRecentFoods,
  getPinnedFoodIds,
  togglePinnedFood,
} from '../services/storage';
import { maharashtrianFoods } from '../data/foods';
import { getCachedRemoteFoods, fetchRemoteFoods } from '../services/remoteFoodService';

interface FoodContextType {
  allFoods: FoodItem[];
  foodIndex: FoodIndex;
  customFoods: FoodItem[];
  recentFoods: FoodItem[];
  pinnedFoodIds: string[];
  createCustomFood: (food: FoodItem) => Promise<void>;
  removeCustomFood: (foodId: string) => Promise<void>;
  togglePinFood: (foodId: string) => Promise<void>;
  refreshRecentFoods: () => Promise<void>;
  loadFoods: () => Promise<void>;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

let cachedCustomFoods: FoodItem[] | null = null;

export const FoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customFoods, setCustomFoods] = useState<FoodItem[]>(cachedCustomFoods || []);
  const [remoteFoods, setRemoteFoods] = useState<FoodItem[]>([]);
  const [recentFoods, setRecentFoods] = useState<FoodItem[]>([]);
  const [pinnedFoodIds, setPinnedFoodIds] = useState<string[]>([]);

  const allFoods = useMemo(
    () => [...maharashtrianFoods, ...remoteFoods, ...customFoods],
    [remoteFoods, customFoods],
  );

  const foodIndex = useMemo(() => getFoodIndex(allFoods), [allFoods]);

  const loadFoods = useCallback(async () => {
    const [customs, cachedRemote, recent, pinned] = await Promise.all([
      getCustomFoods(),
      getCachedRemoteFoods(),
      getRecentFoods(),
      getPinnedFoodIds(),
    ]);
    setCustomFoods(customs);
    setRemoteFoods(cachedRemote);
    setRecentFoods(recent);
    setPinnedFoodIds(pinned);
    cachedCustomFoods = customs;

    // Fetch latest remote foods in background
    fetchRemoteFoods().then(setRemoteFoods);
  }, []);

  const createCustomFood = useCallback(async (food: FoodItem) => {
    await saveCustomFood(food);
    setCustomFoods(prev => [...prev, food]);
  }, []);

  const removeCustomFood = useCallback(async (foodId: string) => {
    await deleteCustomFood(foodId);
    setCustomFoods(prev => prev.filter(f => f.id !== foodId));
  }, []);

  const togglePinFood = useCallback(async (foodId: string) => {
    const updated = await togglePinnedFood(foodId);
    setPinnedFoodIds(updated);
  }, []);

  const refreshRecentFoods = useCallback(async () => {
    const recent = await getRecentFoods();
    setRecentFoods(recent);
  }, []);

  return (
    <FoodContext.Provider
      value={{
        allFoods,
        foodIndex,
        customFoods,
        recentFoods,
        pinnedFoodIds,
        createCustomFood,
        removeCustomFood,
        togglePinFood,
        refreshRecentFoods,
        loadFoods,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = () => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error('useFood must be used within a FoodProvider');
  }
  return context;
};
