export async function playLogHaptic(): Promise<void> {
  try {
    const Haptics = await import("expo-haptics");
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {
    // Node tests and unsupported platforms stay silent.
  }
}

export async function playUndoHaptic(): Promise<void> {
  try {
    const Haptics = await import("expo-haptics");
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch {
    // Node tests and unsupported platforms stay silent.
  }
}
