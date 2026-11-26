import React, { useCallback, useEffect, useState } from 'react';
import { AppState, BackHandler, View } from 'react-native';
import { useFonts } from 'expo-font';
import Constants from 'expo-constants';
import * as DocumentPicker from 'expo-document-picker';
import { PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans';
import { Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AtsNativeModule } from './modules/ats-native';
import { AppProvider, useApp } from './src/store';
import { DocProvider, useDoc } from './src/session';
import { DialogHost, showDialog } from './src/dialog';
import { Route } from './src/nav';
import { AtsMark, Screen, TabBar, TabName, Text, useKeyboardOpen } from './src/ui';
import { isNewer, latestRelease } from './src/update';
import { DocItem, useDocList } from './src/library';
import { DEMOS, demoKey } from './src/demo';
import { keepCopy, readDemo, readUri } from './src/files';
import { kindOf } from './src/core/cv';
import Splash from './src/screens/Splash';
import Home from './src/screens/Home';
import Evaluate from './src/screens/Evaluate';
import Library from './src/screens/Library';
import Picker from './src/screens/Picker';
import LinkedIn from './src/screens/LinkedIn';
import Save from './src/screens/Save';
import Compare from './src/screens/Compare';
import Settings, { ManualScreen, PrivacyScreen, UninstallScreen, UpdateScreen } from './src/screens/Settings';

const UPDATE_EVERY = 6 * 3600 * 1000;

function Content() {
  const { ready, updateTag, updateChecked, updateAuto, folderMade, setPrefs, addRecent, removeRecent, t } = useApp();
  const session = useDoc();
  const [stack, setStack] = useState<Route[]>([{ name: 'tabs' }]);
  const [tab, setTab] = useState<TabName>('home');
  const [refresh, setRefresh] = useState(0);
  const { items, demos } = useDocList(refresh);
  const push = useCallback((r: Route) => setStack(s => [...s, r]), []);
  const pop = useCallback(() => setStack(s => (s.length > 1 ? s.slice(0, -1) : s)), []);
  const toTabs = useCallback((k: TabName) => { setStack([{ name: 'tabs' }]); setTab(k); }, []);
  const version = Constants.expoConfig?.version ?? '0.0.0';
  const glow = !!updateTag && isNewer(updateTag, version);
  const keyboardOpen = useKeyboardOpen();

  // ATS is open: the "ATS is updated" notification is not needed any more.
  useEffect(() => { try { AtsNativeModule?.clearUpdateNotice(); } catch {} }, []);
  // Download/ATS is created on the first start, so the folder is there before anything is saved.
  useEffect(() => {
    if (!ready || folderMade || !AtsNativeModule) return;
    AtsNativeModule.makeFolder(t.folderNote).then(ok => { if (ok) setPrefs({ folderMade: true }); }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);
  // Look for a new version now and then; the gear glows when there is one.
  useEffect(() => {
    if (!ready || !updateAuto || Date.now() - updateChecked < UPDATE_EVERY) return;
    latestRelease().then(r => setPrefs({ updateTag: r && isNewer(r.tag, version) ? r.tag : '', updateChecked: Date.now() })).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);
  // The list is read again when Documents or Home is shown.
  useEffect(() => { if (tab === 'docs' || tab === 'home') setRefresh(n => n + 1); }, [tab]);
  // Read the list again when ATS comes back to the foreground, so a document added over
  // USB or from a computer while ATS was in the background shows up without a restart.
  useEffect(() => {
    const sub = AppState.addEventListener('change', s => { if (s === 'active') setRefresh(n => n + 1); });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stack.length > 1) { pop(); return true; }
      if (tab !== 'home') { setTab('home'); return true; }
      return false;
    });
    return () => sub.remove();
  }, [stack.length, pop, tab]);

  const failed = (e: unknown) => showDialog(t.evaluateCv, `${t.openFailed}${(e as Error)?.message ? `\n\n(${(e as Error).message})` : ''}`);

  const openItem = useCallback(async (d: DocItem) => {
    try {
      let bytes: Uint8Array;
      if (d.source === 'demo' && d.demo) bytes = await readDemo(d.demo);
      else if (d.source === 'saved' && d.uri) bytes = await readUri(d.uri);
      else if (d.path) bytes = await readUri(d.path);
      else throw new Error('no file');
      session.open(bytes, { key: d.key, name: d.name, kind: d.kind, demo: d.demo?.id, demoAd: d.demo?.ad });
      toTabs('eval');
    } catch (e) {
      if (d.source === 'opened') removeRecent(d.key);
      failed(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, toTabs, removeRecent, t]);

  const openDemo = useCallback((id: string) => {
    const m = DEMOS.find(x => x.id === id);
    if (m) openItem({ key: demoKey(m.id), name: m.name, kind: m.kind, source: 'demo', demo: m, at: 0, score: null, photo: m.photo, meta: '' });
  }, [openItem]);

  const pick = useCallback(async () => {
    const r = await DocumentPicker.getDocumentAsync({
      type: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.oasis.opendocument.text', 'application/msword', 'application/octet-stream'],
      copyToCacheDirectory: true, multiple: false,
    });
    const a = r.canceled ? null : r.assets[0];
    if (!a) return;
    const kind = kindOf(a.name);
    if (!kind) { showDialog(t.evaluateCv, t.wrongType); return; }
    try {
      const bytes = await readUri(a.uri);
      const key = `f:${Date.now().toString(36)}`;
      session.open(bytes, { key, name: a.name, kind });
      try { addRecent({ key, name: a.name, kind, path: await keepCopy(key, kind, bytes), at: Date.now() }); } catch {}
      toTabs('eval');
    } catch (e) { failed(e); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, addRecent, toTabs, t]);

  const toSettings = () => push({ name: 'settings' });
  const toPicker = () => push({ name: 'picker' });
  const r = stack[stack.length - 1];
  switch (r.name) {
    case 'save': return <Save onBack={pop} onCompare={() => push({ name: 'compare' })} />;
    case 'compare': return <Compare onBack={pop} onImprove={() => toTabs('eval')} />;
    case 'picker': return <Picker items={items} onOpen={d => { pop(); openItem(d); }} onBrowse={() => { pop(); pick(); }} onBack={pop} />;
    case 'linkedin': return <LinkedIn onBack={pop} onSettings={toSettings} />;
    case 'settings': return <Settings onBack={pop} go={name => push({ name })} glow={glow} />;
    case 'manual': return <ManualScreen onBack={pop} />;
    case 'privacy': return <PrivacyScreen onBack={pop} />;
    case 'uninstall': return <UninstallScreen onBack={pop} />;
    case 'update': return <UpdateScreen onBack={pop} auto={r.auto} />;
    default:
      return (
        <Screen bottom={false}>
          <View style={{ flex: 1 }}>
            {tab === 'home' && <Home items={items} onEvaluate={toPicker} onOpen={openItem} onAllDocs={() => setTab('docs')} onGear={toSettings} onLinkedIn={() => push({ name: 'linkedin' })} glow={glow} />}
            {tab === 'eval' && <Evaluate onPick={toPicker} onDemo={openDemo} onSave={() => push({ name: 'save' })} onSettings={toSettings} />}
            {tab === 'docs' && <Library items={items} demos={demos} onOpen={openItem} onGear={toSettings} glow={glow} />}
          </View>
          {!keyboardOpen && <TabBar tab={tab} setTab={setTab} />}
        </Screen>
      );
  }
}

// Fonts and saved settings load first (on the same dark colour as the native start screen),
// then the animated start screen plays on top of the app while it gets ready.
function Root() {
  const { ready, theme } = useApp();
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold, Cinzel_700Bold,
  });
  const [splashDone, setSplashDone] = useState(false);
  // The app is signed with the developer's key. A re-signed copy (e.g. one with a hidden change) is stopped.
  const [authentic, setAuthentic] = useState(true);
  useEffect(() => { try { setAuthentic(AtsNativeModule?.isAuthentic?.() ?? true); } catch {} }, []);
  if (!ready || !fontsLoaded) return <View style={{ flex: 1, backgroundColor: '#0B1416' }} />;
  if (!authentic) return <NotAuthentic />;
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <DocProvider><Content /></DocProvider>
      {!splashDone && <Splash onDone={() => setSplashDone(true)} />}
      <DialogHost />
    </View>
  );
}

function NotAuthentic() {
  const { t, theme } = useApp();
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 14 }}>
      <AtsMark size={96} />
      <Text style={{ fontSize: 20, fontWeight: '700', color: theme.ink, textAlign: 'center' }}>{t.notAuthenticTitle}</Text>
      <Text style={{ fontSize: 15, lineHeight: 22, color: theme.muted, textAlign: 'center' }}>{t.notAuthenticBody}</Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider><Root /></AppProvider>
    </SafeAreaProvider>
  );
}
