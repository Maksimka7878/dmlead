import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '..');

/** Контент написан на TypeScript, а скрипты сборки — обычный Node.
 *  Собираем реестр во временный ESM-модуль и импортируем его. */
export const loadRegistry = async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'dmleads-content-'));
  const outfile = path.join(dir, 'registry.mjs');

  await build({
    entryPoints: [path.join(ROOT, 'content/registry.ts')],
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node20',
    outfile,
    logLevel: 'error',
    // JSX и React-компоненты в контент не попадают — иконки живут в UI-слое.
    external: ['react', 'react-dom'],
  });

  const mod = await import(pathToFileURL(outfile).href);
  await rm(dir, { recursive: true, force: true });
  return mod;
};

export { ROOT };
