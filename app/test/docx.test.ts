// Reading and writing Word files: the text of every paragraph, the layout, and a rewrite that keeps everything else.
import { ok, demo, done } from './helpers';
import { readCv, writeCv } from '../src/core/cv';
import { unzip, zip } from '../src/core/zip';
import { docxParagraph, docxText } from '../src/core/docx';
import { utf8Decode } from '../src/core/bytes';

const mira = readCv('docx', unzip(demo('Demo_Mira_Andersson_CV.docx')));
ok(mira.paras.some(p => p.text === 'Profil' && p.heading), 'heading Profil found');
ok(mira.paras.some(p => p.list && p.text.startsWith('Tar emot och bedömer')), 'list item found');
ok(mira.layout.tables === 0 && !mira.layout.headerText, 'Mira: no table, no header');

const jonas = readCv('docx', unzip(demo('Demo_Jonas_Berg_CV.docx')));
ok(jonas.layout.tables === 1, 'Jonas: one table');
ok(/jonas\.berg@exempel\.se/.test(jonas.layout.headerText), 'Jonas: contact details in the header');
ok(jonas.paras.some(p => p.inTable && /Om mig/.test(p.text)), 'Jonas: text in the table cell');

// rewrite one paragraph, pack, unpack and read again
const target = mira.paras.find(p => p.text.startsWith('Legitimerad undersköterska'))!;
const files = writeCv(mira, { [target.id]: 'Ny profil med <tecken> & "citat"\nandra raden' });
const again = readCv('docx', unzip(zip(files, 'docx')));
ok(again.paras[target.id].text === 'Ny profil med <tecken> & "citat"\nandra raden', 'rewritten text read back: ' + again.paras[target.id].text);
ok(again.paras.length === mira.paras.length, 'same number of paragraphs');
ok(again.paras.filter(p => p.id !== target.id).every(p => p.text === mira.paras[p.id].text), 'other paragraphs unchanged');
ok(utf8Decode(files['word/styles.xml']) === utf8Decode(mira.files['word/styles.xml']), 'styles untouched');

// paragraph settings and the first run's formatting are kept
const p = docxParagraph('<w:p w:rsidR="1"><w:pPr><w:pStyle w:val="ListBullet"/></w:pPr><w:r><w:rPr><w:b/></w:rPr><w:t>Gammal</w:t></w:r><w:r><w:t> text</w:t></w:r></w:p>', 'Ny\ttext');
ok(p === '<w:p w:rsidR="1"><w:pPr><w:pStyle w:val="ListBullet"/></w:pPr><w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">Ny</w:t><w:tab/><w:t xml:space="preserve">text</w:t></w:r></w:p>', 'docxParagraph: ' + p);
ok(docxText('<w:r><w:t>A</w:t></w:r><w:del><w:r><w:delText>X</w:delText></w:r></w:del><w:r><w:tab/><w:t xml:space="preserve">B &amp; C</w:t></w:r>') === 'A\tB & C', 'deleted text skipped, entities decoded');
done('docx');
