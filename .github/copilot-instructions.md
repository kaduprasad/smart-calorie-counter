# Smart Calorie Tracker — Project Guidelines

## Overview

React Native (Expo SDK 54) calorie counter app focused on Indian cuisine — Maharashtrian, Konkani, South Indian, North Indian, and regional dishes. TypeScript strict mode. No backend — all data is local via AsyncStorage.

## Tech Stack

- **Framework:** React Native 0.81 + Expo ~54 + TypeScript 5.9 (strict)
- **Navigation:** React Navigation 7 (bottom tabs + native stack)
- **Storage:** `@react-native-async-storage/async-storage` (no backend/API)
- **Charts:** `react-native-chart-kit` + `react-native-svg`
- **Voice:** `expo-speech-recognition` (locale: `en-IN`)
- **Notifications:** `expo-notifications`
- **Icons:** `@expo/vector-icons` (Ionicons, MaterialCommunityIcons)

## Project Structure

```
src/
├── common/          # Shared utilities & centralized constants
│   ├── constants.ts # ALL app-wide constants (see "Constants" below)
│   ├── index.ts     # Barrel exports
│   └── ProgressScale.tsx
├── components/      # Reusable UI components
│   ├── styles/      # Component-specific StyleSheet files
│   └── index.ts     # Barrel exports
├── context/         # React Context (AppContext — single global store)
├── data/            # Static food/exercise databases
│   ├── foods.ts     # ~1020+ static food items (Maharashtrian focus)
│   ├── foodIndex.ts # Lazy-built indexes with phonetic/Hinglish search
│   └── exercises.ts # Exercise types + MET values
├── navigation/      # AppNavigator (tab + stack)
├── screens/         # Screen components
│   └── styles/      # Screen-specific StyleSheet files
├── services/        # Data layer (storage, search, notifications)
│   ├── storage.ts          # AsyncStorage CRUD for logs, settings, etc.
│   ├── foodSearch.ts       # Online search (Open Food Facts, CalorieNinjas)
│   ├── remoteFoodService.ts # Fetches remote-foods.json from GitHub
│   ├── userDataService.ts  # User profile + BMI calculations
│   ├── exerciseService.ts  # Calorie burn calculations
│   └── notifications.ts    # Expo push notifications
├── types/           # TypeScript type definitions (single index.ts)
└── utils/           # Pure utility functions
    ├── utils.ts         # Date formatting
    ├── macroTargets.ts  # Macro calculation from user data
    └── foodVoiceParser.ts # Voice-to-food parsing
data/
└── remote-foods.json  # Dynamic food database (~290 items, fetched at runtime)
```

## Food Database Architecture

Two food sources combined at runtime in `AppContext`:
1. **`src/data/foods.ts`** — Static, shipped with app (~1020+ items). The primary database.
2. **`data/remote-foods.json`** — Fetched from GitHub, cached locally (~290 items). Used for additions without app updates.
3. **Custom foods** — User-created, stored in AsyncStorage.

All three are merged: `allFoods = [...maharashtrianFoods, ...remoteFoods, ...customFoods]`

### Food Item Schema

```typescript
interface FoodItem {
  id: string;               // Unique slug (e.g., "remote-appe", "chapati")
  name: string;             // English display name
  nameMarathi?: string;     // Marathi/Devanagari name
  category: FoodCategory;   // One of 16 categories
  caloriesPerUnit: number;
  proteinPerUnit?: number;
  fatPerUnit?: number;
  fiberPerUnit?: number;
  unit: FoodUnit;           // "piece", "bowl", "plate", "cup", etc.
  unitWeight?: number;      // Grams per unit
  searchKeywords?: string[]; // Hindi/Marathi/English aliases for search
}
```

### Categories
`breads | rice | dal | vegetables | snacks | chaat | nonveg | maincourse | sweets | beverages | dairy | fruits | chutneys | pickles | breakfast | custom`

### Adding Foods to remote-foods.json

