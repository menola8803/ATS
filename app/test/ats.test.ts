// The ATS score of the three demo CVs: weak < medium < strong, and the reasons are found.
import { ok, demo, done } from './helpers';
import { readCv } from '../src/core/cv';
import { unzip } from '../src/core/zip';
import { adKeywords, candidates, evaluate, matchAd } from '../src/core/ats';
import { DEMOS } from '../src/demo.data';

const ad = (id: string) => DEMOS.find(d => d.id === id)!.ad;
const jonas = readCv('docx', unzip(demo('Demo_Jonas_Berg_CV.docx')));
const sara = readCv('odt', unzip(demo('Demo_Sara_Nilsson_CV.odt')));
const mira = readCv('docx', unzip(demo('Demo_Mira_Andersson_CV.docx')));
const j = evaluate(jonas, ad('jonas')), s = evaluate(sara, ad('sara')), m = evaluate(mira, ad('mira'));
console.log('scores', j.score, s.score, m.score);
ok(j.score < s.score && s.score < m.score, `order weak < medium < strong (${j.score}, ${s.score}, ${m.score})`);
const failed = (sc: typeof j) => sc.checks.filter(c => !c.ok).map(c => c.id);
ok(failed(j).includes('tables') && failed(j).includes('header'), 'Jonas: table and header found');
ok(!failed(m).includes('tables') && !failed(m).includes('profile'), 'Mira: no layout problems');
ok(j.keywords!.missing.includes('windows'), 'Jonas misses Windows from the ad');
ok(candidates(mira).length > 5 && !candidates(mira).some(id => mira.paras[id].heading), 'candidates are text, not headings');
ok(!adKeywords('Vi söker dig som har erfarenhet och arbetar i team').includes('söker'), 'filler words are not keywords');
ok(matchAd('Jag är utvecklaren', 'utvecklare').pct === 100, 'longer form of a word counts');
done('ats');
