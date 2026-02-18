import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { WeightEntry } from '../types';
import { getWeightEntry, saveWeightEntry, getTodayDate } from '../services/storage';

interface WeightInputProps {
  date: string;
  onWeightSaved?: () => void;
}

export const WeightInput: React.FC<WeightInputProps> = ({ date, onWeightSaved }) => {
  const [todayWeight, setTodayWeight] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputWeight, setInputWeight] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTodayWeight();
  }, [date]);

  const loadTodayWeight = async () => {
    setIsLoading(true);
    const entry = await getWeightEntry(date);
    if (entry) {
      setTodayWeight(entry.weight);
      setInputWeight(entry.weight.toString());
    } else {
      setTodayWeight(null);
      setInputWeight('');
    }
    setIsLoading(false);
  };

  const handleSaveWeight = async () => {
    const weight = parseFloat(inputWeight);
    if (isNaN(weight) || weight <= 0 || weight > 500) {
      return;
    }

    const entry: WeightEntry = {
      date,
      weight,
      timestamp: Date.now(),
    };

    await saveWeightEntry(entry);
    setTodayWeight(weight);
    setIsModalVisible(false);
    onWeightSaved?.();
  };

  const isToday = date === getTodayDate();

  if (isLoading) {
    return null;
  }

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          setInputWeight(todayWeight?.toString() || '');
          setIsModalVisible(true);
        }}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="scale-bathroom" size={24} color="#FF7B00" />
        </View>
        <View style={styles.content}>
          <Text style={styles.label}>
            {isToday ? "Today's Weight" : 'Weight'}
          </Text>
          <Text style={styles.value}>
            {todayWeight ? `${todayWeight} kg` : 'Tap to add'}
          </Text>
        </View>
        <View style={styles.editButton}>
          {todayWeight ? (
            <Ionicons name="pencil" size={18} color="#FF7B00" />
          ) : (
            <Ionicons name="add" size={22} color="#FF7B00" />
          )}
        </View>
      </TouchableOpacity>

      {/* Weight Input Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsModalVisible(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>
              {isToday ? "Enter Today's Weight" : `Weight for ${date}`}
            </Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={inputWeight}
                onChangeText={setInputWeight}
                keyboardType="decimal-pad"
                placeholder="70.5"
                placeholderTextColor="#AAAAAA"
                autoFocus
              />
              <Text style={styles.inputUnit}>kg</Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (!inputWeight || parseFloat(inputWeight) <= 0) && styles.saveButtonDisabled,
                ]}
                onPress={handleSaveWeight}
                disabled={!inputWeight || parseFloat(inputWeight) <= 0}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  label: {
    fontSize: 12,
    color: '#888888',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 2,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FF7B00',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  input: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
    paddingVertical: 12,
    textAlign: 'center',
    minWidth: 100,
  },
  inputUnit: {
    fontSize: 18,
    color: '#888888',
    marginLeft: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FF7B00',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
