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
  compact?: boolean;
}

/**
 * A save button that morphs into an animated checkmark on success,
 * then fades back to the button after a short delay.
 * Compact mode: small icon button with bounce + glow animation.
 */
export const AnimatedSaveButton: React.FC<AnimatedSaveButtonProps> = ({
  onSave,
  label = 'Save',
  color = '#FF7B00',
  style,
  compact = false,
}) => {
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const labelOpacity = useRef(new Animated.Value(1)).current;
  const bgColor = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);

  const handlePress = useCallback(async () => {
    if (isAnimating.current) return;

    const success = await onSave();
    if (!success) return;

    isAnimating.current = true;

    if (compact) {
      // Compact: press-down → bounce up → morph green → checkmark pop → glow pulse → reverse
      Animated.sequence([
        // Press down
        Animated.timing(btnScale, {
          toValue: 0.8,
          duration: 80,
          useNativeDriver: false,
        }),
        // Bounce up + morph to green
        Animated.parallel([
          Animated.spring(btnScale, {
            toValue: 1.1,
            friction: 4,
            tension: 200,
            useNativeDriver: false,
          }),
          Animated.timing(labelOpacity, {
            toValue: 0,
            duration: 120,
            useNativeDriver: false,
          }),
          Animated.timing(bgColor, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }),
        ]),
        // Settle + show checkmark
        Animated.parallel([
          Animated.spring(btnScale, {
            toValue: 1,
            friction: 5,
            tension: 120,
            useNativeDriver: false,
          }),
          Animated.timing(checkOpacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: false,
          }),
          Animated.spring(checkScale, {
            toValue: 1,
            friction: 3,
            tension: 180,
            useNativeDriver: false,
          }),
          // Glow pulse
          Animated.sequence([
            Animated.timing(glowOpacity, {
              toValue: 0.6,
              duration: 200,
              useNativeDriver: false,
            }),
            Animated.timing(glowOpacity, {
              toValue: 0,
              duration: 400,
              useNativeDriver: false,
            }),
          ]),
        ]),
      ]).start(() => {
        // Hold, then reverse
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(checkOpacity, { toValue: 0, duration: 200, useNativeDriver: false }),
            Animated.timing(checkScale, { toValue: 0, duration: 200, useNativeDriver: false }),
            Animated.timing(bgColor, { toValue: 0, duration: 300, useNativeDriver: false }),
          ]).start(() => {
            Animated.timing(labelOpacity, { toValue: 1, duration: 200, useNativeDriver: false })
              .start(() => { isAnimating.current = false; });
          });
        }, 1200);
      });
    } else {
      // Full-size: existing animation
      Animated.parallel([
        Animated.timing(labelOpacity, { toValue: 0, duration: 150, useNativeDriver: false }),
        Animated.timing(bgColor, { toValue: 1, duration: 250, useNativeDriver: false }),
      ]).start(() => {
        Animated.parallel([
          Animated.timing(checkScale, { toValue: 1, duration: 300, easing: Easing.out(Easing.back(1.4)), useNativeDriver: false }),
          Animated.timing(checkOpacity, { toValue: 1, duration: 150, useNativeDriver: false }),
        ]).start(() => {
          setTimeout(() => {
            Animated.parallel([
              Animated.timing(checkOpacity, { toValue: 0, duration: 200, useNativeDriver: false }),
              Animated.timing(checkScale, { toValue: 0, duration: 200, useNativeDriver: false }),
              Animated.timing(bgColor, { toValue: 0, duration: 300, useNativeDriver: false }),
            ]).start(() => {
              Animated.timing(labelOpacity, { toValue: 1, duration: 200, useNativeDriver: false })
                .start(() => { isAnimating.current = false; });
            });
          }, 1000);
        });
      });
    }
  }, [onSave, compact, labelOpacity, bgColor, checkScale, checkOpacity, btnScale, glowOpacity]);

  const animatedBg = bgColor.interpolate({
    inputRange: [0, 1],
    outputRange: [color, '#4CAF50'],
  });

  const glowBg = bgColor.interpolate({
    inputRange: [0, 1],
    outputRange: [`${color}40`, '#4CAF5060'],
  });

  if (compact) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
        <Animated.View style={[localStyles.compactWrapper, { transform: [{ scale: btnScale }] }]}>
          {/* Glow ring */}
          <Animated.View
            style={[
              localStyles.glowRing,
              { backgroundColor: glowBg, opacity: glowOpacity },
            ]}
          />
          <Animated.View
            style={[
              localStyles.compactButton,
              style,
              { backgroundColor: animatedBg },
            ]}
          >
            {/* Text label */}
            <Animated.Text style={[localStyles.compactLabel, { opacity: labelOpacity }]}>
              {label}
            </Animated.Text>
            {/* Checkmark overlay */}
            <Animated.View
              style={[
                localStyles.checkContainer,
                { opacity: checkOpacity, transform: [{ scale: checkScale }] },
              ]}
            >
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
      <Animated.View
        style={[
          localStyles.button,
          style,
          { backgroundColor: animatedBg },
        ]}
      >
        <Animated.Text
          style={[localStyles.label, { opacity: labelOpacity }]}
        >
          {label}
        </Animated.Text>
        <Animated.View
          style={[
            localStyles.checkContainer,
            { opacity: checkOpacity, transform: [{ scale: checkScale }] },
          ]}
        >
          <Ionicons name="checkmark" size={26} color="#FFFFFF" />
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
  compactWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: '120%',
    height: '140%',
    borderRadius: 10,
  },
  compactButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 30,
  },
  compactLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
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
