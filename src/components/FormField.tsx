import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const FormField: React.FC<FormFieldProps> = ({ label, required, children, style }) => (
  <View style={[styles.container, style]}>
    <Text style={styles.label}>
      {label}
      {required && <Text style={styles.asterisk}> *</Text>}
    </Text>
    {children}
  </View>
);

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
});
