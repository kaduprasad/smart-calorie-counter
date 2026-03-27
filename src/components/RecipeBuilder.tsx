import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { INGREDIENTS, INGREDIENT_CATEGORIES, Ingredient, IngredientCategory, getIngredientWeightUnit } from '../data/ingredients';
import { InputTextField } from './InputTextField';

export interface RecipeIngredient {
  ingredient: Ingredient;
  grams: number;
}

interface RecipeBuilderProps {
  visible: boolean;
  onClose: () => void;
  onSave: (recipe: {
    name: string;
    nameMarathi: string;
    servings: number;
    ingredients: RecipeIngredient[];
    totalCalories: number;
    totalProtein: number;
    totalFat: number;
    totalFiber: number;
    caloriesPerServing: number;
  }) => void;
}

export const RecipeBuilder: React.FC<RecipeBuilderProps> = ({ visible, onClose, onSave }) => {
  const [step, setStep] = useState<'ingredients' | 'details'>('ingredients');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IngredientCategory | null>(null);
  const [addedIngredients, setAddedIngredients] = useState<RecipeIngredient[]>([]);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [editGrams, setEditGrams] = useState('');
  const [useMeasure, setUseMeasure] = useState(false);
  const [measureQty, setMeasureQty] = useState('1');
  const [recipeName, setRecipeName] = useState('');
  const [recipeNameMarathi, setRecipeNameMarathi] = useState('');
  const [servings, setServings] = useState('1');

  const filteredIngredients = useMemo(() => {
    let list = INGREDIENTS;
    if (selectedCategory) {
      list = list.filter(i => i.category === selectedCategory);
    }
    if (search.trim()) {
      const term = search.toLowerCase().trim();
      list = list.filter(i =>
        i.name.toLowerCase().includes(term) ||
        (i.nameLocal && i.nameLocal.includes(term))
      );
    }
    return list;
  }, [search, selectedCategory]);

  const totals = useMemo(() => {
    const t = { calories: 0, protein: 0, fat: 0, fiber: 0 };
    for (const item of addedIngredients) {
      const ratio = item.grams / 100;
      t.calories += item.ingredient.caloriesPer100g * ratio;
      t.protein += item.ingredient.proteinPer100g * ratio;
      t.fat += item.ingredient.fatPer100g * ratio;
      t.fiber += item.ingredient.fiberPer100g * ratio;
    }
    return t;
  }, [addedIngredients]);

  const servingNum = Math.max(1, parseInt(servings) || 1);
  const caloriesPerServing = Math.round(totals.calories / servingNum);

  const handleAddIngredient = useCallback((ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    if (ingredient.measureGrams) {
      setUseMeasure(true);
      setMeasureQty('1');
      setEditGrams(ingredient.measureGrams.toString());
    } else {
      setUseMeasure(false);
      setEditGrams('100');
    }
  }, []);

  const confirmAddIngredient = useCallback(() => {
    if (!editingIngredient) return;
    const grams = parseFloat(editGrams);
    if (isNaN(grams) || grams <= 0) return;

    setAddedIngredients(prev => {
      const existing = prev.findIndex(i => i.ingredient.id === editingIngredient.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], grams: updated[existing].grams + grams };
        return updated;
      }
      return [...prev, { ingredient: editingIngredient, grams }];
    });
    setEditingIngredient(null);
  }, [editingIngredient, editGrams]);

  const removeIngredient = useCallback((id: string) => {
    setAddedIngredients(prev => prev.filter(i => i.ingredient.id !== id));
  }, []);

  const handleMeasureChange = useCallback((qty: string) => {
    setMeasureQty(qty);
    const num = parseFloat(qty) || 0;
    if (editingIngredient?.measureGrams) {
      setEditGrams(Math.round(num * editingIngredient.measureGrams).toString());
    }
  }, [editingIngredient]);

  const handleGramsChange = useCallback((val: string) => {
    setEditGrams(val);
    setUseMeasure(false);
  }, []);

  const handleSave = useCallback(() => {
    if (!recipeName.trim() || addedIngredients.length === 0) return;
    onSave({
      name: recipeName.trim(),
      nameMarathi: recipeNameMarathi.trim(),
      servings: servingNum,
      ingredients: addedIngredients,
      totalCalories: Math.round(totals.calories),
      totalProtein: Math.round(totals.protein),
      totalFat: Math.round(totals.fat),
      totalFiber: Math.round(totals.fiber),
      caloriesPerServing,
    });
    // Reset
    setStep('ingredients');
    setAddedIngredients([]);
    setRecipeName('');
    setRecipeNameMarathi('');
    setServings('1');
    setSearch('');
    setSelectedCategory(null);
  }, [recipeName, recipeNameMarathi, servingNum, addedIngredients, totals, caloriesPerServing, onSave]);

  const handleClose = useCallback(() => {
    setStep('ingredients');
    setAddedIngredients([]);
    setRecipeName('');
    setRecipeNameMarathi('');
    setServings('1');
    setSearch('');
    setSelectedCategory(null);
    setEditingIngredient(null);
    onClose();
  }, [onClose]);

  const renderIngredient = useCallback(({ item }: { item: Ingredient }) => {
    const isAdded = addedIngredients.some(a => a.ingredient.id === item.id);
    return (
      <TouchableOpacity
        style={[s.ingredientRow, isAdded && s.ingredientRowAdded]}
        onPress={() => handleAddIngredient(item)}
      >
        <View style={s.ingredientInfo}>
          <Text style={s.ingredientName} numberOfLines={1}>{item.name}</Text>
          {item.nameLocal && (
            <Text style={s.ingredientLocal} numberOfLines={1}>{item.nameLocal}</Text>
          )}
        </View>
        <View style={s.ingredientMeta}>
          <Text style={s.ingredientCal}>{item.caloriesPer100g} cal</Text>
          <Text style={s.ingredientPer100}>per 100{getIngredientWeightUnit(item)}</Text>
        </View>
        <Ionicons
          name={isAdded ? 'checkmark-circle' : 'add-circle-outline'}
          size={22}
          color={isAdded ? '#4CAF50' : '#FF7B00'}
        />
      </TouchableOpacity>
    );
  }, [addedIngredients, handleAddIngredient]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={s.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={handleClose} style={s.headerBtn}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <View style={s.headerCenter}>
            <MaterialCommunityIcons name="chef-hat" size={22} color="#7C3AED" />
            <Text style={s.headerTitle}>Recipe Builder</Text>
          </View>
          <View style={s.headerBtn} />
        </View>

        {/* Nutrition Summary Bar */}
        {addedIngredients.length > 0 && (
          <View style={s.summaryBar}>
            <View style={s.summaryItem}>
              <Text style={s.summaryValue}>{Math.round(totals.calories)}</Text>
              <Text style={s.summaryLabel}>cal</Text>
            </View>
            <View style={s.summaryDivider} />
            <View style={s.summaryItem}>
              <Text style={s.summaryValue}>{Math.round(totals.protein)}g</Text>
              <Text style={s.summaryLabel}>protein</Text>
            </View>
            <View style={s.summaryDivider} />
            <View style={s.summaryItem}>
              <Text style={s.summaryValue}>{Math.round(totals.fat)}g</Text>
              <Text style={s.summaryLabel}>fat</Text>
            </View>
            <View style={s.summaryDivider} />
            <View style={s.summaryItem}>
              <Text style={s.summaryValue}>{Math.round(totals.fiber)}g</Text>
              <Text style={s.summaryLabel}>fiber</Text>
            </View>
            <View style={s.summaryDivider} />
            <View style={s.summaryItem}>
              <Text style={[s.summaryValue, { color: '#7C3AED' }]}>{addedIngredients.length}</Text>
              <Text style={s.summaryLabel}>items</Text>
            </View>
          </View>
        )}

        {step === 'ingredients' ? (
          <>
            {/* Search */}
            <View style={s.searchRow}>
              <View style={s.searchBox}>
                <Ionicons name="search" size={18} color="#9CA3AF" />
                <TextInput
                  style={s.searchInput}
                  placeholder="Search ingredients..."
                  placeholderTextColor="#9CA3AF"
                  value={search}
                  onChangeText={setSearch}
                />
                {search.length > 0 && (
                  <TouchableOpacity onPress={() => setSearch('')}>
                    <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Category Pills */}
            <View style={s.categoryWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.categoryRow}
              >
              <TouchableOpacity
                style={[s.categoryPill, !selectedCategory && s.categoryPillActive]}
                onPress={() => setSelectedCategory(null)}
              >
                <Text style={[s.categoryPillText, !selectedCategory && s.categoryPillTextActive]}>All</Text>
              </TouchableOpacity>
              {INGREDIENT_CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.key}
                  style={[s.categoryPill, selectedCategory === cat.key && s.categoryPillActive]}
                  onPress={() => setSelectedCategory(
                    selectedCategory === cat.key ? null : cat.key
                  )}
                >
                  <MaterialCommunityIcons
                    name={cat.icon as any}
                    size={14}
                    color={selectedCategory === cat.key ? '#FFF' : '#666'}
                  />
                  <Text style={[s.categoryPillText, selectedCategory === cat.key && s.categoryPillTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
              </ScrollView>
            </View>

            {/* Ingredient List */}
            <FlatList
              data={filteredIngredients}
              keyExtractor={item => item.id}
              renderItem={renderIngredient}
              style={s.ingredientList}
              contentContainerStyle={s.listContent}
              ListEmptyComponent={
                <View style={s.emptyList}>
                  <Text style={s.emptyListText}>No ingredients found</Text>
                </View>
              }
            />

            {/* Added Ingredients Tray */}
            {addedIngredients.length > 0 && (
              <View style={s.tray}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.trayScroll}>
                  {addedIngredients.map(item => (
                    <View key={item.ingredient.id} style={s.trayChip}>
                      <Text style={s.trayChipText} numberOfLines={1}>
                        {item.ingredient.name.split('(')[0].trim()}
                      </Text>
                      <Text style={s.trayChipGrams}>{item.grams}{getIngredientWeightUnit(item.ingredient)}</Text>
                      <TouchableOpacity onPress={() => removeIngredient(item.ingredient.id)}>
                        <Ionicons name="close-circle" size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={s.nextButton}
                  onPress={() => setStep('details')}
                >
                  <Text style={s.nextButtonText}>Next: Name & Save</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFF" />
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          /* Details Step */
          <ScrollView style={s.detailsScroll} contentContainerStyle={s.detailsContent}>
            <View style={s.detailsCard}>
              <Text style={s.detailsTitle}>Name Your Dish</Text>

              <InputTextField
                label="Dish Name"
                required
                value={recipeName}
                onChangeText={setRecipeName}
                placeholder="e.g., Mom's Special Sabji"
              />

              <InputTextField
                label="Regional Name"
                value={recipeNameMarathi}
                onChangeText={setRecipeNameMarathi}
                placeholder="e.g., आईची भाजी"
                containerStyle={{ marginTop: 12 }}
              />

              <InputTextField
                label="Number of Servings"
                required
                numeric
                allowDecimal={false}
                value={servings}
                onChangeText={setServings}
                placeholder="1"
                containerStyle={{ marginTop: 12 }}
              />
            </View>

            {/* Breakdown */}
            <View style={s.detailsCard}>
              <Text style={s.detailsTitle}>Ingredient Breakdown</Text>
              {addedIngredients.map(item => {
                const ratio = item.grams / 100;
                const cal = Math.round(item.ingredient.caloriesPer100g * ratio);
                return (
                  <View key={item.ingredient.id} style={s.breakdownRow}>
                    <View style={s.breakdownInfo}>
                      <Text style={s.breakdownName} numberOfLines={1}>{item.ingredient.name}</Text>
                      <Text style={s.breakdownGrams}>{item.grams}{getIngredientWeightUnit(item.ingredient)}</Text>
                    </View>
                    <Text style={s.breakdownCal}>{cal} cal</Text>
                    <TouchableOpacity onPress={() => removeIngredient(item.ingredient.id)} style={s.breakdownRemove}>
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                );
              })}
              <View style={s.breakdownTotalRow}>
                <Text style={s.breakdownTotalLabel}>Total</Text>
                <Text style={s.breakdownTotalValue}>{Math.round(totals.calories)} cal</Text>
              </View>
              {servingNum > 1 && (
                <View style={s.breakdownTotalRow}>
                  <Text style={s.breakdownTotalLabel}>Per Serving ({servingNum})</Text>
                  <Text style={[s.breakdownTotalValue, { color: '#7C3AED' }]}>{caloriesPerServing} cal</Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={s.actionRow}>
              <TouchableOpacity
                style={s.backButton}
                onPress={() => setStep('ingredients')}
              >
                <Ionicons name="arrow-back" size={18} color="#666" />
                <Text style={s.backButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.saveRecipeButton, (!recipeName.trim() || addedIngredients.length === 0) && s.saveRecipeButtonDisabled]}
                onPress={handleSave}
                disabled={!recipeName.trim() || addedIngredients.length === 0}
              >
                <MaterialCommunityIcons name="content-save" size={18} color="#FFF" />
                <Text style={s.saveRecipeText}>Save Dish</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* Quantity Input Modal */}
        {editingIngredient && (
          <Pressable style={s.qtyOverlay} onPress={() => setEditingIngredient(null)}>
            <Pressable style={s.qtyModal} onPress={e => e.stopPropagation()}>
              <Text style={s.qtyTitle}>{editingIngredient.name}</Text>
              {editingIngredient.nameLocal && (
                <Text style={s.qtySubtitle}>{editingIngredient.nameLocal}</Text>
              )}
              <Text style={s.qtyCalInfo}>
                {editingIngredient.caloriesPer100g} cal per 100{getIngredientWeightUnit(editingIngredient)}
              </Text>

              {/* Measure toggle */}
              {editingIngredient.commonMeasure && (
                <View style={s.measureSection}>
                  <TouchableOpacity
                    style={[s.measureTab, useMeasure && s.measureTabActive]}
                    onPress={() => {
                      setUseMeasure(true);
                      handleMeasureChange(measureQty);
                    }}
                  >
                    <Text style={[s.measureTabText, useMeasure && s.measureTabTextActive]}>
                      {editingIngredient.commonMeasure}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.measureTab, !useMeasure && s.measureTabActive]}
                    onPress={() => setUseMeasure(false)}
                  >
                    <Text style={[s.measureTabText, !useMeasure && s.measureTabTextActive]}>
                      {getIngredientWeightUnit(editingIngredient) === 'ml' ? 'Millilitres' : 'Grams'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {useMeasure && editingIngredient.commonMeasure ? (
                <View style={s.qtyInputRow}>
                  <InputTextField
                    label={`Quantity (${editingIngredient.commonMeasure})`}
                    numeric
                    allowDecimal
                    maxDecimalPlaces={1}
                    value={measureQty}
                    onChangeText={handleMeasureChange}
                    containerStyle={{ flex: 1 }}
                  />
                  <Text style={s.qtyEqualsText}>= {editGrams}{getIngredientWeightUnit(editingIngredient)}</Text>
                </View>
              ) : (
                <InputTextField
                  label={getIngredientWeightUnit(editingIngredient) === 'ml' ? 'Millilitres' : 'Grams'}
                  numeric
                  allowDecimal={false}
                  value={editGrams}
                  onChangeText={handleGramsChange}
                />
              )}

              {/* Preview nutrition */}
              {parseFloat(editGrams) > 0 && (
                <View style={s.qtyPreview}>
                  <Text style={s.qtyPreviewCal}>
                    {Math.round(editingIngredient.caloriesPer100g * (parseFloat(editGrams) || 0) / 100)} cal
                  </Text>
                  <Text style={s.qtyPreviewMacro}>
                    P: {(editingIngredient.proteinPer100g * (parseFloat(editGrams) || 0) / 100).toFixed(1)}g{' '}
                    F: {(editingIngredient.fatPer100g * (parseFloat(editGrams) || 0) / 100).toFixed(1)}g
                  </Text>
                </View>
              )}

              <View style={s.qtyActions}>
                <TouchableOpacity style={s.qtyCancelBtn} onPress={() => setEditingIngredient(null)}>
                  <Text style={s.qtyCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.qtyAddBtn, (!editGrams || parseFloat(editGrams) <= 0) && s.qtyAddBtnDisabled]}
                  onPress={confirmAddIngredient}
                  disabled={!editGrams || parseFloat(editGrams) <= 0}
                >
                  <Ionicons name="add" size={18} color="#FFF" />
                  <Text style={s.qtyAddText}>Add</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#F5F3FF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD6FE',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 1,
  },
  summaryDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#DDD6FE',
  },
  searchRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    padding: 0,
  },
  categoryWrapper: {
    maxHeight: 38,
  },
  categoryRow: {
    paddingHorizontal: 16,
    gap: 6,
    alignItems: 'center',
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 4,
    height: 30,
  },
  categoryPillActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  categoryPillTextActive: {
    color: '#FFF',
  },
  ingredientList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    gap: 10,
  },
  ingredientRowAdded: {
    borderColor: '#BBF7D0',
    backgroundColor: '#F0FDF4',
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  ingredientLocal: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 1,
  },
  ingredientMeta: {
    alignItems: 'flex-end',
  },
  ingredientCal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
  },
  ingredientPer100: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  emptyList: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyListText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  tray: {
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 10,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  trayScroll: {
    gap: 6,
    paddingBottom: 10,
  },
  trayChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    gap: 6,
  },
  trayChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    maxWidth: 80,
  },
  trayChipGrams: {
    fontSize: 11,
    color: '#7C3AED',
    fontWeight: '600',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C3AED',
    borderRadius: 10,
    paddingVertical: 12,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
  // Details step
  detailsScroll: {
    flex: 1,
  },
  detailsContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  detailsCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    gap: 8,
  },
  breakdownInfo: {
    flex: 1,
  },
  breakdownName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  breakdownGrams: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  breakdownCal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
  },
  breakdownRemove: {
    padding: 4,
  },
  breakdownTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 4,
  },
  breakdownTotalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  breakdownTotalValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 6,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  saveRecipeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C3AED',
    borderRadius: 10,
    paddingVertical: 14,
    gap: 8,
  },
  saveRecipeButtonDisabled: {
    opacity: 0.5,
  },
  saveRecipeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
  // Quantity Modal
  qtyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  qtyModal: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
  },
  qtyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  qtySubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  qtyCalInfo: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 14,
  },
  measureSection: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 3,
    marginBottom: 14,
    gap: 2,
  },
  measureTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  measureTabActive: {
    backgroundColor: '#7C3AED',
  },
  measureTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  measureTabTextActive: {
    color: '#FFF',
  },
  qtyInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  qtyEqualsText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '600',
    paddingBottom: 14,
  },
  qtyPreview: {
    backgroundColor: '#F5F3FF',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    alignItems: 'center',
  },
  qtyPreviewCal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#7C3AED',
  },
  qtyPreviewMacro: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  qtyActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  qtyCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  qtyCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  qtyAddBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  qtyAddBtnDisabled: {
    opacity: 0.5,
  },
  qtyAddText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
});
