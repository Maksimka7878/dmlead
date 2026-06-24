import React, { useState, useMemo } from 'react';
import { MarketType, PricingTier } from '../types';
import { PRICING_DATA, DISCOUNTS } from '../constants';
import { Briefcase, Check, House, ShoppingCart, Sliders } from 'lucide-react';

const MIN_LEADS = 10;
const MAX_LEADS = 100;
const LEAD_STEP = 1;

const SLIDER_MARKS = [
  { value: MIN_LEADS, discount: 0 },
  { value: 30, discount: 10 },
  { value: 50, discount: 15 },
  { value: 100, discount: 20 },
] as const;

const Calculator: React.FC = () => {
  const [selectedMarket, setSelectedMarket] = useState<MarketType>(MarketType.PRIMARY);
  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(1);
  const [leadCount, setLeadCount] = useState<number>(MIN_LEADS);

  const currentCategory = PRICING_DATA.find(c => c.id === selectedMarket) || PRICING_DATA[0];
  const currentTier: PricingTier = currentCategory.tiers[selectedTierIndex] || currentCategory.tiers[0];
  const sliderProgress = ((leadCount - MIN_LEADS) / (MAX_LEADS - MIN_LEADS)) * 100;
  const sliderBackground = `linear-gradient(90deg, var(--accent) 0%, var(--accent-2) ${sliderProgress}%, rgba(226,232,240,0.75) ${sliderProgress}%, rgba(226,232,240,0.75) 100%)`;

  const { total, discountPercent, pricePerLead, savedAmount } = useMemo(() => {
    const basePrice = currentTier.price * leadCount;
    const activeDiscount = DISCOUNTS.find(d => leadCount >= d.minCount) || { percentage: 0 };
    const discountAmount = (basePrice * activeDiscount.percentage) / 100;
    const finalTotal = basePrice - discountAmount;
    
    return {
      total: finalTotal,
      discountPercent: activeDiscount.percentage,
      pricePerLead: finalTotal / leadCount,
      savedAmount: discountAmount
    };
  }, [currentTier, leadCount]);

  return (
    <div className="relative group z-10 h-full">
      {/* Background glow for the glass card */}
      <div className="absolute inset-4 bg-blue-400/20 rounded-[3rem] blur-2xl"></div>

      <div className="relative liquid-glass rounded-[2.5rem] p-0 h-full flex flex-col shadow-2xl overflow-hidden duration-500">
        
        {/* Header with frosted separation */}
        <div className="p-8 pb-6 border-b border-white/20 flex items-center justify-between backdrop-blur-md bg-white/5 flex-none">
          <div>
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-[var(--accent-soft)] rounded-xl">
                    <Sliders className="w-5 h-5 text-[var(--accent)]" />
                </div>
                Калькулятор
              </h3>
              <p className="text-slate-500 text-sm mt-1 pl-1">Соберите свой пакет</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-50/50 to-white/50 border border-white/50 flex items-center justify-center shadow-lg shadow-blue-500/10">
              <ShoppingCart className="w-5 h-5 text-[var(--accent)]" />
          </div>
        </div>
        
        <div className="p-6 pt-5 flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left: Market type + Tier selector */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Market Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Тип недвижимости</label>
              <div className="grid grid-cols-2 gap-3">
                {PRICING_DATA.map((market) => (
                  <button
                    key={market.id}
                    onClick={() => {
                        setSelectedMarket(market.id);
                        setSelectedTierIndex(0);
                    }}
                    className={`relative w-full rounded-2xl px-4 py-3.5 text-left transition-all duration-300 overflow-hidden border backdrop-blur-md ${
                      selectedMarket === market.id
                        ? 'text-white border-white/40 shadow-[0_10px_26px_rgba(37,99,235,0.35)] bg-gradient-to-r from-[var(--accent)] via-[var(--accent)] to-[var(--accent-2)] -translate-y-0.5'
                        : 'text-slate-700 bg-white/28 border-white/40 hover:bg-white/42 hover:border-white/60'
                    }`}
                    aria-pressed={selectedMarket === market.id}
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-white/50"></div>
                    <div className="relative z-10 flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center border ${
                        selectedMarket === market.id
                          ? 'bg-white/20 border-white/35'
                          : 'bg-white/55 border-white/70'
                      }`}>
                        {market.id === MarketType.PRIMARY && <House className={`w-4 h-4 ${selectedMarket === market.id ? 'text-white' : 'text-[var(--accent)]'}`} />}
                        {market.id === MarketType.COMMERCIAL && <Briefcase className={`w-4 h-4 ${selectedMarket === market.id ? 'text-white' : 'text-[var(--accent)]'}`} />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[15px] font-bold leading-tight truncate">{market.title}</p>
                        <p className={`text-[11px] mt-0.5 ${selectedMarket === market.id ? 'text-blue-100' : 'text-slate-500'}`}>
                          {market.id === MarketType.PRIMARY && 'Жилая первичка'}
                          {market.id === MarketType.COMMERCIAL && 'Офисы и ритейл'}
                        </p>
                      </div>
                    </div>
                    {selectedMarket === market.id && (
                      <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-white shadow-[0_0_0_6px_rgba(255,255,255,0.16)]"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tier Selector */}
            <div className="flex-1 flex flex-col">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Класс / Сегмент</label>
              <div className="grid grid-cols-2 gap-3 flex-1 auto-rows-fr">
                {currentCategory.tiers.map((tier, idx) => (
                  <div
                    key={tier.name}
                    onClick={() => setSelectedTierIndex(idx)}
                    className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 border relative group/card backdrop-blur-sm h-full flex flex-col justify-center ${
                      selectedTierIndex === idx
                        ? 'bg-[var(--accent-soft)] border-[var(--accent)] shadow-lg shadow-blue-500/10'
                        : 'bg-white/10 border-white/20 hover:bg-white/30 hover:border-white/50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className={`font-bold text-base transition-colors ${selectedTierIndex === idx ? 'text-[var(--accent)]' : 'text-slate-800'}`}>
                          {tier.name}
                      </span>
                      {selectedTierIndex === idx && (
                          <div className="w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                          </div>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mb-2 leading-relaxed">{tier.description}</div>
                    <div className="text-xs font-mono text-slate-700 font-bold bg-white/40 inline-block px-2 py-0.5 rounded-lg">
                      {tier.price.toLocaleString('ru-RU')} ₽ / лид
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Slider + Results */}
          <div className="flex-1 flex flex-col gap-6 justify-between">

            <div className="bg-white/20 rounded-[2.5rem] p-8 border border-white/30 shadow-inner relative overflow-hidden group/slider">
              {/* Subtle pulsing glow for the slider section */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"></div>
              
              <div className="flex justify-between items-center mb-10 relative z-10">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Количество лидов</label>
                  <p className="text-[10px] text-slate-500 mt-1">Минимальный пакет: 10 лидов</p>
                </div>
                <div className="flex items-baseline gap-2 bg-white/40 px-4 py-1 rounded-2xl border border-white/60 shadow-sm">
                    <span className="text-5xl font-black text-slate-900 tabular-nums tracking-tighter transition-all duration-300 group-hover/slider:text-[var(--accent)]">
                      {leadCount}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">шт.</span>
                </div>
              </div>
              
              <div className="relative h-12 flex items-center px-3">
                <input
                  type="range"
                  min={MIN_LEADS}
                  max={MAX_LEADS}
                  step={LEAD_STEP}
                  value={leadCount}
                  onChange={(e) => setLeadCount(parseInt(e.target.value, 10))}
                  style={{ background: sliderBackground }}
                  className="premium-range z-20"
                />
              </div>

              {/* Threshold marks */}
              <div className="mt-6 grid grid-cols-4 gap-3 px-1">
                {SLIDER_MARKS.map((mark) => {
                  const isActive = leadCount >= mark.value;
                  const isDiscountMark = mark.discount !== null && mark.discount > 0;
                  const markValueLabel = 'label' in mark ? mark.label : `${mark.value}`;
                  const markLabel = isDiscountMark
                    ? `${markValueLabel} лидов, скидка ${mark.discount}%`
                    : `${markValueLabel} лидов`;

                  return (
                    <button
                      key={mark.value}
                      type="button"
                      onClick={() => setLeadCount(mark.value)}
                      aria-label={markLabel}
                      className="flex flex-col items-center gap-2 rounded-xl py-1 transition-all cursor-pointer hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40"
                    >
                      <div
                        className={`w-3 h-3 rounded-full border transition-all ${
                          isActive
                            ? isDiscountMark
                              ? 'bg-emerald-500 border-emerald-300 shadow-[0_0_0_4px_rgba(16,185,129,0.18)]'
                              : 'bg-[var(--accent)] border-blue-300 shadow-[0_0_0_4px_rgba(59,130,246,0.16)]'
                            : 'bg-slate-300 border-slate-200'
                        }`}
                      ></div>
                      <div className="flex items-baseline gap-1">
                        <span
                          className={`text-[12px] font-extrabold tabular-nums transition-colors ${
                            isDiscountMark
                              ? isActive ? 'text-emerald-600' : 'text-slate-500'
                              : isActive ? 'text-[var(--accent)]' : 'text-slate-400'
                          }`}
                        >
                          {'label' in mark ? mark.label : mark.value}
                        </span>
                        {isDiscountMark && (
                          <span className={`text-[10px] font-bold ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {mark.discount}%
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                Скидки: от 30 шт. — 10%, от 50 шт. — 15%, от 100 шт. — 20%.
              </div>
            </div>

            {/* Results Group */}
            <div className="space-y-4">
              {/* Summary Panel */}
              <div className="rounded-3xl p-6 relative overflow-hidden text-white shadow-2xl border border-white/40 bg-[linear-gradient(135deg,rgba(125,153,255,0.18),rgba(182,200,255,0.26))] backdrop-blur-xl">
                  {/* Internal Glows */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/30 rounded-full blur-[60px] -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[40px] -ml-10 -mb-10"></div>

                  <div className="flex justify-between items-center mb-3 relative z-10">
                      <span className="text-slate-700/85 text-sm font-semibold">Цена за лид:</span>
                      <span className="font-mono text-slate-900 text-lg font-bold">{pricePerLead.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  {discountPercent > 0 && (
                      <div className="flex justify-between items-center mb-4 text-emerald-400 relative z-10">
                          <span className="text-xs uppercase font-bold tracking-widest bg-emerald-500/10 px-2 py-1 rounded">Скидка {discountPercent}%</span>
                          <span className="font-mono text-sm">-{savedAmount.toLocaleString('ru-RU')} ₽</span>
                      </div>
                  )}
                  
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-400/20 to-transparent my-3"></div>
                  
                  <div className="flex justify-between items-end relative z-10">
                      <span className="text-lg font-semibold text-slate-800 pb-1">Итого:</span>
                      <span className="text-5xl font-black text-slate-950 tracking-tighter tabular-nums drop-shadow-[0_6px_18px_rgba(255,255,255,0.45)]">
                          {total.toLocaleString('ru-RU')} <span className="text-2xl text-slate-500 font-semibold">₽</span>
                      </span>
                  </div>
              </div>
              
              <a 
                  href="https://t.me/DMitryLeads" 
                  target="_blank" 
                  rel="noreferrer"
                  className="block w-full text-center bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-white font-bold py-5 rounded-2xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 relative overflow-hidden group hover:-translate-y-1 hover:brightness-110"
              >
                  <div className="absolute inset-0 bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                  <span className="relative z-10 text-lg tracking-wide">Обсудить заказ</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
