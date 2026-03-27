import { FoodItem } from '../types';
import { FoodIndex, searchFoods } from './foodIndex';
import { cleanVoiceText } from './normalize';

export interface ParsedFoodEntry {
  rawText: string;
  quantity: number;
  foodName: string;
  matchedFood: FoodItem | null;
  gramsRequested: number | null; // if user said "100 grams paneer", store 100
}

// Hindi/English/Marathi number words → numeric value
// Includes common speech-recognition misheard variants for Indian English
const NUMBER_WORDS: Record<string, number> = {
  // English
  'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
  'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
  'half': 0.5, 'quarter': 0.25,
  // Hindi
  'ek': 1, 'do': 2, 'teen': 3, 'char': 4, 'paanch': 5,
  'panch': 5, 'che': 6, 'chhe': 6, 'saat': 7, 'aath': 8,
  'nau': 9, 'das': 10, 'aadha': 0.5, 'aadhi': 0.5,
  'dedh': 1.5, 'dhai': 2.5, 'dhaai': 2.5, 'sawaai': 1.25,
  // Marathi
  'don': 2, 'tin': 3, 'chaar': 4, 'pach': 5, 'paach': 5,
  'saha': 6, 'daha': 10, 'savva': 1.25, 'saade': 0, // saade used as prefix
  // Common mic misheard / dialect variants
  'tu': 2, 'to': 2, 'too': 2, 'toh': 2,           // "two" / "don"
  'won': 1, 'wan': 1, 'vun': 1, 'von': 1,          // "one" / "ek"
  'tree': 3, 'tri': 3,                              // "three" / "teen"
  'fo': 4, 'for': 4, 'fore': 4,                     // "four"
  'fi': 5, 'fiv': 5,                                // "five"
  'doo': 2, 'du': 2, 'doh': 2,                      // "do"
  'ache': 8, 'aat': 8,                              // "aath"
  'haf': 0.5, 'aadh': 0.5,                          // "half" / "aadha"
  'daidh': 1.5, 'daedh': 1.5,                       // "dedh"
  'dhaee': 2.5,                                      // "dhai" variant
  'punch': 5,                                        // "paanch"
  'sat': 7, 'saath': 7,                             // "saat"
  'noh': 9,                                          // "nau"
  // Mic misheard Marathi variants
  'dawn': 2, 'done': 2, 'dong': 2,                  // "don"
  'tine': 3,                                          // "tin"
  'jar': 4,                                           // "chaar"
  'such': 6, 'sa': 6,                               // "saha"
  'da': 10, 'dha': 10,                              // "daha"
};

// Unit words to strip from food name (they describe quantity, not the food)
// Aligned with FoodUnit type: piece|cup|bowl|plate|glass|tablespoon|teaspoon|grams|ml|serving|slice|packet|scoop
const UNIT_WORDS = new Set([
  'plate', 'plates', 'cup', 'cups', 'bowl', 'bowls',
  'piece', 'pieces', 'glass', 'glasses', 'slice', 'slices',
  'serving', 'servings', 'spoon', 'spoons',
  'tablespoon', 'tablespoons', 'teaspoon', 'teaspoons',
  'grams', 'gram', 'g', 'ml', 'milliliter', 'milliliters',
  'packet', 'packets', 'scoop', 'scoops',
  // Hindi/Marathi equivalents
  'katori', 'vati', 'pyala', 'gilas', 'tukda', 'chamach', 'dabba',
]);

// Words that indicate the quantity is in grams
const GRAM_WORDS = new Set(['grams', 'gram', 'g', 'gm', 'grms']);

// Words that indicate the quantity is in ml
const ML_WORDS = new Set(['ml', 'milliliter', 'milliliters', 'millilitre']);

// Connector / filler words between quantity-unit and food name
const FILLER_WORDS = new Set([
  'of', 'the', 'a', 'an', 'some',
  'ka', 'ki', 'ke', 'cha', 'chi', 'che',  // Hindi/Marathi possessives
  'wala', 'wali', 'wale',                   // Hindi
]);

