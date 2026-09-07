export enum MarketType {
  PRIMARY = 'PRIMARY',
  COMMERCIAL = 'COMMERCIAL'
}

export interface PricingTier {
  name: string;
  description: string;
  price: number;
  /** Цена в режиме «без замен»: нецелевые лиды не заменяются. */
  priceNoReplace: number;
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
