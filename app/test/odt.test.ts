// Reading and writing OpenDocument files.
import { ok, demo, done } from './helpers';
import { readCv, writeCv } from '../src/core/cv';
import { unzip, zip } from '../src/core/zip';
import { odtParagraph, odtText } from '../src/core/odt';
import { utf8Decode } from '../src/core/bytes';

const sara = readCv('odt', unzip(demo('Demo_Sara_Nilsson_CV.odt')));
ok(sara.paras.some(p => p.text === 'Erfarenhet' && p.heading), 'heading Erfarenhet');
ok(sara.paras.some(p => p.text.startsWith('Hanterade fakturor')), 'list item text');
ok(sara.layout.tables === 0, 'no tables');

const target = sara.paras.find(p => p.text.startsWith('Hanterade fakturor'))!;
const files = writeCv(sara, { [target.id]: 'Hanterade  [ANTAL] fakturor & attest' });
const packed = zip(files, 'odt');
const back = unzip(packed);
ok(Object.keys(back)[0] === 'mimetype', 'mimetype is the first file');
ok(utf8Decode(back.mimetype) === 'application/vnd.oasis.opendocument.text', 'mimetype content');
const again = readCv('odt', back);
ok(again.paras[target.id].text === 'Hanterade  [ANTAL] fakturor & attest', 'rewritten: ' + again.paras[target.id].text);
ok(again.paras.filter(p => p.id !== target.id).every(p => p.text === sara.paras[p.id].text), 'others unchanged');

ok(odtText('<text:p>a<text:s text:c="2"/>b<text:tab/>c<text:line-break/>d</text:p>') === 'a  b\tc\nd', 'spaces, tab and line break');
ok(odtParagraph('<text:p text:style-name="P3"><text:span text:style-name="T1">x</text:span></text:p>', 'Ny') === '<text:p text:style-name="P3"><text:span text:style-name="T1">Ny</text:span></text:p>', 'style kept');
done('odt');
