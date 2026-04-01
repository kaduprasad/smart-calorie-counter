import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NumericInput } from '../../components/NumericInput';
import { AppSettings } from '../../types';
import { sendTestNotification, getScheduledNotifications } from '../../services/notifications';
import { formatTime } from '../../utils/normalize';
import { styles } from './styles/settingsScreenStyles';

interface ReminderSectionProps {
  settings: AppSettings;
  updateSettings: (settings: AppSettings) => Promise<void>;
}

const presetTimes = [
  { label: '8 PM', hour: 20, minute: 0 },
  { label: '9 PM', hour: 21, minute: 0 },
  { label: '10 PM', hour: 22, minute: 0 },
  { label: '10:30 PM', hour: 22, minute: 30 },
];

export const ReminderSection: React.FC<ReminderSectionProps> = ({ settings, updateSettings }) => {
  const [notificationEnabled, setNotificationEnabled] = useState(settings.notificationEnabled);
  const [hour, setHour] = useState(settings.notificationTime.hour.toString());
  const [minute, setMinute] = useState(settings.notificationTime.minute.toString().padStart(2, '0'));
  const [scheduledCount, setScheduledCount] = useState(0);

  useEffect(() => {
    checkScheduledNotifications();
  }, []);

  const checkScheduledNotifications = async () => {
    const notifications = await getScheduledNotifications();
    setScheduledCount(notifications.length);
  };

  const handleToggleNotification = async (value: boolean) => {
    setNotificationEnabled(value);
    await updateSettings({ ...settings, notificationEnabled: value });
    await checkScheduledNotifications();
  };

  const handleSaveNotificationTime = async () => {
    const hourNum = parseInt(hour);
    const minuteNum = parseInt(minute);
    if (isNaN(hourNum) || hourNum < 0 || hourNum > 23) {
      Alert.alert('Invalid Hour', 'Please enter an hour between 0 and 23');
      return;
    }
    if (isNaN(minuteNum) || minuteNum < 0 || minuteNum > 59) {
      Alert.alert('Invalid Minute', 'Please enter a minute between 0 and 59');
      return;
    }
    await updateSettings({ ...settings, notificationTime: { hour: hourNum, minute: minuteNum } });
    await checkScheduledNotifications();
    Alert.alert('Success', `Reminder set for ${hourNum.toString().padStart(2, '0')}:${minuteNum.toString().padStart(2, '0')}`);
  };

  const handleTestNotification = async () => {
    await sendTestNotification();
    Alert.alert('Test Sent', 'A test notification has been sent');
  };

  return (
    <View style={styles.section}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconContainer}>
            <Ionicons name="notifications" size={20} color="#FF7B00" />
          </View>
          <Text style={styles.cardTitle}>Daily Reminder</Text>
        </View>
        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleLabel}>Enable Notifications</Text>
            <Text style={styles.toggleDescription}>
              Get reminded to log your meals
            </Text>
          </View>
          <Switch
            value={notificationEnabled}
            onValueChange={handleToggleNotification}
            trackColor={{ false: '#D1D5DB', true: '#9CA3AF' }}
            thumbColor={notificationEnabled ? '#4B5563' : '#F3F4F6'}
          />
        </View>

        {notificationEnabled && (
          <>
            <View style={styles.divider} />

            <Text style={styles.timeLabel}>Reminder Time</Text>
            <View style={styles.timeInputRow}>
              <View style={styles.timeInputGroup}>
                <NumericInput
                  style={styles.timeInput}
                  value={hour}
                  onChangeText={setHour}
                  allowDecimal={false}
                  maxLength={2}
                  placeholder="22"
                />
                <Text style={styles.timeInputLabel}>Hour (0-23)</Text>
              </View>
              <Text style={styles.timeSeparator}>:</Text>
              <View style={styles.timeInputGroup}>
                <NumericInput
                  style={styles.timeInput}
                  value={minute}
                  onChangeText={setMinute}
                  allowDecimal={false}
                  maxLength={2}
                  placeholder="00"
                />
                <Text style={styles.timeInputLabel}>Minute (0-59)</Text>
              </View>
            </View>

            <View style={styles.presetTimes}>
              <Text style={styles.presetLabel}>Quick set:</Text>
              {presetTimes.map((preset) => (
                <TouchableOpacity
                  key={`${preset.hour}-${preset.minute}`}
                  style={[
                    styles.presetButton,
                    parseInt(hour) === preset.hour &&
                      parseInt(minute) === preset.minute &&
                      styles.presetButtonActive,
                  ]}
                  onPress={() => {
                    setHour(preset.hour.toString());
                    setMinute(preset.minute.toString().padStart(2, '0'));
                  }}
                >
                  <Text
                    style={[
                      styles.presetButtonText,
                      parseInt(hour) === preset.hour &&
                        parseInt(minute) === preset.minute &&
                        styles.presetButtonTextActive,
                    ]}
                  >
                    {preset.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveNotificationTime}>
              <Text style={styles.saveButtonText}>Save Time</Text>
            </TouchableOpacity>

            <Text style={styles.currentSetting}>
              Current: {formatTime(settings.notificationTime.hour, settings.notificationTime.minute)}
            </Text>

            <TouchableOpacity style={styles.testButton} onPress={handleTestNotification}>
              <View style={styles.testButtonContent}>
                <Ionicons name="notifications-outline" size={16} color="#666666" />
                <Text style={styles.testButtonText}> Send Test Notification</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};
