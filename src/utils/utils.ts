// Re-export all formatting & normalization utilities from centralized normalize.ts
export {
  getLocalDateString,
  getTodayDate,
  formatDate,
  formatDateLabel,
  formatShortDate,
  formatTime,
  formatExerciseSummary,
  toTitleCase,
  normalizeForSearch,
  cleanVoiceText,
} from './normalize';
