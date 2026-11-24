// OpenDocument text (.odt): content.xml holds the body; headers and footers are in styles.xml (style:header / style:footer).
import type { Cv, Files, Layout, Para } from './cv';
import { utf8Decode, utf8Encode } from './bytes';
import { attr, cut, decode, encode, findElements, first, inside, splice, without } from './xml';

const MAIN = 'content.xml';

/** The visible text of a piece of ODF text (notes and comments are left out). */
export function odtText(xml: string): string {
  let x = cut(xml, 'office:annotation');
  x = cut(x, 'text:note');
  x = cut(x, 'text:tracked-changes');
  x = x.replace(/<text:s(?:\s+text:c="(\d+)")?\s*\/>/g, (_, n) => ' '.repeat(n ? parseInt(n, 10) : 1))
    .replace(/<text:tab\s*\/>/g, '\t')
    .replace(/<text:line-break\s*\/>/g, '\n')
    .replace(/<[^>]+>/g, '');
  return decode(x);
}

const HEADING = /(heading|rubrik|title|titel|subtitle|underrubrik)/i;

export function parseOdtXml(xml: string): Para[] {
  const all = findElements(xml, ['text:p', 'text:h', 'table:table', 'draw:text-box', 'draw:frame', 'text:list-item']);
  const paras = all.filter(s => s.name === 'text:p' || s.name === 'text:h');
  const tables = all.filter(s => s.name === 'table:table');
  const boxes = all.filter(s => s.name === 'draw:text-box' || s.name === 'draw:frame');
  const items = all.filter(s => s.name === 'text:list-item');
  return paras.map((s, id) => {
    const nested = paras.filter(o => o !== s && o.start > s.start && o.end <= s.end);
    const body = without(xml.slice(s.start, s.end), nested, s.start);
    const style = attr(xml.slice(s.start, s.openEnd), 'text:style-name') ?? '';
    return {
      id,
      text: odtText(body).replace(/\s+$/g, ''),
      heading: s.name === 'text:h' || HEADING.test(style),
      list: inside(s.start, items),
      inTable: inside(s.start, tables),
      inBox: inside(s.start, boxes),
      editable: nested.length === 0 && s.end > s.openEnd && !/<draw:frame\b/.test(body),
      start: s.start, end: s.end,
    };
  });
}

export function odtLayout(files: Files, xml: string): Layout {
  const styles = files['styles.xml'] ? utf8Decode(files['styles.xml']) : '';
  let headerText = '';
  for (const s of findElements(styles, ['style:header', 'style:footer', 'style:header-left', 'style:footer-left', 'style:header-first', 'style:footer-first'])) {
    const t = odtText(styles.slice(s.openEnd, s.closeStart)).trim();
    if (t) headerText += (headerText ? '\n' : '') + t;
  }
  const columns = /fo:column-count="([2-9]|\d{2,})"/.test(xml) || /fo:column-count="([2-9]|\d{2,})"/.test(styles);
  return {
    tables: findElements(xml, ['table:table']).filter(s => s.depth === 0).length,
    textBoxes: findElements(xml, ['draw:text-box']).length,
    images: (xml.match(/<draw:image\b/g) ?? []).length,
    columns,
    headerText,
  };
}

export function readOdt(files: Files): Cv {
  if (!files[MAIN]) throw new Error('not an odt');
  const xml = utf8Decode(files[MAIN]);
  return { kind: 'odt', files, main: MAIN, xml, paras: parseOdtXml(xml), layout: odtLayout(files, xml) };
}

/** A new paragraph with the same paragraph style (and the first span's style), holding the new text. */
export function odtParagraph(oldXml: string, text: string): string {
  const open = /^<text:(p|h)\b[^>]*>/.exec(oldXml);
  const tag = open?.[1] ?? 'p';
  const openTag = open?.[0] ?? '<text:p>';
  const inner = oldXml.slice(openTag.length);
  const span = first(inner, 'text:span');
  const spanOpen = span ? /^<text:span\b[^>]*>/.exec(span)?.[0] : '';
  const body = text.split('\n').map(line => line.split('\t').map(encode).join('<text:tab/>')).join('<text:line-break/>')
    .replace(/ {2,}/g, m => ` <text:s text:c="${m.length - 1}"/>`);
  return `${openTag}${spanOpen ? `${spanOpen}${body}</text:span>` : body}</text:${tag}>`;
}

export function writeOdt(cv: Cv, edits: Record<number, string>): Files {
  const changes = Object.entries(edits).map(([k, text]) => {
    const p = cv.paras[Number(k)];
    if (!p || !p.editable) throw new Error(`paragraph ${k} cannot be changed`);
    return { start: p.start, end: p.end, text: odtParagraph(cv.xml.slice(p.start, p.end), text) };
  });
  return { ...cv.files, [MAIN]: utf8Encode(splice(cv.xml, changes)) };
}
