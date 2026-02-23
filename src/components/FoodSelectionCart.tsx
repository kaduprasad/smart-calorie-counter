import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FoodItem } from '../types';
import { getUnitLabel } from '../data/foods';
import { NumericInput } from './NumericInput';
import { IncrementButton, DecrementButton } from './IncrementDecrementButton';

export interface SelectedFood {
  food: FoodItem;
  quantity: number;
}

interface FoodSelectionCartProps {
  selectedFoods: SelectedFood[];
  onUpdateQuantity: (foodId: string, quantity: number) => void;
  onRemoveFood: (foodId: string) => void;
  onAddAll: () => void;
  onClearAll: () => void;
}

export const FoodSelectionCart: React.FC<FoodSelectionCartProps> = ({
  selectedFoods,
  onUpdateQuantity,
  onRemoveFood,
  onAddAll,
  onClearAll,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (selectedFoods.length === 0) {
    return null;
  }

  const totalCalories = selectedFoods.reduce(
    (sum, item) => sum + item.food.caloriesPerUnit * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.headerLeft}>
          <View style={styles.cartBadge}>
            <Ionicons name="cart" size={18} color="#FFFFFF" />
            <Text style={styles.cartCount}>{selectedFoods.length}</Text>
          </View>
          <Text style={styles.headerTitle}>Selected Foods</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.totalCalories}>{Math.round(totalCalories)} cal</Text>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#FF7B00"
          />
        </View>
      </TouchableOpacity>

      {/* Expanded Content */}
      {isExpanded && (
        <View style={styles.content}>
          <ScrollView
            style={styles.itemsList}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
          >
            {selectedFoods.map((item) => (
              <CartItem
                key={item.food.id}
                item={item}
                onUpdateQuantity={(qty) => onUpdateQuantity(item.food.id, qty)}
                onRemove={() => onRemoveFood(item.food.id)}
              />
            ))}
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.clearButton} onPress={onClearAll}>
              <Ionicons name="trash-outline" size={16} color="#FF5252" />
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addAllButton} onPress={onAddAll}>
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
              <Text style={styles.addAllText}>Add All ({selectedFoods.length})</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

// Individual cart item component
interface CartItemProps {
  item: SelectedFood;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const [inputValue, setInputValue] = useState(item.quantity.toString());

  // Sync local input when parent quantity changes (e.g. from quick add buttons)
  useEffect(() => {
    setInputValue(item.quantity.toString());
  }, [item.quantity]);

  const handleQuantityChange = (text: string) => {
    setInputValue(text);
    const qty = parseFloat(text);
    if (!isNaN(qty) && qty > 0) {
      onUpdateQuantity(qty);
    }
  };

  const handleIncrement = () => {
    const newQty = item.quantity + 0.5;
    setInputValue(newQty.toString());
    onUpdateQuantity(newQty);
  };

  const handleDecrement = () => {
    if (item.quantity > 0.5) {
      const newQty = item.quantity - 0.5;
      setInputValue(newQty.toString());
      onUpdateQuantity(newQty);
    }
  };

  const calories = Math.round(item.food.caloriesPerUnit * item.quantity);

  return (
    <View style={styles.cartItem}>
      <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
        <Ionicons name="close-circle" size={20} color="#FF5252" />
      </TouchableOpacity>

      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.food.name}
        </Text>
        <Text style={styles.itemCalories}>
          {item.food.caloriesPerUnit} cal/{getUnitLabel(item.food.unit, 1)}
        </Text>
      </View>

      <View style={styles.quantityControls}>
        <DecrementButton onPress={handleDecrement} size="medium" color="#FF7B00" />
        <NumericInput
          style={styles.qtyInput}
          value={inputValue}
          onChangeText={handleQuantityChange}
          allowDecimal={true}
          maxDecimalPlaces={1}
        />
        <IncrementButton onPress={handleIncrement} size="medium" color="#FF7B00" />
      </View>

      <Text style={styles.itemTotal}>{calories}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFD9B3',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF0E0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cartBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF7B00',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  cartCount: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalCalories: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF7B00',
  },
  content: {
    padding: 12,
    paddingTop: 4,
  },
  itemsList: {
    maxHeight: 200,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE6CC',
  },
  removeBtn: {
    marginRight: 8,
  },
  itemInfo: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333333',
  },
  itemCalories: {
    fontSize: 11,
    color: '#888888',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF7B00',
    lineHeight: 28,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  qtyInput: {
    width: 40,
    height: 28,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  itemTotal: {
    width: 50,
    fontSize: 14,
    fontWeight: '700',
    color: '#FF7B00',
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#FFE6CC',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FFF0F0',
    gap: 6,
  },
  clearText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF5252',
  },
  addAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#FF7B00',
    gap: 6,
  },
  addAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
