import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Linking, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { checkForUpdate, dismissUpdate, UpdateCheckResult } from '../services/updateService';
import { updateBannerStyles as styles } from './styles/updateBannerStyles';
import { COLORS } from '../common/colors';

/**
 * Checks for app updates on mount.
 * - Force update  → full-screen blocking modal (no dismiss)
 * - Optional update → small banner at top (dismissable)
 */
export const UpdateChecker: React.FC = () => {
  const [update, setUpdate] = useState<UpdateCheckResult | null>(null);

  useEffect(() => {
    checkForUpdate().then(setUpdate);
  }, []);

  const handleUpdate = useCallback(() => {
    if (update?.playStoreUrl) {
      Linking.openURL(update.playStoreUrl);
    }
  }, [update]);

  const handleDismiss = useCallback(() => {
    if (update) {
      dismissUpdate(update.latestVersion);
      setUpdate(null);
    }
  }, [update]);

  if (!update) return null;

  // Force update — blocking modal
  if (update.forceUpdate) {
    return (
      <Modal visible transparent animationType="fade" statusBarTranslucent>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <View style={styles.iconCircle}>
                <Ionicons name="cloud-download" size={28} color="#FFF" />
              </View>
              <Text style={styles.headerTitle}>Update Required</Text>
              <Text style={styles.headerVersion}>v{update.latestVersion}</Text>
            </View>

            <View style={styles.body}>
              <Text style={styles.message}>{update.message}</Text>

              {update.releaseNotes.length > 0 && (
                <>
                  <Text style={styles.releaseNotesTitle}>What's New:</Text>
                  {update.releaseNotes.map((note, i) => (
                    <View key={i} style={styles.noteRow}>
                      <Text style={styles.noteBullet}>•</Text>
                      <Text style={styles.noteText}>{note}</Text>
                    </View>
                  ))}
                </>
              )}
            </View>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate} activeOpacity={0.8}>
                <Text style={styles.updateBtnText}>Update Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  // Optional update — top banner
  return (
    <View style={styles.banner}>
      <Ionicons name="arrow-up-circle" size={22} color={COLORS.primary} style={styles.bannerIcon} />
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>Update Available (v{update.latestVersion})</Text>
        <Text style={styles.bannerSubtitle}>Tap to update for new features</Text>
      </View>
      <TouchableOpacity style={styles.bannerUpdateBtn} onPress={handleUpdate} activeOpacity={0.8}>
        <Text style={styles.bannerUpdateBtnText}>Update</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bannerCloseBtn} onPress={handleDismiss}>
        <Ionicons name="close" size={18} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};
