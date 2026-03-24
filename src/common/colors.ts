/**
 * Centralized color palette for the app.
 * Import from '../common/colors' or '../common' (via barrel).
 */

export const COLORS = {
  // ── Primary Brand ──
  primary: '#FF7B00',
  primaryLight: '#FFF7ED',
  primaryBorder: '#FFE0C0',

  // ── Secondary (Purple / Lavender) ──
  purple: '#7C3AED',
  purpleMedium: '#8B5CF6',
  purpleLight: '#F5F3FF',
  purpleBorder: '#DDD6FE',
  purpleSubtle: '#EDE9FE',
  purpleSubtext: '#E9D5FF',

  // ── Semantic ──
  success: '#4CAF50',
  successLight: '#F0FDF4',
  successBorder: '#BBF7D0',
  error: '#EF4444',
  errorLight: '#FEF2F2',
  deleteRed: '#FF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // ── Gender / Profile ──
  male: '#3B82F6',
  maleLight: '#DBEAFE',
  maleBgLight: '#EFF6FF',
  maleDark: '#1E40AF',
  female: '#EC4899',
  femaleLight: '#FCE7F3',
  femaleBgLight: '#FDF2F8',
  femaleDark: '#9D174D',

  // ── Text ──
  textPrimary: '#1A1A1A',
  textBody: '#1F2937',
  textSecondary: '#666666',
  textTertiary: '#9CA3AF',
  textPlaceholder: '#9CA3AF',
  textMuted: '#999999',
  textWhite: '#FFFFFF',

  // ── Backgrounds ──
  background: '#FAFAFA',
  surface: '#FFFFFF',
  inputBackground: '#F5F5F5',
  disabledBackground: '#F3F4F6',

  // ── Borders & Dividers ──
  border: '#E5E7EB',
  borderLight: '#F0F0F0',
  divider: '#F5F5F5',
} as const;
