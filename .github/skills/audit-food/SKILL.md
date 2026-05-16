---
name: audit-food
description: "Audit and verify food calorie data against USDA references. Use when: verifying calories, checking food accuracy, auditing nutrition data, fixing calorie values, comparing against USDA, bulk calorie verification."
argument-hint: "Describe what to audit, e.g. 'audit all fruits against USDA' or 'verify paneer tikka calories'"
---

# Audit Food Calories

## When to Use
- User asks to verify/audit food calorie accuracy
- After bulk food additions to validate data
- When user questions a specific food's calorie value
- Periodic database quality checks

## Available Tools

### 1. Food Index (fast lookup — USE THIS FIRST)

**File:** `data/food-index.json`  
**Generate:** `node scripts/generate-food-index.js` (or `npm run index:foods`)

Compact index with `{id, name, cal, unit, wt, src}` for every food item (~1400 items, ~80KB vs ~500KB for full files). Load this instead of reading `foods.ts` or `remote-foods.json` when you need to:
- Check for duplicates before adding
- Get a calorie overview by category
- Find items to audit

### 2. USDA Nutrition Reference

**File:** `data/usda-nutrition.json`  
**Generate:** `npm run fetch:usda` (fetches from USDA FoodData Central API)

Contains per-100g nutrition data for ~150 items (fruits, vegetables, dairy, grains, nuts, desserts). Use this as ground truth for **raw ingredients and single-ingredient foods**.

**Single item lookup:**
```bash
npm run fetch:usda -- --query "chicken breast raw"
```

### 3. Automated Audit Script

**Run:** `node scripts/audit-food-calories.js` (or `npm run audit:calories`)

Options:
| Flag | Purpose |
|------|---------|
| `--threshold 10` | Flag items with >10% difference (default: 15%) |
| `--category fruits` | Audit only one category |
| `--fetch` | Fetch fresh USDA data before auditing |
| `--output report` | Save `data/audit-report.json` for review |

**Output:** Lists flagged items with app vs USDA cal/100g, difference %, and suggested corrected value.

### 4. Manage Foods Script

**Run:** `node scripts/manage-foods.js <command>`

| Command | Purpose |
|---------|---------|
| `stats` | Category counts, calorie ranges |
| `duplicates` | Find name-similar items across sources |
| `validate` | Check for missing fields, duplicate IDs |
| `search "term"` | Find items by name |

## Audit Procedure

### Quick Single-Item Verification
1. User asks: "Is paneer tikka really 260 cal?"
2. Check `data/food-index.json` for the item
3. If it has `unitWeight`, compute cal/100g: `(cal / unitWeight) * 100`
4. Look up in `data/usda-nutrition.json` or run `npm run fetch:usda -- --query "paneer"`
5. Compare. If >10% off, update the item

### Full Category Audit
1. Run: `node scripts/audit-food-calories.js --category fruits --output report`
2. Read `data/audit-report.json` — focus on `flaggedItems`
3. For each flagged item, decide:
   - **Raw ingredient** (fruit, veg, dairy) → trust USDA, update app value
   - **Cooked dish** (curry, biryani) → USDA won't have it, keep app value
   - **Branded item** (Lays, KFC) → check brand website, not USDA
4. Apply fixes to `foods.ts` or `remote-foods.json`
5. Regenerate index: `node scripts/generate-food-index.js`

### Bulk Audit (all items)
1. Ensure fresh USDA data: `npm run fetch:usda`
2. Run: `node scripts/audit-food-calories.js --threshold 15 --output report`
3. Review flagged items in `data/audit-report.json`
4. Fix items, then regenerate index

## Calorie Accuracy Rules

| Food Type | Reference Source | Reliability |
|-----------|-----------------|-------------|
| Raw fruits, vegetables | USDA FoodData Central | High — use as ground truth |
| Dairy (milk, paneer, ghee) | USDA | High |
| Nuts, seeds, dry fruits | USDA | High |
| Western desserts (cake, cookie) | USDA (prepared recipes) | Medium-High |
| Indian cooked dishes | CalorieNinjas API / IFCT | Medium — recipes vary |
| Street food, restaurant items | Estimated from ingredients | Low — keep as-is unless clearly wrong |
| Branded items (KFC, Dominos) | Brand nutrition labels | Use brand website |

## IMPORTANT: What NOT to Compare
- **Never compare cooked Indian dishes against raw USDA values.** A "Dal Fry" is NOT the same as raw lentils — it has oil, tempering, spices.
- **Regional recipes vary.** A Maharashtrian poha has different oil/peanut amounts than a Gujarati one.
- **Serving sizes matter.** Always normalize to cal/100g before comparing.

## After Fixing Items
1. Regenerate index: `node scripts/generate-food-index.js`
2. If remote-foods.json changed: bump `version`, update `lastUpdated`
3. Test search in app to verify the item still appears correctly
