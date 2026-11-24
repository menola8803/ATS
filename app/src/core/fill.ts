import { PLACEHOLDERS } from './ai';

/** A suggestion with what the person typed put in place of its placeholders ([ANTAL] …), in order. Empty ones stay. */
export function filledText(text: string, values: string[] | undefined): string {
  let i = 0;
  return text.replace(PLACEHOLDERS, m => { const v = values?.[i++]?.trim(); return v ? v : m; });
}