- Always check both `foods.ts` AND `remote-foods.json` for duplicates before adding
- Use `"remote-"` prefix for IDs in remote-foods.json
- Include `nameMarathi` in Devanagari script
- Include 3-5 `searchKeywords` covering Hindi, Marathi, and English variations
- Calorie/macro values should be realistic per-serving (not per 100g unless the unit is grams)
- File must remain valid JSON — validate after edits

## Constants

All configuration constants live in `src/common/constants.ts`. This includes:
- App identity (`APP_NAME`, `APP_LOCALE`)
- API URLs (`OPEN_FOOD_FACTS_API_URL`, `CALORIE_NINJAS_API_URL`, `REMOTE_FOODS_URL`)
- Storage keys (`STORAGE_KEYS` — single source of truth for all AsyncStorage keys)
- Default settings (`DEFAULT_SETTINGS`, `DEFAULT_CALORIE_GOAL`, etc.)
- Macro/nutrition science (`CALORIES_PER_GRAM_FAT`, `PROTEIN_MULTIPLIERS`, etc.)
- Validation ranges (`VALIDATION.AGE`, `VALIDATION.HEIGHT_CM`, `VALIDATION.WEIGHT_KG`, etc.)
- BMI thresholds (`BMI.UNDERWEIGHT`, `BMI.OVERWEIGHT`, `BMI.OBESE`, etc.)
- Pagination/limits (`FOOD_LIST_PAGE_SIZE`, `RECENT_FOODS_LIMIT`, etc.)
- Network config (`REMOTE_FOODS_FETCH_TIMEOUT_MS`)
- Notification config (`NOTIFICATION_CHANNEL_ID`, `NOTIFICATION_CHANNEL_NAME`)

**Never hardcode these values in components/services. Import from `../common/constants`.**

## Search System

`src/data/foodIndex.ts` builds lazy indexes with phonetic normalization for Hinglish search:
- Vowel doubling collapsed (`aa→a`, `ee→i`, `oo→u`)
- Aspirated consonants simplified (`bh→b`, `dh→d`, `kh→k`, `th→t`)
- `sh→s`, `ph→f` (shev↔sev, phulka↔fulka)
- Two-pass: exact substring match first, then phonetic fuzzy match
- Multi-word AND matching (all terms must appear)

## Code Conventions

- **Styles:** Always in separate `styles/` folders — `screens/styles/` and `components/styles/`. Use `StyleSheet.create()`.
- **Exports:** Barrel exports via `index.ts` in `components/`, `screens/`, `common/`.
- **State:** Single `AppContext` provides all global state. No Redux/Zustand.
- **Callbacks:** Wrap in `useCallback`. Derived data in `useMemo`.
- **Pagination:** `FlatList` with progressive loading (`onEndReached`). Page size from `FOOD_LIST_PAGE_SIZE`.
- **Type safety:** TypeScript strict mode. Fix all narrowing issues — don't use `as` casts to bypass.
- **No over-engineering:** Don't add abstractions for single-use patterns.

## Key Patterns

### Inline Unit Toggle
The BMI Calculator height toggle (cm/ft) and Exercise Duration toggle (min/hr) use inline toggles inside the input row — not separate label rows. Both share the same visual pattern: `unitSelector` container with `unitBtn` + `unitBtnActive` styles.

### Food Selection
AddFoodScreen uses multi-select with a `FoodSelectionCart` — users pick multiple items, adjust quantities, then add all at once. Quick-add buttons (1, 1.5, 2, 2.5) appear on eligible items (breads, rice).

### Voice Input
`VoiceInputModal` uses `expo-speech-recognition` with `en-IN` locale. Parsed via `foodVoiceParser.ts` which matches spoken food names to the food index.

### Theme and Colors
For color scheme refer these standard color codes from this file `src/common/colors.ts` and whenever new color is added add that color in the `COLORS` object with meaningful readable names in `src/common/colors.ts` and use that color from the COLORS object instead of hardcoding it in the stylesheets or tsx files.