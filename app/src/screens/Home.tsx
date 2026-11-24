import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import Constants from 'expo-constants';
import { useApp } from '../store';
import { AtsMark, GearButton, TAB_SPACE, Text, TextInput, useButtonLook } from '../ui';
import { Spaced } from '../spaced';
import { fill } from '../i18n';
import { DocItem } from '../library';
import { DocCard } from './Library';

export default function Home({ items, onEvaluate, onOpen, onAllDocs, onGear, glow }: {
  items: DocItem[]; onEvaluate: () => void; onOpen: (d: DocItem) => void; onAllDocs: () => void; onGear: () => void; glow: boolean;
}) {
  const { theme, t, ad, setPrefs } = useApp();
  const look = useButtonLook();
  const [showAd, setShowAd] = useState(false);
  const gold = theme.dark ? '#E8B04A' : theme.accent;
  const words = ad.trim() ? ad.trim().split(/\s+/).length : 0;
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: TAB_SPACE + 12, gap: 12 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={{ alignItems: 'flex-end' }}><GearButton onPress={onGear} glow={glow} /></View>
      <View style={{ alignItems: 'center', marginTop: -24, paddingBottom: 6 }}>
        <AtsMark size={120} />
        <Spaced text="ATS" spacing={9} style={{ fontFamily: theme.fonts.display, fontSize: 30, color: gold, marginTop: 10 }} />
        <Spaced text={t.tagline} spacing={2.2} style={{ fontFamily: theme.fonts.bold, fontSize: 10, color: theme.accent, marginTop: 4 }} />
      </View>

      <Pressable accessibilityRole="button" onPress={onEvaluate}
        style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 22, borderWidth: 1.5, borderColor: theme.dark ? '#8A6D2E' : theme.primary, backgroundColor: theme.dark ? '#17393E' : theme.chip, opacity: pressed ? 0.85 : 1 })}>
        <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: theme.card, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={28} height={28} viewBox="0 0 24 24">
            <Path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" stroke={look.fg} strokeWidth={2} fill="none" strokeLinejoin="round" />
            <Path d="M14 3v5h5M9 14l2 2 4-4" stroke={look.fg} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ fontSize: 19, fontWeight: '700', color: theme.ink }}>{t.evaluateCv}</Text>
          <Text style={{ fontSize: 13, color: theme.muted }}>{t.evaluateCvSub}</Text>
        </View>
        <Text style={{ fontSize: 22, color: look.fg }}>›</Text>
      </Pressable>

      <Pressable accessibilityRole="button" accessibilityState={{ expanded: showAd }} onPress={() => setShowAd(v => !v)}
        style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 22, borderWidth: 1, borderColor: theme.line, backgroundColor: theme.card, opacity: pressed ? 0.85 : 1 })}>
        <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: theme.chip, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={26} height={26} viewBox="0 0 24 24">
            <Rect x={3} y={7} width={18} height={13} rx={2} stroke={theme.dark ? '#F3D9A0' : theme.accent} strokeWidth={2} fill="none" />
            <Path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" stroke={theme.dark ? '#F3D9A0' : theme.accent} strokeWidth={2} fill="none" />
          </Svg>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ fontSize: 19, fontWeight: '700', color: theme.ink }}>{t.jobAd}</Text>
          <Text style={{ fontSize: 13, color: words ? theme.good : theme.muted }}>{words ? fill(t.jobAdSet, { n: words }) : t.jobAdSub}</Text>
        </View>
        <Text style={{ fontSize: 22, color: look.fg }}>{showAd ? '⌄' : '›'}</Text>
      </Pressable>
      {showAd ? (
        <View style={{ gap: 8 }}>
          <TextInput value={ad} onChangeText={v => setPrefs({ ad: v })} placeholder={t.jobAdPh} placeholderTextColor={theme.muted} multiline accessibilityLabel={t.jobAd}
            style={{ minHeight: 120, maxHeight: 260, borderRadius: 16, borderWidth: 1, borderColor: theme.line, backgroundColor: theme.chip, color: theme.ink, padding: 14, fontSize: 14.5, textAlignVertical: 'top' }} />
          {ad ? (
            <Pressable accessibilityRole="button" onPress={() => setPrefs({ ad: '' })} style={{ alignSelf: 'flex-start', minHeight: 40, justifyContent: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: theme.danger }}>{t.clearAd}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
        <Text style={{ flex: 1, fontSize: 12, fontWeight: '700', letterSpacing: 1.2, color: theme.accent, textTransform: 'uppercase' }}>{fill(t.savedDocs, { n: items.length })}</Text>
        <Pressable accessibilityRole="button" onPress={onAllDocs} hitSlop={8} style={{ minHeight: 36, justifyContent: 'center' }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: look.fg }}>{t.seeAll}</Text>
        </Pressable>
      </View>
      {items.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }} style={{ marginHorizontal: -16 }}>
          <View style={{ width: 6 }} />
          {items.slice(0, 10).map(d => <DocCard key={d.key} d={d} width={148} onPress={() => onOpen(d)} />)}
          <View style={{ width: 6 }} />
        </ScrollView>
      ) : (
        <Text style={{ fontSize: 14, lineHeight: 20, color: theme.muted }}>{t.noDocsYet}</Text>
      )}
      <Text style={{ textAlign: 'center', fontSize: 12.5, color: theme.muted, marginTop: 12 }}>{`ATS v${Constants.expoConfig?.version ?? ''}`}</Text>
    </ScrollView>
  );
}
