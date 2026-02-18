import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FoodCategory, CategoryInfo } from '../types';

interface CategoryFilterProps {
  categories: CategoryInfo[];
  selectedCategory: FoodCategory | null;
  onSelectCategory: (category: FoodCategory | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scrollView}
    >
      <TouchableOpacity
        style={[
          styles.chip,
          selectedCategory === null && styles.chipActive,
        ]}
        onPress={() => onSelectCategory(null)}
      >
        <Text
          style={[
            styles.chipText,
            selectedCategory === null && styles.chipTextActive,
          ]}
        >
          All
        </Text>
      </TouchableOpacity>

      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.chip,
            selectedCategory === category.id && styles.chipActive,
          ]}
          onPress={() => onSelectCategory(category.id)}
        >
          <Text
            style={[
              styles.chipText,
              selectedCategory === category.id && styles.chipTextActive,
            ]}
          >
            {category.icon} {category.name.split(' ')[0]}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
  },
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    alignItems: 'flex-start',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 4,
    height: 36,
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: '#FF7B00',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666666',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});
