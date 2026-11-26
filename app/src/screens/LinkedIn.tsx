import React, { useState } from 'react';
import { ScrollView, Share, View } from 'react-native';
import { useApp } from '../store';
import { Btn, Card, Header, Label, Screen, Segmented, SmallBtn, Text, TextInput, useButtonLook } from '../ui';
import { WithPlaceholders } from '../parts';
import { fill } from '../i18n';
import { improveText, TextKind, ApiError } from '../core/ai';

export default function LinkedIn({ onBack, onSettings }: { onBack: () => void; onSettings: () => void }) {
  const app = useApp();
  const { theme, t } = app;
  const look = useButtonLook();
  const [kind, setKind] = useState<TextKind>('summary');
  const [sum, setSum] = useState(app.linkedin.summary);
  const [exp, setExp] = useState(app.linkedin.experience);
  const [target, setTarget] = useState('');
  const [variants, setVariants] = useState<string[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [noKey, setNoKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const text = kind === 'summary' ? sum : exp;
  const setText = (v: string) => (kind === 'summary' ? setSum(v) : setExp(v));
  const persist = () => app.setPrefs({ linkedin: { summary: sum, experience: exp } });
  const back = () => { persist(); onBack(); };

  const errText = (e: unknown): { msg: string; nokey: boolean } => {
    const kindErr = ((e as any)?.kind as ApiError) ?? 'other';
    if (kindErr === 'nokey') return { msg: '', nokey: true };
    if (kindErr === 'badkey') return { msg: t.aiErrBadkey, nokey: false };
    if (kindErr === 'busy') return { msg: t.aiErrBusy, nokey: false };
    if (kindErr === 'network') return { msg: t.aiErrNetwork, nokey: false };
    if (kindErr === 'answer') return { msg: t.aiErrAnswer, nokey: false };
    return { msg: fill(t.aiErrOther, { e: (e as Error)?.message ?? '' }), nokey: false };
  };

  const improve = async () => {
    if (!text.trim()) { setErr(t.liEmpty); return; }
    setBusy(true); setErr(''); setNoKey(false); setVariants(null); persist();
    try {
      const out = await improveText({ text, kind, ad: target.trim() || undefined, apiKey: app.apiKey, model: app.model, tone: app.tone, appLang: app.lang });
      setVariants(out); setIdx(0);
    } catch (e) {
      const r = errText(e);
      if (r.nokey) setNoKey(true); else setErr(r.msg);
    }
    setBusy(false);
  };

  const copy = async () => {
    if (!variants) return;
    try { await Share.share({ message: variants[idx] }); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  const field = { minHeight: 52, borderRadius: 16, borderWidth: 1, borderColor: theme.line, backgroundColor: theme.card, color: theme.ink, paddingHorizontal: 14, paddingTop: 12, fontSize: 15 } as const;

  return (
    <Screen>
      <Header title={t.linkedinTitle} sub={t.linkedinSub} onBack={back} />
      <ScrollView contentContainerStyle={{ gap: 14, paddingBottom: 28 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Segmented<TextKind> value={kind} onChange={k => { setKind(k); setVariants(null); setErr(''); }} options={[['summary', t.liSummary], ['experience', t.liExperience]]} />
        <Text style={{ fontSize: 12.5, color: theme.muted, marginTop: -6 }}>{kind === 'summary' ? t.liSummaryHint : t.liExperienceHint}</Text>

        <View style={{ gap: 7 }}>
          <Label>{t.liYourText}</Label>
          <TextInput value={text} onChangeText={setText} multiline placeholder={t.liTextPlaceholder} placeholderTextColor={theme.muted}
            style={[field, { minHeight: 150, textAlignVertical: 'top', lineHeight: 21 }]} />
        </View>

        <View style={{ gap: 7 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Label>{`${t.liTarget} · ${t.liOptional}`}</Label>
            {app.ad.trim() ? <View style={{ marginLeft: 'auto' }}><SmallBtn title={t.liUseAd} onPress={() => setTarget(app.ad)} /></View> : null}
          </View>
          <TextInput value={target} onChangeText={setTarget} multiline placeholder={t.liTarget} placeholderTextColor={theme.muted}
            style={[field, { minHeight: 46, textAlignVertical: 'top' }]} />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 11, borderRadius: 14, borderWidth: 1, borderColor: theme.dark ? 'rgba(95,196,180,0.35)' : theme.line, backgroundColor: theme.dark ? 'rgba(95,196,180,0.08)' : theme.card }}>
          <Text style={{ color: theme.good, fontSize: 16 }}>✓</Text>
          <Text style={{ flex: 1, fontSize: 12.5, lineHeight: 17, color: theme.muted }}>{t.liLockOn}</Text>
        </View>

        <Btn title={busy ? t.liImproving : t.liImprove} onPress={improve} disabled={busy} />

        {noKey ? (
          <Card style={{ gap: 8 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: theme.ink }}>{t.noKeyTitle}</Text>
            <Text style={{ fontSize: 13.5, lineHeight: 19, color: theme.muted }}>{t.noKeyBody}</Text>
            <Btn kind="secondary" title={t.settings} onPress={onSettings} />
          </Card>
        ) : null}
        {err ? <Text style={{ fontSize: 13.5, color: theme.danger }}>{err}</Text> : null}

        {variants && variants.length ? (
          <View style={{ gap: 12 }}>
            <View style={{ gap: 6 }}>
              <Text style={{ fontSize: 11.5, fontWeight: '700', letterSpacing: 0.6, color: theme.muted }}>{t.liOriginal.toUpperCase()}</Text>
              <View style={{ borderRadius: 16, borderWidth: 1, borderColor: theme.line, backgroundColor: theme.bg, padding: 13 }}>
                <Text style={{ fontSize: 13, lineHeight: 20, color: theme.muted }}>{text}</Text>
              </View>
            </View>
            <View style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 11.5, fontWeight: '700', letterSpacing: 0.6, color: theme.good }}>{t.liImproved.toUpperCase()}</Text>
                {variants.length > 1 ? <Text style={{ marginLeft: 'auto', fontSize: 11.5, color: theme.muted }}>{fill(t.liVariant, { n: idx + 1, m: variants.length })}</Text> : null}
              </View>
              <View style={{ borderRadius: 16, borderWidth: 1, borderColor: look.fg, backgroundColor: theme.card, padding: 13 }}>
                <WithPlaceholders text={variants[idx]} size={14} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {variants.length > 1 ? <View style={{ flex: 1 }}><Btn kind="secondary" title={t.liNext} onPress={() => setIdx(i => (i + 1) % variants.length)} /></View> : null}
              <View style={{ flex: 1.3 }}><Btn title={copied ? t.liCopied : t.liCopy} onPress={copy} /></View>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}
