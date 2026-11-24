// Every release: the manual (both languages) must be updated and carry the app's version; no "GitHub" in the app's text.
import { readFileSync } from 'fs';
import { join } from 'path';
import { MANUAL, MANUAL_VERSION } from '../src/manual';
import { dict } from '../src/i18n';
import { ok, done } from './helpers';
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));
const app = JSON.parse(readFileSync(join(__dirname, '..', 'app.json'), 'utf8'));
ok(MANUAL_VERSION === pkg.version, `manual version ${MANUAL_VERSION} ≠ package.json ${pkg.version} – update src/manual.ts (sv + en)`);
ok(app.expo.version === pkg.version, 'app.json version = package.json version');
ok(MANUAL.sv.length === MANUAL.en.length && MANUAL.sv.every((s, i) => s.items.length === MANUAL.en[i].items.length), 'manual sv/en have the same sections and items');
ok(JSON.stringify(Object.keys(dict.sv).sort()) === JSON.stringify(Object.keys(dict.en).sort()), 'i18n sv/en keys match');
ok(!/github/i.test(JSON.stringify([dict, MANUAL])), 'the word GitHub is not shown in the app');
ok(dict.sv.developer.includes('Claes Sundman · Scandinavian Nexum Consulting') && dict.en.developer.includes('Claes Sundman · Scandinavian Nexum Consulting'), 'developer credit');
const changelog = readFileSync(join(__dirname, '..', '..', 'CHANGELOG.md'), 'utf8'), changelogEn = readFileSync(join(__dirname, '..', '..', 'CHANGELOG.en.md'), 'utf8');
ok(changelog.includes(pkg.version) && changelogEn.includes(pkg.version), 'both changelogs have the version');
done('manual');
