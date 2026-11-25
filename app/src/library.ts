// The list under Documents (and the row on the home screen): saved files in Download/ATS, opened files and the demo CVs.
import { useCallback, useEffect, useState } from 'react';
import { DEMOS, Demo, demoKey } from './demo';
import { listSaved } from './files';
import { dateYear } from './dates';
import { kindOf, Kind } from './core/cv';
import type { Thumb } from './core/thumb';
import { useApp } from './store';

export type DocItem = {
  key: string; name: string; kind: Kind; source: 'saved' | 'opened' | 'demo';
  uri?: string; path?: string; demo?: Demo;
  at: number; score: number | null; photo: boolean; meta: string; thumb?: Thumb;
  draft?: { picked: number; total: number }; // unfinished work: suggestions chosen / with suggestions
};

export function useDocList(refresh: number) {
  const { recent, scores, drafts, showDemo, lang, t } = useApp();
  const [saved, setSaved] = useState<DocItem[]>([]);
  const load = useCallback(async () => {
    const files = await listSaved();
    setSaved(files.map(f => {
      const kind = kindOf(f.name) ?? 'docx';
      return { key: `dl:${f.uri}`, name: f.name, kind, source: 'saved' as const, uri: f.uri, at: f.modified, score: null, photo: false, meta: '' };
    }));
  }, []);
  useEffect(() => { load(); }, [load, refresh]);

  const draftOf = (key: string) => {
    const dr = drafts[key];
    if (!dr) return undefined;
    const total = Object.values(dr.advice).filter(a => a.suggestions.length).length;
    return { picked: Object.keys(dr.picked).length, total };
  };
  const withScore = (d: DocItem): DocItem => ({ ...d, score: scores[d.key]?.score ?? null, thumb: scores[d.key]?.thumb ?? d.thumb, draft: draftOf(d.key) });
  const meta = (d: DocItem) => `${d.kind.toUpperCase()} · ${dateYear(new Date(d.at), lang)}`;
  const items: DocItem[] = [
    ...saved.map(d => ({ ...d, meta: `${meta(d)} · ${t.docSaved}` })),
    ...recent.map(r => ({ key: r.key, name: r.name, kind: r.kind, source: 'opened' as const, path: r.path, at: r.at, score: null, photo: false, meta: '' }))
      .map(d => ({ ...d, meta: meta(d) })),
  ].sort((a, b) => b.at - a.at).map(withScore);
  const demos: DocItem[] = showDemo
    ? DEMOS.map(d => withScore({ key: demoKey(d.id), name: d.name, kind: d.kind, source: 'demo', demo: d, at: 0, score: null, photo: d.photo, meta: t[d.meta] as string }))
    : [];
  return { items, demos, reload: load };
}
