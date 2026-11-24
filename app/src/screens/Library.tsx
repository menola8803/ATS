import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useApp } from '../store';
import { H1, Segmented, Sub, TAB_SPACE, Text } from '../ui';
import { NotTested, Paper, ScoreRing } from '../parts';
import { fill } from '../i18n';
import { DocItem } from '../library';

/** A document as a card: a page miniature with the score (or "Not tested") in the corner, the name and a line under it. */
export function DocCard({ d, width, onPress }: { d: DocItem; width?: number; onPress: () => void }) {
  const { theme } = useApp();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${d.name}, ${d.score !== null ? d.score : ''}`} onPress={onPress}
      style={({ pressed }) => ({ width, flex: width ? undefined : 1, padding: 8, borderRadius: 16, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, opacity: pressed ? 0.85 : 1 })}>
      <View>
        <Paper photo={d.photo} />
        <View style={{ position: 'absolute', top: 6, right: 6 }}>{d.score !== null ? <ScoreRing score={d.score} /> : <NotTested />}</View>
        {d.source === 'demo' ? (
          <View style={{ position: 'absolute', left: 6, bottom: 6, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8, borderWidth: 1, borderColor: theme.good, backgroundColor: theme.dark ? 'rgba(15,26,28,0.9)' : 'rgba(250,248,244,0.95)' }}>
            <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1, color: theme.good }}>DEMO</Text>
          </View>
        ) : null}
      </View>
      <Text numberOfLines={1} style={{ marginTop: 6, fontSize: 13.5, fontWeight: '700', color: theme.ink }}>{d.name}</Text>
      <Text numberOfLines={1} style={{ fontSize: 11.5, color: theme.muted }}>{d.meta}</Text>
    </Pressable>
  );
}

type Filter = 'all' | 'tested' | 'not' | 'demo';

export default function Library({ items, demos, onOpen }: { items: DocItem[]; demos: DocItem[]; onOpen: (d: DocItem) => void }) {
  const { theme, t } = useApp();
  const [filter, setFilter] = useState<Filter>('all');
  const [help, setHelp] = useState(false);
  const all = [...items, ...demos];
  const shown = all.filter(d => filter === 'all' || (filter === 'tested' ? d.score !== null : filter === 'not' ? d.score === null && d.source !== 'demo' : d.source === 'demo'));
  const tested = all.filter(d => d.score !== null).length;
  const rows: DocItem[][] = [];
  for (let i = 0; i < shown.length; i += 2) rows.push(shown.slice(i, i + 2));
  const helpRow = (badge: React.ReactNode, text: string) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={{ width: 76, alignItems: 'flex-start' }}>{badge}</View>
      <Text style={{ flex: 1, fontSize: 13, lineHeight: 18, color: theme.muted }}>{text}</Text>
    </View>
  );
  return (
    <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: TAB_SPACE + 12 }} showsVerticalScrollIndicator={false}>
      <View><H1>{t.myDocs}</H1><Sub>{t.folderName}</Sub></View>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: help }} onPress={() => setHelp(v => !v)} style={{ alignSelf: 'flex-start', minHeight: 36, justifyContent: 'center' }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: theme.tabActive }}>{t.badgesHelp}</Text>
      </Pressable>
      {help ? (
        <View style={{ backgroundColor: theme.card, borderWidth: 1, borderColor: theme.line, borderRadius: 22, padding: 14, gap: 10 }}>
          {helpRow(<ScoreRing score={84} />, t.helpTested)}
          {helpRow(<NotTested />, t.helpNot)}
          {helpRow(<View style={{ paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8, borderWidth: 1, borderColor: theme.good }}><Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1, color: theme.good }}>DEMO</Text></View>, t.helpDemo)}
        </View>
      ) : null}
      <Segmented<Filter> value={filter} onChange={setFilter} options={[['all', t.filterAll], ['tested', t.filterTested], ['not', t.filterNot], ['demo', t.filterDemo]]} />
      <Text style={{ fontSize: 12.5, color: theme.muted }}>{fill(t.countText, { a: tested, b: all.length - tested - demos.filter(d => d.score === null).length, c: demos.length })}</Text>
      {rows.length ? rows.map((r, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
          {r.map(d => <DocCard key={d.key} d={d} onPress={() => onOpen(d)} />)}
          {r.length === 1 ? <View style={{ flex: 1 }} /> : null}
        </View>
      )) : <Text style={{ fontSize: 14, color: theme.muted }}>{t.noneHere}</Text>}
    </ScrollView>
  );
}
