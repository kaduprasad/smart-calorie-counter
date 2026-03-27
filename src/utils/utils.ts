// Re-export formatting utilities from normalize.ts
export {
  getLocalDateString,
  getTodayDate,
  formatDate,
  formatDateLabel,
  formatShortDate,
  formatTime,
  formatExerciseSummary,
  toTitleCase,
} from './normalize';

// Re-export NLP utilities from the centralized NLP engine
export {
  normalizeForSearch,
  cleanVoiceText,
} from '../naturalLanguageProcessingEngine';
