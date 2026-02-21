import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
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
import { FoodCard, SearchBar, CategoryFilter, QuantitySelector, supportsQuickAdd } from '../components';
import { categories, getUnitLabel } from '../data/foods';
import { FoodItem, FoodCategory } from '../types';
import { 
  searchFoodOnline, 
  OnlineSearchResult, 
  convertToFoodItem,
  getAlternativeSearchTerms 
} from '../services/foodSearch';
import { styles } from './styles/addFoodScreenStyles';

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
  const { allFoods, recentFoods, addFood, createCustomFood } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | null>(null);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [showRecent, setShowRecent] = useState(true);
  
  // Online search state
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [onlineResults, setOnlineResults] = useState<OnlineSearchResult[]>([]);
  const [showOnlineResults, setShowOnlineResults] = useState(false);

  const filteredFoods = useMemo(() => {
    let foods = allFoods;

    // Filter by category
    if (selectedCategory) {
      foods = foods.filter(f => f.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      foods = foods.filter(
        f =>
          f.name.toLowerCase().includes(query) ||
          f.nameMarathi?.toLowerCase().includes(query) ||
          f.searchKeywords?.some(keyword => keyword.toLowerCase().includes(query))
      );
    }

    return foods;
  }, [allFoods, selectedCategory, searchQuery]);

  const handleFoodSelect = (food: FoodItem) => {
    setSelectedFood(food);
  };

  const handleAddFood = async (quantity: number) => {
    if (selectedFood) {
      await addFood(selectedFood, quantity);
      setSelectedFood(null);
      navigation.goBack();
    }
  };

  // Quick add handler - directly adds food without modal
  const handleQuickAdd = async (food: FoodItem, quantity: number) => {
    await addFood(food, quantity);
    navigation.goBack();
  };

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
            setSelectedFood(foodItem);
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
      />

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setShowRecent(false);
        }}
      />

      {showRecentSection && (
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>⏰ Recent Foods</Text>
          <FlatList
            horizontal
            data={recentFoods}
            keyExtractor={(item) => `recent-${item.id}`}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.recentItem}>
                <TouchableOpacity onPress={() => handleFoodSelect(item)}>
                  <Text style={styles.recentName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.recentCalories}>
                    {item.caloriesPerUnit} cal
                  </Text>
                </TouchableOpacity>
                {supportsQuickAdd(item) && (
                  <View style={styles.recentQuickAdd}>
                    <Text style={styles.recentQuickAddLabel}>
                      ({getUnitLabel(item.unit, 2)}):
                    </Text>
                    <View style={styles.recentQuickAddButtons}>
                      {[1, 1.5, 2, 2.5, 3].map((qty) => (
                        <RecentQuickButton
                          key={qty}
                          qty={qty}
                          onPress={() => handleQuickAdd(item, qty)}
                        />
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}
            contentContainerStyle={styles.recentList}
          />
        </View>
      )}

      <View style={styles.listHeader}>
        <View style={styles.sectionTitleRow}>
          {showOnlineResults && (
            <Ionicons name="globe-outline" size={18} color="#FF7B00" style={{ marginRight: 6 }} />
          )}
          <Text style={styles.sectionTitle}>
            {showOnlineResults 
              ? 'Online Results'
              : selectedCategory
              ? categories.find(c => c.id === selectedCategory)?.name || 'Foods'
              : searchQuery
              ? 'Search Results'
              : 'All Foods'}
          </Text>
        </View>
        <Text style={styles.resultCount}>
          {showOnlineResults ? onlineResults.length : filteredFoods.length} items
        </Text>
      </View>

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
          data={filteredFoods}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <FoodCard 
              food={item} 
              onPress={() => handleFoodSelect(item)}
              onQuickAdd={handleQuickAdd}
            />
          )}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
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

      <QuantitySelector
        visible={selectedFood !== null}
        food={selectedFood || { id: '', name: '', category: 'breads', caloriesPerUnit: 0, unit: 'piece' }}
        onClose={() => setSelectedFood(null)}
        onConfirm={handleAddFood}
      />
    </SafeAreaView>
  );
};
