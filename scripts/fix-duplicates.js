/**
 * Script to remove duplicate entries from remote-foods.json
 * that already exist in foods.ts, and add new raw fruit entries.
 * 
 * Run: node scripts/fix-duplicates.js
 */
const fs = require('fs');
const path = require('path');

const remoteFoodsPath = path.join(__dirname, '..', 'data', 'remote-foods.json');
const data = JSON.parse(fs.readFileSync(remoteFoodsPath, 'utf8'));

// IDs to remove (duplicates of items in foods.ts)
const duplicateIds = new Set([
  'remote-paneer-chilli-dry',      // duplicate of chilli-paneer-dry
  'remote-pandhra-varan',          // duplicate of varan (0 cal diff)
  'remote-kokum-saar',             // duplicate of aamsul-saar
  'remote-matki-chi-usal',         // duplicate of matki-usal
  'remote-coconut-ladoo',          // duplicate of ladoo-coconut
  'remote-vangyache-bharit',       // duplicate of bharit
  'remote-karlyachi-bhaji',        // duplicate of karela-bhaji
  'remote-pomfret-tawa-fry',       // duplicate of pomfret-fry
  'remote-bangda-tawa-fry',        // duplicate of bangda-fry
  'remote-bombil-tawa-fry',        // duplicate of bombil-fry
  'remote-rawas-tawa-fry',         // duplicate of rawas-fry
  'remote-kanda-batata-poha',      // duplicate of batata-poha
  'remote-masur-amti',             // duplicate of masur-curry
]);

const before = data.foods.length;
data.foods = data.foods.filter(f => !duplicateIds.has(f.id));
const removed = before - data.foods.length;
console.log(`Removed ${removed} duplicate entries`);

// Verify all were found
if (removed !== duplicateIds.size) {
  console.warn(`WARNING: Expected to remove ${duplicateIds.size} but removed ${removed}`);
  const foundIds = new Set(data.foods.map(f => f.id));
  for (const id of duplicateIds) {
    if (foundIds.has(id)) {
      console.warn(`  Still present: ${id}`);
    }
  }
}

