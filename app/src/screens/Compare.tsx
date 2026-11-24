import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useApp } from '../store';
import { useDoc } from '../session';
import { Btn, Header, Screen, Segmented, Text } from '../ui';
import { ScoreRing } from '../parts';
import { fill } from '../i18n';

/** The whole document before and after, as a page, with the changed paragraphs marked. */
export default function Compare({ onBack, onImprove }: { onBack: () => void; onImprove: () => void }) {
  const { theme, t } = useApp();
  const s = useDoc();
  const [mode, setMode] = useState<'then' | 'now'>('now');
  const [mark, setMark] = useState(true);
  const d = s.doc;
  if (!d) return null;
  const edits = s.edits();
  const changed = Object.keys(edits).length;
  const after = s.after?.score ?? d.before.score;
  return (
    <Screen>
      <Header title={d.name} onBack={onBack} right={
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <ScoreRing score={d.before.score} dim />
          <Text style={{ color: theme.muted }}>→</Text>
          <ScoreRing score={after} />
        </View>
      } />
      <Segmented<'then' | 'now'> value={mode} onChange={setMode} options={[['then', t.beforeTab], ['now', t.nowTab]]} />
      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: mark }} onPress={() => setMark(v => !v)} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 36 }}>
        <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: mark ? 0 : 1.5, borderColor: theme.line, backgroundColor: mark ? theme.primary : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
          {mark ? <Text style={{ fontSize: 13, fontWeight: '700', color: theme.onPrimary }}>✓</Text> : null}
        </View>
        <Text style={{ fontSize: 14, fontWeight: '600', color: theme.muted }}>{fill(t.highlight, { n: changed })}</Text>
      </Pressable>
      <ScrollView contentContainerStyle={{ paddingBottom: 12 }}>
        <View style={{ backgroundColor: '#F4F1EA', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 24, gap: 6 }}>
          {d.cv.paras.map(p => {
            if (!p.text.trim()) return null;
            const isChanged = edits[p.id] !== undefined;
            const text = mode === 'now' && isChanged ? edits[p.id] : p.text;
            const hl = isChanged && mark;
            if (p.heading) return <Text key={p.id} style={{ marginTop: 10, fontSize: 12, fontWeight: '700', letterSpacing: 1.4, color: '#17393E', textTransform: 'uppercase' }}>{p.text}</Text>;
            return (
              <View key={p.id} style={{ gap: 4, marginHorizontal: -8, paddingHorizontal: 8, paddingVertical: hl ? 6 : 1, borderRadius: 6, borderLeftWidth: 3,
                borderLeftColor: hl ? (mode === 'now' ? '#2E8C7E' : '#A8781E') : 'transparent', backgroundColor: hl ? (mode === 'now' ? '#DCEFEA' : '#F6E6C6') : 'transparent' }}>
                <Text selectable style={{ fontFamily: 'serif', fontSize: 13.5, lineHeight: 21, color: '#1B2440' }}>{`${p.list ? '•  ' : ''}${text}`}</Text>
                {hl ? (
                  <View style={{ alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, backgroundColor: mode === 'now' ? '#C5E6DE' : '#EFD9A8' }}>
                    <Text style={{ fontSize: 10.5, fontWeight: '700', color: mode === 'now' ? '#1D6B60' : '#7A5510' }}>{mode === 'now' ? t.changedByAi : t.replaced}</Text>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      </ScrollView>
      <Btn kind="secondary" title={t.improveMore} onPress={onImprove} />
    </Screen>
  );
}
