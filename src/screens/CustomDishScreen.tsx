import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../common/colors';
import { useApp } from '../context/AppContext';
import { FoodItem, FoodUnit } from '../types';
import { InputTextField } from '../components/InputTextField';
import { FormField } from '../components/FormField';
import { RecipeBuilder } from '../components/RecipeBuilder';
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
  const [showRecipeBuilder, setShowRecipeBuilder] = useState(false);

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

  const handleRecipeSave = async (recipe: {
    name: string;
    nameMarathi: string;
    servings: number;
    ingredients: { ingredient: { name: string }; grams: number }[];
    totalCalories: number;
    totalProtein: number;
    totalFat: number;
    totalFiber: number;
    caloriesPerServing: number;
  }) => {
    const newFood: FoodItem = {
      id: `custom-${Date.now()}`,
      name: recipe.name,
      nameMarathi: recipe.nameMarathi || undefined,
      category: 'custom',
      caloriesPerUnit: recipe.caloriesPerServing,
      proteinPerUnit: Math.round(recipe.totalProtein / recipe.servings),
      fatPerUnit: Math.round(recipe.totalFat / recipe.servings),
      fiberPerUnit: Math.round(recipe.totalFiber / recipe.servings),
      unit: 'serving',
      isCustom: true,
      searchKeywords: recipe.ingredients.map(i => i.ingredient.name.toLowerCase()),
    };

    try {
      await createCustomFood(newFood);
      setShowRecipeBuilder(false);
      Alert.alert('Success', `"${recipe.name}" created!\n${recipe.caloriesPerServing} cal per serving (${recipe.servings} servings)`);
    } catch (error) {
      Alert.alert('Error', 'Failed to create dish');
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="chef-hat" size={28} color={COLORS.purple} />
          <Text style={styles.title}>Custom Dishes</Text>
        </View>
        <Text style={styles.subtitle}>Create your own meal recipes</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {!showForm ? (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setShowForm(true)}
            >
              <Ionicons name="add-circle" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.createButtonText}>Quick Create</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.recipeButton}
              onPress={() => setShowRecipeBuilder(true)}
            >
              <MaterialCommunityIcons name="chef-hat" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
              <View>
                <Text style={styles.recipeButtonText}>Build from Ingredients</Text>
                <Text style={styles.recipeButtonSub}>Calculate calories from raw ingredients</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.formTitle}>New Custom Dish</Text>

            <InputTextField
              label="Dish Name"
              required
              value={name}
              onChangeText={setName}
              placeholder="e.g., Mom's Special Sabji"
            />

            <InputTextField
              label="Regional Name"
              value={nameMarathi}
              onChangeText={setNameMarathi}
              placeholder="e.g. आईची भाजी"
            />

            <InputTextField
              label="Calories per Unit"
              required
              numeric
              allowDecimal={false}
              value={calories}
              onChangeText={setCalories}
              placeholder="e.g., 150"
            />

            <InputTextField
              label="Weight per Unit (grams)"
              numeric
              allowDecimal={false}
              value={weight}
              onChangeText={setWeight}
              placeholder="e.g., 100"
            />

            <FormField label="Unit Type">
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
            </FormField>

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
            customFoods.map(item => (
              <View key={item.id} style={styles.customFoodItem}>
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
            ))
          )}
        </View>
      </ScrollView>

      <RecipeBuilder
        visible={showRecipeBuilder}
        onClose={() => setShowRecipeBuilder(false)}
        onSave={handleRecipeSave}
      />
    </SafeAreaView>
  );
};
