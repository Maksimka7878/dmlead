import { cp, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { ROOT } from './loadContent.mjs';

// Главная — статическая страница из home/ (без React). Кладём её поверх
// пререндера: /lidy/* и /blog/* остаются на React, «/» отдаёт home/index.html.
const HOME = path.join(ROOT, 'home');
const DIST = path.join(ROOT, 'dist');

const main = async () => {
  await cp(HOME, DIST, {
    recursive: true,
    filter: (src) => path.basename(src) !== 'README.txt',
  });

  // /assets/* отдаётся с immutable-кэшем (vercel.json), а у main.css/main.js
  // имена без хэша — версия в query, чтобы обновления доходили до браузера.
  let html = await readFile(path.join(HOME, 'index.html'), 'utf8');
  for (const file of ['assets/css/main.css', 'assets/js/main.js']) {
    const hash = createHash('sha256').update(await readFile(path.join(HOME, file))).digest('hex').slice(0, 10);
    html = html.replaceAll(`"${file}"`, `"/${file}?v=${hash}"`);
  }
  await writeFile(path.join(DIST, 'index.html'), html);
  console.log('install-home: главная из home/ установлена в dist/');
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
