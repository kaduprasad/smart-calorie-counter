import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';

interface NumericInputProps extends Omit<TextInputProps, 'onChangeText' | 'keyboardType'> {
  value: string;
  onChangeText: (value: string) => void;
  allowDecimal?: boolean;
  maxDecimalPlaces?: number;
}

/**
 * A TextInput that only allows numeric values.
 * Filters out any non-numeric characters except decimal point (if allowed).
 */
export const NumericInput: React.FC<NumericInputProps> = ({
  value,
  onChangeText,
  allowDecimal = true,
  maxDecimalPlaces = 2,
  style,
  ...props
}) => {
  const handleTextChange = (text: string) => {
    // Remove any non-numeric characters except decimal point
    let filtered = text.replace(/[^0-9.]/g, '');
    
    if (!allowDecimal) {
      // Remove all decimal points if decimals not allowed
      filtered = filtered.replace(/\./g, '');
    } else {
      // Only allow one decimal point
      const parts = filtered.split('.');
      if (parts.length > 2) {
        filtered = parts[0] + '.' + parts.slice(1).join('');
      }
      
      // Limit decimal places
      if (parts.length === 2 && parts[1].length > maxDecimalPlaces) {
        filtered = parts[0] + '.' + parts[1].slice(0, maxDecimalPlaces);
      }
    }
    
    onChangeText(filtered);
  };

  return (
    <TextInput
      value={value}
      onChangeText={handleTextChange}
      keyboardType={allowDecimal ? 'decimal-pad' : 'number-pad'}
      style={style}
      {...props}
    />
  );
};

export default NumericInput;
