import { Block, FaqItem, Landing } from './types';
import { CITIES, City, cityById } from './geo';
import { SEGMENTS, Segment, segmentById } from './segments';
import { AUDIENCES, Audience, audienceById } from './audiences';
import { FACTS } from './facts';

/** Детерминированная вариативность формулировок: одинаковый слаг всегда даёт
 *  одинаковый текст (важно для стабильности сборки и canonical), но разные
 *  страницы получают разные вступления и связки. */
const seedOf = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};
const pick = <T,>(arr: readonly T[], seed: string, salt = 0): T =>
  arr[(seedOf(seed) + salt * 2654435761) % arr.length];

const TODAY = '2026-08-21';

const discountText = FACTS.discounts.map((d) => `от ${d.from} — ${d.percent}%`).join(', ');

// ── Переиспользуемые блоки ───────────────────────────────────────────────

const processBlock = (): Block => ({
  t: 'steps',
  items: FACTS.steps.map((s) => ({ title: s.title, text: s.text })),
});

const replacementBlock = (subject: string): Block => ({
  t: 'ul',
  items: FACTS.replacementCases.map((c) => `${c.charAt(0).toUpperCase()}${c.slice(1)} — ${subject} меняется бесплатно.`),
});

const volumeTable = (): Block => ({
  t: 'table',
  caption: 'Скидка зависит от объёма пакета',
  head: ['Объём пакета', 'Скидка', 'Кому подходит'],
  rows: [
    [`от ${FACTS.minPackage} лидов`, '—', 'частный риелтор или тест канала'],
    ['от 30 лидов', '10%', 'небольшой отдел продаж из 2–3 человек'],
    ['от 50 лидов', '15%', 'агентство с устоявшимся регламентом обработки'],
    ['от 100 лидов', '20%', 'застройщик или сеть с планом продаж'],
  ],
});

const priceTable = (): Block => ({
  t: 'table',
  caption: 'Стоимость лида зависит от сегмента и класса объекта',
  head: ['Сегмент', 'Класс объекта', 'Цена лида'],
  rows: [
    ...FACTS.primaryTiers.map((t) => ['Новостройки', `${t.name} — ${t.note}`, `${t.price.toLocaleString('ru-RU')} ₽`]),
    ...FACTS.commercialTiers.map((t) => ['Коммерция', `${t.name} — ${t.note}`, `${t.price.toLocaleString('ru-RU')} ₽`]),
  ],
});

// ── Формулировки-вариации ────────────────────────────────────────────────

const LEAD_OPENERS = [
  'Передаём квалифицированные заявки',
  'Поставляем проверенные заявки',
  'Даём поток заявок',
  'Закрываем потребность отдела продаж в заявках',
];

const CTA_TITLES = [
  'Обсудить пакет лидов',
  'Рассчитать объём под ваш отдел продаж',
  'Запросить тестовый пакет',
  'Согласовать первый пакет',
];

const ctaBlock = (seed: string, text: string): Block => ({
  t: 'cta',
  title: pick(CTA_TITLES, seed),
  text,
});

// ── 1. Город: «Купить лиды на недвижимость в X» ───────────────────────────

