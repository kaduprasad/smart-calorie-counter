#!/usr/bin/env node
/**
 * fetch-usda-nutrition.js
 *
 * Fetches accurate per-100g nutritional data from USDA FoodData Central
 * for fruits, raw vegetables, and basic ingredients in our food database.
 *
 * Usage:
 *   npm run fetch:usda              # Fetch all categories
 *   npm run fetch:usda -- --fruits   # Fetch only fruits
 *   npm run fetch:usda -- --vegetables
 *   npm run fetch:usda -- --query "banana"  # Fetch a single item
 *
 * Output: data/usda-nutrition.json
 */

const fs = require('fs');
const path = require('path');

// ── Config ──────────────────────────────────────────────────────────────────

const API_BASE = 'https://api.nal.usda.gov/fdc/v1';
const OUTPUT_FILE = path.resolve(__dirname, '..', 'data', 'usda-nutrition.json');

// Read API key from .env
function getApiKey() {
  const envPath = path.resolve(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('ERROR: .env file not found. Create one with EXPO_PUBLIC_USDA_API_KEY=your_key');
    process.exit(1);
  }
  const env = fs.readFileSync(envPath, 'utf8');
  const match = env.match(/EXPO_PUBLIC_USDA_API_KEY=(.+)/);
  if (!match || !match[1].trim()) {
    console.error('ERROR: EXPO_PUBLIC_USDA_API_KEY not found in .env');
    process.exit(1);
  }
  return match[1].trim();
}

const API_KEY = getApiKey();

// Rate-limit: USDA allows 1000 req/hour for free keys. We add a small delay.
const DELAY_MS = 300;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// USDA nutrient IDs
const NUTRIENT_IDS = {
  energy: 1008,    // Energy (kcal)
  protein: 1003,   // Protein (g)
  fat: 1004,       // Total fat (g)
  carbs: 1005,     // Carbohydrate (g)
  fiber: 1079,     // Fiber (g)
  sugar: 2000,     // Total Sugars (g)
  calcium: 1087,   // Calcium (mg)
  iron: 1089,      // Iron (mg)
  vitaminC: 1162,  // Vitamin C (mg)
};

// ── Food lists to query ─────────────────────────────────────────────────────
// Each entry: { query: "USDA search term", localName: "our name", category }

const FRUITS = [
  { query: 'bananas, raw', localName: 'Banana', category: 'fruits' },
  { query: 'apples, raw, with skin', localName: 'Apple', category: 'fruits' },
  { query: 'mangos, raw', localName: 'Mango', category: 'fruits' },
  { query: 'papaya, raw', localName: 'Papaya', category: 'fruits' },
  { query: 'grapes, Thompson seedless, raw', localName: 'Grapes', category: 'fruits' },
  { query: 'pomegranate, raw', localName: 'Pomegranate', category: 'fruits' },
  { query: 'guavas, common, raw', localName: 'Guava', category: 'fruits' },
  { query: 'watermelon, raw', localName: 'Watermelon', category: 'fruits' },
  { query: 'oranges, raw, navels', localName: 'Orange', category: 'fruits' },
  { query: 'chicken, broiler, breast, skinless, boneless, raw', localName: 'Chicken Breast', category: 'protein' },
  { query: 'sapodilla, raw', localName: 'Chikoo (Sapota)', category: 'fruits' },
  { query: 'pineapple, raw', localName: 'Pineapple', category: 'fruits' },
  { query: 'coconut meat, raw', localName: 'Coconut (Fresh)', category: 'fruits' },
  { query: 'jackfruit, raw', localName: 'Jackfruit', category: 'fruits' },
  { query: 'custard apple, raw', localName: 'Custard Apple', category: 'fruits' },
  { query: 'java plum, raw', localName: 'Jamun', category: 'fruits' },
  { query: 'lychee, raw', localName: 'Lychee', category: 'fruits' },
  { query: 'figs, raw', localName: 'Fig (Anjeer Fresh)', category: 'fruits' },
  { query: 'limes, raw', localName: 'Sweet Lime (Mosambi)', category: 'fruits' },
  { query: 'pear, raw', localName: 'Pear', category: 'fruits' },
  { query: 'strawberries, raw', localName: 'Strawberry', category: 'fruits' },
  { query: 'peach, raw', localName: 'Peach', category: 'fruits' },
];

