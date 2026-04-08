import React, { createContext, useContext, useState, useCallback } from 'react';
import { AppSettings, MacroTargets, UserData } from '../types';
import { getSettings, saveSettings } from '../services/storage';
import { scheduleDailyReminder } from '../services/notifications';
import { getUserData } from '../services/userDataService';
import { calculateMacroTargets } from '../utils/macroTargets';
import { DEFAULT_SETTINGS, DEFAULT_MACRO_TARGETS } from '../common/constants';

interface SettingsContextType {
  settings: AppSettings;
  macroTargets: MacroTargets;
  gender: 'male' | 'female' | undefined;
  updateSettings: (settings: AppSettings) => Promise<void>;
  loadSettings: () => Promise<AppSettings>;
  loadMacroTargets: () => Promise<void>;
  setGender: (gender: 'male' | 'female') => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

let cachedSettings: AppSettings | null = null;

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(cachedSettings || DEFAULT_SETTINGS);
  const [macroTargets, setMacroTargets] = useState<MacroTargets>(DEFAULT_MACRO_TARGETS);
  const [gender, setGenderState] = useState<'male' | 'female' | undefined>();

  // Load gender on mount
  React.useEffect(() => {
    getUserData().then(data => setGenderState(data.gender));
  }, []);

  const setGender = useCallback((g: 'male' | 'female') => {
    setGenderState(g);
  }, []);

  const loadSettings = useCallback(async (): Promise<AppSettings> => {
    const appSettings = await getSettings();
    setSettings(appSettings);
    cachedSettings = appSettings;
    return appSettings;
  }, []);

  const loadMacroTargets = useCallback(async () => {
    const userData = await getUserData();
    setMacroTargets(calculateMacroTargets(userData));
  }, []);

  const updateSettings = useCallback(async (newSettings: AppSettings) => {
    await saveSettings(newSettings);
    setSettings(newSettings);
    cachedSettings = newSettings;
    await scheduleDailyReminder(newSettings);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        macroTargets,
        gender,
        updateSettings,
        loadSettings,
        loadMacroTargets,
        setGender,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
