import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { FoodItem, FoodUnit } from '../types';
import { NumericInput } from '../components/NumericInput';
import { styles } from './styles/customDishScreenStyles';

const unitOptions: { value: FoodUnit; label: string }[] = [
  { value: 'piece', label: 'Piece' },
  { value: 'serving', label: 'Serving' },
  { value: 'grams', label: 'Grams' },
  { value: 'cup', label: 'Cup' },
  { value: 'bowl', label: 'Bowl' },
  { value: 'plate', label: 'Plate' },
  { value: 'tablespoon', label: 'Tablespoon' },
  { value: 'teaspoon', label: 'Teaspoon' },
];

export const CustomDishScreen: React.FC = () => {
  const { customFoods, createCustomFood, removeCustomFood } = useApp();

  const [name, setName] = useState('');
  const [nameMarathi, setNameMarathi] = useState('');
  const [calories, setCalories] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<FoodUnit>('serving');
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a dish name');
      return;
    }

    const calorieNum = parseInt(calories);
    const weightNum = parseInt(weight);

    if (isNaN(calorieNum) || calorieNum <= 0) {
      Alert.alert('Error', 'Please enter valid calories');
      return;
    }

    const newFood: FoodItem = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      nameMarathi: nameMarathi.trim() || undefined,
      category: 'custom',
      caloriesPerUnit: calorieNum,
      unit: selectedUnit,
      unitWeight: weightNum || undefined,
      isCustom: true,
    };

    try {
      await createCustomFood(newFood);
      setName('');
      setNameMarathi('');
      setCalories('');
      setWeight('');
      setSelectedUnit('serving');
      setShowForm(false);
      Alert.alert('Success', 'Custom dish created!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create custom dish');
    }
  };

  const handleDelete = (food: FoodItem) => {
    Alert.alert(
      'Delete Custom Dish',
      `Are you sure you want to delete "${food.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeCustomFood(food.id),
        },
      ]
    );
  };

  const renderCustomFood = ({ item }: { item: FoodItem }) => (
    <View style={styles.customFoodItem}>
      <View style={styles.customFoodInfo}>
        <Text style={styles.customFoodName}>{item.name}</Text>
        {item.nameMarathi && (
          <Text style={styles.customFoodMarathi}>{item.nameMarathi}</Text>
        )}
        <Text style={styles.customFoodCalories}>
          {item.caloriesPerUnit} cal per {item.unit}
          {item.unitWeight && ` (${item.unitWeight}g)`}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item)}
      >
        <Ionicons name="trash-outline" size={22} color="#FF4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="star" size={28} color="#FF7B00" />
          <Text style={styles.title}>Custom Dishes</Text>
        </View>
        <Text style={styles.subtitle}>Create your own food items</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {!showForm ? (
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setShowForm(true)}
          >
            <Ionicons name="add-circle" size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.createButtonText}>Create New Dish</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.form}>
            <Text style={styles.formTitle}>New Custom Dish</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dish Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g., Mom's Special Sabji"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Marathi Name (optional)</Text>
              <TextInput
                style={styles.input}
                value={nameMarathi}
                onChangeText={setNameMarathi}
                placeholder="e.g., आईची भाजी"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Calories per Unit *</Text>
              <NumericInput
                style={styles.input}
                value={calories}
                onChangeText={setCalories}
                placeholder="e.g., 150"
                allowDecimal={false}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Weight per Unit (grams, optional)</Text>
              <NumericInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="e.g., 100"
                allowDecimal={false}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Unit Type</Text>
              <View style={styles.unitOptions}>
                {unitOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.unitOption,
                      selectedUnit === option.value && styles.unitOptionActive,
                    ]}
                    onPress={() => setSelectedUnit(option.value)}
                  >
                    <Text
                      style={[
                        styles.unitOptionText,
                        selectedUnit === option.value && styles.unitOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formButtons}>
              <TouchableOpacity
                style={[styles.formButton, styles.cancelButton]}
                onPress={() => {
                  setShowForm(false);
                  setName('');
                  setNameMarathi('');
                  setCalories('');
                  setWeight('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formButton, styles.saveButton]}
                onPress={handleCreate}
              >
                <Text style={styles.saveButtonText}>Create Dish</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>
            Your Custom Dishes ({customFoods.length})
          </Text>

          {customFoods.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="chef-hat" size={48} color="#CCCCCC" />
              <Text style={styles.emptyText}>No custom dishes yet</Text>
              <Text style={styles.emptySubtext}>
                Create your own dishes to track unique recipes
              </Text>
            </View>
          ) : (
            <FlatList
              data={customFoods}
              keyExtractor={(item) => item.id}
              renderItem={renderCustomFood}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
