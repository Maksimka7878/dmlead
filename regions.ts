export type RegionId = 'msk' | 'spb' | 'phuket' | 'uae';

export interface RegionTheme {
  id: RegionId;
  label: string;
  accent: string;
  accent2: string;
  soft: string;
  blob1: string;
  blob2: string;
  blob3: string;
}

// Цвета взяты из дизайна claude-design «DMLeads Регионы».
// Меняются только акцент + фоновые блобы — раскладка не трогается.
export const REGIONS: RegionTheme[] = [
  {
    id: 'msk',
    label: 'Москва',
    accent: '#2563EB',
    accent2: '#6366F1',
    soft: 'rgba(37,99,235,0.12)',
    blob1: 'rgba(96,165,250,0.45)',
    blob2: 'rgba(167,139,250,0.40)',
    blob3: 'rgba(129,140,248,0.40)',
  },
  {
    id: 'spb',
    label: 'Петербург',
    accent: '#176E54',
    accent2: '#C49A3E',
    soft: 'rgba(23,110,84,0.13)',
    blob1: 'rgba(86,150,120,0.42)',
    blob2: 'rgba(210,178,118,0.40)',
    blob3: 'rgba(70,108,98,0.36)',
  },
  {
    id: 'phuket',
    label: 'Пхукет',
    accent: '#0E9C9C',
    accent2: '#27C29E',
    soft: 'rgba(14,156,156,0.13)',
    blob1: 'rgba(45,200,180,0.40)',
    blob2: 'rgba(110,205,235,0.40)',
    blob3: 'rgba(248,214,150,0.36)',
  },
  {
    id: 'uae',
    label: 'ОАЭ',
    accent: '#C28E1E',
    accent2: '#A8631B',
    soft: 'rgba(194,142,30,0.14)',
    blob1: 'rgba(228,198,128,0.46)',
    blob2: 'rgba(240,220,168,0.44)',
    blob3: 'rgba(198,158,108,0.40)',
  },
];

export const DEFAULT_REGION: RegionId = 'msk';

export const getTheme = (id: RegionId): RegionTheme =>
  REGIONS.find((r) => r.id === id) || REGIONS[0];
