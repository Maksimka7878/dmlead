import { MarketType, MarketCategory, DiscountRule } from './types';

export const PRICING_DATA: MarketCategory[] = [
  {
    id: MarketType.PRIMARY,
    title: 'Новостройки',
    tiers: [
      { name: 'Комфорт', description: 'Объекты до 500 000 ₽/м²', price: 3600, priceNoReplace: 1800 },
      { name: 'Бизнес', description: 'Объекты до 800 000 ₽/м²', price: 7700, priceNoReplace: 5775 },
      { name: 'Премиум', description: 'Объекты до 1 200 000 ₽/м²', price: 11600, priceNoReplace: 8700 },
      { name: 'De Luxe', description: 'Объекты от 1 200 000 ₽/м²', price: 17000, priceNoReplace: 12750 },
    ]
  },
  {
    id: MarketType.COMMERCIAL,
    title: 'Коммерция',
    tiers: [
      { name: 'Офисы', description: 'Классы А, Б', price: 7700, priceNoReplace: 5775 },
      { name: 'Ритейл', description: 'Торговые помещения', price: 7700, priceNoReplace: 5775 },
    ]
  }
];

export const DISCOUNTS: DiscountRule[] = [
  { minCount: 100, percentage: 20 },
  { minCount: 75, percentage: 17.5 },
  { minCount: 50, percentage: 15 },
  { minCount: 30, percentage: 10 },
  { minCount: 0, percentage: 0 },
];

export const GUARANTEES = [
  {
    id: 1,
    title: "Клиент не отвечает",
    scenario: "После 3+ попыток контакта в разные дни и время клиент не берёт трубку.",
    proof: "Скриншоты звонков с датами"
  },
  {
    id: 2,
    title: "Ошибка в данных",
    scenario: "Критичная ошибка в имени или номере, препятствующая связи.",
    proof: "Описание ошибки"
  },
  {
    id: 3,
    title: "Прямой отказ",
    scenario: "Клиент сообщает, что не интересуется покупкой.",
    proof: "Скриншот переписки или запись"
  },
  {
    id: 4,
    title: "Несоответствие бюджета",
    scenario: "Клиент ищет 'Комфорт', хотя лид продан как 'Бизнес'.",
    proof: "Запись диалога"
  }
];
