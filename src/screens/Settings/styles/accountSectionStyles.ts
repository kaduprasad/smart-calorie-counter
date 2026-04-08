import { StyleSheet } from 'react-native';
import { COLORS } from '../../../common/colors';
import { FONT_SIZE } from '../../../common/typography';

export const accountStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
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
