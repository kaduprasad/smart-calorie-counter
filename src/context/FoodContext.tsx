import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
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

// SQLite imports — only used on native
const loadSqliteModules = async () => {
  const database = await import('../services/database');
  const seed = await import('../services/seedDatabase');
  return { database, seed };
};

const isNative = Platform.OS !== 'web';

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
  const [allFoods, setAllFoods] = useState<FoodItem[]>([]);
  const [customFoods, setCustomFoods] = useState<FoodItem[]>(cachedCustomFoods || []);
  const [recentFoods, setRecentFoods] = useState<FoodItem[]>([]);
  const [pinnedFoodIds, setPinnedFoodIds] = useState<string[]>([]);

  const foodIndex = useMemo(() => getFoodIndex(allFoods), [allFoods]);

  // ─── Native (SQLite) load path ──────────────────────────────────────
  const loadFoodsNative = useCallback(async () => {
    const { database, seed } = await loadSqliteModules();

    // Seed DB on first launch (no-op if already seeded)
    await seed.seedDatabase();

    const db = await database.getDatabase();

    // Load all foods from SQLite
    const [foods, recent, pinned] = await Promise.all([
      database.getAllFoods(db),
      getRecentFoods(),
      getPinnedFoodIds(),
    ]);

    setAllFoods(foods);
    setCustomFoods(foods.filter(f => f.isCustom));
    setRecentFoods(recent);
    setPinnedFoodIds(pinned);
    cachedCustomFoods = foods.filter(f => f.isCustom);

    // Refresh remote foods in background
    seed.refreshRemoteFoods().then(async () => {
      const refreshedFoods = await database.getAllFoods(db);
      setAllFoods(refreshedFoods);
    });
  }, []);

  // ─── Web (in-memory) fallback ───────────────────────────────────────
  const loadFoodsWeb = useCallback(async () => {
    const [customs, cachedRemote, recent, pinned] = await Promise.all([
      getCustomFoods(),
      getCachedRemoteFoods(),
      getRecentFoods(),
      getPinnedFoodIds(),
    ]);

    const foods = [...maharashtrianFoods, ...cachedRemote, ...customs];
    setAllFoods(foods);
    setCustomFoods(customs);
    setRecentFoods(recent);
    setPinnedFoodIds(pinned);
    cachedCustomFoods = customs;

    // Fetch latest remote foods in background
    fetchRemoteFoods().then(remoteFoods => {
      setAllFoods([...maharashtrianFoods, ...remoteFoods, ...customs]);
    });
  }, []);

  const loadFoods = useCallback(async () => {
    if (isNative) {
      await loadFoodsNative();
    } else {
      await loadFoodsWeb();
    }
  }, [loadFoodsNative, loadFoodsWeb]);

  // ─── Create custom food ─────────────────────────────────────────────
  const createCustomFood = useCallback(async (food: FoodItem) => {
    if (isNative) {
      const { database } = await loadSqliteModules();
      const db = await database.getDatabase();
      await database.insertFood(db, food, 'custom');
    } else {
      await saveCustomFood(food);
    }
    setCustomFoods(prev => [...prev, food]);
    setAllFoods(prev => [...prev, food]);
  }, []);

  // ─── Remove custom food ─────────────────────────────────────────────
  const removeCustomFood = useCallback(async (foodId: string) => {
    if (isNative) {
      const { database } = await loadSqliteModules();
      const db = await database.getDatabase();
      await database.deleteFoodFromDb(db, foodId);
    } else {
      await deleteCustomFood(foodId);
    }
    setCustomFoods(prev => prev.filter(f => f.id !== foodId));
    setAllFoods(prev => prev.filter(f => f.id !== foodId));
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
