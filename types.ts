export enum MarketType {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  COMMERCIAL = 'COMMERCIAL'
}

export interface PricingTier {
  name: string;
  description: string;
  price: number;
}

export interface MarketCategory {
  id: MarketType;
  title: string;
  tiers: PricingTier[];
}

export interface DiscountRule {
  minCount: number;
  percentage: number;
}
