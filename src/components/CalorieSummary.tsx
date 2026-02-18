import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

interface CalorieSummaryProps {
  consumed: number;
  goal: number;
  exerciseBurnt?: number;
  exerciseGoal?: number;
  date?: string;
}

export const CalorieSummary: React.FC<CalorieSummaryProps> = ({
  consumed,
  goal,
  exerciseBurnt = 0,
  exerciseGoal = 300,
  date,
}) => {
  const roundedConsumed = Math.round(consumed);
  const roundedExercise = Math.round(exerciseBurnt);
  
  // Net calories = consumed - burnt
  const netCalories = roundedConsumed - roundedExercise;
  const remaining = Math.round(goal - netCalories);
  const isOverGoal = netCalories > goal;

  // Circular progress calculations
  const size = 140;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Food progress (percentage of goal consumed)
  const foodPercentage = Math.min((roundedConsumed / goal) * 100, 100);
  const foodStrokeDashoffset = circumference - (foodPercentage / 100) * circumference;
  
  // Exercise progress (percentage of exercise goal)
  const exercisePercentage = Math.min((roundedExercise / exerciseGoal) * 100, 100);
  const exerciseStrokeDashoffset = circumference - (exercisePercentage / 100) * circumference;

  return (
    <View style={styles.container}>
      {date && <Text style={styles.date}>{date}</Text>}
      
      <View style={styles.mainContent}>
        {/* Left Side - Food Calories */}
        <View style={styles.sideSection}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="food-apple" size={24} color="#FF9500" />
          </View>
          <Text style={styles.sideValue}>{roundedConsumed}</Text>
          <Text style={styles.sideLabel}>Consumed</Text>
          <View style={styles.miniProgress}>
            <View style={[styles.miniProgressFill, styles.foodProgressFill, { width: `${foodPercentage}%` }]} />
          </View>
          <Text style={styles.goalText}>of {goal}</Text>
        </View>

        {/* Center - Circular Chart */}
        <View style={styles.centerSection}>
          <View style={styles.circularContainer}>
            <Svg width={size} height={size}>
              <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                {/* Background circle */}
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                {/* Food progress (orange) - starts from top, goes clockwise */}
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="#FFB74D"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={foodStrokeDashoffset}
                  strokeLinecap="round"
                />
                {/* Exercise progress (green) - inner ring */}
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius - 16}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth={8}
                  fill="transparent"
                />
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius - 16}
                  stroke="#66BB6A"
                  strokeWidth={8}
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * (radius - 16)}
                  strokeDashoffset={(2 * Math.PI * (radius - 16)) * (1 - exercisePercentage / 100)}
                  strokeLinecap="round"
                />
              </G>
            </Svg>
            {/* Center text */}
            <View style={styles.centerTextContainer}>
              <Text style={[styles.remainingValue, isOverGoal && styles.overGoalText]}>
                {Math.abs(remaining)}
              </Text>
              <Text style={[styles.remainingLabel, isOverGoal && styles.overGoalText]}>
                {isOverGoal ? 'Over' : 'Left'}
              </Text>
            </View>
          </View>
        </View>

        {/* Right Side - Exercise Calories */}
        <View style={styles.sideSection}>
          <View style={[styles.iconCircle, styles.exerciseIconCircle]}>
            <MaterialCommunityIcons name="run-fast" size={24} color="#4CAF50" />
          </View>
          <Text style={[styles.sideValue, styles.exerciseValue]}>{roundedExercise}</Text>
          <Text style={styles.sideLabel}>Burnt</Text>
          <View style={styles.miniProgress}>
            <View style={[styles.miniProgressFill, styles.exerciseProgressFill, { width: `${exercisePercentage}%` }]} />
          </View>
          <Text style={styles.goalText}>of {exerciseGoal}</Text>
        </View>
      </View>

      {/* Net calories info */}
      <View style={styles.netCaloriesRow}>
        <Ionicons name="calculator-outline" size={14} color="rgba(255,255,255,0.7)" />
        <Text style={styles.netCaloriesText}>
          Net: {roundedConsumed} - {roundedExercise} = {netCalories} cal
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF7B00',
    borderRadius: 20,
    padding: 16,
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
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideSection: {
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseIconCircle: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  sideValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  exerciseValue: {
    color: '#FFFFFF',
  },
  sideLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
    marginBottom: 6,
  },
  miniProgress: {
    width: 50,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  foodProgressFill: {
    backgroundColor: '#FFE082',
  },
  exerciseProgressFill: {
    backgroundColor: '#81C784',
  },
  goalText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 3,
  },
  centerSection: {
    alignItems: 'center',
    flex: 1.5,
  },
  circularContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remainingValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  remainingLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: -2,
  },
  overGoalText: {
    color: '#FFCDD2',
  },
  netCaloriesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  netCaloriesText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
});
