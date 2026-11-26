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

// Gulf region: a photo is not held against the score, and personal-detail checks are added.
const jGulf = evaluate(jonas, ad('jonas'), 'gulf');
ok(jGulf.region === 'gulf', 'region is reported');
ok(jGulf.checks.some(c => c.id === 'nationality') && jGulf.checks.some(c => c.id === 'visa'), 'Gulf adds personal-detail checks');
ok(jGulf.checks.find(c => c.id === 'images')!.points === 0, 'Gulf does not penalise a photo');
// A photo lowers the EU base but not the Gulf base.
const withPhoto = { ...mira, layout: { ...mira.layout, images: 1 } };
ok(evaluate(withPhoto, undefined, 'eu').base === evaluate(mira, undefined, 'eu').base - 10, 'a photo costs 10 in the EU');
ok(evaluate(withPhoto, undefined, 'gulf').base === evaluate(mira, undefined, 'gulf').base, 'a photo costs nothing in the Gulf');
const visaCv = readCv('docx', unzip(demo('Demo_Mira_Andersson_CV.docx')));
ok(evaluate({ ...visaCv, paras: [...visaCv.paras, { ...visaCv.paras[0], id: 999, text: 'Nationality: Swedish, transferable QID visa, available immediately' }] }, undefined, 'gulf')
  .checks.filter(c => ['nationality', 'visa', 'availability'].includes(c.id)).every(c => c.ok), 'Gulf personal details are detected');
// The bundled templates are clean and score about 95 (LinkedIn is deliberately left out).
const elin = readCv('docx', unzip(demo('Demo_Elin_Ek_Mall.docx')));
const elinScore = evaluate(elin, undefined, 'eu');
ok(elin.layout.tables === 0 && elin.layout.images === 0 && elin.layout.textBoxes === 0 && !elin.layout.headerText.trim() && !elin.layout.columns, 'Elin template is ATS-clean');
ok(elinScore.score >= 95 && elinScore.score < 100, `Elin template scores ~95 (got ${elinScore.score})`);
ok(elinScore.checks.find(c => c.id === 'linkedin')!.ok === false, 'Elin template leaves LinkedIn out');

const omar = readCv('docx', unzip(demo('Demo_Omar_Haddad_Mall_Gulf.docx')));
const omarScore = evaluate(omar, undefined, 'gulf');
ok(omar.layout.tables === 0 && omar.layout.images === 0 && omar.layout.textBoxes === 0, 'Omar Gulf template is ATS-clean');
ok(omarScore.score >= 95 && omarScore.score < 100, `Omar Gulf template scores ~95 in Gulf mode (got ${omarScore.score})`);
ok(omarScore.checks.filter(c => ['nationality', 'visa'].includes(c.id)).every(c => c.ok), 'Omar template states nationality and visa status');
done('ats');
