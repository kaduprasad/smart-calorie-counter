import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { WeightEntry } from '../types';
import { getWeightHistory, WeightPeriod } from '../services/storage';

interface WeightChartProps {
  refreshTrigger?: number;
  weightGoal?: number;
}

const PERIODS: { key: WeightPeriod; label: string }[] = [
  { key: 'week', label: 'Week' },
  { key: '15days', label: '15 Days' },
  { key: 'month', label: 'Month' },
  { key: '3months', label: '3 Months' },
];

export const WeightChart: React.FC<WeightChartProps> = ({ refreshTrigger, weightGoal }) => {
  const { width: screenWidth } = useWindowDimensions();
  const [selectedPeriod, setSelectedPeriod] = useState<WeightPeriod>('week');
  const [weightData, setWeightData] = useState<WeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWeightData();
  }, [selectedPeriod, refreshTrigger]);

  const loadWeightData = async () => {
    setIsLoading(true);
    const data = await getWeightHistory(selectedPeriod);
    setWeightData(data);
    setIsLoading(false);
  };

  const formatDateLabel = (dateStr: string): string => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Calculate stats
  const weights = weightData.map(d => d.weight);
  const minWeight = weights.length > 0 ? Math.min(...weights) : 0;
  const maxWeight = weights.length > 0 ? Math.max(...weights) : 0;
  const avgWeight = weights.length > 0 
    ? weights.reduce((a, b) => a + b, 0) / weights.length 
    : 0;
  const weightChange = weights.length >= 2 
    ? weights[weights.length - 1] - weights[0] 
    : 0;

  // Calculate progress towards goal
  const currentWeight = weights.length > 0 ? weights[weights.length - 1] : null;
  const startWeight = weights.length > 0 ? weights[0] : null;
  
  const getProgressInfo = () => {
    if (!weightGoal || !currentWeight || !startWeight) return null;
    
    const isLosingWeight = weightGoal < startWeight;
    const totalToLose = Math.abs(startWeight - weightGoal);
    const lostSoFar = isLosingWeight 
      ? startWeight - currentWeight 
      : currentWeight - startWeight;
    const remaining = isLosingWeight 
      ? currentWeight - weightGoal 
      : weightGoal - currentWeight;
    
    const progressPercent = totalToLose > 0 
      ? Math.min(100, Math.max(0, (lostSoFar / totalToLose) * 100))
      : 0;
    
    return {
      isLosingWeight,
      totalToLose,
      lostSoFar,
      remaining,
      progressPercent,
      isGoalReached: remaining <= 0,
    };
  };

  const progressInfo = getProgressInfo();

  // Prepare chart data - need at least 2 points for a line
  const hasEnoughData = weightData.length >= 2;
  
  // Get evenly spaced labels based on data length
  const getLabels = () => {
    if (weightData.length <= 7) {
      return weightData.map(d => formatDateLabel(d.date));
    }
    // For longer periods, show fewer labels
    const step = Math.ceil(weightData.length / 6);
    return weightData
      .filter((_, i) => i % step === 0 || i === weightData.length - 1)
      .map(d => formatDateLabel(d.date));
  };

  const chartData = {
    labels: hasEnoughData ? getLabels() : ['', ''],
    datasets: [{
      data: hasEnoughData ? weights : [0, 0],
      color: (opacity = 1) => `rgba(255, 123, 0, ${opacity})`,
      strokeWidth: 2,
    }],
  };

  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(255, 123, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#FF7B00',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#F0F0F0',
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="weight-lifter" size={22} color="#FF7B00" />
          <Text style={styles.title}>Weight Tracker</Text>
        </View>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {PERIODS.map((period) => (
          <TouchableOpacity
            key={period.key}
            style={[
              styles.periodButton,
              selectedPeriod === period.key && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod(period.key)}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === period.key && styles.periodButtonTextActive,
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart */}
      {!isLoading && hasEnoughData ? (
        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={screenWidth - 64}
            height={180}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={true}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            fromZero={false}
            yAxisSuffix=" kg"
          />
        </View>
      ) : (
        <View style={styles.emptyChart}>
          <Text style={styles.emptyChartText}>
            {isLoading ? 'Loading...' : 'Add at least 2 weight entries to see the chart'}
          </Text>
        </View>
      )}

      {/* Stats */}
      {weightData.length > 0 && (
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{minWeight.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Min (kg)</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{avgWeight.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Avg (kg)</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{maxWeight.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Max (kg)</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[
              styles.statValue,
              weightChange > 0 ? styles.weightUp : weightChange < 0 ? styles.weightDown : {}
            ]}>
              {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>Change</Text>
          </View>
        </View>
      )}

      {/* Goal Progress */}
      {weightGoal && currentWeight && (
        <View style={styles.goalSection}>
          <View style={styles.goalHeader}>
            <View style={styles.goalTitleRow}>
              <Ionicons name="flag" size={18} color="#FF7B00" />
              <Text style={styles.goalTitle}>Goal Progress</Text>
            </View>
            <Text style={styles.goalTarget}>Target: {weightGoal} kg</Text>
          </View>
          
          {progressInfo && (
            <>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${progressInfo.progressPercent}%` },
                    progressInfo.isGoalReached && styles.progressBarComplete,
                  ]} 
                />
              </View>
              
              <View style={styles.progressStats}>
                <View style={styles.progressStatItem}>
                  <Text style={styles.progressStatValue}>{currentWeight.toFixed(1)} kg</Text>
                  <Text style={styles.progressStatLabel}>Current</Text>
                </View>
                <View style={styles.progressStatItem}>
                  <Text style={[
                    styles.progressStatValue,
                    progressInfo.isGoalReached ? styles.goalReached : {}
                  ]}>
                    {progressInfo.isGoalReached ? '🎉 Reached!' : `${Math.abs(progressInfo.remaining).toFixed(1)} kg`}
                  </Text>
                  <Text style={styles.progressStatLabel}>
                    {progressInfo.isGoalReached ? 'Goal' : 'To Go'}
                  </Text>
                </View>
                <View style={styles.progressStatItem}>
                  <Text style={styles.progressStatValue}>
                    {Math.round(progressInfo.progressPercent)}%
                  </Text>
                  <Text style={styles.progressStatLabel}>Progress</Text>
                </View>
              </View>
            </>
          )}
        </View>
      )}

      {/* Entry count */}
      <Text style={styles.entryCount}>
        {weightData.length} {weightData.length === 1 ? 'entry' : 'entries'} in this period
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#FF7B00',
  },
  periodButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  chartContainer: {
    alignItems: 'center',
    marginHorizontal: -8,
    overflow: 'hidden',
  },
  chart: {
    borderRadius: 12,
  },
  emptyChart: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
  },
  emptyChartText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  statLabel: {
    fontSize: 11,
    color: '#888888',
    marginTop: 2,
  },
  weightUp: {
    color: '#F44336',
  },
  weightDown: {
    color: '#4CAF50',
  },
  entryCount: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
    marginTop: 12,
  },
  goalSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  goalTarget: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF7B00',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF7B00',
    borderRadius: 6,
  },
  progressBarComplete: {
    backgroundColor: '#4CAF50',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStatItem: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  progressStatLabel: {
    fontSize: 11,
    color: '#888888',
    marginTop: 2,
  },
  goalReached: {
    color: '#4CAF50',
  },
});
