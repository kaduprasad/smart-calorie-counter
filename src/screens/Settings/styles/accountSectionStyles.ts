import { StyleSheet } from 'react-native';
import { COLORS } from '../../../common/colors';
import { FONT_SIZE } from '../../../common/typography';

export const accountStyles = StyleSheet.create({
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    fontSize: FONT_SIZE.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  profileEmail: {
    fontSize: FONT_SIZE.bodySmall,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.errorLight,
  },
  signOutText: {
    fontSize: FONT_SIZE.body,
    fontWeight: '500',
    color: COLORS.error,
  },
  description: {
    fontSize: FONT_SIZE.body,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 14,
  },
  signInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
  },
  googleIcon: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
  },
  signInText: {
    fontSize: FONT_SIZE.body,
    fontWeight: '700',
    color: COLORS.textWhite,
  },
  optional: {
    fontSize: FONT_SIZE.caption,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: 10,
  },
});
