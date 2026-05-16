---
description: "Navigation structure and screen registration. Use when: adding screens, modifying navigation, adding tabs, routing, deeplinks."
applyTo: "src/navigation/**"
---

# Navigation Structure

```
MainTabs (Bottom Tab Navigator)
├── Home → HomeStack (Native Stack)
│   ├── HomeMain → HomeScreen
│   └── AddFood → AddFoodScreen
├── History → HistoryScreen
├── Custom → CustomDishScreen
├── Health → HealthScreen
└── Settings → SettingsScreen
```

## Adding a new tab
1. Create screen in `src/screens/Name/NameScreen.tsx`
2. Export from `src/screens/index.ts`
3. Add `<Tab.Screen>` in `AppNavigator.tsx` with focused/outline icon pair

## Adding a stack screen under Home
Add `<HomeStack.Screen>` inside the `HomeStackNavigator`

## Tab bar
- Active color: `#FF7B00`, inactive: `#999999`
- Height: 56dp + safe area
- Icons: Ionicons (focused=solid, unfocused=outline) or MaterialCommunityIcons
