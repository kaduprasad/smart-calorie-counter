import { StyleSheet } from 'react-native';
import { COLORS } from '../../common/colors';
import { FONT_SIZE } from '../../common/typography';

export const updateBannerStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginHorizontal: 24,
    maxWidth: 380,
    width: '90%',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 20,
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: FONT_SIZE.cardTitle,
    fontWeight: '700',
    color: COLORS.textWhite,
  },
  headerVersion: {
    fontSize: FONT_SIZE.bodySmall,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  body: {
    padding: 20,
  },
  message: {
    fontSize: FONT_SIZE.body,
    color: COLORS.textBody,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 14,
  },
  releaseNotesTitle: {
    fontSize: FONT_SIZE.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    paddingLeft: 4,
  },
  noteBullet: {
    fontSize: FONT_SIZE.body,
    color: COLORS.primary,
    marginRight: 8,
    lineHeight: 20,
  },
  noteText: {
    fontSize: FONT_SIZE.bodySmall,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  updateBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  updateBtnText: {
    color: COLORS.textWhite,
    fontSize: FONT_SIZE.body,
    fontWeight: '700',
  },
  laterBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  laterBtnText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.body,
    fontWeight: '500',
  },
  // Banner style (non-blocking, at top of screen)
  banner: {
    backgroundColor: COLORS.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryBorder,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIcon: {
    marginRight: 10,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: FONT_SIZE.bodySmall,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  bannerSubtitle: {
    fontSize: FONT_SIZE.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  bannerUpdateBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginLeft: 8,
  },
  bannerUpdateBtnText: {
    color: COLORS.textWhite,
    fontSize: FONT_SIZE.caption,
    fontWeight: '700',
  },
  bannerCloseBtn: {
    padding: 4,
    marginLeft: 6,
  },
});
