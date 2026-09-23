import React, { useMemo, useState } from 'react';
import { MarketType } from '../types';
import { PRICING_DATA, DISCOUNTS } from '../constants';
import { usePricingMode, tierPrice } from './PricingMode';
import { useAnimatedNumber } from './useAnimatedNumber';
import { TELEGRAM } from '../site';
import { Arrow } from './Icons';

const ruble = (n: number) => `${Math.round(n).toLocaleString('ru-RU')} ₽`;

const MIN_LEADS = 10;
const MAX_LEADS = 1000;
const PRESETS = [10, 30, 50, 100];

const discountFor = (count: number) => (DISCOUNTS.find((d) => count >= d.minCount) ?? { percentage: 0 }).percentage;

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

/** Калькулятор пакета — повторяет калькулятор новой главной:
 *  шаги 1–4 слева, расчёт справа, «Отправить расчёт» копирует параметры для чата. */
const Calculator: React.FC = () => {
  const [market, setMarket] = useState<MarketType>(MarketType.PRIMARY);
  const [tierIndex, setTierIndex] = useState(1);
  const [count, setCount] = useState(MIN_LEADS);
  const [copied, setCopied] = useState(false);
  const { noReplace, setNoReplace } = usePricingMode();

  const category = PRICING_DATA.find((c) => c.id === market) ?? PRICING_DATA[0];
  const tier = category.tiers[tierIndex] ?? category.tiers[0];

  const { perLead, discount, saved, total } = useMemo(() => {
    const base = tierPrice(tier, noReplace) * count;
    const pct = discountFor(count);
    const cut = (base * pct) / 100;
    return { perLead: (base - cut) / count, discount: pct, saved: cut, total: base - cut };
  }, [tier, count, noReplace]);

  const animTotal = useAnimatedNumber(total);
  const next = DISCOUNTS.filter((d) => d.minCount > count).sort((a, b) => a.minCount - b.minCount)[0];

  const setQty = (v: number) => setCount(Math.min(MAX_LEADS, Math.max(MIN_LEADS, Math.round(v) || MIN_LEADS)));

  const summary = `${category.title} · ${tier.name} · ${count} лидов`;
  const sendText = [
    'Здравствуйте! Расчёт с сайта dmleads.ru:',
    summary,
    noReplace ? 'Тариф без замен' : 'Тариф с заменами',
    `Цена за лид: ${ruble(perLead)}`,
    discount ? `Скидка за объём: ${discount}%` : '',
    `Итого: ${ruble(total)}`,
  ].filter(Boolean).join('\n');

  const copy = () => {
    navigator.clipboard?.writeText(sendText).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 4000);
    }, () => {});
  };

  const pill = (on: boolean) =>
    `rounded-full px-5 min-h-[46px] text-[15.5px] font-medium transition-colors ${on ? 'bg-ink text-white' : 'text-ink-2 hover:text-ink'}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:items-start xl:gap-12">
      <div className="grid gap-9">
        <Step n={1} title="Тип недвижимости">
          <div className="inline-flex rounded-full p-1 shadow-[inset_0_0_0_1px_var(--line-2)]" role="radiogroup" aria-label="Тип недвижимости">
            {PRICING_DATA.map((m) => (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={market === m.id}
                onClick={() => { setMarket(m.id); setTierIndex(m.id === MarketType.PRIMARY ? 1 : 0); }}
                className={pill(market === m.id)}
              >
                {m.title}
              </button>
            ))}
          </div>
        </Step>

        <Step n={2} title="Сегмент" aside="цена за один лид">
          <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Сегмент">
            {category.tiers.map((t, i) => {
              const on = i === tierIndex;
              return (
                <button
                  key={t.name}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setTierIndex(i)}
                  className={`rounded-[18px] border bg-white p-4 text-left transition-[border-color,box-shadow,background-color] ${
                    on
                      ? 'border-[var(--accent-hi)] bg-[#F3F7FF] shadow-[0_0_0_1px_var(--accent-hi),0_14px_30px_-18px_rgba(37,99,235,.8)]'
                      : 'border-[var(--line-2)] hover:border-ink/40'
                  }`}
                >
                  <span className={`display block text-[21px] ${on ? 'text-brand' : 'text-ink'}`}>{t.name}</span>
                  <span className={`num block text-[27px] leading-tight ${on ? 'text-brand' : 'text-ink'}`}>{ruble(tierPrice(t, noReplace))}</span>
                  {noReplace && <span className="block text-[12px] text-muted-2 line-through">{ruble(t.price)}</span>}
                  <span className="mt-1 block text-[12.5px] text-muted">{t.description}</span>
                </button>
              );
            })}
          </div>
        </Step>

        <Step n={3} title="Количество лидов" aside={`от ${MIN_LEADS} шт.`}>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-[54px] items-center rounded-[16px] shadow-[inset_0_0_0_1px_var(--line-2)]">
              <button type="button" aria-label="Меньше" onClick={() => setQty(count - 1)} className="h-full w-12 text-xl text-ink disabled:text-muted-2" disabled={count <= MIN_LEADS}>−</button>
              <input
                type="number"
                inputMode="numeric"
                min={MIN_LEADS}
                max={MAX_LEADS}
                value={count}
                aria-label="Количество лидов"
                onChange={(e) => setCount(Number(e.target.value) || 0)}
                onBlur={() => setQty(count)}
                className="num w-16 bg-transparent text-center text-[28px] text-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button type="button" aria-label="Больше" onClick={() => setQty(count + 1)} className="h-full w-12 text-xl text-ink">+</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => {
                const pct = discountFor(p);
                const on = count === p;
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
                    {pct > 0 && <span className={`text-[11.5px] ${on ? 'text-white/70' : 'text-brand'}`}>−{pct}%</span>}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="mt-3 min-h-[1.5em] text-[14px] text-ink-2">
            {next ? (
              <>
                Ещё {next.minCount - count} лидов — и скидка {next.percentage}% на весь пакет.{' '}
                <button type="button" onClick={() => setQty(next.minCount)} className="copy text-[14px]">Добавить {next.minCount - count}</button>
              </>
            ) : (
              <>Максимальная скидка {discount}% уже применена.</>
            )}
          </p>
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
        <dl className="mt-3 text-[15px]">
          {[
            ['Цена за лид', ruble(perLead)],
            ['Скидка за объём', discount ? `${discount}%` : '—'],
            ['Экономия', saved ? ruble(saved) : '—'],
          ].map(([k, v]) => (
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
