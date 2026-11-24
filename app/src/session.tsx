// The document that is open right now: its paragraphs, score, AI suggestions and the choices the person has made.
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Cv, Kind, readCv, writeCv } from './core/cv';
import { evaluate, candidates, Score } from './core/ats';
import { ApiError, ParaAdvice, PLACEHOLDERS, suggest } from './core/ai';
import { unzip, zip } from './core/zip';
import { filledText as filled } from './core/fill';
import { useApp } from './store';

export type OpenDoc = {
  key: string; name: string; kind: Kind; demo?: string;
  cv: Cv;
  ad: string; adIsDemo: boolean;
  before: Score;                         // the score of the original
  advice: Record<number, ParaAdvice> | null;
  picked: Record<number, number>;        // paragraph id -> chosen suggestion
  fills: Record<number, string[]>;       // paragraph id -> what the person typed for each placeholder
};

type Ctx = {
  doc: OpenDoc | null;
  busy: boolean; error: ApiError | null; errorText: string;
  open: (bytes: Uint8Array, o: { key: string; name: string; kind: Kind; demo?: string; demoAd?: string }) => OpenDoc;
  close: () => void;
  fetchAdvice: () => Promise<void>;
  pick: (id: number, i: number) => void;
  unpick: (id: number) => void;
  setFill: (id: number, n: number, v: string) => void;
  useAllFirst: () => void;
  textOf: (id: number) => string;        // the paragraph as it is now (original or chosen suggestion, placeholders filled)
  edits: () => Record<number, string>;
  unfilled: () => number;                // paragraphs that still have a placeholder
  after: Score | null;                   // the score with the chosen suggestions
  build: () => Uint8Array;               // the improved file
};
const C = createContext<Ctx>(null as unknown as Ctx);
export const useDoc = () => useContext(C);


export function DocProvider({ children }: { children: React.ReactNode }) {
  const app = useApp();
  const [doc, setDoc] = useState<OpenDoc | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [errorText, setErrorText] = useState('');
  const abort = useRef<AbortController | null>(null);

  const open = useCallback((bytes: Uint8Array, o: { key: string; name: string; kind: Kind; demo?: string; demoAd?: string }) => {
    abort.current?.abort();
    const cv = readCv(o.kind, unzip(bytes));
    const ad = o.demoAd ?? (app.useAd ? app.ad : '');
    const before = evaluate(cv, ad || undefined);
    const d: OpenDoc = { key: o.key, name: o.name, kind: o.kind, demo: o.demo, cv, ad, adIsDemo: !!o.demoAd, before, advice: null, picked: {}, fills: {} };
    setDoc(d); setError(null); setErrorText(''); setBusy(false);
    app.setScore(o.key, before.score);
    return d;
  }, [app]);

  const close = useCallback(() => { abort.current?.abort(); setDoc(null); setBusy(false); }, []);

  const fetchAdvice = useCallback(async () => {
    if (!doc || busy) return;
    setBusy(true); setError(null); setErrorText('');
    const ctl = new AbortController(); abort.current = ctl;
    try {
      const list = await suggest({
        cv: doc.cv, ids: candidates(doc.cv), ad: doc.adIsDemo || app.useAd ? doc.ad : undefined, apiKey: app.apiKey,
        model: app.model, count: app.count, tone: app.tone, appLang: app.lang, signal: ctl.signal,
      });
      if (ctl.signal.aborted) return;
      const advice: Record<number, ParaAdvice> = {};
      for (const a of list) advice[a.id] = a;
      setDoc(d => (d && d.key === doc.key ? { ...d, advice, picked: {}, fills: {} } : d));
    } catch (e) {
      if (ctl.signal.aborted) return;
      const kind = ((e as any)?.kind as ApiError) ?? (e instanceof SyntaxError ? 'answer' : 'other');
      setError(kind); setErrorText((e as Error)?.message ?? '');
    } finally {
      if (!ctl.signal.aborted) setBusy(false);
    }
  }, [doc, busy, app]);

  const pick = useCallback((id: number, i: number) => setDoc(d => (d ? { ...d, picked: { ...d.picked, [id]: i }, fills: { ...d.fills, [id]: [] } } : d)), []);
  const unpick = useCallback((id: number) => setDoc(d => {
    if (!d) return d;
    const picked = { ...d.picked }; delete picked[id];
    const fills = { ...d.fills }; delete fills[id];
    return { ...d, picked, fills };
  }), []);
  const setFill = useCallback((id: number, n: number, v: string) => setDoc(d => {
    if (!d) return d;
    const arr = [...(d.fills[id] ?? [])]; arr[n] = v;
    return { ...d, fills: { ...d.fills, [id]: arr } };
  }), []);
  const useAllFirst = useCallback(() => setDoc(d => {
    if (!d?.advice) return d;
    const picked = { ...d.picked };
    for (const a of Object.values(d.advice)) if (a.suggestions.length && picked[a.id] === undefined) picked[a.id] = 0;
    return { ...d, picked };
  }), []);

  const editsOf = useCallback((d: OpenDoc) => {
    const out: Record<number, string> = {};
    for (const [k, i] of Object.entries(d.picked)) {
      const id = Number(k), s = d.advice?.[id]?.suggestions[i];
      if (s) out[id] = filled(s.text, d.fills[id]);
    }
    return out;
  }, []);
  const edits = useCallback(() => (doc ? editsOf(doc) : {}), [doc, editsOf]);
  const textOf = useCallback((id: number) => {
    if (!doc) return '';
    const e = editsOf(doc);
    return e[id] ?? doc.cv.paras[id]?.text ?? '';
  }, [doc, editsOf]);
  const unfilled = useCallback(() => Object.values(edits()).filter(t => new RegExp(PLACEHOLDERS.source).test(t)).length, [edits]);

  const after = useMemo(() => {
    if (!doc) return null;
    const e = editsOf(doc);
    if (!Object.keys(e).length) return null;
    const cv: Cv = { ...doc.cv, paras: doc.cv.paras.map(p => (e[p.id] !== undefined ? { ...p, text: e[p.id] } : p)) };
    return evaluate(cv, doc.ad || undefined);
  }, [doc, editsOf]);

  const build = useCallback(() => {
    if (!doc) throw new Error('no document');
    return zip(writeCv(doc.cv, editsOf(doc)), doc.kind);
  }, [doc, editsOf]);

  const value = useMemo<Ctx>(() => ({
    doc, busy, error, errorText, open, close, fetchAdvice, pick, unpick, setFill, useAllFirst, textOf, edits, unfilled, after, build,
  }), [doc, busy, error, errorText, open, close, fetchAdvice, pick, unpick, setFill, useAllFirst, textOf, edits, unfilled, after, build]);
  return <C.Provider value={value}>{children}</C.Provider>;
}
