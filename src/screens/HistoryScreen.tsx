import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { getWeeklySummary, formatDate, getTodayDate } from '../services/storage';
import { DailyLog, UserData } from '../types';
import { WeightChart, calculateTDEE } from '../components';
import { getUserData } from '../services/userDataService';
import { styles } from './styles/historyScreenStyles';

export const HistoryScreen: React.FC = () => {
  const { allLogs, settings, setSelectedDate } = useApp();
  const [weeklySummary, setWeeklySummary] = useState<{ date: string; calories: number }[]>([]);
  const [userData, setUserData] = useState<UserData>({});
  const [showDeficitTooltip, setShowDeficitTooltip] = useState(false);
  const [showWeightTooltip, setShowWeightTooltip] = useState(false);

  // Check if today is Sunday (0 = Sunday)
  const isSunday = new Date().getDay() === 0;

  useEffect(() => {
    loadWeeklySummary();
    loadUserData();
  }, [allLogs]);

  const loadWeeklySummary = async () => {
    const summary = await getWeeklySummary();
    setWeeklySummary(summary);
  };

  const loadUserData = async () => {
    try {
      const data = await getUserData();
      setUserData(data);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Calculate weekly calorie deficit/surplus
  const calculateWeeklyStats = () => {
    const tdee = calculateTDEE(userData);
    if (tdee === 0 || weeklySummary.length === 0) return null;

    // Get this week's total calories consumed
    const weeklyCaloriesConsumed = weeklySummary.reduce((sum, day) => sum + day.calories, 0);
    const daysWithData = weeklySummary.filter(d => d.calories > 0).length;
    
    if (daysWithData === 0) return null;

    // Calculate expected calories for the week (TDEE × 7)
    const weeklyCaloriesNeeded = tdee * 7;
    
    // Deficit is negative (eating less), surplus is positive (eating more)
    const weeklyDeficit = weeklyCaloriesConsumed - weeklyCaloriesNeeded;
    
    // 7700 calories = approximately 1 kg of body weight
    const weightChange = weeklyDeficit / 7700;

    return {
      tdee,
      weeklyCaloriesConsumed,
      weeklyCaloriesNeeded,
      deficit: weeklyDeficit,
      weightChange: weightChange,
      isDeficit: weeklyDeficit < 0,
    };
  };

  const weeklyStats = calculateWeeklyStats();

  const sortedLogs = Object.values(allLogs).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const maxCalories = Math.max(
    settings.dailyCalorieGoal,
    ...weeklySummary.map(d => d.calories)
  );

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { weekday: 'short' });
  };

  const renderWeeklyBar = ({ item }: { item: { date: string; calories: number } }) => {
    const percentage = (item.calories / maxCalories) * 100;
    const isOverGoal = item.calories > settings.dailyCalorieGoal;
    const isUnderGoal = item.calories > 0 && item.calories <= settings.dailyCalorieGoal;
    const isToday = item.date === getTodayDate();

    return (
      <View style={styles.barContainer}>
        <Text style={[styles.barCalories, item.calories === 0 && styles.barCaloriesEmpty]}>
          {item.calories > 0 ? item.calories : '-'}
        </Text>
        <View style={styles.barWrapper}>
          <View
            style={[
              styles.bar,
              { height: `${Math.max(percentage, 5)}%` },
              isUnderGoal && styles.barUnderGoal,
              isOverGoal && styles.barOverGoal,
            ]}
          />
        </View>
        <Text style={[styles.barDay, isToday && styles.barDayToday]}>
          {getDayName(item.date)}
        </Text>
      </View>
    );
  };

  const renderLogItem = ({ item }: { item: DailyLog }) => {
    const isOverGoal = item.totalCalories > settings.dailyCalorieGoal;
    const percentage = Math.round((item.totalCalories / settings.dailyCalorieGoal) * 100);

    return (
      <TouchableOpacity 
        style={styles.logItem}
        onPress={() => setSelectedDate(item.date)}
      >
        <View style={styles.logInfo}>
          <Text style={styles.logDate}>{formatDate(item.date)}</Text>
          <Text style={styles.logEntries}>
            {item.entries.length} {item.entries.length === 1 ? 'item' : 'items'}
          </Text>
        </View>
        <View style={styles.logCalories}>
          <Text style={[styles.logCalorieValue, isOverGoal && styles.overGoal]}>
            {Math.round(item.totalCalories)}
          </Text>
          <Text style={styles.logCalorieLabel}>
            {percentage}% of goal
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderListHeader = () => {
    const goalLinePercent = (settings.dailyCalorieGoal / maxCalories) * 100;
    const barHeight = 100; // height of barWrapper
    const goalLineBottom = (goalLinePercent / 100) * barHeight;
    
    return (
    <>
      <View style={styles.weeklySection}>
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.chartArea}>
          <View style={[styles.goalIndicator, { bottom: goalLineBottom }]} />
          <Text style={[styles.goalText, { bottom: goalLineBottom + 2 }]}>
            {settings.dailyCalorieGoal} goal
          </Text>
          <FlatList
            data={weeklySummary}
            keyExtractor={(item) => item.date}
            renderItem={renderWeeklyBar}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.weeklyChart}
          />
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {Math.round(
              sortedLogs.reduce((sum, log) => sum + log.totalCalories, 0) /
                Math.max(sortedLogs.length, 1)
            )}
          </Text>
          <Text style={styles.statLabel}>Avg. Daily</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{sortedLogs.length}</Text>
          <Text style={styles.statLabel}>Days Logged</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {sortedLogs.filter(log => log.totalCalories <= settings.dailyCalorieGoal).length}
          </Text>
          <Text style={styles.statLabel}>Under Goal</Text>
        </View>
      </View>

      {/* Weekly Statistics - Only shown on Sunday */}
      {isSunday && weeklyStats && (
        <View style={styles.weeklyStatsSection}>
          <Text style={styles.weeklyStatsTitle}>
            <MaterialCommunityIcons name="calendar-week" size={18} color="#FF7B00" />
            {' '}Weekly Summary
          </Text>
          
          <View style={styles.weeklyStatsRow}>
            {/* Calorie Deficit/Surplus Card */}
            <Pressable 
              style={[
                styles.weeklyStatCard,
                weeklyStats.isDeficit ? styles.deficitCard : styles.surplusCard
              ]}
              onPress={() => setShowDeficitTooltip(!showDeficitTooltip)}
            >
              <View style={styles.weeklyStatHeader}>
                <MaterialCommunityIcons 
                  name={weeklyStats.isDeficit ? 'trending-down' : 'trending-up'} 
                  size={20} 
                  color={weeklyStats.isDeficit ? '#059669' : '#DC2626'} 
                />
                <Ionicons 
                  name="information-circle-outline" 
                  size={16} 
                  color="#6B7280" 
                />
              </View>
              <Text style={[
                styles.weeklyStatValue,
                weeklyStats.isDeficit ? styles.deficitValue : styles.surplusValue
              ]}>
                {Math.abs(Math.round(weeklyStats.deficit))}
              </Text>
              <Text style={styles.weeklyStatLabel}>
                cal {weeklyStats.isDeficit ? 'deficit' : 'surplus'}
              </Text>
              {showDeficitTooltip && (
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipText}>
                    Based on your TDEE ({weeklyStats.tdee} cal/day) vs average daily intake.
                    {'\n'}Weekly need: {Math.round(weeklyStats.weeklyCaloriesNeeded)} cal
                    {'\n'}You consumed: {Math.round(weeklyStats.weeklyCaloriesConsumed)} cal
                  </Text>
                </View>
              )}
            </Pressable>

            {/* Weight Change Card */}
            <Pressable 
              style={[
                styles.weeklyStatCard,
                weeklyStats.isDeficit ? styles.weightLossCard : styles.weightGainCard
              ]}
              onPress={() => setShowWeightTooltip(!showWeightTooltip)}
            >
              <View style={styles.weeklyStatHeader}>
                <MaterialCommunityIcons 
                  name="scale-bathroom" 
                  size={20} 
                  color={weeklyStats.isDeficit ? '#059669' : '#DC2626'} 
                />
                <Ionicons 
                  name="information-circle-outline" 
                  size={16} 
                  color="#6B7280" 
                />
              </View>
              <Text style={[
                styles.weeklyStatValue,
                weeklyStats.isDeficit ? styles.deficitValue : styles.surplusValue
              ]}>
                {Math.abs(weeklyStats.weightChange).toFixed(2)}
              </Text>
              <Text style={styles.weeklyStatLabel}>
                kg {weeklyStats.isDeficit ? 'loss' : 'gain'}
              </Text>
              {showWeightTooltip && (
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipText}>
                    Estimated based on calorie {weeklyStats.isDeficit ? 'deficit' : 'surplus'}.
                    {'\n'}~7700 cal = 1 kg body weight
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      )}

      <WeightChart weightGoal={settings.weightGoal} />

      <Text style={[styles.sectionTitle, styles.allEntriesTitle]}>All Entries</Text>
    </>
  )};

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="stats-chart" size={28} color="#FF7B00" />
          <Text style={styles.title}>History</Text>
        </View>
        <Text style={styles.subtitle}>Track your progress</Text>
      </View>

      <FlatList
        data={sortedLogs}
        keyExtractor={(item) => item.date}
        renderItem={renderLogItem}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#CCCCCC" />
            <Text style={styles.emptyText}>No history yet</Text>
            <Text style={styles.emptySubtext}>Start tracking your meals</Text>
          </View>
        }
        contentContainerStyle={styles.logList}
      />
    </SafeAreaView>
  );
};
