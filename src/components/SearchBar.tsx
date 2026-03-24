import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  autoFocus?: boolean;
  onMicPress?: () => void;
  /** Show an inline "Search Online" button (globe icon) */
  onSearchOnline?: () => void;
  /** Whether online search is in progress */
  isSearchingOnline?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search foods...',
  onClear,
  autoFocus = false,
  onMicPress,
  onSearchOnline,
  isSearchingOnline,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchIcon}>
        <Ionicons name="search" size={18} color="#999999" />
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999999"
        autoFocus={autoFocus}
      />
      {value.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => {
            onChangeText('');
            onClear?.();
          }}
        >
          <Ionicons name="close-circle" size={20} color="#999999" />
        </TouchableOpacity>
      )}
      {onSearchOnline && (
        <TouchableOpacity
          style={styles.onlineSearchButton}
          onPress={onSearchOnline}
          disabled={isSearchingOnline}
        >
          {isSearchingOnline ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="globe-outline" size={18} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      )}
      {onMicPress && (
        <TouchableOpacity style={styles.micButton} onPress={onMicPress}>
          <Ionicons name="mic" size={22} color="#FF7B00" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 4,
    fontSize: 16,
    color: '#1A1A1A',
  },
  clearButton: {
    padding: 8,
  },
  onlineSearchButton: {
    backgroundColor: '#FF7B00',
    borderRadius: 8,
    padding: 6,
    marginLeft: 4,
  },
  micButton: {
    padding: 8,
  },
});
