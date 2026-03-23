/**
 * Food Index — Lazy-built indexes with phonetic normalization for
 * Hinglish / Marathi / Hindi fuzzy search.
 *
 * Builds once on first access, rebuilds only when the food list changes.
 * Keeps foods.ts as the single source of truth — zero changes to how
 * you add/edit food items.
 *
 * Indexes:
 *  - byId:       Map<string, FoodItem>          O(1) lookup by ID
 *  - byCategory: Map<FoodCategory, FoodItem[]>  O(1) category filter
 *  - searchData: pre-normalized names + keywords for Hinglish-aware search
 */

import { FoodItem, FoodCategory } from '../types';
import { normalizeForSearch } from '../utils/normalize';

// Re-export for backward compatibility
export { normalizeForSearch } from '../utils/normalize';

// ─── Index types ────────────────────────────────────────────────────────

export interface FoodSearchEntry {
  food: FoodItem;
  /** Standard lowercased values (for exact substring match) */
  nameLower: string;
  marathiLower: string;
  keywordsLower: string[];
  /** Phonetically normalized values (for fuzzy Hinglish match) */
  nameNorm: string;
  marathiNorm: string;
  keywordsNorm: string[];
}

export interface FoodIndex {
  byId: Map<string, FoodItem>;
  byCategory: Map<FoodCategory | 'all', FoodItem[]>;
  searchData: FoodSearchEntry[];
  searchByFood: Map<FoodItem, FoodSearchEntry>;
}

// ─── Cache ──────────────────────────────────────────────────────────────

let cachedIndex: FoodIndex | null = null;
let cachedSource: FoodItem[] | null = null;

/**
 * Build (or return cached) indexes from the food array.
 * Rebuilds automatically if the array reference changes.
 */
export function getFoodIndex(foods: FoodItem[]): FoodIndex {
  if (cachedIndex && cachedSource === foods) {
    return cachedIndex;
  }

  const byId = new Map<string, FoodItem>();
  const byCategory = new Map<FoodCategory | 'all', FoodItem[]>();
  const searchByFood = new Map<FoodItem, FoodSearchEntry>();
  const searchData: FoodSearchEntry[] = new Array(foods.length);

  for (let i = 0; i < foods.length; i++) {
    const food = foods[i];

    // ID index
    byId.set(food.id, food);

    // Category index
    const catList = byCategory.get(food.category);
    if (catList) {
      catList.push(food);
    } else {
      byCategory.set(food.category, [food]);
    }

    // Search data — both exact-lower and phonetic-normalized
    const nameLower = food.name.toLowerCase();
    const marathiLower = food.nameMarathi?.toLowerCase() ?? '';
    const keywordsLower = food.searchKeywords?.map(k => k.toLowerCase()) ?? [];

    const entry: FoodSearchEntry = {
      food,
      nameLower,
      marathiLower,
      keywordsLower,
      nameNorm: normalizeForSearch(nameLower),
      marathiNorm: normalizeForSearch(marathiLower),
      keywordsNorm: keywordsLower.map(normalizeForSearch),
    };

    searchData[i] = entry;
    searchByFood.set(food, entry);
  }

  byCategory.set('all', foods);

  cachedIndex = { byId, byCategory, searchData, searchByFood };
  cachedSource = foods;
  return cachedIndex;
}

// ─── Search ─────────────────────────────────────────────────────────────

/**
 * Two-pass search:
 *  1. Exact substring match on lowercased name / nameMarathi / keywords
 *  2. Phonetic-normalized match on the same fields (catches spelling variants)
 *
 * Exact matches are returned first, then phonetic-only matches — so the
 * best results always appear at the top.
 */
export function searchFoods(
  index: FoodIndex,
  query: string,
  category: FoodCategory | null,
): FoodItem[] {
  const q = query.toLowerCase().trim();

  // No query — return full category or all
  if (!q) {
    if (category) {
      return index.byCategory.get(category) ?? [];
    }
    return index.byCategory.get('all') ?? [];
  }

  const qNorm = normalizeForSearch(q);

  // Split multi-word query into individual terms for AND matching
  const qTerms = q.split(/\s+/).filter(Boolean);
  const qNormTerms = qNorm.split(/\s+/).filter(Boolean);

  // Determine source entries
  let entries: FoodSearchEntry[];
  if (category) {
    const catFoods = index.byCategory.get(category) ?? [];
    entries = [];
    for (const food of catFoods) {
      const e = index.searchByFood.get(food);
      if (e) entries.push(e);
    }
  } else {
    entries = index.searchData;
  }

  const exactMatches: { food: FoodItem; score: number }[] = [];
  const fuzzyOnlyMatches: { food: FoodItem; score: number }[] = [];

  for (const entry of entries) {
    // Check exact (lowered) match — all query terms must appear somewhere
    const nameHit = qTerms.every(term => entry.nameLower.includes(term));
    const marathiHit = qTerms.every(term => entry.marathiLower.includes(term));
    const keywordHit = qTerms.every(term =>
      entry.nameLower.includes(term) ||
      entry.marathiLower.includes(term) ||
      entry.keywordsLower.some(kw => kw.includes(term))
    );

    if (nameHit || marathiHit || keywordHit) {
      // Score: higher = better match
      // Name starts with query → 100, Name contains query → 80,
      // Marathi match → 60, Keyword-only → 40
      let score = 0;
      if (nameHit) {
        score = entry.nameLower.startsWith(q) ? 100
          : entry.nameLower.includes(q) ? 80
          : 70; // all terms present but not as single substring
      } else if (marathiHit) {
        score = 60;
      } else {
        score = 40;
      }
      exactMatches.push({ food: entry.food, score });
      continue;
    }

    // Check phonetic-normalized match
    const nameNormHit = qNormTerms.every(term => entry.nameNorm.includes(term));
    const marathiNormHit = qNormTerms.every(term => entry.marathiNorm.includes(term));
    const keywordNormHit = qNormTerms.every(term =>
      entry.nameNorm.includes(term) ||
      entry.marathiNorm.includes(term) ||
      entry.keywordsNorm.some(kw => kw.includes(term))
    );

    if (nameNormHit || marathiNormHit || keywordNormHit) {
      let score = 0;
      if (nameNormHit) {
        score = entry.nameNorm.startsWith(qNorm) ? 30 : 25;
      } else if (marathiNormHit) {
        score = 20;
      } else {
        score = 10;
      }
      fuzzyOnlyMatches.push({ food: entry.food, score });
    }
  }

  // Sort each tier by score (highest first), then combine
  exactMatches.sort((a, b) => b.score - a.score);
  fuzzyOnlyMatches.sort((a, b) => b.score - a.score);

  return [
    ...exactMatches.map(m => m.food),
    ...fuzzyOnlyMatches.map(m => m.food),
  ];
}

/**
 * O(1) food lookup by ID.
 */
export function getFoodById(index: FoodIndex, id: string): FoodItem | undefined {
  return index.byId.get(id);
}
