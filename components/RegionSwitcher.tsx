import React from 'react';
import { REGIONS } from '../regions';
import { useRegion } from './RegionContext';

// Apple-style liquid-glass переключатель регионов из дизайна claude-design.
const RegionSwitcher: React.FC = () => {
  const { region, setRegion } = useRegion();
  const idx = REGIONS.findIndex((r) => r.id === region);

  return (
    <div className="flex justify-center">
      <div className="relative flex items-stretch w-full max-w-[500px] p-1.5 rounded-full bg-white/55 backdrop-blur-xl border border-white/80 shadow-[0_12px_32px_rgba(31,38,135,0.10),inset_0_1px_2px_rgba(148,163,184,0.14)]">
        {/* Скользящий индикатор */}
        <div
          className="absolute top-1.5 left-1.5 h-[calc(100%-12px)] rounded-full bg-white/95 z-0 transition-transform duration-700 ease-[cubic-bezier(.34,.66,0,1)]"
          style={{
            width: `calc((100% - 12px) / ${REGIONS.length})`,
            transform: `translateX(${idx * 100}%)`,
            boxShadow: '0 6px 18px rgba(15,23,42,0.14), 0 0 0 1px var(--accent-soft)',
          }}
        />
        {REGIONS.map((r) => {
          const active = r.id === region;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setRegion(r.id)}
              aria-pressed={active}
              className="relative z-10 flex-1 min-w-0 rounded-full py-2.5 px-1.5 text-[15px] font-semibold whitespace-nowrap cursor-pointer transition-colors duration-500"
              style={{ color: active ? 'var(--accent)' : '#64748b' }}
            >
              {r.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RegionSwitcher;
