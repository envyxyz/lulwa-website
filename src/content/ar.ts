import type { Content } from './types';
import { site } from '../site';

export const ar: Content = {
  status: 'stub',
  meta: { title: site.brand.arabic, description: site.brand.arabic },
  chrome: { skipLink: 'انتقل إلى المحتوى' },
  actions: { whatsapp: 'تواصل واتساب', call: 'اتصل بنا' },
  icons: { next: 'التالي' },
  sink: {
    title: 'معرض المكونات',
    statement: 'لولوه',
    headLine1: 'المكيف وقف؟',
    headLine2: 'نجيك لحد بيتك',
    lead: 'صوّر العطل وأرسله واتساب.',
    body: 'نص تجريبي لعرض الخط العربي في الفقرات، بمسافة أسطر مريحة للقراءة على الجوال.',
    small: 'نص صغير للملاحظات والتسميات.',
    quietAction: 'كل الخدمات',
    cardTitle: 'بطاقة بدرجة لون',
    cardBody: 'سطح مدوّر بدون حدود وبدون ظل.',
    mirrored: 'تنعكس مع الاتجاه',
    fixed: 'لا تنعكس',
  },
};
