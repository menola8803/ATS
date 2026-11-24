// The demo CVs with their files (bundled with the app).
import { DEMOS as DATA, DemoData } from './demo.data';

export type Demo = DemoData & { asset: number };

/* eslint-disable @typescript-eslint/no-var-requires */
const ASSETS: Record<string, number> = {
  jonas: require('../assets/demo/Demo_Jonas_Berg_CV.docx'),
  sara: require('../assets/demo/Demo_Sara_Nilsson_CV.odt'),
  mira: require('../assets/demo/Demo_Mira_Andersson_CV.docx'),
};

export const DEMOS: Demo[] = DATA.map(d => ({ ...d, asset: ASSETS[d.id] }));
export const demoKey = (id: string) => `demo:${id}`;
