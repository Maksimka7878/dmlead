import React, { createContext, useContext, useEffect, useState } from 'react';
import { REGIONS, RegionId, RegionTheme, DEFAULT_REGION, getTheme } from '../regions';

interface RegionContextValue {
  region: RegionId;
  theme: RegionTheme;
  setRegion: (id: RegionId) => void;
}

const RegionContext = createContext<RegionContextValue | null>(null);
const STORAGE_KEY = 'dmleads-region';

export const RegionProvider = ({ children }: { children: React.ReactNode }) => {
  const [region, setRegion] = useState<RegionId>(DEFAULT_REGION);

  // Восстанавливаем выбор из прошлой сессии.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as RegionId | null;
      if (saved && REGIONS.some((r) => r.id === saved)) {
        setRegion(saved);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Прокидываем тему региона в CSS-переменные на :root — её видят все компоненты.
  useEffect(() => {
    const t = getTheme(region);
    const root = document.documentElement;
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--accent-2', t.accent2);
    root.style.setProperty('--accent-soft', t.soft);
    root.style.setProperty('--blob-1', t.blob1);
    root.style.setProperty('--blob-2', t.blob2);
    root.style.setProperty('--blob-3', t.blob3);
    try {
      window.localStorage.setItem(STORAGE_KEY, region);
    } catch {
      /* ignore */
    }
  }, [region]);

  return (
    <RegionContext.Provider value={{ region, theme: getTheme(region), setRegion }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = (): RegionContextValue => {
  const ctx = useContext(RegionContext);
  if (!ctx) throw new Error('useRegion must be used within RegionProvider');
  return ctx;
};
