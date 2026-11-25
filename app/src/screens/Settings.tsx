import React, { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, View } from 'react-native';
import Constants from 'expo-constants';
import { useApp } from '../store';
import { Body, Btn, Card, Choice, Header, Label, Row, Screen, Segmented, SmallBtn, Text, TextInput, ThemePreview, Toggle, useButtonLook } from '../ui';
import { themes, ThemeName } from '../theme';
import { MANUAL } from '../manual';
import { testKey, ModelKey, Tone } from '../core/ai';
import { dateYear } from '../dates';
import { isNewer, latestRelease, notesList, Release } from '../update';
import { downloadUpdate, Downloaded, installUpdate, UpdateError, UpdateFail } from '../updateInstall';

function Divider() {
  const { theme } = useApp();
  return <View style={{ height: 1, backgroundColor: theme.line }} />;
}

function Switch({ title, sub, on, onChange }: { title: string; sub?: string; on: boolean; onChange: (v: boolean) => void }) {
  const { theme } = useApp();
  return (
    <View>
      <Toggle title={title} on={on} onChange={onChange} />
      {sub ? <Text style={{ fontSize: 12.5, lineHeight: 17, color: theme.muted, marginTop: -4 }}>{sub}</Text> : null}
    </View>
  );
}

export default function Settings({ onBack, go, glow }: { onBack: () => void; go: (r: 'manual' | 'privacy' | 'update' | 'uninstall') => void; glow: boolean }) {
  const app = useApp();
  const { theme, t } = app;
  const look = useButtonLook();
  const [key, setKey] = useState('');
  const [keyState, setKeyState] = useState<'idle' | 'testing' | 'ok' | 'bad'>('idle');
  const [how, setHow] = useState(!app.apiKey);
  const badFormat = !!key.trim() && !key.trim().startsWith('sk-ant-');
  const version = Constants.expoConfig?.version ?? '';

  const saveKey = async () => { if (key.trim()) { await app.setApiKey(key); setKey(''); setKeyState('idle'); } };
  const test = async () => {
    const k = key.trim() || app.apiKey;
    if (!k) return;
    setKeyState('testing');
    try { await testKey(k); if (key.trim()) { await app.setApiKey(key); setKey(''); } setKeyState('ok'); } catch { setKeyState('bad'); }
  };

  return (
    <Screen>
      <Header title={t.settings} onBack={onBack} />
      <ScrollView contentContainerStyle={{ gap: 14, paddingBottom: 24 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

      <Card>
        <Label>{t.appearance}</Label>
        <Text style={{ fontSize: 15.5, fontWeight: '700', color: theme.ink }}>{t.theme}</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {(Object.keys(themes) as ThemeName[]).map(k => {
            const on = app.themeName === k;
            return (
              <Pressable key={k} accessibilityRole="radio" accessibilityState={{ checked: on }} onPress={() => app.setPrefs({ themeName: k })} style={{ flex: 1, alignItems: 'center', gap: 8 }}>
                <View style={{ borderRadius: 20, padding: 4, borderWidth: 2, borderColor: on ? '#E8B04A' : 'transparent' }}><ThemePreview th={themes[k]} /></View>
                <Text style={{ fontSize: 14, fontWeight: on ? '700' : '600', color: theme.ink }}>{k === 'dark' ? t.themeDark : t.themeBeige}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={{ fontSize: 12.5, color: theme.muted }}>{t.themeNote}</Text>
      </Card>

      <Card>
        <Label>{t.language}</Label>
        <Segmented<'en' | 'sv'> value={app.lang} onChange={v => app.setPrefs({ lang: v })} options={[['en', 'English'], ['sv', 'Svenska']]} />
        <Text style={{ fontSize: 12.5, color: theme.muted }}>{t.langNote}</Text>
      </Card>

      <Card>
        <Label>{t.regionSection}</Label>
        <Text style={{ fontSize: 13, lineHeight: 18, color: theme.muted }}>{t.regionNote}</Text>
        <Choice title={t.regionEu} sub={t.regionEuSub} on={app.region === 'eu'} onPress={() => app.setPrefs({ region: 'eu' })} />
        <Choice title={t.regionGulf} sub={t.regionGulfSub} on={app.region === 'gulf'} onPress={() => app.setPrefs({ region: 'gulf' })} />
        {app.region === 'gulf' ? (
          <View style={{ gap: 8, padding: 12, borderRadius: 16, backgroundColor: theme.chip }}>
            <Text style={{ fontSize: 13.5, fontWeight: '700', color: theme.ink }}>{t.gulfHeading}</Text>
            {[t.gulfPhoto, t.gulfPersonal, t.gulfLength, t.gulfArabic, t.gulfAi].map((line, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
                <Text style={{ color: theme.good, fontSize: 14, fontWeight: '700' }}>✓</Text>
                <Text style={{ flex: 1, fontSize: 13, lineHeight: 18, color: theme.muted }}>{line}</Text>
              </View>
            ))}
            <Text style={{ fontSize: 12.5, lineHeight: 17, color: theme.dark ? '#F2C2BC' : theme.danger }}>{t.gulfHonesty}</Text>
          </View>
        ) : null}
      </Card>

      <Card>
        <Label>{t.aiSection}</Label>
        <Text style={{ fontSize: 13, color: theme.muted }}>{t.perPara}</Text>
        <Segmented<'1' | '2' | '3'> value={String(app.count) as '1' | '2' | '3'} onChange={v => app.setPrefs({ count: Number(v) })} options={[['1', '1'], ['2', '2'], ['3', '3']]} />
        <Text style={{ fontSize: 13, color: theme.muted }}>{t.tone}</Text>
        <Segmented<Tone> value={app.tone} onChange={v => app.setPrefs({ tone: v })} options={[['neutral', t.toneNeutral], ['formal', t.toneFormal], ['persuasive', t.tonePersuasive]]} />
        <Switch title={t.useAd} sub={t.useAdSub} on={app.useAd} onChange={v => app.setPrefs({ useAd: v })} />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.dark ? 'rgba(95,196,180,0.12)' : theme.chip, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 18, color: theme.good }}>✓</Text>
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ fontSize: 15.5, fontWeight: '700', color: theme.ink }}>{t.honesty}</Text>
            <Text style={{ fontSize: 12.5, lineHeight: 18, color: theme.muted }}>{t.honestySub}</Text>
          </View>
        </View>
        <Divider />
        <Text style={{ fontSize: 15.5, fontWeight: '700', color: theme.ink }}>{t.aiService}</Text>
        <Text style={{ fontSize: 12.5, color: theme.muted, marginTop: -6 }}>{t.aiServiceSub}</Text>
        <Text style={{ fontSize: 13, color: theme.muted }}>{t.model}</Text>
        <Segmented<ModelKey> value={app.model} onChange={v => app.setPrefs({ model: v })} options={[['fast', t.modelFast], ['best', t.modelBest]]} />
        <Text style={{ fontSize: 12.5, color: theme.muted }}>{app.model === 'fast' ? t.modelFastNote : t.modelBestNote}</Text>
        <Text style={{ fontSize: 15.5, fontWeight: '700', color: theme.ink }}>{t.apiKey}</Text>
        <Text style={{ fontSize: 13, lineHeight: 19, color: theme.muted, marginTop: -6 }}>{t.keyWhat}</Text>
        <Pressable accessibilityRole="button" accessibilityState={{ expanded: how }} onPress={() => setHow(v => !v)} style={{ minHeight: 40, justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: look.fg }}>{`${how ? '▾' : '▸'}  ${t.keyHow}`}</Text>
        </Pressable>
        {how ? (
          <View style={{ gap: 8, padding: 12, borderRadius: 16, backgroundColor: theme.chip }}>
            {(t.keySteps as unknown as string[]).map((st, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: look.border, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: look.fg }}>{i + 1}</Text>
                </View>
                <Text style={{ flex: 1, fontSize: 13.5, lineHeight: 19, color: theme.ink }}>{st}</Text>
              </View>
            ))}
          </View>
        ) : null}
        <TextInput value={key} onChangeText={v => { setKey(v); setKeyState('idle'); }} placeholder={app.apiKey ? '••••••••••••' + app.apiKey.slice(-4) : t.apiKeyPh} placeholderTextColor={theme.muted}
          secureTextEntry autoCapitalize="none" autoCorrect={false} accessibilityLabel={t.apiKey}
          style={{ minHeight: 48, borderRadius: 14, borderWidth: 1, borderColor: theme.line, backgroundColor: theme.chip, color: theme.ink, paddingHorizontal: 14, fontSize: 15 }} />
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {key.trim() ? <SmallBtn title={t.saveKey} onPress={saveKey} tone="accent" /> : null}
          <SmallBtn title={keyState === 'testing' ? t.keyTesting : t.testKey} onPress={test} disabled={keyState === 'testing' || (!key.trim() && !app.apiKey)} />
          <Text style={{ fontSize: 13, fontWeight: '700', color: keyState === 'ok' ? theme.good : keyState === 'bad' ? theme.danger : theme.muted }}>
            {keyState === 'ok' ? t.keyOk : keyState === 'bad' ? t.keyBad : app.apiKey ? t.keySaved : t.keyNone}
          </Text>
        </View>
        {badFormat ? <Text style={{ fontSize: 12.5, lineHeight: 18, color: theme.danger }}>{t.keyFormat}</Text> : null}
        <Text style={{ fontSize: 12.5, lineHeight: 18, color: theme.muted }}>{t.keyNote}</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <SmallBtn title={t.getKey} onPress={() => Linking.openURL('https://console.anthropic.com').catch(() => {})} />
          {app.apiKey ? <SmallBtn title={t.keyRemove} onPress={() => { app.setApiKey(''); setKeyState('idle'); }} /> : null}
        </View>
      </Card>

      <Card>
        <Label>{t.savingSection}</Label>
        <View style={{ gap: 2 }}>
          <Text style={{ fontSize: 15.5, fontWeight: '700', color: theme.ink }}>{t.folder}</Text>
          <Text style={{ fontSize: 12.5, color: theme.muted }}>{t.folderSub}</Text>
        </View>
        <Switch title={t.showDemo} sub={t.showDemoSub} on={app.showDemo} onChange={v => app.setPrefs({ showDemo: v })} />
      </Card>

      <Card>
        <Label>{t.updatesSection}</Label>
        <Row title={`ATS ${version}`} sub={glow ? t.newVersion : t.checkUpdate} onPress={() => go('update')} />
        <Switch title={t.updateAutoLabel} on={app.updateAuto} onChange={v => app.setPrefs({ updateAuto: v })} />
      </Card>

      <Card>
        <Label>{t.protectSection}</Label>
        {[[t.protectAuth, t.protectAuthSub], [t.protectCode, t.protectCodeSub], [t.protectKeys, t.protectKeysSub]].map(([title, sub], i) => (
          <View key={i}>
            {i ? <Divider /> : null}
            <View style={{ flexDirection: 'row', gap: 12, marginTop: i ? 10 : 0 }}>
              <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: theme.dark ? 'rgba(95,196,180,0.12)' : theme.chip, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, color: theme.good }}>✓</Text>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: theme.ink }}>{title}</Text>
                <Text style={{ fontSize: 12.5, lineHeight: 18, color: theme.muted }}>{sub}</Text>
              </View>
            </View>
          </View>
        ))}
      </Card>

      <Card>
        <Label>{t.aboutSection}</Label>
        <Row title={t.manual} sub={t.manualSub} onPress={() => go('manual')} />
        <Divider />
        <Row title={t.privacy} sub={t.privacySub} onPress={() => go('privacy')} />
        <Divider />
        <Row title={t.uninstall} sub={t.uninstallSub} onPress={() => go('uninstall')} />
        <Text style={{ fontSize: 13, color: theme.muted }}>{t.developer}</Text>
      </Card>
      <Text style={{ textAlign: 'center', fontSize: 12.5, color: look.fg }}>{`ATS v${version}`}</Text>
      </ScrollView>
    </Screen>
  );
}

