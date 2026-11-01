import type { Content } from './types';
import { site } from '../site';

export const en: Content = {
  status: 'stub',
  meta: { title: site.brand.latin, description: site.brand.latin },
  chrome: { skipLink: 'Skip to content' },
  actions: { whatsapp: 'WhatsApp us', call: 'Call us' },
  icons: { next: 'Next' },
  sink: {
    title: 'Component sink',
    statement: 'LULWA',
    headLine1: 'AC gave up?',
    headLine2: 'We come to you',
    lead: 'Take a photo of the fault and send it on WhatsApp.',
    body: 'Sample text to show the English body face in a paragraph, at a comfortable line length on a phone.',
    small: 'Small text for notes and labels.',
    quietAction: 'All services',
    cardTitle: 'Tone-step card',
    cardBody: 'A rounded surface with no border and no shadow.',
    mirrored: 'Mirrors with direction',
    fixed: 'Does not mirror',
  },
};
