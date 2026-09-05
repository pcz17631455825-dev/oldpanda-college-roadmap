import { mkdir, readdir, copyFile, rm } from 'node:fs/promises';
const source = new URL('../features/transfer/', import.meta.url);
const target = new URL('../docs/transfer/', import.meta.url);
await mkdir(target, { recursive: true });
for (const file of await readdir(source)) {
  if (/\.(js|css)$/.test(file)) await copyFile(new URL(file, source), new URL(file, target));
}
// These data files belonged to the removed on-site professional catalogue.
for (const file of ['catalog.js', 'majors.js']) await rm(new URL(file, target), { force: true });
console.log('Shared transfer feature synchronized to the local static preview.');
await copyFile(new URL('../features/career-draft.js', import.meta.url), new URL('../docs/career-draft.js', import.meta.url));
await copyFile(new URL('../public/panda-transfer-brand.png', import.meta.url), new URL('../docs/panda-transfer-brand.png', import.meta.url));
