import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CalorieSummary, FoodLogItem, QuantitySelector, WeightInput, ExerciseInput } from '../components';
import { formatDate, getTodayDate, getExerciseEntries } from '../services/storage';
import { FoodLogEntry, FoodItem } from '../types';
import { styles } from './styles/homeScreenStyles';

type RootStackParamList = {
  MainTabs: undefined;
  AddFood: undefined;
};

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    todayLog,
    settings,
    removeFood,
    updateQuantity,
    isLoading,
    refreshData,
    selectedDate,
    setSelectedDate,
  } = useApp();

  const [editingEntry, setEditingEntry] = useState<FoodLogEntry | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [exerciseCalories, setExerciseCalories] = useState(0);

  const isToday = selectedDate === getTodayDate();

  // Fetch exercise calories for the selected date
  const loadExerciseCalories = useCallback(async () => {
    const entries = await getExerciseEntries(selectedDate);
    const total = entries.reduce((sum, e) => sum + e.caloriesBurnt, 0);
    setExerciseCalories(total);
  }, [selectedDate]);

  useEffect(() => {
    loadExerciseCalories();
  }, [loadExerciseCalories]);

  // Reload exercise calories when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadExerciseCalories();
    }, [loadExerciseCalories])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    await loadExerciseCalories();
    setRefreshing(false);
  };

  const handleDeleteEntry = (entry: FoodLogEntry) => {
    if (Platform.OS === 'web') {
      // Use window.confirm for web
      const confirmed = window.confirm(`Remove ${entry.foodItem.name} from your log?`);
      if (confirmed) {
        removeFood(entry.id);
      }
    } else {
      // Use native Alert for mobile
      Alert.alert(
        'Remove Item',
        `Remove ${entry.foodItem.name} from your log?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => removeFood(entry.id),
          },
        ]
      );
    }
  };

  const handleUpdateQuantity = (quantity: number) => {
    if (editingEntry) {
      updateQuantity(editingEntry.id, quantity);
      setEditingEntry(null);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + (direction === 'next' ? 1 : -1));
    
    if (current <= new Date()) {
      setSelectedDate(current.toISOString().split('T')[0]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="food-apple" size={28} color="#FF7B00" />
          <Text style={styles.title}>Calorie Counter</Text>
        </View>
        <Text style={styles.subtitle}>Maharashtrian Food Tracker</Text>
      </View>

      <View style={styles.dateSelector}>
        <TouchableOpacity 
          style={styles.dateButton} 
          onPress={() => navigateDate('prev')}
        >
          <Ionicons name="chevron-back" size={24} color="#666666" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.dateDisplay}
          onPress={() => setSelectedDate(getTodayDate())}
        >
          <Text style={styles.dateText}>
            {isToday ? 'Today' : formatDate(selectedDate)}
          </Text>
          {!isToday && (
            <Text style={styles.tapTodayText}>Tap for Today</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.dateButton, !isToday ? {} : styles.dateButtonDisabled]}
          onPress={() => navigateDate('next')}
          disabled={isToday}
        >
          <Ionicons name="chevron-forward" size={24} color={isToday ? '#CCCCCC' : '#666666'} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <CalorieSummary
          consumed={todayLog?.totalCalories || 0}
          goal={settings.dailyCalorieGoal}
          exerciseBurnt={exerciseCalories}
          exerciseGoal={settings.exerciseCalorieGoal}
        />

        <WeightInput date={selectedDate} />

        <ExerciseInput date={selectedDate} onExerciseSaved={loadExerciseCalories} />

        <View style={styles.logSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {isToday ? "Today's Food Log" : 'Food Log'}
            </Text>
            <Text style={styles.itemCount}>
              {todayLog?.entries.length || 0} items
            </Text>
          </View>

          {(!todayLog || todayLog.entries.length === 0) ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="food-off" size={48} color="#CCCCCC" />
              <Text style={styles.emptyText}>No food logged yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the + button to add your meals
              </Text>
            </View>
          ) : (
            todayLog.entries.map((entry) => (
              <FoodLogItem
                key={entry.id}
                entry={entry}
                onEdit={() => setEditingEntry(entry)}
                onDelete={() => handleDeleteEntry(entry)}
              />
            ))
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddFood')}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>

      {editingEntry && (
        <QuantitySelector
          visible={true}
          food={editingEntry.foodItem}
          initialQuantity={editingEntry.quantity}
          onClose={() => setEditingEntry(null)}
          onConfirm={handleUpdateQuantity}
        />
      )}
    </SafeAreaView>
  );
};
