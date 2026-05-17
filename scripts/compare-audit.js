/**
 * compare-audit.js
 * 
 * Compares the Excel audit data (per-100g) against our food database (per-unit).
 * Converts our per-unit values to per-100g using unitWeight, then flags discrepancies.
 * 
 * Usage: node scripts/compare-audit.js
 */
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// ── Load Excel audit data ───────────────────────────────────────────────
const wb = XLSX.readFile(path.join(__dirname, '../src/data/first_500_foods_calorie_audit 2.xlsx'));
const ws = wb.Sheets[wb.SheetNames[0]];
const auditData = XLSX.utils.sheet_to_json(ws);

// ── Load our food database ──────────────────────────────────────────────
function loadStaticFoods() {
  const content = fs.readFileSync(path.join(__dirname, '../src/data/foods.ts'), 'utf8');
  const foods = [];
  const regex = /{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)'(?:,\s*nameMarathi:\s*'([^']*)')?,\s*category:\s*'([^']+)',\s*caloriesPerUnit:\s*([\d.]+)(?:,\s*proteinPerUnit:\s*([\d.]+))?(?:,\s*fatPerUnit:\s*([\d.]+))?(?:,\s*fiberPerUnit:\s*([\d.]+))?,\s*unit:\s*'([^']+)'(?:,\s*unitWeight:\s*([\d.]+))?/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    foods.push({
      id: match[1],
      name: match[2],
      nameMarathi: match[3] || '',
      category: match[4],
      caloriesPerUnit: parseFloat(match[5]),
      proteinPerUnit: match[6] ? parseFloat(match[6]) : 0,
      fatPerUnit: match[7] ? parseFloat(match[7]) : 0,
      fiberPerUnit: match[8] ? parseFloat(match[8]) : 0,
      unit: match[9],
      unitWeight: match[10] ? parseFloat(match[10]) : null,
      source: 'static',
    });
  }
  return foods;
}

