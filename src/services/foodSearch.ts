import { Platform } from 'react-native';
import { FoodItem } from '../types';
import { toTitleCase } from '../utils/normalize';
import {
  OPEN_FOOD_FACTS_API_URL,
  CALORIE_NINJAS_API_URL,
  USDA_FOOD_DATA_API_URL,
  USER_AGENT,
  OPEN_FOOD_FACTS_PAGE_SIZE,
  MAX_ONLINE_SEARCH_RESULTS,
} from '../common/constants';

// API keys loaded from .env (EXPO_PUBLIC_ prefix exposes them to client code)
const CALORIE_NINJAS_API_KEY = process.env.EXPO_PUBLIC_CALORIE_NINJAS_API_KEY ?? '';
const USDA_API_KEY = process.env.EXPO_PUBLIC_USDA_API_KEY ?? 'DEMO_KEY';

export interface OnlineSearchResult {
  name: string;
  calories: number;
  protein?: number;
  fat?: number;
  fiber?: number;
  carbs?: number;
  servingSize: number;
  servingUnit: string;
  source: 'openfoodfacts' | 'calorieninjas' | 'usda' | 'manual';
  imageUrl?: string;
  brand?: string;
}

// Search using Open Food Facts (free, no API key)
// Includes retry logic for 429 rate-limit responses
export const searchOpenFoodFacts = async (query: string): Promise<OnlineSearchResult[]> => {
  const attempt = async (retryCount: number): Promise<OnlineSearchResult[]> => {
    try {
      const response = await fetch(
        `${OPEN_FOOD_FACTS_API_URL}?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=${OPEN_FOOD_FACTS_PAGE_SIZE}`,
        {
          headers: {
            'User-Agent': USER_AGENT,
          },
        }
      );

      // Retry once on 429 Too Many Requests
      if (response.status === 429 && retryCount < 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return attempt(retryCount + 1);
      }

      if (!response.ok) {
        throw new Error(`Open Food Facts returned ${response.status}`);
      }

      const data = await response.json();
      const results: OnlineSearchResult[] = [];

      if (data.products && Array.isArray(data.products)) {
        for (const product of data.products) {
          const n = product.nutriments ?? {};
          const calories = n['energy-kcal_100g'] || n['energy-kcal'] ||
            (n['energy_100g'] ? n['energy_100g'] / 4.184 : null);

          if (calories && product.product_name) {
            results.push({
              name: product.product_name,
              calories: Math.round(calories),
              protein: n['proteins_100g'] ? Math.round(n['proteins_100g']) : undefined,
              fat: n['fat_100g'] ? Math.round(n['fat_100g']) : undefined,
              fiber: n['fiber_100g'] ? Math.round(n['fiber_100g']) : undefined,
              carbs: n['carbohydrates_100g'] ? Math.round(n['carbohydrates_100g']) : undefined,
              servingSize: 100,
              servingUnit: 'grams',
              source: 'openfoodfacts',
              imageUrl: product.image_small_url || product.image_url,
              brand: product.brands,
            });
          }
        }
      }

      return results.slice(0, MAX_ONLINE_SEARCH_RESULTS);
    } catch (error) {
      console.error('Open Food Facts search error:', error);
      return [];
    }
  };

  return attempt(0);
};

