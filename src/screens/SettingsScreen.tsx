import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { sendTestNotification, getScheduledNotifications } from '../services/notifications';
import { NumericInput } from '../components/NumericInput';
import { styles } from './styles/settingsScreenStyles';
import { UserInfoSection } from '../components';

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const [notificationEnabled, setNotificationEnabled] = useState(settings.notificationEnabled);
  const [hour, setHour] = useState(settings.notificationTime.hour.toString());
  const [minute, setMinute] = useState(settings.notificationTime.minute.toString().padStart(2, '0'));
  const [calorieGoal, setCalorieGoal] = useState(settings.dailyCalorieGoal.toString());
  const [exerciseGoal, setExerciseGoal] = useState(settings.exerciseCalorieGoal.toString());
  const [exerciseInputFocused, setExerciseInputFocused] = useState(false);
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

  const handleSaveExerciseGoal = async () => {
    const goalNum = parseInt(exerciseGoal);

    if (isNaN(goalNum) || goalNum < 0 || goalNum > 5000) {
      Alert.alert('Invalid Goal', 'Please enter a goal between 0 and 5000 calories');
      return;
    }

    await updateSettings({
      ...settings,
      exerciseCalorieGoal: goalNum,
    });

    Alert.alert('Success', `Daily exercise goal set to ${goalNum} cal`);
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
    <SafeAreaView style={styles.container} edges={['top']}>
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
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <MaterialCommunityIcons name="target" size={20} color="#FF7B00" />
                </View>
                <Text style={styles.cardTitle}>Calorie Goal</Text>
              </View>
              <View style={styles.inputRow}>
                <NumericInput
                  style={styles.goalInputCompact}
                  value={calorieGoal}
                  onChangeText={setCalorieGoal}
                  allowDecimal={false}
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
              <Text style={styles.currentSettingSmall}>
                Target: {settings.dailyCalorieGoal} cal
              </Text>
            </View>
          </View>

          {/* Weight Goal */}
          <View style={styles.goalSection}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <MaterialCommunityIcons name="scale-bathroom" size={20} color="#FF7B00" />
                </View>
                <Text style={styles.cardTitle}>Weight Goal</Text>
              </View>
              <View style={styles.inputRow}>
                <NumericInput
                  style={styles.goalInputCompact}
                  value={weightGoal}
                  onChangeText={setWeightGoal}
                  allowDecimal={true}
                  maxDecimalPlaces={1}
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

        {/* Exercise Goal - Full width below */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconContainer, { backgroundColor: '#E8F5E9' }]}>
                <MaterialCommunityIcons name="run-fast" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.cardTitle}>Exercise Goal</Text>
            </View>
            <Text style={styles.goalDescription}>
              Daily calorie burn target from workouts
            </Text>
            <View style={styles.inputRow}>
              <NumericInput
                style={[
                  styles.exerciseGoalInputCompact,
                  exerciseInputFocused && styles.goalInputFocusedGreen,
                ]}
                value={exerciseGoal}
                onChangeText={setExerciseGoal}
                onFocus={() => setExerciseInputFocused(true)}
                onBlur={() => setExerciseInputFocused(false)}
                allowDecimal={false}
                placeholder="300"
              />
              <Text style={styles.goalUnitSmall}>cal</Text>
            </View>
            <TouchableOpacity
              style={styles.saveButtonGreen}
              onPress={handleSaveExerciseGoal}
            >
              <Text style={styles.saveButtonTextSmall}>Save</Text>
            </TouchableOpacity>
            <Text style={styles.currentSettingSmall}>
              Target: {settings.exerciseCalorieGoal} cal/day
            </Text>
          </View>
        </View>

        {/* User Profile Section */}
        <View style={styles.section}>
          <UserInfoSection />
        </View>

        {/* Daily Reminder */}
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
            <Text style={styles.sectionTitleInRow}>About</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.aboutTitleRow}>
              <Ionicons name="restaurant" size={20} color="#FF7B00" />
              <Text style={styles.aboutText}>Smart Calorie Tracker</Text>
            </View>
            <Text style={styles.aboutDescription}>
              Track your daily food intake with a comprehensive database of Indian dishes including Maharashtrian, Konkani, Vidarbha, and North Indian cuisines.
            </Text>
            <View style={styles.features}>
              <View style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.featureItem}>330+ Indian food items</Text>
              </View>
              <View style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.featureItem}>15 food categories</Text>
              </View>
              <View style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.featureItem}>BMR & TDEE calculator</Text>
              </View>
              <View style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.featureItem}>Exercise tracking (30+ types)</Text>
              </View>
              <View style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.featureItem}>Net calorie tracking</Text>
              </View>
              <View style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.featureItem}>Visual speedometer gauge</Text>
              </View>
              <View style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.featureItem}>History & statistics</Text>
              </View>
              <View style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.featureItem}>Custom dish creation</Text>
              </View>
              <View style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.featureItem}>Daily reminders</Text>
              </View>
            </View>
            <Text style={styles.version}>Version 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
