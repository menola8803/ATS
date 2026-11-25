// Saving in the other format: a clean document is built and can be read back, with the text and headings kept.
import { ok, demo, done } from './helpers';
import { readCv, fullText } from '../src/core/cv';
import { unzip } from '../src/core/zip';
import { convertClean } from '../src/core/convert';
import { evaluate } from '../src/core/ats';

// A .docx demo converted to a clean .odt, then read back.
const mira = readCv('docx', unzip(demo('Demo_Mira_Andersson_CV.docx')));
const odtBytes = convertClean('odt', mira, {});
const back = readCv('odt', unzip(odtBytes));
ok(back.paras.filter(p => p.text.trim()).length >= mira.paras.filter(p => p.text.trim()).length - 1, 'paragraphs survive docx -> odt');
ok(fullText(back).includes('Mira'), 'the name survives the conversion');
ok(back.layout.tables === 0 && back.layout.images === 0, 'the converted document is clean (no tables or images)');

// A weak .docx with a table, converted to a clean .docx, loses the table.
const jonas = readCv('docx', unzip(demo('Demo_Jonas_Berg_CV.docx')));
const cleanDocx = readCv('docx', unzip(convertClean('docx', jonas, {})));
ok(cleanDocx.layout.tables === 0, 'the table is gone after a clean rebuild');
ok(evaluate(cleanDocx).base > evaluate(jonas).base, 'the clean rebuild scores better on layout than the messy original');

// Edits are applied in the converted document.
const edited = convertClean('odt', mira, { [mira.paras.find(p => p.text.trim())!.id]: 'EDITED NAME LINE' });
ok(fullText(readCv('odt', unzip(edited))).includes('EDITED NAME LINE'), 'edits are carried into the converted file');
done('convert');
