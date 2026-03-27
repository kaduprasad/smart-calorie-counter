/**
 * @deprecated — Moved to src/naturalLanguageProcessingEngine/foodIndex.ts
 * This file re-exports for backward compatibility.
 */

// Re-export everything from the NLP engine
export {
  normalizeForSearch,
  type FoodSearchEntry,
  type FoodIndex,
  getFoodIndex,
  searchFoods,
  getFoodById,
} from '../naturalLanguageProcessingEngine';

