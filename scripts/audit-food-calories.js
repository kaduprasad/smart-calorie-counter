#!/usr/bin/env node
/**
 * audit-food-calories.js
 * 
 * Cross-references food items in the app database against USDA nutrition data
 * and flags items where calories differ by more than a configurable threshold.
 * 
 * Strategy:
 *   1. Loads all foods from foods.ts + remote-foods.json
 *   2. Loads USDA reference data from data/usda-nutrition.json
 *   3. For items with unitWeight, converts app cal/unit → cal/100g 
 *   4. Compares against USDA cal/100g
 *   5. Flags items exceeding the threshold (default: 15%)
 *   6. Outputs a report for Copilot agent to review/fix
 * 
 * Usage:
 *   node scripts/audit-food-calories.js                    # Audit all, 15% threshold
 *   node scripts/audit-food-calories.js --threshold 10     # 10% threshold
 *   node scripts/audit-food-calories.js --category fruits  # Audit only fruits
 *   node scripts/audit-food-calories.js --fetch            # Fetch fresh USDA data first
 *   node scripts/audit-food-calories.js --output report    # Save report to data/audit-report.json
 * 
 * Add to package.json scripts:
 *   "audit:calories": "node scripts/audit-food-calories.js"
 */
const fs = require('fs');
const path = require('path');

// ── Config ──────────────────────────────────────────────────────────────
const USDA_FILE = path.join(__dirname, '../data/usda-nutrition.json');
const FOODS_TS = path.join(__dirname, '../src/data/foods.ts');
const REMOTE_JSON = path.join(__dirname, '../data/remote-foods.json');
const REPORT_FILE = path.join(__dirname, '../data/audit-report.json');

// ── Parse args ──────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const threshold = parseFloat(
  args.includes('--threshold') ? args[args.indexOf('--threshold') + 1] : '15'
);
const categoryFilter = args.includes('--category')
  ? args[args.indexOf('--category') + 1]
  : null;
const saveReport = args.includes('--output');
const fetchFirst = args.includes('--fetch');

// ── Load app foods ──────────────────────────────────────────────────────
function loadStaticFoods() {
  const content = fs.readFileSync(FOODS_TS, 'utf8');
  const foods = [];
  const regex = /{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)'(?:,\s*nameMarathi:\s*'[^']*')?,\s*category:\s*'([^']+)',\s*caloriesPerUnit:\s*([\d.]+)(?:,\s*proteinPerUnit:\s*([\d.]+))?(?:,\s*fatPerUnit:\s*([\d.]+))?(?:,\s*fiberPerUnit:\s*([\d.]+))?,\s*unit:\s*'([^']+)'(?:,\s*unitWeight:\s*([\d.]+))?/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    foods.push({
      id: match[1],
      name: match[2],
      category: match[3],
      caloriesPerUnit: parseFloat(match[4]),
      proteinPerUnit: match[5] ? parseFloat(match[5]) : 0,
      fatPerUnit: match[6] ? parseFloat(match[6]) : 0,
      fiberPerUnit: match[7] ? parseFloat(match[7]) : 0,
      unit: match[8],
      unitWeight: match[9] ? parseFloat(match[9]) : null,
      source: 'static',
    });
  }
  return foods;
}

function loadRemoteFoods() {
  if (!fs.existsSync(REMOTE_JSON)) return [];
  const data = JSON.parse(fs.readFileSync(REMOTE_JSON, 'utf8'));
  return (data.foods || []).map(f => ({
    id: f.id,
    name: f.name,
    category: f.category,
    caloriesPerUnit: f.caloriesPerUnit,
    proteinPerUnit: f.proteinPerUnit || 0,
    fatPerUnit: f.fatPerUnit || 0,
    fiberPerUnit: f.fiberPerUnit || 0,
    unit: f.unit,
    unitWeight: f.unitWeight || null,
    source: 'remote',
  }));
}

