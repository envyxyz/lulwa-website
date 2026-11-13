import areas from './guides/areas.json' with { type: 'json' };
import brands from './guides/brands.json' with { type: 'json' };
import pages from './guides/pages.json' with { type: 'json' };
import services from './guides/services.json' with { type: 'json' };
import type { Lang } from './index';
import { postGuides } from './posts';
import type { Guide } from './types';

// Long-form copy per ranking page, keyed by slug, both languages in one entry. Shape and parity: tests/guides.spec.ts.
// pages.json is keyed by path ('/', '/about', '/services', '/areas', '/brands', '/blog').
const all = { service: services, brand: brands, area: areas, post: postGuides, page: pages } as unknown as Record<string, Record<string, Record<Lang, Guide>>>;
export type GuideKind = keyof typeof all;
export const guide = (kind: 'service' | 'brand' | 'area' | 'post' | 'page', key: string, lang: Lang): Guide | undefined => all[kind]?.[key]?.[lang];
