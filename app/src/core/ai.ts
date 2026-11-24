// AI suggestions from Claude, one request for the whole CV. The honesty lock is always on: the prompt forbids new facts,
// and every suggestion is checked afterwards – a number that is not in the CV becomes a placeholder such as [ANTAL].
import type { Cv } from './cv';

export const MODELS = [
  { id: 'claude-haiku-5-5', key: 'fast' },
  { id: 'claude-sonnet-5-5', key: 'best' },
] as const;
export type ModelKey = (typeof MODELS)[number]['key'];
export const modelId = (k: ModelKey) => MODELS.find(m => m.key === k)?.id ?? MODELS[0].id;

export type Tone = 'neutral' | 'formal' | 'persuasive';
export type Suggestion = { text: string; why: string };
export type ParaAdvice = { id: number; ok: boolean; suggestions: Suggestion[] };
export type ApiError = 'nokey' | 'badkey' | 'busy' | 'network' | 'answer' | 'other';

/** [ANTAL], [NUMBER], [VERKTYG] … – a detail only the person knows. */
export const PLACEHOLDER = /\[[A-ZÅÄÖ][A-ZÅÄÖ ]*\]/;
export const PLACEHOLDERS = /\[[A-ZÅÄÖ][A-ZÅÄÖ ]*\]/g;
export const hasPlaceholder = (s: string) => PLACEHOLDER.test(s);

const TONE: Record<Tone, string> = {
  neutral: 'neutral and clear',
  formal: 'formal and professional',
  persuasive: 'confident and persuasive, but never boastful or exaggerated',
};

export function systemPrompt(opts: { count: number; tone: Tone; appLang: 'sv' | 'en' }): string {
  const why = opts.appLang === 'sv' ? 'Swedish' : 'English';
  const ph = opts.appLang === 'sv' ? '[ANTAL]' : '[NUMBER]';
  return [
    'You improve CVs so that Applicant Tracking Systems (ATS) and recruiters read them well.',
    'HONESTY LOCK – these rules always apply and override everything else:',
    '- Never add facts that are not in the CV: no new employers, job titles, dates, years, numbers, percentages, tools, languages, skills, certificates, education or achievements.',
    '- You may reword, restructure, shorten, use stronger verbs and standard terms for what the CV already says.',
    `- If a stronger version needs a detail the CV does not give (a number, a tool, a result), write a placeholder in square brackets in CAPITALS in the paragraph's language, for example ${ph}, [PROCENT], [VERKTYG] or [NUMBER], [PERCENT], [TOOL]. Never guess the value.`,
    '- Words from the job ad may only be used when the CV already shows that the person has that skill or experience.',
    'Other rules:',
    "- Write each suggestion in the same language as the paragraph.",
    '- Keep a list item to one line, and do not make any paragraph much longer than it was.',
    `- Tone: ${TONE[opts.tone]}.`,
    `- Give 1 to ${opts.count} different suggestions for each paragraph you are asked about, unless it is already ATS-friendly: then set "ok": true and give none.`,
    `- "why" is a short reason (at most 10 words) in ${why}.`,
    'Answer with JSON only, no other text:',
    '{"paragraphs":[{"id":3,"ok":false,"suggestions":[{"text":"...","why":"..."}]}]}',
  ].join('\n');
}

export function userPrompt(cv: Cv, ids: number[], ad?: string): string {
  const doc = cv.paras.filter(p => p.text.trim()).map(p => ({ id: p.id, kind: p.heading ? 'heading' : p.list ? 'list item' : 'text', text: p.text }));
  return [
    'The whole CV, paragraph by paragraph (for context):',
    JSON.stringify(doc),
    '',
    `Improve these paragraphs (ids): ${JSON.stringify(ids)}`,
    ad && ad.trim() ? `\nThe job ad the CV is for:\n${ad.trim().slice(0, 6000)}` : '\nThere is no job ad: follow general ATS practice.',
  ].join('\n');
}

/** Pulls complete top-level {...} objects out of a string, even when it is cut off partway. */
function salvageObjects(s: string): any[] {
  const out: any[] = [];
  let depth = 0, start = -1, inStr = false, esc = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === '\\') esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === '{') { if (depth === 0) start = i; depth++; }
    else if (ch === '}') {
      depth--;
      if (depth === 0 && start >= 0) {
        try { out.push(JSON.parse(s.slice(start, i + 1))); } catch {}
        start = -1;
      }
    }
  }
  return out;
}

