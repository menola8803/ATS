// Dates written out in Swedish or English (own tables, so they look the same on every phone).
import type { Lang } from './i18n';

const MO: Record<Lang, string[]> = {
  sv: ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

export const shortDate = (d: Date, lang: Lang) => `${d.getDate()} ${MO[lang][d.getMonth()].slice(0, 3)}`;
export const dateYear = (d: Date, lang: Lang) => `${shortDate(d, lang)} ${d.getFullYear()}`;
