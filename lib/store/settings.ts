import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  autoScroll: boolean;
  voiceEnabled: boolean;
  setAutoScroll: (value: boolean) => void;
  setVoiceEnabled: (value: boolean) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      autoScroll: true,
      voiceEnabled: false,
      setAutoScroll: (value) => set({ autoScroll: value }),
      setVoiceEnabled: (value) => set({ voiceEnabled: value }),
    }),
    {
      name: 'chat-settings',
    }
  )
); 