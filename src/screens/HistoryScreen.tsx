import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { getWeeklySummary, formatDate, getTodayDate } from '../services/storage';
import { DailyLog } from '../types';
import { WeightChart } from '../components';

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

  const renderListHeader = () => (
    <>
      <View style={styles.weeklySection}>
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.goalLine}>
          <View style={[styles.goalIndicator, { bottom: `${(settings.dailyCalorieGoal / maxCalories) * 100}%` }]} />
          <Text style={[styles.goalText, { bottom: `${(settings.dailyCalorieGoal / maxCalories) * 100}%` }]}>
            {settings.dailyCalorieGoal} goal
          </Text>
        </View>
        <FlatList
          data={weeklySummary}
          keyExtractor={(item) => item.date}
          renderItem={renderWeeklyBar}
          horizontal
          scrollEnabled={false}
          contentContainerStyle={styles.weeklyChart}
        />
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
  );

  return (
    <SafeAreaView style={styles.container}>
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
    gap: 8,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  allEntriesTitle: {
    marginTop: 8,
  },
  weeklySection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    position: 'relative',
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 20,
  },
  goalLine: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 120,
    top: 56,
  },
  goalIndicator: {
    position: 'absolute',
    left: 0,
    right: 40,
    height: 1,
    backgroundColor: '#FF7B00',
    opacity: 0.3,
  },
  goalText: {
    position: 'absolute',
    right: 0,
    fontSize: 10,
    color: '#FF7B00',
    transform: [{ translateY: -6 }],
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  barWrapper: {
    width: 24,
    height: 80,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    backgroundColor: '#FF7B00',
    borderRadius: 12,
  },
  barOverGoal: {
    backgroundColor: '#FF4444',
  },
  barUnderGoal: {
    backgroundColor: '#4CAF50',
  },
  barCalories: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 4,
  },
  barCaloriesEmpty: {
    color: '#CCCCCC',
  },
  barDay: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  barDayToday: {
    color: '#FF7B00',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF7B00',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  historySection: {
    flex: 1,
  },
  logList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  logInfo: {
    flex: 1,
  },
  logDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  logEntries: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  logCalories: {
    alignItems: 'flex-end',
  },
  logCalorieValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF7B00',
  },
  logCalorieLabel: {
    fontSize: 12,
    color: '#999999',
  },
  overGoal: {
    color: '#FF4444',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 4,
  },
});
