import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { getWeeklySummary, formatDate, getTodayDate } from '../services/storage';
import { DailyLog } from '../types';
import { WeightChart } from '../components';
import { styles } from './styles/historyScreenStyles';

export const HistoryScreen: React.FC = () => {
  const { allLogs, settings, setSelectedDate } = useApp();
  const [weeklySummary, setWeeklySummary] = useState<{ date: string; calories: number }[]>([]);

  useEffect(() => {
    loadWeeklySummary();
  }, [allLogs]);

  const loadWeeklySummary = async () => {
    const summary = await getWeeklySummary();
    setWeeklySummary(summary);
  };

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
            {item.totalCalories}
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
            scrollEnabled={false}
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
