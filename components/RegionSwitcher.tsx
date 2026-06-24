import React, { useRef, useState } from 'react';
import { REGIONS } from '../regions';
import { useRegion } from './RegionContext';

// Apple-style liquid-glass переключатель регионов.
// Капсулу можно тянуть влево/вправо как тумблер на macOS — на отпускании снапается к ближайшему региону.
const RegionSwitcher: React.FC = () => {
  const { region, setRegion } = useRegion();
  const idx = REGIONS.findIndex((r) => r.id === region);

  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, moved: false, startX: 0 });
  const [live, setLive] = useState<number | null>(null); // дробный индекс во время перетаскивания

  const PAD = 6; // p-1.5

  const floatFromX = (clientX: number): number => {
    const el = trackRef.current;
    if (!el) return idx;
    const r = el.getBoundingClientRect();
    const segW = (r.width - PAD * 2) / REGIONS.length;
    const f = (clientX - r.left - PAD - segW / 2) / segW;
    return Math.max(0, Math.min(REGIONS.length - 1, f));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { active: true, moved: false, startX: e.clientX };

    const onMove = (ev: PointerEvent) => {
      if (!drag.current.active) return;
      if (Math.abs(ev.clientX - drag.current.startX) > 4) drag.current.moved = true;
      if (drag.current.moved) setLive(floatFromX(ev.clientX));
    };
    const onUp = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      if (drag.current.moved) {
        setRegion(REGIONS[Math.round(floatFromX(ev.clientX))].id);
      }
      drag.current.active = false;
      setLive(null);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const indicatorIndex = live ?? idx;
  const activeIndex = live !== null ? Math.round(live) : idx;

  return (
    <div className="flex justify-center">
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        className="relative flex items-stretch w-full max-w-[500px] p-1.5 rounded-full bg-white/30 backdrop-blur-xl border border-white/50 shadow-[0_12px_32px_rgba(31,38,135,0.08),inset_0_1px_2px_rgba(255,255,255,0.35)] cursor-grab active:cursor-grabbing touch-none select-none"
      >
        {/* Скользящая капсула */}
        <div
          className="absolute top-1.5 left-1.5 h-[calc(100%-12px)] rounded-full bg-white/55 backdrop-blur-md z-0"
          style={{
            width: `calc((100% - 12px) / ${REGIONS.length})`,
            transform: `translateX(${indicatorIndex * 100}%)`,
            transition: live !== null ? 'none' : 'transform 0.7s cubic-bezier(.34,.66,0,1)',
            boxShadow: '0 6px 18px rgba(15,23,42,0.12), 0 0 0 1px var(--accent-soft)',
          }}
        />
        {REGIONS.map((r, i) => {
          const active = i === activeIndex;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setRegion(r.id)}
              aria-pressed={r.id === region}
              className="relative z-10 flex-1 min-w-0 rounded-full py-2.5 px-1.5 text-[15px] font-semibold whitespace-nowrap cursor-grab active:cursor-grabbing transition-colors duration-500"
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
