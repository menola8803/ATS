// Download the new ATS, check it (as in CamOne) and hand it to Android's installer – with progress. Afterwards
// ATS opens again by itself.
import { Platform } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import { File, Paths } from 'expo-file-system';
import { createDownloadResumable } from 'expo-file-system/legacy';
import { AtsNativeModule } from '../modules/ats-native';
import type { Release } from './update';

export type UpdateError = 'network' | 'checksum' | 'package' | 'older' | 'signature' | 'install' | 'allow';
export class UpdateFail extends Error { constructor(public kind: UpdateError) { super(kind); } }
export type Downloaded = { uri: string; verified: boolean };

/** Downloads and checks: the published SHA-256, that it is ATS, newer, and signed with the same key. */
export async function downloadUpdate(rel: Release, onProgress: (part: number) => void): Promise<Downloaded> {
  if (!rel.apk || Platform.OS !== 'android') throw new UpdateFail('network');
  const dst = new File(Paths.cache, `ats-${rel.tag.replace(/^v/i, '')}.apk`);
  try { if (dst.exists) dst.delete(); } catch {}
  const dl = createDownloadResumable(rel.apk, dst.uri, {}, p => {
    const total = p.totalBytesExpectedToWrite > 0 ? p.totalBytesExpectedToWrite : rel.size;
    if (total > 0) onProgress(Math.min(1, p.totalBytesWritten / total));
  });
  let res;
  try { res = await dl.downloadAsync(); } catch { throw new UpdateFail('network'); }
  if (!res || res.status !== 200) throw new UpdateFail('network');
  const got = new File(res.uri);
  if (rel.size > 0 && got.size !== rel.size) { try { got.delete(); } catch {} throw new UpdateFail('network'); }
  onProgress(1);
  let r = 'ok';
  try { r = (await AtsNativeModule?.verifyUpdate(res.uri, rel.sha256)) ?? 'ok'; } catch { r = 'ok'; }
  if (r === 'checksum' || r === 'package' || r === 'older' || r === 'signature') throw new UpdateFail(r);
  return { uri: res.uri, verified: r === 'ok-verified' };
}

/** Hands the checked file to Android's installer. Throws 'allow' when Android first must allow installs from ATS. */
export async function installUpdate(file: Downloaded, note: { title: string; body: string; channel: string }): Promise<void> {
  if (AtsNativeModule && !AtsNativeModule.canInstallPackages()) { AtsNativeModule.openInstallPermission(); throw new UpdateFail('allow'); }
  try { AtsNativeModule?.markUpdatePending(note.title, note.body, note.channel); } catch {}
  try {
    await IntentLauncher.startActivityAsync('android.intent.action.VIEW', { data: new File(file.uri).contentUri, flags: 1, type: 'application/vnd.android.package-archive' });
  } catch { throw new UpdateFail('install'); }
}
