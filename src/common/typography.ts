/**
 * Typography scale — single source of truth for all font sizes.
 * Import FONT_SIZE from '../common/typography' (or '../common').
 *
 * Standard sizes for modern smartphones (6.1"+ screens):
 *   Screen titles: 22    Section headers: 16    Card titles: 18
 *   Body: 14             Body large: 15         Body small: 13
 *   Buttons: 16          Small buttons: 14      Labels: 14
 *   Captions: 12         Tiny/metadata: 11      Extra small: 10
 *   Hero large: 28       Hero medium: 24        Hero XL: 48
 *   Tab labels: 10
 */

export const FONT_SIZE = {
  // Screen-level titles ("Settings", "History", "Health", etc.)
  screenTitle: 22,

  // Section headers inside screens ("Recent Foods", "All Foods", etc.)
  sectionTitle: 16,

  // Card/modal titles
  cardTitle: 18,

  // Modal sub-titles
  modalTitle: 20,

  // Body text variants
  bodyLarge: 15,
  body: 14,
  bodySmall: 13,

  // Buttons
  button: 16,
  buttonSmall: 14,

  // Form labels
  label: 14,

  // Input text
  input: 15,

  // Captions, hints, timestamps
  caption: 12,

  // Tiny metadata, badges, unit labels
  tiny: 11,

  // Extra small (chip labels, pill text)
  xs: 10,

  // Micro (UOM, minor annotations)
  micro: 9,

  // Hero display numbers (calories, BMI, stats)
  heroXL: 48,
  heroLarge: 28,
  heroMedium: 24,

  // Tab bar labels
  tabLabel: 10,
} as const;
