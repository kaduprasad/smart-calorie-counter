# 🍽️ Maharashtrian Calorie Counter

A React Native app for tracking your daily calorie intake with a focus on traditional Maharashtrian vegetarian cuisine.

## Features

- **100+ Maharashtrian Food Items**: Comprehensive database including:
  - Breads: Chapati, Bhakri (Jowar, Bajra, Nachni), Thalipeeth, Puran Poli
  - Rice dishes: Varan Bhat, Masale Bhat, Khichdi
  - Dal & Curries: Amti, Matki Usal, Vatana Usal, Kadhi
  - Vegetables: Various bhajis (Batata, Vangi, Bhendi, Methi, etc.)
  - Snacks: Pohe, Misal, Vada Pav, Sabudana Khichdi
  - Sweets: Modak, Shrikhand, Puran Poli
  - And many more!

- **Food Search & Categories**: Easily search and filter foods by category

- **Quantity Tracking**: Add foods with precise quantities (0.5, 1, 1.5, 2, 3, etc.)

- **Daily Calorie Tracking**: View your daily intake and remaining calories

- **History & Statistics**: Track your progress with weekly charts and historical data

- **Custom Dishes**: Create your own dishes with custom calorie counts

- **Daily Reminders**: Configurable notifications to remind you to log your meals (default: 10 PM)

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Expo Go app on your mobile device (for testing)

### Installation

1. Navigate to the project directory:
   ```bash
   cd smart-calorie-counter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Scan the QR code with Expo Go (Android) or Camera app (iOS)

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── FoodCard.tsx
│   ├── FoodLogItem.tsx
│   ├── QuantitySelector.tsx
│   ├── CalorieSummary.tsx
│   ├── SearchBar.tsx
│   └── CategoryFilter.tsx
├── context/           # React Context for state management
│   └── AppContext.tsx
├── data/              # Food database
│   └── foods.ts
├── navigation/        # App navigation
│   └── AppNavigator.tsx
├── screens/           # App screens
│   ├── HomeScreen.tsx
│   ├── AddFoodScreen.tsx
│   ├── HistoryScreen.tsx
│   ├── CustomDishScreen.tsx
│   └── SettingsScreen.tsx
├── services/          # Business logic
│   ├── storage.ts     # Async storage operations
│   └── notifications.ts
└── types/             # TypeScript types
    └── index.ts
```

## Usage

### Adding Food

1. Tap the **+** button on the home screen
2. Search for a food item or browse categories
3. Select the food item
4. Choose the quantity
5. Tap "Add" to log it

### Creating Custom Dishes

1. Go to the **Custom** tab
2. Tap "Create New Dish"
3. Enter the dish name, calories per unit, and unit type
4. Save your custom dish

### Setting Daily Reminder

1. Go to **Settings**
2. Enable notifications
3. Set your preferred reminder time (e.g., 10:00 PM)
4. Save the time

### Viewing History

1. Go to the **History** tab
2. View weekly calorie chart
3. See your daily averages and statistics
4. Tap on a day to view details

## Customization

### Adding More Food Items

Edit `src/data/foods.ts` to add more food items to the database:

```typescript
{
  id: 'new-food-id',
  name: 'Food Name',
  nameMarathi: 'मराठी नाव',
  category: 'vegetables',
  caloriesPerUnit: 100,
  unit: 'serving',
  unitWeight: 100, // grams
}
```

### Changing Default Settings

Edit `src/services/storage.ts` to modify default settings:

```typescript
const DEFAULT_SETTINGS: AppSettings = {
  notificationEnabled: true,
  notificationTime: {
    hour: 22,  // 10 PM
    minute: 0,
  },
  dailyCalorieGoal: 2000,
};
```

## Building for Production

### Android

```bash
npx expo build:android
# or
eas build --platform android
```

### iOS

```bash
npx expo build:ios
# or
eas build --platform ios
```

## Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **React Navigation** for navigation
- **AsyncStorage** for local data persistence
- **Expo Notifications** for daily reminders

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to add more Maharashtrian food items or improve the app.

---

Made with ❤️ for Maharashtrian food lovers