const cityLanding = (city: City): Landing => {
  const slug = `kupit-lidy-na-nedvizhimost-${city.id}`;
  const segs = city.segments.map((id) => segmentById(id)!).filter(Boolean);
  const primary = segs[0];

  const blocks: Block[] = [
    { t: 'p', text: `${pick(LEAD_OPENERS, slug)} от людей, которые действительно ищут недвижимость ${city.prep}. Лид передаётся после квалификации: подтверждены сегмент, бюджет и готовность к разговору, поэтому менеджер начинает не с проверки «а вы вообще что-то ищете», а с предметного диалога.` },
    { t: 'h2', text: `Что важно знать о спросе ${city.prep}` },
    { t: 'p', text: city.angle },
    { t: 'p', text: `Чаще всего лиды ${city.prep} покупают ${city.buyers}. Заявки распределяются по локациям и типам объектов — в работе регулярно встречаются направления: ${city.landmarks.join(', ')}.` },
    { t: 'callout', title: 'Как это влияет на квалификацию', text: `Мы не отдаём «просто контакт с номером». Перед передачей уточняем то, что реально определяет сделку ${city.prep}: сегмент, ценовой диапазон, сроки и способ оплаты. Ошибка в любом из этих пунктов — основание для бесплатной замены.` },

    { t: 'h2', text: `Какие сегменты доступны ${city.prep}` },
    { t: 'ul', items: segs.map((s) => `**${s.nom}** — ${s.definition}`) },
    { t: 'p', text: `Базовый спрос ${city.prep} формирует сегмент «${primary.nom}». ${primary.cycle}` },

    { t: 'h2', text: `Что входит в квалификацию лида` },
    { t: 'p', text: `Для сегмента «${primary.nom}» перед передачей подтверждаем:` },
    { t: 'ul', items: primary.qualify },
    { t: 'p', text: `Если хотя бы один пункт не подтверждён, лид не уходит в отдел продаж. Это дороже для нас на этапе квалификации, но дешевле для вас на этапе продаж.` },

    { t: 'h2', text: 'Сколько стоит лид' },
    { t: 'p', text: `Цена привязана к сегменту и классу объекта — ${FACTS.primaryTiers[0].price.toLocaleString('ru-RU')} ₽ за лид в комфорт-классе и до ${FACTS.primaryTiers[3].price.toLocaleString('ru-RU')} ₽ в De Luxe. Минимальный пакет — ${FACTS.minPackage} лидов, скидки по объёму: ${discountText}.` },
    priceTable(),
    volumeTable(),
    { t: 'calc' },

    { t: 'h2', text: 'Как считать окупаемость' },
    { t: 'p', text: `Считайте не цену лида, а стоимость сделки. Формула простая: цена лида ÷ конверсию из лида в сделку = стоимость привлечения одной сделки. Если ваша комиссия ${city.foreign ? 'по зарубежному объекту' : 'по сделке'} кратно выше этой величины, канал окупается — даже при высокой цене за заявку.` },
    { t: 'ol', items: [
      'Возьмите свою реальную конверсию из первого контакта в показ.',
      'Возьмите конверсию из показа в сделку — по факту, а не по плану.',
      'Перемножьте: получите конверсию из лида в сделку.',
      'Разделите цену лида на эту конверсию — это стоимость привлечения сделки.',
      'Сравните со средней комиссией. Разница и есть маржинальность канала.',
    ] },

    { t: 'h2', text: 'Как проходит работа' },
    processBlock(),

    { t: 'h2', text: 'Гарантия замены' },
    { t: 'p', text: `Обратную связь принимаем ${FACTS.feedbackDays} дней с момента передачи. Основания для бесплатной замены:` },
    replacementBlock('лид'),
    { t: 'guarantees' },

    { t: 'h2', text: `Типичные ошибки при работе с лидами ${city.prep}` },
    { t: 'ul', items: primary.pitfalls },
    { t: 'p', text: `Первая ошибка встречается чаще остальных вместе взятых: чем позже первый звонок, тем ниже шанс на диалог. Скорость обработки на стороне отдела продаж влияет на результат сильнее, чем выбор поставщика.` },

    ctaBlock(slug, `Обсудим объём, сегмент и темп передачи под ваш отдел продаж ${city.prep}. Стартовый пакет — от ${FACTS.minPackage} лидов.`),
  ];

  const faq: FaqItem[] = [
    { q: `Сколько стоит купить лиды на недвижимость ${city.prep}?`, a: `Цена зависит от сегмента и класса объекта: от ${FACTS.primaryTiers[0].price.toLocaleString('ru-RU')} ₽ за лид в комфорт-классе до ${FACTS.primaryTiers[3].price.toLocaleString('ru-RU')} ₽ в De Luxe, коммерция — ${FACTS.commercialTiers[0].price.toLocaleString('ru-RU')} ₽. При объёме действуют скидки: ${discountText}.` },
    { q: 'Какой минимальный пакет?', a: `${FACTS.minPackage} лидов. Этого достаточно, чтобы оценить качество заявок и посчитать конверсию, не перегружая отдел продаж.` },
    { q: 'Как быстро лид попадает в работу?', a: `В течение ${FACTS.transferMinutes} минут после квалификации. В недвижимости скорость первого контакта напрямую определяет, дойдёт ли клиент до показа.` },
    { q: 'Что делать, если лид оказался нецелевым?', a: `Сообщите в течение ${FACTS.feedbackDays} дней с подтверждением — заменим бесплатно. Основания: клиент недоступен после 3+ попыток, ошибка в контактных данных, прямой отказ, несоответствие бюджета сегменту.` },
    { q: `Лиды ${city.prep} эксклюзивные?`, a: 'Да. Заявка передаётся одному покупателю — вы не конкурируете за одного и того же клиента с другим агентством, купившим тот же лид.' },
    { q: `Какие сегменты доступны ${city.prep}?`, a: `${segs.map((s) => s.nom).join(', ')}. Сегмент фиксируется до старта, лид из другого сегмента считается нецелевым и подлежит замене.` },
  ];

  return {
    kind: 'landing',
    slug,
    section: 'Города',
    cityId: city.id,
    h1: `Купить лиды на недвижимость ${city.prep}`,
    title: `Купить лиды на недвижимость ${city.prep} — цена от ${FACTS.primaryTiers[0].price.toLocaleString('ru-RU')} ₽`,
    description: `Купить квалифицированные лиды на недвижимость ${city.prep}: передача за ${FACTS.transferMinutes} минут, бесплатная замена нецелевых ${FACTS.feedbackDays} дней, пакет от ${FACTS.minPackage} лидов. Цена от ${FACTS.primaryTiers[0].price.toLocaleString('ru-RU')} ₽.`,
    keywords: [
      `купить лиды на недвижимость ${city.prep}`,
      `лиды на недвижимость ${city.nom.toLowerCase()}`,
      `клиенты на недвижимость ${city.nom.toLowerCase()}`,
      `заявки на недвижимость ${city.nom.toLowerCase()}`,
      `лидогенерация недвижимость ${city.nom.toLowerCase()}`,
    ],
    lead: `Квалифицированные заявки от покупателей недвижимости ${city.prep}: передача за ${FACTS.transferMinutes} минут, эксклюзивность, бесплатная замена нецелевых в течение ${FACTS.feedbackDays} дней.`,
    blocks,
    faq,
    isoDate: '2026-04-01',
    updatedIso: TODAY,
    related: [
      ...segs.slice(0, 3).map((s) => `lidy-${s.id}-${city.id}`),
      'stoimost-lidov-na-nedvizhimost',
      'kupit-lidy-na-nedvizhimost',
    ],
  };
};

