import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Platform,
  Animated,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CalorieSummary, FoodLogItem, QuantitySelector, WeightInput, ExerciseInput } from '../components';
import type { ExerciseInputRef } from '../components';
import { formatDate, getTodayDate, getLocalDateString, getExerciseEntries } from '../services/storage';
import { FoodLogEntry, FoodItem } from '../types';
import { styles } from './styles/homeScreenStyles';
import { APP_NAME } from '../common/constants';

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
    macroTotals,
    macroTargets,
  } = useApp();

  const [editingEntry, setEditingEntry] = useState<FoodLogEntry | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [exerciseCalories, setExerciseCalories] = useState(0);
  const [fabOpen, setFabOpen] = useState(false);
  const fabAnim = useRef(new Animated.Value(0)).current;
  const exerciseRef = useRef<ExerciseInputRef>(null);

  const toggleFab = useCallback(() => {
    const toValue = fabOpen ? 0 : 1;
    Animated.spring(fabAnim, {
      toValue,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();
    setFabOpen(!fabOpen);
  }, [fabOpen, fabAnim]);

  const closeFab = useCallback(() => {
    if (fabOpen) {
      Animated.spring(fabAnim, {
        toValue: 0,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }).start();
      setFabOpen(false);
    }
  }, [fabOpen, fabAnim]);

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
    const current = new Date(selectedDate + 'T00:00:00'); // parse as local time
    current.setDate(current.getDate() + (direction === 'next' ? 1 : -1));
    const targetDate = getLocalDateString(current);

    if (targetDate <= getTodayDate()) {
      setSelectedDate(targetDate);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="food-apple" size={24} color="#FF7B00" />
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>{APP_NAME}</Text>
        </View>
        <Text style={styles.subtitle} numberOfLines={1} adjustsFontSizeToFit>Exercise & Food Calorie Tracker</Text>
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
          macroTotals={macroTotals}
          macroTargets={macroTargets}
        />

        <WeightInput date={selectedDate} />

        <ExerciseInput ref={exerciseRef} date={selectedDate} onExerciseSaved={loadExerciseCalories} />

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

      {/* FAB Overlay */}
      {fabOpen && (
        <TouchableOpacity
          style={styles.fabOverlay}
          activeOpacity={1}
          onPress={closeFab}
        />
      )}

      {/* Add Food mini-FAB */}
      <Animated.View
        style={[
          styles.miniFab,
          {
            transform: [
              { translateY: fabAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -130] }) },
              { scale: fabAnim },
            ],
            opacity: fabAnim,
          },
        ]}
        pointerEvents={fabOpen ? 'auto' : 'none'}
      >
        <TouchableOpacity
          style={styles.miniFabButton}
          onPress={() => {
            closeFab();
            navigation.navigate('AddFood');
          }}
        >
          <Ionicons name="restaurant" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Animated.Text style={[styles.miniFabLabel, { opacity: fabAnim }]}>Add Food</Animated.Text>
      </Animated.View>

      {/* Add Exercise mini-FAB */}
      <Animated.View
        style={[
          styles.miniFab,
          {
            transform: [
              { translateY: fabAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -70] }) },
              { scale: fabAnim },
            ],
            opacity: fabAnim,
          },
        ]}
        pointerEvents={fabOpen ? 'auto' : 'none'}
      >
        <TouchableOpacity
          style={[styles.miniFabButton, { backgroundColor: '#60A5FA' }]}
          onPress={() => {
            closeFab();
            exerciseRef.current?.openModal();
          }}
        >
          <MaterialCommunityIcons name="run-fast" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Animated.Text style={[styles.miniFabLabel, { opacity: fabAnim }]}>Exercise</Animated.Text>
      </Animated.View>

      {/* Main FAB */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={toggleFab}
        activeOpacity={0.8}
      >
        <Animated.View
          style={{
            transform: [{
              rotate: fabAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] }),
            }],
          }}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </Animated.View>
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
