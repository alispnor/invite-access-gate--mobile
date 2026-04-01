/**
 * Safe haptics wrapper — noop when expo-haptics is unavailable.
 */

let Haptics: typeof import('expo-haptics') | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Haptics = require('expo-haptics');
} catch {
  // not available
}

export async function impactLight() {
  try { await Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
}

export async function impactMedium() {
  try { await Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
}

export async function selection() {
  try { await Haptics?.selectionAsync(); } catch {}
}

export async function notifySuccess() {
  try { await Haptics?.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
}

export async function notifyError() {
  try { await Haptics?.notificationAsync(Haptics.NotificationFeedbackType.Error); } catch {}
}
