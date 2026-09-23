import React, { createContext, useContext, useEffect, useState } from 'react';
import { PricingTier } from '../types';

interface PricingModeValue {
  /** true — тариф без бесплатной замены нецелевых лидов (дешевле). */
  noReplace: boolean;
  setNoReplace: (v: boolean) => void;
}

const PricingModeContext = createContext<PricingModeValue | null>(null);
const STORAGE_KEY = 'dmleads-pricing-mode';

export const PricingModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [noReplace, setNoReplace] = useState(false);

  // Восстанавливаем выбор из прошлой сессии (после гидратации, чтобы SSR совпал).
  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === '1') setNoReplace(true);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, noReplace ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [noReplace]);

  return (
    <PricingModeContext.Provider value={{ noReplace, setNoReplace }}>
      {children}
    </PricingModeContext.Provider>
  );
};

/** Вне провайдера (например, в изолированных тестах) отдаём режим с заменами. */
export const usePricingMode = (): PricingModeValue =>
  useContext(PricingModeContext) || { noReplace: false, setNoReplace: () => {} };

/** Цена тарифа с учётом выбранного режима. */
export const tierPrice = (tier: PricingTier, noReplace: boolean): number =>
  noReplace ? tier.priceNoReplace : tier.price;
