import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
for (const args of [['scripts/sync-transfer.mjs'], ['scripts/vinext.mjs', 'build'], ['--test', ...readdirSync('tests').filter(name => name.endsWith('.test.mjs')).map(name => `tests/${name}`)]]) {
  const result = spawnSync(process.execPath, args, { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
