import React, { useState } from 'react';
import { MarketType, PricingTier } from '../types';
import { PRICING_DATA, DISCOUNTS } from '../constants';
import { usePricingMode, tierPrice } from './PricingMode';
import { useAnimatedNumber } from './useAnimatedNumber';
import { TELEGRAM } from '../site';
import { Arrow } from './Icons';

const ruble = (n: number) => `${Math.round(n).toLocaleString('ru-RU')} ₽`;

const MIN_LEADS = 10;
const MAX_LEADS = 1000;
const PRESETS = [10, 30, 50, 75, 100];

const pct = (n: number) => `${String(n).replace('.', ',')}%`;
const leads = (n: number) => {
  const m10 = n % 10, m100 = n % 100;
  const word = m10 === 1 && m100 !== 11 ? 'лид' : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? 'лида' : 'лидов';
  return `${n} ${word}`;
};

const discountFor = (count: number) => (DISCOUNTS.find((d) => count >= d.minCount) ?? { percentage: 0 }).percentage;

/** Позиция составного пакета: сегмент и количество. */
interface Item { market: MarketType; tier: string; qty: number }

const categoryOf = (m: MarketType) => PRICING_DATA.find((c) => c.id === m) ?? PRICING_DATA[0];
const tierOf = (it: Item): PricingTier => categoryOf(it.market).tiers.find((t) => t.name === it.tier) ?? categoryOf(it.market).tiers[0];

const Step: React.FC<{ n: number; title: string; aside?: React.ReactNode; children: React.ReactNode }> = ({ n, title, aside, children }) => (
  <fieldset className="min-w-0">
    <legend className="mb-4 flex w-full items-center justify-between gap-3">
      <span className="flex items-center gap-3 text-[16px] font-semibold text-ink">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-[12px] font-semibold text-white">{n}</span>
        {title}
      </span>
      {aside && <span className="text-[13px] text-muted">{aside}</span>}
    </legend>
    {children}
  </fieldset>
);

/** Калькулятор пакета — повторяет калькулятор новой главной: шаги 1–4 слева,
 *  расчёт справа. Можно собрать составной пакет из нескольких сегментов —
 *  скидка за объём считается по каждому сегменту отдельно. */
