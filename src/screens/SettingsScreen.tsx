import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { sendTestNotification, getScheduledNotifications } from '../services/notifications';

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const [notificationEnabled, setNotificationEnabled] = useState(settings.notificationEnabled);
  const [hour, setHour] = useState(settings.notificationTime.hour.toString());
  const [minute, setMinute] = useState(settings.notificationTime.minute.toString().padStart(2, '0'));
  const [calorieGoal, setCalorieGoal] = useState(settings.dailyCalorieGoal.toString());
  const [weightGoal, setWeightGoal] = useState(settings.weightGoal?.toString() || '');
  const [scheduledCount, setScheduledCount] = useState(0);

  useEffect(() => {
    checkScheduledNotifications();
  }, []);

  const checkScheduledNotifications = async () => {
    const notifications = await getScheduledNotifications();
    setScheduledCount(notifications.length);
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

    await updateSettings({
      ...settings,
      notificationTime: { hour: hourNum, minute: minuteNum },
    });

    await checkScheduledNotifications();
    Alert.alert('Success', `Reminder set for ${hourNum.toString().padStart(2, '0')}:${minuteNum.toString().padStart(2, '0')}`);
  };

  const handleToggleNotification = async (value: boolean) => {
    setNotificationEnabled(value);
    await updateSettings({
      ...settings,
      notificationEnabled: value,
    });
    await checkScheduledNotifications();
  };

  const handleSaveCalorieGoal = async () => {
    const goalNum = parseInt(calorieGoal);

    if (isNaN(goalNum) || goalNum < 500 || goalNum > 10000) {
      Alert.alert('Invalid Goal', 'Please enter a goal between 500 and 10000 calories');
      return;
    }

    await updateSettings({
      ...settings,
      dailyCalorieGoal: goalNum,
    });

    Alert.alert('Success', `Daily calorie goal set to ${goalNum}`);
  };

  const handleSaveWeightGoal = async () => {
    if (!weightGoal) {
      // Clear weight goal
      await updateSettings({
        ...settings,
        weightGoal: undefined,
      });
      Alert.alert('Success', 'Weight goal cleared');
      return;
    }

    const goalNum = parseFloat(weightGoal);

    if (isNaN(goalNum) || goalNum < 30 || goalNum > 300) {
      Alert.alert('Invalid Goal', 'Please enter a weight between 30 and 300 kg');
      return;
    }

    await updateSettings({
      ...settings,
      weightGoal: goalNum,
    });

    Alert.alert('Success', `Target weight set to ${goalNum} kg`);
  };

  const handleTestNotification = async () => {
    await sendTestNotification();
    Alert.alert('Test Sent', 'A test notification has been sent');
  };

  const formatTime = (h: number, m: number) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
  };

  const presetTimes = [
    { label: '8 PM', hour: 20, minute: 0 },
    { label: '9 PM', hour: 21, minute: 0 },
    { label: '10 PM', hour: 22, minute: 0 },
    { label: '10:30 PM', hour: 22, minute: 30 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="settings" size={28} color="#FF7B00" />
          <Text style={styles.title}> Settings</Text>
        </View>
        <Text style={styles.subtitle}>Customize your app</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Goals Row - Calorie and Weight side by side */}
        <View style={styles.goalsRow}>
          {/* Daily Calorie Goal */}
          <View style={styles.goalSection}>
            <View style={styles.sectionTitleRow}>
              <MaterialCommunityIcons name="target" size={18} color="#FF7B00" />
              <Text style={styles.sectionTitle}> Calorie Goal</Text>
            </View>
            <View style={styles.card}>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.goalInputCompact}
                  value={calorieGoal}
                  onChangeText={setCalorieGoal}
                  keyboardType="number-pad"
                  placeholder="2000"
                />
                <Text style={styles.goalUnitSmall}>cal</Text>
              </View>
              <TouchableOpacity
                style={styles.saveButtonSmall}
                onPress={handleSaveCalorieGoal}
              >
                <Text style={styles.saveButtonTextSmall}>Save</Text>
              </TouchableOpacity>
              <View style={styles.presetGoalsCompact}>
                {[1500, 1800, 2000, 2500].map((goal) => (
                  <TouchableOpacity
                    key={goal}
                    style={[
                      styles.presetButtonSmall,
                      parseInt(calorieGoal) === goal && styles.presetButtonActive,
                    ]}
                    onPress={() => setCalorieGoal(goal.toString())}
                  >
                    <Text
                      style={[
                        styles.presetButtonTextSmall,
                        parseInt(calorieGoal) === goal && styles.presetButtonTextActive,
                      ]}
                    >
                      {goal}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.currentSettingSmall}>
                Target: {settings.dailyCalorieGoal} cal
              </Text>
            </View>
          </View>

          {/* Weight Goal */}
          <View style={styles.goalSection}>
            <View style={styles.sectionTitleRow}>
              <MaterialCommunityIcons name="scale-bathroom" size={18} color="#FF7B00" />
              <Text style={styles.sectionTitle}> Weight Goal</Text>
            </View>
            <View style={styles.card}>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.goalInputCompact}
                  value={weightGoal}
                  onChangeText={(text) => {
                    const filtered = text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                    setWeightGoal(filtered);
                  }}
                  keyboardType="decimal-pad"
                  placeholder="70"
                />
                <Text style={styles.goalUnitSmall}>kg</Text>
              </View>
              <TouchableOpacity
                style={styles.saveButtonSmall}
                onPress={handleSaveWeightGoal}
              >
                <Text style={styles.saveButtonTextSmall}>
                  {weightGoal ? 'Save' : 'Clear'}
                </Text>
              </TouchableOpacity>
              {settings.weightGoal && (
                <Text style={styles.currentSettingSmall}>
                  Target: {settings.weightGoal} kg
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Daily Reminder */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="notifications" size={18} color="#FF7B00" />
            <Text style={styles.sectionTitle}> Daily Reminder</Text>
          </View>
          <View style={styles.card}>
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
                trackColor={{ false: '#DDDDDD', true: '#FFD0A0' }}
                thumbColor={notificationEnabled ? '#FF7B00' : '#FFFFFF'}
              />
            </View>

            {notificationEnabled && (
              <>
                <View style={styles.divider} />

                <Text style={styles.timeLabel}>Reminder Time</Text>
                <View style={styles.timeInputRow}>
                  <View style={styles.timeInputGroup}>
                    <TextInput
                      style={styles.timeInput}
                      value={hour}
                      onChangeText={setHour}
                      keyboardType="number-pad"
                      maxLength={2}
                      placeholder="22"
                    />
                    <Text style={styles.timeInputLabel}>Hour (0-23)</Text>
                  </View>
                  <Text style={styles.timeSeparator}>:</Text>
                  <View style={styles.timeInputGroup}>
                    <TextInput
                      style={styles.timeInput}
                      value={minute}
                      onChangeText={setMinute}
                      keyboardType="number-pad"
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

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveNotificationTime}
                >
                  <Text style={styles.saveButtonText}>Save Time</Text>
                </TouchableOpacity>

                <Text style={styles.currentSetting}>
                  Current: {formatTime(settings.notificationTime.hour, settings.notificationTime.minute)}
                </Text>

                <TouchableOpacity
                  style={styles.testButton}
                  onPress={handleTestNotification}
                >
                  <View style={styles.testButtonContent}>
                    <Ionicons name="notifications-outline" size={16} color="#666666" />
                    <Text style={styles.testButtonText}> Send Test Notification</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="information-circle" size={18} color="#FF7B00" />
            <Text style={styles.sectionTitle}> About</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.aboutTitleRow}>
              <Ionicons name="restaurant" size={20} color="#FF7B00" />
              <Text style={styles.aboutText}> Maharashtrian Calorie Counter</Text>
            </View>
            <Text style={styles.aboutDescription}>
              Track your daily food intake with a comprehensive database of traditional Maharashtrian vegetarian dishes.
            </Text>
            <View style={styles.features}>
              <View style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.featureItem}> 100+ Maharashtrian food items</Text>
              </View>
              <View style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.featureItem}> Custom dish creation</Text>
              </View>
              <View style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.featureItem}> Daily calorie tracking</Text>
              </View>
              <View style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.featureItem}> History & statistics</Text>
              </View>
              <View style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.featureItem}> Configurable reminders</Text>
              </View>
            </View>
            <Text style={styles.version}>Version 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  goalsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 8,
    gap: 12,
  },
  goalSection: {
    flex: 1,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  toggleDescription: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 16,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 12,
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  timeInputGroup: {
    alignItems: 'center',
  },
  timeInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    width: 80,
  },
  timeInputLabel: {
    fontSize: 11,
    color: '#999999',
    marginTop: 4,
  },
  timeSeparator: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    marginHorizontal: 8,
  },
  presetTimes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  presetGoals: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  presetLabel: {
    fontSize: 13,
    color: '#666666',
    marginRight: 4,
  },
  presetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  presetButtonActive: {
    backgroundColor: '#FF7B00',
  },
  presetButtonText: {
    fontSize: 13,
    color: '#666666',
  },
  presetButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#FF7B00',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  currentSetting: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    marginTop: 12,
  },
  testButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  testButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  goalUnit: {
    fontSize: 16,
    color: '#666666',
    marginLeft: 12,
  },
  goalInputCompact: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  goalUnitSmall: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  saveButtonSmall: {
    backgroundColor: '#FF7B00',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonTextSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  presetGoalsCompact: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  presetButtonSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  presetButtonTextSmall: {
    fontSize: 11,
    color: '#666666',
  },
  currentSettingSmall: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
  weightGoalDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
    textAlign: 'center',
  },
  aboutTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  aboutDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 16,
  },
  features: {
    gap: 8,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureItem: {
    fontSize: 14,
    color: '#444444',
  },
  version: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
  },
});
