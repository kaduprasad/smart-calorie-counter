import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Floating icons configuration - 7 fruits with different colors
const FLOATING_ICONS = [
  { name: 'fruit-cherries', color: '#E91E63', angle: 0 },
  { name: 'fruit-watermelon', color: '#4CAF50', angle: 51.4 },
  { name: 'fruit-grapes', color: '#9C27B0', angle: 102.8 },
  { name: 'fruit-pineapple', color: '#FFC107', angle: 154.2 },
  { name: 'food-apple', color: '#FF5722', angle: 205.7 },
  { name: 'carrot', color: '#FF9800', angle: 257.1 },
  { name: 'corn', color: '#FFEB3B', angle: 308.5 },
];

export const SplashScreen: React.FC = () => {
  const [dots, setDots] = useState('');
  
  // Animation values
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  
  // Floating icons animation - move outwards
  const floatProgress = useRef(new Animated.Value(0)).current;

  // Spinning animation for the outer ring
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Pulse animation for the icon
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Floating icons moving outwards animation
  useEffect(() => {
    Animated.timing(floatProgress, {
      toValue: 1,
      duration: 1500,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    }).start();
  }, []);

  // Animated dots
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);

    return () => clearInterval(dotsInterval);
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Calculate icon positions based on angle
  const getIconTransform = (angle: number, index: number) => {
    const radians = (angle * Math.PI) / 180;
    const radius = Math.min(width, height) * 0.38; // Distance from center
    const targetX = Math.cos(radians) * radius;
    const targetY = Math.sin(radians) * radius;

    const translateX = floatProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, targetX],
    });

    const translateY = floatProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, targetY],
    });

    const scale = floatProgress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.8, 1],
    });

    const opacity = floatProgress.interpolate({
      inputRange: [0, 0.3, 1],
      outputRange: [0, 1, 1],
    });

    return {
      transform: [{ translateX }, { translateY }, { scale }],
      opacity,
    };
  };

  return (
    <View style={styles.container}>
      {/* Background decorative circle */}
      <Animatable.View
        animation="pulse"
        iterationCount="infinite"
        duration={3000}
        style={styles.bgCircle}
      />

      {/* Floating food icons - moving outwards from center */}
      {FLOATING_ICONS.map((icon, index) => (
        <Animated.View
          key={icon.name}
          style={[
            styles.floatingIcon,
            getIconTransform(icon.angle, index),
          ]}
        >
          <MaterialCommunityIcons name={icon.name as any} size={24} color={icon.color} />
        </Animated.View>
      ))}

      {/* Main logo area */}
      <View style={styles.logoContainer}>
        {/* Spinning outer ring */}
        <Animated.View style={[styles.spinningRing, { transform: [{ rotate: spin }] }]}>
          <View style={styles.ringSegment1} />
          <View style={styles.ringSegment2} />
        </Animated.View>

        {/* Pulsing icon */}
        <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseValue }] }]}>
          <MaterialCommunityIcons name="food-apple" size={50} color="#FFFFFF" />
        </Animated.View>
      </View>

      {/* App name - positioned below the floating icons */}
      <Text style={styles.appName}>Smart Calorie Tracker</Text>

      {/* Loading section at bottom */}
      <View style={styles.loadingSection}>
        <Text style={styles.loadingText}>Loading{dots}</Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgCircle: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(38, 198, 218, 0.08)',
  },
  logoContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  spinningRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringSegment1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#26C6DA',
    borderRightColor: '#4DD0E1',
  },
  ringSegment2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'transparent',
    borderBottomColor: '#80DEEA',
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#26C6DA',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00ACC1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    position: 'absolute',
    bottom: 180,
  },
  loadingSection: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 15,
    color: '#666666',
    fontWeight: '500',
    marginBottom: 12,
    width: 100,
    textAlign: 'center',
  },
  progressBarContainer: {
    width: width * 0.5,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    width: '100%',
    backgroundColor: '#26C6DA',
    borderRadius: 2,
  },
  floatingIcon: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
