import React, { useRef, useEffect } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

type IconLibrary = 'ionicons' | 'material-community' | 'fontawesome5' | 'material';

interface AnimatedIconProps {
  library?: IconLibrary;
  name: string;
  size?: number;
  color?: string;
  animation?: 'pulse' | 'bounce' | 'rotate' | 'shake' | 'none';
  duration?: number;
  style?: StyleProp<ViewStyle>;
  onAnimationEnd?: () => void;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  library = 'ionicons',
  name,
  size = 24,
  color = '#FF7B00',
  animation = 'none',
  duration = 1000,
  style,
  onAnimationEnd,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animation === 'none') return;

    let animationConfig: Animated.CompositeAnimation;

    switch (animation) {
      case 'pulse':
        animationConfig = Animated.loop(
          Animated.sequence([
            Animated.timing(scaleValue, {
              toValue: 1.2,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(scaleValue, {
              toValue: 1,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case 'bounce':
        animationConfig = Animated.loop(
          Animated.sequence([
            Animated.timing(animatedValue, {
              toValue: -10,
              duration: duration / 4,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: duration / 4,
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case 'rotate':
        animationConfig = Animated.loop(
          Animated.timing(rotateValue, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          })
        );
        break;

      case 'shake':
        animationConfig = Animated.loop(
          Animated.sequence([
            Animated.timing(animatedValue, {
              toValue: 5,
              duration: duration / 8,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: -5,
              duration: duration / 4,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: duration / 8,
              useNativeDriver: true,
            }),
          ])
        );
        break;

      default:
        return;
    }

    animationConfig.start(({ finished }) => {
      if (finished && onAnimationEnd) {
        onAnimationEnd();
      }
    });

    return () => {
      animationConfig.stop();
    };
  }, [animation, duration]);

  const getAnimatedStyle = () => {
    switch (animation) {
      case 'pulse':
        return { transform: [{ scale: scaleValue }] };
      case 'bounce':
        return { transform: [{ translateY: animatedValue }] };
      case 'rotate':
        return {
          transform: [
            {
              rotate: rotateValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        };
      case 'shake':
        return { transform: [{ translateX: animatedValue }] };
      default:
        return {};
    }
  };

  const renderIcon = () => {
    const iconProps = { name: name as any, size, color };

    switch (library) {
      case 'material-community':
        return <MaterialCommunityIcons {...iconProps} />;
      case 'fontawesome5':
        return <FontAwesome5 {...iconProps} />;
      case 'material':
        return <MaterialIcons {...iconProps} />;
      default:
        return <Ionicons {...iconProps} />;
    }
  };

  return (
    <Animated.View style={[style, getAnimatedStyle()]}>
      {renderIcon()}
    </Animated.View>
  );
};

// Pre-configured icon components for common use cases
export const Icons = {
  // Navigation
  Home: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="home" {...props} />
  ),
  HomeOutline: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="home-outline" {...props} />
  ),
  History: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="time" {...props} />
  ),
  HistoryOutline: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="time-outline" {...props} />
  ),
  Settings: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="settings" {...props} />
  ),
  SettingsOutline: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="settings-outline" {...props} />
  ),

  // Food & Calories
  Food: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="material-community" name="food-apple" {...props} />
  ),
  Restaurant: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="restaurant" {...props} />
  ),
  Pizza: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="pizza" {...props} />
  ),
  Leaf: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="leaf" {...props} />
  ),
  Fire: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="flame" {...props} />
  ),
  Nutrition: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="material-community" name="nutrition" {...props} />
  ),

  // Actions
  Add: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="add-circle" {...props} />
  ),
  AddOutline: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="add-circle-outline" {...props} />
  ),
  Remove: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="remove-circle" {...props} />
  ),
  Delete: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="trash" {...props} />
  ),
  Edit: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="create" {...props} />
  ),
  Save: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="save" {...props} />
  ),
  Close: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="close" {...props} />
  ),
  Check: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="checkmark-circle" {...props} />
  ),
  Search: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="search" {...props} />
  ),

  // Goals & Progress
  Target: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="material-community" name="target" {...props} />
  ),
  Trophy: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="trophy" {...props} />
  ),
  Star: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="star" {...props} />
  ),
  Chart: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="stats-chart" {...props} />
  ),
  TrendUp: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="trending-up" {...props} />
  ),
  TrendDown: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="trending-down" {...props} />
  ),

  // Weight & Fitness
  Scale: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="material-community" name="scale-bathroom" {...props} />
  ),
  Fitness: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="fitness" {...props} />
  ),
  Walk: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="walk" {...props} />
  ),
  Run: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="material-community" name="run" {...props} />
  ),
  Heart: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="heart" {...props} />
  ),

  // Notifications & Info
  Bell: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="notifications" {...props} />
  ),
  BellOutline: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="notifications-outline" {...props} />
  ),
  Info: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="information-circle" {...props} />
  ),
  Help: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="help-circle" {...props} />
  ),

  // Time & Calendar
  Calendar: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="calendar" {...props} />
  ),
  Clock: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="time" {...props} />
  ),
  Today: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="today" {...props} />
  ),

  // Misc
  Chevron: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="chevron-forward" {...props} />
  ),
  ChevronDown: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="chevron-down" {...props} />
  ),
  Arrow: (props: Partial<AnimatedIconProps>) => (
    <AnimatedIcon library="ionicons" name="arrow-forward" {...props} />
  ),
};
