---
name: create-screen
description: "Create new screens/pages for the calorie tracker app. Use when: adding new screens, new pages, new tabs, new views, creating a new feature screen."
argument-hint: "Describe the screen, e.g. 'create a meal planning screen'"
---

# Create New Screen

## When to Use
- Adding a new screen/page to the app
- Building a new feature that needs its own view

## File Structure

Each screen lives in its own folder:

```
src/screens/
├── MyFeature/
│   ├── MyFeatureScreen.tsx       # Main screen component
│   ├── SomeSection.tsx           # Optional: break large screens into sections
│   └── styles/
│       └── myFeatureScreenStyles.ts
```

## Procedure

### 1. Create the Style File

**Path**: `src/screens/MyFeature/styles/myFeatureScreenStyles.ts`

```typescript
import { StyleSheet } from 'react-native';
import { COLORS } from '../../../common/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,  // '#FAFAFA'
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
});
```

### 2. Create the Screen Component

**Path**: `src/screens/MyFeature/MyFeatureScreen.tsx`

```typescript
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/myFeatureScreenStyles';

export const MyFeatureScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="icon-name" size={28} color="#FF7B00" />
          <Text style={styles.title}>Screen Title</Text>
        </View>
        <Text style={styles.subtitle}>Screen description</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Content */}
      </ScrollView>
    </SafeAreaView>
  );
};
```

**Standard screen pattern:**
- `SafeAreaView` with `edges={['top']}` as root
- Header: icon + title row + subtitle
- `ScrollView` or `FlatList` for content

### 3. Update Barrel Export

**`src/screens/index.ts`** — add:
```typescript
export { MyFeatureScreen } from './MyFeature/MyFeatureScreen';
```

### 4. Add to Navigation

**`src/navigation/AppNavigator.tsx`**:

**If adding a new tab:**
```typescript
<Tab.Screen
  name="MyFeature"
  component={MyFeatureScreen}
  options={{
    tabBarLabel: 'Label',
    tabBarIcon: ({ focused, color }) => (
      <Ionicons name={focused ? 'icon' : 'icon-outline'} size={24} color={color} />
    ),
  }}
/>
```

**If adding a stack screen under an existing tab (e.g., Home):**
```typescript
<HomeStack.Screen name="MyFeature" component={MyFeatureScreen} />
```

### 5. For Sectioned Screens

Large screens (like SettingsScreen) should split into section components:

```
src/screens/MyFeature/
├── MyFeatureScreen.tsx     # Orchestrator — composes sections
├── SectionA.tsx            # Focused sub-section
├── SectionB.tsx
└── styles/
    └── myFeatureScreenStyles.ts  # Shared styles for all sections
```

Each section imports the shared styles file.

## Context Access
```typescript
import { useSettings } from '../../context/SettingsContext';
import { useFood } from '../../context/FoodContext';
import { useLog } from '../../context/LogContext';
```

## Screen Header Icon Colors
- Primary screens: `#FF7B00` (orange, brand color)
- Secondary/feature screens: `COLORS.purple` (#7C3AED)

## Checklist
- [ ] Folder structure: `screens/Name/NameScreen.tsx` + `styles/`
- [ ] `SafeAreaView` with `edges={['top']}`
- [ ] Header follows standard pattern (icon + title + subtitle)
- [ ] Styles in separate file, using `COLORS` and `FONT_SIZE`
- [ ] Barrel export updated in `src/screens/index.ts`
- [ ] Navigation registered in `AppNavigator.tsx`
- [ ] For major features: update `AboutSection.tsx` features list, `README.md`, and `copilot-instructions.md`
