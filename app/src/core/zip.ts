// .docx and .odt are zip files. fflate unpacks and packs them in plain JavaScript.
import { unzipSync, zipSync, type Zippable } from 'fflate';
import type { Files, Kind } from './cv';

export const unzip = (bytes: Uint8Array): Files => unzipSync(bytes);

/**
 * Packs the files again. For .odt the file "mimetype" must come first and be stored without compression,
 * otherwise LibreOffice does not accept the document.
 */
export function zip(files: Files, kind: Kind): Uint8Array {
  const z: Zippable = {};
  if (kind === 'odt' && files.mimetype) z.mimetype = [files.mimetype, { level: 0 }];
  for (const [name, data] of Object.entries(files)) {
    if (kind === 'odt' && name === 'mimetype') continue;
    if (name.endsWith('/')) continue; // folder entries are not needed
    z[name] = [data, { level: 6 }];
  }
  return zipSync(z);
}