function loadRemoteFoods() {
  const filePath = path.join(__dirname, '../data/remote-foods.json');
  if (!fs.existsSync(filePath)) return [];
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return (data.foods || []).map(f => ({
    id: f.id,
    name: f.name,
    nameMarathi: f.nameMarathi || '',
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

const allFoods = [...loadStaticFoods(), ...loadRemoteFoods()];

// ── Normalize names for fuzzy matching ──────────────────────────────────
function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[()\/\-–—,.''"":!]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Build lookup maps by various keys
const foodByName = new Map();
const foodByMarathi = new Map();
for (const f of allFoods) {
  const key = normalize(f.name);
  if (!foodByName.has(key)) foodByName.set(key, f);
  if (f.nameMarathi) {
    foodByMarathi.set(f.nameMarathi.trim(), f);
  }
}

// ── Match audit rows to our foods ───────────────────────────────────────
function findMatch(auditRow) {
  const auditName = normalize(auditRow['Food Item name'] || '');
  const auditMarathi = (auditRow['Marathi name'] || '').trim();
  
  // Exact name match
  if (foodByName.has(auditName)) return foodByName.get(auditName);
  
  // Marathi name match
  if (auditMarathi && foodByMarathi.has(auditMarathi)) return foodByMarathi.get(auditMarathi);
  
  // Substring match (audit name contains or is contained in our name)
  for (const [key, food] of foodByName) {
    if (key.includes(auditName) || auditName.includes(key)) return food;
  }
  
  // Word-overlap match (>= 2 words in common)
  const auditWords = auditName.split(' ').filter(w => w.length > 2);
  let bestMatch = null;
  let bestOverlap = 0;
  for (const [key, food] of foodByName) {
    const foodWords = key.split(' ').filter(w => w.length > 2);
    const overlap = auditWords.filter(w => foodWords.includes(w)).length;
    if (overlap >= 2 && overlap > bestOverlap) {
      bestOverlap = overlap;
      bestMatch = food;
    }
  }
  
  return bestMatch;
}

// ── Compare ─────────────────────────────────────────────────────────────
const results = {
  matched: [],
  flagged: [],      // >15% difference
  warning: [],      // 10-15% difference
  noMatch: [],
  noWeight: [],
};

for (const row of auditData) {
  const auditCal100g = parseFloat(row['Calories (kcal)']);
  const auditProtein100g = parseFloat(row['Protein (g)']) || 0;
  const auditFat100g = parseFloat(row['Fat (g)']) || 0;
  const auditFiber100g = parseFloat(row['Fiber (g)']) || 0;
  
  if (isNaN(auditCal100g) || auditCal100g <= 0) continue;
  
  const food = findMatch(row);
  if (!food) {
    results.noMatch.push({ auditName: row['Food Item name'], auditCal100g });
    continue;
  }
  
  if (!food.unitWeight) {
    results.noWeight.push({ id: food.id, name: food.name, auditName: row['Food Item name'] });
    continue;
  }
  
  // Convert our per-unit to per-100g
  const ourCal100g = (food.caloriesPerUnit / food.unitWeight) * 100;
  const diff = ourCal100g - auditCal100g;
  const diffPercent = (diff / auditCal100g) * 100;
  
  // Also compute suggested per-unit value from audit
  const suggestedCalPerUnit = Math.round((auditCal100g * food.unitWeight) / 100);
  
  const entry = {
    id: food.id,
    name: food.name,
    source: food.source,
    unit: food.unit,
    unitWeight: food.unitWeight,
    currentCalPerUnit: food.caloriesPerUnit,
    currentCal100g: Math.round(ourCal100g * 10) / 10,
    auditCal100g,
    auditProtein100g,
    auditFat100g,
    auditFiber100g,
    diffPercent: Math.round(diffPercent * 10) / 10,
    suggestedCalPerUnit,
    auditName: row['Food Item name'],
  };
  
  const absDiff = Math.abs(diffPercent);
  if (absDiff > 15) {
    results.flagged.push(entry);
  } else if (absDiff > 10) {
    results.warning.push(entry);
  } else {
    results.matched.push(entry);
  }
}

// Sort flagged by absolute difference
results.flagged.sort((a, b) => Math.abs(b.diffPercent) - Math.abs(a.diffPercent));
results.warning.sort((a, b) => Math.abs(b.diffPercent) - Math.abs(a.diffPercent));

// ── Print Report ────────────────────────────────────────────────────────
console.log('═══════════════════════════════════════════════════════════════');
console.log('  FOOD CALORIE AUDIT COMPARISON REPORT');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log(`SUMMARY:`);
console.log(`  Audit items:     ${auditData.length}`);
console.log(`  Matched (OK):    ${results.matched.length} (within 10%)`);
console.log(`  Warning:         ${results.warning.length} (10-15% off)`);
console.log(`  Flagged:         ${results.flagged.length} (>15% off)`);
console.log(`  No match found:  ${results.noMatch.length}`);
console.log(`  No unit weight:  ${results.noWeight.length}\n`);

if (results.flagged.length > 0) {
  console.log('───────────────────────────────────────────────────────────────');
  console.log('  🔴 FLAGGED (>15% difference) — NEED REVIEW');
  console.log('───────────────────────────────────────────────────────────────\n');
  
  for (const f of results.flagged) {
    const sign = f.diffPercent > 0 ? '+' : '';
    console.log(`  ${f.name} [${f.id}] (${f.source})`);
    console.log(`    Audit: "${f.auditName}"`);
    console.log(`    Ours: ${f.currentCalPerUnit} cal/${f.unit} (${f.unitWeight}g) → ${f.currentCal100g} cal/100g`);
    console.log(`    Audit: ${f.auditCal100g} cal/100g | P:${f.auditProtein100g} F:${f.auditFat100g} Fib:${f.auditFiber100g}`);
    console.log(`    Diff: ${sign}${f.diffPercent}%`);
    console.log(`    Suggested: ${f.suggestedCalPerUnit} cal/${f.unit}`);
    console.log('');
  }
}

if (results.warning.length > 0) {
  console.log('───────────────────────────────────────────────────────────────');
  console.log('  🟡 WARNING (10-15% difference)');
  console.log('───────────────────────────────────────────────────────────────\n');
  
  for (const f of results.warning) {
    const sign = f.diffPercent > 0 ? '+' : '';
    console.log(`  ${f.name} [${f.id}] (${f.source})`);
    console.log(`    Ours: ${f.currentCalPerUnit}→${f.currentCal100g}/100g | Audit: ${f.auditCal100g}/100g | ${sign}${f.diffPercent}% | Suggest: ${f.suggestedCalPerUnit}`);
  }
  console.log('');
}

// Save full report as JSON for further processing
const reportPath = path.join(__dirname, '../data/audit-comparison.json');
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2) + '\n', 'utf8');
console.log(`Full report saved to: ${reportPath}`);
