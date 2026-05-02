/**
 * SQLite Database Service
 *
 * Central database layer replacing in-memory TS arrays + remote JSON.
 * All food data lives in SQLite for fast indexed queries at scale (5000+ items).
 *
 * Schema design:
 *  - `foods` table: all food items (static, remote, custom) with source column
 *  - `food_keywords` table: many-to-many search keywords for efficient lookup
 *  - `ingredients` table: cooking ingredients (per-100g nutrition)
 *  - `categories` table: category display info
 *  - FTS5 virtual table for full-text search integration
 *
 * Indexes on: id, category, source, name. FTS5 for text search.
 */

import * as SQLite from 'expo-sqlite';
import { FoodItem, FoodCategory, FoodUnit } from '../types';

// ─── Database instance ──────────────────────────────────────────────────

const DB_NAME = 'calorie_tracker.db';
const DB_VERSION = 1;

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync(DB_NAME);
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync('PRAGMA foreign_keys = ON;');
  await initializeDatabase(db);
  return db;
}

// ─── Schema ─────────────────────────────────────────────────────────────

async function initializeDatabase(database: SQLite.SQLiteDatabase): Promise<void> {
  const result = await database.getFirstAsync<{ user_version: number }>('PRAGMA user_version;');
  const currentVersion = result?.user_version ?? 0;

  if (currentVersion < DB_VERSION) {
    await createTables(database);
    await database.execAsync(`PRAGMA user_version = ${DB_VERSION};`);
  }
}

