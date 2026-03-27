/**
 * Natural Language Processing Engine
 *
 * Centralized module for all NLP, search, voice parsing, phonetic
 * normalization, and food-name translation logic.
 *
 * Exports:
 *  - normalizeForSearch, cleanVoiceText        (text normalization)
 *  - FoodIndex, getFoodIndex, searchFoods, getFoodById  (food search engine)
 *  - parseVoiceInput, ParsedFoodEntry          (voice/text → food entries)
 *  - getAlternativeSearchTerms                 (spelling variant mappings)
 */

// Text normalization & voice cleaning
export { normalizeForSearch, cleanVoiceText } from './normalize';

// Food search index & engine
export type { FoodSearchEntry, FoodIndex } from './foodIndex';
export { getFoodIndex, searchFoods, getFoodById } from './foodIndex';

// Voice/text → food entry parser
export type { ParsedFoodEntry } from './foodVoiceParser';
export { parseVoiceInput } from './foodVoiceParser';

// Indian food spelling variant mappings (for online API search)
export { getAlternativeSearchTerms } from './alternativeSearchTerms';
