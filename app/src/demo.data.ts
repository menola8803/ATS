// The three made-up demo CVs (weak, medium, strong) with a matching made-up job ad each. No assets here, so it can be
// used in tests; demo.ts adds the files.
import type { Kind } from './core/cv';
import type { Strings } from './i18n';

export type DemoData = { id: string; name: string; kind: Kind; meta: keyof Strings; ad: string; photo: boolean };

export const DEMOS: DemoData[] = [
  {
    id: 'jonas', name: 'Demo_Jonas_Berg_CV.docx', kind: 'docx', meta: 'demoJonas', photo: false,
    ad: 'IT-tekniker till kundsupport, Göteborg\nVi söker en IT-tekniker som felsöker och åtgärdar problem med Windows, nätverk och Microsoft 365 för våra företagskunder. Du hanterar supportärenden i vårt ärendesystem, installerar datorer och skrivare och dokumenterar lösningar. Erfarenhet av Active Directory, Intune och nätverk (TCP/IP, WiFi) är meriterande. Du har god kundservice och B-körkort.',
  },
  {
    id: 'sara', name: 'Demo_Sara_Nilsson_CV.odt', kind: 'odt', meta: 'demoSara', photo: false,
    ad: 'Ekonomiassistent, Uppsala\nDu hanterar leverantörsreskontra och kundreskontra, attestflöden och avstämningar. Du stöttar vid månadsbokslut och årsbokslut och arbetar i Visma och Excel. Vi söker dig med eftergymnasial utbildning inom redovisning, erfarenhet av fakturahantering och moms samt god kunskap i Excel (pivottabeller, LETARAD).',
  },
  {
    id: 'mira', name: 'Demo_Mira_Andersson_CV.docx', kind: 'docx', meta: 'demoMira', photo: true,
    ad: 'Undersköterska till akutmottagning, Malmö\nDu arbetar i team med sjuksköterskor och läkare med triagering enligt RETTS, provtagning, EKG och omvårdnad. Dokumentation sker i Cosmic. Vi söker legitimerad undersköterska med erfarenhet av akutsjukvård, gärna med kunskap om SBAR och PVK.',
  },
  {
    id: 'elin', name: 'ATS_Mall_CV.docx', kind: 'docx', meta: 'demoElin', photo: false,
    ad: 'Projektledare inom logistik, Västerås\nVi söker en projektledare som leder införanden av lagersystem (WMS), driver förändringsarbete och följer upp projekt mot budget och tidplan. Du samarbetar med inköp, IT och drift, tar fram rutiner och rapporterar status och risker till ledningen. Erfarenhet av logistik, Excel och agila metoder är meriterande.',
  },
  {
    id: 'omar', name: 'ATS_Mall_CV_Gulf.docx', kind: 'docx', meta: 'demoOmar', photo: false,
    ad: 'Mechanical Engineer, Oil and Gas, Doha\nWe are looking for a mechanical engineer to lead maintenance and shutdown projects on rotating equipment, manage technicians and contractors and uphold HSE standards. You plan turnarounds, run root-cause analysis, manage spare parts and report cost and risk to management. Experience with compressors, pumps and SAP PM is an advantage. Nationality and transferable visa status required.',
  },
];

