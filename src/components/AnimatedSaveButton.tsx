import React, { useRef, useCallback } from 'react';
import {
  Animated,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AnimatedSaveButtonProps {
  onSave: () => Promise<boolean> | boolean;
  label?: string;
  color?: string;
  style?: ViewStyle;
}

/**
 * A save button that morphs into an animated checkmark on success,
 * then fades back to the button after a short delay.
 */
export const AnimatedSaveButton: React.FC<AnimatedSaveButtonProps> = ({
  onSave,
  label = 'Save',
  color = '#FF7B00',
  style,
}) => {
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const labelOpacity = useRef(new Animated.Value(1)).current;
  const bgColor = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);

  const handlePress = useCallback(async () => {
    if (isAnimating.current) return;

    const success = await onSave();
    if (!success) return;

    isAnimating.current = true;

    // Phase 1: fade out label, morph to green, show checkmark
    Animated.parallel([
      Animated.timing(labelOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(bgColor, {
        toValue: 1,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Phase 2: pop-in checkmark
      Animated.parallel([
        Animated.timing(checkScale, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.back(1.4)),
          useNativeDriver: false,
        }),
        Animated.timing(checkOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start(() => {
        // Hold for a moment, then reverse
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(checkOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: false,
            }),
            Animated.timing(checkScale, {
              toValue: 0,
              duration: 200,
              useNativeDriver: false,
            }),
            Animated.timing(bgColor, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }),
          ]).start(() => {
            Animated.timing(labelOpacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: false,
            }).start(() => {
              isAnimating.current = false;
            });
          });
        }, 1000);
      });
    });
  }, [onSave, labelOpacity, bgColor, checkScale, checkOpacity]);

  const animatedBg = bgColor.interpolate({
    inputRange: [0, 1],
    outputRange: [color, '#4CAF50'],
  });

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
      <Animated.View
        style={[
          localStyles.button,
          style,
          { backgroundColor: animatedBg },
        ]}
      >
        {/* Label text */}
        <Animated.Text style={[localStyles.label, { opacity: labelOpacity }]}>
          {label}
        </Animated.Text>

        {/* Checkmark overlay */}
        <Animated.View
          style={[
            localStyles.checkContainer,
            {
              opacity: checkOpacity,
              transform: [{ scale: checkScale }],
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={26} color="#FFFFFF" />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const localStyles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 40,
    position: 'relative',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  checkContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
