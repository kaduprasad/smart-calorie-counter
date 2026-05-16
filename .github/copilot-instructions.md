# Smart Calorie Tracker — Project Guidelines

## Overview

React Native (Expo SDK 54) calorie counter app focused on Indian cuisine — Maharashtrian, Konkani, South & North Indian, and regional dishes. TypeScript strict mode. No backend — all data is local via AsyncStorage + expo-sqlite.

## Tech Stack

- **Framework:** React Native 0.81 + Expo ~54 + TypeScript 5.9 (strict)
- **Navigation:** React Navigation 7 (bottom tabs + native stack)
- **Storage:** `@react-native-async-storage/async-storage` + `expo-sqlite` (native)
- **Charts:** `react-native-chart-kit` + `react-native-svg`
- **Voice:** `expo-speech-recognition` (locale: `en-IN`)
- **Notifications:** `expo-notifications`
- **Icons:** `@expo/vector-icons` (Ionicons, MaterialCommunityIcons)

## Skills & Instructions (loaded on-demand)

Detailed procedures live in separate files to reduce context overhead:

| Task | File |
|------|------|
| Adding food items | `.github/skills/add-food/SKILL.md` |
| Creating components | `.github/skills/create-component/SKILL.md` |
| Creating screens | `.github/skills/create-screen/SKILL.md` |
| Style conventions | `.github/instructions/styles.instructions.md` |
| Context/state | `.github/instructions/context.instructions.md` |
| Food data schema | `.github/instructions/food-data.instructions.md` |
| Navigation | `.github/instructions/navigation.instructions.md` |

## Project Structure

```
src/
├── common/          # colors.ts, constants.ts, typography.ts, index.ts
├── components/      # Reusable UI + styles/ subfolder + index.ts barrel
├── context/         # SettingsContext → FoodContext → LogContext → AppContext
├── data/            # foods.ts (~1020), ingredients.ts (~120), exercises.ts (9 types)
├── navigation/      # AppNavigator (bottom tabs + home stack)
├── screens/         # Each in own folder: Screen/ScreenName.tsx + styles/
├── services/        # storage, foodSearch, remoteFoodService, exerciseService, etc.
├── types/           # Single index.ts with all type definitions
└── utils/           # Date formatting, macro calculations, voice parsing
data/
├── remote-foods.json  # Dynamic food DB (~290 items, fetched from GitHub)
├── app-config.json    # Version check config (fetched from GitHub)
└── usda-nutrition.json
```

## Core Rules (always apply)

### Styles
- **Separate files**: `styles/` subfolder for every component and screen
- **Colors**: `COLORS` from `src/common/colors.ts` — never hardcode hex values
- **Font sizes**: `FONT_SIZE` from `src/common/typography.ts` — check scale before adding
- **Always** `StyleSheet.create()`

### Constants
All config lives in `src/common/constants.ts`: STORAGE_KEYS, VALIDATION ranges, defaults, API URLs, pagination limits. **Never hardcode these values.**

### State
- Split contexts: `useSettings()`, `useFood()`, `useLog()` — never use `useApp()` in new code
- Wrap callbacks in `useCallback`, derived data in `useMemo`
- No Redux/Zustand

### Exports
- Barrel exports via `index.ts` in `components/`, `screens/`, `common/`
- Named exports only (no default exports)

### TypeScript
- Strict mode. Fix narrowing issues properly — no `as` casts to bypass.

### Mobile-First
- Design for 360–430dp width. Use `flex: 1`, percentage widths, or `maxWidth`
- Test row layouts mentally against ~370dp

### Modals
Every `<Modal>` must have a visible close (X) button: `<Ionicons name="close" />` at `position: absolute, top: 10, right: 10`

### Lists
- `FlatList` with `onEndReached` pagination. Page size: `FOOD_LIST_PAGE_SIZE` constant.

## Food Database (quick reference)

Three sources merged: `allFoods = [...maharashtrianFoods, ...remoteFoods, ...customFoods]`
- Static: `src/data/foods.ts` — IDs with no prefix
- Remote: `data/remote-foods.json` — IDs prefixed `"remote-"`
- Custom: AsyncStorage — IDs prefixed `"custom-"`
- Calories are **per unit** (not per 100g)
- See `add-food` skill for detailed procedure

## Search System

`src/data/foodIndex.ts` — lazy-built indexes with phonetic normalization:
- Vowel doubling collapsed (`aa→a`, `ee→i`, `oo→u`)
- Aspirated consonants simplified (`bh→b`, `dh→d`, `kh→k`, `th→t`)
- Two-pass: exact substring → phonetic fuzzy. Multi-word AND matching.

## Calorie Audit (USDA)

```bash
npm run fetch:usda                     # All categories
npm run fetch:usda -- --query "name"   # Single item lookup
```
Output: `data/usda-nutrition.json`. Only update items where difference >10%. Never compare cooked dishes against raw USDA values.

## Online Food Search

`src/services/foodSearch.ts` — three APIs in priority order:
1. **USDA FoodData Central** — best for raw foods, detailed macros
2. **CalorieNinjas** — best for Indian dishes (chapati, dal, etc.)

## Environment Variables
API keys in `.env` (gitignored). EAS builds use EAS Secrets.

## CI/CD
`.github/workflows/eas-preview.yml` — manual trigger, EAS build + submit.

## Post-Feature Checklist
After completing a major feature, update:
1. `README.md` — Features section
2. `src/screens/Settings/AboutSection.tsx` — features list
3. This file — if new pattern/convention introduced