/**
 * Centralized formatting and text transformation helpers.
 *
 * All pure functions — no side effects, no app state, no imports from
 * React or context. Safe to use anywhere in the app.
 *
 * NLP functions (normalizeForSearch, cleanVoiceText) have been moved to
 * src/naturalLanguageProcessingEngine/normalize.ts
 */

import { APP_LOCALE } from '../common/constants';

// Re-export NLP functions for backward compatibility
export { normalizeForSearch, cleanVoiceText } from '../naturalLanguageProcessingEngine';

// ─── Text formatting ────────────────────────────────────────────────────

/**
 * Convert string to Title Case.
 * Handles USDA ALL-CAPS descriptions and preserves common abbreviations.
 */
export const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\bUht\b/gi, 'UHT')
    .replace(/\bNfs\b/gi, 'NFS');
};

// ─── Date formatting ────────────────────────────────────────────────────

/** Get date in YYYY-MM-DD format using local timezone */
export const getLocalDateString = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/** Get today's date in YYYY-MM-DD format (local timezone) */
export const getTodayDate = (): string => {
  return getLocalDateString();
};

/** Format date for display — e.g. "Mon, Jan 15, 2024" */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString(APP_LOCALE, options);
};

/** Format date as "DD/MM" — for chart axis labels */
export const formatDateLabel = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

/** Format date as "DD Mon" — e.g. "20 Feb" */
export const formatShortDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
};

// ─── Time formatting ────────────────────────────────────────────────────

/** Format time as "H:MM AM/PM" — e.g. "8:00 PM" */
export const formatTime = (h: number, m: number): string => {
  const period = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 || 12;
  return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
};

// ─── Display formatting ─────────────────────────────────────────────────

/**
 * Format exercise summary for display.
 * @example "30 min • 4.0 km • 280 kcal"
 */
export const formatExerciseSummary = (
  durationMins: number,
  caloriesBurnt: number,
  distanceKm?: number,
): string => {
  const parts: string[] = [`${durationMins} min`];

  if (distanceKm) {
    parts.push(`${distanceKm} km`);
  }

  parts.push(`${caloriesBurnt} kcal`);

  return parts.join(' • ');
};
