// The AI suggestions: the answer is parsed, and the honesty lock turns unknown numbers into placeholders.
import { ok, demo, done } from './helpers';
import { readCv } from '../src/core/cv';
import { unzip } from '../src/core/zip';
import { guard, parseAdvice, suggest, systemPrompt } from '../src/core/ai';
import { filledText } from '../src/core/fill';

const cvText = 'IT-support, Acme AB (2021–2024). Ansvarade för datorer.';
ok(guard(cvText, 'x', { text: 'Ansvarade för 40 datorer 2021–2024', why: '' }, 'sv')!.text === 'Ansvarade för [ANTAL] datorer 2021–2024', 'unknown number becomes [ANTAL]');
ok(guard(cvText, 'Ansvarade för datorer.', { text: 'Ansvarade för datorer.', why: '' }, 'sv') === null, 'same text dropped');
ok(guard(cvText, 'x', { text: 'Handled 12 tickets', why: '' }, 'en')!.text === 'Handled [NUMBER] tickets', 'English placeholder');

const advice = parseAdvice('Här:\n```json\n{"paragraphs":[{"id":2,"ok":false,"suggestions":[{"text":"A","why":"w"},{"text":"B"},{"text":"C"}]},{"id":9,"ok":true,"suggestions":[]},{"id":77,"ok":false,"suggestions":[{"text":"x"}]}]}\n```', [2, 9], 2);
ok(advice.length === 2 && advice[0].suggestions.length === 2 && advice[1].ok, 'parse, limit and unknown ids dropped');
ok(/HONESTY LOCK/.test(systemPrompt({ count: 2, tone: 'neutral', appLang: 'sv' })), 'the prompt has the honesty lock');

// A cut-off answer (too long): the complete paragraphs are still read, the half-written one is dropped.
const truncated = '{"paragraphs":[{"id":2,"ok":false,"suggestions":[{"text":"A","why":"w"}]},{"id":5,"ok":false,"suggestions":[{"text":"B","why":"wh';
const salvaged = parseAdvice(truncated, [2, 5], 2);
ok(salvaged.length === 1 && salvaged[0].id === 2 && salvaged[0].suggestions[0].text === 'A', 'truncated answer salvages whole paragraphs');
ok(filledText('Ansvarade för [ANTAL] datorer i [STAD]', ['40']) === 'Ansvarade för 40 datorer i [STAD]', 'placeholders filled in order');

// A whole request with a fake answer from the API
const mira = readCv('docx', unzip(demo('Demo_Mira_Andersson_CV.docx')));
const id = mira.paras.find(p => p.text.startsWith('Ansvarade för omvårdnad'))!.id;
const fakeFetch = (async (_url: string, init: any) => {
  const body = JSON.parse(init.body);
  ok(body.model === 'claude-haiku-5-5' && /HONESTY LOCK/.test(body.system), 'request has model and honesty lock');
  const answer = { paragraphs: [{ id, ok: false, suggestions: [{ text: 'Ansvarade för omvårdnad av 12 boende och 30 anhöriga', why: 'tydligare' }] }] };
  return { ok: true, status: 200, json: async () => ({ content: [{ type: 'text', text: JSON.stringify(answer) }] }) } as any;
}) as unknown as typeof fetch;
suggest({ cv: mira, ids: [id], apiKey: 'k', model: 'fast', count: 2, tone: 'neutral', appLang: 'sv', f: fakeFetch }).then(r => {
  ok(r[0].suggestions[0].text === 'Ansvarade för omvårdnad av 12 boende och [ANTAL] anhöriga', 'known 12 kept, unknown 30 replaced: ' + r[0].suggestions[0].text);
  done('ai');
});