async function createTables(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    -- Main foods table
    -- source: 'static' (from foods.ts), 'remote' (from remote-foods.json), 'custom' (user-created)
    CREATE TABLE IF NOT EXISTS foods (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      name_marathi TEXT,
      category TEXT NOT NULL,
      calories_per_unit REAL NOT NULL,
      protein_per_unit REAL,
      fat_per_unit REAL,
      fiber_per_unit REAL,
      carbs_per_unit REAL,
      sugar_per_unit REAL,
      sodium_per_unit REAL,
      calcium_per_unit REAL,
      iron_per_unit REAL,
      vitamin_c_per_unit REAL,
      unit TEXT NOT NULL,
      unit_weight REAL,
      source TEXT NOT NULL DEFAULT 'static',
      is_custom INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER,
      updated_at INTEGER
    );

    -- Search keywords (many-to-many: one food can have many keywords)
    CREATE TABLE IF NOT EXISTS food_keywords (
      food_id TEXT NOT NULL,
      keyword TEXT NOT NULL,
      PRIMARY KEY (food_id, keyword),
      FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
    );

    -- Category display info
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    -- Cooking ingredients (per-100g nutrition, used by RecipeBuilder)
    CREATE TABLE IF NOT EXISTS ingredients (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      name_local TEXT,
      category TEXT NOT NULL,
      calories_per_100g REAL NOT NULL,
      protein_per_100g REAL NOT NULL,
      fat_per_100g REAL NOT NULL,
      fiber_per_100g REAL NOT NULL,
      common_measure TEXT,
      measure_grams REAL
    );

    -- FTS5 virtual table for full-text search
    -- Combines name, marathi name, and keywords into a single searchable index
    CREATE VIRTUAL TABLE IF NOT EXISTS foods_fts USING fts5(
      food_id UNINDEXED,
      name,
      name_marathi,
      keywords,
      content='',
      tokenize='unicode61 remove_diacritics 2'
    );

    -- Indexes for fast lookups
    CREATE INDEX IF NOT EXISTS idx_foods_category ON foods(category);
    CREATE INDEX IF NOT EXISTS idx_foods_source ON foods(source);
    CREATE INDEX IF NOT EXISTS idx_foods_name ON foods(name COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_foods_is_custom ON foods(is_custom);
    CREATE INDEX IF NOT EXISTS idx_food_keywords_keyword ON food_keywords(keyword COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_ingredients_category ON ingredients(category);

    -- Remote foods version tracking
    CREATE TABLE IF NOT EXISTS metadata (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);
}

// ─── Food CRUD ──────────────────────────────────────────────────────────

/** Insert a single food item into the database */
export async function insertFood(database: SQLite.SQLiteDatabase, food: FoodItem, source: 'static' | 'remote' | 'custom'): Promise<void> {
  const now = Date.now();
  await database.runAsync(
    `INSERT OR REPLACE INTO foods (
      id, name, name_marathi, category, calories_per_unit,
      protein_per_unit, fat_per_unit, fiber_per_unit,
      unit, unit_weight, source, is_custom, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    food.id,
    food.name,
    food.nameMarathi ?? null,
    food.category,
    food.caloriesPerUnit,
    food.proteinPerUnit ?? null,
    food.fatPerUnit ?? null,
    food.fiberPerUnit ?? null,
    food.unit,
    food.unitWeight ?? null,
    source,
    source === 'custom' ? 1 : 0,
    now,
    now,
  );

  // Insert search keywords
  if (food.searchKeywords?.length) {
    // Delete old keywords first (for REPLACE case)
    await database.runAsync('DELETE FROM food_keywords WHERE food_id = ?', food.id);
    for (const keyword of food.searchKeywords) {
      await database.runAsync(
        'INSERT OR IGNORE INTO food_keywords (food_id, keyword) VALUES (?, ?)',
        food.id,
        keyword.toLowerCase(),
      );
    }
  }

  // Update FTS index
  await updateFoodFTS(database, food);
}

/** Bulk insert foods in a single transaction — used during seeding */
export async function bulkInsertFoods(
  database: SQLite.SQLiteDatabase,
  foods: FoodItem[],
  source: 'static' | 'remote' | 'custom',
): Promise<void> {
  const now = Date.now();

  await database.withTransactionAsync(async () => {
    const foodStmt = await database.prepareAsync(
      `INSERT OR REPLACE INTO foods (
        id, name, name_marathi, category, calories_per_unit,
        protein_per_unit, fat_per_unit, fiber_per_unit,
        unit, unit_weight, source, is_custom, created_at, updated_at
      ) VALUES ($id, $name, $nameMarathi, $category, $caloriesPerUnit,
        $proteinPerUnit, $fatPerUnit, $fiberPerUnit,
        $unit, $unitWeight, $source, $isCustom, $createdAt, $updatedAt)`
    );

    const kwStmt = await database.prepareAsync(
      'INSERT OR IGNORE INTO food_keywords (food_id, keyword) VALUES ($foodId, $keyword)'
    );

    const ftsStmt = await database.prepareAsync(
      `INSERT INTO foods_fts (food_id, name, name_marathi, keywords)
       VALUES ($foodId, $name, $nameMarathi, $keywords)`
    );

    try {
      for (const food of foods) {
        await foodStmt.executeAsync({
          $id: food.id,
          $name: food.name,
          $nameMarathi: food.nameMarathi ?? null,
          $category: food.category,
          $caloriesPerUnit: food.caloriesPerUnit,
          $proteinPerUnit: food.proteinPerUnit ?? null,
          $fatPerUnit: food.fatPerUnit ?? null,
          $fiberPerUnit: food.fiberPerUnit ?? null,
          $unit: food.unit,
          $unitWeight: food.unitWeight ?? null,
          $source: source,
          $isCustom: source === 'custom' ? 1 : 0,
          $createdAt: now,
          $updatedAt: now,
        });

        // Keywords
        if (food.searchKeywords?.length) {
          for (const keyword of food.searchKeywords) {
            await kwStmt.executeAsync({
              $foodId: food.id,
              $keyword: keyword.toLowerCase(),
            });
          }
        }

        // FTS
        const keywordsStr = food.searchKeywords?.join(' ') ?? '';
        await ftsStmt.executeAsync({
          $foodId: food.id,
          $name: food.name.toLowerCase(),
          $nameMarathi: food.nameMarathi?.toLowerCase() ?? '',
          $keywords: keywordsStr.toLowerCase(),
        });
      }
    } finally {
      await foodStmt.finalizeAsync();
      await kwStmt.finalizeAsync();
      await ftsStmt.finalizeAsync();
    }
  });
}

/** Update FTS entry for a single food */
async function updateFoodFTS(database: SQLite.SQLiteDatabase, food: FoodItem): Promise<void> {
  // Delete old FTS entry
  await database.runAsync('DELETE FROM foods_fts WHERE food_id = ?', food.id);
  // Insert new
  const keywordsStr = food.searchKeywords?.join(' ') ?? '';
  await database.runAsync(
    `INSERT INTO foods_fts (food_id, name, name_marathi, keywords)
     VALUES (?, ?, ?, ?)`,
    food.id,
    food.name.toLowerCase(),
    food.nameMarathi?.toLowerCase() ?? '',
    keywordsStr.toLowerCase(),
  );
}

/** Get all foods, optionally filtered by source and/or category */
export async function getAllFoods(
  database: SQLite.SQLiteDatabase,
  options?: { source?: string; category?: FoodCategory },
): Promise<FoodItem[]> {
  let sql = 'SELECT f.*, GROUP_CONCAT(k.keyword, \'|\') as keywords_str FROM foods f LEFT JOIN food_keywords k ON f.id = k.food_id';
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (options?.source) {
    conditions.push('f.source = ?');
    params.push(options.source);
  }
  if (options?.category) {
    conditions.push('f.category = ?');
    params.push(options.category);
  }

  if (conditions.length) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  sql += ' GROUP BY f.id ORDER BY f.name COLLATE NOCASE';

  const rows = await database.getAllAsync<FoodRow>(sql, ...params);
  return rows.map(rowToFoodItem);
}

/** Get a single food by ID */
export async function getFoodByIdFromDb(
  database: SQLite.SQLiteDatabase,
  id: string,
): Promise<FoodItem | null> {
  const row = await database.getFirstAsync<FoodRow>(
    `SELECT f.*, GROUP_CONCAT(k.keyword, '|') as keywords_str
     FROM foods f LEFT JOIN food_keywords k ON f.id = k.food_id
     WHERE f.id = ? GROUP BY f.id`,
    id,
  );
  return row ? rowToFoodItem(row) : null;
}

/** Delete a food by ID */
export async function deleteFoodFromDb(database: SQLite.SQLiteDatabase, id: string): Promise<void> {
  await database.runAsync('DELETE FROM foods_fts WHERE food_id = ?', id);
  await database.runAsync('DELETE FROM foods WHERE id = ?', id);
}

/** Get food count by source */
export async function getFoodCount(
  database: SQLite.SQLiteDatabase,
  source?: string,
): Promise<number> {
  const sql = source
    ? 'SELECT COUNT(*) as count FROM foods WHERE source = ?'
    : 'SELECT COUNT(*) as count FROM foods';
  const params = source ? [source] : [];
  const result = await database.getFirstAsync<{ count: number }>(sql, ...params);
  return result?.count ?? 0;
}

/** Check if a food exists by ID */
export async function foodExists(database: SQLite.SQLiteDatabase, id: string): Promise<boolean> {
  const result = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM foods WHERE id = ?',
    id,
  );
  return (result?.count ?? 0) > 0;
}

/** Find potential duplicate foods by name (case-insensitive) */
export async function findDuplicates(
  database: SQLite.SQLiteDatabase,
  name: string,
): Promise<FoodItem[]> {
  const rows = await database.getAllAsync<FoodRow>(
    `SELECT f.*, GROUP_CONCAT(k.keyword, '|') as keywords_str
     FROM foods f LEFT JOIN food_keywords k ON f.id = k.food_id
     WHERE LOWER(f.name) = LOWER(?) GROUP BY f.id`,
    name,
  );
  return rows.map(rowToFoodItem);
}

/** Search foods using FTS5 full-text search */
export async function searchFoodsFTS(
  database: SQLite.SQLiteDatabase,
  query: string,
  category?: FoodCategory,
): Promise<FoodItem[]> {
  // Escape FTS special characters
  const escaped = query.replace(/['"*(){}[\]^~\\:]/g, '');
  if (!escaped.trim()) return [];

  // Use prefix matching for each term
  const terms = escaped.toLowerCase().split(/\s+/).filter(Boolean);
  const ftsQuery = terms.map(t => `"${t}"*`).join(' AND ');

  let sql: string;
  const params: (string | number)[] = [ftsQuery];

  if (category) {
    sql = `SELECT f.*, GROUP_CONCAT(k.keyword, '|') as keywords_str
           FROM foods_fts fts
           JOIN foods f ON f.id = fts.food_id
           LEFT JOIN food_keywords k ON f.id = k.food_id
           WHERE foods_fts MATCH ? AND f.category = ?
           GROUP BY f.id
           ORDER BY rank
           LIMIT 50`;
    params.push(category);
  } else {
    sql = `SELECT f.*, GROUP_CONCAT(k.keyword, '|') as keywords_str
           FROM foods_fts fts
           JOIN foods f ON f.id = fts.food_id
           LEFT JOIN food_keywords k ON f.id = k.food_id
           WHERE foods_fts MATCH ?
           GROUP BY f.id
           ORDER BY rank
           LIMIT 50`;
  }

  const rows = await database.getAllAsync<FoodRow>(sql, ...params);
  return rows.map(rowToFoodItem);
}

// ─── Metadata ───────────────────────────────────────────────────────────

export async function getMetadata(database: SQLite.SQLiteDatabase, key: string): Promise<string | null> {
  const result = await database.getFirstAsync<{ value: string }>('SELECT value FROM metadata WHERE key = ?', key);
  return result?.value ?? null;
}

export async function setMetadata(database: SQLite.SQLiteDatabase, key: string, value: string): Promise<void> {
  await database.runAsync('INSERT OR REPLACE INTO metadata (key, value) VALUES (?, ?)', key, value);
}

// ─── Categories ─────────────────────────────────────────────────────────

export async function insertCategories(
  database: SQLite.SQLiteDatabase,
  categories: Array<{ id: string; name: string; icon: string }>,
): Promise<void> {
  await database.withTransactionAsync(async () => {
    const stmt = await database.prepareAsync(
      'INSERT OR REPLACE INTO categories (id, name, icon, sort_order) VALUES ($id, $name, $icon, $sortOrder)'
    );
    try {
      for (let i = 0; i < categories.length; i++) {
        await stmt.executeAsync({
          $id: categories[i].id,
          $name: categories[i].name,
          $icon: categories[i].icon,
          $sortOrder: i,
        });
      }
    } finally {
      await stmt.finalizeAsync();
    }
  });
}

export async function getAllCategories(database: SQLite.SQLiteDatabase): Promise<Array<{ id: string; name: string; icon: string }>> {
  return database.getAllAsync<{ id: string; name: string; icon: string }>(
    'SELECT id, name, icon FROM categories ORDER BY sort_order'
  );
}

// ─── Ingredients ────────────────────────────────────────────────────────

export async function bulkInsertIngredients(
  database: SQLite.SQLiteDatabase,
  ingredients: Array<{
    id: string; name: string; nameLocal?: string; category: string;
    caloriesPer100g: number; proteinPer100g: number; fatPer100g: number;
    fiberPer100g: number; commonMeasure?: string; measureGrams?: number;
  }>,
): Promise<void> {
  await database.withTransactionAsync(async () => {
    const stmt = await database.prepareAsync(
      `INSERT OR REPLACE INTO ingredients (
        id, name, name_local, category, calories_per_100g,
        protein_per_100g, fat_per_100g, fiber_per_100g,
        common_measure, measure_grams
      ) VALUES ($id, $name, $nameLocal, $category, $caloriesPer100g,
        $proteinPer100g, $fatPer100g, $fiberPer100g, $commonMeasure, $measureGrams)`
    );
    try {
      for (const ing of ingredients) {
        await stmt.executeAsync({
          $id: ing.id,
          $name: ing.name,
          $nameLocal: ing.nameLocal ?? null,
          $category: ing.category,
          $caloriesPer100g: ing.caloriesPer100g,
          $proteinPer100g: ing.proteinPer100g,
          $fatPer100g: ing.fatPer100g,
          $fiberPer100g: ing.fiberPer100g,
          $commonMeasure: ing.commonMeasure ?? null,
          $measureGrams: ing.measureGrams ?? null,
        });
      }
    } finally {
      await stmt.finalizeAsync();
    }
  });
}

// ─── Seeding ────────────────────────────────────────────────────────────

/** Check if database has been seeded */
export async function isSeeded(database: SQLite.SQLiteDatabase): Promise<boolean> {
  const val = await getMetadata(database, 'seeded_version');
  return val === String(DB_VERSION);
}

/** Mark database as seeded */
export async function markSeeded(database: SQLite.SQLiteDatabase): Promise<void> {
  await setMetadata(database, 'seeded_version', String(DB_VERSION));
}

/** Clear all food data (for re-seeding) */
export async function clearAllFoods(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    DELETE FROM foods_fts;
    DELETE FROM food_keywords;
    DELETE FROM foods;
    DELETE FROM categories;
    DELETE FROM ingredients;
    DELETE FROM metadata;
  `);
}

// ─── Row mapping ────────────────────────────────────────────────────────

interface FoodRow {
  id: string;
  name: string;
  name_marathi: string | null;
  category: string;
  calories_per_unit: number;
  protein_per_unit: number | null;
  fat_per_unit: number | null;
  fiber_per_unit: number | null;
  carbs_per_unit: number | null;
  sugar_per_unit: number | null;
  sodium_per_unit: number | null;
  calcium_per_unit: number | null;
  iron_per_unit: number | null;
  vitamin_c_per_unit: number | null;
  unit: string;
  unit_weight: number | null;
  source: string;
  is_custom: number;
  keywords_str: string | null;
  created_at: number | null;
  updated_at: number | null;
}

function rowToFoodItem(row: FoodRow): FoodItem {
  return {
    id: row.id,
    name: row.name,
    nameMarathi: row.name_marathi ?? undefined,
    category: row.category as FoodCategory,
    caloriesPerUnit: row.calories_per_unit,
    proteinPerUnit: row.protein_per_unit ?? undefined,
    fatPerUnit: row.fat_per_unit ?? undefined,
    fiberPerUnit: row.fiber_per_unit ?? undefined,
    unit: row.unit as FoodUnit,
    unitWeight: row.unit_weight ?? undefined,
    isCustom: row.is_custom === 1,
    searchKeywords: row.keywords_str ? row.keywords_str.split('|') : undefined,
  };
}