// ── 2. Город × сегмент ────────────────────────────────────────────────────

const citySegmentLanding = (city: City, seg: Segment): Landing => {
  const slug = `lidy-${seg.id}-${city.id}`;
  const blocks: Block[] = [
    { t: 'p', text: `${seg.phrase.charAt(0).toUpperCase()}${seg.phrase.slice(1)} ${city.prep} — это заявки, прошедшие квалификацию именно под этот сегмент. ${seg.definition}` },

    { t: 'h2', text: `Специфика сегмента ${city.prep}` },
    { t: 'p', text: city.angle },
    { t: 'p', text: `Наложите на это особенности сегмента: ${seg.cycle.charAt(0).toLowerCase()}${seg.cycle.slice(1)}` },
    { t: 'p', text: `Локальные ориентиры, которые чаще всего фигурируют в заявках: ${city.landmarks.join(', ')}. Покупатели таких лидов ${city.prep} — ${city.buyers}.` },

    { t: 'h2', text: 'Что подтверждаем до передачи' },
    { t: 'ul', items: seg.qualify },
    { t: 'callout', title: 'Почему это не формальность', text: `В сегменте «${seg.nom}» несовпадение по одному параметру обесценивает всю заявку. Поэтому несоответствие подтверждённым параметрам — прямое основание для бесплатной замены в течение ${FACTS.feedbackDays} дней.` },

    { t: 'h2', text: 'Возражения, к которым готовить менеджеров' },
    { t: 'ul', items: seg.objections },
    { t: 'p', text: `Эти возражения возникают не из-за качества лида, а из-за природы сегмента. Квалифицированный лид не отменяет работу с возражениями — он лишь гарантирует, что вы обсуждаете их с человеком, которому объект действительно нужен.` },

    { t: 'h2', text: 'Что убивает конверсию' },
    { t: 'ul', items: seg.pitfalls },

    { t: 'h2', text: 'Цена и объём' },
    { t: 'p', text: `Стоимость лида ${city.prep} определяется классом объекта: ${FACTS.primaryTiers.map((t) => `${t.name} — ${t.price.toLocaleString('ru-RU')} ₽`).join(', ')}. Коммерческие направления — ${FACTS.commercialTiers[0].price.toLocaleString('ru-RU')} ₽. Минимальный пакет ${FACTS.minPackage} лидов, скидки: ${discountText}.` },
    volumeTable(),
    { t: 'calc' },

    { t: 'h2', text: 'Регламент работы' },
    processBlock(),
    { t: 'guarantees' },

    ctaBlock(slug, `Соберём пакет ${seg.phrase} ${city.prep} под пропускную способность вашего отдела продаж.`),
  ];

  const faq: FaqItem[] = [
    { q: `Чем ${seg.phrase} отличаются от обычных заявок?`, a: `Перед передачей подтверждается ${seg.qualify.slice(0, 3).join(', ')}. Обычная заявка с формы этих данных не содержит, и менеджер выясняет их сам — за ваш счёт.` },
    { q: `Сколько стоят ${seg.phrase} ${city.prep}?`, a: `От ${FACTS.primaryTiers[0].price.toLocaleString('ru-RU')} ₽ за лид в зависимости от класса объекта и сегмента. Точную цену фиксируем при согласовании пакета.` },
    { q: 'Какой цикл сделки в этом сегменте?', a: seg.cycle },
    { q: 'Что считается нецелевым лидом?', a: `${FACTS.replacementCases.join('; ')}. Любой из случаев — бесплатная замена в течение ${FACTS.feedbackDays} дней.` },
    { q: `Можно ли ограничить лиды конкретными районами ${city.gen}?`, a: `Да, локация фиксируется на этапе согласования. Ориентиры, с которыми обычно работаем: ${city.landmarks.join(', ')}.` },
  ];

  return {
    kind: 'landing',
    slug,
    section: 'Сегменты по городам',
    cityId: city.id,
    segmentId: seg.id,
    h1: `${seg.phrase.charAt(0).toUpperCase()}${seg.phrase.slice(1)} ${city.prep}`,
    title: `${seg.phrase.charAt(0).toUpperCase()}${seg.phrase.slice(1)} ${city.prep} — купить с гарантией замены`,
    description: `${seg.phrase.charAt(0).toUpperCase()}${seg.phrase.slice(1)} ${city.prep}: квалификация по ${seg.qualify.length} параметрам, передача за ${FACTS.transferMinutes} минут, замена нецелевых ${FACTS.feedbackDays} дней.`,
    keywords: [
      `${seg.phrase} ${city.nom.toLowerCase()}`,
      `купить ${seg.phrase} ${city.nom.toLowerCase()}`,
      `${seg.nom.toLowerCase()} лиды ${city.nom.toLowerCase()}`,
      `клиенты ${seg.prep} ${city.nom.toLowerCase()}`,
    ],
    lead: `Заявки от покупателей в сегменте «${seg.nom}» ${city.prep} — с подтверждённым бюджетом, сроками и готовностью к разговору.`,
    blocks,
    faq,
    isoDate: '2026-04-08',
    updatedIso: TODAY,
    related: [`kupit-lidy-na-nedvizhimost-${city.id}`, `kupit-lidy-${seg.id}`, 'stoimost-lidov-na-nedvizhimost'],
  };
};

