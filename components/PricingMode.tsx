import React, { createContext, useContext, useEffect, useState } from 'react';
import { PricingTier } from '../types';
import { RefreshCw, Zap } from 'lucide-react';
import { useAnimatedNumber } from './useAnimatedNumber';

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

const MODE_HINTS = [
  'Нецелевые лиды бесплатно заменяем в течение 5 дней по 4 гарантиям.',
  'Комфорт дешевле на 50%, остальные классы — на 25%: нецелевые лиды не заменяем.',
];

export const PricingModeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { noReplace, setNoReplace } = usePricingMode();

  const label =
    'relative z-10 flex-1 flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition-colors duration-500';

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="liquid-glass relative flex w-full max-w-xl rounded-3xl p-1.5 border border-white/60 shadow-lg">
        {/* Скользящая капсула: переезжает и перекрашивается за один переход */}
        <div
          className="pointer-events-none absolute top-1.5 left-1.5 h-[calc(100%-12px)] w-[calc((100%-12px)/2)] rounded-2xl transition-[transform,background-color,box-shadow] duration-500 ease-[cubic-bezier(.34,.66,0,1)]"
          style={{
            transform: `translateX(${noReplace ? 100 : 0}%)`,
            backgroundImage: noReplace
              ? 'linear-gradient(90deg,#10b981,#34d399)'
              : 'linear-gradient(90deg,var(--accent),var(--accent-2))',
            boxShadow: noReplace
              ? '0 8px 22px rgba(16,185,129,0.30)'
              : '0 8px 22px var(--accent-soft)',
          }}
        />
        <button
          type="button"
          onClick={() => setNoReplace(false)}
          aria-pressed={!noReplace}
          className={`${label} ${noReplace ? 'text-slate-600' : 'text-white'}`}
        >
          <RefreshCw className="h-4 w-4" />
          С заменами
        </button>
        <button
          type="button"
          onClick={() => setNoReplace(true)}
          aria-pressed={noReplace}
          className={`${label} ${noReplace ? 'text-white' : 'text-slate-600'}`}
        >
          <Zap className="h-4 w-4" />
          Без замен
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-black tracking-tight transition-colors duration-500 ${
              noReplace ? 'bg-white/25 text-white' : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            до −50%
          </span>
        </button>
      </div>

      {/* Подпись: обе строки в одной сетке — высота не скачет, тексты перекрёстно гаснут */}
      <div className="mt-3 grid text-center text-xs md:text-sm font-medium text-slate-500">
        {MODE_HINTS.map((hint, i) => (
          <span
            key={hint}
            aria-hidden={noReplace !== Boolean(i)}
            className={`col-start-1 row-start-1 transition-opacity duration-500 ${
              noReplace === Boolean(i) ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {hint}
          </span>
        ))}
      </div>
    </div>
  );
};

/** Компактный индикатор режима — для мест, где тумблер не показан (калькулятор на главной). */
export const PricingModeBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { noReplace } = usePricingMode();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors duration-500 ${
        noReplace
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-[var(--accent)]/25 bg-[var(--accent-soft)] text-[var(--accent)]'
      } ${className}`}
    >
      {noReplace ? <Zap className="h-3.5 w-3.5" /> : <RefreshCw className="h-3.5 w-3.5" />}
      {noReplace ? 'Без замен · до −50%' : 'С заменами'}
    </span>
  );
};

/** Цена за лид: базовая цена всегда занимает свою строку, поэтому при
 *  переключении режима блок не меняет высоту — только плавно проявляется. */
export const TierPrice: React.FC<{ tier: PricingTier; className?: string; align?: 'end' | 'start' }> = ({
  tier,
  className = '',
  align = 'end',
}) => {
  const { noReplace } = usePricingMode();
  const animated = useAnimatedNumber(tierPrice(tier, noReplace));

  return (
    <div className={`flex flex-col ${align === 'end' ? 'items-start sm:items-end' : 'items-start'}`}>
      <span
        aria-hidden={!noReplace}
        className={`flex items-center gap-1.5 leading-4 transition-opacity duration-500 ${
          noReplace ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="font-mono text-xs md:text-sm font-semibold text-slate-400 line-through decoration-slate-400/70">
          {tier.price.toLocaleString('ru-RU')} ₽
        </span>
        <span className="rounded-full bg-emerald-100 px-1.5 text-[10px] font-black leading-4 text-emerald-700">
          −{tierModeDiscount(tier)}%
        </span>
      </span>
      <div
        className={`font-mono font-bold tabular-nums transition-colors duration-500 ${
          noReplace ? '!text-emerald-600' : ''
        } ${className}`}
      >
        {Math.round(animated).toLocaleString('ru-RU')} ₽
      </div>
    </div>
  );
};
