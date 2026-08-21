import React from 'react';
import { Block } from '../content/types';
import { GUARANTEES } from '../constants';
import { FACTS } from '../content/facts';
import Calculator from './Calculator';
import { TELEGRAM } from '../site';

/** Лёгкая инлайн-разметка: только **жирный**. Полноценный markdown здесь не
 *  нужен — контент типизирован блоками, а не свободным текстом. */
const inline = (text: string): React.ReactNode =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>
      : <React.Fragment key={i}>{part}</React.Fragment>
  );

const rub = (n: number) => `${n.toLocaleString('ru-RU')} ₽`;

const PricingBlock: React.FC = () => (
  <div className="my-8 grid gap-4 sm:grid-cols-2">
    {[...FACTS.primaryTiers, ...FACTS.commercialTiers].map((t) => (
      <div key={t.name} className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="text-sm font-medium text-slate-500">{t.note}</div>
        <div className="mt-1 text-lg font-bold text-slate-900">{t.name}</div>
        <div className="mt-2 text-2xl font-black" style={{ color: 'var(--accent)' }}>{rub(t.price)}</div>
      </div>
    ))}
  </div>
);

const GuaranteesBlock: React.FC = () => (
  <div className="my-8 grid gap-4 sm:grid-cols-2">
    {GUARANTEES.map((g) => (
      <div key={g.id} className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-2">{g.icon}</div>
        <div className="font-bold text-slate-900">{g.title}</div>
        <p className="mt-1 text-sm text-slate-600">{g.scenario}</p>
        <p className="mt-2 text-xs font-medium text-slate-400">Подтверждение: {g.proof}</p>
      </div>
    ))}
  </div>
);

const CtaBlock: React.FC<{ title: string; text: string }> = ({ title, text }) => (
  <div className="my-10 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white md:p-10">
    <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
    <p className="mt-3 text-slate-300">{text}</p>
    <a
      href={TELEGRAM}
      target="_blank"
      rel="noreferrer"
      className="mt-6 inline-flex items-center gap-2 rounded-2xl px-8 py-4 font-bold text-white transition-all hover:-translate-y-1"
      style={{ backgroundColor: 'var(--accent)' }}
    >
      Написать в Telegram
    </a>
  </div>
);

const One: React.FC<{ b: Block }> = ({ b }) => {
  switch (b.t) {
    case 'p':
      return <p className="mb-5 leading-relaxed text-slate-600">{inline(b.text)}</p>;
    case 'h2':
      return <h2 className="mt-12 mb-4 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">{b.text}</h2>;
    case 'h3':
      return <h3 className="mt-8 mb-3 text-xl font-bold text-slate-800">{b.text}</h3>;
    case 'ul':
      return (
        <ul className="mb-6 space-y-2">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-slate-600">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
              <span className="leading-relaxed">{inline(it)}</span>
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className="mb-6 space-y-3">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-slate-600">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: 'var(--accent)' }}>{i + 1}</span>
              <span className="leading-relaxed">{inline(it)}</span>
            </li>
          ))}
        </ol>
      );
    case 'quote':
      return (
        <blockquote className="my-8 border-l-4 pl-5 italic text-slate-700" style={{ borderColor: 'var(--accent)' }}>
          {inline(b.text)}
          {b.source && <footer className="mt-2 text-sm not-italic text-slate-400">— {b.source}</footer>}
        </blockquote>
      );
    case 'callout':
      return (
        <div className="my-8 rounded-2xl border p-5" style={{ borderColor: 'var(--accent)', backgroundColor: 'var(--accent-soft)' }}>
          <div className="font-bold text-slate-900">{b.title}</div>
          <p className="mt-2 leading-relaxed text-slate-700">{inline(b.text)}</p>
        </div>
      );
    case 'table':
      return (
        <figure className="my-8">
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
              <thead className="bg-slate-50">
                <tr>{b.head.map((h, i) => <th key={i} className="px-4 py-3 font-semibold text-slate-700">{h}</th>)}</tr>
              </thead>
              <tbody>
                {b.rows.map((r, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    {r.map((c, j) => <td key={j} className="px-4 py-3 text-slate-600">{inline(c)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {b.caption && <figcaption className="mt-2 text-xs text-slate-400">{b.caption}</figcaption>}
        </figure>
      );
    case 'steps':
      return (
        <ol className="my-8 grid gap-4 sm:grid-cols-2">
          {b.items.map((s, i) => (
            <li key={i} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--accent)' }}>Шаг {i + 1}</div>
              <div className="mt-1 font-bold text-slate-900">{s.title}</div>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.text}</p>
            </li>
          ))}
        </ol>
      );
    case 'pricing':
      return <PricingBlock />;
    case 'guarantees':
      return <GuaranteesBlock />;
    case 'calc':
      return <div className="my-10"><Calculator /></div>;
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
