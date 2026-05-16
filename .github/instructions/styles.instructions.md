---
description: "Style conventions for React Native StyleSheet files. Use when: creating styles, editing styles, fixing UI, layout issues."
applyTo: "**/*Styles.ts"
---

# Style Conventions

- Use `StyleSheet.create()` — never inline styles
- Import colors: `import { COLORS } from '../../common/colors'` (or `../../../common/colors` from screen styles)
- Import font sizes: `import { FONT_SIZE } from '../../common/typography'` — check existing scale before inventing sizes
- Never hardcode hex colors — use `COLORS.xxx` keys
- Container backgrounds: `COLORS.background` (#FAFAFA) for screens, `COLORS.surface` (#FFFFFF) for cards
- Card pattern: `borderRadius: 12`, `elevation: 2`, `shadowOpacity: 0.1`
- Standard horizontal padding: 16
- Mobile-first: test row layouts mentally against ~370dp width. Avoid too many fixed-width elements in a row.
