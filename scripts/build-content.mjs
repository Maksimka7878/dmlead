import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ROOT, loadRegistry } from './loadContent.mjs';

/** Выгружает контент в статические JSON: индекс для списков и по файлу
 *  на страницу. Клиент подтягивает только то, что открыл пользователь —
 *  поэтому размер бандла не зависит от количества страниц. */
const main = async () => {
  const reg = await loadRegistry();
  const pages = reg.allPages();
  const outDir = path.join(ROOT, 'public/content');

  await rm(outDir, { recursive: true, force: true });
  await mkdir(path.join(outDir, 'pages'), { recursive: true });
  await mkdir(path.join(outDir, 'listings'), { recursive: true });

  await writeFile(path.join(outDir, 'index.json'), JSON.stringify(reg.fullIndex()));

  for (const p of pages) {
    await writeFile(path.join(outDir, 'pages', `${p.slug}.json`), JSON.stringify(p));
  }

  const cats = reg.categories();
  const listings = reg.buildListings();
  for (const l of listings) {
    await writeFile(path.join(outDir, 'listings', `${l.key}.json`), JSON.stringify({ ...l, categories: cats }));
  }

  const landings = pages.filter((p) => p.kind === 'landing').length;
  const articles = pages.length - landings;
  console.log(`content: ${pages.length} страниц (${landings} посадочных, ${articles} статей), ${listings.length} листингов → public/content`);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
