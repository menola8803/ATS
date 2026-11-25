// Builds a clean document in the other format (.docx <-> .odt) from the CV's paragraphs.
// Headings, paragraphs and list items are kept; tables, text boxes and images become plain paragraphs or are dropped.
// The layout is not preserved – this is only used when the person chooses to save in a different format than the original.
import type { Cv, Files, Kind } from './cv';
import { utf8Encode } from './bytes';
import { zip } from './zip';

type Line = { text: string; heading: boolean; list: boolean };

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The document as clean lines: the chosen text, headings and list items; empty and image-only paragraphs dropped. */
function lines(cv: Cv, edits: Record<number, string>): Line[] {
  return cv.paras
    .map(p => ({ text: (edits[p.id] ?? p.text).trim(), heading: p.heading, list: p.list }))
    .filter(l => l.text.length > 0);
}

function cleanDocx(ls: Line[]): Files {
  const body = ls.map(l => {
    const t = `<w:t xml:space="preserve">${esc(l.list ? `• ${l.text}` : l.text)}</w:t>`;
    const rpr = l.heading ? '<w:rPr><w:b/><w:sz w:val="26"/></w:rPr>' : '';
    const ppr = l.heading ? '<w:pPr><w:spacing w:before="160" w:after="60"/></w:pPr>' : '';
    return `<w:p>${ppr}<w:r>${rpr}${t}</w:r></w:p>`;
  }).join('');
  const document = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
    + `<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr/></w:body></w:document>`;
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
    + `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">`
    + `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>`
    + `<Default Extension="xml" ContentType="application/xml"/>`
    + `<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>`
    + `</Types>`;
  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
    + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`
    + `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>`
    + `</Relationships>`;
  return {
    '[Content_Types].xml': utf8Encode(contentTypes),
    '_rels/.rels': utf8Encode(rels),
    'word/document.xml': utf8Encode(document),
  };
}

function cleanOdt(ls: Line[]): Files {
  const body = ls.map(l => {
    const text = esc(l.list ? `• ${l.text}` : l.text);
    return l.heading
      ? `<text:h text:style-name="Heading_20_1" text:outline-level="1">${text}</text:h>`
      : `<text:p text:style-name="Standard">${text}</text:p>`;
  }).join('');
  const content = `<?xml version="1.0" encoding="UTF-8"?>`
    + `<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" office:version="1.2">`
    + `<office:body><office:text>${body}</office:text></office:body></office:document-content>`;
  const manifest = `<?xml version="1.0" encoding="UTF-8"?>`
    + `<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.2">`
    + `<manifest:file-entry manifest:full-path="/" manifest:media-type="application/vnd.oasis.opendocument.text"/>`
    + `<manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/>`
    + `</manifest:manifest>`;
  return {
    mimetype: utf8Encode('application/vnd.oasis.opendocument.text'),
    'content.xml': utf8Encode(content),
    'META-INF/manifest.xml': utf8Encode(manifest),
  };
}

/** A fresh, ATS-clean document of the given kind, built from the CV's text. */
export function convertClean(kind: Kind, cv: Cv, edits: Record<number, string>): Uint8Array {
  const ls = lines(cv, edits);
  return zip(kind === 'docx' ? cleanDocx(ls) : cleanOdt(ls), kind);
}
