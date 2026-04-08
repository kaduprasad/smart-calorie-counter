/**
 * Food Index — Lazy-built indexes with phonetic normalization for
 * Hinglish / Marathi / Hindi fuzzy search.
 *
 * Three-pass search:
 *  1. Exact substring match on lowercased name / nameMarathi / keywords
 *  2. Phonetic-normalized match (catches Hinglish spelling variants)
 *  3. Fuse.js fuzzy match (catches typos, transpositions, misspellings)
 *
 * Builds once on first access, rebuilds only when the food list changes.
 * Keeps foods.ts as the single source of truth — zero changes to how
 * you add/edit food items.
 */

import Fuse, { IFuseOptions } from 'fuse.js';
import { FoodItem, FoodCategory } from '../types';
import { normalizeForSearch } from './normalize';

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
  /** Fuse.js index for typo-tolerant fuzzy search (third pass) */
  fuseIndex: Fuse<FoodSearchEntry>;
}

// ─── Fuse.js config ─────────────────────────────────────────────────────

/** Fuse searches on phonetically-normalized fields so Hinglish + typo handling combine */
const FUSE_OPTIONS: IFuseOptions<FoodSearchEntry> = {
  keys: [
    { name: 'nameNorm', weight: 0.5 },
    { name: 'marathiNorm', weight: 0.2 },
    { name: 'keywordsNorm', weight: 0.3 },
  ],
  threshold: 0.45,       // 0 = exact, 1 = match anything; 0.45 catches transpositions + 1-2 char typos
  distance: 200,         // how far from expected position a match can be
  includeScore: true,
  minMatchCharLength: 2, // ignore single-char fuzzy noise
  shouldSort: true,
  findAllMatches: true,
};

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

  // Build Fuse.js fuzzy index on phonetically-normalized data
  const fuseIndex = new Fuse(searchData, FUSE_OPTIONS);

  cachedIndex = { byId, byCategory, searchData, searchByFood, fuseIndex };
  cachedSource = foods;
  return cachedIndex;
}

// ─── Search ─────────────────────────────────────────────────────────────

/** Maximum Fuse.js results to consider (avoids flooding with weak matches) */
const FUSE_MAX_RESULTS = 20;

/**
 * Three-pass search:
 *  1. Exact substring match on lowercased name / nameMarathi / keywords
 *  2. Phonetic-normalized match on the same fields (catches spelling variants)
 *  3. Fuse.js fuzzy match on phonetic-normalized fields (catches typos)
 *
 * Exact matches first, then phonetic, then fuzzy — best results always on top.
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

  // Determine source entries (category-filtered or all)
  let entries: FoodSearchEntry[];
  const categoryFoodSet: Set<FoodItem> | null = category ? new Set<FoodItem>() : null;
  if (category) {
    const catFoods = index.byCategory.get(category) ?? [];
    entries = [];
    for (const food of catFoods) {
      const e = index.searchByFood.get(food);
      if (e) {
        entries.push(e);
        categoryFoodSet!.add(food);
      }
    }
  } else {
    entries = index.searchData;
  }

  const exactMatches: { food: FoodItem; score: number }[] = [];
  const fuzzyOnlyMatches: { food: FoodItem; score: number }[] = [];
  const matchedFoods = new Set<FoodItem>(); // track foods already matched in pass 1+2

  for (const entry of entries) {
    // Pass 1: Exact (lowered) match — all query terms must appear somewhere
    const nameHit = qTerms.every(term => entry.nameLower.includes(term));
    const marathiHit = qTerms.every(term => entry.marathiLower.includes(term));
    const keywordHit = qTerms.every(term =>
      entry.nameLower.includes(term) ||
      entry.marathiLower.includes(term) ||
      entry.keywordsLower.some(kw => kw.includes(term))
    );

    if (nameHit || marathiHit || keywordHit) {
      let score = 0;
      if (nameHit) {
        // Whole-word boundary check: "sheng" in "Gavar Sheng Bhaji" ranks higher
        // than "sheng" as prefix of "Shengdana" — uses word-boundary regex
        const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const wordBoundaryRe = new RegExp(`\\b${escaped}\\b`);
        const isWholeWord = wordBoundaryRe.test(entry.nameLower);
        if (isWholeWord) {
          score = entry.nameLower.startsWith(q) ? 100 : 95;
        } else {
          score = entry.nameLower.startsWith(q) ? 85 : 80;
        }
      } else if (marathiHit) {
        score = 60;
      } else {
        score = 40;
      }
      exactMatches.push({ food: entry.food, score });
      matchedFoods.add(entry.food);
      continue;
    }

    // Pass 2: Phonetic-normalized match
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
      matchedFoods.add(entry.food);
    }
  }

  // Pass 3: Fuse.js fuzzy search (catches typos, transpositions, misspellings)
  // Only runs when pass 1+2 returned few results — avoids unnecessary work
  const fuseMatches: { food: FoodItem; score: number }[] = [];
  if (exactMatches.length + fuzzyOnlyMatches.length < FUSE_MAX_RESULTS && q.length >= 2) {
    const fuseResults = index.fuseIndex.search(qNorm, { limit: FUSE_MAX_RESULTS });

    for (const result of fuseResults) {
      const food = result.item.food;
      // Skip if already found by pass 1 or 2
      if (matchedFoods.has(food)) continue;
      // Skip if filtering by category and food doesn't match
      if (categoryFoodSet && !categoryFoodSet.has(food)) continue;

      // Fuse score: 0 = perfect, 1 = worst. Invert to 1–8 range.
      const fuseScore = result.score ?? 1;
      const score = Math.round((1 - fuseScore) * 8);
      if (score > 0) {
        fuseMatches.push({ food, score });
      }
    }
  }

  // Sort each tier by score (highest first), then combine
  exactMatches.sort((a, b) => b.score - a.score);
  fuzzyOnlyMatches.sort((a, b) => b.score - a.score);
  fuseMatches.sort((a, b) => b.score - a.score);

  return [
    ...exactMatches.map(m => m.food),
    ...fuzzyOnlyMatches.map(m => m.food),
    ...fuseMatches.map(m => m.food),
  ];
}

/**
 * O(1) food lookup by ID.
 */
export function getFoodById(index: FoodIndex, id: string): FoodItem | undefined {
  return index.byId.get(id);
}