// Add new raw fruit entries
const rawFruits = [
  {
    "id": "remote-raw-mango",
    "name": "Raw Mango (Kairi)",
    "nameMarathi": "कैरी",
    "category": "fruits",
    "caloriesPerUnit": 50,
    "proteinPerUnit": 0.5,
    "fatPerUnit": 0.3,
    "fiberPerUnit": 1.8,
    "unit": "piece",
    "unitWeight": 100,
    "searchKeywords": [
      "kairi",
      "raw mango",
      "kachha aam",
      "green mango",
      "कैरी"
    ]
  },
  {
    "id": "remote-raw-banana",
    "name": "Raw Banana (Green / Cooking)",
    "nameMarathi": "कच्चे केळे",
    "category": "fruits",
    "caloriesPerUnit": 80,
    "proteinPerUnit": 1,
    "fatPerUnit": 0.3,
    "fiberPerUnit": 2.5,
    "unit": "piece",
    "unitWeight": 100,
    "searchKeywords": [
      "raw banana",
      "kachha kela",
      "green banana",
      "cooking banana",
      "कच्चे केळे"
    ]
  },
  {
    "id": "remote-raw-papaya",
    "name": "Raw Papaya (Green)",
    "nameMarathi": "कच्चा पपई",
    "category": "fruits",
    "caloriesPerUnit": 30,
    "proteinPerUnit": 0.5,
    "fatPerUnit": 0.1,
    "fiberPerUnit": 2,
    "unit": "bowl",
    "unitWeight": 100,
    "searchKeywords": [
      "raw papaya",
      "green papaya",
      "kachha papaya",
      "कच्चा पपई"
    ]
  },
  {
    "id": "remote-raw-jackfruit",
    "name": "Raw Jackfruit (Green)",
    "nameMarathi": "कच्चा फणस",
    "category": "fruits",
    "caloriesPerUnit": 55,
    "proteinPerUnit": 1,
    "fatPerUnit": 0.3,
    "fiberPerUnit": 2,
    "unit": "bowl",
    "unitWeight": 100,
    "searchKeywords": [
      "raw jackfruit",
      "green jackfruit",
      "kachha kathal",
      "कच्चा फणस"
    ]
  },
  {
    "id": "remote-ber",
    "name": "Ber (Indian Jujube)",
    "nameMarathi": "बोर",
    "category": "fruits",
    "caloriesPerUnit": 80,
    "proteinPerUnit": 1,
    "fatPerUnit": 0.2,
    "fiberPerUnit": 3,
    "unit": "bowl",
    "unitWeight": 100,
    "searchKeywords": [
      "ber",
      "bor",
      "jujube",
      "indian plum",
      "बोर"
    ]
  },
  {
    "id": "remote-starfruit",
    "name": "Star Fruit (Kamrak)",
    "nameMarathi": "कमरख",
    "category": "fruits",
    "caloriesPerUnit": 30,
    "proteinPerUnit": 1,
    "fatPerUnit": 0.3,
    "fiberPerUnit": 2.8,
    "unit": "piece",
    "unitWeight": 100,
    "searchKeywords": [
      "starfruit",
      "kamrak",
      "carambola",
      "कमरख"
    ]
  },
  {
    "id": "remote-tadgola",
    "name": "Tadgola (Ice Apple / Palm Fruit)",
    "nameMarathi": "ताडगोळा",
    "category": "fruits",
    "caloriesPerUnit": 40,
    "proteinPerUnit": 0.7,
    "fatPerUnit": 0.1,
    "fiberPerUnit": 1,
    "unit": "piece",
    "unitWeight": 50,
    "searchKeywords": [
      "tadgola",
      "ice apple",
      "palm fruit",
      "nungu",
      "ताडगोळा"
    ]
  },
  {
    "id": "remote-kiwi",
    "name": "Kiwi Fruit",
    "nameMarathi": "किवी",
    "category": "fruits",
    "caloriesPerUnit": 42,
    "proteinPerUnit": 0.8,
    "fatPerUnit": 0.4,
    "fiberPerUnit": 2.1,
    "unit": "piece",
    "unitWeight": 70,
    "searchKeywords": [
      "kiwi",
      "kiwifruit",
      "किवी"
    ]
  },
  {
    "id": "remote-plum",
    "name": "Plum (Aloo Bukhara)",
    "nameMarathi": "आलूबुखार",
    "category": "fruits",
    "caloriesPerUnit": 30,
    "proteinPerUnit": 0.5,
    "fatPerUnit": 0.2,
    "fiberPerUnit": 1,
    "unit": "piece",
    "unitWeight": 65,
    "searchKeywords": [
      "plum",
      "aloo bukhara",
      "alubukhara",
      "आलूबुखार"
    ]
  },
  {
    "id": "remote-dragonfruit",
    "name": "Dragon Fruit (Pitaya)",
    "nameMarathi": "ड्रॅगन फ्रूट",
    "category": "fruits",
    "caloriesPerUnit": 60,
    "proteinPerUnit": 1.2,
    "fatPerUnit": 0.4,
    "fiberPerUnit": 3,
    "unit": "piece",
    "unitWeight": 100,
    "searchKeywords": [
      "dragon fruit",
      "pitaya",
      "kamalam",
      "ड्रॅगन फ्रूट"
    ]
  },
  {
    "id": "remote-sitaphal",
    "name": "Sitaphal (Sugar Apple)",
    "nameMarathi": "सीताफळ",
    "category": "fruits",
    "caloriesPerUnit": 95,
    "proteinPerUnit": 1.6,
    "fatPerUnit": 0.3,
    "fiberPerUnit": 4.4,
    "unit": "piece",
    "unitWeight": 100,
    "searchKeywords": [
      "sitaphal",
      "sugar apple",
      "sharifa",
      "सीताफळ"
    ]
  },
  {
    "id": "remote-karonda",
    "name": "Karonda (Carissa)",
    "nameMarathi": "करवंद",
    "category": "fruits",
    "caloriesPerUnit": 60,
    "proteinPerUnit": 0.5,
    "fatPerUnit": 2,
    "fiberPerUnit": 3,
    "unit": "bowl",
    "unitWeight": 100,
    "searchKeywords": [
      "karonda",
      "karavanda",
      "carissa",
      "करवंद"
    ]
  },
  {
    "id": "remote-kairi-panna",
    "name": "Kairi Panna (Raw Mango Drink)",
    "nameMarathi": "कैरी पन्हा",
    "category": "beverages",
    "caloriesPerUnit": 90,
    "proteinPerUnit": 0.3,
    "fatPerUnit": 0.1,
    "fiberPerUnit": 0.5,
    "unit": "glass",
    "unitWeight": 200,
    "searchKeywords": [
      "kairi panna",
      "aam panna",
      "raw mango drink",
      "कैरी पन्हा"
    ]
  }
];

data.foods.push(...rawFruits);
console.log(`Added ${rawFruits.length} new fruit/beverage entries`);

// Bump version and update date
data.version = data.version + 1;
data.lastUpdated = "2026-05-17";

// Write back
fs.writeFileSync(remoteFoodsPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`Updated remote-foods.json: version ${data.version}, ${data.foods.length} total items`);
