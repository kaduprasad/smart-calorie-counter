# Smart Calorie Tracker — Project Guidelines

## Overview

React Native (Expo SDK 54) calorie counter app focused on Indian cuisine — Maharashtrian, Konkani, South & North Indian, and regional dishes. TypeScript strict mode. No backend — all data is local via AsyncStorage.

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
│   ├── colors.ts    # COLORS object — single source of truth for all colors
│   ├── constants.ts # ALL app-wide constants (see "Constants" below)
│   ├── index.ts     # Barrel exports
│   └── ProgressScale.tsx
├── components/      # Reusable UI components
│   ├── FormField.tsx      # Label wrapper with optional required asterisk
│   ├── InputTextField.tsx  # Combined label + TextInput (like MUI TextField)
│   ├── RecipeBuilder.tsx   # Full-screen modal to build dishes from ingredients
│   ├── styles/      # Component-specific StyleSheet files
│   └── index.ts     # Barrel exports
├── context/         # React Context (AppContext — single global store)
├── data/            # Static food/exercise/ingredient databases
│   ├── foods.ts     # ~1020+ static food items (Maharashtrian focus)
│   ├── foodIndex.ts # Lazy-built indexes with phonetic/Hinglish search
│   ├── ingredients.ts # 120+ cooking ingredients with per-100g nutrition
│   └── exercises.ts # Exercise types + MET values
├── navigation/      # AppNavigator (tab + stack)
├── screens/         # Screen components
│   └── styles/      # Screen-specific StyleSheet files
├── services/        # Data layer (storage, search, notifications)
│   ├── storage.ts          # AsyncStorage CRUD for logs, settings, etc.
│   ├── foodSearch.ts       # Online search (USDA, Open Food Facts, CalorieNinjas)
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
.env                   # API keys (gitignored — see "Environment Variables")
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
- API URLs (`OPEN_FOOD_FACTS_API_URL`, `CALORIE_NINJAS_API_URL`, `USDA_FOOD_DATA_API_URL`, `REMOTE_FOODS_URL`)
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

- **Readability:** Add a helper function into helper file for complex logic don't burden a single file.
- **Reusability and modularity:** Components and hooks should be reusable and modular. Avoid duplicating logic.
- **Styles:** Always in separate `styles/` folders — `screens/styles/` and `components/styles/`. Use `StyleSheet.create()`.
- **Exports:** Barrel exports via `index.ts` in `components/`, `screens/`, `common/`.
- **State:** Single `AppContext` provides all global state. No Redux/Zustand.
- **Callbacks:** Wrap in `useCallback`. Derived data in `useMemo`.
- **Pagination:** `FlatList` with progressive loading (`onEndReached`). Page size from `FOOD_LIST_PAGE_SIZE`.
- **Type safety:** TypeScript strict mode. Fix all narrowing issues — don't use `as` casts to bypass.
- **No over-engineering:** Don't add abstractions for single-use patterns.
- **Post-feature updates:** After completing a major feature, update these three places:
  1. `README.md` — add the feature to the relevant Features section
  2. `src/screens/SettingsScreen.tsx` — add a feature row in the About → Smart Calorie Tracker features list
  3. This file (`copilot-instructions.md`) — document the pattern/convention if it introduces one

## Key Patterns

### Inline Unit Toggle
The BMI Calculator height toggle (cm/ft) and Exercise Duration toggle (min/hr) use inline toggles inside the input row — not separate label rows. Both share the same visual pattern: `unitSelector` container with `unitBtn` + `unitBtnActive` styles.

### Food Selection
AddFoodScreen uses multi-select with a `FoodSelectionCart`.

### Voice Input
`VoiceInputModal` uses `expo-speech-recognition` with `en-IN` locale. Parsed via `foodVoiceParser.ts` which matches spoken food names to the food index.

### Theme and Colors
All colors live in `src/common/colors.ts` as the `COLORS` object — the single source of truth.
- **Never hardcode hex colors** in `.tsx` files or `StyleSheet.create()`. Import `COLORS` and use named keys.
- When a new color is needed, add it to `COLORS` with a descriptive name (e.g., `femaleDark`, `successBorder`), then reference it.
- Groupings: Primary (orange), Secondary (purple), Gender/Profile (blue/pink), Semantic, Text, Backgrounds, Borders.

### Recipe Builder
`RecipeBuilder` is a full-screen modal (purple `#7C3AED` theme) that lets users build custom dishes from 120+ raw cooking ingredients (`src/data/ingredients.ts`).

### Form Components
- `InputTextField` — Combined label + TextInput with required asterisk, error text, numeric mode, focus highlight. Use for all text/number input fields.

## Online Food Search

`src/services/foodSearch.ts` combines three external APIs in priority order:
1. **USDA FoodData Central** (priority) — Official US government nutrition DB. Free API key, detailed macros (protein, fat, fiber, carbs). Foundation + SR Legacy datasets.
2. **CalorieNinjas** — Best for Indian food names (understands "chapati", "dal", etc.). Free tier 3K req/month.

## Environment Variables
API keys live in `.env` (gitignored).
For EAS builds, store keys as EAS Secrets (`eas secret:create`).

## CI/CD

GitHub Actions workflow at `.github/workflows/eas-preview.yml`:
- **Manual trigger** (`workflow_dispatch`) from Actions tab with dropdowns for build profile (preview/development/production) and platform (android/ios/all)
- Requires `EXPO_TOKEN` GitHub secret for EAS CLI authentication
- Uses `expo/expo-github-action@v8` for Expo/EAS CLI setup