export function ManualScreen({ onBack }: { onBack: () => void }) {
  const { t, lang, theme } = useApp();
  return (
    <Screen>
      <Header title={t.manual} sub={`${t.version} ${Constants.expoConfig?.version ?? ''}`} onBack={onBack} />
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 16 }}>
        {MANUAL[lang].map(sec => (
          <Card key={sec.title} style={{ gap: 8 }}>
            <Label>{sec.title}</Label>
            {sec.items.map((it, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
                <Text style={{ color: theme.tabActive, fontSize: 14.5 }}>•</Text>
                <Body style={{ flex: 1, fontSize: 14.5, lineHeight: 21 }}>{it}</Body>
              </View>
            ))}
          </Card>
        ))}
        <Text style={{ textAlign: 'center', fontSize: 12.5, color: theme.muted }}>{t.developer}</Text>
      </ScrollView>
    </Screen>
  );
}

export function UninstallScreen({ onBack }: { onBack: () => void }) {
  const { theme, t } = useApp();
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const backup = async (share: boolean) => {
    setErr(''); setMsg('');
    try {
      const { buildBackup } = await import('../backup');
      const { saveBytesToDownloads, shareBytes } = await import('../files');
      const b = await buildBackup();
      if (share) { await shareBytes(b.name, 'application/zip', b.bytes); setMsg(fill(t.backupMade, { name: b.name })); }
      else { const r = await saveBytesToDownloads(b.name, 'application/zip', b.bytes); setMsg(fill(t.backupMade, { name: r.name })); }
    } catch (e) { setErr(fill(t.backupFailed, { e: (e as Error)?.message ?? '' })); }
  };
  const deleteAll = async () => {
    setErr(''); setMsg('');
    try { const { deleteSaved } = await import('../files'); const n = await deleteSaved(); setMsg(`${n}`); } catch (e) { setErr(fill(t.backupFailed, { e: (e as Error)?.message ?? '' })); }
  };
  const openUninstall = async () => {
    try { const IntentLauncher = await import('expo-intent-launcher'); await IntentLauncher.startActivityAsync('android.intent.action.DELETE', { data: 'package:se.sncab.ats' }); } catch {}
  };
  const restore = async () => {
    setErr(''); setMsg('');
    try {
      const DocumentPicker = await import('expo-document-picker');
      const r = await DocumentPicker.getDocumentAsync({ type: ['application/zip', 'application/octet-stream'], copyToCacheDirectory: true });
      const a = r.canceled ? null : r.assets[0];
      if (!a) return;
      const { readUri } = await import('../files');
      const { restoreBackup } = await import('../backup');
      const okRestore = await restoreBackup(await readUri(a.uri));
      setMsg(okRestore ? t.restoreDone : fill(t.restoreFailed, { e: 'format' }));
    } catch (e) { setErr(fill(t.restoreFailed, { e: (e as Error)?.message ?? '' })); }
  };
  return (
    <Screen>
      <Header title={t.uninstall} onBack={onBack} />
      <ScrollView contentContainerStyle={{ gap: 14, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <Card style={{ gap: 10 }}>
          <Text style={{ fontSize: 14, lineHeight: 20, color: theme.muted }}>{t.uninstallIntro}</Text>
          <Btn title={t.backupNow} onPress={() => backup(false)} />
          <Btn kind="secondary" title={t.backupShare} onPress={() => backup(true)} />
          {msg ? <Text style={{ fontSize: 13.5, color: theme.good }}>{msg}</Text> : null}
          {err ? <Text style={{ fontSize: 13.5, color: theme.danger }}>{err}</Text> : null}
        </Card>
        <Card style={{ gap: 10 }}>
          <Label>{t.keepFolderTitle}</Label>
          <Text style={{ fontSize: 13.5, lineHeight: 19, color: theme.muted }}>{t.keepFolderSub}</Text>
          <Btn kind="danger" title={t.deleteAll} onPress={deleteAll} />
          <Text style={{ fontSize: 12.5, color: theme.muted }}>{t.deleteAllSub}</Text>
        </Card>
        <Btn title={t.openUninstall} onPress={openUninstall} />
        <Card style={{ gap: 10 }}>
          <Label>{t.restoreTitle}</Label>
          <Text style={{ fontSize: 13.5, lineHeight: 19, color: theme.muted }}>{t.restoreSub}</Text>
          <Btn kind="secondary" title={t.restorePick} onPress={restore} />
        </Card>
      </ScrollView>
    </Screen>
  );
}

export function PrivacyScreen({ onBack }: { onBack: () => void }) {
  const { t } = useApp();
  return (
    <Screen>
      <Header title={t.privacy} onBack={onBack} />
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 16 }}>
        <Card>{(t.privacyBody as unknown as string[]).map((p, i) => <Body key={i}>{p}</Body>)}</Card>
      </ScrollView>
    </Screen>
  );
}

