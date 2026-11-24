// The CV as the app sees it: a list of paragraphs (with where each one lies in the XML) and what the layout contains.
// readCv / writeCv work on the files inside the .docx or .odt (already unzipped), so they can be tested in Node.
import { readDocx, writeDocx } from './docx';
import { readOdt, writeOdt } from './odt';

export type Kind = 'docx' | 'odt';

export type Para = {
  id: number;
  text: string;
  heading: boolean;   // a heading style (Rubrik 1, Heading 2, Title …)
  list: boolean;      // a bullet or numbered list item
  inTable: boolean;
  inBox: boolean;     // in a text box or frame
  editable: boolean;  // can be replaced (not a paragraph that holds a text box)
  start: number; end: number; // where it lies in the main XML
};

export type Layout = {
  tables: number;
  textBoxes: number;
  images: number;
  columns: boolean;   // more than one column
  headerText: string; // text in the header and footer
};

export type Files = Record<string, Uint8Array>;
export type Cv = { kind: Kind; files: Files; main: string; xml: string; paras: Para[]; layout: Layout };

export function readCv(kind: Kind, files: Files): Cv {
  return kind === 'docx' ? readDocx(files) : readOdt(files);
}

/** A copy of the files with the given paragraphs replaced by new text (the original files are not changed). */
export function writeCv(cv: Cv, edits: Record<number, string>): Files {
  return cv.kind === 'docx' ? writeDocx(cv, edits) : writeOdt(cv, edits);
}

/** The kind of a file from its name, or null if the app cannot read it. */
export function kindOf(name: string): Kind | null {
  const n = name.toLowerCase();
  return n.endsWith('.docx') ? 'docx' : n.endsWith('.odt') ? 'odt' : null;
}

/** All the text of the CV in reading order (body and header), used for the score. */
export const fullText = (cv: Cv) => [...cv.paras.map(p => p.text), cv.layout.headerText].filter(Boolean).join('\n');
