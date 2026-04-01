/**
 * Biometric helpers — fail-safe for environments where
 * expo-local-authentication is not available (e.g. Expo Go on some devices).
 */

let LocalAuth: typeof import('expo-local-authentication') | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  LocalAuth = require('expo-local-authentication');
} catch {
  // Module not available in this runtime
}

export async function isBiometricAvailable(): Promise<boolean> {
  if (!LocalAuth) return false;
  try {
    const compatible = await LocalAuth.hasHardwareAsync();
    if (!compatible) return false;
    return LocalAuth.isEnrolledAsync();
  } catch {
    return false;
  }
}

export async function authenticateWithBiometric(): Promise<boolean> {
  if (!LocalAuth) return false;
  try {
    const result = await LocalAuth.authenticateAsync({
      promptMessage: 'Autenticar com biometria',
      cancelLabel: 'Cancelar',
      disableDeviceFallback: false,
      fallbackLabel: 'Usar senha do dispositivo',
    });
    return result.success;
  } catch {
    return false;
  }
}

export async function getBiometricType(): Promise<string> {
  if (!LocalAuth) return 'Biometria';
  try {
    const types = await LocalAuth.supportedAuthenticationTypesAsync();
    if (types.includes(LocalAuth.AuthenticationType.FACIAL_RECOGNITION)) return 'Face ID';
    if (types.includes(LocalAuth.AuthenticationType.FINGERPRINT)) return 'Impressão digital';
    if (types.includes(LocalAuth.AuthenticationType.IRIS)) return 'Iris';
  } catch {
    // fallback
  }
  return 'Biometria';
}
