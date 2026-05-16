---
description: "Context and state management patterns for the calorie tracker. Use when: adding state, accessing data, using context, working with providers, managing food data, log data, or settings."
applyTo: "src/context/**"
---

# Context & State Management

## Architecture
Providers nest in order (inner depends on outer):
`SettingsProvider → FoodProvider → LogProvider → AppOrchestrator`

## Hooks
| Hook | Import | Key State |
|------|--------|-----------|
| `useSettings()` | `../../context/SettingsContext` | `settings`, `macroTargets`, `gender`, `updateSettings()` |
| `useFood()` | `../../context/FoodContext` | `allFoods`, `foodIndex`, `customFoods`, `recentFoods`, `pinnedFoodIds` |
| `useLog()` | `../../context/LogContext` | `todayLog`, `allLogs`, `selectedDate`, `macroTotals`, `addFood()`, `removeFood()` |

## Rules
- Never use `useApp()` in new code — use specific hooks above
- Wrap callbacks in `useCallback`, derived state in `useMemo`
- Cross-context communication: via `AppOrchestrator` callbacks only (e.g., `refreshRecentFoods` on food add)
- No Redux/Zustand — stick to Context
- New persistent state needs a `STORAGE_KEYS` entry in `src/common/constants.ts`
