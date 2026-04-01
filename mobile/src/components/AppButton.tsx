import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { impactLight } from '../utils/haptics';
import { colors } from '../theme/colors';

type Variant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
}: Props) {
  const handlePress = useCallback(() => {
    void impactLight();
    onPress();
  }, [onPress]);

  const isDisabled = disabled || loading;
  const variantStyle = variantStyles[variant];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        variantStyle.container,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantStyle.loaderColor}
        />
      ) : (
        <>
          {icon}
          <Text style={[styles.label, variantStyle.label]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    minHeight: 48,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.5 },
  label: { fontSize: 16, fontWeight: '600' },
});

const variantStyles = {
  primary: {
    container: { backgroundColor: colors.gateYellow } as ViewStyle,
    label: { color: colors.primary },
    loaderColor: colors.primary,
  },
  secondary: {
    container: { backgroundColor: colors.primary } as ViewStyle,
    label: { color: colors.gateYellow },
    loaderColor: colors.gateYellow,
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: colors.primary,
    } as ViewStyle,
    label: { color: colors.primary },
    loaderColor: colors.primary,
  },
  danger: {
    container: { backgroundColor: colors.danger } as ViewStyle,
    label: { color: '#fff' },
    loaderColor: '#fff',
  },
  ghost: {
    container: { backgroundColor: 'transparent' } as ViewStyle,
    label: { color: colors.info2 },
    loaderColor: colors.info2,
  },
};
