import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

type Variant = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

type Props = {
  label: string;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
};

const variantColors: Record<Variant, { bg: string; text: string }> = {
  success: { bg: '#e8f5e9', text: colors.success },
  danger: { bg: '#fdecea', text: colors.danger },
  warning: { bg: '#fff8e1', text: '#e65100' },
  info: { bg: '#e3f2fd', text: colors.info2 },
  neutral: { bg: colors.gray200, text: colors.gray700 },
};

export function Badge({ label, variant = 'neutral', style }: Props) {
  const c = variantColors[variant];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }, style]}>
      <Text style={[styles.label, { color: c.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
