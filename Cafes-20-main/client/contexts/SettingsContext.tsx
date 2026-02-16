import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import socketService, { SettingsUpdateEvent } from "@/services/socket";
import { SettingsDto, settingsAPI } from "@/services/api";

export interface BusinessSettings {
  whatsappNumber: string;
  openingTime: string;
  closingTime: string;
  isManuallyOpen: boolean;
  brandStory: string;
  offersText: string;
}

const DEFAULT_SETTINGS: BusinessSettings = {
  whatsappNumber: "+918305385083",
  openingTime: "10:00",
  closingTime: "23:00",
  isManuallyOpen: true,
  brandStory: "",
  offersText: "Wednesday BOGO Special - Buy One Get One Free on all medium Premium & Delight pizzas! Valid every Wednesday. Cannot be combined with other offers.",
};

const normalizeSettings = (data: SettingsDto | null): BusinessSettings => {
  if (!data) return DEFAULT_SETTINGS;
  return {
    whatsappNumber: data.whatsappNumber ?? DEFAULT_SETTINGS.whatsappNumber,
    openingTime: data.openingTime ?? DEFAULT_SETTINGS.openingTime,
    closingTime: data.closingTime ?? DEFAULT_SETTINGS.closingTime,
    isManuallyOpen:
      typeof data.isManuallyOpen === "boolean" ? data.isManuallyOpen : DEFAULT_SETTINGS.isManuallyOpen,
    brandStory: data.brandStory ?? DEFAULT_SETTINGS.brandStory,
    offersText: data.offersText ?? DEFAULT_SETTINGS.offersText,
  };
};

interface SettingsContextValue {
  settings: BusinessSettings | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      setLoading(true);
      const res = await settingsAPI.get();
      setSettings(res?.success ? normalizeSettings(res.data ?? null) : DEFAULT_SETTINGS);
    } catch {
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  // Live updates via Socket.IO
  useEffect(() => {
    const socket = socketService.connect();
    socketService.joinUser();

    const onUpdate = (event: SettingsUpdateEvent) => {
      const s = event?.data;
      if (!s) return;
      setSettings((prev) => ({
        whatsappNumber: s.whatsappNumber ?? prev?.whatsappNumber ?? DEFAULT_SETTINGS.whatsappNumber,
        openingTime: s.openingTime ?? prev?.openingTime ?? DEFAULT_SETTINGS.openingTime,
        closingTime: s.closingTime ?? prev?.closingTime ?? DEFAULT_SETTINGS.closingTime,
        isManuallyOpen:
          typeof s.isManuallyOpen === "boolean" ? s.isManuallyOpen : prev?.isManuallyOpen ?? DEFAULT_SETTINGS.isManuallyOpen,
        brandStory: s.brandStory ?? prev?.brandStory ?? DEFAULT_SETTINGS.brandStory,
        offersText: s.offersText ?? prev?.offersText ?? DEFAULT_SETTINGS.offersText,
      }));
    };

    socketService.onSettingsUpdate(onUpdate);
    return () => {
      socketService.offSettingsUpdate(onUpdate);
      void socket;
    };
  }, []);

  const value = useMemo(
    () => ({
      settings,
      loading,
      refresh,
    }),
    [settings, loading]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return ctx;
}
