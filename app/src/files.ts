// Reading and saving documents: picked files, the demo CVs, the app's own copies and Download/ATS.
import { Platform } from 'react-native';
import { Asset } from 'expo-asset';
import { Directory, File, Paths } from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import { AtsNativeModule, DownloadFile } from '../modules/ats-native';
import { fromBase64, toBase64 } from './core/bytes';
import type { Kind } from './core/cv';
import type { Demo } from './demo';

export const MIME: Record<Kind, string> = {
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  odt: 'application/vnd.oasis.opendocument.text',
};

/** The bytes of a file: file:// is read directly, content:// (a picked file, Download/ATS) through Android. */
export async function readUri(uri: string): Promise<Uint8Array> {
  if (uri.startsWith('file://')) return new File(uri).bytes();
  if (!AtsNativeModule) throw new Error('native');
  return fromBase64(await AtsNativeModule.readBase64(uri));
}

export async function readDemo(d: Demo): Promise<Uint8Array> {
  const a = Asset.fromModule(d.asset);
  await a.downloadAsync();
  return new File(a.localUri ?? a.uri).bytes();
}

const docsDir = () => new Directory(Paths.document, 'docs');

/** Keeps a private copy of an opened document in the app, so it can be opened again from Documents. */
export async function keepCopy(key: string, kind: Kind, bytes: Uint8Array): Promise<string> {
  const d = docsDir();
  if (!d.exists) d.create({ intermediates: true });
  const f = new File(d, `${key.replace(/[^a-z0-9_-]/gi, '_')}.${kind}`);
  f.create({ intermediates: true, overwrite: true });
  await f.write(bytes);
  return f.uri;
}

export function forgetCopy(path: string) {
  try { const f = new File(path); if (f.exists) f.delete(); } catch {}
}

/** Saves a new file in Download/ATS. Returns the name Android gave it (a number is added when the name is taken). */
export async function saveToDownloads(name: string, kind: Kind, bytes: Uint8Array): Promise<{ uri: string; name: string }> {
  if (Platform.OS !== 'android' || !AtsNativeModule) throw new Error('android');
  return AtsNativeModule.saveDownload(name, toBase64(bytes), MIME[kind]);
}

/** Saves any file (e.g. a backup .zip) in Download/ATS. */
export async function saveBytesToDownloads(name: string, mime: string, bytes: Uint8Array): Promise<{ uri: string; name: string }> {
  if (Platform.OS !== 'android' || !AtsNativeModule) throw new Error('android');
  return AtsNativeModule.saveDownload(name, toBase64(bytes), mime);
}

/** Best-effort delete of the CVs ATS saved in Download/ATS. Returns how many were removed. */
export async function deleteSaved(): Promise<number> {
  if (!AtsNativeModule) return 0;
  try { return await AtsNativeModule.deleteDownloads(); } catch { return 0; }
}

export async function listSaved(): Promise<DownloadFile[]> {
  if (!AtsNativeModule) return [];
  try { return await AtsNativeModule.listDownloads(); } catch { return []; }
}

/** Opens the share sheet with a copy of the document. */
export async function shareDoc(name: string, kind: Kind, bytes: Uint8Array) {
  const f = new File(Paths.cache, name);
  f.create({ intermediates: true, overwrite: true });
  await f.write(bytes);
  await Sharing.shareAsync(f.uri, { mimeType: MIME[kind], dialogTitle: name });
}

/** Opens the share sheet with any bytes (e.g. a backup .zip). */
export async function shareBytes(name: string, mime: string, bytes: Uint8Array) {
  const f = new File(Paths.cache, name);
  f.create({ intermediates: true, overwrite: true });
  await f.write(bytes);
  await Sharing.shareAsync(f.uri, { mimeType: mime, dialogTitle: name });
}

/** Opens a saved document in another app (Word, LibreOffice, Google Docs …). */
export async function openOutside(uri: string, kind: Kind) {
  await IntentLauncher.startActivityAsync('android.intent.action.VIEW', { data: uri, flags: 1, type: MIME[kind] });
}

/** Opens any saved file in another app by its MIME type (e.g. a PDF). */
export async function openOutsideMime(uri: string, mime: string) {
  await IntentLauncher.startActivityAsync('android.intent.action.VIEW', { data: uri, flags: 1, type: mime });
}

/** A file name without characters Android does not accept. */
export const cleanName = (s: string) => s.replace(/[\\/:*?"<>|\n\r\t]+/g, '_').trim();
export const baseName = (name: string) => name.replace(/\.(docx|odt)$/i, '');
