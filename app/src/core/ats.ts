// The ATS score: how well a recruiting system (Applicant Tracking System) can read the CV, from 0 to 100.
// Counted on the phone, without AI: the layout, the standard headings, the contact details, the length and – when a
// job ad is given – how many of the ad's important words the CV contains.
import { Cv, fullText } from './cv';

export type CheckId =
  | 'tables' | 'header' | 'boxes' | 'images' | 'columns'
  | 'profile' | 'experience' | 'education' | 'skills'
  | 'email' | 'phone' | 'linkedin'
  | 'length';

export type Check = { id: CheckId; ok: boolean; count?: number; points: number };
export type Keywords = { pct: number; found: string[]; missing: string[] };
export type Score = { score: number; base: number; checks: Check[]; words: number; keywords?: Keywords };

const SECTIONS: Record<'profile' | 'experience' | 'education' | 'skills', string[]> = {
  profile: ['profil', 'sammanfattning', 'om mig', 'summary', 'profile', 'about me'],
  experience: ['erfarenhet', 'arbetslivserfarenhet', 'anställningar', 'experience', 'employment', 'work history'],
  education: ['utbildning', 'education'],
  skills: ['kompetenser', 'kompetens', 'färdigheter', 'kunskaper', 'skills', 'competencies'],
};

const STOP = new Set(`
och att det som en ett för med på är av till i om vi du har inte den de kan ska vara eller från vid hos även samt mot
våra vår din ditt dina där när söker arbete jobb tjänst tjänsten rollen roll dig oss vill är ser gärna mycket inom både
eller också sig sin sina sitt ha hade blir bli får göra gör kommer olika andra annan nya ny god goda bra stor stora
the and for with you our are will to of in a an on as is be or we your this that have has who what can all any
from at by it its their they them about into within also more most other such than then there these those
arbetar arbeta sker hanterar hantera stöttar stötta ansvarar kunskap kunskaper erfarenhet meriterande krav uppdrag
möjlighet tillsammans finns behöver work working experience knowledge required requirements role team
`.split(/\s+/).filter(Boolean));

export const words = (s: string) => (s.toLowerCase().match(/[a-zåäöéüæø0-9+#.]+/g) ?? []).map(w => w.replace(/^\.+|\.+$/g, '')).filter(Boolean);

/** The ad's most important words: the most frequent ones that are not filler words (at most `top`). */
export function adKeywords(ad: string, top = 20): string[] {
  const count = new Map<string, number>();
  const order: string[] = [];
  for (const w of words(ad)) {
    if (w.length < 3 || STOP.has(w) || /^\d+$/.test(w)) continue;
    if (!count.has(w)) order.push(w);
    count.set(w, (count.get(w) ?? 0) + 1);
  }
  return order.sort((a, b) => (count.get(b)! - count.get(a)!) || order.indexOf(a) - order.indexOf(b)).slice(0, top);
}

/** A keyword is found when the CV has the word, or a longer or shorter form of it (utvecklare / utvecklaren). */
export function hasWord(cvWords: Set<string>, w: string): boolean {
  if (cvWords.has(w)) return true;
  if (w.length < 5) return false;
  for (const c of cvWords) if (c.length >= 5 && (c.startsWith(w) || w.startsWith(c))) return true;
  return false;
}

export function matchAd(cvText: string, ad: string): Keywords {
  const kw = adKeywords(ad);
  const set = new Set(words(cvText));
  const found = kw.filter(w => hasWord(set, w));
  const missing = kw.filter(w => !hasWord(set, w));
  return { pct: kw.length ? Math.round((100 * found.length) / kw.length) : 0, found, missing };
}

export function evaluate(cv: Cv, ad?: string): Score {
  const L = cv.layout;
  const body = cv.paras.filter(p => !p.inTable && !p.inBox).map(p => p.text).join('\n').toLowerCase();
  const all = fullText(cv);
  const checks: Check[] = [
    { id: 'tables', ok: L.tables === 0, count: L.tables, points: 10 },
    { id: 'header', ok: !L.headerText.trim(), points: 10 },
    { id: 'boxes', ok: L.textBoxes === 0, count: L.textBoxes, points: 10 },
    { id: 'images', ok: L.images === 0, count: L.images, points: 10 },
    { id: 'columns', ok: !L.columns, points: 10 },
    ...(Object.keys(SECTIONS) as (keyof typeof SECTIONS)[]).map(id => ({ id, ok: SECTIONS[id].some(k => body.includes(k)), points: 8 })),
    { id: 'email', ok: /[\w.+-]+@[\w-]+\.[\w.]+/.test(all), points: 5 },
    { id: 'phone', ok: /(\+\d{1,3}|0)[\d\s-]{7,}/.test(all), points: 5 },
    { id: 'linkedin', ok: /linkedin/i.test(all), points: 3 },
  ];
  const n = all.split(/\s+/).filter(Boolean).length;
  checks.push({ id: 'length', ok: n >= 300 && n <= 900, count: n, points: 5 });
  const base = Math.max(0, 100 - checks.filter(c => !c.ok).reduce((s, c) => s + c.points, 0));
  if (ad && ad.trim()) {
    const keywords = matchAd(all, ad);
    return { score: Math.round(base * 0.5 + keywords.pct * 0.5), base, checks, words: n, keywords };
  }
  return { score: base, base, checks, words: n };
}

/** Paragraphs worth sending to the AI: real text (not a heading, the name or a contact line) that can be replaced. */
export function candidates(cv: Cv): number[] {
  return cv.paras.filter(p => p.editable && !p.heading && p.text.trim().split(/\s+/).length >= 4
    && !/@|linkedin\.com|^\+?\d[\d\s-]{6,}$/.test(p.text)).map(p => p.id);
}
