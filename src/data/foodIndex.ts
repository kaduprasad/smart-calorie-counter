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

// ─── Phonetic normalization for Indian food search ──────────────────────
// Handles common Hinglish/transliteration spelling variations:
//   ladoo/laado/lado/laadu/laddu/ladu  →  ladu
//   bhaji/baji  →  baji
//   chutney/chatni  →  catni / cutney
//   biryani/biriyani/briyani  →  biryani / biriyani / briyani
//   dal/daal/dhal  →  dal
//   barfi/burfi/barfee  →  barfi
//   kheer/keer  →  ker
//   sabzi/sabji  →  sabzi / sabji
//
// The normalizer reduces both the query AND the stored keywords to a
// canonical form so variations match without storing every permutation.

export function normalizeForSearch(text: string): string {
  return text
    // Vowel doubling → single vowel
    .replace(/aa/g, 'a')
    .replace(/ee/g, 'i')
    .replace(/oo/g, 'u')
    .replace(/ii/g, 'i')
    .replace(/uu/g, 'u')
    // Double consonants → single
    .replace(/dd/g, 'd')
    .replace(/tt/g, 't')
    .replace(/nn/g, 'n')
    .replace(/ll/g, 'l')
    // Aspirated consonants → base
    .replace(/bh/g, 'b')
    .replace(/dh/g, 'd')
    .replace(/gh/g, 'g')
    .replace(/jh/g, 'j')
    .replace(/kh/g, 'k')
    .replace(/th/g, 't')
    // sh→s (shev↔sev, sheera↔seera, shengdana↔sengdana)
    .replace(/sh/g, 's')
    // ph→f (phulka↔fulka)
    .replace(/ph/g, 'f');
}

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

  const exactMatches: FoodItem[] = [];
  const fuzzyOnlyMatches: FoodItem[] = [];

  for (const entry of entries) {
    // Check exact (lowered) match — all query terms must appear somewhere
    const allExact = qTerms.every(term =>
      entry.nameLower.includes(term) ||
      entry.marathiLower.includes(term) ||
      entry.keywordsLower.some(kw => kw.includes(term))
    );

    if (allExact) {
      exactMatches.push(entry.food);
      continue;
    }

    // Check phonetic-normalized match
    const allNorm = qNormTerms.every(term =>
      entry.nameNorm.includes(term) ||
      entry.marathiNorm.includes(term) ||
      entry.keywordsNorm.some(kw => kw.includes(term))
    );

    if (allNorm) {
      fuzzyOnlyMatches.push(entry.food);
    }
  }

  // Exact matches first, then fuzzy-only
  return [...exactMatches, ...fuzzyOnlyMatches];
}

/**
 * O(1) food lookup by ID.
 */
export function getFoodById(index: FoodIndex, id: string): FoodItem | undefined {
  return index.byId.get(id);
}
