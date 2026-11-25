// The PDF export produces a valid PDF with the CV's text in it.
import { ok, demo, done } from './helpers';
import { readCv } from '../src/core/cv';
import { unzip } from '../src/core/zip';
import { cvToPdf } from '../src/core/pdf';

const mira = readCv('docx', unzip(demo('Demo_Mira_Andersson_CV.docx')));
const bytes = cvToPdf(mira, {});
const head = Buffer.from(bytes.slice(0, 8)).toString('latin1');
ok(head.startsWith('%PDF-1.'), 'starts with a PDF header');
const text = Buffer.from(bytes).toString('latin1');
ok(text.includes('%%EOF'), 'ends with the PDF end marker');
ok(text.includes('/Type /Catalog') && text.includes('xref') && text.includes('trailer'), 'has catalog, xref and trailer');
ok(text.includes('Helvetica'), 'uses the Helvetica base font');
ok(/\(Mira[^)]*\) Tj/.test(text), 'the name is drawn as text');

// Swedish letters survive (WinAnsi), and edits are applied.
const withEdit = cvToPdf(mira, { [mira.paras.find(p => p.text.trim())!.id]: 'Förnamn Efternåmn' });
ok(Buffer.from(withEdit).toString('latin1').includes('rnamn Efter'), 'edited text with Swedish letters is written');
done('pdf');
