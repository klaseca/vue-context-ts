import { rmSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

const { positionals } = parseArgs({ allowPositionals: true });

const filepath = positionals[0];

if (filepath == null) {
  console.error('Path not passed');
  process.exit(1);
}

rmSync(path.resolve(filepath), { recursive: true, force: true });
