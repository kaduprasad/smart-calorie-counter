// Core cooking ingredients with nutritional info per 100g
// Comprehensive database covering Indian and global ingredients

export interface Ingredient {
  id: string;
  name: string;
  nameLocal?: string; // Hindi/Marathi name
  category: IngredientCategory;
  caloriesPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
  fiberPer100g: number;
  commonMeasure?: string; // e.g., "1 tbsp = 15g", "1 cup = 150g"
  measureGrams?: number; // grams per common measure
}

export type IngredientCategory =
  | 'grains_flour'
  | 'lentils_legumes'
  | 'oils_fats'
  | 'dairy'
  | 'spices'
  | 'vegetables'
  | 'fruits'
  | 'nuts_seeds'
  | 'sweeteners'
  | 'meat_fish'
  | 'condiments'
  | 'misc';

// IDs of dairy items that are solid (not liquid)
const SOLID_DAIRY_IDS = new Set(['paneer', 'cheese', 'khoya']);

/** Returns true for oils and liquid dairy (milk, curd, cream, buttermilk, etc.) */
export const isLiquidIngredient = (ingredient: Ingredient): boolean => {
  if (ingredient.category === 'oils_fats') return true;
  if (ingredient.category === 'dairy' && !SOLID_DAIRY_IDS.has(ingredient.id)) return true;
  return false;
};

/** Returns 'ml' for liquids, 'g' for solids */
export const getIngredientWeightUnit = (ingredient: Ingredient): string => {
  return isLiquidIngredient(ingredient) ? 'ml' : 'g';
};

export const INGREDIENT_CATEGORIES: { key: IngredientCategory; label: string; icon: string }[] = [
  { key: 'grains_flour', label: 'Grains', icon: 'grain' },
  { key: 'lentils_legumes', label: 'Lentils', icon: 'food-variant' },
  { key: 'oils_fats', label: 'Oils', icon: 'oil' },
  { key: 'dairy', label: 'Dairy', icon: 'cup' },
  { key: 'vegetables', label: 'Veggies', icon: 'carrot' },
  { key: 'fruits', label: 'Fruits', icon: 'fruit-cherries' },
  { key: 'nuts_seeds', label: 'Nuts', icon: 'peanut' },
  { key: 'meat_fish', label: 'Meat', icon: 'food-drumstick' },
  { key: 'spices', label: 'Spices', icon: 'shaker' },
  { key: 'sweeteners', label: 'Sweet', icon: 'candy' },
  { key: 'condiments', label: 'Sauces', icon: 'bottle-soda-classic' },
  { key: 'misc', label: 'Other', icon: 'dots-horizontal' },
];