// ── 3. Сегмент по России ─────────────────────────────────────────────────

const segmentLanding = (seg: Segment): Landing => {
  const slug = `kupit-lidy-${seg.id}`;
  const cities = CITIES.filter((c) => c.segments.includes(seg.id)).slice(0, 12);
  const blocks: Block[] = [
    { t: 'p', text: `${seg.definition} Мы передаём заявки, прошедшие квалификацию под этот сегмент, а не общий поток «интересуюсь недвижимостью».` },

    { t: 'h2', text: `Кому нужны ${seg.phrase}` },
    { t: 'p', text: `Сегмент востребован у агентств, застройщиков и брокеров, которые уже умеют доводить клиента до сделки, но упираются во входящий поток. Покупка лидов здесь заменяет не отдел продаж, а нестабильный собственный маркетинг.` },

    { t: 'h2', text: 'Что подтверждаем при квалификации' },
    { t: 'ul', items: seg.qualify },
    { t: 'p', text: `Набор параметров не универсальный: он собран именно под этот сегмент. В аренде бессмысленно спрашивать про эскроу, а в инвестициях — про количество комнат.` },

    { t: 'h2', text: 'Цикл сделки' },
    { t: 'p', text: seg.cycle },

    { t: 'h2', text: 'Возражения на первом контакте' },
    { t: 'ul', items: seg.objections },

    { t: 'h2', text: 'Частые ошибки покупателей лидов' },
    { t: 'ul', items: seg.pitfalls },

    { t: 'h2', text: 'География' },
    { t: 'p', text: `Работаем по направлениям, где сегмент реально живой: ${cities.map((c) => c.nom).join(', ')}. Для каждого города фиксируем локации и ценовой диапазон до старта.` },

    { t: 'h2', text: 'Цена и пакеты' },
    priceTable(),
    volumeTable(),
    { t: 'calc' },

    { t: 'h2', text: 'Регламент' },
    processBlock(),
    { t: 'guarantees' },

    ctaBlock(slug, `Обсудим пакет ${seg.phrase} под ваш регион и объём отдела продаж.`),
  ];

  const faq: FaqItem[] = [
    { q: `Что такое ${seg.phrase}?`, a: `${seg.definition} Лид считается квалифицированным, когда подтверждены: ${seg.qualify.join(', ')}.` },
    { q: 'Какая цена?', a: `От ${FACTS.primaryTiers[0].price.toLocaleString('ru-RU')} ₽ до ${FACTS.primaryTiers[3].price.toLocaleString('ru-RU')} ₽ в зависимости от класса объекта, коммерция — ${FACTS.commercialTiers[0].price.toLocaleString('ru-RU')} ₽. Скидки по объёму: ${discountText}.` },
    { q: 'Сколько лидов брать на старте?', a: `Минимальный пакет — ${FACTS.minPackage} лидов. Ориентируйтесь на пропускную способность: покупать больше, чем отдел продаж успевает обработать за неделю, — прямой способ обесценить канал.` },
    { q: 'В каких городах доступен сегмент?', a: `${cities.map((c) => c.nom).join(', ')} и другие направления по согласованию.` },
    { q: 'Есть ли гарантия?', a: `Да: ${FACTS.feedbackDays} дней на обратную связь и бесплатная замена нецелевых лидов по фиксированному списку оснований.` },
  ];

  return {
    kind: 'landing',
    slug,
    section: 'Сегменты',
    segmentId: seg.id,
    h1: `Купить ${seg.phrase}`,
    title: `Купить ${seg.phrase} — цена, квалификация, гарантия замены`,
    description: `${seg.phrase.charAt(0).toUpperCase()}${seg.phrase.slice(1)} с квалификацией до передачи. Пакет от ${FACTS.minPackage} лидов, передача за ${FACTS.transferMinutes} минут, замена нецелевых ${FACTS.feedbackDays} дней.`,
    keywords: [seg.phrase, `купить ${seg.phrase}`, `${seg.nom.toLowerCase()} лиды`, `клиенты ${seg.prep}`, `заявки ${seg.prep}`],
    lead: `${seg.definition}`,
    blocks,
    faq,
    isoDate: '2026-04-03',
    updatedIso: TODAY,
    related: ['kupit-lidy-na-nedvizhimost', 'stoimost-lidov-na-nedvizhimost', ...cities.slice(0, 3).map((c) => `lidy-${seg.id}-${c.id}`)],
  };
};