/** Finds the JSON in the answer (tolerates code fences, text around it, or a cut-off answer). */
export function parseAdvice(text: string, ids: number[], count: number): ParaAdvice[] {
  const cleaned = text.replace(/```(?:json)?/gi, '').trim();
  const a = cleaned.indexOf('{'), b = cleaned.lastIndexOf('}');
  if (a < 0) throw Object.assign(new Error('no JSON in answer'), { kind: 'answer' as ApiError });
  let list: any[] = [];
  try {
    // Fast path: the whole answer is valid JSON.
    const j = JSON.parse(cleaned.slice(a, b + 1));
    list = Array.isArray(j?.paragraphs) ? j.paragraphs : [];
  } catch {
    // The answer was cut off (too long): keep every paragraph object that is complete.
    const arr = cleaned.indexOf('[', cleaned.indexOf('paragraphs'));
    list = salvageObjects(cleaned.slice(arr >= 0 ? arr : a)).filter(o => 'id' in (o ?? {}));
  }
  if (!list.length) throw Object.assign(new Error('no JSON in answer'), { kind: 'answer' as ApiError });
  const want = new Set(ids);
  const out: ParaAdvice[] = [];
  for (const p of list) {
    const id = Number(p?.id);
    if (!want.has(id) || out.some(o => o.id === id)) continue;
    const suggestions: Suggestion[] = (Array.isArray(p.suggestions) ? p.suggestions : [])
      .map((s: any) => ({ text: String(s?.text ?? '').trim(), why: String(s?.why ?? '').trim() }))
      .filter((s: Suggestion) => s.text)
      .slice(0, count);
    out.push({ id, ok: !!p.ok && suggestions.length === 0, suggestions });
  }
  return out;
}

/**
 * The honesty lock after the answer: a number in a suggestion that appears nowhere in the CV is replaced by a
 * placeholder, and suggestions that end up the same as the original are dropped.
 */
export function guard(cvText: string, original: string, s: Suggestion, lang: 'sv' | 'en'): Suggestion | null {
  const known = new Set(cvText.match(/\d+(?:[.,]\d+)?/g) ?? []);
  const ph = lang === 'sv' ? '[ANTAL]' : '[NUMBER]';
  const text = s.text.replace(/\d+(?:[.,]\d+)?/g, n => (known.has(n) ? n : ph)).replace(/\s+/g, ' ').trim();
  if (!text || text === original.replace(/\s+/g, ' ').trim()) return null;
  return { text, why: s.why };
}

/** One call to the Messages API. A slow request is cut off after timeoutMs so a dropped connection surfaces. */
export async function askClaude(opts: { apiKey: string; model: string; system: string; user: string; maxTokens?: number; timeoutMs?: number; f?: typeof fetch; signal?: AbortSignal }): Promise<string> {
  if (!opts.apiKey) throw Object.assign(new Error('nokey'), { kind: 'nokey' as ApiError });
  const ctrl = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; ctrl.abort(); }, opts.timeoutMs ?? 90000);
  if (opts.signal) {
    if (opts.signal.aborted) ctrl.abort();
    else opts.signal.addEventListener('abort', () => ctrl.abort());
  }
  let r: Response;
  try {
    r = await (opts.f ?? fetch)('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'content-type': 'application/json', 'x-api-key': opts.apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: opts.model, max_tokens: opts.maxTokens ?? 16000, system: opts.system, messages: [{ role: 'user', content: opts.user }] }),
    });
  } catch {
    // A timeout counts as "busy, try again"; a real connection drop as "no connection".
    throw Object.assign(new Error(timedOut ? 'busy' : 'network'), { kind: (timedOut ? 'busy' : 'network') as ApiError });
  } finally {
    clearTimeout(timer);
  }
  if (r.status === 401 || r.status === 403) throw Object.assign(new Error('badkey'), { kind: 'badkey' as ApiError });
  if (r.status === 429 || r.status === 529) throw Object.assign(new Error('busy'), { kind: 'busy' as ApiError });
  const j: any = await r.json().catch(() => null);
  if (!r.ok) throw Object.assign(new Error(j?.error?.message ?? `HTTP ${r.status}`), { kind: 'other' as ApiError });
  const text = (j?.content ?? []).filter((c: any) => c.type === 'text').map((c: any) => c.text).join('');
  if (!text) throw Object.assign(new Error('empty answer'), { kind: 'answer' as ApiError });
  return text;
}

/** Paragraphs are asked for in small groups, so each request is quick, fits the answer limit and is less likely to drop. */
export const BATCH = 8;
const chunk = <T,>(a: T[], n: number): T[][] => { const o: T[][] = []; for (let i = 0; i < a.length; i += n) o.push(a.slice(i, i + n)); return o; };

/** Runs fn, and tries once more after a short pause if the connection dropped or the service was busy. */
async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  try { return await fn(); }
  catch (e: any) {
    if (e?.kind !== 'network' && e?.kind !== 'busy') throw e;
    await new Promise(r => setTimeout(r, 900));
    return await fn();
  }
}

/** Suggestions for the given paragraphs of the CV. */
export async function suggest(opts: {
  cv: Cv; ids: number[]; ad?: string; apiKey: string; model: ModelKey; count: number; tone: Tone; appLang: 'sv' | 'en'; f?: typeof fetch; signal?: AbortSignal;
}): Promise<ParaAdvice[]> {
  if (!opts.ids.length) return [];
  const all = opts.cv.paras.map(p => p.text).join('\n');
  const byId = new Map(opts.cv.paras.map(p => [p.id, p.text]));
  const system = systemPrompt({ count: opts.count, tone: opts.tone, appLang: opts.appLang });
  const out: ParaAdvice[] = [];
  for (const ids of chunk(opts.ids, BATCH)) {
    const answer = await withRetry(() => askClaude({
      apiKey: opts.apiKey, model: modelId(opts.model), f: opts.f, signal: opts.signal,
      system, user: userPrompt(opts.cv, ids, opts.ad),
    }));
    for (const a of parseAdvice(answer, ids, opts.count)) {
      const original = byId.get(a.id) ?? '';
      const suggestions = a.suggestions.map(s => guard(all, original, s, opts.appLang)).filter((s): s is Suggestion => !!s);
      out.push({ id: a.id, ok: a.ok || suggestions.length === 0, suggestions });
    }
  }
  return out;
}

/** Checks that a key works with a tiny request. */
export async function testKey(apiKey: string, f?: typeof fetch): Promise<true> {
  await askClaude({ apiKey, model: MODELS[0].id, system: 'Answer with the word ok.', user: 'ok', maxTokens: 5, f });
  return true;
}
