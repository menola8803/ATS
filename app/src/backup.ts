// A backup of ATS before uninstalling: the settings, scores and document list, zipped into Download/ATS.
// The API key is never included – it lives only in the phone's secure store, not in this state.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { unzipSync, zipSync } from 'fflate';
import { utf8Decode, utf8Encode } from './core/bytes';

const STATE_KEY = 'ats.state.v1';
const ENTRY = 'ats-backup.json';

/** Builds the backup bytes and a dated file name. */
export async function buildBackup(): Promise<{ bytes: Uint8Array; name: string }> {
  const state = (await AsyncStorage.getItem(STATE_KEY)) ?? '{}';
  const payload = JSON.stringify({ app: 'ATS', at: Date.now(), state: JSON.parse(state) });
  const bytes = zipSync({ [ENTRY]: utf8Encode(payload) }, { level: 6 });
  const d = new Date();
  const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return { bytes, name: `ATS-backup-${stamp}.zip` };
}

/** Restores settings, scores and the list from a backup zip. Returns false if the file is not an ATS backup. */
export async function restoreBackup(bytes: Uint8Array): Promise<boolean> {
  const files = unzipSync(bytes);
  const entry = files[ENTRY];
  if (!entry) return false;
  const data = JSON.parse(utf8Decode(entry));
  if (data?.app !== 'ATS' || typeof data.state !== 'object') return false;
  await AsyncStorage.setItem(STATE_KEY, JSON.stringify(data.state));
  return true;
}