// ── 4. Аудитория ─────────────────────────────────────────────────────────

const audienceLanding = (aud: Audience): Landing => {
  const slug = `lidy-dlya-${aud.id}`;
  const blocks: Block[] = [
    { t: 'p', text: aud.pain },
    { t: 'h2', text: `Как ${aud.nom.toLowerCase()} обрабатывает лиды` },
    { t: 'p', text: aud.process },
    { t: 'h2', text: `Что для ${aud.gen} означает «хороший лид»` },
    { t: 'ul', items: aud.criteria },
    { t: 'callout', title: 'Объём', text: aud.volume },

    { t: 'h2', text: 'Что мы делаем до передачи' },
    { t: 'p', text: `Квалифицируем заявку по параметрам сегмента: тип объекта, бюджет, сроки, способ оплаты и готовность к контакту. Лид уходит ${aud.dat} в течение ${FACTS.transferMinutes} минут после подтверждения — пока интерес клиента ещё горячий.` },
    processBlock(),

    { t: 'h2', text: 'Цена' },
    priceTable(),
    volumeTable(),
    { t: 'calc' },

    { t: 'h2', text: 'Гарантия' },
    { t: 'p', text: `${FACTS.feedbackDays} дней на обратную связь, бесплатная замена по основаниям:` },
    replacementBlock('заявка'),
    { t: 'guarantees' },

    ctaBlock(slug, `Подберём объём и сегмент под процесс, который уже работает у вас.`),
  ];

  const faq: FaqItem[] = [
    { q: `Подойдут ли ваши лиды ${aud.dat}?`, a: `Да, если ${aud.criteria[0]}. Сегмент и бюджетный диапазон фиксируются до старта, поэтому заявки попадают в вашу специализацию.` },
    { q: 'С какого объёма начинать?', a: aud.volume },
    { q: 'Лиды эксклюзивные?', a: 'Да, заявка передаётся одному покупателю и не дублируется конкурентам.' },
    { q: 'Что если лид нецелевой?', a: `Бесплатная замена в течение ${FACTS.feedbackDays} дней при подтверждении одного из оснований: ${FACTS.replacementCases.join('; ')}.` },
  ];

  return {
    kind: 'landing',
    slug,
    section: 'Кому подходит',
    audienceId: aud.id,
    h1: `Лиды на недвижимость для ${aud.gen}`,
    title: `Лиды на недвижимость для ${aud.gen} — под ваш процесс продаж`,
    description: `${aud.pain} Квалифицированные лиды с передачей за ${FACTS.transferMinutes} минут и заменой нецелевых в течение ${FACTS.feedbackDays} дней.`,
    keywords: [
      `лиды для ${aud.gen}`,
      `клиенты для ${aud.gen}`,
      `купить лиды ${aud.nom.toLowerCase()}`,
      `заявки на недвижимость ${aud.nom.toLowerCase()}`,
    ],
    lead: aud.pain,
    blocks,
    faq,
    isoDate: '2026-04-05',
    updatedIso: TODAY,
    related: ['kupit-lidy-na-nedvizhimost', 'stoimost-lidov-na-nedvizhimost', 'kupit-lidy-novostroyki'],
  };
};

