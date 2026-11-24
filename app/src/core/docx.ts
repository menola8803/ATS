// Word (.docx): word/document.xml holds the body; headers and footers are in word/header*.xml and word/footer*.xml.
import type { Cv, Files, Layout, Para } from './cv';
import { utf8Decode, utf8Encode } from './bytes';
import { cut, decode, encode, findElements, first, inside, splice, without } from './xml';

const MAIN = 'word/document.xml';

/** The visible text of a piece of WordprocessingML (deleted text and field codes are left out). */
export function docxText(xml: string): string {
  let x = cut(xml, 'w:del');
  x = cut(x, 'w:instrText');
  x = cut(x, 'w:delText');
  let out = '';
  const re = /<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>|<w:tab\/>|<w:tab\s[^>]*\/>|<w:br\/>|<w:br\s[^>]*\/>|<w:cr\/>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(x))) {
    if (m[1] !== undefined) out += decode(m[1]);
    else if (m[0].startsWith('<w:tab')) out += '\t';
    else out += '\n';
  }
  return out;
}

const HEADING = /^(heading|rubrik|title|titel|subtitle|underrubrik)/i;

export function parseDocxXml(xml: string): Para[] {
  const all = findElements(xml, ['w:p', 'w:tbl', 'w:txbxContent']);
  const paras = all.filter(s => s.name === 'w:p');
  const tables = all.filter(s => s.name === 'w:tbl');
  const boxes = all.filter(s => s.name === 'w:txbxContent');
  return paras.map((s, id) => {
    const nested = paras.filter(o => o !== s && o.start > s.start && o.end <= s.end);
    const body = without(xml.slice(s.start, s.end), nested, s.start);
    const style = /<w:pStyle\s+w:val="([^"]*)"/.exec(body)?.[1] ?? '';
    return {
      id,
      text: docxText(body).replace(/\s+$/g, ''),
      heading: HEADING.test(style) || /<w:outlineLvl\s/.test(body),
      list: /<w:numPr>/.test(body) || /list|lista/i.test(style),
      inTable: inside(s.start, tables),
      inBox: inside(s.start, boxes),
      editable: nested.length === 0 && s.end > s.openEnd,
      start: s.start, end: s.end,
    };
  });
}

export function docxLayout(files: Files, xml: string): Layout {
  const names = Object.keys(files);
  let headerText = '';
  for (const n of names.filter(n => /^word\/(header|footer)\d*\.xml$/.test(n)).sort()) {
    const t = docxText(utf8Decode(files[n])).trim();
    if (t) headerText += (headerText ? '\n' : '') + t;
  }
  const cols = /<w:cols\b[^>]*\bw:num="(\d+)"/g;
  let columns = false, m: RegExpExecArray | null;
  while ((m = cols.exec(xml))) if (parseInt(m[1], 10) > 1) columns = true;
  return {
    tables: findElements(xml, ['w:tbl']).filter(s => s.depth === 0).length,
    textBoxes: findElements(xml, ['w:txbxContent']).filter(s => s.depth === 0).length,
    images: (xml.match(/<a:blip\b/g) ?? []).length + (xml.match(/<v:imagedata\b/g) ?? []).length,
    columns,
    headerText,
  };
}

export function readDocx(files: Files): Cv {
  if (!files[MAIN]) throw new Error('not a docx');
  const xml = utf8Decode(files[MAIN]);
  return { kind: 'docx', files, main: MAIN, xml, paras: parseDocxXml(xml), layout: docxLayout(files, xml) };
}

/** A new paragraph with the same paragraph settings and the first run's formatting, holding the new text. */
export function docxParagraph(oldXml: string, text: string): string {
  const open = /^<w:p\b[^>]*>/.exec(oldXml)?.[0] ?? '<w:p>';
  const inner = oldXml.slice(open.length, oldXml.length - '</w:p>'.length);
  const pPr = first(inner, 'w:pPr');
  const afterPPr = pPr ? inner.slice(inner.indexOf(pPr) + pPr.length) : inner;
  const firstRun = first(afterPPr, 'w:r');
  const rPr = firstRun ? first(firstRun, 'w:rPr') : '';
  const runs = text.split('\n').map((line, i) => {
    const parts = line.split('\t').map(p => (p ? `<w:t xml:space="preserve">${encode(p)}</w:t>` : '')).join('<w:tab/>');
    return (i > 0 ? '<w:br/>' : '') + parts;
  }).join('');
  return `${open}${pPr}<w:r>${rPr}${runs}</w:r></w:p>`;
}

export function writeDocx(cv: Cv, edits: Record<number, string>): Files {
  const changes = Object.entries(edits).map(([k, text]) => {
    const p = cv.paras[Number(k)];
    if (!p || !p.editable) throw new Error(`paragraph ${k} cannot be changed`);
    return { start: p.start, end: p.end, text: docxParagraph(cv.xml.slice(p.start, p.end), text) };
  });
  return { ...cv.files, [MAIN]: utf8Encode(splice(cv.xml, changes)) };
}
