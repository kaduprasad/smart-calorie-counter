import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FoodItem } from '../types';
import { getUnitLabel } from '../data/foods';

// Food IDs that support quick add
const QUICK_ADD_FOOD_IDS = [
  'chapati',
  'bhakri-jowar',
  'bhakri-bajra',
  'bhakri-nachni',
  'plain-rice',
  'masale-bhat',
  'varan-bhat',
  'khichdi',
  'pulao',
  'curd-rice',
  'lemon-rice',
  'tomato-rice',
  'pongal',
  'veg-biryani',
  'carrot-raw',
  'cucumber',
  'banana',
  'guava',
  'pani-puri',
  'marie-biscuit',
  'parle-g-biscuit',
  'potato-chips',
  'popcorn-plain',
  'popcorn-cheese',
  'boiled-egg',
  'idli',
];

// Categories that support quick add (for rice items not in list)
const QUICK_ADD_CATEGORIES = ['rice'];

// Check if food supports quick add
export const supportsQuickAdd = (food: FoodItem): boolean => {
  if (QUICK_ADD_FOOD_IDS.includes(food.id)) return true;
  if (QUICK_ADD_CATEGORIES.includes(food.category)) return true;
  // Also match by name patterns
  const nameLower = food.name.toLowerCase();
  if (nameLower.includes('chapati') || nameLower.includes('roti') || 
      nameLower.includes('bhakri') || nameLower.includes('phulka')) return true;
  return false;
};

const QUICK_QUANTITIES = [1, 1.5, 2, 2.5, 3];

interface FoodCardProps {
  food: FoodItem;
  onPress: () => void;
  onQuickAdd?: (food: FoodItem, quantity: number) => void;
  showCalories?: boolean;
  // Selection mode props
  isSelectionMode?: boolean;
  isSelected?: boolean;
  selectedQuantity?: number;
  onSelect?: (food: FoodItem, quantity?: number) => void;
}

// Quick Add Button component with hover support
const QuickAddButton: React.FC<{
  qty: number;
  isSelected: boolean;
  onPress: () => void;
}> = ({ qty, isSelected, onPress }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Pressable
      style={[
        styles.quickAddButton,
        isHovered && styles.quickAddButtonHovered,
        isSelected && styles.quickAddButtonSelected,
      ]}
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
    >
      <Text
        style={[
          styles.quickAddButtonText,
          isHovered && styles.quickAddButtonTextHovered,
          isSelected && styles.quickAddButtonTextSelected,
        ]}
      >
        {qty}
      </Text>
    </Pressable>
  );
};

export const FoodCard: React.FC<FoodCardProps> = ({ 
  food, 
  onPress, 
  onQuickAdd, 
  showCalories = true,
  isSelectionMode = false,
  isSelected = false,
  selectedQuantity,
  onSelect,
}) => {
  const [animatingQty, setAnimatingQty] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  // Show quick add for supported foods - works with both direct add and multi-select
  const showQuickAdd = supportsQuickAdd(food) && (onQuickAdd || onSelect);

  const handleQuickSelect = (qty: number) => {
    setAnimatingQty(qty);
    // Small delay to show press animation
    setTimeout(() => {
      if (onSelect) {
        // Add/update in multi-select cart with specified quantity
        onSelect(food, qty);
      } else if (onQuickAdd) {
        onQuickAdd(food, qty);
      }
      setAnimatingQty(null);
    }, 150);
  };

  const handlePress = () => {
    // Always call onSelect if available (auto multi-select)
    if (onSelect) {
      onSelect(food);
    } else {
      onPress();
    }
  };

  // Determine which quick add button is "active" (matches cart quantity)
  const activeQty = isSelected ? selectedQuantity : null;

  return (
    <Pressable
      style={[
        styles.container, 
        isHovered && styles.containerHovered,
        isSelected && styles.containerSelected,
      ]}
      onPress={handlePress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
    >
      {/* Selection Checkbox - top right corner */}
      {onSelect && (
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && (
            <Ionicons name="checkmark" size={12} color="#FFFFFF" />
          )}
        </View>
      )}
      
      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.name}>{food.name}</Text>
          {food.nameMarathi && (
            <Text style={styles.nameMarathi}>{food.nameMarathi}</Text>
          )}
          <Text style={styles.unit}>
            Per {getUnitLabel(food.unit, 1)}
            {food.unitWeight && ` (${food.unitWeight}g)`}
          </Text>
        </View>
        {showCalories && (
          <View style={styles.calorieContainer}>
            <Text style={styles.calorieValue}>{food.caloriesPerUnit}</Text>
            <Text style={styles.calorieLabel}>cal</Text>
          </View>
        )}
      </View>
      
      {/* Quick Add Section */}
      {showQuickAdd && (
        <View style={styles.quickAddSection}>
          <Text style={styles.quickAddLabel}>
            {isSelected ? `Selected: ${selectedQuantity ?? 1} ${getUnitLabel(food.unit, selectedQuantity ?? 1)}` : `Quick add (${getUnitLabel(food.unit, 2)}):`}
          </Text>
          <View style={styles.quickAddButtons}>
            {QUICK_QUANTITIES.map((qty) => (
              <QuickAddButton
                key={qty}
                qty={qty}
                isSelected={animatingQty === qty || (activeQty === qty && animatingQty === null)}
                onPress={() => handleQuickSelect(qty)}
              />
            ))}
          </View>
        </View>
      )}
      
      {food.isCustom && (
        <View style={[styles.customBadge, onSelect && styles.customBadgeWithCheckbox]}>
          <Text style={styles.customBadgeText}>Custom</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  containerHovered: {
    backgroundColor: '#FFF8F0',
    borderWidth: 1,
    borderColor: '#FFB366',
    shadowOpacity: 0.15,
    elevation: 5,
  },
  containerSelected: {
    backgroundColor: '#FFF0E6',
    borderWidth: 2,
    borderColor: '#FF7B00',
  },
  checkbox: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  checkboxSelected: {
    backgroundColor: '#FF7B00',
    borderColor: '#FF7B00',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 1,
  },
  nameMarathi: {
    fontSize: 10.5,
    color: '#666666',
    marginBottom: 3,
  },
  unit: {
    fontSize: 10,
    color: '#888888',
  },
  calorieContainer: {
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 8,
    minWidth: 44,
  },
  calorieValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF7B00',
  },
  calorieLabel: {
    fontSize: 8,
    color: '#FF9D45',
  },
  // Quick Add Styles
  quickAddSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  quickAddLabel: {
    fontSize: 10,
    color: '#888888',
    marginBottom: 6,
  },
  quickAddButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 4,
  },
  quickAddButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    minWidth: 32,
  },
  quickAddButtonHovered: {
    backgroundColor: '#FFE0B2',
  },
  quickAddButtonSelected: {
    backgroundColor: '#FF7B00',
  },
  quickAddButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  quickAddButtonTextHovered: {
    color: '#FF7B00',
  },
  quickAddButtonTextSelected: {
    color: '#FFFFFF',
  },
  customBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  customBadgeWithCheckbox: {
    top: undefined,
    bottom: 8,
    right: 8,
  },
  customBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
