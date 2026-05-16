---
description: "Food database schema and data conventions. Use when: editing food items, modifying foods.ts, modifying remote-foods.json, adding ingredients, updating calorie values."
applyTo: "src/data/foods.ts, data/remote-foods.json, src/data/ingredients.ts"
---

# Food Database Conventions

## Three food sources merged at runtime

`allFoods = [...maharashtrianFoods, ...remoteFoods, ...customFoods]`

## ID conventions

| Source                      | Prefix      | Example                  |
| --------------------------- | ----------- | ------------------------ |
| `src/data/foods.ts`         | none        | `"chapati"`              |
| `data/remote-foods.json`    | `"remote-"` | `"remote-cheese-toast"`  |
| User-created (AsyncStorage) | `"custom-"` | `"custom-1716844800000"` |

## Calorie values = per unit, NOT per 100g

- `caloriesPerUnit: 72` for 1 chapati (30g), not per 100g
- Exception: if `unit: "grams"`, then values ARE per gram

## Required for all items

- `id`, `name`, `category`, `caloriesPerUnit`, `unit`
- `searchKeywords`: 3-5 aliases (Hindi/Marathi/English variations, common misspellings)
- `nameMarathi`: Devanagari script for Indian dishes

## Categories (16)

breads | rice | dal | vegetables | snacks | chaat | nonveg | maincourse | sweets | beverages | dairy | fruits | chutneys | pickles | breakfast | custom

## remote-foods.json: bump `version` and `lastUpdated` on every edit
