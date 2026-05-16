---
name: create-component
description: "Create new React Native UI components for the calorie tracker app. Use when: creating components, building reusable UI, adding new widgets, new cards, new modals, new form elements, new input components."
argument-hint: "Describe the component, e.g. 'create a meal plan card component'"
---

# Create React Native Component

## When to Use
- Building a new reusable UI component
- Creating modals, cards, form fields, list items

## File Structure

Every component needs exactly 2 files + 1 barrel update:

```
src/components/
├── MyComponent.tsx              # Component file
├── styles/
│   ├── myComponentStyles.ts     # Styles file
│   └── index.ts                 # UPDATE: add barrel export
└── index.ts                     # UPDATE: add barrel export
```

## Procedure

### 1. Create the Style File

**Path**: `src/components/styles/{camelCase}Styles.ts`

```typescript
import { StyleSheet } from 'react-native';
import { COLORS } from '../../common/colors';

export const styles = StyleSheet.create({
  container: {
    // ...
  },
});
```

**Rules:**
- Import colors from `COLORS` — never hardcode hex values
- Check `FONT_SIZE` from `src/common/typography.ts` before using font sizes
- Use `StyleSheet.create()` always

### 2. Create the Component File

**Path**: `src/components/{PascalCase}.tsx`

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles/myComponentStyles';

interface MyComponentProps {
  // typed props
}

export const MyComponent: React.FC<MyComponentProps> = ({ ... }) => {
  return (
    <View style={styles.container}>
      {/* content */}
    </View>
  );
};
```

**Rules:**
- TypeScript strict — define prop interface
- Export as named export (not default)
- Wrap callbacks in `useCallback`, derived data in `useMemo`
- Icons: use `@expo/vector-icons` (Ionicons or MaterialCommunityIcons)
- For modals: must have close (X) button at `position: absolute, top: 10, right: 10`

### 3. Update Barrel Exports

**`src/components/styles/index.ts`** — add:
```typescript
export { styles as myComponentStyles } from './myComponentStyles';
```

**`src/components/index.ts`** — add:
```typescript
export { MyComponent } from './MyComponent';
```

If the component exports types, export those too:
```typescript
export { MyComponent } from './MyComponent';
export type { MyComponentProps } from './MyComponent';
```

## Common Patterns

### Card Component
```typescript
container: {
  backgroundColor: COLORS.surface,
  borderRadius: 12,
  marginHorizontal: 16,
  marginBottom: 12,
  padding: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
},
```

### Modal Component
```typescript
// Must include close button
<TouchableOpacity
  style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}
  onPress={onClose}
>
  <Ionicons name="close" size={24} color="#666666" />
</TouchableOpacity>
```

### Form Input
Use existing `InputTextField` component for text/number inputs. Only create new if it has fundamentally different behavior.

## Context Access
- Settings: `useSettings()` from `../../context/SettingsContext`
- Foods: `useFood()` from `../../context/FoodContext`
- Logs: `useLog()` from `../../context/LogContext`

## Checklist
- [ ] Styles in separate file under `styles/`
- [ ] Colors from `COLORS`, font sizes from `FONT_SIZE`
- [ ] Named export (no default exports)
- [ ] Both barrel exports updated (`components/index.ts` + `styles/index.ts`)
- [ ] Callbacks wrapped in `useCallback`
- [ ] Modal has close (X) button
