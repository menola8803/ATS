import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Theme, ThemeName, themes } from './theme';
import { dict, Lang, Strings } from './i18n';
import type { Kind } from './core/cv';
import type { ModelKey, Tone, ParaAdvice } from './core/ai';
import type { Region } from './core/ats';
import type { Thumb } from './core/thumb';

// Unfinished work on a document: the AI suggestions and the choices made, so the person can carry on later.
export type Draft = { advice: Record<number, ParaAdvice>; picked: Record<number, number>; fills: Record<number, string[]>; at: number };

/** A document the person has opened (a private copy is kept in the app, so it can be opened again). */
export type Recent = { key: string; name: string; kind: Kind; path: string; at: number };

type Saved = {
  themeName: ThemeName;
  lang: Lang;
  model: ModelKey;            // fast (Haiku) or best (Sonnet)
  count: number;              // suggestions per paragraph (1–3)
  tone: Tone;
  useAd: boolean;             // the job ad steers the suggestions
  showDemo: boolean;          // the three demo CVs are shown under Documents
  region: Region;             // eu (Sweden/Europe) or gulf (GCC)
  ad: string;                 // the job ad pasted on the home screen
  scores: Record<string, { score: number; at: number; thumb?: Thumb }>; // latest ATS score and page miniature per document key
  drafts: Record<string, Draft>; // unfinished work per document key
  recent: Recent[];
  updateTag: string; updateChecked: number; updateAuto: boolean;
  folderMade: boolean;        // Download/ATS has been created
};

const KEY = 'ats.state.v1';
const API_KEY = 'ats.apikey.v1';
const MAX_RECENT = 40;

const empty = (): Saved => ({
  themeName: 'dark', lang: 'en', model: 'fast', count: 2, tone: 'neutral', useAd: true, showDemo: true, region: 'eu', ad: '',
  scores: {}, drafts: {}, recent: [], updateTag: '', updateChecked: 0, updateAuto: true, folderMade: false,
});

type Prefs = Omit<Saved, 'scores' | 'recent'>;
type Ctx = Saved & {
  ready: boolean; theme: Theme; t: Strings;
  apiKey: string; setApiKey: (k: string) => Promise<void>;
  setPrefs: (p: Partial<Prefs>) => void;
  setScore: (key: string, score: number, thumb?: Thumb) => void;
  setDraft: (key: string, draft: Draft) => void;
  clearDraft: (key: string) => void;
  addRecent: (r: Recent) => void;
  removeRecent: (key: string) => void;
};
const C = createContext<Ctx>(null as unknown as Ctx);
export const useApp = () => useContext(C);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<Saved>(empty);
  const [apiKey, setKey] = useState('');
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const merged = { ...empty(), ...JSON.parse(raw) } as Saved;
          if (!themes[merged.themeName]) merged.themeName = 'dark';
          if (merged.lang !== 'sv' && merged.lang !== 'en') merged.lang = 'en';
          if (merged.region !== 'eu' && merged.region !== 'gulf') merged.region = 'eu';
          if (!merged.drafts || typeof merged.drafts !== 'object') merged.drafts = {};
          if (![1, 2, 3].includes(merged.count)) merged.count = 2;
          if (!Array.isArray(merged.recent)) merged.recent = [];
          setS(merged);
        }
      } catch {}
      try { setKey((await SecureStore.getItemAsync(API_KEY)) ?? ''); } catch {}
      loaded.current = true;
      setReady(true);
    })();
  }, []);

  // Save after every change (only once the saved state has been read, so nothing is overwritten by the defaults).
  useEffect(() => {
    if (!loaded.current) return;
    const id = setTimeout(() => { AsyncStorage.setItem(KEY, JSON.stringify(s)).catch(() => {}); }, 250);
    return () => clearTimeout(id);
  }, [s]);

  const setApiKey = useCallback(async (k: string) => {
    const v = k.trim();
    if (v) await SecureStore.setItemAsync(API_KEY, v); else await SecureStore.deleteItemAsync(API_KEY);
    setKey(v);
  }, []);
  const setPrefs = useCallback((p: Partial<Prefs>) => setS(o => ({ ...o, ...p })), []);
  const setScore = useCallback((key: string, score: number, thumb?: Thumb) => setS(o => ({ ...o, scores: { ...o.scores, [key]: { score, at: Date.now(), thumb: thumb ?? o.scores[key]?.thumb } } })), []);
  const setDraft = useCallback((key: string, draft: Draft) => setS(o => ({ ...o, drafts: { ...o.drafts, [key]: draft } })), []);
  const clearDraft = useCallback((key: string) => setS(o => { if (!o.drafts[key]) return o; const drafts = { ...o.drafts }; delete drafts[key]; return { ...o, drafts }; }), []);
  const addRecent = useCallback((r: Recent) => setS(o => ({ ...o, recent: [r, ...o.recent.filter(x => x.key !== r.key)].slice(0, MAX_RECENT) })), []);
  const removeRecent = useCallback((key: string) => setS(o => ({ ...o, recent: o.recent.filter(x => x.key !== key) })), []);

  const value = useMemo<Ctx>(() => ({
    ...s, ready, theme: themes[s.themeName], t: dict[s.lang], apiKey, setApiKey, setPrefs, setScore, setDraft, clearDraft, addRecent, removeRecent,
  }), [s, ready, apiKey, setApiKey, setPrefs, setScore, setDraft, clearDraft, addRecent, removeRecent]);
  return <C.Provider value={value}>{children}</C.Provider>;
}
