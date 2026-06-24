import React from 'react';
import { useRegion } from './RegionContext';

// Декоративные региональные силуэты для hero (из дизайна «DMLeads Регионы»).
// Кросс-фейд по выбранному региону, цвет тянется из --accent. На раскладку не влияет.
const SILHOUETTES: Record<string, React.ReactNode> = {
  msk: (
    <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax meet" style={{ width: '100%', height: '100%' }}>
      <g fill="currentColor" fillOpacity="0.11">
        <rect x="120" y="150" width="64" height="150" />
        <polygon points="210,300 210,90 252,58 294,90 294,300" />
        <rect x="330" y="120" width="74" height="180" />
        <polygon points="440,300 446,96 488,118 494,300" />
        <rect x="540" y="70" width="86" height="230" />
        <rect x="660" y="120" width="58" height="180" />
        <rect x="752" y="160" width="70" height="140" />
        <rect x="900" y="100" width="96" height="200" />
        <rect x="930" y="56" width="36" height="48" />
        <polygon points="948,12 934,56 962,56" />
        <rect x="946" y="-2" width="4" height="16" />
        <rect x="1030" y="170" width="60" height="130" />
      </g>
    </svg>
  ),
  spb: (
    <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax meet" style={{ width: '100%', height: '100%' }}>
      <g fill="currentColor" fillOpacity="0.11">
        <rect x="300" y="150" width="34" height="150" />
        <polygon points="305,150 317,40 329,150" />
        <rect x="540" y="150" width="120" height="150" />
        <path d="M540,150 Q600,58 660,150 Z" />
        <rect x="592" y="108" width="16" height="20" />
        <rect x="597" y="86" width="6" height="22" />
        <rect x="588" y="92" width="24" height="5" />
        <rect x="470" y="200" width="22" height="100" />
        <polygon points="475,200 481,150 487,200" />
        <rect x="710" y="200" width="22" height="100" />
        <polygon points="715,200 721,150 727,200" />
        <rect x="120" y="232" width="80" height="68" />
        <rect x="850" y="225" width="120" height="75" />
        <rect x="0" y="288" width="1200" height="12" />
      </g>
    </svg>
  ),
  phuket: (
    <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax meet" style={{ width: '100%', height: '100%' }}>
      <g fill="none" stroke="currentColor" strokeOpacity="0.16" strokeWidth="6" strokeLinecap="round">
        <path d="M250,300 C254,230 248,200 240,168" />
        <path d="M240,162 C210,150 180,156 156,172" />
        <path d="M240,162 C268,150 300,156 322,176" />
        <path d="M240,162 C224,138 206,124 182,116" />
        <path d="M240,162 C258,138 282,126 308,120" />
        <path d="M240,164 C240,140 240,124 240,108" />
        <path d="M560,300 C565,222 558,190 549,156" />
        <path d="M549,150 C516,138 484,144 458,162" />
        <path d="M549,150 C582,138 616,144 642,166" />
        <path d="M549,150 C532,124 512,110 486,102" />
        <path d="M549,150 C568,124 594,112 622,106" />
      </g>
      <g fill="currentColor" fillOpacity="0.10">
        <circle cx="940" cy="120" r="56" />
      </g>
      <g fill="none" stroke="currentColor" strokeOpacity="0.13" strokeWidth="6" strokeLinecap="round">
        <path d="M0,286 q150,-26 300,0 t300,0 t300,0 t300,0" />
      </g>
    </svg>
  ),
  uae: (
    <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax meet" style={{ width: '100%', height: '100%' }}>
      <g fill="currentColor" fillOpacity="0.11">
        <polygon points="566,300 566,210 576,210 576,150 584,150 584,98 591,98 591,52 596,52 596,20 599,20 599,2 601,2 601,20 604,20 604,52 609,52 609,98 616,98 616,150 624,150 624,210 634,210 634,300" />
        <rect x="430" y="180" width="56" height="120" />
        <polygon points="430,180 458,150 486,180" />
        <rect x="714" y="160" width="64" height="140" />
        <rect x="330" y="220" width="40" height="80" />
        <rect x="820" y="210" width="46" height="90" />
      </g>
      <g fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="6" strokeLinecap="round">
        <path d="M0,290 q200,-34 400,-6 q200,28 400,-2 q200,-26 400,2" />
      </g>
    </svg>
  ),
};

const RegionSilhouettes: React.FC = () => {
  const { region } = useRegion();

  return (
    <div className="pointer-events-none absolute inset-x-0 -bottom-1 h-[360px] z-0">
      {Object.entries(SILHOUETTES).map(([id, svg]) => (
        <div
          key={id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ color: 'var(--accent)', opacity: id === region ? 1 : 0 }}
        >
          {svg}
        </div>
      ))}
    </div>
  );
};

export default RegionSilhouettes;
