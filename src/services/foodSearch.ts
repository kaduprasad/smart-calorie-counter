import { FoodItem } from '../types';

// Open Food Facts API - completely free, no API key needed
const OPEN_FOOD_FACTS_API = 'https://world.openfoodfacts.org/cgi/search.pl';

// CalorieNinjas API - free tier (10,000 requests/month)
// Get your free API key at: https://calorieninjas.com/api
const CALORIE_NINJAS_API = 'https://api.calorieninjas.com/v1/nutrition';

// ⚠️ ADD YOUR FREE API KEY HERE (get it from https://calorieninjas.com/api)
// CalorieNinjas is BEST for Indian foods - it understands "chapati", "dal", "biryani" etc.
const CALORIE_NINJAS_API_KEY = ''; // e.g., 'abc123xyz...'

export interface OnlineSearchResult {
  name: string;
  calories: number;
  servingSize: number;
  servingUnit: string;
  source: 'openfoodfacts' | 'calorieninjas' | 'manual';
  imageUrl?: string;
  brand?: string;
}

// Search using Open Food Facts (free, no API key)
export const searchOpenFoodFacts = async (query: string): Promise<OnlineSearchResult[]> => {
  try {
    const response = await fetch(
      `${OPEN_FOOD_FACTS_API}?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20`,
      {
        headers: {
          'User-Agent': 'CalorieCounter-MaharashtrianFood/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Open Food Facts');
    }

    const data = await response.json();
    const results: OnlineSearchResult[] = [];

    if (data.products && Array.isArray(data.products)) {
      for (const product of data.products) {
        // Only include products with calorie information
        const calories = product.nutriments?.['energy-kcal_100g'] || 
                        product.nutriments?.['energy-kcal'] ||
                        (product.nutriments?.['energy_100g'] ? product.nutriments['energy_100g'] / 4.184 : null);
        
        if (calories && product.product_name) {
          results.push({
            name: product.product_name,
            calories: Math.round(calories),
            servingSize: 100,
            servingUnit: 'grams',
            source: 'openfoodfacts',
            imageUrl: product.image_small_url || product.image_url,
            brand: product.brands,
          });
        }
      }
    }

    return results.slice(0, 10); // Return top 10 results
  } catch (error) {
    console.error('Open Food Facts search error:', error);
    return [];
  }
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
      `${CALORIE_NINJAS_API}?query=${encodeURIComponent(query)}`,
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

// Combined search - tries multiple sources
// CalorieNinjas is prioritized for Indian foods as it has better recognition
export const searchFoodOnline = async (query: string): Promise<OnlineSearchResult[]> => {
  const results: OnlineSearchResult[] = [];

  // Try CalorieNinjas FIRST if API key is configured (better for Indian foods)
  if (CALORIE_NINJAS_API_KEY) {
    const cnResults = await searchCalorieNinjas(query);
    results.push(...cnResults);
  }

  // Try Open Food Facts (always free, good for packaged foods)
  const offResults = await searchOpenFoodFacts(query);
  results.push(...offResults);

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
