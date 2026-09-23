import React from 'react';
import { Block } from '../content/types';
import { GUARANTEES } from '../constants';
import { FACTS } from '../content/facts';
import Calculator from './Calculator';
import { TELEGRAM } from '../site';
import { Arrow } from './Icons';

/** Лёгкая инлайн-разметка: только **жирный**. Полноценный markdown здесь не
 *  нужен — контент типизирован блоками, а не свободным текстом. */
const inline = (text: string): React.ReactNode =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="font-semibold text-ink">{part.slice(2, -2)}</strong>
      : <React.Fragment key={i}>{part}</React.Fragment>
  );

const rub = (n: number) => `${n.toLocaleString('ru-RU')}\u00A0₽`;

const TierRow: React.FC<{ title: string; tiers: readonly { name: string; note: string; price: number }[] }> = ({ title, tiers }) => (
  <div>
    <div className="mb-3 text-[13px] text-muted">{title}</div>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {tiers.map((t) => (
        <div key={t.name} className="rounded-[18px] border border-[var(--line-2)] bg-white p-4 md:p-5">
          <div className="display text-[22px] md:text-[26px]">{t.name}</div>
          <div className="num mt-1 text-[30px] leading-none text-brand md:text-[36px]">{rub(t.price)}</div>
          <div className="mt-2 text-[13px] leading-snug text-muted">{t.note}</div>
        </div>
      ))}
    </div>
  </div>
);

const PricingBlock: React.FC = () => (
  <div className="my-10 grid gap-6 rounded-[28px] bg-tint p-5 md:p-8">
    <TierRow title="Новостройки · цена за лид" tiers={FACTS.primaryTiers} />
    <TierRow title="Коммерция · цена за лид" tiers={FACTS.commercialTiers} />
    <p className="text-[14px] text-ink-2">Нецелевые лиды бесплатно заменяем в течение 5 дней. Без замен — Комфорт дешевле на 50%, остальные классы на 25%.</p>
  </div>
);

/** Гарантии замены — строками, как на главной: что случилось и что прислать. */
const GuaranteesBlock: React.FC = () => (
  <ol className="my-10 border-t border-[var(--line)]">
    {GUARANTEES.map((g, i) => (
      <li key={g.id} className="grid gap-2 border-b border-[var(--line)] py-6 md:grid-cols-[64px_minmax(0,1fr)_minmax(0,.8fr)] md:gap-6">
        <span className="num text-[26px] leading-none text-brand">{String(i + 1).padStart(2, '0')}</span>
        <div>
          <div className="text-lg font-semibold text-ink">{g.title}</div>
          <p className="mt-1 text-[15.5px] leading-relaxed text-ink-2">{g.scenario}</p>
        </div>
        <p className="text-[15px] text-ink">
          <span className="mb-0.5 block text-[13px] text-muted">Что прислать</span>
          {g.proof}
        </p>
      </li>
    ))}
  </ol>
);

/** Призыв — фирменный градиент, как блок тест-пакета на главной. */
const CtaBlock: React.FC<{ title: string; text: string }> = ({ title, text }) => (
  <div className="relative my-12 overflow-hidden rounded-[28px] p-7 text-white md:p-12" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 55%, #7C3AED 100%)' }}>
    <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
    <h2 className="display relative text-[clamp(34px,4.2vw,60px)]">{title}</h2>
    <p className="relative mt-4 max-w-[52ch] text-[17px] leading-relaxed text-white/85">{text}</p>
    <a href={TELEGRAM} target="_blank" rel="noopener" className="btn btn--white btn--lg relative mt-7">
      Написать в Telegram <Arrow />
    </a>
  </div>
);

const One: React.FC<{ b: Block }> = ({ b }) => {
  switch (b.t) {
    case 'p':
      return <p className="mb-5 leading-[1.7] text-ink-2">{inline(b.text)}</p>;
    case 'h2':
      return <h2 className="display mb-6 mt-16 text-[clamp(32px,3.6vw,52px)] md:mt-20">{b.text}</h2>;
    case 'h3':
      return <h3 className="mb-3 mt-10 text-[21px] font-semibold leading-snug text-ink md:text-[23px]">{b.text}</h3>;
    case 'ul':
      return (
        <ul className="mb-7 space-y-3">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-3.5 text-ink-2">
              <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-hi)]" />
              <span className="leading-[1.65]">{inline(it)}</span>
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className="mb-7 space-y-3.5">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-4 text-ink-2">
              <span className="num w-6 shrink-0 pt-px text-[21px] leading-[1.4] text-brand">{i + 1}</span>
              <span className="leading-[1.65]">{inline(it)}</span>
            </li>
          ))}
        </ol>
      );
    case 'quote':
      return (
        <blockquote className="my-10 border-l-2 border-brand pl-6 text-[20px] leading-relaxed text-ink">
          {inline(b.text)}
          {b.source && <footer className="mt-3 text-[15px] text-muted">— {b.source}</footer>}
        </blockquote>
      );
    case 'callout':
      return (
        <div className="my-10 rounded-[22px] bg-tint p-6 md:p-7">
          <div className="flex items-center gap-2.5 text-[17px] font-semibold text-ink">
            <span aria-hidden className="h-2 w-2 rounded-full bg-[var(--accent-hi)] shadow-[0_0_10px_var(--accent-hi)]" />
            {b.title}
          </div>
          <p className="mt-2.5 leading-[1.65] text-ink-2">{inline(b.text)}</p>
        </div>
      );
    case 'table':
      return (
        <figure className="my-10">
          <div className="overflow-x-auto rounded-[20px] border border-[var(--line-2)]">
            <table className="w-full min-w-[32rem] border-collapse text-left text-[15px]">
              <thead className="bg-tint">
                <tr>{b.head.map((h, i) => <th key={i} className="px-5 py-3.5 text-[13px] font-medium text-muted">{h}</th>)}</tr>
              </thead>
              <tbody>
                {b.rows.map((r, i) => (
                  <tr key={i} className="border-t border-[var(--line)]">
                    {r.map((c, j) => <td key={j} className={`px-5 py-3.5 ${j === 0 ? 'font-medium text-ink' : 'text-ink-2'}`}>{inline(c)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {b.caption && <figcaption className="mt-3 text-[13px] text-muted">{b.caption}</figcaption>}
        </figure>
      );
    case 'steps':
      return (
        <ol className="my-10 grid gap-x-8 gap-y-8 border-t border-[var(--line)] pt-8 sm:grid-cols-2">
          {b.items.map((s, i) => (
            <li key={i}>
              <div className="num text-[44px] leading-none text-brand">{String(i + 1).padStart(2, '0')}</div>
              <div className="mt-3 text-lg font-semibold text-ink">{s.title}</div>
              <p className="mt-1.5 text-[15.5px] leading-relaxed text-ink-2">{s.text}</p>
            </li>
          ))}
        </ol>
      );
    case 'pricing':
      return <PricingBlock />;
    case 'guarantees':
      return <GuaranteesBlock />;
    case 'calc':
      return <div className="my-12"><Calculator /></div>;
    case 'cta':
      return <CtaBlock title={b.title} text={b.text} />;
    default:
      return null;
  }
};

const ContentBlocks: React.FC<{ blocks: Block[] }> = ({ blocks }) => (
  <>{blocks.map((b, i) => <One key={i} b={b} />)}</>
);

export default ContentBlocks;
