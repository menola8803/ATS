// A tiny description of a CV page, used to draw a real miniature on the document cards.
// Built from the paragraphs the app already read, so it costs nothing extra and mirrors the actual document.
import type { Cv } from './cv';

export type ThumbLine = { t: 'name' | 'head' | 'body' | 'bad'; w: number };
export type Thumb = { photo: boolean; lines: ThumbLine[] };

const MAX_LINES = 16;
const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

/** Turns a CV into a short list of lines: the name, headings, body text and anything an ATS cannot read (red). */
export function buildThumb(cv: Cv): Thumb {
  const lines: ThumbLine[] = [];
  let named = false;
  for (const p of cv.paras) {
    const text = p.text.trim();
    if (!text) continue;
    if (lines.length >= MAX_LINES) break;
    if (p.inTable || p.inBox) { lines.push({ t: 'bad', w: 0.9 }); continue; }
    if (!named) { lines.push({ t: 'name', w: clamp(text.length / 26, 0.4, 0.8) }); named = true; continue; }
    if (p.heading) { lines.push({ t: 'head', w: clamp(text.length / 30, 0.28, 0.6) }); continue; }
    lines.push({ t: 'body', w: clamp(text.length / 70, 0.45, 0.96) });
  }
  return { photo: cv.layout.images > 0, lines };
}
