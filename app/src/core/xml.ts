// Small helpers for the XML inside .docx and .odt files. No XML library: the files are read and written as text, and
// everything that is not changed stays byte for byte as it was (styles, fonts, lists, pictures).

export type Span = { name: string; start: number; openEnd: number; closeStart: number; end: number; depth: number };

const TAG = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\?[\s\S]*?\?>|<(\/?)([A-Za-z_][\w:.-]*)(?:\s[^>]*?)?(\/?)>/g;

/**
 * Every element with one of the given names, in document order, with where it starts and ends in the text.
 * Elements inside each other (a paragraph in a text box inside a paragraph) are all found; depth says how deep.
 */
export function findElements(xml: string, names: string[]): Span[] {
  const want = new Set(names);
  const out: Span[] = [];
  const open: Span[] = [];
  TAG.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TAG.exec(xml))) {
    const name = m[2];
    if (!name || !want.has(name)) continue;
    const closing = m[1] === '/', selfClosing = m[3] === '/';
    if (closing) {
      for (let i = open.length - 1; i >= 0; i--) {
        if (open[i].name === name) {
          const s = open[i];
          s.closeStart = m.index; s.end = m.index + m[0].length;
          open.splice(i, 1);
          break;
        }
      }
    } else {
      const s: Span = { name, start: m.index, openEnd: m.index + m[0].length, closeStart: m.index + m[0].length, end: m.index + m[0].length, depth: open.length };
      out.push(s);
      if (!selfClosing) open.push(s);
    }
  }
  return out;
}

/** Whether the position lies inside one of the spans. */
export const inside = (pos: number, spans: Span[]) => spans.some(s => pos > s.start && pos < s.end);

const ENT: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
export function decode(s: string): string {
  return s.replace(/&(#x[0-9a-fA-F]+|#\d+|amp|lt|gt|quot|apos);/g, (_, e: string) => {
    if (e[0] === '#') {
      const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : '';
    }
    return ENT[e] ?? '';
  });
}
export const encode = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Removes every element with the given name, with its content. */
export function cut(xml: string, name: string): string {
  const spans = findElements(xml, [name]).filter(s => s.depth === 0);
  let out = '', at = 0;
  for (const s of spans) { out += xml.slice(at, s.start); at = s.end; }
  return out + xml.slice(at);
}

/** The text with the given ranges taken out (used to skip paragraphs nested in a text box). */
export function without(xml: string, ranges: { start: number; end: number }[], offset = 0): string {
  let out = '', at = 0;
  for (const r of ranges) { out += xml.slice(at, r.start - offset); at = r.end - offset; }
  return out + xml.slice(at);
}

/** The first element with this name in the text, whole (or '' if there is none). */
export function first(xml: string, name: string): string {
  const s = findElements(xml, [name])[0];
  return s ? xml.slice(s.start, s.end) : '';
}

/** Value of an attribute in an opening tag. */
export function attr(tag: string, name: string): string | null {
  const m = new RegExp(`\\s${name.replace(/[.:]/g, '\\$&')}="([^"]*)"`).exec(tag);
  return m ? decode(m[1]) : null;
}

/** Puts new pieces in place of old ones (the ranges must not overlap). */
export function splice(xml: string, edits: { start: number; end: number; text: string }[]): string {
  const sorted = [...edits].sort((a, b) => b.start - a.start);
  let out = xml;
  for (const e of sorted) out = out.slice(0, e.start) + e.text + out.slice(e.end);
  return out;
}