// ── Load USDA reference ─────────────────────────────────────────────────
function loadUSDAReference() {
  if (!fs.existsSync(USDA_FILE)) {
    console.error(`USDA data not found at ${USDA_FILE}`);
    console.error('Run: npm run fetch:usda');
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(USDA_FILE, 'utf8'));
  // Build a lookup: lowercase name → USDA data
  const lookup = new Map();
  for (const item of data.items) {
    lookup.set(item.localName.toLowerCase(), item);
    // Also index by first word for fuzzy matching
    const firstWord = item.localName.toLowerCase().split(/[\s(]/)[0];
    if (!lookup.has(firstWord)) {
      lookup.set(firstWord, item);
    }
  }
  return { data, lookup };
}

// ── Matching logic ──────────────────────────────────────────────────────
// Map app food names to USDA localNames
const NAME_MAPPINGS = {
  // Fruits
  'banana': 'Banana',
  'apple': 'Apple',
  'mango': 'Mango',
  'papaya': 'Papaya',
  'grapes': 'Grapes',
  'pomegranate': 'Pomegranate',
  'guava': 'Guava',
  'watermelon': 'Watermelon',
  'orange': 'Orange',
  'chikoo': 'Chikoo (Sapota)',
  'pineapple': 'Pineapple',
  'coconut (fresh)': 'Coconut (Fresh)',
  'jackfruit': 'Jackfruit',
  'custard apple': 'Custard Apple',
  'jamun': 'Jamun',
  'lychee': 'Lychee',
  'fig': 'Fig (Anjeer Fresh)',
  'mosambi': 'Sweet Lime (Mosambi)',
  'pear': 'Pear',
  'strawberry': 'Strawberry',
  'peach': 'Peach',
  // Dairy
  'paneer': 'Paneer',
  'dahi': 'Yogurt (Dahi)',
  'ghee': 'Ghee',
  'butter': 'Butter',
  'milk': 'Milk (Whole)',
  // Proteins
  'chicken breast': 'Chicken Breast',
  'egg': 'Egg (Whole)',
  // Nuts
  'peanuts': 'Peanuts (Shengdana)',
  'almonds': 'Almonds (Badam)',
  'cashew': 'Cashew (Kaju)',
  'walnuts': 'Walnuts',
  // Desserts
  'brownie': 'Chocolate Brownie',
  'ice cream': 'Ice Cream (Vanilla)',
  'cheesecake': 'Cheesecake',
  'croissant': 'Croissant (Butter)',
  'pancake': 'Pancake',
  'donut': 'Donut (Plain)',
};

function findUSDAMatch(food, usdaLookup) {
  const nameLower = food.name.toLowerCase();
  
  // Direct match
  if (usdaLookup.has(nameLower)) return usdaLookup.get(nameLower);
  
  // Mapped match
  for (const [key, usdaName] of Object.entries(NAME_MAPPINGS)) {
    if (nameLower.includes(key)) {
      const ref = usdaLookup.get(usdaName.toLowerCase());
      if (ref) return ref;
    }
  }
  
  // First-word match
  const firstWord = nameLower.split(/[\s(]/)[0];
  if (firstWord.length > 3 && usdaLookup.has(firstWord)) {
    return usdaLookup.get(firstWord);
  }
  
  return null;
}

// ── Audit ───────────────────────────────────────────────────────────────
async function main() {
  if (fetchFirst) {
    console.log('Fetching fresh USDA data first...\n');
    const { execSync } = require('child_process');
    execSync('node scripts/fetch-usda-nutrition.js', { 
      stdio: 'inherit', 
      cwd: path.join(__dirname, '..') 
    });
    console.log('\n');
  }

  const staticFoods = loadStaticFoods();
  const remoteFoods = loadRemoteFoods();
  let allFoods = [...staticFoods, ...remoteFoods];
  
  if (categoryFilter) {
    allFoods = allFoods.filter(f => f.category === categoryFilter);
  }

  const { data: usdaData, lookup: usdaLookup } = loadUSDAReference();

  console.log(`Auditing ${allFoods.length} food items against USDA data (threshold: ${threshold}%)\n`);

  const flagged = [];
  const matched = [];
  const unmatched = [];

  for (const food of allFoods) {
    const usdaRef = findUSDAMatch(food, usdaLookup);
    
    if (!usdaRef) {
      unmatched.push(food);
      continue;
    }

    // Convert app calories to per-100g for comparison
    let appCalPer100g;
    if (food.unitWeight && food.unitWeight > 0) {
      appCalPer100g = (food.caloriesPerUnit / food.unitWeight) * 100;
    } else {
      // Can't compare without unit weight
      unmatched.push({ ...food, reason: 'no unitWeight' });
      continue;
    }

    const usdaCal = usdaRef.caloriesPer100g;
    const diff = appCalPer100g - usdaCal;
    const diffPercent = usdaCal > 0 ? (diff / usdaCal) * 100 : 0;

    const result = {
      id: food.id,
      name: food.name,
      source: food.source,
      category: food.category,
      unit: food.unit,
      unitWeight: food.unitWeight,
      appCalPerUnit: food.caloriesPerUnit,
      appCalPer100g: Math.round(appCalPer100g * 10) / 10,
      usdaCalPer100g: usdaCal,
      usdaName: usdaRef.localName,
      diffPercent: Math.round(diffPercent * 10) / 10,
      diffAbsolute: Math.round(diff * 10) / 10,
    };

    if (Math.abs(diffPercent) > threshold) {
      flagged.push(result);
    } else {
      matched.push(result);
    }
  }

  // Sort flagged by absolute difference (biggest first)
  flagged.sort((a, b) => Math.abs(b.diffPercent) - Math.abs(a.diffPercent));

  // ── Print report ────────────────────────────────────────────────────
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  FLAGGED ITEMS (>${threshold}% difference from USDA)`);
  console.log('═══════════════════════════════════════════════════════════\n');

  if (flagged.length === 0) {
    console.log('  ✓ No items exceed the threshold. All good!\n');
  } else {
    for (const f of flagged) {
      const sign = f.diffPercent > 0 ? '+' : '';
      const emoji = Math.abs(f.diffPercent) > 30 ? '🔴' : '🟡';
      console.log(`${emoji} ${f.name} [${f.id}] (${f.source})`);
      console.log(`   App: ${f.appCalPerUnit} cal/${f.unit} (${f.unitWeight}g) → ${f.appCalPer100g} cal/100g`);
      console.log(`   USDA: ${f.usdaCalPer100g} cal/100g (${f.usdaName})`);
      console.log(`   Diff: ${sign}${f.diffPercent}% (${sign}${f.diffAbsolute} cal/100g)`);
      
      // Suggest corrected value
      const suggestedCal = Math.round((usdaLookup.get(f.usdaName.toLowerCase())?.caloriesPer100g || f.usdaCalPer100g) * f.unitWeight / 100);
      console.log(`   Suggested: ${suggestedCal} cal/${f.unit}`);
      console.log('');
    }
  }

  console.log('───────────────────────────────────────────────────────────');
  console.log(`  SUMMARY`);
  console.log('───────────────────────────────────────────────────────────');
  console.log(`  Matched & OK:  ${matched.length}`);
  console.log(`  Flagged:       ${flagged.length}`);
  console.log(`  No USDA match: ${unmatched.length}`);
  console.log(`  Total audited: ${allFoods.length}`);
  console.log('───────────────────────────────────────────────────────────\n');

  // ── Save report ───────────────────────────────────────────────────
  if (saveReport) {
    const report = {
      _comment: 'Auto-generated by scripts/audit-food-calories.js',
      generatedAt: new Date().toISOString().split('T')[0],
      threshold: `${threshold}%`,
      summary: {
        total: allFoods.length,
        matched: matched.length,
        flagged: flagged.length,
        unmatched: unmatched.length,
      },
      flaggedItems: flagged,
      matchedItems: matched,
    };
    fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2) + '\n', 'utf8');
    console.log(`Report saved to: ${REPORT_FILE}\n`);
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
