import { MarketType, MarketCategory, DiscountRule } from './types';
import { Phone, Users, CheckCircle, ShieldAlert, BadgeCheck, FileText, Ban, CreditCard } from 'lucide-react';
import React from 'react';

export const PRICING_DATA: MarketCategory[] = [
  {
    id: MarketType.PRIMARY,
    title: 'Новостройки (Первичный рынок)',
    tiers: [
      { name: 'Стандарт', description: 'Бюджет до 20 млн ₽', price: 3500 },
      { name: 'Бизнес', description: 'Объекты до 800 000 ₽/м²', price: 5000 },
      { name: 'Премиум', description: 'Объекты до 1 200 000 ₽/м²', price: 7000 },
      { name: 'De Luxe', description: 'Объекты от 1 200 000 ₽/м²', price: 10000 },
    ]
  },
  {
    id: MarketType.SECONDARY,
    title: 'Вторичная недвижимость',
    tiers: [
      { name: 'Стандарт', description: 'Запрос 20–60 млн ₽', price: 2500 },
      { name: 'Премиум', description: 'Запрос от 60 млн ₽', price: 4000 },
    ]
  },
  {
    id: MarketType.COMMERCIAL,
    title: 'Коммерческая недвижимость',
    tiers: [
      { name: 'Стандарт', description: 'Запрос 20–50 млн ₽', price: 4000 },
      { name: 'Премиум', description: 'Запрос от 50 млн ₽', price: 6000 },
    ]
  }
];

export const DISCOUNTS: DiscountRule[] = [
  { minCount: 50, percentage: 20 },
  { minCount: 30, percentage: 10 },
  { minCount: 0, percentage: 0 },
];

export const GUARANTEES = [
  {
    id: 1,
    title: "Клиент не отвечает",
    scenario: "После 3+ попыток контакта в разные дни и время клиент не берёт трубку.",
    proof: "Скриншоты звонков с датами.",
    icon: <Phone className="w-6 h-6 text-red-500" />
  },
  {
    id: 2,
    title: "Ошибка в данных",
    scenario: "Критичная ошибка в имени или номере, препятствующая связи.",
    proof: "Описание ошибки.",
    icon: <ShieldAlert className="w-6 h-6 text-orange-500" />
  },
  {
    id: 3,
    title: "Прямой отказ",
    scenario: "Клиент сообщает, что не интересуется покупкой.",
    proof: "Скриншот переписки или запись.",
    icon: <Ban className="w-6 h-6 text-red-600" />
  },
  {
    id: 4,
    title: "Несоответствие бюджета",
    scenario: "Клиент ищет 'Стандарт', хотя лид продан как 'Бизнес'.",
    proof: "Запись диалога.",
    icon: <CreditCard className="w-6 h-6 text-yellow-500" />
  }
];

export const PROCESS_STEPS = [
  {
    title: "Согласование",
    desc: "Определяем количество, сегменты и темп передачи лидов.",
    icon: <Users className="w-8 h-8 text-blue-600" />
  },
  {
    title: "Оплата",
    desc: "Фиксируем стоимость, выставляем счет, бронируем объем.",
    icon: <FileText className="w-8 h-8 text-blue-600" />
  },
  {
    title: "Передача",
    desc: "Моментальная передача после квалификации без очередей.",
    icon: <CheckCircle className="w-8 h-8 text-blue-600" />
  },
  {
    title: "Обратная связь",
    desc: "В течение 5 дней даете фидбек. Бесплатная замена брака.",
    icon: <BadgeCheck className="w-8 h-8 text-blue-600" />
  }
];