const VEGETABLES = [
  { query: 'tomato, red, raw', localName: 'Tomato (Raw)', category: 'vegetables' },
  { query: 'onion, raw', localName: 'Onion (Raw)', category: 'vegetables' },
  { query: 'potato, raw', localName: 'Potato (Raw)', category: 'vegetables' },
  { query: 'carrot, raw', localName: 'Carrot (Raw)', category: 'vegetables' },
  { query: 'cucumber, raw', localName: 'Cucumber', category: 'vegetables' },
  { query: 'spinach, raw', localName: 'Spinach (Palak)', category: 'vegetables' },
  { query: 'cabbage, raw', localName: 'Cabbage', category: 'vegetables' },
  { query: 'cauliflower, raw', localName: 'Cauliflower', category: 'vegetables' },
  { query: 'broccoli, raw', localName: 'Broccoli', category: 'vegetables' },
  { query: 'green beans, raw', localName: 'Green Beans (Farasbi)', category: 'vegetables' },
  { query: 'okra, raw', localName: 'Lady Finger (Bhendi)', category: 'vegetables' },
  { query: 'eggplant, raw', localName: 'Brinjal (Vangi)', category: 'vegetables' },
  { query: 'pumpkin, raw', localName: 'Pumpkin (Bhopla)', category: 'vegetables' },
  { query: 'bottle gourd, raw', localName: 'Bottle Gourd (Dudhi)', category: 'vegetables' },
  { query: 'ridge gourd, raw', localName: 'Ridge Gourd (Dodka)', category: 'vegetables' },
  { query: 'bitter gourd, raw', localName: 'Bitter Gourd (Karela)', category: 'vegetables' },
  { query: 'drumstick, raw', localName: 'Drumstick (Shevga)', category: 'vegetables' },
  { query: 'radish, raw', localName: 'Radish (Mula)', category: 'vegetables' },
  { query: 'beets, raw', localName: 'Beetroot', category: 'vegetables' },
  { query: 'sweet potato, raw, unprepared', localName: 'Sweet Potato', category: 'vegetables' },
  { query: 'corn, sweet, raw', localName: 'Sweet Corn', category: 'vegetables' },
  { query: 'green peas, raw', localName: 'Green Peas', category: 'vegetables' },
  { query: 'peppers, sweet, green, raw', localName: 'Capsicum (Shimla Mirchi)', category: 'vegetables' },
  { query: 'lettuce, raw', localName: 'Lettuce', category: 'vegetables' },
];

const BASIC_INGREDIENTS = [
  { query: 'rice, white, raw', localName: 'Rice (White, Raw)', category: 'grains' },
  { query: 'rice, brown, raw', localName: 'Rice (Brown, Raw)', category: 'grains' },
  { query: 'wheat flour, whole grain', localName: 'Wheat Flour (Atta)', category: 'grains' },
  { query: 'chickpea flour', localName: 'Chickpea Flour (Besan)', category: 'grains' },
  { query: 'lentils, raw', localName: 'Lentils (Dal)', category: 'legumes' },
  { query: 'chickpeas, raw', localName: 'Chickpeas (Chana)', category: 'legumes' },
  { query: 'beans, kidney, red, mature seeds, raw', localName: 'Kidney Beans (Rajma)', category: 'legumes' },
  { query: 'mung beans, raw', localName: 'Mung Beans (Moong)', category: 'legumes' },
  { query: 'milk, whole, 3.25% milkfat', localName: 'Milk (Whole)', category: 'dairy' },
  { query: 'yogurt, plain, whole milk', localName: 'Yogurt (Dahi)', category: 'dairy' },
  { query: 'cheese, paneer', localName: 'Paneer', category: 'dairy' },
  { query: 'butter, salted', localName: 'Butter', category: 'dairy' },
  { query: 'ghee, clarified butter', localName: 'Ghee', category: 'dairy' },
  { query: 'egg, whole, raw', localName: 'Egg (Whole)', category: 'protein' },
  { query: 'peanuts, raw', localName: 'Peanuts (Shengdana)', category: 'nuts' },
  { query: 'almonds, raw', localName: 'Almonds (Badam)', category: 'nuts' },
  { query: 'cashew nuts, raw', localName: 'Cashew (Kaju)', category: 'nuts' },
  { query: 'sugar, white, granulated', localName: 'Sugar (White)', category: 'sweeteners' },
  { query: 'sugars, brown', localName: 'Jaggery (Gul)', category: 'sweeteners' },
  { query: 'honey', localName: 'Honey', category: 'sweeteners' },
  { query: 'oil, coconut', localName: 'Coconut Oil', category: 'oils' },
  { query: 'oil, peanut', localName: 'Peanut Oil (Groundnut Oil)', category: 'oils' },
  { query: 'oil, sunflower', localName: 'Sunflower Oil', category: 'oils' },
];

