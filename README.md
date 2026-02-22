# 🍽️ Smart Calorie Tracker - Indian Food & Exercise Counter

A comprehensive React Native app for tracking daily calorie intake, exercise burn, and net calories with a focus on Indian cuisine including Maharashtrian, Konkani, Vidarbha, and North Indian dishes.

## Features

### 📊 Smart Calorie Dashboard
- **Net Calorie Tracking**: View net calories (Food Consumed - Exercise Burned)
- **Speedometer Gauge**: Visual semicircle gauge showing daily progress
- **Color-coded Status**: Blue (under 80%), Green (80-100%), Red (over goal)
- **Food & Exercise Cards**: Separate tracking with scale bars and target markers

### 🧮 BMR & TDEE Calculator
- **Personalized Goals**: Enter height, weight, age, and gender
- **Activity Levels**: Sedentary, Light, Moderate, Active, Very Active
- **Mifflin-St Jeor Formula**: Accurate BMR calculation
- **TDEE Display**: See your daily calorie needs based on activity

### 🏃 Exercise Tracking
- **30+ Exercise Types**: Walking, Running, Cycling, Yoga, Swimming, and more
- **Intensity Levels**: Light, Moderate, Vigorous options
- **Duration-based Logging**: Track by minutes with automatic calorie calculation
- **Exercise Goals**: Set and track daily burn targets

### 🍲 330+ Indian Food Items
Comprehensive database across 15 categories:

**Traditional Maharashtrian**: Pohe, Misal, Vada Pav, Thalipeeth, Puran Poli, Modak, Shrikhand

**Street Food**: Samosa, Pani Puri, Sev Puri, Dahi Vada, Ragda Pattice, Dabeli, Bhel Puri

**North Indian Main Course**: Dal Makhani, Paneer Butter Masala, Naan varieties, Chole Bhature

### ⚙️ Additional Features
- **Smart Search**: Search by name, Marathi name, or keywords
- **15 Categories**: Breads, Rice, Dal, Vegetables, Snacks, Chaat, Non-Veg, Main Course, Sweets, Beverages, Dairy, Fruits, Chutneys, Pickles, Custom
- **Quantity Tracking**: Precise quantities (0.5, 1, 1.5, 2, 3, etc.)
- **Custom Dishes**: Create your own dishes with custom calorie counts
- **Daily Reminders**: Configurable meal logging notifications

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
│   ├── UserInfoSection.tsx   # BMR/TDEE calculator with user profile
│   ├── SearchBar.tsx
│   └── CategoryFilter.tsx
├── context/           # React Context for state management
│   └── AppContext.tsx
├── data/              # Food & Exercise databases
│   ├── foods.ts       # 330+ Indian food items with regional cuisines
│   └── exercises.ts   # Exercise types with calorie data
├── navigation/        # App navigation
│   └── AppNavigator.tsx
├── screens/           # App screens
│   ├── HomeScreen.tsx
│   ├── AddFoodScreen.tsx
│   ├── AddExerciseScreen.tsx
│   ├── HistoryScreen.tsx
│   ├── CustomDishScreen.tsx
│   └── SettingsScreen.tsx
├── screens/styles/    # Separated style files
├── services/          # Business logic
│   ├── storage.ts
│   └── notifications.ts
├── utils/             # Utility functions
└── types/             # TypeScript types
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
2. Enter your profile (gender, age, height, weight)
3. Select your activity level for TDEE calculation
4. Set daily calorie and exercise goals
5. Configure notification reminders

### Viewing History

1. Go to the **History** tab
2. View weekly calorie chart
3. See daily averages and statistics

## Customization

### Adding Food Items

Edit `src/data/foods.ts` - available categories: `breads`, `rice`, `dal`, `vegetables`, `snacks`, `chaat`, `nonveg`, `maincourse`, `sweets`, `beverages`, `dairy`, `fruits`, `chutneys`, `pickles`, `custom`

```typescript
{
  id: 'new-food-id',
  name: 'Food Name',
  nameMarathi: 'मराठी नाव',
  category: 'nonveg', // or any category above
  caloriesPerUnit: 100,
  unit: 'serving',
  unitWeight: 100,
  searchKeywords: ['alternate', 'names'],
}
```

## Tech Stack

- **React Native** with **Expo SDK 54**
- **TypeScript** for type safety
- **React Navigation** for navigation
- **AsyncStorage** for local data persistence
- **Expo Notifications** for daily reminders

## License

MIT License

---

Made with ❤️ for Indian food lovers
