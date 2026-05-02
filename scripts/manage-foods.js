/**
 * Food Database Management Script
 *
 * Node.js utility for managing the food database offline:
 *  - List all foods, filter by source/category
 *  - Find duplicates by name
 *  - Add new foods to foods.ts or remote-foods.json
 *  - Validate entries (missing fields, duplicate IDs)
 *  - Export stats
 *
 * Usage:
 *   node scripts/manage-foods.js stats
 *   node scripts/manage-foods.js duplicates
 *   node scripts/manage-foods.js validate
 *   node scripts/manage-foods.js search "paneer"
 *   node scripts/manage-foods.js ids          # List all IDs (for quick duplicate check)
 */

const fs = require('fs');
const path = require('path');

// ─── Load food data ─────────────────────────────────────────────────────

function loadStaticFoods() {
  const content = fs.readFileSync(path.join(__dirname, '../src/data/foods.ts'), 'utf8');
  // Extract food objects using regex (works for the array format)
  const foods = [];
  const regex = /{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)'[^}]*category:\s*'([^']+)'[^}]*caloriesPerUnit:\s*([\d.]+)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    foods.push({
      id: match[1],
      name: match[2],
      category: match[3],
      caloriesPerUnit: parseFloat(match[4]),
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
    ...f,
    source: 'remote',
  }));
}

function getAllFoods() {
  return [...loadStaticFoods(), ...loadRemoteFoods()];
}

// ─── Commands ───────────────────────────────────────────────────────────

function stats() {
  const staticFoods = loadStaticFoods();
  const remoteFoods = loadRemoteFoods();
  const all = [...staticFoods, ...remoteFoods];

  console.log('\n📊 Food Database Stats');
  console.log('═'.repeat(40));
  console.log(`Total foods:    ${all.length}`);
  console.log(`  Static:       ${staticFoods.length}`);
  console.log(`  Remote:       ${remoteFoods.length}`);

  // Category breakdown
  const cats = {};
  all.forEach(f => { cats[f.category] = (cats[f.category] || 0) + 1; });
  console.log('\nBy Category:');
  Object.entries(cats)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`  ${cat.padEnd(15)} ${count}`);
    });
}

function findDuplicates() {
  const all = getAllFoods();

  // Check duplicate IDs
  const idMap = new Map();
  const dupIds = [];
  all.forEach(f => {
    if (idMap.has(f.id)) {
      dupIds.push({ id: f.id, sources: [idMap.get(f.id).source, f.source] });
    }
    idMap.set(f.id, f);
  });

  // Check duplicate names (case-insensitive)
  const nameMap = new Map();
  const dupNames = [];
  all.forEach(f => {
    const key = f.name.toLowerCase().trim();
    if (nameMap.has(key)) {
      dupNames.push({
        name: f.name,
        ids: [nameMap.get(key).id, f.id],
        sources: [nameMap.get(key).source, f.source],
      });
    }
    nameMap.set(key, f);
  });

  console.log('\n🔍 Duplicate Check');
  console.log('═'.repeat(40));

  if (dupIds.length === 0 && dupNames.length === 0) {
    console.log('✅ No duplicates found!');
    return;
  }

  if (dupIds.length > 0) {
    console.log(`\n❌ ${dupIds.length} Duplicate IDs:`);
    dupIds.forEach(d => console.log(`  ${d.id} (${d.sources.join(', ')})`));
  }

  if (dupNames.length > 0) {
    console.log(`\n⚠️  ${dupNames.length} Duplicate Names:`);
    dupNames.forEach(d => console.log(`  "${d.name}" → ${d.ids.join(', ')} (${d.sources.join(', ')})`));
  }
}

function validate() {
  const all = getAllFoods();
  const issues = [];
  const validCategories = ['breads', 'rice', 'dal', 'vegetables', 'snacks', 'chaat', 'nonveg', 'maincourse', 'sweets', 'beverages', 'dairy', 'fruits', 'chutneys', 'pickles', 'breakfast', 'custom'];

  all.forEach(f => {
    if (!f.id) issues.push(`Missing ID for "${f.name}"`);
    if (!f.name) issues.push(`Missing name for ID "${f.id}"`);
    if (!validCategories.includes(f.category)) issues.push(`Invalid category "${f.category}" for "${f.name}"`);
    if (!f.caloriesPerUnit || f.caloriesPerUnit <= 0) issues.push(`Invalid calories (${f.caloriesPerUnit}) for "${f.name}"`);
    if (f.caloriesPerUnit > 1000) issues.push(`Unusually high calories (${f.caloriesPerUnit}) for "${f.name}" — verify this is per serving`);
  });

  console.log('\n🔧 Validation Results');
  console.log('═'.repeat(40));

  if (issues.length === 0) {
    console.log(`✅ All ${all.length} foods passed validation!`);
  } else {
    console.log(`❌ ${issues.length} issues found:`);
    issues.forEach(i => console.log(`  • ${i}`));
  }
}

function search(query) {
  const all = getAllFoods();
  const q = query.toLowerCase();
  const results = all.filter(f =>
    f.id.toLowerCase().includes(q) ||
    f.name.toLowerCase().includes(q)
  );

  console.log(`\n🔎 Search results for "${query}" (${results.length} found):`);
  results.forEach(f => {
    console.log(`  [${f.source}] ${f.id.padEnd(30)} ${f.name.padEnd(35)} ${f.category.padEnd(12)} ${f.caloriesPerUnit} cal`);
  });
}

function listIds() {
  const all = getAllFoods();
  console.log(`\n📋 All ${all.length} food IDs:`);
  all.sort((a, b) => a.id.localeCompare(b.id));
  all.forEach(f => console.log(`  ${f.id}`));
}

// ─── CLI ────────────────────────────────────────────────────────────────

const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'stats':
    stats();
    break;
  case 'duplicates':
  case 'dups':
    findDuplicates();
    break;
  case 'validate':
    validate();
    break;
  case 'search':
    if (!arg) {
      console.error('Usage: node manage-foods.js search "query"');
      process.exit(1);
    }
    search(arg);
    break;
  case 'ids':
    listIds();
    break;
  default:
    console.log(`
Food Database Manager
═══════════════════════
Commands:
  stats       Show database statistics
  duplicates  Find duplicate IDs and names
  validate    Check for data quality issues
  search "q"  Search foods by name or ID
  ids         List all food IDs (sorted)
`);
}
