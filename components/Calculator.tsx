import React, { useState, useMemo } from 'react';
import { MarketType, PricingTier } from '../types';
import { PRICING_DATA, DISCOUNTS } from '../constants';
import { Check, ShoppingCart, Sliders } from 'lucide-react';

const Calculator: React.FC = () => {
  const [selectedMarket, setSelectedMarket] = useState<MarketType>(MarketType.PRIMARY);
  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(0);
  const [leadCount, setLeadCount] = useState<number>(10);

  const currentCategory = PRICING_DATA.find(c => c.id === selectedMarket) || PRICING_DATA[0];
  const currentTier: PricingTier = currentCategory.tiers[selectedTierIndex] || currentCategory.tiers[0];

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

      <div className="relative liquid-glass rounded-[2.5rem] p-0 h-full flex flex-col shadow-2xl transition-transform hover:scale-[1.01] duration-500">
        
        {/* Header with frosted separation */}
        <div className="p-8 pb-6 border-b border-white/20 flex items-center justify-between backdrop-blur-md bg-white/5 flex-none">
          <div>
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-xl">
                    <Sliders className="w-5 h-5 text-blue-600" />
                </div>
                Калькулятор
              </h3>
              <p className="text-slate-500 text-sm mt-1 pl-1">Соберите свой пакет</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-50/50 to-white/50 border border-white/50 flex items-center justify-center shadow-lg shadow-blue-500/10">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        
        <div className="p-8 pt-6 flex-1 flex flex-col justify-between gap-8">
          {/* Controls Group */}
          <div className="space-y-8">
            {/* Market Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Тип недвижимости</label>
              <div className="flex flex-wrap gap-2">
                {PRICING_DATA.map((market) => (
                  <button
                    key={market.id}
                    onClick={() => {
                        setSelectedMarket(market.id);
                        setSelectedTierIndex(0);
                    }}
                    className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 relative overflow-hidden border backdrop-blur-md ${
                      selectedMarket === market.id
                        ? 'text-white border-blue-400/50 shadow-lg shadow-blue-500/30'
                        : 'text-slate-600 bg-white/20 border-white/30 hover:bg-white/30'
                    }`}
                  >
                    {/* Active Background Gradient */}
                    {selectedMarket === market.id && (
                       <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 z-0"></div>
                    )}
                    <span className="relative z-10">{market.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tier Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Класс / Сегмент</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentCategory.tiers.map((tier, idx) => (
                  <div
                    key={tier.name}
                    onClick={() => setSelectedTierIndex(idx)}
                    className={`cursor-pointer rounded-2xl p-5 transition-all duration-300 border relative group/card backdrop-blur-sm ${
                      selectedTierIndex === idx
                        ? 'bg-blue-50/40 border-blue-300 shadow-lg shadow-blue-500/10'
                        : 'bg-white/10 border-white/20 hover:bg-white/30 hover:border-white/50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-bold text-lg transition-colors ${selectedTierIndex === idx ? 'text-blue-700' : 'text-slate-800'}`}>
                          {tier.name}
                      </span>
                      {selectedTierIndex === idx && (
                          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mb-3 leading-relaxed">{tier.description}</div>
                    <div className="text-sm font-mono text-slate-700 font-bold bg-white/40 inline-block px-2 py-1 rounded-lg">
                      {tier.price.toLocaleString('ru-RU')} ₽ / лид
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Count Slider */}
            <div className="bg-white/20 rounded-2xl p-6 border border-white/30 shadow-inner">
              <div className="flex justify-between items-end mb-6">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Количество лидов</label>
                <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-bold text-slate-900 tabular-nums tracking-tighter drop-shadow-sm">{leadCount}</span>
                    <span className="text-sm font-medium text-slate-500">шт.</span>
                </div>
              </div>
              
              <div className="relative h-8 flex items-center">
                  <input
                      type="range"
                      min="10"
                      max="300"
                      step="5"
                      value={leadCount}
                      onChange={(e) => setLeadCount(parseInt(e.target.value))}
                      className="w-full h-3 bg-slate-200/50 rounded-full appearance-none cursor-pointer accent-blue-600 z-20 relative backdrop-blur-sm ring-1 ring-white/50"
                      style={{
                          background: `linear-gradient(to right, #3b82f6 0%, #4f46e5 ${(leadCount - 10) / 2.9}%, rgba(255,255,255,0.3) ${(leadCount - 10) / 2.9}%, rgba(255,255,255,0.3) 100%)`
                      }}
                  />
                  {/* Slider shadow reflection */}
                  <div className="absolute top-1/2 left-0 w-full h-3 -mt-1.5 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] pointer-events-none"></div>
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 mt-3 font-mono uppercase tracking-wide">
                <span>10</span>
                <span className={leadCount >= 30 ? "text-emerald-600 font-bold" : ""}>30 (-10%)</span>
                <span className={leadCount >= 50 ? "text-emerald-600 font-bold" : ""}>50 (-20%)</span>
                <span>300</span>
              </div>
            </div>
          </div>

          {/* Results Group - Pushed to bottom */}
          <div className="space-y-6">
            {/* Summary Panel */}
            <div className="liquid-glass-dark rounded-3xl p-8 relative overflow-hidden text-white shadow-2xl">
                {/* Internal Glows */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/30 rounded-full blur-[60px] -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[40px] -ml-10 -mb-10"></div>

                <div className="flex justify-between items-center mb-3 relative z-10">
                    <span className="text-slate-400 text-sm font-medium">Цена за лид:</span>
                    <span className="font-mono text-white text-lg">{pricePerLead.toLocaleString('ru-RU')} ₽</span>
                </div>
                {discountPercent > 0 && (
                    <div className="flex justify-between items-center mb-5 text-emerald-400 relative z-10">
                        <span className="text-xs uppercase font-bold tracking-widest bg-emerald-500/10 px-2 py-1 rounded">Скидка {discountPercent}%</span>
                        <span className="font-mono text-sm">-{savedAmount.toLocaleString('ru-RU')} ₽</span>
                    </div>
                )}
                
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-4"></div>
                
                <div className="flex justify-between items-end relative z-10">
                    <span className="text-lg font-medium text-slate-300 pb-1">Итого:</span>
                    <span className="text-5xl font-bold tracking-tighter tabular-nums drop-shadow-lg">
                        {total.toLocaleString('ru-RU')} <span className="text-2xl text-slate-400 font-normal">₽</span>
                    </span>
                </div>
            </div>
            
            <a 
                href="https://t.me/DMitryLeads" 
                target="_blank" 
                rel="noreferrer"
                className="block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-5 rounded-2xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 relative overflow-hidden group hover:-translate-y-1"
            >
                <div className="absolute inset-0 bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                <span className="relative z-10 text-lg tracking-wide">Обсудить заказ</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;