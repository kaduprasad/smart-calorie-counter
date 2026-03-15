import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodItem } from '../types';

const REMOTE_FOODS_URL =
  'https://raw.githubusercontent.com/kaduprasad/smart-calorie-counter/main/data/remote-foods.json';

const KEYS = {
  REMOTE_FOODS: 'remote_foods_cache',
  REMOTE_FOODS_VERSION: 'remote_foods_version',
};

interface RemoteFoodsPayload {
  version: number;
  foods: FoodItem[];
}

/**
 * Load cached remote foods from AsyncStorage (instant, offline-safe).
 */
export const getCachedRemoteFoods = async (): Promise<FoodItem[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.REMOTE_FOODS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/**
 * Fetch remote foods from GitHub and cache them if the version is newer.
 * Returns the (possibly updated) list; never throws.
 */
export const fetchRemoteFoods = async (): Promise<FoodItem[]> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(REMOTE_FOODS_URL, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) return getCachedRemoteFoods();

    const payload: RemoteFoodsPayload = await response.json();

    // Check version – only update cache when newer
    const storedVersion = await AsyncStorage.getItem(KEYS.REMOTE_FOODS_VERSION);
    const currentVersion = storedVersion ? parseInt(storedVersion, 10) : 0;

    if (payload.version > currentVersion) {
      await AsyncStorage.setItem(KEYS.REMOTE_FOODS, JSON.stringify(payload.foods));
      await AsyncStorage.setItem(KEYS.REMOTE_FOODS_VERSION, String(payload.version));
      return payload.foods;
    }

    // Version unchanged — return cache
    return getCachedRemoteFoods();
  } catch {
    // Network error / timeout — silently fall back to cache
    return getCachedRemoteFoods();
  }
};
