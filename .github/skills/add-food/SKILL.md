---
name: add-food
description: "Add new food items to the calorie tracker database. Use when: adding foods, adding dishes, adding meals, adding recipes to foods.ts or remote-foods.json, bulk food entry, food database updates."
argument-hint: "Describe the food(s) to add, e.g. 'add paneer butter masala and dal makhani'"
---

# Add Food Items

## When to Use
- User asks to add new food items to the database
- Bulk food additions
- Fixing/updating existing food entries

## Decision: Where to Add

| Scenario | File | ID Prefix |
|----------|------|-----------|
| Permanent staple food (ships with app) | `src/data/foods.ts` → `maharashtrianFoods` array | none (e.g. `"paneer-tikka"`) |
| Dynamic addition (no app update needed) | `data/remote-foods.json` → `foods` array | `"remote-"` (e.g. `"remote-paneer-tikka"`) |

## Pre-flight: Duplicate Check

**Always search both files before adding:**
```
grep for the food name (case-insensitive) in:
1. src/data/foods.ts
2. data/remote-foods.json
```
If a match exists, confirm with user before proceeding.

## Food Item Schema

```typescript
{
  id: string;               // kebab-case slug, unique across all sources
  name: string;             // English display name
  nameMarathi?: string;     // Marathi in Devanagari (e.g. "पनीर टिक्का")
  category: FoodCategory;   // see categories below
  caloriesPerUnit: number;  // calories for 1 unit (NOT per 100g unless unit=grams)
  proteinPerUnit?: number;  // grams protein per unit
  fatPerUnit?: number;      // grams fat per unit
  fiberPerUnit?: number;    // grams fiber per unit
  unit: FoodUnit;           // serving measurement
  unitWeight?: number;      // grams per 1 unit
  searchKeywords?: string[];// 3-5 Hindi/Marathi/English aliases
}
```

## Categories (16 total)
`breads | rice | dal | vegetables | snacks | chaat | nonveg | maincourse | sweets | beverages | dairy | fruits | chutneys | pickles | breakfast | custom`

## Units
`piece | cup | bowl | plate | glass | tablespoon | teaspoon | grams | ml | serving | slice | packet | scoop`

## Procedure

### Adding to `src/data/foods.ts`
1. Open `src/data/foods.ts`
2. Find the correct category section (items are grouped by category)
3. Add the new item to the `maharashtrianFoods` array
4. Ensure `id` is unique kebab-case, no prefix
5. Add `searchKeywords` with 3-5 aliases

### Adding to `data/remote-foods.json`
1. Open `data/remote-foods.json`
2. Add item to the `foods` array
3. **ID must start with `"remote-"`**
4. Bump `"version"` number by 1
5. Update `"lastUpdated"` to today's date (YYYY-MM-DD)
6. Validate JSON is valid after edit

## Example: Adding to foods.ts

```typescript
{
  id: 'paneer-butter-masala',
  name: 'Paneer Butter Masala',
  nameMarathi: 'पनीर बटर मसाला',
  category: 'maincourse',
  caloriesPerUnit: 330,
  proteinPerUnit: 14,
  fatPerUnit: 22,
  fiberPerUnit: 2,
  unit: 'bowl',
  unitWeight: 200,
  searchKeywords: ['paneer makhani', 'butter paneer', 'panir', 'पनीर'],
},
```

## Example: Adding to remote-foods.json

```json
{
  "id": "remote-paneer-butter-masala",
  "name": "Paneer Butter Masala",
  "nameMarathi": "पनीर बटर मसाला",
  "category": "maincourse",
  "caloriesPerUnit": 330,
  "proteinPerUnit": 14,
  "fatPerUnit": 22,
  "fiberPerUnit": 2,
  "unit": "bowl",
  "unitWeight": 200,
  "searchKeywords": ["paneer makhani", "butter paneer", "panir"]
}
```

## Calorie Guidelines
- Values should be **realistic per-serving**, not per 100g (unless unit is `grams`)
- 1 chapati ≈ 70-80 cal, 1 bowl dal ≈ 150-180 cal, 1 bowl rice ≈ 180-220 cal
- When uncertain, search USDA FoodData Central or CalorieNinjas for reference
- For cooked dishes, account for oil/ghee (1 tbsp oil ≈ 120 cal)

## Post-addition Checklist
- [ ] No duplicate IDs across foods.ts + remote-foods.json
- [ ] `nameMarathi` is in Devanagari script
- [ ] `searchKeywords` has 3-5 variations (Hindi, Marathi, English, common misspellings)
- [ ] Calorie values are per-unit (not per 100g)
- [ ] JSON is valid (for remote-foods.json)
- [ ] Regenerate food index: `npm run index:foods`
- [ ] Update `src/screens/Settings/AboutSection.tsx` — food count in features list (currently "1030+ Indian & international food items" and "370+ remote food database")
- [ ] Update `README.md` — food count if mentioned in features section