export const INGREDIENTS: Ingredient[] = [
  // ── Grains & Flour ──
  { id: 'wheat-flour', name: 'Wheat Flour (Atta)', nameLocal: 'गव्हाचे पीठ', category: 'grains_flour', caloriesPer100g: 340, proteinPer100g: 12, fatPer100g: 1.7, fiberPer100g: 11, commonMeasure: '1 cup', measureGrams: 120 },
  { id: 'rice-raw', name: 'Rice (Raw)', nameLocal: 'तांदूळ', category: 'grains_flour', caloriesPer100g: 360, proteinPer100g: 6.8, fatPer100g: 0.5, fiberPer100g: 0.4, commonMeasure: '1 cup', measureGrams: 185 },
  { id: 'rice-cooked', name: 'Rice (Cooked)', nameLocal: 'भात', category: 'grains_flour', caloriesPer100g: 130, proteinPer100g: 2.7, fatPer100g: 0.3, fiberPer100g: 0.4, commonMeasure: '1 cup', measureGrams: 158 },
  { id: 'besan', name: 'Besan (Gram Flour)', nameLocal: 'बेसन', category: 'grains_flour', caloriesPer100g: 387, proteinPer100g: 22, fatPer100g: 6.7, fiberPer100g: 10, commonMeasure: '1 cup', measureGrams: 92 },
  { id: 'rice-flour', name: 'Rice Flour', nameLocal: 'तांदळाचे पीठ', category: 'grains_flour', caloriesPer100g: 366, proteinPer100g: 6, fatPer100g: 1.4, fiberPer100g: 2.4, commonMeasure: '1 cup', measureGrams: 158 },
  { id: 'maida', name: 'Maida (Refined Flour)', nameLocal: 'मैदा', category: 'grains_flour', caloriesPer100g: 364, proteinPer100g: 10, fatPer100g: 1, fiberPer100g: 2.7, commonMeasure: '1 cup', measureGrams: 120 },
  { id: 'semolina', name: 'Semolina (Rava/Sooji)', nameLocal: 'रवा', category: 'grains_flour', caloriesPer100g: 360, proteinPer100g: 12.7, fatPer100g: 1.1, fiberPer100g: 3.9, commonMeasure: '1 cup', measureGrams: 167 },
  { id: 'poha', name: 'Poha (Flattened Rice)', nameLocal: 'पोहे', category: 'grains_flour', caloriesPer100g: 346, proteinPer100g: 6.6, fatPer100g: 1.2, fiberPer100g: 1.8, commonMeasure: '1 cup', measureGrams: 80 },
  { id: 'oats', name: 'Oats', nameLocal: 'ओट्स', category: 'grains_flour', caloriesPer100g: 389, proteinPer100g: 16.9, fatPer100g: 6.9, fiberPer100g: 10.6, commonMeasure: '1 cup', measureGrams: 80 },
  { id: 'jowar-flour', name: 'Jowar Flour (Sorghum)', nameLocal: 'ज्वारीचे पीठ', category: 'grains_flour', caloriesPer100g: 349, proteinPer100g: 10.4, fatPer100g: 1.9, fiberPer100g: 9.7, commonMeasure: '1 cup', measureGrams: 120 },
  { id: 'bajra-flour', name: 'Bajra Flour (Millet)', nameLocal: 'बाजरीचे पीठ', category: 'grains_flour', caloriesPer100g: 361, proteinPer100g: 11.6, fatPer100g: 5, fiberPer100g: 11.3, commonMeasure: '1 cup', measureGrams: 120 },
  { id: 'nachni-flour', name: 'Nachni/Ragi Flour', nameLocal: 'नाचणीचे पीठ', category: 'grains_flour', caloriesPer100g: 328, proteinPer100g: 7.3, fatPer100g: 1.3, fiberPer100g: 11.5, commonMeasure: '1 cup', measureGrams: 120 },
  { id: 'bread', name: 'Bread (White)', category: 'grains_flour', caloriesPer100g: 265, proteinPer100g: 9, fatPer100g: 3.2, fiberPer100g: 2.7, commonMeasure: '1 slice', measureGrams: 30 },
  { id: 'bread-brown', name: 'Bread (Brown/Whole Wheat)', category: 'grains_flour', caloriesPer100g: 247, proteinPer100g: 13, fatPer100g: 3.4, fiberPer100g: 7, commonMeasure: '1 slice', measureGrams: 30 },
  { id: 'pasta-raw', name: 'Pasta (Raw)', category: 'grains_flour', caloriesPer100g: 371, proteinPer100g: 13, fatPer100g: 1.5, fiberPer100g: 3.2, commonMeasure: '1 cup', measureGrams: 100 },
  { id: 'noodles-raw', name: 'Noodles (Raw)', category: 'grains_flour', caloriesPer100g: 358, proteinPer100g: 11, fatPer100g: 1, fiberPer100g: 1.6, commonMeasure: '1 packet', measureGrams: 75 },
  { id: 'cornflour', name: 'Corn Flour (Makka Atta)', nameLocal: 'मक्याचे पीठ', category: 'grains_flour', caloriesPer100g: 361, proteinPer100g: 6.9, fatPer100g: 3.9, fiberPer100g: 7.3, commonMeasure: '1 cup', measureGrams: 117 },
  { id: 'cornstarch', name: 'Cornstarch', category: 'grains_flour', caloriesPer100g: 381, proteinPer100g: 0.3, fatPer100g: 0.1, fiberPer100g: 0.9, commonMeasure: '1 tbsp', measureGrams: 8 },

  // ── Lentils & Legumes ──
  { id: 'toor-dal', name: 'Toor Dal (Pigeon Pea)', nameLocal: 'तूर डाळ', category: 'lentils_legumes', caloriesPer100g: 343, proteinPer100g: 22, fatPer100g: 1.5, fiberPer100g: 15, commonMeasure: '1 cup', measureGrams: 200 },
  { id: 'moong-dal', name: 'Moong Dal (Split)', nameLocal: 'मूग डाळ', category: 'lentils_legumes', caloriesPer100g: 347, proteinPer100g: 24, fatPer100g: 1.2, fiberPer100g: 16, commonMeasure: '1 cup', measureGrams: 200 },
  { id: 'moong-whole', name: 'Moong (Whole Green)', nameLocal: 'मूग', category: 'lentils_legumes', caloriesPer100g: 347, proteinPer100g: 24, fatPer100g: 1.2, fiberPer100g: 16, commonMeasure: '1 cup', measureGrams: 200 },
  { id: 'masoor-dal', name: 'Masoor Dal (Red Lentil)', nameLocal: 'मसूर डाळ', category: 'lentils_legumes', caloriesPer100g: 352, proteinPer100g: 25, fatPer100g: 1.1, fiberPer100g: 11, commonMeasure: '1 cup', measureGrams: 200 },
  { id: 'chana-dal', name: 'Chana Dal (Split Chickpea)', nameLocal: 'चणा डाळ', category: 'lentils_legumes', caloriesPer100g: 364, proteinPer100g: 20, fatPer100g: 5.3, fiberPer100g: 18, commonMeasure: '1 cup', measureGrams: 200 },
  { id: 'urad-dal', name: 'Urad Dal (Black Gram)', nameLocal: 'उडद डाळ', category: 'lentils_legumes', caloriesPer100g: 341, proteinPer100g: 25, fatPer100g: 1.4, fiberPer100g: 18, commonMeasure: '1 cup', measureGrams: 200 },
  { id: 'kabuli-chana', name: 'Kabuli Chana (Chickpea)', nameLocal: 'काबुली चणे', category: 'lentils_legumes', caloriesPer100g: 364, proteinPer100g: 19, fatPer100g: 6, fiberPer100g: 17, commonMeasure: '1 cup', measureGrams: 164 },
  { id: 'rajma', name: 'Rajma (Kidney Beans)', nameLocal: 'राजमा', category: 'lentils_legumes', caloriesPer100g: 333, proteinPer100g: 24, fatPer100g: 0.8, fiberPer100g: 25, commonMeasure: '1 cup', measureGrams: 180 },
  { id: 'matki', name: 'Matki (Moth Beans)', nameLocal: 'मटकी', category: 'lentils_legumes', caloriesPer100g: 343, proteinPer100g: 23, fatPer100g: 1.6, fiberPer100g: 14, commonMeasure: '1 cup', measureGrams: 180 },
  { id: 'val', name: 'Val (Field Beans)', nameLocal: 'वाल', category: 'lentils_legumes', caloriesPer100g: 340, proteinPer100g: 25, fatPer100g: 0.8, fiberPer100g: 24, commonMeasure: '1 cup', measureGrams: 180 },
  { id: 'green-peas', name: 'Green Peas', nameLocal: 'मटार', category: 'lentils_legumes', caloriesPer100g: 81, proteinPer100g: 5.4, fatPer100g: 0.4, fiberPer100g: 5.7, commonMeasure: '1 cup', measureGrams: 145 },
  { id: 'soybean', name: 'Soybean', nameLocal: 'सोयाबीन', category: 'lentils_legumes', caloriesPer100g: 446, proteinPer100g: 36, fatPer100g: 20, fiberPer100g: 9, commonMeasure: '1 cup', measureGrams: 186 },
  { id: 'peanuts-raw', name: 'Peanuts (Raw)', nameLocal: 'शेंगदाणे', category: 'lentils_legumes', caloriesPer100g: 567, proteinPer100g: 26, fatPer100g: 49, fiberPer100g: 8.5, commonMeasure: '1 cup', measureGrams: 146 },

  // ── Oils & Fats ──
  { id: 'groundnut-oil', name: 'Groundnut Oil', nameLocal: 'शेंगदाणा तेल', category: 'oils_fats', caloriesPer100g: 884, proteinPer100g: 0, fatPer100g: 100, fiberPer100g: 0, commonMeasure: '1 tbsp', measureGrams: 14 },
  { id: 'sunflower-oil', name: 'Sunflower Oil', category: 'oils_fats', caloriesPer100g: 884, proteinPer100g: 0, fatPer100g: 100, fiberPer100g: 0, commonMeasure: '1 tbsp', measureGrams: 14 },
  { id: 'mustard-oil', name: 'Mustard Oil', nameLocal: 'मोहरीचे तेल', category: 'oils_fats', caloriesPer100g: 884, proteinPer100g: 0, fatPer100g: 100, fiberPer100g: 0, commonMeasure: '1 tbsp', measureGrams: 14 },
  { id: 'coconut-oil', name: 'Coconut Oil', nameLocal: 'खोबरेल तेल', category: 'oils_fats', caloriesPer100g: 862, proteinPer100g: 0, fatPer100g: 100, fiberPer100g: 0, commonMeasure: '1 tbsp', measureGrams: 14 },
  { id: 'olive-oil', name: 'Olive Oil', category: 'oils_fats', caloriesPer100g: 884, proteinPer100g: 0, fatPer100g: 100, fiberPer100g: 0, commonMeasure: '1 tbsp', measureGrams: 14 },
  { id: 'ghee', name: 'Ghee (Clarified Butter)', nameLocal: 'तूप', category: 'oils_fats', caloriesPer100g: 900, proteinPer100g: 0, fatPer100g: 100, fiberPer100g: 0, commonMeasure: '1 tsp', measureGrams: 5 },
  { id: 'butter', name: 'Butter', nameLocal: 'लोणी', category: 'oils_fats', caloriesPer100g: 717, proteinPer100g: 0.9, fatPer100g: 81, fiberPer100g: 0, commonMeasure: '1 tbsp', measureGrams: 14 },
  { id: 'vanaspati', name: 'Vanaspati (Dalda)', category: 'oils_fats', caloriesPer100g: 900, proteinPer100g: 0, fatPer100g: 100, fiberPer100g: 0, commonMeasure: '1 tbsp', measureGrams: 14 },
  { id: 'sesame-oil', name: 'Sesame Oil (Til Oil)', nameLocal: 'तिळाचे तेल', category: 'oils_fats', caloriesPer100g: 884, proteinPer100g: 0, fatPer100g: 100, fiberPer100g: 0, commonMeasure: '1 tbsp', measureGrams: 14 },

  // ── Dairy ──
  { id: 'milk-full', name: 'Milk (Full Cream)', nameLocal: 'दूध', category: 'dairy', caloriesPer100g: 62, proteinPer100g: 3.2, fatPer100g: 3.4, fiberPer100g: 0, commonMeasure: '1 cup', measureGrams: 244 },
  { id: 'milk-toned', name: 'Milk (Toned)', nameLocal: 'दूध (टोन्ड)', category: 'dairy', caloriesPer100g: 50, proteinPer100g: 3.3, fatPer100g: 1.5, fiberPer100g: 0, commonMeasure: '1 cup', measureGrams: 244 },
  { id: 'milk-skimmed', name: 'Milk (Skimmed)', category: 'dairy', caloriesPer100g: 34, proteinPer100g: 3.4, fatPer100g: 0.1, fiberPer100g: 0, commonMeasure: '1 cup', measureGrams: 244 },
  { id: 'curd', name: 'Curd (Yogurt)', nameLocal: 'दही', category: 'dairy', caloriesPer100g: 60, proteinPer100g: 3.5, fatPer100g: 3.3, fiberPer100g: 0, commonMeasure: '1 cup', measureGrams: 245 },
  { id: 'paneer', name: 'Paneer (Cottage Cheese)', nameLocal: 'पनीर', category: 'dairy', caloriesPer100g: 265, proteinPer100g: 18, fatPer100g: 21, fiberPer100g: 0, commonMeasure: '100g', measureGrams: 100 },
  { id: 'cream', name: 'Fresh Cream', nameLocal: 'मलई', category: 'dairy', caloriesPer100g: 195, proteinPer100g: 2.1, fatPer100g: 20, fiberPer100g: 0, commonMeasure: '1 tbsp', measureGrams: 15 },
  { id: 'cheese', name: 'Cheese (Processed)', category: 'dairy', caloriesPer100g: 330, proteinPer100g: 20, fatPer100g: 27, fiberPer100g: 0, commonMeasure: '1 slice', measureGrams: 20 },
  { id: 'khoya', name: 'Khoya (Mawa)', nameLocal: 'खवा', category: 'dairy', caloriesPer100g: 321, proteinPer100g: 15, fatPer100g: 25, fiberPer100g: 0, commonMeasure: '100g', measureGrams: 100 },
  { id: 'buttermilk', name: 'Buttermilk (Chaas)', nameLocal: 'ताक', category: 'dairy', caloriesPer100g: 40, proteinPer100g: 3.3, fatPer100g: 0.9, fiberPer100g: 0, commonMeasure: '1 glass', measureGrams: 250 },
  { id: 'condensed-milk', name: 'Condensed Milk', category: 'dairy', caloriesPer100g: 321, proteinPer100g: 8, fatPer100g: 9, fiberPer100g: 0, commonMeasure: '1 tbsp', measureGrams: 20 },

  // ── Vegetables ──
  { id: 'onion', name: 'Onion', nameLocal: 'कांदा', category: 'vegetables', caloriesPer100g: 40, proteinPer100g: 1.1, fatPer100g: 0.1, fiberPer100g: 1.7, commonMeasure: '1 medium', measureGrams: 110 },
  { id: 'tomato', name: 'Tomato', nameLocal: 'टोमॅटो', category: 'vegetables', caloriesPer100g: 18, proteinPer100g: 0.9, fatPer100g: 0.2, fiberPer100g: 1.2, commonMeasure: '1 medium', measureGrams: 123 },
  { id: 'potato', name: 'Potato', nameLocal: 'बटाटा', category: 'vegetables', caloriesPer100g: 77, proteinPer100g: 2, fatPer100g: 0.1, fiberPer100g: 2.2, commonMeasure: '1 medium', measureGrams: 150 },
  { id: 'garlic', name: 'Garlic', nameLocal: 'लसूण', category: 'vegetables', caloriesPer100g: 149, proteinPer100g: 6.4, fatPer100g: 0.5, fiberPer100g: 2.1, commonMeasure: '1 clove', measureGrams: 3 },
  { id: 'ginger', name: 'Ginger', nameLocal: 'आलं', category: 'vegetables', caloriesPer100g: 80, proteinPer100g: 1.8, fatPer100g: 0.8, fiberPer100g: 2, commonMeasure: '1 inch', measureGrams: 5 },
  { id: 'green-chilli', name: 'Green Chilli', nameLocal: 'हिरवी मिरची', category: 'vegetables', caloriesPer100g: 40, proteinPer100g: 1.9, fatPer100g: 0.4, fiberPer100g: 1.5, commonMeasure: '1 piece', measureGrams: 5 },
  { id: 'cauliflower', name: 'Cauliflower', nameLocal: 'फुलकोबी', category: 'vegetables', caloriesPer100g: 25, proteinPer100g: 1.9, fatPer100g: 0.3, fiberPer100g: 2, commonMeasure: '1 cup', measureGrams: 100 },
  { id: 'cabbage', name: 'Cabbage', nameLocal: 'कोबी', category: 'vegetables', caloriesPer100g: 25, proteinPer100g: 1.3, fatPer100g: 0.1, fiberPer100g: 2.5, commonMeasure: '1 cup', measureGrams: 90 },
  { id: 'brinjal', name: 'Brinjal (Eggplant)', nameLocal: 'वांगे', category: 'vegetables', caloriesPer100g: 25, proteinPer100g: 1, fatPer100g: 0.2, fiberPer100g: 3, commonMeasure: '1 medium', measureGrams: 82 },
  { id: 'bhindi', name: 'Bhindi (Okra)', nameLocal: 'भेंडी', category: 'vegetables', caloriesPer100g: 33, proteinPer100g: 1.9, fatPer100g: 0.2, fiberPer100g: 3.2, commonMeasure: '1 cup', measureGrams: 100 },
  { id: 'spinach', name: 'Spinach', nameLocal: 'पालक', category: 'vegetables', caloriesPer100g: 23, proteinPer100g: 2.9, fatPer100g: 0.4, fiberPer100g: 2.2, commonMeasure: '1 cup', measureGrams: 30 },
  { id: 'methi-leaves', name: 'Methi Leaves (Fenugreek)', nameLocal: 'मेथी', category: 'vegetables', caloriesPer100g: 49, proteinPer100g: 4.4, fatPer100g: 0.9, fiberPer100g: 4.2, commonMeasure: '1 cup', measureGrams: 25 },
  { id: 'coriander-leaves', name: 'Coriander Leaves', nameLocal: 'कोथिंबीर', category: 'vegetables', caloriesPer100g: 23, proteinPer100g: 2.1, fatPer100g: 0.5, fiberPer100g: 2.8, commonMeasure: '1 cup', measureGrams: 16 },
  { id: 'capsicum', name: 'Capsicum (Bell Pepper)', nameLocal: 'शिमला मिर्ची', category: 'vegetables', caloriesPer100g: 20, proteinPer100g: 0.9, fatPer100g: 0.2, fiberPer100g: 1.7, commonMeasure: '1 medium', measureGrams: 120 },
  { id: 'carrot', name: 'Carrot', nameLocal: 'गाजर', category: 'vegetables', caloriesPer100g: 41, proteinPer100g: 0.9, fatPer100g: 0.2, fiberPer100g: 2.8, commonMeasure: '1 medium', measureGrams: 61 },
  { id: 'beetroot', name: 'Beetroot', nameLocal: 'बीट', category: 'vegetables', caloriesPer100g: 43, proteinPer100g: 1.6, fatPer100g: 0.2, fiberPer100g: 2.8, commonMeasure: '1 medium', measureGrams: 82 },
  { id: 'bottle-gourd', name: 'Bottle Gourd (Lauki)', nameLocal: 'दुधी भोपळा', category: 'vegetables', caloriesPer100g: 14, proteinPer100g: 0.6, fatPer100g: 0, fiberPer100g: 0.5, commonMeasure: '1 cup', measureGrams: 116 },
  { id: 'bitter-gourd', name: 'Bitter Gourd (Karela)', nameLocal: 'कारले', category: 'vegetables', caloriesPer100g: 17, proteinPer100g: 1, fatPer100g: 0.2, fiberPer100g: 2.8, commonMeasure: '1 medium', measureGrams: 60 },
  { id: 'ridge-gourd', name: 'Ridge Gourd (Dodka)', nameLocal: 'दोडका', category: 'vegetables', caloriesPer100g: 20, proteinPer100g: 1.2, fatPer100g: 0.2, fiberPer100g: 1.8, commonMeasure: '1 medium', measureGrams: 80 },
  { id: 'drumstick', name: 'Drumstick (Moringa)', nameLocal: 'शेवगा', category: 'vegetables', caloriesPer100g: 37, proteinPer100g: 2.1, fatPer100g: 0.2, fiberPer100g: 3.2, commonMeasure: '1 stick', measureGrams: 25 },
  { id: 'mushroom', name: 'Mushroom', nameLocal: 'अळिंबी', category: 'vegetables', caloriesPer100g: 22, proteinPer100g: 3.1, fatPer100g: 0.3, fiberPer100g: 1, commonMeasure: '1 cup', measureGrams: 70 },
  { id: 'sweet-potato', name: 'Sweet Potato', nameLocal: 'रताळे', category: 'vegetables', caloriesPer100g: 86, proteinPer100g: 1.6, fatPer100g: 0.1, fiberPer100g: 3, commonMeasure: '1 medium', measureGrams: 130 },
  { id: 'coconut-fresh', name: 'Coconut (Fresh)', nameLocal: 'खोबरे', category: 'vegetables', caloriesPer100g: 354, proteinPer100g: 3.3, fatPer100g: 33, fiberPer100g: 9, commonMeasure: '1 cup grated', measureGrams: 80 },
  { id: 'coconut-dry', name: 'Coconut (Dry/Copra)', nameLocal: 'सुके खोबरे', category: 'vegetables', caloriesPer100g: 650, proteinPer100g: 7.5, fatPer100g: 65, fiberPer100g: 16, commonMeasure: '1 tbsp', measureGrams: 7 },
  { id: 'curry-leaves', name: 'Curry Leaves', nameLocal: 'कढीपत्ता', category: 'vegetables', caloriesPer100g: 108, proteinPer100g: 6.1, fatPer100g: 1, fiberPer100g: 6.4, commonMeasure: '10 leaves', measureGrams: 2 },
  { id: 'ivy-gourd', name: 'Ivy Gourd (Tondli)', nameLocal: 'तोंडली', category: 'vegetables', caloriesPer100g: 17, proteinPer100g: 1.4, fatPer100g: 0.2, fiberPer100g: 3, commonMeasure: '1 cup', measureGrams: 100 },
  { id: 'pumpkin', name: 'Pumpkin', nameLocal: 'भोपळा', category: 'vegetables', caloriesPer100g: 23, proteinPer100g: 0.8, fatPer100g: 0.2, fiberPer100g: 2.6, commonMeasure: '1 cup chopped', measureGrams: 120 },
  { id: 'okra', name: 'Okra (Ladies Finger)', nameLocal: 'भेंडी', category: 'vegetables', caloriesPer100g: 27, proteinPer100g: 2.1, fatPer100g: 0.2, fiberPer100g: 4.1, commonMeasure: '1 cup chopped', measureGrams: 100 },

  // ── Fruits ──
  { id: 'banana', name: 'Banana', nameLocal: 'केळे', category: 'fruits', caloriesPer100g: 89, proteinPer100g: 1.1, fatPer100g: 0.3, fiberPer100g: 2.6, commonMeasure: '1 medium', measureGrams: 118 },
  { id: 'mango', name: 'Mango', nameLocal: 'आंबा', category: 'fruits', caloriesPer100g: 60, proteinPer100g: 0.8, fatPer100g: 0.4, fiberPer100g: 1.6, commonMeasure: '1 medium', measureGrams: 200 },
  { id: 'lemon-juice', name: 'Lemon Juice', nameLocal: 'लिंबाचा रस', category: 'fruits', caloriesPer100g: 22, proteinPer100g: 0.4, fatPer100g: 0.2, fiberPer100g: 0.3, commonMeasure: '1 tbsp', measureGrams: 15 },
  { id: 'tamarind', name: 'Tamarind', nameLocal: 'चिंच', category: 'fruits', caloriesPer100g: 239, proteinPer100g: 2.8, fatPer100g: 0.6, fiberPer100g: 5.1, commonMeasure: '1 tbsp pulp', measureGrams: 15 },
  { id: 'raw-mango', name: 'Raw Mango', nameLocal: 'कैरी', category: 'fruits', caloriesPer100g: 44, proteinPer100g: 0.7, fatPer100g: 0.3, fiberPer100g: 1.8, commonMeasure: '1 small', measureGrams: 80 },
  { id: 'coconut-milk', name: 'Coconut Milk', nameLocal: 'नारळाचे दूध', category: 'fruits', caloriesPer100g: 230, proteinPer100g: 2.3, fatPer100g: 24, fiberPer100g: 0, commonMeasure: '1 cup', measureGrams: 240 },
  { id: 'dates', name: 'Dates (Kharik)', nameLocal: 'खारीक', category: 'fruits', caloriesPer100g: 282, proteinPer100g: 2.5, fatPer100g: 0.4, fiberPer100g: 8, commonMeasure: '1 piece', measureGrams: 8 },
  { id: 'raisins', name: 'Raisins (Kishmish)', nameLocal: 'मनुके', category: 'fruits', caloriesPer100g: 299, proteinPer100g: 3.1, fatPer100g: 0.5, fiberPer100g: 3.7, commonMeasure: '1 tbsp', measureGrams: 10 },
  { id: 'amla', name: 'Amla (Gooseberry)', nameLocal: 'आवळा', category: 'fruits', caloriesPer100g: 24, proteinPer100g: 0.3, fatPer100g: 0.2, fiberPer100g: 7.8, commonMeasure: '1 piece', measureGrams: 44 },
  { id: 'sapota', name: 'Sapota (Chikoo)', nameLocal: 'चिक्कू', category: 'fruits', caloriesPer100g: 73, proteinPer100g: 0.9, fatPer100g: 1.3, fiberPer100g: 9.6, commonMeasure: '1 medium', measureGrams: 120 },
  { id: 'guava', name: 'Guava', nameLocal: 'पेरू', category: 'fruits', caloriesPer100g: 32, proteinPer100g: 1.4, fatPer100g: 0.3, fiberPer100g: 8.6, commonMeasure: '1 medium', measureGrams: 165 },
  { id: 'pomegranate', name: 'Pomegranate', nameLocal: 'डाळिंब', category: 'fruits', caloriesPer100g: 55, proteinPer100g: 1.3, fatPer100g: 0.2, fiberPer100g: 2.8, commonMeasure: '1 cup arils', measureGrams: 175 },

  // ── Nuts & Seeds ──
  { id: 'cashew', name: 'Cashew', nameLocal: 'काजू', category: 'nuts_seeds', caloriesPer100g: 553, proteinPer100g: 18, fatPer100g: 44, fiberPer100g: 3.3, commonMeasure: '10 pieces', measureGrams: 15 },
  { id: 'almond', name: 'Almond', nameLocal: 'बदाम', category: 'nuts_seeds', caloriesPer100g: 579, proteinPer100g: 21, fatPer100g: 50, fiberPer100g: 12, commonMeasure: '10 pieces', measureGrams: 14 },
  { id: 'walnut', name: 'Walnut', nameLocal: 'अक्रोड', category: 'nuts_seeds', caloriesPer100g: 654, proteinPer100g: 15, fatPer100g: 65, fiberPer100g: 6.7, commonMeasure: '5 halves', measureGrams: 15 },
  { id: 'sesame-seeds', name: 'Sesame Seeds (Til)', nameLocal: 'तीळ', category: 'nuts_seeds', caloriesPer100g: 573, proteinPer100g: 18, fatPer100g: 50, fiberPer100g: 12, commonMeasure: '1 tbsp', measureGrams: 9 },
  { id: 'poppy-seeds', name: 'Poppy Seeds (Khus Khus)', nameLocal: 'खसखस', category: 'nuts_seeds', caloriesPer100g: 525, proteinPer100g: 18, fatPer100g: 42, fiberPer100g: 20, commonMeasure: '1 tbsp', measureGrams: 9 },
  { id: 'mustard-seeds', name: 'Mustard Seeds', nameLocal: 'मोहरी', category: 'nuts_seeds', caloriesPer100g: 508, proteinPer100g: 26, fatPer100g: 36, fiberPer100g: 12, commonMeasure: '1 tsp', measureGrams: 3 },
  { id: 'cumin-seeds', name: 'Cumin Seeds (Jeera)', nameLocal: 'जिरे', category: 'nuts_seeds', caloriesPer100g: 375, proteinPer100g: 18, fatPer100g: 22, fiberPer100g: 10.5, commonMeasure: '1 tsp', measureGrams: 2 },
  { id: 'flaxseed', name: 'Flaxseed (Javas)', nameLocal: 'जवस', category: 'nuts_seeds', caloriesPer100g: 534, proteinPer100g: 18, fatPer100g: 42, fiberPer100g: 27, commonMeasure: '1 tbsp', measureGrams: 10 },
  { id: 'coconut-desiccated', name: 'Desiccated Coconut', nameLocal: 'खोबरं किस', category: 'nuts_seeds', caloriesPer100g: 660, proteinPer100g: 6.9, fatPer100g: 64, fiberPer100g: 16, commonMeasure: '1 tbsp', measureGrams: 7 },
  { id: 'fenugreek-seeds', name: 'Fenugreek Seeds (Methi Dana)', nameLocal: 'मेथी दाणे', category: 'nuts_seeds', caloriesPer100g: 235, proteinPer100g: 25.4, fatPer100g: 5.7, fiberPer100g: 47.6, commonMeasure: '1 tsp', measureGrams: 6 },
  { id: 'groundnut', name: 'Groundnut (Peanut)', nameLocal: 'शेंगदाणे', category: 'nuts_seeds', caloriesPer100g: 567, proteinPer100g: 26, fatPer100g: 49, fiberPer100g: 8.5, commonMeasure: '1 cup', measureGrams: 30 },

  // ── Meat & Fish ──
  { id: 'chicken-breast', name: 'Chicken Breast', nameLocal: 'चिकन ब्रेस्ट', category: 'meat_fish', caloriesPer100g: 165, proteinPer100g: 31, fatPer100g: 3.6, fiberPer100g: 0, commonMeasure: '1 piece', measureGrams: 120 },
  { id: 'chicken-thigh', name: 'Chicken Thigh', category: 'meat_fish', caloriesPer100g: 209, proteinPer100g: 26, fatPer100g: 11, fiberPer100g: 0, commonMeasure: '1 piece', measureGrams: 85 },
  { id: 'chicken-whole', name: 'Chicken (Whole, with skin)', nameLocal: 'चिकन', category: 'meat_fish', caloriesPer100g: 239, proteinPer100g: 27, fatPer100g: 14, fiberPer100g: 0, commonMeasure: '100g', measureGrams: 100 },
  { id: 'mutton', name: 'Mutton (Goat)', nameLocal: 'मटण', category: 'meat_fish', caloriesPer100g: 143, proteinPer100g: 27, fatPer100g: 3.0, fiberPer100g: 0, commonMeasure: '100g', measureGrams: 100 },
  { id: 'keema', name: 'Keema (Minced Meat)', nameLocal: 'कीमा', category: 'meat_fish', caloriesPer100g: 250, proteinPer100g: 17, fatPer100g: 20, fiberPer100g: 0, commonMeasure: '1 cup', measureGrams: 225 },
  { id: 'egg-whole', name: 'Egg (Whole)', nameLocal: 'अंडे', category: 'meat_fish', caloriesPer100g: 155, proteinPer100g: 13, fatPer100g: 11, fiberPer100g: 0, commonMeasure: '1 piece', measureGrams: 50 },
  { id: 'egg-white', name: 'Egg White', category: 'meat_fish', caloriesPer100g: 52, proteinPer100g: 11, fatPer100g: 0.2, fiberPer100g: 0, commonMeasure: '1 piece', measureGrams: 33 },
  { id: 'prawns', name: 'Prawns (Shrimp)', nameLocal: 'कोळंबी', category: 'meat_fish', caloriesPer100g: 99, proteinPer100g: 24, fatPer100g: 0.3, fiberPer100g: 0, commonMeasure: '100g', measureGrams: 100 },
  { id: 'rohu-fish', name: 'Rohu Fish', nameLocal: 'रोहू मासा', category: 'meat_fish', caloriesPer100g: 97, proteinPer100g: 17, fatPer100g: 2.4, fiberPer100g: 0, commonMeasure: '1 piece', measureGrams: 80 },
  { id: 'pomfret', name: 'Pomfret Fish', nameLocal: 'पापलेट', category: 'meat_fish', caloriesPer100g: 96, proteinPer100g: 18, fatPer100g: 2.5, fiberPer100g: 0, commonMeasure: '1 piece', measureGrams: 80 },
  { id: 'surmai', name: 'Surmai (King Mackerel)', nameLocal: 'सुरमई', category: 'meat_fish', caloriesPer100g: 134, proteinPer100g: 20, fatPer100g: 5.5, fiberPer100g: 0, commonMeasure: '1 piece', measureGrams: 80 },
  { id: 'bangda', name: 'Bangda (Indian Mackerel)', nameLocal: 'बांगडा', category: 'meat_fish', caloriesPer100g: 139, proteinPer100g: 19, fatPer100g: 6.3, fiberPer100g: 0, commonMeasure: '1 piece', measureGrams: 80 },
  { id: 'tuna-canned', name: 'Tuna (Canned)', category: 'meat_fish', caloriesPer100g: 116, proteinPer100g: 26, fatPer100g: 1, fiberPer100g: 0, commonMeasure: '1 can', measureGrams: 165 },

  // ── Spices & Masala ──
  { id: 'turmeric', name: 'Turmeric Powder', nameLocal: 'हळद', category: 'spices', caloriesPer100g: 354, proteinPer100g: 8, fatPer100g: 10, fiberPer100g: 21, commonMeasure: '1 tsp', measureGrams: 3 },
  { id: 'red-chilli-powder', name: 'Red Chilli Powder', nameLocal: 'लाल तिखट', category: 'spices', caloriesPer100g: 282, proteinPer100g: 12, fatPer100g: 14, fiberPer100g: 35, commonMeasure: '1 tsp', measureGrams: 3 },
  { id: 'coriander-powder', name: 'Coriander Powder (Dhaniya)', nameLocal: 'धने पूड', category: 'spices', caloriesPer100g: 298, proteinPer100g: 12, fatPer100g: 18, fiberPer100g: 42, commonMeasure: '1 tsp', measureGrams: 2 },
  { id: 'garam-masala', name: 'Garam Masala', nameLocal: 'गरम मसाला', category: 'spices', caloriesPer100g: 379, proteinPer100g: 15, fatPer100g: 15, fiberPer100g: 53, commonMeasure: '1 tsp', measureGrams: 3 },
  { id: 'cumin-powder', name: 'Cumin Powder (Jeera)', nameLocal: 'जिरे पूड', category: 'spices', caloriesPer100g: 375, proteinPer100g: 18, fatPer100g: 22, fiberPer100g: 10.5, commonMeasure: '1 tsp', measureGrams: 2 },
  { id: 'black-pepper', name: 'Black Pepper', nameLocal: 'काळी मिरी', category: 'spices', caloriesPer100g: 251, proteinPer100g: 10, fatPer100g: 3, fiberPer100g: 25, commonMeasure: '1 tsp', measureGrams: 2 },
  { id: 'asafoetida', name: 'Asafoetida (Hing)', nameLocal: 'हिंग', category: 'spices', caloriesPer100g: 297, proteinPer100g: 4, fatPer100g: 1, fiberPer100g: 5, commonMeasure: 'pinch', measureGrams: 0.5 },
  { id: 'salt', name: 'Salt', nameLocal: 'मीठ', category: 'spices', caloriesPer100g: 0, proteinPer100g: 0, fatPer100g: 0, fiberPer100g: 0, commonMeasure: '1 tsp', measureGrams: 6 },
  { id: 'amchur', name: 'Amchur Powder (Dry Mango)', nameLocal: 'आमचूर', category: 'spices', caloriesPer100g: 308, proteinPer100g: 1, fatPer100g: 1, fiberPer100g: 10, commonMeasure: '1 tsp', measureGrams: 3 },
  { id: 'kitchen-king', name: 'Kitchen King Masala', category: 'spices', caloriesPer100g: 340, proteinPer100g: 12, fatPer100g: 13, fiberPer100g: 25, commonMeasure: '1 tsp', measureGrams: 3 },
  { id: 'pav-bhaji-masala', name: 'Pav Bhaji Masala', nameLocal: 'पाव भाजी मसाला', category: 'spices', caloriesPer100g: 340, proteinPer100g: 12, fatPer100g: 13, fiberPer100g: 25, commonMeasure: '1 tsp', measureGrams: 3 },
  { id: 'sambhar-masala', name: 'Sambhar Masala', category: 'spices', caloriesPer100g: 325, proteinPer100g: 14, fatPer100g: 11, fiberPer100g: 30, commonMeasure: '1 tsp', measureGrams: 3 },
  { id: 'kashmiri-chilli', name: 'Kashmiri Chilli Powder', nameLocal: 'काश्मिरी तिखट', category: 'spices', caloriesPer100g: 282, proteinPer100g: 12, fatPer100g: 14, fiberPer100g: 35, commonMeasure: '1 tsp', measureGrams: 3 },

  // ── Sweeteners ──
  { id: 'sugar', name: 'Sugar (White)', nameLocal: 'साखर', category: 'sweeteners', caloriesPer100g: 387, proteinPer100g: 0, fatPer100g: 0, fiberPer100g: 0, commonMeasure: '1 tsp', measureGrams: 4 },
  { id: 'jaggery', name: 'Jaggery (Gul)', nameLocal: 'गूळ', category: 'sweeteners', caloriesPer100g: 383, proteinPer100g: 0.4, fatPer100g: 0.1, fiberPer100g: 0, commonMeasure: '1 tsp', measureGrams: 10 },
  { id: 'honey', name: 'Honey', nameLocal: 'मध', category: 'sweeteners', caloriesPer100g: 304, proteinPer100g: 0.3, fatPer100g: 0, fiberPer100g: 0.2, commonMeasure: '1 tbsp', measureGrams: 21 },
  { id: 'brown-sugar', name: 'Brown Sugar', category: 'sweeteners', caloriesPer100g: 380, proteinPer100g: 0, fatPer100g: 0, fiberPer100g: 0, commonMeasure: '1 tsp', measureGrams: 4 },
  { id: 'palm-jaggery', name: 'Palm Jaggery', nameLocal: 'मादाचा गूळ', category: 'sweeteners', caloriesPer100g: 390, proteinPer100g: 0.5, fatPer100g: 0, fiberPer100g: 0, commonMeasure: '1 tsp', measureGrams: 10 },

  // ── Condiments ──
  { id: 'soy-sauce', name: 'Soy Sauce', category: 'condiments', caloriesPer100g: 53, proteinPer100g: 8, fatPer100g: 0, fiberPer100g: 0.8, commonMeasure: '1 tbsp', measureGrams: 18 },
  { id: 'vinegar', name: 'Vinegar', category: 'condiments', caloriesPer100g: 18, proteinPer100g: 0, fatPer100g: 0, fiberPer100g: 0, commonMeasure: '1 tbsp', measureGrams: 15 },
  { id: 'tomato-ketchup', name: 'Tomato Ketchup', category: 'condiments', caloriesPer100g: 101, proteinPer100g: 1, fatPer100g: 0.1, fiberPer100g: 0.3, commonMeasure: '1 tbsp', measureGrams: 17 },
  { id: 'tomato-paste', name: 'Tomato Paste', category: 'condiments', caloriesPer100g: 82, proteinPer100g: 4.3, fatPer100g: 0.5, fiberPer100g: 4.1, commonMeasure: '1 tbsp', measureGrams: 15 },
  { id: 'kasundi', name: 'Kasundi (Mustard Sauce)', category: 'condiments', caloriesPer100g: 120, proteinPer100g: 3, fatPer100g: 8, fiberPer100g: 2, commonMeasure: '1 tbsp', measureGrams: 15 },
  { id: 'green-chutney', name: 'Green Chutney (Coriander-Mint)', nameLocal: 'हिरवी चटणी', category: 'condiments', caloriesPer100g: 30, proteinPer100g: 2, fatPer100g: 0.5, fiberPer100g: 2, commonMeasure: '1 tbsp', measureGrams: 15 },
  { id: 'imli-chutney', name: 'Imli Chutney (Tamarind)', nameLocal: 'चिंचेची चटणी', category: 'condiments', caloriesPer100g: 160, proteinPer100g: 0.5, fatPer100g: 0.2, fiberPer100g: 1.5, commonMeasure: '1 tbsp', measureGrams: 15 },
  { id: 'kokum', name: 'Kokum', nameLocal: 'कोकम', category: 'condiments', caloriesPer100g: 60, proteinPer100g: 1, fatPer100g: 1.4, fiberPer100g: 5, commonMeasure: '5 pieces', measureGrams: 10 },

  // ── Miscellaneous ──
  { id: 'water', name: 'Water', nameLocal: 'पाणी', category: 'misc', caloriesPer100g: 0, proteinPer100g: 0, fatPer100g: 0, fiberPer100g: 0, commonMeasure: '1 cup', measureGrams: 240 },
  { id: 'baking-powder', name: 'Baking Powder', category: 'misc', caloriesPer100g: 53, proteinPer100g: 0, fatPer100g: 0, fiberPer100g: 0, commonMeasure: '1 tsp', measureGrams: 5 },
  { id: 'baking-soda', name: 'Baking Soda', category: 'misc', caloriesPer100g: 0, proteinPer100g: 0, fatPer100g: 0, fiberPer100g: 0, commonMeasure: '1 tsp', measureGrams: 5 },
  { id: 'yeast', name: 'Yeast (Dry)', category: 'misc', caloriesPer100g: 325, proteinPer100g: 40, fatPer100g: 7, fiberPer100g: 27, commonMeasure: '1 tsp', measureGrams: 4 },
  { id: 'gelatin', name: 'Gelatin', category: 'misc', caloriesPer100g: 335, proteinPer100g: 86, fatPer100g: 0, fiberPer100g: 0, commonMeasure: '1 tbsp', measureGrams: 7 },
  { id: 'cocoa-powder', name: 'Cocoa Powder', category: 'misc', caloriesPer100g: 228, proteinPer100g: 20, fatPer100g: 14, fiberPer100g: 33, commonMeasure: '1 tbsp', measureGrams: 5 },
  { id: 'tea-leaves', name: 'Tea Leaves', nameLocal: 'चहा पत्ती', category: 'misc', caloriesPer100g: 1, proteinPer100g: 0, fatPer100g: 0, fiberPer100g: 0, commonMeasure: '1 tsp', measureGrams: 2 },
  { id: 'coffee-powder', name: 'Coffee Powder', nameLocal: 'कॉफी', category: 'misc', caloriesPer100g: 2, proteinPer100g: 0.1, fatPer100g: 0, fiberPer100g: 0, commonMeasure: '1 tsp', measureGrams: 2 },
];
