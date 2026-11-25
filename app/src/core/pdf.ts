// A small, dependency-free PDF writer: lays the CV out as real (selectable) text an ATS can read.
// Uses the standard Helvetica fonts, so nothing is embedded. Text is encoded as WinAnsi (Latin-1),
// which covers Swedish and most European letters; characters outside it become '?'.
import type { Cv } from './cv';

const PAGE_W = 595, PAGE_H = 842;
const ML = 54, MR = 54, MT = 786, MB = 56; // left, right x and top/bottom y (PDF origin is bottom-left)
const WIDTH = PAGE_W - ML - MR;

type Line = { text: string; heading: boolean; list: boolean };

function lines(cv: Cv, edits: Record<number, string>): Line[] {
  return cv.paras
    .map(p => ({ text: (edits[p.id] ?? p.text).trim(), heading: p.heading, list: p.list }))
    .filter(l => l.text.length > 0);
}

// Map a character to a WinAnsi byte; replace the few common typographic ones, else '?' for anything unsupported.
const SUBS: Record<string, string> = { '–': '-', '—': '-', '‘': "'", '’': "'", '“': '"', '”': '"', '•': '\x95', '·': '\xb7', '…': '...' };
function winAnsi(s: string): string {
  let out = '';
  for (const ch of s) {
    const cp = ch.codePointAt(0)!;
    if (cp === 0x2022) { out += '\x95'; continue; }
    if (SUBS[ch]) { out += SUBS[ch]; continue; }
    out += cp <= 0xff ? ch : '?';
  }
  return out;
}

// Escape the characters that are special inside a PDF string literal.
const escPdf = (s: string) => winAnsi(s).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

// Approximate Helvetica text width (average glyph ~0.52 em); good enough for word wrapping.
const textWidth = (s: string, size: number) => s.length * size * 0.52;

function wrap(text: string, size: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (textWidth(next, size) > WIDTH && line) { out.push(line); line = w; }
    else line = next;
  }
  if (line) out.push(line);
  return out.length ? out : [''];
}

/** Lays the CV lines into one or more pages. Each drawn line: font, size, x, y and text. */
function layout(ls: Line[]): { font: 1 | 2; size: number; x: number; y: number; text: string }[][] {
  const pages: { font: 1 | 2; size: number; x: number; y: number; text: string }[][] = [[]];
  let y = MT;
  let named = false;
  const newPage = () => { pages.push([]); y = MT; };
  for (const l of ls) {
    const isName = !named; // the first non-empty line is the name
    if (isName) named = true;
    const size = isName ? 19 : 11;
    const font: 1 | 2 = isName || l.heading ? 2 : 1;
    const leading = size * 1.4;
    const before = isName ? 0 : l.heading ? 12 : 3;
    const text = isName ? l.text : l.list ? `\x95 ${l.text}` : l.heading ? l.text.toUpperCase() : l.text;
    const wrapped = wrap(text, size);
    y -= before;
    for (const w of wrapped) {
      if (y - leading < MB) newPage();
      pages[pages.length - 1].push({ font, size, x: l.list ? ML + 10 : ML, y, text: w });
      y -= leading;
    }
  }
  return pages;
}

/** The CV as a PDF document (bytes). */
export function cvToPdf(cv: Cv, edits: Record<number, string>): Uint8Array {
  const pages = layout(lines(cv, edits));
  const objects: string[] = [];
  const add = (s: string) => objects.push(s); // object N is objects[N-1]

  // 1 catalog, 2 pages, fonts 3 (Helvetica) 4 (Helvetica-Bold), then per page: content + page objects.
  add('<< /Type /Catalog /Pages 2 0 R >>');
  const pageObjNums: number[] = [];
  add(''); // placeholder for Pages (object 2), filled after we know kids
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');

  for (const page of pages) {
    let stream = '';
    for (const d of page) {
      stream += `BT /F${d.font} ${d.size} Tf ${d.x} ${d.y.toFixed(1)} Td (${escPdf(d.text)}) Tj ET\n`;
    }
    add(`<< /Length ${stream.length} >>\nstream\n${stream}endstream`);
    const contentNum = objects.length;
    add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentNum} 0 R >>`);
    pageObjNums.push(objects.length);
  }
  objects[1] = `<< /Type /Pages /Count ${pageObjNums.length} /Kids [${pageObjNums.map(n => `${n} 0 R`).join(' ')}] >>`;

  // Serialise with a cross-reference table.
  let body = '%PDF-1.4\n';
  const offsets: number[] = [];
  objects.forEach((o, i) => { offsets[i] = body.length; body += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const xrefAt = body.length;
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) body += `${String(off).padStart(10, '0')} 00000 n \n`;
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF`;

  // Latin-1 bytes (content was already reduced to WinAnsi range).
  const bytes = new Uint8Array(body.length);
  for (let i = 0; i < body.length; i++) bytes[i] = body.charCodeAt(i) & 0xff;
  return bytes;
}
