import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useApp } from '../store';
import { useDoc } from '../session';
import { Btn, Card, Header, Label, Screen, Segmented, Text, TextInput } from '../ui';
import { ScoreRing } from '../parts';
import { fill } from '../i18n';
import type { Kind } from '../core/cv';
import { baseName, cleanName, openOutsideMime, saveBytesToDownloads, shareBytes } from '../files';

type Fmt = Kind | 'pdf';
const MIMES: Record<Fmt, string> = {
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  odt: 'application/vnd.oasis.opendocument.text',
  pdf: 'application/pdf',
};

export default function Save({ onBack, onCompare }: { onBack: () => void; onCompare: () => void }) {
  const { theme, t, setScore, clearDraft } = useApp();
  const s = useDoc();
  const d = s.doc;
  const [name, setName] = useState(d ? `${baseName(d.name)}_ATS` : 'CV_ATS');
  const [fmt, setFmt] = useState<Fmt>(d ? d.kind : 'docx');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState<{ uri: string; name: string } | null>(null);
  const [err, setErr] = useState('');
  if (!d) return null;

  const ext = `.${fmt}`;
  const converting = fmt === 'pdf' || fmt !== d.kind;
  const edits = s.edits();
  const improved = Object.keys(edits).length;
  const good = d.advice ? Object.values(d.advice).filter(a => !a.suggestions.length).length : 0;
  const after = s.after?.score ?? d.before.score;
  const bytesFor = (): Uint8Array => (fmt === 'pdf' ? s.pdf() : s.buildAs(fmt));

  const save = async () => {
    setBusy(true); setErr('');
    try {
      const bytes = bytesFor();
      const r = await saveBytesToDownloads(`${cleanName(name) || 'CV_ATS'}${ext}`, MIMES[fmt], bytes);
      setSaved(r);
      setScore(`dl:${r.uri}`, after, s.thumb());
      clearDraft(d.key); // the work is finished and saved
    } catch (e) {
      const m = (e as Error)?.message ?? '';
      setErr(/android/.test(m) ? t.needAndroid : fill(t.saveFailed, { e: m }));
    }
    setBusy(false);
  };
  const share = async () => {
    try { await shareBytes(`${cleanName(name) || 'CV_ATS'}${ext}`, MIMES[fmt], bytesFor()); } catch (e) { setErr(fill(t.saveFailed, { e: (e as Error)?.message ?? '' })); }
  };

  return (
    <Screen>
      <Header title={t.saveTitle} onBack={onBack} />
      <ScrollView contentContainerStyle={{ gap: 14, paddingBottom: 16 }} keyboardShouldPersistTaps="handled">
        <Card style={{ gap: 12 }}>
          <Label>{t.scoreLabel}</Label>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <ScoreRing score={d.before.score} size={52} dim />
            <Text style={{ fontSize: 22, color: theme.muted }}>→</Text>
            <ScoreRing score={after} size={64} />
          </View>
          <View style={{ gap: 4 }}>
            <Text style={{ fontSize: 14, color: theme.ink }}>{fill(t.improvedN, { n: improved })}</Text>
            {good ? <Text style={{ fontSize: 14, color: theme.ink }}>{fill(t.alreadyGoodN, { n: good })}</Text> : null}
            <Text style={{ fontSize: 14, color: theme.ink }}>{t.originalUntouched}</Text>
          </View>
        </Card>
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: theme.ink }}>{t.fileName}</Text>
          <TextInput value={name} onChangeText={setName} accessibilityLabel={t.fileName} autoCapitalize="none"
            style={{ minHeight: 52, borderRadius: 16, borderWidth: 1, borderColor: theme.line, backgroundColor: theme.card, color: theme.ink, paddingHorizontal: 14, fontSize: 15 }} />
          <Text style={{ fontSize: 14, fontWeight: '600', color: theme.ink, marginTop: 4 }}>{t.format}</Text>
          <Segmented<Fmt> value={fmt} onChange={setFmt} options={[['docx', `.docx${d.kind === 'docx' ? ` · ${t.formatSameShort}` : ''}`], ['odt', `.odt${d.kind === 'odt' ? ` · ${t.formatSameShort}` : ''}`], ['pdf', '.pdf']]} />
          <Text style={{ fontSize: 13, lineHeight: 18, color: theme.muted }}>{fmt === 'pdf' ? t.formatPdfNote : converting ? t.formatConvertNote : t.formatSame}</Text>
        </View>
        {saved ? (
          <Card style={{ gap: 10, borderColor: theme.good }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: theme.good }}>{fill(t.savedWhere, { name: saved.name })}</Text>
            <Btn title={t.seeBeforeAfter} onPress={onCompare} />
            <Btn kind="secondary" title={`${t.share}`} onPress={share} />
            <Btn kind="secondary" title={saved.name} onPress={() => openOutsideMime(saved.uri, MIMES[fmt]).catch(() => {})} />
          </Card>
        ) : (
          <>
            <Btn title={busy ? t.saving : fill(t.saveAs, { ext })} onPress={save} disabled={busy} />
            <Btn kind="secondary" title={t.seeBeforeAfter} onPress={onCompare} />
            <Btn kind="secondary" title={t.share} onPress={share} />
          </>
        )}
        {err ? <Text style={{ fontSize: 14, lineHeight: 20, color: theme.danger }}>{err}</Text> : null}
      </ScrollView>
    </Screen>
  );
}
