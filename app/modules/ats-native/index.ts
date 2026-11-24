import { requireOptionalNativeModule } from 'expo';

export type SavedFile = { uri: string; name: string };
export type DownloadFile = { uri: string; name: string; size: number; modified: number };

type AtsNative = {
  /** Saves a file in Download/ATS. Android picks a new name if the name is taken; the name used is returned. */
  saveDownload(name: string, base64: string, mime: string): Promise<SavedFile>;
  /** Creates Download/ATS with a short note in it (true when the folder is there). */
  makeFolder(note: string): Promise<boolean>;
  /** The .docx and .odt files ATS has saved in Download/ATS, newest first. */
  listDownloads(): Promise<DownloadFile[]>;
  /** Reads a file (content:// or file://) as Base64. */
  readBase64(uri: string): Promise<string>;
  markUpdatePending(title: string, body: string, channel: string): void;
  /** Checks a downloaded update: "ok", "ok-verified", "checksum", "package", "older" or "signature". */
  verifyUpdate(path: string, sha256: string | null): Promise<string>;
  canInstallPackages(): boolean;
  openInstallPermission(): void;
  clearUpdateNotice(): void;
};

/** Null where the native code is not built in (Expo Go, web, tests). */
export const AtsNativeModule = requireOptionalNativeModule<AtsNative>('AtsNative');
