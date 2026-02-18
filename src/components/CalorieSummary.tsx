import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CalorieSummaryProps {
  consumed: number;
  goal: number;
  date?: string;
}

export const CalorieSummary: React.FC<CalorieSummaryProps> = ({ consumed, goal, date }) => {
  const roundedConsumed = Math.round(consumed);
  const remaining = Math.round(goal - consumed);
  const percentage = Math.min((consumed / goal) * 100, 100);
  const isOverGoal = consumed > goal;

  return (
    <View style={styles.container}>
      {date && <Text style={styles.date}>{date}</Text>}
      
      <View style={styles.mainStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{roundedConsumed}</Text>
          <Text style={styles.statLabel}>Consumed</Text>
        </View>
        
        <View style={styles.circleContainer}>
          <View style={styles.circle}>
            <Text style={[styles.circleValue, isOverGoal && styles.overGoal]}>
              {Math.abs(remaining)}
            </Text>
            <Text style={[styles.circleLabel, isOverGoal && styles.overGoal]}>
              {isOverGoal ? 'Over' : 'Left'}
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${percentage}%` }]} />
          </View>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{goal}</Text>
          <Text style={styles.statLabel}>Goal</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF7B00',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  date: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 12,
  },
  mainStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 2,
  },
  circleContainer: {
    alignItems: 'center',
    flex: 1.5,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  circleValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF7B00',
  },
  circleLabel: {
    fontSize: 12,
    color: '#FF9D45',
  },
  overGoal: {
    color: '#FF4444',
  },
  progressContainer: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
});
