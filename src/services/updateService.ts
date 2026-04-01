import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG_URL, APP_VERSION, STORAGE_KEYS, APP_CONFIG_FETCH_TIMEOUT_MS } from '../common/constants';

export interface AppConfig {
  latestVersion: string;
  minSupportedVersion: string;
  updateMessage: string;
  forceUpdate: boolean;
  playStoreUrl: string;
  releaseNotes: string[];
}

/**
 * Compare two semver strings (e.g. "1.2.3" > "1.1.0").
 * Returns  1 if a > b,  -1 if a < b,  0 if equal.
 */
const compareSemver = (a: string, b: string): number => {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const va = pa[i] ?? 0;
    const vb = pb[i] ?? 0;
    if (va > vb) return 1;
    if (va < vb) return -1;
  }
  return 0;
};

/**
 * Fetch remote app config from GitHub. Never throws.
 */
export const fetchAppConfig = async (): Promise<AppConfig | null> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), APP_CONFIG_FETCH_TIMEOUT_MS);

    const response = await fetch(APP_CONFIG_URL, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
};

export interface UpdateCheckResult {
  updateAvailable: boolean;
  forceUpdate: boolean;
  message: string;
  playStoreUrl: string;
  releaseNotes: string[];
  latestVersion: string;
}

/**
 * Check if an app update is available.
 * Returns null if no network, no update, or user already dismissed this version.
 */
export const checkForUpdate = async (): Promise<UpdateCheckResult | null> => {
  const config = await fetchAppConfig();
  if (!config) return null;

  const isNewer = compareSemver(config.latestVersion, APP_VERSION) > 0;
  if (!isNewer) return null;

  // Force update: app version is below minimum supported
  const isBelowMin = compareSemver(APP_VERSION, config.minSupportedVersion) < 0;
  const forceUpdate = isBelowMin || config.forceUpdate;

  // If not forced, check if user dismissed this version already
  if (!forceUpdate) {
    const dismissed = await AsyncStorage.getItem(STORAGE_KEYS.DISMISSED_UPDATE_VERSION);
    if (dismissed === config.latestVersion) return null;
  }

  return {
    updateAvailable: true,
    forceUpdate,
    message: config.updateMessage,
    playStoreUrl: config.playStoreUrl,
    releaseNotes: config.releaseNotes,
    latestVersion: config.latestVersion,
  };
};

/**
 * Mark a version as dismissed so the banner doesn't show again for that version.
 */
export const dismissUpdate = async (version: string): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.DISMISSED_UPDATE_VERSION, version);
};
