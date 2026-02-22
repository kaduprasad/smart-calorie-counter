import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { FoodItem } from '../types';
import { getUnitLabel } from '../data/foods';
import { NumericInput } from './NumericInput';

interface QuantitySelectorProps {
  visible: boolean;
  food: FoodItem;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  initialQuantity?: number;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  visible,
  food,
  onClose,
  onConfirm,
  initialQuantity = 1,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity.toString());

  const handleIncrement = () => {
    const current = parseFloat(quantity) || 0;
    setQuantity((current + 0.5).toString());
  };

  const handleDecrement = () => {
    const current = parseFloat(quantity) || 0;
    if (current > 0.5) {
      setQuantity((current - 0.5).toString());
    }
  };

  const handleConfirm = () => {
    const qty = parseFloat(quantity);
    if (qty > 0) {
      onConfirm(qty);
      setQuantity('1');
    }
  };

  const handleClose = () => {
    setQuantity('1');
    onClose();
  };

  const numericQuantity = parseFloat(quantity) || 0;
  const totalCalories = Math.round(numericQuantity * food.caloriesPerUnit);
  
  // Calculate weight/volume
  const totalWeight = food.unitWeight ? Math.round(numericQuantity * food.unitWeight) : null;
  const isLiquid = ['glass', 'cup'].includes(food.unit) && 
    ['beverages', 'dairy'].includes(food.category);
  const weightUnit = isLiquid ? 'ml' : 'g';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Add to Log</Text>
          
          <View style={styles.foodInfo}>
            <Text style={styles.foodName}>{food.name}</Text>
            {food.nameMarathi && (
              <Text style={styles.foodNameMarathi}>{food.nameMarathi}</Text>
            )}
          </View>

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleDecrement}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>

            <View style={styles.quantityInputContainer}>
              <NumericInput
                style={styles.quantityInput}
                value={quantity}
                onChangeText={setQuantity}
                allowDecimal={true}
                maxDecimalPlaces={2}
                selectTextOnFocus
              />
              <Text style={styles.unitText}>
                {getUnitLabel(food.unit, numericQuantity)}
              </Text>
              {totalWeight !== null && (
                <Text style={styles.weightText}>= {totalWeight}{weightUnit}</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleIncrement}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quickSelect}>
            {[0.5, 1, 1.5, 2, 3].map((qty) => (
              <TouchableOpacity
                key={qty}
                style={[
                  styles.quickSelectButton,
                  numericQuantity === qty && styles.quickSelectButtonActive,
                ]}
                onPress={() => setQuantity(qty.toString())}
              >
                <Text
                  style={[
                    styles.quickSelectText,
                    numericQuantity === qty && styles.quickSelectTextActive,
                  ]}
                >
                  {qty}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.calorieInfo}>
            <Text style={styles.calorieLabel}>Total Calories</Text>
            <Text style={styles.calorieValue}>{totalCalories} cal</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 16,
  },
  foodInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  foodNameMarathi: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  quantityButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF7B00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  quantityInputContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  quantityInput: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    minWidth: 80,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#FF7B00',
  },
  unitText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  weightText: {
    fontSize: 13,
    color: '#999999',
    marginTop: 2,
  },
  quickSelect: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  quickSelectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  quickSelectButtonActive: {
    backgroundColor: '#FF7B00',
  },
  quickSelectText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  quickSelectTextActive: {
    color: '#FFFFFF',
  },
  calorieInfo: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    marginBottom: 24,
  },
  calorieLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  calorieValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF7B00',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  confirmButton: {
    backgroundColor: '#FF7B00',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
