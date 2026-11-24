// Small pieces shared by several screens.
import React from 'react';
import { View } from 'react-native';
import { useApp } from './store';
import { Text } from './ui';
import { PLACEHOLDERS } from './core/ai';

/** The score in a ring: green when tested (as in the mockup), grey for the score before. */
export function ScoreRing({ score, size = 36, dim }: { score: number; size?: number; dim?: boolean }) {
  const { theme } = useApp();
  const c = dim ? theme.muted : theme.good;
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: size > 44 ? 2.5 : 2, borderColor: c, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.dark ? 'rgba(15,26,28,0.9)' : 'rgba(250,248,244,0.95)' }}>
      <Text style={{ fontSize: size > 44 ? 17 : 14, fontWeight: '700', color: c }}>{score}</Text>
    </View>
  );
}

/** "Ej testad" in red. */
export function NotTested() {
  const { theme, t } = useApp();
  return (
    <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, borderWidth: 1.5, borderColor: theme.danger, backgroundColor: theme.dark ? 'rgba(15,26,28,0.9)' : 'rgba(250,248,244,0.95)' }}>
      <Text style={{ fontSize: 12, fontWeight: '700', color: theme.danger }}>{t.notTested}</Text>
    </View>
  );
}

export function Tag({ text, color, dashed, fill }: { text: string; color: string; dashed?: boolean; fill?: string }) {
  return (
    <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderStyle: dashed ? 'dashed' : 'solid', borderColor: fill ? 'transparent' : color, backgroundColor: fill ?? 'transparent' }}>
      <Text style={{ fontSize: 12, fontWeight: '700', color }}>{text}</Text>
    </View>
  );
}

/** A miniature of a CV page (lines and a heading colour), used for the document cards. */
export function Paper({ photo, height = 150, children }: { photo?: boolean; height?: number; children?: React.ReactNode }) {
  const line = (w: string, c = '#B8B0A0', h = 3, mt = 0) => <View style={{ height: h, width: w as any, borderRadius: 2, backgroundColor: c, marginTop: mt }} />;
  return (
    <View style={{ height, borderRadius: 10, overflow: 'hidden', backgroundColor: '#F4F1EA', paddingHorizontal: 11, paddingTop: 12, gap: 5 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
        {photo ? <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#C9C2B2' }} /> : null}
        <View style={{ flex: 1, gap: 3 }}>{line('70%', '#1B2440', 6)}{line('50%', '#9C9486')}</View>
      </View>
      <View style={{ height: 1, backgroundColor: '#DDD6C6', marginVertical: 3 }} />
      {line('34%', '#17393E', 4)}{line('92%')}{line('84%')}{line('60%')}
      {line('40%', '#17393E', 4, 4)}{line('90%')}{line('76%')}{line('50%')}
      {children}
    </View>
  );
}

/** Text where placeholders such as [ANTAL] are shown in a dashed gold box. */
export function WithPlaceholders({ text, size = 15, color }: { text: string; size?: number; color?: string }) {
  const { theme } = useApp();
  const parts: { t: string; ph: boolean }[] = [];
  let at = 0;
  for (const m of text.matchAll(PLACEHOLDERS)) {
    if (m.index! > at) parts.push({ t: text.slice(at, m.index), ph: false });
    parts.push({ t: m[0], ph: true });
    at = m.index! + m[0].length;
  }
  if (at < text.length) parts.push({ t: text.slice(at), ph: false });
  return (
    <Text selectable style={{ fontSize: size, lineHeight: Math.round(size * 1.5), color: color ?? theme.ink }}>
      {parts.map((p, i) => p.ph
        ? <Text key={i} style={{ color: theme.primary, fontWeight: '700', backgroundColor: theme.dark ? 'rgba(232,176,74,0.14)' : theme.chip }}>{p.t}</Text>
        : <Text key={i}>{p.t}</Text>)}
    </Text>
  );
}
