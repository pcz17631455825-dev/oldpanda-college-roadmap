import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import path from 'node:path';
const pkgPath = fileURLToPath(new URL('../package.json', import.meta.resolve('vinext')));
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const binary = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin.vinext;
const child = spawn(process.execPath, [path.resolve(path.dirname(pkgPath), binary), ...process.argv.slice(2)], {
  stdio: 'inherit', env: { ...process.env, WRANGLER_LOG_PATH: '.wrangler/wrangler.log' },
});
child.on('exit', code => process.exit(code ?? 1));