const Calculator: React.FC = () => {
  const [items, setItems] = useState<Item[]>([{ market: MarketType.PRIMARY, tier: 'Бизнес', qty: MIN_LEADS }]);
  const [active, setActive] = useState(0);
  const [fresh, setFresh] = useState(-1);
  const [copied, setCopied] = useState(false);
  const { noReplace, setNoReplace } = usePricingMode();

  const cur = items[active];
  const category = categoryOf(cur.market);
  const multi = items.length > 1;

  const lines = items.map((it) => {
    const base = tierPrice(tierOf(it), noReplace);
    const rate = discountFor(it.qty);
    const lead = Math.round(base * (1 - rate / 100)); // как на главной: цена за лид в целых рублях
    return { it, rate, lead, total: lead * it.qty, saved: (base - lead) * it.qty };
  });
  const line = lines[active];
  const total = lines.reduce((s, l) => s + l.total, 0);
  const saved = lines.reduce((s, l) => s + l.saved, 0);
  const qtyAll = items.reduce((s, it) => s + it.qty, 0);
  const animTotal = useAnimatedNumber(total);

  const takenBy = (tier: string) => items.findIndex((it, i) => i !== active && it.tier === tier);
  const freeTier = (m: MarketType) => categoryOf(m).tiers.find((t) => !items.some((it) => it.tier === t.name))?.name;
  const canAdd = Boolean(freeTier(MarketType.PRIMARY) || freeTier(MarketType.COMMERCIAL));

  const patch = (p: Partial<Item>) => setItems((list) => list.map((it, i) => (i === active ? { ...it, ...p } : it)));
  const setQty = (v: number) => patch({ qty: Math.min(MAX_LEADS, Math.max(MIN_LEADS, Math.round(v) || MIN_LEADS)) });

  const setMarket = (m: MarketType) => {
    const own = categoryOf(m).tiers.find((t) => t.name === cur.tier && takenBy(t.name) < 0);
    patch({ market: m, tier: own?.name ?? freeTier(m) ?? categoryOf(m).tiers[0].name });
  };

  const addItem = () => {
    // следующий свободный сегмент того же типа (после бизнеса — премиум), иначе — другого типа
    const names = category.tiers.map((t) => t.name);
    const after = names.slice(names.indexOf(cur.tier) + 1).find((n) => !items.some((it) => it.tier === n));
    let market = cur.market;
    let tier = after ?? freeTier(market);
    if (!tier) {
      market = market === MarketType.PRIMARY ? MarketType.COMMERCIAL : MarketType.PRIMARY;
      tier = freeTier(market);
    }
    if (!tier) return;
    const added: Item = { market, tier, qty: MIN_LEADS };
    setItems((list) => [...list, added]);
    setActive(items.length);
    setFresh(items.length);
  };

  const removeItem = (i: number) => {
    setItems((list) => list.filter((_, j) => j !== i));
    setActive((a) => Math.min(a > i ? a - 1 : a, items.length - 2));
    setFresh(-1);
  };

  const next = DISCOUNTS.filter((d) => d.minCount > cur.qty).sort((a, b) => a.minCount - b.minCount)[0];
  const scope = multi ? `на ${cur.tier}` : 'на весь пакет';

  const tariff = noReplace ? 'без замен' : 'с заменами';
  const summary = multi ? `Составной пакет · ${leads(qtyAll)}` : `${category.title} · ${cur.tier} · ${leads(cur.qty)}`;
  const sendText = multi
    ? [
        `Здравствуйте! Хочу обсудить составной пакет лидов (${tariff}):`,
        ...lines.map((l) => `— ${categoryOf(l.it.market).title}, ${l.it.tier}: ${l.it.qty} шт. × ${ruble(l.lead)}${l.rate ? ` (−${pct(l.rate)})` : ''} = ${ruble(l.total)}`),
        `Итого — ${ruble(total)}.`,
      ].join('\n')
    : `Здравствуйте! Хочу обсудить пакет лидов: ${category.title}, ${cur.tier}, ${cur.qty} шт., ${tariff}. Цена за лид — ${ruble(line.lead)}, итого — ${ruble(total)}.`;

  const copy = () => {
    navigator.clipboard?.writeText(sendText).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 4000);
    }, () => {});
  };

  const pill = (on: boolean, disabled = false) =>
    `rounded-full px-5 min-h-[46px] text-[15.5px] font-medium transition-colors ${on ? 'bg-ink text-white' : 'text-ink-2 hover:text-ink'} ${disabled ? 'opacity-45 cursor-not-allowed' : ''}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:items-start xl:gap-12">
      <div className="grid gap-9">
        {multi && (
          <div className="grid gap-3 rounded-[22px] bg-[rgba(59,130,246,.06)] p-4 shadow-[inset_0_0_0_1px_rgba(59,130,246,.18)]">
            <p className="flex flex-wrap items-baseline gap-x-2.5 text-[15px] font-semibold text-ink">
              Состав пакета <span className="text-[13.5px] font-normal text-muted">нажмите на позицию, чтобы изменить её</span>
            </p>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Позиции пакета">
              {items.map((it, i) => {
                const on = i === active;
                const rate = discountFor(it.qty);
                return (
                  <span
                    key={`${it.tier}-${i}`}
                    className={`inline-flex items-center rounded-full transition-colors ${on ? 'bg-ink text-white' : 'bg-white text-ink shadow-[inset_0_0_0_1px_var(--line-2)]'} ${i === fresh ? 'pack-in' : ''}`}
                  >
                    <button type="button" role="tab" aria-selected={on} onClick={() => { setActive(i); setFresh(-1); }} className="inline-flex min-h-[42px] items-center gap-2 whitespace-nowrap pl-4 pr-1.5 text-[15px] font-medium">
                      {it.tier} · {it.qty}
                      {rate > 0 && <small className={`text-[12.5px] ${on ? 'text-[#8AB0FE]' : 'text-brand'}`}>−{pct(rate)}</small>}
                    </button>
                    <button type="button" aria-label={`Убрать ${it.tier} из пакета`} onClick={() => removeItem(i)} className={`mr-1 grid h-[42px] w-[34px] place-items-center text-[20px] leading-none ${on ? 'text-white/60 hover:text-white' : 'text-muted hover:text-ink'}`}>
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <Step n={1} title="Тип недвижимости">
          <div className="inline-flex rounded-full p-1 shadow-[inset_0_0_0_1px_var(--line-2)]" role="radiogroup" aria-label="Тип недвижимости">
            {PRICING_DATA.map((m) => {
              const blocked = m.id !== cur.market && !freeTier(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={cur.market === m.id}
                  disabled={blocked}
                  onClick={() => setMarket(m.id)}
                  className={pill(cur.market === m.id, blocked)}
                >
                  {m.title}
                </button>
              );
            })}
          </div>
        </Step>

        <Step n={2} title="Сегмент" aside="цена за один лид">
          <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Сегмент">
            {category.tiers.map((t) => {
              const on = t.name === cur.tier;
              const taken = takenBy(t.name) >= 0;
              return (
                <button
                  key={t.name}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  disabled={taken}
                  onClick={() => patch({ tier: t.name })}
                  className={`rounded-[18px] border bg-white p-4 text-left transition-[border-color,box-shadow,background-color] ${
                    on
                      ? 'border-[var(--accent-hi)] bg-[#F3F7FF] shadow-[0_0_0_1px_var(--accent-hi),0_14px_30px_-18px_rgba(37,99,235,.8)]'
                      : 'border-[var(--line-2)] hover:border-ink/40'
                  } ${taken ? 'cursor-not-allowed opacity-45 hover:border-[var(--line-2)]' : ''}`}
                >
                  <span className={`display block text-[21px] ${on ? 'text-brand' : 'text-ink'}`}>{t.name}</span>
                  <span className={`num block text-[27px] leading-tight ${on ? 'text-brand' : 'text-ink'}`}>{ruble(tierPrice(t, noReplace))}</span>
                  {noReplace && <span className="block text-[12px] text-muted-2 line-through">{ruble(t.price)}</span>}
                  <span className="mt-1 block text-[12.5px] text-muted">{t.description}</span>
                  {taken && <span className="mt-1 block text-[11.5px] text-muted">уже в пакете</span>}
                </button>
              );
            })}
          </div>
        </Step>

        <Step n={3} title="Количество лидов" aside={`от ${MIN_LEADS} шт.`}>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-[54px] items-center rounded-[16px] shadow-[inset_0_0_0_1px_var(--line-2)]">
              <button type="button" aria-label="Меньше" onClick={() => setQty(cur.qty - 1)} className="h-full w-12 text-xl text-ink disabled:text-muted-2" disabled={cur.qty <= MIN_LEADS}>−</button>
              <input
                type="number"
                inputMode="numeric"
                min={MIN_LEADS}
                max={MAX_LEADS}
                value={cur.qty}
                aria-label="Количество лидов"
                onChange={(e) => patch({ qty: Number(e.target.value) || 0 })}
                onBlur={() => setQty(cur.qty)}
                className="num w-16 bg-transparent text-center text-[28px] text-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button type="button" aria-label="Больше" onClick={() => setQty(cur.qty + 1)} className="h-full w-12 text-xl text-ink">+</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => {
                const d = discountFor(p);
                const on = cur.qty === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setQty(p)}
                    className={`flex min-h-[42px] items-center gap-1.5 rounded-full px-4 text-[15px] font-medium transition-colors ${
                      on ? 'bg-ink text-white' : 'text-ink shadow-[inset_0_0_0_1px_var(--line-2)] hover:shadow-[inset_0_0_0_1px_var(--text)]'
                    }`}
                  >
                    {p}
                    {d > 0 && <span className={`text-[11.5px] ${on ? 'text-white/70' : 'text-brand'}`}>−{pct(d)}</span>}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="mt-3 min-h-[1.5em] text-[14px] text-ink-2">
            {next ? (
              <>
                Ещё {leads(next.minCount - cur.qty)} — и скидка {pct(next.percentage)} {scope}.{' '}
                <button type="button" onClick={() => setQty(next.minCount)} className="copy text-[14px]">Добавить {next.minCount - cur.qty}</button>
              </>
            ) : (
              <>Максимальная скидка {pct(line.rate)} {scope}.</>
            )}
          </p>
          {canAdd && (
            <button
              type="button"
              onClick={addItem}
              className="group mt-5 flex items-center gap-3.5 rounded-[18px] border-[1.5px] border-dashed border-[rgba(59,130,246,.45)] py-3 pl-3 pr-5 text-left transition-colors hover:border-[var(--accent-hi)] hover:bg-[rgba(59,130,246,.06)]"
            >
              <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[22px] leading-none text-white shadow-[0_8px_18px_-8px_rgba(37,99,235,.9)] transition-transform duration-500 group-hover:rotate-90" style={{ background: 'var(--grad)' }}>+</span>
              <span>
                <b className="block font-semibold text-ink">{multi ? 'Добавить ещё сегмент' : 'Собрать составной пакет'}</b>
                <small className="block text-[13px] text-muted">Например, 30 бизнес + 20 премиум в одном пакете</small>
              </span>
            </button>
          )}
        </Step>

        <Step n={4} title="Замена нецелевых лидов">
          <button
            type="button"
            role="switch"
            aria-checked={!noReplace}
            onClick={() => setNoReplace(!noReplace)}
            className="flex items-start gap-4 text-left"
          >
            <span className={`relative mt-0.5 h-[30px] w-[52px] shrink-0 rounded-full transition-colors ${noReplace ? 'bg-[var(--line-2)]' : 'bg-brand'}`}>
              <span className={`absolute top-[3px] h-6 w-6 rounded-full bg-white shadow transition-[left] duration-300 ${noReplace ? 'left-[3px]' : 'left-[25px]'}`} />
            </span>
            <span>
              <span className="block text-[16px] font-semibold text-ink">{noReplace ? 'Без замен' : 'С заменами'}</span>
              <span className="block text-[14px] text-ink-2">
                {noReplace
                  ? 'Комфорт дешевле на 50%, остальные классы — на 25%: нецелевые лиды не заменяем.'
                  : 'Бесплатно заменяем нецелевые лиды в течение 5 дней.'}
              </span>
            </span>
          </button>
        </Step>
      </div>

      <aside className="rounded-[26px] border border-[var(--line-2)] bg-white p-6 shadow-[var(--shadow)] lg:sticky lg:top-24" aria-live="polite">
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-4 text-[13.5px]">
          <span className="text-muted">Ваш расчёт</span>
          <span className="text-brand">{noReplace ? 'Без замен' : 'С заменами'}</span>
        </div>
        <div className="pt-5 text-[18px] font-semibold leading-snug text-ink">{summary}</div>
        {multi && (
          <ul className="mt-2">
            {lines.map((l, i) => (
              <li key={`${l.it.tier}-${i}`} className={`flex items-baseline justify-between gap-3 border-b border-[var(--line)] py-3 ${i === fresh ? 'pack-in' : ''}`}>
                <span>
                  <b className="block text-[15px] font-semibold text-ink">{categoryOf(l.it.market).title} · {l.it.tier}</b>
                  <small className="block text-[13px] text-muted">
                    {leads(l.it.qty)} × {ruble(l.lead)}
                    {l.rate > 0 && <em className="font-medium not-italic text-brand"> · −{pct(l.rate)}</em>}
                  </small>
                </span>
                <strong className="whitespace-nowrap text-[15px] font-semibold text-ink">{ruble(l.total)}</strong>
              </li>
            ))}
          </ul>
        )}
        <dl className="mt-3 text-[15px]">
          {(multi
            ? [['Экономия', saved ? ruble(saved) : '—']]
            : [
                ['Цена за лид', ruble(line.lead)],
                ['Скидка за объём', line.rate ? pct(line.rate) : '—'],
                ['Экономия', saved ? ruble(saved) : '—'],
              ]
          ).map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-[var(--line)] py-3">
              <dt className="text-ink-2">{k}</dt>
              <dd className="font-medium text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="flex items-end justify-between gap-4 pb-5 pt-6">
          <span className="pb-1 text-ink-2">Итого</span>
          <span className="num text-[clamp(40px,4vw,56px)] leading-[.9] text-brand">{ruble(animTotal)}</span>
        </div>
        <a href={TELEGRAM} target="_blank" rel="noopener" onClick={copy} className="btn btn--accent btn--lg btn--block">
          Отправить расчёт в Telegram <Arrow />
        </a>
        <p className="mt-3 text-center text-[12.5px] text-muted">
          {copied ? 'Расчёт скопирован — вставьте его в чат.' : 'Параметры скопируются — вставьте их в чат, и мы сразу продолжим.'}
        </p>
      </aside>
    </div>
  );
};

export default Calculator;