/**
 * Parse voice/text input like "2 chapati, 1 bowl rice, half plate poha"
 * or continuous speech "two chapati one bowl rice one banana"
 * into structured food entries matched against the food database.
 * Supports gram-based input: "100 grams paneer" → converts to serving units.
 */
export function parseVoiceInput(
  text: string,
  foodIndex: FoodIndex,
): ParsedFoodEntry[] {
  const cleaned = cleanVoiceText(text);
  const entries = splitIntoEntries(cleaned);
  return entries.map(entry => parseSingleEntry(entry, foodIndex));
}

// ─── Smart splitting ───────────────────────────────────────────────

/** Check if a word is a number token (digit or number word) */
function isNumberToken(word: string): boolean {
  if (NUMBER_WORDS[word] !== undefined) return true;
  const n = parseFloat(word);
  return !isNaN(n) && n > 0;
}

/**
 * Split raw voice text into individual food-entry strings.
 * Handles both comma-separated and continuous speech like
 * "two chapati one rice one banana".
 */
function splitIntoEntries(text: string): string[] {
  // Step 1: split by explicit commas & newlines (safe delimiters)
  const segments = text
    .split(/[,\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  // Step 2: further split each segment by number-word boundaries
  const entries: string[] = [];
  for (const seg of segments) {
    entries.push(...splitByNumberBoundaries(seg));
  }
  return entries;
}

/**
 * Walk through words and split when a number token appears after
 * at least one food word, e.g.:
 *   "two chapati one bowl rice one banana"
 *   → ["two chapati", "one bowl rice", "one banana"]
 *
 * Preserves "and a half" / "and half" as part of the current entry,
 * and treats "and"/"aur"/"or" as conjunctions between entries.
 */
function splitByNumberBoundaries(segment: string): string[] {
  const words = segment.toLowerCase().trim().split(/\s+/);
  if (words.length === 0) return [];

  const entries: string[] = [];
  let current: string[] = [];
  let hasFoodWord = false; // seen a real food word in current entry

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    // ── Handle conjunctions: and / aur / or ──
    if (word === 'and' || word === 'aur' || word === 'or') {
      // "and a half" or "and half" → part of quantity, keep with current
      if (word === 'and') {
        const next = words[i + 1];
        const nextNext = words[i + 2];
        if (next === 'a' && nextNext === 'half') {
          current.push('and', 'a', 'half');
          i += 2;
          continue;
        }
        if (next === 'half') {
          current.push('and', 'half');
          i += 1;
          continue;
        }
      }
      // Otherwise it's a conjunction between entries
      if (hasFoodWord && current.length > 0) {
        entries.push(current.join(' '));
        current = [];
        hasFoodWord = false;
      }
      continue;
    }

    // ── Number token after food word → new entry boundary ──
    if (isNumberToken(word) && hasFoodWord) {
      entries.push(current.join(' '));
      current = [word];
      hasFoodWord = false;
    } else {
      current.push(word);
      if (!isNumberToken(word) && !UNIT_WORDS.has(word)) {
        hasFoodWord = true;
      }
    }
  }

  if (current.length > 0) {
    entries.push(current.join(' '));
  }

  return entries;
}

function parseSingleEntry(raw: string, foodIndex: FoodIndex): ParsedFoodEntry {
  const words = raw.toLowerCase().trim().split(/\s+/);
  let quantity = 1;
  let startIndex = 0;

  // Try to extract quantity from the beginning
  if (words.length > 0) {
    // Check for numeric value: "2", "1.5", etc
    const num = parseFloat(words[0]);
    if (!isNaN(num) && num > 0) {
      quantity = num;
      startIndex = 1;

      // Handle "2 and half" / "2.5" already handled by parseFloat
      // Handle "1 and a half" pattern
      if (words[startIndex] === 'and' && words[startIndex + 1] === 'a' && words[startIndex + 2] === 'half') {
        quantity += 0.5;
        startIndex += 3;
      } else if (words[startIndex] === 'and' && words[startIndex + 1] === 'half') {
        quantity += 0.5;
        startIndex += 2;
      }
    }
    // Check for word-based number: "two", "ek", "dedh"
    else if (NUMBER_WORDS[words[0]] !== undefined) {
      quantity = NUMBER_WORDS[words[0]];
      startIndex = 1;
    }
  }

  // Remaining words — detect gram/ml unit first, then strip unit/filler words
  const afterQty = words.slice(startIndex);
  let gramsRequested: number | null = null;

  // Check if the first remaining word is a gram/ml indicator
  if (afterQty.length > 0 && (GRAM_WORDS.has(afterQty[0]) || ML_WORDS.has(afterQty[0]))) {
    gramsRequested = quantity; // the number before 'grams' IS the gram amount
    // Don't set quantity yet — we'll convert after matching the food
  }

  const foodWords = afterQty
    .filter(w => !UNIT_WORDS.has(w) && !FILLER_WORDS.has(w) && !GRAM_WORDS.has(w) && !ML_WORDS.has(w));

  const foodName = foodWords.join(' ');

  // Search for the food in the database and pick the best match
  const results = searchFoods(foodIndex, foodName, null);
  const matchedFood = results.length > 0 ? pickBestMatch(foodName, results) : null;

  // Convert grams to the food's native unit if gram-based input
  if (gramsRequested !== null && matchedFood?.unitWeight) {
    quantity = Math.round((gramsRequested / matchedFood.unitWeight) * 100) / 100;
    // Ensure at least 0.25 to avoid 0
    if (quantity < 0.25) quantity = 0.25;
  }

  return {
    rawText: raw.trim(),
    quantity,
    foodName: foodName || raw.trim(),
    matchedFood,
    gramsRequested,
  };
}

/**
 * Re-rank searchFoods results to prefer exact/shortest name matches.
 * "rice" → "Rice (भात)" over "Rice Papdi (Tandlache Papad)"
 * "banana" → "Banana" over "Banana Chips"
 *
 * Scoring:
 *  1. Exact name match (food name lowered === query)       → highest
 *  2. Name is just query + Marathi in parens               → high
 *  3. Shorter name = closer to what user meant             → tiebreaker
 */
function pickBestMatch(query: string, results: FoodItem[]): FoodItem {
  const q = query.toLowerCase().trim();
  const qWords = q.split(/\s+/).sort();

  let best = results[0];
  let bestScore = -1;

  for (const food of results) {
    const name = food.name.toLowerCase();
    // Strip Marathi parenthetical for comparison: "Rice (भात)" → "rice"
    const nameBase = name.replace(/\s*\(.*?\)\s*$/, '').trim();
    const nameWords = nameBase.split(/\s+/).sort();

    let score = 0;

    if (nameBase === q) {
      // Exact match: "rice" === "rice", "banana" === "banana"
      score = 1000;
    } else if (name === q) {
      score = 900;
    } else if (food.searchKeywords?.some(kw => kw.toLowerCase() === q)) {
      // Exact keyword match: "rice" matches Plain Rice via keyword
      score = 850;
    } else if (qWords.join(' ') === nameWords.join(' ')) {
      // Same words, different order: "eggs boiled" matches "boiled egg" (after sort)
      score = 800;
    } else if (food.searchKeywords?.some(kw => {
      const kwWords = kw.toLowerCase().split(/\s+/).sort();
      return kwWords.join(' ') === qWords.join(' ');
    })) {
      // Keyword match with reordered words
      score = 750;
    } else if (nameBase.startsWith(q + ' ') || nameBase.startsWith(q + '-')) {
      score = 500 - nameBase.length;
    } else if (nameBase.includes(q)) {
      score = 300 - nameBase.length;
    } else {
      // Fallback: prefer shorter names (more likely to be the basic item)
      score = 100 - nameBase.length;
    }

    if (score > bestScore) {
      bestScore = score;
      best = food;
    }
  }

  return best;
}
