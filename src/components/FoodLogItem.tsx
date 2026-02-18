import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FoodLogEntry } from '../types';
import { getUnitLabel } from '../data/foods';

interface FoodLogItemProps {
  entry: FoodLogEntry;
  onEdit: () => void;
  onDelete: () => void;
}

export const FoodLogItem: React.FC<FoodLogItemProps> = ({ entry, onEdit, onDelete }) => {
  const totalCalories = Math.round(entry.quantity * entry.foodItem.caloriesPerUnit);
  
  // Calculate weight/volume
  const totalWeight = entry.foodItem.unitWeight 
    ? Math.round(entry.quantity * entry.foodItem.unitWeight) 
    : null;
  const isLiquid = ['glass', 'cup'].includes(entry.foodItem.unit) && 
    ['beverages', 'dairy'].includes(entry.foodItem.category);
  const weightUnit = isLiquid ? 'ml' : 'g';

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.content} onPress={onEdit} activeOpacity={0.7}>
        <View style={styles.info}>
          <Text style={styles.name}>{entry.foodItem.name}</Text>
          <Text style={styles.quantity}>
            {entry.quantity} {getUnitLabel(entry.foodItem.unit, entry.quantity)}
            {totalWeight !== null && (
              <Text style={styles.weight}> ({totalWeight}{weightUnit})</Text>
            )}
          </Text>
        </View>
        <View style={styles.calorieContainer}>
          <Text style={styles.calorieValue}>{totalCalories}</Text>
          <Text style={styles.calorieLabel}>cal</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={onDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.deleteText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  quantity: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  weight: {
    fontSize: 12,
    color: '#999999',
  },
  calorieContainer: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  calorieValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF7B00',
  },
  calorieLabel: {
    fontSize: 11,
    color: '#FF9D45',
  },
  deleteButton: {
    padding: 12,
    paddingLeft: 0,
  },
  deleteText: {
    fontSize: 24,
    color: '#FF4444',
    fontWeight: '300',
  },
});