// Search using CalorieNinjas API (free tier - 10,000 requests/month)
// Get your free API key at: https://calorieninjas.com/api
export const searchCalorieNinjas = async (query: string): Promise<OnlineSearchResult[]> => {
  if (!CALORIE_NINJAS_API_KEY) {
    console.log('CalorieNinjas API key not configured');
    return [];
  }

  try {
    const response = await fetch(
      `${CALORIE_NINJAS_API_URL}?query=${encodeURIComponent(query)}`,
      {
        headers: {
          'X-Api-Key': CALORIE_NINJAS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from CalorieNinjas');
    }

    const data = await response.json();
    const results: OnlineSearchResult[] = [];

    if (data.items && Array.isArray(data.items)) {
      for (const item of data.items) {
        if (item.calories && item.name) {
          results.push({
            name: item.name,
            calories: Math.round(item.calories),
            servingSize: item.serving_size_g || 100,
            servingUnit: 'grams',
            source: 'calorieninjas',
          });
        }
      }
    }

    return results;
  } catch (error) {
    console.error('CalorieNinjas search error:', error);
    return [];
  }
};


// Search using USDA FoodData Central (free, detailed macro profiles)
// Get a free API key at: https://fdc.nal.usda.gov/api-key-signup
export const searchUSDA = async (query: string): Promise<OnlineSearchResult[]> => {
  try {
    // Try Foundation + SR Legacy first; fall back to Branded if no results
    const fetchUSDA = async (dataType: string) => {
      const response = await fetch(
        `${USDA_FOOD_DATA_API_URL}/foods/search?api_key=${encodeURIComponent(USDA_API_KEY)}&query=${encodeURIComponent(query)}&dataType=${encodeURIComponent(dataType)}&pageSize=25&sortBy=dataType.keyword&sortOrder=asc`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (!response.ok) throw new Error('Failed to fetch from USDA FoodData Central');
      return response.json();
    };

    let data = await fetchUSDA('Foundation,SR Legacy');

    // If no results from standard datasets, try Branded
    if (!data.foods?.length && data.totalHits === 0) {
      data = await fetchUSDA('Branded');
    }
    const results: OnlineSearchResult[] = [];

    if (data.foods && Array.isArray(data.foods)) {
      for (const food of data.foods) {
        const nutrients = food.foodNutrients || [];
        const findNutrient = (id: number) =>
          nutrients.find((n: { nutrientId: number; value?: number }) => n.nutrientId === id)?.value ?? 0;

        // USDA nutrient IDs: 1008=Energy(kcal), 1003=Protein, 1004=Fat, 1079=Fiber, 1005=Carbs
        const calories = findNutrient(1008);
        if (!calories || !food.description) continue;

        results.push({
          name: toTitleCase(food.description),
          calories: Math.round(calories),
          protein: Math.round(findNutrient(1003)),
          fat: Math.round(findNutrient(1004)),
          fiber: Math.round(findNutrient(1079)),
          carbs: Math.round(findNutrient(1005)),
          servingSize: 100,
          servingUnit: 'grams',
          source: 'usda',
          brand: food.brandOwner ? toTitleCase(food.brandOwner) : undefined,
        });
      }
    }

    // Sort: highest calorie items first (most relevant for a calorie tracker)
    results.sort((a, b) => b.calories - a.calories);

    return results.slice(0, MAX_ONLINE_SEARCH_RESULTS);
  } catch (error) {
    console.error('USDA FoodData Central search error:', error);
    return [];
  }
};

// Combined search - tries multiple sources in parallel for speed
// USDA results are shown first (detailed macros), then others
export const searchFoodOnline = async (query: string): Promise<OnlineSearchResult[]> => {
  // Run all API calls in parallel for faster results
  const searches: Promise<OnlineSearchResult[]>[] = [
    searchUSDA(query),
    searchOpenFoodFacts(query),
  ];

  // Add CalorieNinjas only on native (no CORS support on web)
  if (CALORIE_NINJAS_API_KEY && Platform.OS !== 'web') {
    searches.push(searchCalorieNinjas(query));
  }

  const allResults = await Promise.all(searches);
  const results = allResults.flat();

  // Remove duplicates based on name similarity
  const uniqueResults = results.filter((item, index, self) =>
    index === self.findIndex((t) => 
      t.name.toLowerCase() === item.name.toLowerCase()
    )
  );

  return uniqueResults;
};

// Check if CalorieNinjas API is configured
export const isCalorieNinjasConfigured = (): boolean => {
  return !!CALORIE_NINJAS_API_KEY;
};

// Convert online search result to FoodItem for adding to custom foods
export const convertToFoodItem = (result: OnlineSearchResult): FoodItem => {
  return {
    id: `custom-online-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: result.name,
    nameMarathi: undefined,
    category: 'custom',
    caloriesPerUnit: result.calories,
    proteinPerUnit: result.protein,
    fatPerUnit: result.fat,
    fiberPerUnit: result.fiber,
    unit: 'grams',
    unitWeight: result.servingSize,
    isCustom: true,
  };
};

// Indian food specific search terms mapping
// This helps when searching for Maharashtrian foods with different spellings
export const getAlternativeSearchTerms = (query: string): string[] => {
  const mappings: { [key: string]: string[] } = {
    'bhakri': ['bhakri', 'bhakari', 'indian flatbread', 'jowar roti', 'bajra roti'],
    'chapati': ['chapati', 'roti', 'indian flatbread', 'wheat roti'],
    'pohe': ['poha', 'pohe', 'flattened rice', 'beaten rice'],
    'vada pav': ['vada pav', 'batata vada', 'potato fritter'],
    'misal': ['misal', 'misal pav', 'sprouted lentils curry'],
    'thalipeeth': ['thalipeeth', 'multigrain pancake'],
    'puran poli': ['puran poli', 'stuffed sweet bread', 'dal poli'],
    'shrikhand': ['shrikhand', 'sweet yogurt', 'hung curd dessert'],
    'modak': ['modak', 'sweet dumpling', 'coconut dumpling'],
    'sabudana': ['sabudana', 'sago', 'tapioca'],
    'usal': ['usal', 'sprouted beans curry', 'misal'],
    'amti': ['amti', 'dal curry', 'maharashtrian dal'],
    'bharli vangi': ['bharli vangi', 'stuffed eggplant', 'stuffed brinjal'],
    'zunka': ['zunka', 'gram flour curry', 'besan curry'],
    'pitla': ['pitla', 'gram flour gravy'],
    'kadhi': ['kadhi', 'yogurt curry', 'buttermilk curry'],
    'sol kadhi': ['sol kadhi', 'kokum curry', 'coconut kokum drink'],
    'bhaji': ['bhaji', 'sabzi', 'vegetable curry', 'indian vegetable'],
    'dal': ['dal', 'daal', 'lentils', 'pulses'],
    // Additional Indian foods
    'paratha': ['paratha', 'stuffed flatbread', 'indian bread'],
    'idli': ['idli', 'rice cake', 'steamed rice cake'],
    'dosa': ['dosa', 'indian crepe', 'rice crepe'],
    'upma': ['upma', 'semolina porridge', 'rava upma'],
    'puri': ['puri', 'poori', 'fried bread'],
    'khichdi': ['khichdi', 'kitchari', 'rice lentils'],
    'sambar': ['sambar', 'sambhar', 'lentil soup'],
    'rasam': ['rasam', 'indian soup'],
    'biryani': ['biryani', 'biriyani', 'indian rice'],
    'paneer': ['paneer', 'indian cheese', 'cottage cheese'],
    'raita': ['raita', 'yogurt salad'],
    'lassi': ['lassi', 'yogurt drink'],
    'gulab jamun': ['gulab jamun', 'indian sweet'],
    'jalebi': ['jalebi', 'indian sweet'],
    'halwa': ['halwa', 'halva', 'indian dessert'],
    'ladoo': ['ladoo', 'laddu', 'indian sweet ball'],
    'kheer': ['kheer', 'rice pudding', 'indian pudding'],
    'chutney': ['chutney', 'indian condiment'],
    'pickle': ['indian pickle', 'achar'],
    'papad': ['papad', 'papadum', 'indian cracker'],
  };

  const lowerQuery = query.toLowerCase();
  
  for (const [key, alternatives] of Object.entries(mappings)) {
    if (lowerQuery.includes(key)) {
      return alternatives;
    }
  }

  return [query];
};
