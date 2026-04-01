/**
 * Paleta alinhada a frontend/app/src/styles/_variables.scss (GUÉP)
 */
export const colors = {
  gateBlack: '#000000',
  gateYellow: '#f9c706',
  gateYellowLight: '#fff9e1',
  gateYellowDark: '#f6ad02',
  primary: '#000000',
  secondary: '#f9c706',
  accent: '#484848',
  textLight: '#ffffff',
  textDark: '#2c3e50',
  textMuted: '#6c757d',
  success: '#27ae60',
  danger: '#e74c3c',
  warning: '#f39c12',
  info: '#474646',
  info2: '#3498db',
  gray50: '#fafafa',
  gray100: '#f5f5f5',
  gray200: '#f0f0f0',
  gray300: '#e0e0e0',
  gray400: '#bdbdbd',
  gray500: '#9e9e9e',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
  bgPrimary: '#fafafa',
  bgSecondary: '#ffffff',
  textPrimary: '#333333',
  textSecondary: '#666666',
  border: '#e5e5ea',
} as const;

export type Colors = typeof colors;
