import { ar } from './ar';
import { en } from './en';

export type Lang = 'ar' | 'en';
export const content = { ar, en };
export const langFromUrl = (url: URL): Lang => (url.pathname === '/en' || url.pathname.startsWith('/en/') ? 'en' : 'ar');
