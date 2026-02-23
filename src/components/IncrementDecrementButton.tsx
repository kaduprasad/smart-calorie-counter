import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ButtonVariant = 'default' | 'filled';
type ButtonSize = 'small' | 'medium' | 'large';

interface IncrementButtonProps {
  onPress: () => void;
  size?: ButtonSize;
  color?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
}

const SIZES: Record<ButtonSize, { button: number; icon: number }> = {
  small: { button: 26, icon: 14 },
  medium: { button: 28, icon: 16 },
  large: { button: 48, icon: 24 },
};

export const IncrementButton: React.FC<IncrementButtonProps> = ({
  onPress,
  size = 'medium',
  color = '#FF7B00',
  variant = 'default',
  disabled = false,
  style,
}) => {
  const { button, icon } = SIZES[size];
  const isFilled = variant === 'filled';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: button,
          height: button,
          borderRadius: button / 2,
          backgroundColor: isFilled ? color : '#FFFFFF',
          borderWidth: isFilled ? 0 : 1,
          borderColor: isFilled ? undefined : color,
        },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Ionicons name="add" size={icon} color={isFilled ? '#FFFFFF' : color} />
    </TouchableOpacity>
  );
};

export const DecrementButton: React.FC<IncrementButtonProps> = ({
  onPress,
  size = 'medium',
  color = '#FF7B00',
  variant = 'default',
  disabled = false,
  style,
}) => {
  const { button, icon } = SIZES[size];
  const isFilled = variant === 'filled';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: button,
          height: button,
          borderRadius: button / 2,
          backgroundColor: isFilled ? color : '#FFFFFF',
          borderWidth: isFilled ? 0 : 1,
          borderColor: isFilled ? undefined : color,
        },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Ionicons name="remove" size={icon} color={isFilled ? '#FFFFFF' : color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
});