// ── 5. Аудитория × сегмент ───────────────────────────────────────────────

const audienceSegmentLanding = (aud: Audience, seg: Segment): Landing => {
  const slug = `lidy-${seg.id}-dlya-${aud.id}`;
  const blocks: Block[] = [
    { t: 'p', text: `${aud.pain} В сегменте «${seg.nom}» это ощущается особенно остро: ${seg.cycle.charAt(0).toLowerCase()}${seg.cycle.slice(1)}` },
    { t: 'h2', text: 'Что подтверждаем перед передачей' },
    { t: 'ul', items: seg.qualify },
    { t: 'h2', text: `Как это ложится на процесс ${aud.gen}` },
    { t: 'p', text: aud.process },
    { t: 'ul', items: aud.criteria },
    { t: 'h2', text: 'Возражения и узкие места' },
    { t: 'ul', items: seg.objections },
    { t: 'p', text: `Отдельно готовьте команду к тому, что убивает конверсию именно здесь: ${seg.pitfalls.join('; ')}.` },
    { t: 'h2', text: 'Объём и цена' },
    { t: 'callout', title: 'Рекомендованный старт', text: aud.volume },
    volumeTable(),
    { t: 'calc' },
    processBlock(),
    { t: 'guarantees' },
    ctaBlock(slug, `Соберём пакет ${seg.phrase} под задачи ${aud.gen}.`),
  ];

  const faq: FaqItem[] = [
    { q: `Почему ${seg.phrase} подходят ${aud.dat}?`, a: `Потому что ${aud.criteria[0]}, а квалификация в этом сегменте как раз это и подтверждает: ${seg.qualify.slice(0, 3).join(', ')}.` },
    { q: 'Сколько лидов брать?', a: aud.volume },
    { q: 'Какой цикл сделки?', a: seg.cycle },
    { q: 'Есть замена?', a: `Да, ${FACTS.feedbackDays} дней на обратную связь и бесплатная замена нецелевых.` },
  ];

  return {
    kind: 'landing',
    slug,
    section: 'Кому подходит',
    audienceId: aud.id,
    segmentId: seg.id,
    h1: `${seg.phrase.charAt(0).toUpperCase()}${seg.phrase.slice(1)} для ${aud.gen}`,
    title: `${seg.phrase.charAt(0).toUpperCase()}${seg.phrase.slice(1)} для ${aud.gen}`,
    description: `${seg.phrase.charAt(0).toUpperCase()}${seg.phrase.slice(1)} под процесс ${aud.gen}: квалификация до передачи, ${FACTS.transferMinutes} минут на передачу, замена нецелевых ${FACTS.feedbackDays} дней.`,
    keywords: [`${seg.phrase} для ${aud.gen}`, `лиды ${aud.nom.toLowerCase()} ${seg.nom.toLowerCase()}`, `клиенты ${seg.prep} ${aud.nom.toLowerCase()}`],
    lead: `${seg.phrase.charAt(0).toUpperCase()}${seg.phrase.slice(1)}, собранные под то, как реально работает ${aud.nom.toLowerCase()}.`,
    blocks,
    faq,
    isoDate: '2026-04-10',
    updatedIso: TODAY,
    related: [`lidy-dlya-${aud.id}`, `kupit-lidy-${seg.id}`],
  };
};

