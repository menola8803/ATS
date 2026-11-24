import { readFileSync } from 'fs';
import { join } from 'path';
export let fail = 0;
export const ok = (c: boolean, m: string) => { if (!c) { fail++; console.log('FAIL', m); } };
export const demo = (name: string) => new Uint8Array(readFileSync(join(__dirname, '..', 'assets', 'demo', name)));
export const done = (name: string) => { if (fail) process.exit(1); console.log(`${name}: all ok`); };
