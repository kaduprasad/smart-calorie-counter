import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CalorieSummary, FoodLogItem, QuantitySelector, WeightInput } from '../components';
import { formatDate, getTodayDate } from '../services/storage';
import { FoodLogEntry, FoodItem } from '../types';

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

  const isToday = selectedDate === getTodayDate();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
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
        />

        <WeightInput date={selectedDate} />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
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
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dateButton: {
    padding: 12,
  },
  dateButtonDisabled: {
    opacity: 0.3,
  },
  dateDisplay: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  tapTodayText: {
    fontSize: 12,
    color: '#FF7B00',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  logSection: {
    paddingTop: 16,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  itemCount: {
    fontSize: 14,
    color: '#666666',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 4,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF7B00',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF7B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