export const LANDING_BUILDERS = { cityLanding, citySegmentLanding, segmentLanding, audienceLanding, audienceSegmentLanding };

// ── Сборка каталога ──────────────────────────────────────────────────────

// Города, под которые делаются отдельные посадочные по сегментам.
// Список расширяется по мере появления спроса — на каждый город
// приходится до четырёх сегментных страниц.
const TOP_CITIES = [
  'moskva', 'sankt-peterburg', 'dubai', 'sochi', 'krasnodar', 'kazan',
  'ekaterinburg', 'novosibirsk', 'phuket', 'nizhniy-novgorod', 'rostov-na-donu', 'tyumen',
  'chelyabinsk', 'samara', 'ufa', 'perm', 'voronezh', 'krasnoyarsk',
  'kaliningrad', 'vladivostok', 'abu-dhabi', 'antalya', 'stambul', 'bali',
];

const AUD_SEG_COMBOS: [string, string][] = [
  ['agentstvo', 'novostroyki'], ['agentstvo', 'vtorichka'], ['agentstvo', 'ipoteka'],
  ['rieltor', 'vtorichka'], ['rieltor', 'novostroyki'], ['rieltor', 'arenda'],
  ['zastroyshchik', 'novostroyki'], ['zastroyshchik', 'ipoteka'], ['zastroyshchik', 'investicii'],
  ['otdel-prodazh', 'novostroyki'], ['otdel-prodazh', 'vtorichka'], ['otdel-prodazh', 'kommercheskaya'],
  ['broker', 'premium'], ['broker', 'kommercheskaya'], ['broker', 'zagorodnaya'],
  ['investicionnoe-agentstvo', 'investicii'], ['investicionnoe-agentstvo', 'zarubezhnaya'], ['investicionnoe-agentstvo', 'premium'],
];

export const buildLandings = (): Landing[] => {
  const out: Landing[] = [];

  for (const c of CITIES) out.push(cityLanding(c));

  for (const id of TOP_CITIES) {
    const c = cityById(id);
    if (!c) continue;
    for (const sid of c.segments.slice(0, 4)) {
      const s = segmentById(sid);
      if (s) out.push(citySegmentLanding(c, s));
    }
  }

  for (const s of SEGMENTS) out.push(segmentLanding(s));
  for (const a of AUDIENCES) out.push(audienceLanding(a));

  for (const [aid, sid] of AUD_SEG_COMBOS) {
    const a = audienceById(aid);
    const s = segmentById(sid);
    if (a && s) out.push(audienceSegmentLanding(a, s));
  }

  return out;
};
