import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  FlatList,
  Animated,
  Easing,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { FoodIndex, searchFoods } from '../data/foodIndex';
import { parseVoiceInput, ParsedFoodEntry } from '../utils/foodVoiceParser';
import { getUnitLabel } from '../data/foods';
import { SelectedFood } from './FoodSelectionCart';
import { FoodItem } from '../types';
import { APP_LOCALE, VOICE_SEARCH_RESULT_LIMIT } from '../common/constants';

interface VoiceInputModalProps {
  visible: boolean;
  onClose: () => void;
  foodIndex: FoodIndex;
  onAddFoods: (foods: SelectedFood[]) => void;
}

export const VoiceInputModal: React.FC<VoiceInputModalProps> = ({
  visible,
  onClose,
  foodIndex,
  onAddFoods,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [manualText, setManualText] = useState('');
  const [parsedEntries, setParsedEntries] = useState<ParsedFoodEntry[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Mic pulse animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  // Request mic permission
  const requestPermission = useCallback(async () => {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    setHasPermission(result.granted);
    return result.granted;
  }, []);

  // Check permission on mount
  useEffect(() => {
    if (visible) {
      ExpoSpeechRecognitionModule.getPermissionsAsync().then((result) => {
        setHasPermission(result.granted);
      });
    }
  }, [visible]);

  // Speech recognition event handlers
  useSpeechRecognitionEvent('result', (event) => {
    const text = event.results[0]?.transcript ?? '';
    setTranscript(text);
    if (event.isFinal) {
      setManualText(text);
      handleParse(text);
      setIsListening(false);
      stopPulse();
    }
  });

  useSpeechRecognitionEvent('end', () => {
    setIsListening(false);
    stopPulse();
  });

  useSpeechRecognitionEvent('error', (event) => {
    setIsListening(false);
    stopPulse();
    if (event.error !== 'no-speech') {
      Alert.alert('Speech Error', event.message || 'Could not recognize speech. Try again.');
    }
  });

  const startPulse = () => {
    pulseLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulseLoop.current.start();
  };

  const stopPulse = () => {
    pulseLoop.current?.stop();
    pulseAnim.setValue(1);
  };

  const startListening = async () => {
    let granted = hasPermission;
    if (!granted) {
      granted = await requestPermission();
      if (!granted) {
        Alert.alert('Permission Required', 'Microphone permission is needed for voice input.');
        return;
      }
    }

    setTranscript('');
    setIsListening(true);
    startPulse();

    ExpoSpeechRecognitionModule.start({
      lang: APP_LOCALE,
      interimResults: true,
      continuous: false,
    });
  };

  const stopListening = () => {
    ExpoSpeechRecognitionModule.stop();
    setIsListening(false);
    stopPulse();
  };

  const handleParse = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      const newEntries = parseVoiceInput(text, foodIndex);
      // Append to existing entries so repeated mic presses accumulate
      setParsedEntries((prev) => [...prev, ...newEntries]);
    },
    [foodIndex],
  );

  const handleManualParse = () => {
    handleParse(manualText);
    setManualText('');
  };

  // Live search results as user types
  const searchResults = useMemo(() => {
    const q = manualText.trim();
    if (q.length < 2) return [];
    // If input looks like bulk voice input (has commas or numbers at start), skip search
    if (/,/.test(q) || /^\d/.test(q)) return [];
    return searchFoods(foodIndex, q, null).slice(0, VOICE_SEARCH_RESULT_LIMIT);
  }, [manualText, foodIndex]);

  const handleAddFromSearch = (food: FoodItem) => {
    setParsedEntries((prev) => [
      ...prev,
      { rawText: food.name, quantity: 1, foodName: food.name, matchedFood: food, gramsRequested: null },
    ]);
    setManualText('');
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    setParsedEntries((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, quantity: newQty } : entry)),
    );
  };

  const handleRemoveEntry = (index: number) => {
    setParsedEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddAll = () => {
    const matched = parsedEntries.filter((e) => e.matchedFood != null);
    if (matched.length === 0) {
      Alert.alert('No Matches', 'No foods were matched. Try rephrasing.');
      return;
    }
    const foods: SelectedFood[] = matched.map((e) => ({
      food: e.matchedFood!,
      quantity: e.quantity,
    }));
    onAddFoods(foods);
    handleClose();
  };

  const handleClose = () => {
    setIsListening(false);
    setTranscript('');
    setManualText('');
    setParsedEntries([]);
    stopPulse();
    if (isListening) {
      ExpoSpeechRecognitionModule.abort();
    }
    onClose();
  };

  const matchedCount = parsedEntries.filter((e) => e.matchedFood != null).length;
  const totalCalories = parsedEntries.reduce(
    (sum, e) => sum + (e.matchedFood ? e.matchedFood.caloriesPerUnit * e.quantity : 0),
    0,
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={s.container}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={handleClose} style={s.closeBtn}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={s.title}>Voice Input</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Mic Area */}
        <View style={s.micArea}>
          <Text style={s.hint}>
            {isListening
              ? 'Listening... speak your foods'
              : 'Tap the mic and say your foods'}
          </Text>
          <Text style={s.example}>e.g. "2 chapati, 1 bowl rice, 1 banana"</Text>

          <Animated.View style={[s.micRing, { transform: [{ scale: pulseAnim }] }]}>
            <TouchableOpacity
              style={[s.micBtn, isListening && s.micBtnActive]}
              onPress={isListening ? stopListening : startListening}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isListening ? 'stop' : 'mic'}
                size={36}
                color="#FFF"
              />
            </TouchableOpacity>
          </Animated.View>

          {transcript ? (
            <View style={s.transcriptBox}>
              <Text style={s.transcriptLabel}>Heard:</Text>
              <Text style={s.transcriptText}>{transcript}</Text>
            </View>
          ) : null}
        </View>

        {/* Manual text input fallback */}
        <View style={s.manualRow}>
          <TextInput
            style={s.manualInput}
            value={manualText}
            onChangeText={setManualText}
            placeholder="Or type: 2 chapati, 1 dal, 1 banana"
            placeholderTextColor="#AAA"
            returnKeyType="done"
            onSubmitEditing={handleManualParse}
          />
          {manualText.length > 0 && (
            <TouchableOpacity
              style={s.clearInputBtn}
              onPress={() => setManualText('')}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={s.parseBtn} onPress={handleManualParse}>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Live search suggestions */}
        {searchResults.length > 0 && (
          <View style={s.searchDropdown}>
            {searchResults.map((food) => (
              <TouchableOpacity
                key={food.id}
                style={s.searchItem}
                onPress={() => handleAddFromSearch(food)}
              >
                <View style={s.searchItemInfo}>
                  <Text style={s.searchItemName} numberOfLines={1}>{food.name}</Text>
                  <Text style={s.searchItemMeta}>
                    {food.caloriesPerUnit} cal/{getUnitLabel(food.unit, 1)}
                    {food.unitWeight ? `  ·  ${food.unitWeight}g/${getUnitLabel(food.unit, 1)}` : ''}
                  </Text>
                </View>
                <Ionicons name="add-circle" size={22} color="#4CAF50" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Parsed Results */}
        {parsedEntries.length > 0 && (
          <View style={s.resultsArea}>
            <View style={s.resultHeader}>
              <Text style={s.resultTitle}>
                Matched {matchedCount}/{parsedEntries.length} items
              </Text>
              <Text style={s.resultCal}>{Math.round(totalCalories)} cal</Text>
            </View>

            <FlatList
              data={parsedEntries}
              keyExtractor={(_, i) => `parsed-${i}`}
              renderItem={({ item, index }) => (
                <View
                  style={[s.resultRow, !item.matchedFood && s.resultRowUnmatched]}
                >
                  <View style={s.resultInfo}>
                    {item.matchedFood ? (
                      <>
                        <Text style={s.resultName}>{item.matchedFood.name}</Text>
                        <Text style={s.resultMeta}>
                          {item.matchedFood.caloriesPerUnit} cal/
                          {getUnitLabel(item.matchedFood.unit, 1)}
                          {item.matchedFood.unitWeight
                            ? `  ·  ${item.matchedFood.unitWeight}g/${getUnitLabel(item.matchedFood.unit, 1)}`
                            : ''}
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text style={s.resultNameMiss}>"{item.foodName}"</Text>
                        <Text style={s.resultMeta}>Not found in database</Text>
                      </>
                    )}
                  </View>

                  {/* Quantity stepper */}
                  <View style={s.qtyRow}>
                    <TouchableOpacity
                      style={s.qtyBtn}
                      onPress={() =>
                        handleUpdateQuantity(index, Math.max(0.5, item.quantity - 0.5))
                      }
                    >
                      <Text style={s.qtyBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={s.qtyValue}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={s.qtyBtn}
                      onPress={() => handleUpdateQuantity(index, item.quantity + 0.5)}
                    >
                      <Text style={s.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={s.removeBtn}
                    onPress={() => handleRemoveEntry(index)}
                  >
                    <Ionicons name="close-circle" size={20} color="#FF4444" />
                  </TouchableOpacity>
                </View>
              )}
              style={s.resultList}
            />

            <View style={s.bottomRow}>
              <TouchableOpacity
                style={s.clearAllBtn}
                onPress={() => setParsedEntries([])}
              >
                <Ionicons name="trash-outline" size={16} color="#FF4444" />
                <Text style={s.clearAllText}>Clear All</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.addAllBtn, matchedCount === 0 && s.addAllBtnDisabled]}
                onPress={handleAddAll}
                disabled={matchedCount === 0}
              >
                <Ionicons name="checkmark-circle" size={22} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={s.addAllText}>
                  Add {matchedCount} {matchedCount === 1 ? 'Item' : 'Items'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

// ── Styles ──────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingTop: Platform.OS === 'android' ? 40 : 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  closeBtn: { padding: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },

  // Mic area
  micArea: { alignItems: 'center', paddingVertical: 20 },
  hint: { fontSize: 15, color: '#555', marginBottom: 4 },
  example: { fontSize: 13, color: '#999', marginBottom: 18 },
  micRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,123,0,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FF7B00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtnActive: { backgroundColor: '#E53935' },

  // Transcript
  transcriptBox: {
    marginTop: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  transcriptLabel: { fontSize: 12, color: '#888', marginBottom: 2 },
  transcriptText: { fontSize: 16, color: '#333', fontWeight: '500', textAlign: 'center' },

  // Manual text input
  manualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  manualInput: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  clearInputBtn: {
    padding: 6,
    marginLeft: 4,
  },
  parseBtn: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF7B00',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Results
  resultsArea: { flex: 1, paddingHorizontal: 16, marginTop: 4 },

  // Live search dropdown
  searchDropdown: {
    marginHorizontal: 16,
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    marginBottom: 8,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
  },
  searchItemInfo: { flex: 1 },
  searchItemName: { fontSize: 14, fontWeight: '600', color: '#333' },
  searchItemMeta: { fontSize: 11, color: '#888', marginTop: 1 },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultTitle: { fontSize: 15, fontWeight: '600', color: '#333' },
  resultCal: { fontSize: 15, fontWeight: '700', color: '#FF7B00' },
  resultList: { flex: 1 },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  resultRowUnmatched: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FFCCCC',
  },
  resultInfo: { flex: 1 },
  resultName: { fontSize: 15, fontWeight: '600', color: '#333' },
  resultNameMiss: { fontSize: 15, fontWeight: '600', color: '#CC4444' },
  resultMeta: { fontSize: 12, color: '#888', marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginRight: 8 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: { fontSize: 16, fontWeight: '700', color: '#555' },
  qtyValue: { fontSize: 15, fontWeight: '700', color: '#333', minWidth: 28, textAlign: 'center' },
  removeBtn: { padding: 4 },

  // Bottom row: Clear All (1/3) + Add Items (2/3)
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    gap: 10,
  },
  clearAllBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FF4444',
    paddingVertical: 14,
  },
  clearAllText: { fontSize: 14, color: '#FF4444', marginLeft: 4, fontWeight: '700' },
  addAllBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 14,
  },
  addAllBtnDisabled: { backgroundColor: '#CCC' },
  addAllText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
});
