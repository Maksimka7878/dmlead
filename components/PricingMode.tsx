import React, { createContext, useContext, useEffect, useState } from 'react';
import { PricingTier } from '../types';
import { RefreshCw, Zap } from 'lucide-react';

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

/** Скидка режима в процентах для конкретного тарифа. */
export const tierModeDiscount = (tier: PricingTier): number =>
  Math.round((1 - tier.priceNoReplace / tier.price) * 100);

export const PricingModeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { noReplace, setNoReplace } = usePricingMode();

  const base =
    'relative z-10 flex-1 flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-300';

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="liquid-glass relative flex w-full max-w-xl gap-1.5 rounded-3xl p-1.5 border border-white/60 shadow-lg">
        <button
          type="button"
          onClick={() => setNoReplace(false)}
          aria-pressed={!noReplace}
          className={`${base} ${
            noReplace
              ? 'text-slate-600 hover:bg-white/50'
              : 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-white shadow-md shadow-[var(--accent-soft)]'
          }`}
        >
          <RefreshCw className="h-4 w-4" />
          С заменами
        </button>
        <button
          type="button"
          onClick={() => setNoReplace(true)}
          aria-pressed={noReplace}
          className={`${base} ${
            noReplace
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-md shadow-emerald-500/30'
              : 'text-slate-600 hover:bg-white/50'
          }`}
        >
          <Zap className="h-4 w-4" />
          Без замен
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-black tracking-tight ${
              noReplace ? 'bg-white/25 text-white' : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            −50%
          </span>
        </button>
      </div>
      <p className="mt-3 text-center text-xs md:text-sm font-medium text-slate-500">
        {noReplace
          ? 'Лиды вдвое дешевле: нецелевые не заменяем и не возвращаем деньги.'
          : 'Нецелевые лиды бесплатно заменяем в течение 5 дней по 4 гарантиям.'}
      </p>
    </div>
  );
};

/** Цена за лид с зачёркнутой базовой ценой в режиме «без замен». */
export const TierPrice: React.FC<{ tier: PricingTier; className?: string }> = ({ tier, className = '' }) => {
  const { noReplace } = usePricingMode();

  if (!noReplace) {
    return (
      <div className={`font-mono font-bold ${className}`}>{tier.price.toLocaleString('ru-RU')} ₽</div>
    );
  }

  return (
    <div className="flex flex-col items-start sm:items-end">
      <span className="font-mono text-xs md:text-sm font-semibold text-slate-400 line-through decoration-slate-400/70">
        {tier.price.toLocaleString('ru-RU')} ₽
      </span>
      <div className={`font-mono font-bold !text-emerald-600 ${className}`}>
        {tier.priceNoReplace.toLocaleString('ru-RU')} ₽
      </div>
    </div>
  );
};