export function UpdateScreen({ onBack, auto }: { onBack: () => void; auto?: boolean }) {
  const { theme, t, lang, updateAuto, updateChecked, setPrefs } = useApp();
  const look = useButtonLook();
  const cur = Constants.expoConfig?.version ?? '0.0.0';
  type Check = 'idle' | 'checking' | 'latest' | 'none' | 'failed';
  const [state, setState] = useState<Check>('idle');
  const [rel, setRel] = useState<Release | null>(null);
  const [part, setPart] = useState<number | null>(null);
  const [file, setFile] = useState<Downloaded | null>(null);
  const [err, setErr] = useState<UpdateError | null>(null);
  const note = (r: Release) => ({ title: t.updatedTitle.replace('{v}', r.tag.replace(/^v/i, '')), body: t.updatedBody, channel: t.updateChannel });
  const errText: Record<UpdateError, string> = {
    network: t.updErrNetwork, checksum: t.updErrChecksum, package: t.updErrPackage, older: t.updErrOlder,
    signature: t.updErrSignature, install: t.updErrInstall, allow: t.updAllow,
  };
  const install = async (r: Release, f: Downloaded) => {
    setErr(null);
    try { await installUpdate(f, note(r)); } catch (e) { setErr(e instanceof UpdateFail ? e.kind : 'install'); }
  };
  const downloadAndInstall = async (r = rel) => {
    if (!r) return;
    if (!r.apk) { Linking.openURL(r.page).catch(() => {}); return; }
    setErr(null); setFile(null); setPart(0);
    try { const f = await downloadUpdate(r, setPart); setFile(f); setPart(null); await install(r, f); }
    catch (e) { setPart(null); setErr(e instanceof UpdateFail ? e.kind : 'network'); }
  };
  const check = async (andInstall = false) => {
    if (part != null) return;
    setState('checking'); setErr(null);
    try {
      const r = await latestRelease();
      setPrefs({ updateChecked: Date.now(), updateTag: r && isNewer(r.tag, cur) ? r.tag : '' });
      if (!r) { setRel(null); setState('none'); return; }
      if (isNewer(r.tag, cur)) {
        if (r.tag !== rel?.tag) setFile(null);
        setRel(r); setState('idle');
        if (andInstall) downloadAndInstall(r);
      } else { setRel(null); setState('latest'); }
    } catch { setState('failed'); }
  };
  useEffect(() => { check(!!auto); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const when = (ms: number) => {
    const d = new Date(ms), today = new Date().toDateString() === d.toDateString();
    const hm = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    return today ? hm : `${dateYear(d, lang)} ${hm}`;
  };
  const mb = (b: number) => (b > 0 ? `${(b / 1e6).toFixed(0)} MB` : '');
  const notes = rel ? notesList(rel.notes, lang) : [];
  const downloading = part != null;
  return (
    <Screen>
      <Header title={t.update} sub={t.updateSub} onBack={onBack} />
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
        <Card style={{ gap: 6 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: theme.ink }}>{`${t.version} ${cur}`}</Text>
          <Text style={{ fontSize: 14, color: state === 'failed' ? theme.danger : theme.muted }}>
            {state === 'checking' ? t.checking : state === 'failed' ? t.updateFail : state === 'none' ? t.noRelease : rel ? t.updNewFound.replace('{v}', rel.tag.replace(/^v/i, '')) : t.upToDate}
          </Text>
          <Text style={{ fontSize: 12.5, color: theme.muted }}>{updateChecked ? t.updCheckedAt.replace('{t}', when(updateChecked)) : t.updNeverChecked}</Text>
        </Card>
        {rel ? (
          <Card style={{ gap: 10, borderColor: look.border }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Label>{t.updNew}</Label>
              <View style={{ flex: 1 }} />
              <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, borderWidth: 1, borderColor: rel.prerelease ? theme.danger : theme.good }}>
                <Text style={{ fontSize: 11.5, fontWeight: '700', color: rel.prerelease ? theme.danger : theme.good }}>{rel.prerelease ? t.updPrerelease : t.updStable}</Text>
              </View>
            </View>
            <Text style={{ fontSize: 22, fontWeight: '800', color: look.fg }}>{`ATS ${rel.tag.replace(/^v/i, '')}`}</Text>
            <Text style={{ fontSize: 12.5, color: theme.muted }}>{[t.updYouHave.replace('{v}', cur), mb(rel.size), rel.published ? t.updReleased.replace('{d}', dateYear(new Date(rel.published), lang)) : ''].filter(Boolean).join(' · ')}</Text>
            {notes.length ? (
              <View style={{ gap: 6, marginTop: 2 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: theme.accent, letterSpacing: 1 }}>{t.updWhatsNew.toUpperCase()}</Text>
                {notes.map((n, i) => (
                  <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
                    <Text style={{ color: look.fg, fontSize: 14 }}>•</Text>
                    <Text style={{ flex: 1, fontSize: 14, lineHeight: 20, color: theme.muted }}>{n}</Text>
                  </View>
                ))}
              </View>
            ) : null}
            {downloading ? (
              <View style={{ gap: 4 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: theme.ink }}>{t.updDownloadingPct.replace('{p}', String(Math.round((part ?? 0) * 100)))}</Text>
                <View style={{ height: 8, borderRadius: 4, backgroundColor: theme.line, overflow: 'hidden' }}>
                  <View style={{ width: `${Math.round((part ?? 0) * 100)}%`, height: 8, borderRadius: 4, backgroundColor: theme.tabActive }} />
                </View>
              </View>
            ) : file ? (
              <>
                <Text style={{ fontSize: 13, color: theme.good }}>{file.verified ? t.updVerified : t.updDownloaded}</Text>
                <Btn title={t.updInstall.replace('{v}', rel.tag.replace(/^v/i, ''))} onPress={() => install(rel, file)} />
              </>
            ) : (
              <Btn title={t.updDownloadInstall} onPress={() => downloadAndInstall()} />
            )}
            {err ? <Text style={{ fontSize: 13, lineHeight: 19, color: err === 'allow' ? look.fg : theme.danger }}>{errText[err]}</Text> : null}
            <Text style={{ fontSize: 12, lineHeight: 17, color: theme.muted }}>{t.updInstallNote}</Text>
            {err && err !== 'allow' ? <Btn kind="secondary" title={t.updOpenPage} onPress={() => Linking.openURL(rel.page).catch(() => {})} /> : null}
          </Card>
        ) : null}
        <Btn title={state === 'checking' ? t.checking : t.checkUpdate} onPress={() => check()} disabled={state === 'checking' || downloading} />
        <Card style={{ gap: 6 }}>
          <Toggle title={t.updateAutoLabel} on={updateAuto} onChange={v => setPrefs({ updateAuto: v })} />
          <Text style={{ fontSize: 12.5, color: theme.muted, lineHeight: 18 }}>{t.updateHow}</Text>
          <Text style={{ fontSize: 12, color: theme.muted, lineHeight: 17 }}>{t.updPrivacy}</Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}