const NUTS_AND_DRY_FRUITS = [
  { query: 'walnuts, english', localName: 'Walnuts', category: 'nuts' },
  { query: 'nuts, pistachio nuts, raw', localName: 'Pistachios', category: 'nuts' },
  { query: 'raisins, seedless', localName: 'Raisins', category: 'nuts' },
  { query: 'dates, medjool', localName: 'Dates', category: 'nuts' },
  { query: 'figs, dried, uncooked', localName: 'Dried Figs', category: 'nuts' },
  { query: 'nuts, macadamia nuts, raw', localName: 'Macadamia Nuts', category: 'nuts' },
  { query: 'nuts, brazilnuts, raw', localName: 'Brazil Nuts', category: 'nuts' },
  { query: 'nuts, pecans', localName: 'Pecans', category: 'nuts' },
  { query: 'nuts, pine nuts, dried', localName: 'Pine Nuts', category: 'nuts' },
  { query: 'seeds, sunflower seed kernels, dried', localName: 'Sunflower Seeds', category: 'nuts' },
  { query: 'seeds, pumpkin and squash seeds, dried', localName: 'Pumpkin Seeds', category: 'nuts' },
  { query: 'seeds, chia seeds, dried', localName: 'Chia Seeds', category: 'nuts' },
  { query: 'seeds, flaxseed', localName: 'Flax Seeds', category: 'nuts' },
  { query: 'seeds, sesame seeds, whole, dried', localName: 'Sesame Seeds (Til)', category: 'nuts' },
  { query: 'apricots, dried', localName: 'Dried Apricots', category: 'nuts' },
  { query: 'cranberries, dried, sweetened', localName: 'Dried Cranberries', category: 'nuts' },
  { query: 'prunes, dried, uncooked', localName: 'Prunes (Dried Plums)', category: 'nuts' },
  { query: 'nuts, hazelnuts, raw', localName: 'Hazelnuts', category: 'nuts' },
];

