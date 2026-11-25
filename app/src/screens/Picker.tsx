import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useApp } from '../store';
import { Btn, Header, Screen, Segmented, Text } from '../ui';
import { CvThumb, NotTested, Paper, ScoreRing, Tag } from '../parts';
import { fill } from '../i18n';
import { DocItem } from '../library';

const isImproved = (name: string) => /_ats\.(docx|odt)$/i.test(name) || /\bats\b/i.test(name.replace(/\.(docx|odt)$/i, ''));

type Tab = 'all' | 'orig' | 'improved';

/** Picks a CV from Download/ATS, newest first, instead of Android's system picker. "Browse the phone" falls back to it. */
export default function Picker({ items, onOpen, onBrowse, onBack }: { items: DocItem[]; onOpen: (d: DocItem) => void; onBrowse: () => void; onBack: () => void }) {
  const { theme, t } = useApp();
  const [tab, setTab] = useState<Tab>('all');
  const saved = items.filter(d => d.source === 'saved');
  const shown = saved.filter(d => tab === 'all' || (tab === 'improved' ? isImproved(d.name) : !isImproved(d.name)));

  return (
    <Screen>
      <Header title={t.pickTitle} sub={t.pickFolder} onBack={onBack} />
      <Segmented<Tab> value={tab} onChange={setTab} options={[['all', t.pickAll], ['orig', t.pickOriginal], ['improved', t.pickImproved]]} />
      <Text style={{ fontSize: 12.5, color: theme.muted }}>{fill(t.pickCount, { n: shown.length })}</Text>
      <ScrollView contentContainerStyle={{ gap: 10, paddingBottom: 12 }} showsVerticalScrollIndicator={false}>
        {shown.length ? shown.map(d => (
          <Pressable key={d.key} accessibilityRole="button" accessibilityLabel={d.name} onPress={() => onOpen(d)}
            style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 18, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, opacity: pressed ? 0.85 : 1 })}>
            <View style={{ width: 54, height: 70 }}>{d.thumb ? <CvThumb thumb={d.thumb} height={70} /> : <Paper photo={d.photo} height={70} />}</View>
            <View style={{ flex: 1, gap: 3 }}>
              <Text numberOfLines={1} style={{ fontSize: 15, fontWeight: '700', color: theme.ink }}>{d.name}</Text>
              <Text style={{ fontSize: 12, color: theme.muted }}>{d.meta}</Text>
              {d.draft && d.draft.picked > 0
                ? <View style={{ alignSelf: 'flex-start' }}><Tag text={`${t.inProgress} · ${fill(t.progressChosen, { n: d.draft.picked, m: d.draft.total })}`} color="#0F1A1C" fill="#E8B04A" /></View>
                : isImproved(d.name) ? <View style={{ alignSelf: 'flex-start' }}><Tag text={t.improvedBy} color={theme.dark ? '#F3D9A0' : theme.accent} fill={theme.dark ? 'rgba(232,176,74,0.12)' : theme.chip} /></View> : null}
            </View>
            {d.score !== null ? <ScoreRing score={d.score} size={44} /> : <NotTested />}
          </Pressable>
        )) : <Text style={{ fontSize: 14, color: theme.muted, paddingVertical: 8 }}>{t.pickEmpty}</Text>}
      </ScrollView>
      <View style={{ gap: 6 }}>
        <Btn title={t.pickBrowse} onPress={onBrowse} />
        <Text style={{ textAlign: 'center', fontSize: 12, color: theme.muted }}>{t.pickBrowseSub}</Text>
      </View>
    </Screen>
  );
}
