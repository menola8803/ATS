import React, { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';
import { useDoc } from '../session';
import { AtsMark, Btn, Card, GearButton, H1, Label, Segmented, SmallBtn, Sub, TAB_SPACE, Text, TextInput, useButtonLook, useKeyboardOpen } from '../ui';
import { ScoreRing, Tag, WithPlaceholders } from '../parts';
import { fill, Strings } from '../i18n';
import { candidates, Check, CheckId } from '../core/ats';
import { hasPlaceholder, PLACEHOLDERS } from '../core/ai';
import { DEMOS } from '../demo';
import { showDialog } from '../dialog';

const CHECK_TEXT: Record<CheckId, [keyof Strings, keyof Strings]> = {
  tables: ['chkTablesOk', 'chkTablesBad'], header: ['chkHeaderOk', 'chkHeaderBad'], boxes: ['chkBoxesOk', 'chkBoxesBad'],
  images: ['chkImagesOk', 'chkImagesBad'], columns: ['chkColumnsOk', 'chkColumnsBad'], profile: ['chkProfileOk', 'chkProfileBad'],
  experience: ['chkExperienceOk', 'chkExperienceBad'], education: ['chkEducationOk', 'chkEducationBad'], skills: ['chkSkillsOk', 'chkSkillsBad'],
  email: ['chkEmailOk', 'chkEmailBad'], phone: ['chkPhoneOk', 'chkPhoneBad'], linkedin: ['chkLinkedinOk', 'chkLinkedinBad'],
  nationality: ['chkNationalityOk', 'chkNationalityBad'], visa: ['chkVisaOk', 'chkVisaBad'], availability: ['chkAvailabilityOk', 'chkAvailabilityBad'],
  length: ['chkLengthOk', 'chkLengthBad'],
};
export const checkText = (c: Check, t: Strings) => fill(t[CHECK_TEXT[c.id][c.ok ? 0 : 1]] as string, { n: c.count ?? 0 });

function Shield({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path d="M12 3l7 3v5.5c0 4.4-3 8.3-7 9.5-4-1.2-7-5.1-7-9.5V6z" fill={color} fillOpacity={0.18} stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
      <Path d="M8.8 12.2l2.2 2.2 4.2-4.4" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

export default function Evaluate({ onPick, onDemo, onSave, onSettings }: { onPick: () => void; onDemo: (id: string) => void; onSave: () => void; onSettings: () => void }) {
  const { theme, t, apiKey } = useApp();
  const look = useButtonLook();
  const s = useDoc();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<'orig' | 'new'>('new');
  const [details, setDetails] = useState(false);
  const kbd = useKeyboardOpen();
  const scrollRef = useRef<React.ElementRef<typeof ScrollView>>(null);
  const yById = useRef<Record<number, number>>({});
  const jumpTo = (id: number) => scrollRef.current?.scrollTo({ y: Math.max(0, (yById.current[id] ?? 0) - 10), animated: true });
  const d = s.doc;

  if (!d) {
    return (
      <ScrollView contentContainerStyle={{ gap: 14, paddingBottom: TAB_SPACE + 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ flex: 1 }}><H1>{t.tabEval}</H1></View>
          <GearButton onPress={onSettings} />
        </View>
        <Card style={{ alignItems: 'center', gap: 12 }}>
          <AtsMark size={96} />
          <Text style={{ fontSize: 18, fontWeight: '700', color: theme.ink }}>{t.evalEmptyTitle}</Text>
          <Text style={{ fontSize: 14.5, lineHeight: 21, color: theme.muted, textAlign: 'center' }}>{t.evalEmptyBody}</Text>
          <View style={{ alignSelf: 'stretch' }}><Btn title={t.chooseFile} onPress={onPick} /></View>
        </Card>
        <Label>{t.filterDemo}</Label>
        <View style={{ gap: 8 }}>
          {DEMOS.map(m => <SmallBtn key={m.id} title={`${m.name} · ${t[m.meta] as string}`} onPress={() => onDemo(m.id)} />)}
        </View>
      </ScrollView>
    );
  }

  const score = s.after?.score ?? d.before.score;
  const ids = new Set(candidates(d.cv));
  const adv = d.advice;
  const withSugg = adv ? Object.values(adv).filter(a => a.suggestions.length).length : 0;
  const used = Object.keys(d.picked).length;
  const errText = s.error ? ({ nokey: t.noKeyBody, badkey: t.aiErrBadkey, busy: t.aiErrBusy, network: t.aiErrNetwork, answer: t.aiErrAnswer, other: fill(t.aiErrOther, { e: s.errorText }) } as const)[s.error] : '';
  const kw = (s.after ?? d.before).keywords;

  const save = () => {
    if (!used) { showDialog(t.noChangesTitle, t.noChangesBody); return; }
    const n = s.unfilled();
    if (n) { showDialog(t.saveBlockedTitle, fill(t.saveBlockedBody, { n })); return; }
    onSave();
  };

  // The paragraphs that have a suggestion card, for the side list that jumps between them.
  const navParas = adv ? d.cv.paras.filter(p => p.text.trim() && ids.has(p.id) && adv[p.id]) : [];
  const dotColor = (id: number) => {
    const a = adv?.[id];
    if (a && !a.suggestions.length) return theme.good;            // already ATS-friendly
    if (d.picked[id] !== undefined) return hasPlaceholder(s.textOf(id)) ? (theme.dark ? '#F3D9A0' : theme.accent) : theme.primary; // chosen (needs fill / done)
    return theme.dark ? 'rgba(183,198,195,0.35)' : theme.line;    // still open
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView ref={scrollRef} contentContainerStyle={{ gap: 12, paddingBottom: TAB_SPACE + insets.bottom + (adv ? 84 : 12) }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <H1 size={20}>{d.name}</H1>
            <Sub>{adv ? fill(t.usedCount, { n: used, m: withSugg }) : d.kind.toUpperCase()}</Sub>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel={`${t.scoreLabel} ${score}. ${t.scoreDetails}`} onPress={() => setDetails(v => !v)} style={{ alignItems: 'center', gap: 2 }}>
            {s.after && s.after.score !== d.before.score ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <ScoreRing score={d.before.score} size={36} dim />
                <Text style={{ color: theme.muted }}>→</Text>
                <ScoreRing score={score} size={52} />
              </View>
            ) : <ScoreRing score={score} size={52} />}
            <Text style={{ fontSize: 10.5, fontWeight: '700', letterSpacing: 0.6, color: theme.muted }}>{t.scoreLabel.toUpperCase()}</Text>
          </Pressable>
          <GearButton onPress={onSettings} />
        </View>

        {details ? (
          <Card style={{ gap: 8 }}>
            <Label>{t.scoreDetails}</Label>
            {(s.after ?? d.before).checks.map(c => (
              <View key={c.id} style={{ flexDirection: 'row', gap: 10 }}>
                <Text style={{ width: 18, fontSize: 15, fontWeight: '700', color: c.ok ? theme.good : theme.danger }}>{c.ok ? '✓' : '✗'}</Text>
                <Text style={{ flex: 1, fontSize: 14, lineHeight: 20, color: c.ok ? theme.muted : theme.ink }}>{checkText(c, t)}</Text>
              </View>
            ))}
            {kw ? (
              <View style={{ gap: 4, marginTop: 4 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: theme.ink }}>{fill(t.kwMatch, { p: kw.pct })}</Text>
                <Text style={{ fontSize: 13.5, lineHeight: 19, color: theme.muted }}>{kw.missing.length ? fill(t.kwMissing, { w: kw.missing.join(', ') }) : t.kwAllFound}</Text>
                {d.adIsDemo ? <Text style={{ fontSize: 12.5, color: theme.muted }}>{t.demoAdNote}</Text> : null}
              </View>
            ) : <Text style={{ fontSize: 13, color: theme.muted }}>{t.noAdHint}</Text>}
          </Card>
        ) : null}

        {adv ? <Segmented<'orig' | 'new'> value={mode} onChange={setMode} options={[['orig', t.tabOriginal], ['new', t.tabImproved]]} /> : null}

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 16, borderWidth: 1, borderColor: theme.dark ? 'rgba(95,196,180,0.35)' : theme.line, backgroundColor: theme.dark ? 'rgba(95,196,180,0.08)' : theme.card }}>
          <Shield color={theme.good} />
          <Text style={{ flex: 1, fontSize: 12.5, lineHeight: 17, color: theme.muted }}>{t.lockOn}</Text>
        </View>

        {adv && d.before.score >= 95 ? (
          <View style={{ gap: 6, padding: 12, borderRadius: 16, backgroundColor: theme.dark ? 'rgba(232,176,74,0.08)' : theme.chip, borderWidth: 1, borderColor: theme.dark ? 'rgba(232,176,74,0.3)' : theme.line }}>
            <Text style={{ fontSize: 13.5, fontWeight: '700', color: theme.ink }}>{t.scoreMaxTitle}</Text>
            <Text style={{ fontSize: 13, lineHeight: 19, color: theme.muted }}>{t.scoreMaxBody}</Text>
            {!kw ? <Text style={{ fontSize: 13, lineHeight: 19, color: theme.muted }}>{t.scoreMaxAd}</Text> : null}
          </View>
        ) : null}

        {!adv ? (
          <Card style={{ gap: 10 }}>
            {!apiKey ? (
              <>
                <Text style={{ fontSize: 16, fontWeight: '700', color: theme.ink }}>{t.noKeyTitle}</Text>
                <Text style={{ fontSize: 14, lineHeight: 20, color: theme.muted }}>{t.noKeyBody}</Text>
                <Btn title={t.toSettings} onPress={onSettings} />
              </>
            ) : s.busy ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52 }}>
                <ActivityIndicator color={look.fg} />
                <Text style={{ fontSize: 15, color: theme.ink }}>{fill(t.analysing, { n: ids.size })}</Text>
              </View>
            ) : (
              <>
                <Text style={{ fontSize: 14, lineHeight: 20, color: theme.muted }}>{t.getSuggestionsSub}</Text>
                <Btn title={t.getSuggestions} onPress={s.fetchAdvice} disabled={!ids.size} />
              </>
            )}
            {errText ? <Text style={{ fontSize: 13.5, lineHeight: 19, color: theme.danger }}>{errText}</Text> : null}
          </Card>
        ) : null}

        {d.cv.paras.map(p => {
          if (!p.text.trim()) return null;
          if (p.heading) return <Text key={p.id} style={{ fontSize: 12, fontWeight: '700', letterSpacing: 1.2, color: theme.accent, textTransform: 'uppercase', marginTop: 6 }}>{p.text}</Text>;
          const a = adv?.[p.id];
          if (!ids.has(p.id) || !a) {
            return <WithPlaceholders key={p.id} text={p.text} size={14} color={theme.muted} />;
          }
          const sel = d.picked[p.id];
          const picked = sel !== undefined;
          const now = s.textOf(p.id);
          const needFill = picked && hasPlaceholder(now);
          const good = !a.suggestions.length;
          const badge = good ? <Tag text={t.atsFriendly} color={theme.good} fill={theme.dark ? 'rgba(95,196,180,0.14)' : theme.chip} />
            : needFill ? <Tag text={t.fillIn} color={look.fg} dashed />
            : picked ? <Tag text={t.changed} color={theme.dark ? '#F3D9A0' : theme.accent} fill={theme.dark ? 'rgba(232,176,74,0.12)' : theme.chip} />
            : <Tag text={t.canImprove} color={look.fg} fill={theme.dark ? 'rgba(232,176,74,0.14)' : theme.chip} />;
          const placeholders = picked ? (a.suggestions[sel].text.match(PLACEHOLDERS) ?? []) : [];
          return (
            <Card key={p.id} onLayout={e => { yById.current[p.id] = e.nativeEvent.layout.y; }} style={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>{badge}</View>
              <WithPlaceholders text={mode === 'orig' ? p.text : now} />
              {mode === 'new' && !good ? (
                <View style={{ gap: 8, borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 10 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: look.fg }}>{t.suggestionsTap}</Text>
                  {a.suggestions.map((sg, i) => {
                    const on = sel === i;
                    return (
                      <Pressable key={i} accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => s.pick(p.id, i)}
                        style={({ pressed }) => ({ padding: 12, borderRadius: 14, borderWidth: on ? 2 : 1, borderColor: on ? theme.primary : theme.line, backgroundColor: on ? (theme.dark ? 'rgba(232,176,74,0.12)' : theme.chip) : theme.chip, opacity: pressed ? 0.85 : 1, gap: 6 })}>
                        <WithPlaceholders text={sg.text} size={14} />
                        {sg.why ? <Text style={{ fontSize: 12, color: theme.muted }}>{sg.why}</Text> : null}
                      </Pressable>
                    );
                  })}
                  {placeholders.length ? (
                    <View style={{ gap: 8, padding: 12, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', borderColor: look.fg }}>
                      <Text style={{ fontSize: 12.5, lineHeight: 17, color: theme.muted }}>{t.fillHint}</Text>
                      <View style={{ padding: 10, borderRadius: 12, backgroundColor: theme.card }}>
                        <Text style={{ fontSize: 11, fontWeight: '700', letterSpacing: 0.6, color: theme.muted, marginBottom: 4 }}>{t.previewLabel.toUpperCase()}</Text>
                        <WithPlaceholders text={now} size={14} />
                      </View>
                      {placeholders.map((ph, n) => (
                        <TextInput key={n} accessibilityLabel={fill(t.fillLabel, { p: ph })} placeholder={fill(t.fillLabel, { p: ph })} placeholderTextColor={theme.muted}
                          value={d.fills[p.id]?.[n] ?? ''} onChangeText={v => s.setFill(p.id, n, v)}
                          style={{ minHeight: 44, borderRadius: 12, borderWidth: 1, borderColor: theme.line, backgroundColor: theme.card, color: theme.ink, paddingHorizontal: 12, fontSize: 15 }} />
                      ))}
                    </View>
                  ) : null}
                  {picked ? (
                    <Pressable accessibilityRole="button" onPress={() => s.unpick(p.id)} style={{ alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center' }}>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: look.fg }}>{t.undoKeep}</Text>
                    </Pressable>
                  ) : null}
                </View>
              ) : null}
            </Card>
          );
        })}
        {adv ? (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}><SmallBtn title={s.busy ? t.analysing.replace('{n}', String(ids.size)) : t.newSuggestions} onPress={s.fetchAdvice} disabled={s.busy} /></View>
            <View style={{ flex: 1 }}><SmallBtn title={t.startOver} onPress={() => showDialog(t.startOverTitle, t.startOverBody, [{ text: t.cancel, style: 'cancel' }, { text: t.startOverYes, style: 'destructive', onPress: s.discard }])} /></View>
          </View>
        ) : null}
      </ScrollView>
      {/* Side list: a dot per paragraph with a suggestion card. Tap to jump straight to it. */}
      {adv && mode === 'new' && navParas.length > 3 && !kbd ? (
        <View pointerEvents="box-none" style={{ position: 'absolute', right: 4, top: 96, bottom: insets.bottom + 150, justifyContent: 'center' }}>
          <View style={{ alignSelf: 'flex-end', paddingVertical: 8, paddingHorizontal: 5, borderRadius: 14, backgroundColor: theme.dark ? 'rgba(19,34,37,0.82)' : 'rgba(250,248,244,0.9)', borderWidth: 1, borderColor: theme.dark ? 'rgba(232,176,74,0.22)' : theme.line, gap: 4 }}>
            {navParas.map(p => (
              <Pressable key={p.id} accessibilityRole="button" accessibilityLabel={p.text.trim().slice(0, 40)} onPress={() => jumpTo(p.id)} hitSlop={6}
                style={{ width: 16, height: 10, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: 14, height: 4, borderRadius: 2, backgroundColor: dotColor(p.id) }} />
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}
      {adv && !kbd ? (
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: insets.bottom + 84, flexDirection: 'row', gap: 10, paddingVertical: 8, backgroundColor: theme.bg }}>
          <View style={{ flex: 1 }}><Btn kind="secondary" title={t.useAllFirst} onPress={s.useAllFirst} /></View>
          <View style={{ flex: 1 }}><Btn title={t.saveNew} onPress={save} /></View>
        </View>
      ) : null}
    </View>
  );
}