const WESTERN_DESSERTS = [
  { query: 'brownies, prepared from recipe', localName: 'Chocolate Brownie', category: 'desserts' },
  { query: 'ice creams, vanilla', localName: 'Ice Cream (Vanilla)', category: 'desserts' },
  { query: 'cake, chocolate, prepared from recipe', localName: 'Chocolate Cake', category: 'desserts' },
  { query: 'cheesecake, prepared from recipe', localName: 'Cheesecake', category: 'desserts' },
  { query: 'cookies, chocolate chip, prepared from recipe', localName: 'Chocolate Chip Cookie', category: 'desserts' },
  { query: 'doughnuts, cake-type, plain', localName: 'Donut (Plain)', category: 'desserts' },
  { query: 'muffins, blueberry, prepared from recipe', localName: 'Blueberry Muffin', category: 'desserts' },
  { query: 'muffins, chocolate chip, prepared from recipe', localName: 'Chocolate Muffin', category: 'desserts' },
  { query: 'pie, apple, prepared from recipe', localName: 'Apple Pie', category: 'desserts' },
  { query: 'croissants, butter', localName: 'Croissant (Butter)', category: 'desserts' },
  { query: 'pancakes, plain, prepared from recipe', localName: 'Pancake', category: 'desserts' },
  { query: 'waffles, plain, prepared from recipe', localName: 'Waffle', category: 'desserts' },
  { query: 'cake, pound, prepared from recipe', localName: 'Pound Cake', category: 'desserts' },
  { query: 'cake, carrot, prepared from recipe', localName: 'Carrot Cake', category: 'desserts' },
  { query: 'puddings, chocolate, ready-to-eat', localName: 'Chocolate Pudding', category: 'desserts' },
  { query: 'tiramisu', localName: 'Tiramisu', category: 'desserts' },
  { query: 'cake, red velvet, prepared from recipe', localName: 'Red Velvet Cake', category: 'desserts' },
  { query: 'pastry, cream puff, prepared from recipe', localName: 'Cream Puff / Eclair', category: 'desserts' },
  { query: 'cupcake, chocolate, with frosting', localName: 'Cupcake (with Frosting)', category: 'desserts' },
  { query: 'bread, banana, prepared from recipe', localName: 'Banana Bread', category: 'desserts' },
  { query: 'mousse, chocolate, prepared from recipe', localName: 'Chocolate Mousse', category: 'desserts' },
  { query: 'cake, sponge, prepared from recipe', localName: 'Sponge Cake', category: 'desserts' },
  { query: 'churros', localName: 'Churros', category: 'desserts' },
  { query: 'cookies, butter, prepared from recipe', localName: 'Butter Cookie', category: 'desserts' },
  { query: 'pie, pumpkin, prepared from recipe', localName: 'Pumpkin Pie', category: 'desserts' },
  { query: 'cake, black forest', localName: 'Black Forest Cake', category: 'desserts' },
  { query: 'macaroons, coconut', localName: 'Coconut Macaroon', category: 'desserts' },
  { query: 'cinnamon rolls, prepared from recipe', localName: 'Cinnamon Roll', category: 'desserts' },
];

// ── USDA API fetch ──────────────────────────────────────────────────────────

