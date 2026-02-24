import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ProgressScale } from '../common';
import { MacroTotals, MacroTargets } from '../types';

interface MacroSummaryProps {
  totals: MacroTotals;
  targets: MacroTargets;
}

interface MacroRowProps {
  label: string;
  icon: string;
  value: number;
  target: number;
  color: string;
  bgColor: string;
  unit?: string;
}

const MacroRow: React.FC<MacroRowProps> = ({
  label,
  icon,
  value,
  target,
  color,
  bgColor,
  unit = 'g',
}) => {
  const isOver = value > target;
  const statusColor = isOver ? '#EF4444' : color;

  return (
    <View style={styles.macroRow}>
      <View style={styles.macroHeader}>
        <View style={[styles.macroIconContainer, { backgroundColor: bgColor }]}>
          <MaterialCommunityIcons name={icon as any} size={18} color={color} />
        </View>
        <Text style={styles.macroLabel}>{label}</Text>
        <View style={styles.macroValues}>
          <Text style={[styles.macroValue, { color: statusColor }]}>
            {value}
          </Text>
          <Text style={styles.macroSeparator}>/</Text>
          <Text style={styles.macroTarget}>{target}{unit}</Text>
        </View>
      </View>
      <ProgressScale
        value={value}
        max={target}
        fillColor={statusColor}
        barHeight={10}
      />
    </View>
  );
};

export const MacroSummary: React.FC<MacroSummaryProps> = ({ totals, targets }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="nutrition" size={20} color="#1F2937" />
        <Text style={styles.title}>Macronutrients</Text>
      </View>

      <MacroRow
        label="Protein"
        icon="food-steak"
        value={totals.protein}
        target={targets.protein}
        color="#3B82F6"
        bgColor="#DBEAFE"
      />

      <MacroRow
        label="Fat"
        icon="oil"
        value={totals.fat}
        target={targets.fat}
        color="#F59E0B"
        bgColor="#FEF3C7"
      />

      <MacroRow
        label="Fiber"
        icon="leaf"
        value={totals.fiber}
        target={targets.fiber}
        color="#10B981"
        bgColor="#D1FAE5"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  macroRow: {
    marginBottom: 12,
  },
  macroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  macroIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  macroValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  macroSeparator: {
    fontSize: 13,
    color: '#9CA3AF',
    marginHorizontal: 2,
  },
  macroTarget: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
