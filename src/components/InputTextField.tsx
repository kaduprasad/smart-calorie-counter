import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet, ViewStyle } from 'react-native';

interface InputTextFieldProps extends Omit<TextInputProps, 'onChangeText'> {
  label: string;
  required?: boolean;
  error?: string;
  onChangeText: (value: string) => void;
  numeric?: boolean;
  allowDecimal?: boolean;
  maxDecimalPlaces?: number;
  containerStyle?: ViewStyle;
}

export const InputTextField: React.FC<InputTextFieldProps> = ({
  label,
  required,
  error,
  onChangeText,
  numeric,
  allowDecimal = true,
  maxDecimalPlaces = 2,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const handleChangeText = (text: string) => {
    if (!numeric) {
      onChangeText(text);
      return;
    }
    let filtered = text.replace(/[^0-9.]/g, '');
    if (!allowDecimal) {
      filtered = filtered.replace(/\./g, '');
    } else {
      const parts = filtered.split('.');
      if (parts.length > 2) {
        filtered = parts[0] + '.' + parts.slice(1).join('');
      }
      if (parts.length === 2 && parts[1].length > maxDecimalPlaces) {
        filtered = parts[0] + '.' + parts[1].slice(0, maxDecimalPlaces);
      }
    }
    onChangeText(filtered);
  };

  const handleFocus = (e: any) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.asterisk}> *</Text>}
      </Text>
      <TextInput
        style={[
          styles.input,
          focused && styles.inputFocused,
          error ? styles.inputError : undefined,
          style,
        ]}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        keyboardType={numeric ? (allowDecimal ? 'decimal-pad' : 'number-pad') : 'default'}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  asterisk: {
    color: '#EF4444',
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1F2937',
  },
  inputFocused: {
    borderColor: '#FF7B00',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: -2,
  },
});
