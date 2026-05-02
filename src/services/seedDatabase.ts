/**
 * Database Seeding Service
 *
 * Seeds the SQLite database on first launch with:
 *  1. Static foods from foods.ts (~1020+ items)
 *  2. Remote foods from remote-foods.json (fetched from GitHub)
 *  3. Categories from foods.ts
 *  4. Ingredients from ingredients.ts
 *
 * Also migrates existing custom foods from AsyncStorage to SQLite.
 *
 * Runs only once — tracked via metadata table. On subsequent launches,
 * only remote foods are refreshed from GitHub.
 */

import { FoodItem } from '../types';
import { maharashtrianFoods, categories } from '../data/foods';
import { INGREDIENTS } from '../data/ingredients';
import {
  getDatabase,
  bulkInsertFoods,
  insertCategories,
  bulkInsertIngredients,
  isSeeded,
  markSeeded,
  getMetadata,
  setMetadata,
  getAllFoods,
  deleteFoodFromDb,
} from './database';
import { getCustomFoods } from './storage';
import { REMOTE_FOODS_URL, REMOTE_FOODS_FETCH_TIMEOUT_MS } from '../common/constants';

/** Seed the database on first launch */
export async function seedDatabase(): Promise<void> {
  const db = await getDatabase();

  if (await isSeeded(db)) {
    return;
  }

  console.log('[DB Seed] Starting database seeding...');
  const startTime = Date.now();

  // 1. Insert categories
  await insertCategories(db, categories);
  console.log(`[DB Seed] Inserted ${categories.length} categories`);

  // 2. Insert static foods (in batches of 200 to avoid large transactions)
  const BATCH_SIZE = 200;
  for (let i = 0; i < maharashtrianFoods.length; i += BATCH_SIZE) {
    const batch = maharashtrianFoods.slice(i, i + BATCH_SIZE);
    await bulkInsertFoods(db, batch, 'static');
  }
  console.log(`[DB Seed] Inserted ${maharashtrianFoods.length} static foods`);

  // 3. Insert ingredients
  await bulkInsertIngredients(db, INGREDIENTS);
  console.log(`[DB Seed] Inserted ${INGREDIENTS.length} ingredients`);

  // 4. Fetch and insert remote foods
  try {
    const remoteFoods = await fetchRemoteFoodsForSeed();
    if (remoteFoods.length > 0) {
      await bulkInsertFoods(db, remoteFoods, 'remote');
      console.log(`[DB Seed] Inserted ${remoteFoods.length} remote foods`);
    }
  } catch (error) {
    console.warn('[DB Seed] Failed to fetch remote foods, will retry later:', error);
  }

  // 5. Migrate existing custom foods from AsyncStorage
  try {
    const customFoods = await getCustomFoods();
    if (customFoods.length > 0) {
      await bulkInsertFoods(db, customFoods, 'custom');
      console.log(`[DB Seed] Migrated ${customFoods.length} custom foods from AsyncStorage`);
    }
  } catch (error) {
    console.warn('[DB Seed] Failed to migrate custom foods:', error);
  }

  await markSeeded(db);
  const elapsed = Date.now() - startTime;
  console.log(`[DB Seed] Database seeding complete in ${elapsed}ms`);
}

/** Refresh remote foods from GitHub (runs on every app launch after seeding) */
export async function refreshRemoteFoods(): Promise<FoodItem[]> {
  const db = await getDatabase();

  try {
    const currentVersion = await getMetadata(db, 'remote_foods_version');
    const response = await fetchWithTimeout(REMOTE_FOODS_URL, REMOTE_FOODS_FETCH_TIMEOUT_MS);
    const data = await response.json();

    if (!data.foods || !Array.isArray(data.foods)) {
      return getAllFoods(db, { source: 'remote' });
    }

    const newVersion = String(data.version ?? 0);
    if (currentVersion === newVersion) {
      return getAllFoods(db, { source: 'remote' });
    }

    // Delete old remote foods
    const oldRemote = await getAllFoods(db, { source: 'remote' });
    for (const food of oldRemote) {
      await deleteFoodFromDb(db, food.id);
    }

    // Insert new remote foods
    const remoteFoods: FoodItem[] = data.foods;
    if (remoteFoods.length > 0) {
      await bulkInsertFoods(db, remoteFoods, 'remote');
    }

    await setMetadata(db, 'remote_foods_version', newVersion);
    console.log(`[DB] Refreshed ${remoteFoods.length} remote foods (v${newVersion})`);

    return remoteFoods;
  } catch (error) {
    console.warn('[DB] Failed to refresh remote foods:', error);
    return getAllFoods(db, { source: 'remote' });
  }
}

/** Fetch remote-foods.json for initial seeding */
async function fetchRemoteFoodsForSeed(): Promise<FoodItem[]> {
  const response = await fetchWithTimeout(REMOTE_FOODS_URL, REMOTE_FOODS_FETCH_TIMEOUT_MS);
  const data = await response.json();

  if (!data.foods || !Array.isArray(data.foods)) {
    return [];
  }

  const db = await getDatabase();
  await setMetadata(db, 'remote_foods_version', String(data.version ?? 0));

  return data.foods;
}

function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timeoutId));
}
