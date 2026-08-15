import { useState, useEffect } from "react";
import { UserSettings } from "../types/movie";

const DEFAULT_SETTINGS: UserSettings = {
  displayName: "Guest Critic",
  avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix", // fun, clean dynamic avatar link
  tmdbApiKey: "",
  notificationsEnabled: true,
};

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        try {
          const stored = localStorage.getItem("flymovie_settings");
          if (stored) {
            setSettings(JSON.parse(stored));
          }
        } catch (e) {
          console.error("Failed to parse user settings from localStorage", e);
        } finally {
          setIsLoaded(true);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    if (typeof window !== "undefined") {
      localStorage.setItem("flymovie_settings", JSON.stringify(newSettings));
    }
  };

  return {
    settings,
    isLoaded,
    saveSettings,
  };
}
