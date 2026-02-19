# 🍽️ Smart Calorie Tracker - Maharashtrian Food & Exercise Counter

A comprehensive React Native app for tracking your daily calorie intake, exercise burn, and net calories with a focus on traditional Maharashtrian vegetarian cuisine.

## Features

### 📊 Smart Calorie Dashboard
- **Net Calorie Tracking**: View your net calories (Food Consumed - Exercise Burned)
- **Speedometer Gauge**: Visual semicircle gauge showing daily progress
- **Color-coded Status**: Blue (under 80%), Green (80-100%), Red (over goal)
- **Food & Exercise Cards**: Separate tracking with scale bars and target markers

### 🏃 Exercise Tracking
- **30+ Exercise Types**: Walking, Running, Cycling, Yoga, Swimming, and more
- **Intensity Levels**: Light, Moderate, Vigorous options for accurate calorie calculation
- **Duration-based Logging**: Track exercise by minutes with automatic calorie calculation
- **Exercise Goals**: Set and track daily exercise burn targets
- **Quick Add**: Fast exercise logging from the home screen

### 🍲 100+ Maharashtrian Food Items
Comprehensive database including:
- **Breads**: Chapati, Bhakri (Jowar, Bajra, Nachni), Thalipeeth, Puran Poli
- **Rice dishes**: Varan Bhat, Masale Bhat, Khichdi
- **Dal & Curries**: Amti, Matki Usal, Vatana Usal, Kadhi
- **Vegetables**: Various bhajis (Batata, Vangi, Bhendi, Methi, etc.)
- **Snacks**: Pohe, Misal, Vada Pav, Sabudana Khichdi
- **Sweets**: Modak, Shrikhand, Puran Poli
- And many more!

### 📈 Progress Tracking
- **Daily Summary**: Food consumed, calories burned, and net calories
- **Visual Scales**: Progress bars with target markers for food and exercise
- **History & Statistics**: Track your progress with weekly charts
- **Goal Management**: Set calorie intake and exercise burn goals

### ⚙️ Additional Features
- **Food Search & Categories**: Easily search and filter foods by category
- **Quantity Tracking**: Add foods with precise quantities (0.5, 1, 1.5, 2, 3, etc.)
- **Custom Dishes**: Create your own dishes with custom calorie counts
- **Daily Reminders**: Configurable notifications to remind you to log your meals

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
│   ├── CalorieSummary.tsx    # Dashboard with speedometer & cards
│   ├── SearchBar.tsx
│   └── CategoryFilter.tsx
├── context/           # React Context for state management
│   └── AppContext.tsx
├── data/              # Food & Exercise databases
│   ├── foods.ts       # Maharashtrian food items
│   └── exercises.ts   # Exercise types with calorie data
├── navigation/        # App navigation
│   └── AppNavigator.tsx
├── screens/           # App screens
│   ├── HomeScreen.tsx
│   ├── AddFoodScreen.tsx
│   ├── AddExerciseScreen.tsx  # Exercise logging
│   ├── HistoryScreen.tsx
│   ├── CustomDishScreen.tsx
│   └── SettingsScreen.tsx
├── screens/styles/    # Separated style files
│   ├── homeScreenStyles.ts
│   ├── addFoodScreenStyles.ts
│   ├── settingsScreenStyles.ts
│   ├── historyScreenStyles.ts
│   └── customDishScreenStyles.ts
├── services/          # Business logic
│   ├── storage.ts     # Async storage operations
│   └── notifications.ts
├── utils/             # Utility functions
│   └── utils.ts       # Date helpers
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

### Logging Exercise

1. Tap the **running icon** button on the home screen
2. Browse exercise categories or search
3. Select the exercise type
4. Choose the intensity level (Light/Moderate/Vigorous)
5. Enter the duration in minutes
6. Tap "Add Exercise" to log it

### Understanding the Dashboard

- **Speedometer Gauge**: Shows your net calories (consumed - burned)
  - Blue: Under 80% of goal
  - Green: 80-100% of goal  
  - Red: Over goal
- **Food Card**: Shows consumed calories with target marker at your calorie goal
- **Exercise Card**: Shows burned calories with target marker at your exercise goal

### Creating Custom Dishes

1. Go to the **Custom** tab
2. Tap "Create New Dish"
3. Enter the dish name, calories per unit, and unit type
4. Save your custom dish

### Setting Goals

1. Go to **Settings**
2. Set your daily calorie goal (default: 1600)
3. Set your daily exercise goal (default: 300 calories)
4. Configure notification reminders

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

### Adding More Exercises

Edit `src/data/exercises.ts` to add more exercise types:

```typescript
{
  id: 'new-exercise-id',
  name: 'Exercise Name',
  category: 'cardio',
  caloriesPerMinute: {
    light: 5,
    moderate: 8,
    vigorous: 12,
  },
  icon: 'fitness-outline',
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
  dailyCalorieGoal: 1600,
  dailyExerciseGoal: 300,
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
