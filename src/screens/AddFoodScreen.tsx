import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { FoodCard, SearchBar, CategoryFilter, supportsQuickAdd, FoodSelectionCart, SelectedFood, VoiceInputModal } from '../components';
import { categories, getUnitLabel } from '../data/foods';
import { searchFoods } from '../data/foodIndex';
import { FoodItem, FoodCategory } from '../types';
import { 
  searchFoodOnline, 
  OnlineSearchResult, 
  convertToFoodItem,
  getAlternativeSearchTerms 
} from '../services/foodSearch';
import { styles } from './styles/addFoodScreenStyles';
import { FOOD_LIST_PAGE_SIZE } from '../common/constants';

const PAGE_SIZE = FOOD_LIST_PAGE_SIZE;

// Quick Add Button for Recent Foods with hover support
const RecentQuickButton: React.FC<{
  qty: number;
  onPress: () => void;
}> = ({ qty, onPress }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Pressable
      style={[
        styles.recentQuickBtn,
        isHovered && styles.recentQuickBtnHovered,
      ]}
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
    >
      <Text
        style={[
          styles.recentQuickBtnText,
          isHovered && styles.recentQuickBtnTextHovered,
        ]}
      >
        {qty}
      </Text>
    </Pressable>
  );
};

export const AddFoodScreen: React.FC = () => {
  const navigation = useNavigation();
  const { allFoods, foodIndex, recentFoods, addFood, createCustomFood } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | null>(null);
  const [showRecent, setShowRecent] = useState(true);
  
  // Multi-select state (always enabled)
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);
  
  // Online search state
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [onlineResults, setOnlineResults] = useState<OnlineSearchResult[]>([]);
  const [showOnlineResults, setShowOnlineResults] = useState(false);

  // Voice input state
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  // Pagination state
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  // Pair recent foods into groups of 2 for stacked vertical display
  const recentFoodPairs = useMemo(() => {
    const pairs: FoodItem[][] = [];
    for (let i = 0; i < recentFoods.length; i += 2) {
      pairs.push(recentFoods.slice(i, i + 2));
    }
    return pairs;
  }, [recentFoods]);

  const filteredFoods = useMemo(() => {
    return searchFoods(foodIndex, searchQuery, selectedCategory);
  }, [foodIndex, selectedCategory, searchQuery]);

  // Reset pagination when filters change
  useEffect(() => {
    setDisplayCount(PAGE_SIZE);
  }, [searchQuery, selectedCategory]);

  // Paginated slice of filtered foods
  const displayedFoods = useMemo(() => {
    return filteredFoods.slice(0, displayCount);
  }, [filteredFoods, displayCount]);

  const handleLoadMore = useCallback(() => {
    if (displayCount < filteredFoods.length) {
      setDisplayCount(prev => Math.min(prev + PAGE_SIZE, filteredFoods.length));
    }
  }, [displayCount, filteredFoods.length]);

  // Multi-select handler - auto adds to selection
  const handleSelectFood = useCallback((food: FoodItem, quantity?: number) => {
    setSelectedFoods(prev => {
      const exists = prev.find(item => item.food.id === food.id);
      if (exists) {
        if (quantity !== undefined) {
          // Update quantity if specified (quick add while already selected)
          return prev.map(item =>
            item.food.id === food.id ? { ...item, quantity } : item
          );
        }
        // Remove from selection if no quantity specified (toggle)
        return prev.filter(item => item.food.id !== food.id);
      } else {
        // Add to selection with specified quantity or default of 1
        return [...prev, { food, quantity: quantity ?? 1 }];
      }
    });
  }, []);

  const handleUpdateSelectedQuantity = useCallback((foodId: string, quantity: number) => {
    setSelectedFoods(prev =>
      prev.map(item =>
        item.food.id === foodId ? { ...item, quantity } : item
      )
    );
  }, []);

  const handleRemoveFromSelection = useCallback((foodId: string) => {
    setSelectedFoods(prev => prev.filter(item => item.food.id !== foodId));
  }, []);

  const handleAddAllSelected = useCallback(async () => {
    if (selectedFoods.length === 0) return;

    // Add all selected foods
    for (const item of selectedFoods) {
      await addFood(item.food, item.quantity);
    }

    // Clear selection and navigate back
    setSelectedFoods([]);
    navigation.goBack();
  }, [selectedFoods, addFood, navigation]);

  const handleClearSelection = useCallback(() => {
    setSelectedFoods([]);
  }, []);

  // Voice input: add parsed foods to selection
  const handleVoiceAddFoods = useCallback((foods: SelectedFood[]) => {
    setSelectedFoods(prev => {
      const updated = [...prev];
      for (const item of foods) {
        const idx = updated.findIndex(s => s.food.id === item.food.id);
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + item.quantity };
        } else {
          updated.push(item);
        }
      }
      return updated;
    });
  }, []);

  // Check if a food is selected
  const isFoodSelected = useCallback((foodId: string) => {
    return selectedFoods.some(item => item.food.id === foodId);
  }, [selectedFoods]);

  // Get current quantity for a selected food (used to highlight quick add buttons)
  const getSelectedQuantity = useCallback((foodId: string): number | undefined => {
    const item = selectedFoods.find(item => item.food.id === foodId);
    return item?.quantity;
  }, [selectedFoods]);

  // Search for food online when not found locally
  const handleSearchOnline = async () => {
    if (!searchQuery.trim()) return;

    setIsSearchingOnline(true);
    setShowOnlineResults(true);
    
    try {
      // Get alternative search terms for Indian foods
      const searchTerms = getAlternativeSearchTerms(searchQuery);
      let results: OnlineSearchResult[] = [];
      
      // Search with primary query first
      results = await searchFoodOnline(searchQuery);
      
      // If no results, try alternative terms
      if (results.length === 0 && searchTerms.length > 1) {
        for (const term of searchTerms) {
          if (term !== searchQuery) {
            const altResults = await searchFoodOnline(term);
            results.push(...altResults);
          }
        }
      }
      
      setOnlineResults(results);
    } catch (error) {
      console.error('Online search error:', error);
      Alert.alert('Search Error', 'Failed to search online. Please try again.');
    } finally {
      setIsSearchingOnline(false);
    }
  };

  // Add online result to custom foods and log it
  const handleAddOnlineResult = async (result: OnlineSearchResult) => {
    Alert.alert(
      'Add to Custom Foods?',
      `Add "${result.name}" (${result.calories} cal per ${result.servingSize}g) to your custom foods?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add & Log',
          onPress: async () => {
            const foodItem = convertToFoodItem(result);
            await createCustomFood(foodItem);
            handleSelectFood(foodItem);
            setShowOnlineResults(false);
          },
        },
      ]
    );
  };

  const showRecentSection = showRecent && !searchQuery && !selectedCategory && recentFoods.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#FF7B00" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Food</Text>
        <View style={styles.placeholder} />
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          setShowRecent(false);
        }}
        placeholder="Search food items..."
        autoFocus={true}
        onMicPress={() => setShowVoiceModal(true)}
      />

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setShowRecent(false);
        }}
      />

      {/* Online Results Section */}
      {showOnlineResults ? (
        <View style={styles.onlineSection}>
          {isSearchingOnline ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="large" color="#FF7B00" />
              <Text style={styles.loadingText}>Searching online...</Text>
            </View>
          ) : onlineResults.length > 0 ? (
            <FlatList
              data={onlineResults}
              keyExtractor={(item, index) => `online-${index}-${item.name}`}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.onlineResultItem}
                  onPress={() => handleAddOnlineResult(item)}
                >
                  {item.imageUrl && (
                    <Image 
                      source={{ uri: item.imageUrl }} 
                      style={styles.onlineResultImage}
                    />
                  )}
                  <View style={styles.onlineResultInfo}>
                    <Text style={styles.onlineResultName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    {item.brand && (
                      <Text style={styles.onlineResultBrand}>{item.brand}</Text>
                    )}
                    <Text style={styles.onlineResultSource}>
                      Source: {item.source === 'openfoodfacts' ? 'Open Food Facts' : 'CalorieNinjas'}
                    </Text>
                  </View>
                  <View style={styles.onlineResultCalories}>
                    <Text style={styles.onlineResultCalorieValue}>{item.calories}</Text>
                    <Text style={styles.onlineResultCalorieUnit}>cal/100g</Text>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.list}
              ListHeaderComponent={
                <TouchableOpacity
                  style={styles.backToLocalButton}
                  onPress={() => setShowOnlineResults(false)}
                >
                  <Ionicons name="arrow-back" size={16} color="#FF7B00" style={{ marginRight: 4 }} />
                  <Text style={styles.backToLocalText}>Back to local foods</Text>
                </TouchableOpacity>
              }
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="sad-outline" size={48} color="#CCCCCC" />
              <Text style={styles.emptyText}>No online results found</Text>
              <Text style={styles.emptySubtext}>Try a different search term or add manually</Text>
              <TouchableOpacity
                style={styles.backToLocalButton}
                onPress={() => setShowOnlineResults(false)}
              >
                <Ionicons name="arrow-back" size={16} color="#FF7B00" style={{ marginRight: 4 }} />
                <Text style={styles.backToLocalText}>Back to local foods</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={displayedFoods}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <FoodCard 
              food={item} 
              onPress={() => {}} // Not used when onSelect is provided
              isSelected={isFoodSelected(item.id)}
              selectedQuantity={getSelectedQuantity(item.id)}
              onSelect={handleSelectFood}
            />
          )}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            displayedFoods.length < filteredFoods.length ? (
              <View style={styles.loadingMore}>
                <ActivityIndicator size="small" color="#FF7B00" />
                <Text style={styles.loadingMoreText}>Loading more...</Text>
              </View>
            ) : null
          }
          ListHeaderComponent={
            <>
              {/* Multi-select Cart */}
              {selectedFoods.length > 0 && (
                <FoodSelectionCart
                  selectedFoods={selectedFoods}
                  onUpdateQuantity={handleUpdateSelectedQuantity}
                  onRemoveFood={handleRemoveFromSelection}
                  onAddAll={handleAddAllSelected}
                  onClearAll={handleClearSelection}
                />
              )}

              {showRecentSection && (
                <View style={styles.recentSection}>
                  <Text style={styles.sectionTitle}>⏰ Recent Foods</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.recentList}
                  >
                    {recentFoodPairs.map((pair, index) => (
                      <View key={`recent-pair-${index}`} style={styles.recentCompactColumn}>
                        {pair.map((item) => (
                          <View key={`recent-${item.id}`} style={styles.recentCompactItem}>
                            <TouchableOpacity
                              style={styles.recentCompactRow}
                              onPress={() => handleSelectFood(item)}
                            >
                              <View style={styles.recentCompactInfo}>
                                <Text style={styles.recentCompactName} numberOfLines={1}>
                                  {item.name}
                                </Text>
                                <Text style={styles.recentCompactCalories}>
                                  {item.caloriesPerUnit} cal
                                </Text>
                              </View>
                              {supportsQuickAdd(item) && (
                                <View style={styles.recentCompactButtons}>
                                  <Text style={styles.recentCompactUom}>
                                    {getUnitLabel(item.unit, 2)}
                                  </Text>
                                  {[1, 1.5, 2, 2.5].map((qty) => (
                                    <RecentQuickButton
                                      key={qty}
                                      qty={qty}
                                      onPress={() => handleSelectFood(item, qty)}
                                    />
                                  ))}
                                </View>
                              )}
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              <View style={styles.listHeader}>
                <View style={styles.sectionTitleRow}>
                  <Text style={styles.sectionTitle}>
                    {selectedCategory
                      ? categories.find(c => c.id === selectedCategory)?.name || 'Foods'
                      : searchQuery
                      ? 'Search Results'
                      : 'All Foods'}
                  </Text>
                </View>
                <Text style={styles.resultCount}>
                  {displayedFoods.length < filteredFoods.length
                    ? `Showing ${displayedFoods.length} of ${filteredFoods.length} items`
                    : `${filteredFoods.length} items`}
                </Text>
              </View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search" size={48} color="#CCCCCC" />
              <Text style={styles.emptyText}>No foods found locally</Text>
              <Text style={styles.emptySubtext}>
                "{searchQuery}" not in database
              </Text>
              
              <TouchableOpacity
                style={styles.searchOnlineButton}
                onPress={handleSearchOnline}
                disabled={isSearchingOnline}
              >
                {isSearchingOnline ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="globe-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.searchOnlineText}>Search Online</Text>
                  </>
                )}
              </TouchableOpacity>
              
              <Text style={styles.onlineNote}>
                Free search using Open Food Facts database
              </Text>
            </View>
          }
        />
      )}

      <VoiceInputModal
        visible={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        foodIndex={foodIndex}
        onAddFoods={handleVoiceAddFoods}
      />
    </SafeAreaView>
  );
};