async function fetchFromUSDA(query) {
  // Search SR Legacy + Foundation, let USDA rank by relevance (no sortBy override)
  const url = `${API_BASE}/foods/search?api_key=${encodeURIComponent(API_KEY)}&query=${encodeURIComponent(query)}&dataType=${encodeURIComponent('SR Legacy,Foundation')}&pageSize=5`;

  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`USDA API error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.foods || data.foods.length === 0) {
    return null;
  }

  // Pick best result: prefer description that closely matches query, with energy > 0
  const queryLower = query.toLowerCase();
  // Primary word = first meaningful word in query (the main food name)
  const queryWords = queryLower.split(/[\s,]+/).filter((w) => w.length > 2);
  const primaryWord = queryWords[0] || '';

  let food = data.foods[0];
  let bestScore = -1;

  for (const candidate of data.foods) {
    const nutrients = candidate.foodNutrients || [];
    const hasEnergy = nutrients.some((n) => [1008, 2047, 2048].includes(n.nutrientId) && n.value > 0);
    if (!hasEnergy) continue;

    const desc = candidate.description.toLowerCase();

    // Must contain the primary food name — skip if it doesn't
    if (primaryWord && !desc.includes(primaryWord)) continue;

    // Score: how many query words appear in description
    let score = queryWords.filter((w) => desc.includes(w)).length;
    // Bonus for exact query match in description
    if (desc.includes(queryLower)) score += 10;
    // Small bonus for SR Legacy (more standard nutrient IDs)
    if (candidate.dataType === 'SR Legacy') score += 1;

    if (score > bestScore) {
      bestScore = score;
      food = candidate;
    }
  }
  const nutrients = food.foodNutrients || [];

  const getNutrient = (id) => {
    const n = nutrients.find((n) => n.nutrientId === id);
    return n ? Math.round(n.value * 10) / 10 : 0;
  };

  // Energy: prefer 1008, then 2047 (Atwater General), then 2048 (Atwater Specific)
  const energy = getNutrient(NUTRIENT_IDS.energy)
    || getNutrient(2047)
    || getNutrient(2048);

  return {
    fdcId: food.fdcId,
    usdaDescription: food.description,
    dataType: food.dataType,
    caloriesPer100g: energy,
    proteinPer100g: getNutrient(NUTRIENT_IDS.protein),
    fatPer100g: getNutrient(NUTRIENT_IDS.fat),
    carbsPer100g: getNutrient(NUTRIENT_IDS.carbs),
    fiberPer100g: getNutrient(NUTRIENT_IDS.fiber),
    sugarPer100g: getNutrient(NUTRIENT_IDS.sugar),
    calciumMgPer100g: getNutrient(NUTRIENT_IDS.calcium),
    ironMgPer100g: getNutrient(NUTRIENT_IDS.iron),
    vitaminCMgPer100g: getNutrient(NUTRIENT_IDS.vitaminC),
  };
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const fetchFruits = args.includes('--fruits') || args.length === 0 || args.includes('--all');
  const fetchVegetables = args.includes('--vegetables') || args.length === 0 || args.includes('--all');
  const fetchIngredients = args.includes('--ingredients') || args.length === 0 || args.includes('--all');
  const fetchNuts = args.includes('--nuts') || args.length === 0 || args.includes('--all');
  const fetchDesserts = args.includes('--desserts') || args.length === 0 || args.includes('--all');
  const singleQuery = args.find((a) => a.startsWith('--query='))?.split('=')[1]
    || (args.includes('--query') ? args[args.indexOf('--query') + 1] : null);

  // Build the items list
  let items = [];

  if (singleQuery) {
    items = [{ query: singleQuery, localName: singleQuery, category: 'custom' }];
  } else {
    if (fetchFruits) items.push(...FRUITS);
    if (fetchVegetables) items.push(...VEGETABLES);
    if (fetchIngredients) items.push(...BASIC_INGREDIENTS);
    if (fetchNuts) items.push(...NUTS_AND_DRY_FRUITS);
    if (fetchDesserts) items.push(...WESTERN_DESSERTS);
  }

  if (items.length === 0) {
    console.log('No items to fetch. Use --fruits, --vegetables, --ingredients, --nuts, --desserts, --all, or --query "name"');
    process.exit(0);
  }

  // Load existing output if it exists (to merge/update)
  let existing = { fetchedAt: null, source: 'USDA FoodData Central', items: [] };
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
      console.log(`Loaded existing file with ${existing.items.length} items. Will update/merge.\n`);
    } catch {
      // corrupted file, start fresh
    }
  }

  const existingMap = new Map(existing.items.map((item) => [item.localName, item]));

  console.log(`Fetching ${items.length} items from USDA FoodData Central...\n`);
  let successCount = 0;
  let failCount = 0;

  for (const item of items) {
    process.stdout.write(`  ${item.localName} ... `);
    try {
      const result = await fetchFromUSDA(item.query);
      if (result) {
        existingMap.set(item.localName, {
          localName: item.localName,
          category: item.category,
          ...result,
        });
        console.log(`${result.caloriesPer100g} kcal/100g ✓`);
        successCount++;
      } else {
        console.log('NOT FOUND ✗');
        failCount++;
      }
    } catch (err) {
      console.log(`ERROR: ${err.message} ✗`);
      failCount++;
    }
    await sleep(DELAY_MS);
  }

  // Sort by category then name
  const sortedItems = [...existingMap.values()].sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.localName.localeCompare(b.localName);
  });

  const output = {
    _comment: 'Auto-generated by scripts/fetch-usda-nutrition.js — DO NOT EDIT MANUALLY',
    fetchedAt: new Date().toISOString().split('T')[0],
    source: 'USDA FoodData Central (Foundation + SR Legacy)',
    totalItems: sortedItems.length,
    items: sortedItems,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2) + '\n', 'utf8');

  console.log(`\nDone! ${successCount} fetched, ${failCount} failed.`);
  console.log(`Total items in output: ${sortedItems.length}`);
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
