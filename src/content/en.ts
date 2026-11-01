import type { Brand, Content, Service } from './types';
import { site } from '../site';

const phone = site.phone.display;
const name = site.brand.latin;

const services: Service[] = [
  {
    slug: 'ac-repair',
    name: 'Air conditioners',
    summary: 'Split and window air conditioners.',
    units: ['Split AC', 'Window AC'],
    forWho: 'For homes where the AC has stopped or no longer cools as it used to.',
    send: { h: 'Send us on WhatsApp', items: ['A photo or video of the fault', 'The type of AC: split or window', 'A photo of the unit label, if you can', 'Your district'] },
    faq: [
      { q: 'My AC runs but does not cool. What should I do?', a: 'Check that the filter is clean and the remote is set to cooling. If nothing changes, send us a short video on WhatsApp and we will reply.' },
      { q: 'Do you repair window ACs?', a: 'Yes, we repair window and split ACs.' },
    ],
    seo: { title: `AC repair in Dammam | ${name}`, description: 'Split and window AC repair in Dammam. Send a photo of the fault on WhatsApp or call us.' },
    h1: 'AC repair in Dammam',
    lead: 'We repair split and window ACs. Photograph the fault and send it on WhatsApp.',
  },
  {
    slug: 'refrigerator-repair',
    name: 'Fridges',
    summary: 'Fridge repair and gas refilling.',
    units: ['Fridge'],
    forWho: 'For homes where the fridge no longer cools, leaks or makes a strange noise.',
    send: { h: 'Send us on WhatsApp', items: ['A photo or video of the fault', 'The type and brand of the fridge', 'A photo of the unit label, if you can', 'Your district'] },
    faq: [
      { q: 'Do you refill fridge gas?', a: 'Yes, gas refilling is one of our fridge services.' },
      { q: 'My fridge is not cooling. What should I do?', a: 'Keep the door shut so the cold stays in, and send us a photo or video. We will reply.' },
    ],
    seo: { title: `Fridge repair in Dammam | ${name}`, description: 'Fridge repair and gas refilling in Dammam. Send a photo of the fault on WhatsApp or call us.' },
    h1: 'Fridge repair in Dammam',
    lead: 'We repair fridges and refill gas. Photograph the fault and send it on WhatsApp.',
  },
  {
    slug: 'washing-machine-repair',
    name: 'Washing machines',
    summary: 'Automatic washing machines.',
    units: ['Automatic washing machine'],
    forWho: 'For homes where an automatic washer has stopped, will not drain or will not spin.',
    send: { h: 'Send us on WhatsApp', items: ['A photo or video of the fault', 'The error code, if one shows on the display', 'The type and brand of the washer', 'Your district'] },
    faq: [
      { q: 'My washer will not spin. What should I do?', a: 'Check that the clothes are spread evenly in the drum and the drain hose is not blocked. If it keeps happening, send us a video.' },
      { q: 'Do you repair non-automatic washers?', a: 'What we confirm right now is automatic washing machines.' },
    ],
    seo: { title: `Automatic washing machine repair in Dammam | ${name}`, description: 'Automatic washing machine repair in Dammam. Send a photo of the fault or the error code on WhatsApp.' },
    h1: 'Automatic washing machine repair in Dammam',
    lead: 'We repair automatic washing machines. Send a photo of the fault or the error code on WhatsApp.',
  },
  {
    slug: 'dryer-repair',
    name: 'Dryers',
    summary: 'Dryer repair.',
    units: ['Dryer'],
    forWho: 'For homes where the dryer no longer heats or no longer dries as it used to.',
    send: { h: 'Send us on WhatsApp', items: ['A photo or video of the fault', 'The type and brand of the dryer', 'A photo of the unit label, if you can', 'Your district'] },
    faq: [{ q: 'My dryer is not drying as well as it used to. What should I do?', a: 'Clean the lint filter and check that the vent is not blocked. If it keeps happening, send us a video.' }],
    seo: { title: `Dryer repair in Dammam | ${name}`, description: 'Dryer repair in Dammam. Send a photo of the fault on WhatsApp or call us.' },
    h1: 'Dryer repair in Dammam',
    lead: 'We repair dryers. Photograph the fault and send it on WhatsApp.',
  },
];

const brandNames: [string, string][] = [
  ['lg', 'LG'],
  ['samsung', 'Samsung'],
  ['gree', 'Gree'],
  ['carrier', 'Carrier'],
  ['midea', 'Midea'],
  ['haier', 'Haier'],
  ['daikin', 'Daikin'],
  ['zamil', 'Zamil'],
  ['whirlpool', 'Whirlpool'],
  ['super-general', 'Super General'],
];

const brandItems: Brand[] = brandNames.map(([slug, n]) => ({
  slug: `${slug}-appliance-repair`,
  name: n,
  seo: { title: `${n} repair in Dammam | ${name}`, description: `Have a ${n} appliance? Send a photo of the fault and the unit label on WhatsApp and we will tell you whether we can repair it.` },
  h1: `${n} repair in Dammam`,
  lead: `${name} is an independent repair shop, not an agent of ${n}. Send a photo of the fault and the unit label on WhatsApp and we will tell you whether we can repair it.`,
}));

const policyDate = '1 November 2026';

export const en: Content = {
  status: 'final',
  meta: { title: name, description: `${name}, in Al-Jalawiyah, Dammam. Repair of air conditioners, fridges, automatic washing machines and dryers.` },
  chrome: { skipLink: 'Skip to content' },
  actions: { whatsapp: 'WhatsApp us', call: 'Call us', directions: 'Directions', allServices: 'All services' },
  icons: { next: 'Next' },
  home: {
    seo: { title: `AC, fridge and washing machine repair in Dammam | ${name}`, description: 'A registered repair shop in Al-Jalawiyah, Dammam: air conditioners, fridges, automatic washing machines and dryers. Photograph the fault and send it on WhatsApp.' },
    hero: {
      question: 'AC gave up?',
      answer: 'Photograph the fault and send it on WhatsApp.',
      support: 'Air conditioner, fridge, washing machine and dryer repair in Dammam.',
      homeVisitLine: '',
    },
    picker: { heading: 'What is the fault?', lead: 'Pick the appliance, then the fault, and send it to us on WhatsApp.', applianceLabel: 'Appliance', faultLabel: 'Fault', areaLabel: 'District', send: 'Send on WhatsApp', plain: 'Or browse the services' },
    repair: { heading: 'What we repair', lead: 'Four kinds of household appliance.' },
    steps: {
      heading: 'How it starts',
      items: [
        { title: 'Photograph the fault', text: 'A photo or a short video of the appliance.' },
        { title: 'Send it on WhatsApp', text: `To ${phone}, with your district.` },
        { title: 'We reply', text: 'And agree the next step with you.' },
      ],
    },
    reviews: { heading: 'What customers say', link: 'All reviews on Google Maps' },
    work: { heading: 'Our work', lead: 'Real photos from the shop’s jobs.' },
    shop: { heading: 'The shop', addressLabel: 'Address', address: 'Prince Abdulmohsen bin Jalawi Street, Al-Jalawiyah, Dammam', hoursLabel: 'Opening hours', hours: 'Every day, 8:00 AM to 11:00 PM', mapLoad: 'Show the map', legalLabel: 'Legal name', crLabel: 'Commercial registration' },
    faq: {
      heading: 'Questions',
      items: [
        { q: 'Which appliances do you repair?', a: 'Air conditioners (split and window), fridges including gas refilling, automatic washing machines and dryers.' },
        { q: 'How do I reach you?', a: `WhatsApp or call ${phone}, every day from 8:00 AM to 11:00 PM.` },
        { q: 'Where is the shop?', a: 'In Al-Jalawiyah, Dammam, on Prince Abdulmohsen bin Jalawi Street.' },
      ],
    },
    close: { heading: 'Appliance stopped?', text: 'Send us a photo of the fault on WhatsApp.' },
  },
  services: {
    seo: { title: `Appliance repair services in Dammam | ${name}`, description: 'Repair of air conditioners, fridges, automatic washing machines and dryers in Dammam.' },
    h1: 'Repair services',
    lead: 'Air conditioners, fridges, automatic washing machines and dryers.',
    notListed: 'Appliance not on the list? Ask us on WhatsApp.',
    items: services,
  },
  faults: {
    seo: { title: `Appliance faults and fixes | ${name}`, description: 'Faults in ACs, fridges and washing machines, and what you can check yourself.' },
    h1: 'Appliance faults',
    lead: 'Coming soon.',
    items: [],
  },
  areas: {
    seo: { title: `Where we work | ${name}`, description: `${name}, in Al-Jalawiyah, Dammam.` },
    h1: 'Dammam',
    lead: 'The shop is in Al-Jalawiyah, Dammam.',
    pending: 'We add other cities once we confirm them.',
    items: [
      {
        slug: 'appliance-repair-in-dammam',
        name: 'Dammam',
        seo: { title: `Appliance repair in Dammam | ${name}`, description: `${name}, in Al-Jalawiyah, Dammam. ACs, fridges, automatic washing machines and dryers.` },
        h1: 'Appliance repair in Dammam',
        lead: 'Our shop is in Al-Jalawiyah, Dammam. Photograph the fault and send it on WhatsApp.',
      },
    ],
  },
  brands: {
    seo: { title: `Appliance brands | ${name}`, description: 'Send your appliance brand and unit label on WhatsApp and we will tell you whether we can repair it.' },
    h1: 'Appliance brands',
    lead: 'Send your appliance brand and unit label on WhatsApp and we will tell you whether we can repair it.',
    disclaimer: `${name} is an independent repair shop, not an agent of any brand named here.`,
    items: brandItems,
  },
  about: {
    seo: { title: `About us | ${name}`, description: `${name}: a registered repair shop in Al-Jalawiyah, Dammam.` },
    h1: 'About us',
    lead: 'A registered repair shop in Al-Jalawiyah, Dammam.',
    factsHeading: 'Our details',
    sections: [
      { h: 'What we repair', body: 'Air conditioners (split and window), fridges including gas refilling, automatic washing machines and dryers.' },
      { h: 'How to reach us', body: `WhatsApp or call ${phone}, every day from 8:00 AM to 11:00 PM.` },
    ],
  },
  contact: {
    seo: { title: `Contact us | ${name}`, description: `Contact ${name} on WhatsApp or call ${phone}.` },
    h1: 'Contact us',
    lead: 'WhatsApp is quickest. Send a photo of the fault with it.',
    form: {
      name: 'Name',
      phone: 'Mobile number',
      appliance: 'Appliance',
      area: 'District',
      message: 'Describe the fault',
      consent: 'I agree that my details are used only to answer my request.',
      privacy: 'Privacy policy',
      submit: 'Send request',
      sent: 'We have your request.',
      fallback: 'Could not send. Please message us on WhatsApp.',
    },
    hoursLabel: 'Opening hours',
    addressLabel: 'Address',
  },
  reviews: {
    seo: { title: `Customer reviews | ${name}`, description: 'Reviews copied as they are from our Google Maps listing.' },
    h1: 'Customer reviews',
    lead: 'Copied as they are from Google Maps.',
    rating: '5.0 from 8 reviews',
    asOf: 'As of 1 November 2026',
    source: 'Source: Google Maps',
    sourceLink: 'See the reviews',
    items: [
      { name: 'Jafar Sapra', text: 'Fast work 💪', when: '6 months ago' },
      { name: 'Shahbaz Ahmad', text: 'Good work', when: 'a year ago' },
      { name: 'Sohail Jamil', text: 'Good experience for work 😌', when: 'a year ago' },
      { name: 'Usama Ch', text: 'Good Experience', when: 'a year ago' },
      { name: 'Asad Amjad', text: 'Good work', when: '2 years ago' },
    ],
  },
  work: {
    seo: { title: `Our work | ${name}`, description: 'Real photos from the shop’s jobs.' },
    h1: 'Our work',
    lead: 'Real photos from the shop’s jobs.',
    empty: 'Photos coming soon.',
  },
  legal: {
    privacy: {
      seo: { title: `Privacy policy | ${name}`, description: 'How we handle your data when you use this site.' },
      h1: 'Privacy policy',
      lead: 'We collect as little as we can, and use it only to answer you.',
      updated: policyDate,
      sections: [
        { h: 'Who we are', body: `${site.legal.name}, commercial registration ${site.legal.cr}, Al-Jalawiyah, Dammam.` },
        { h: 'What we collect', body: 'If you fill in the contact form we receive your name, mobile number, appliance, district and a description of the fault.' },
        { h: 'Why', body: 'Only to answer your request. We do not sell your data or share it for marketing.' },
        { h: 'Where it is kept', body: 'In a spreadsheet and an email inbox that belong to the shop.' },
        { h: 'Your rights', body: `You can ask to see or delete your data by contacting us on ${phone}.` },
      ],
    },
    terms: {
      seo: { title: `Terms of use | ${name}`, description: 'Terms for using this site.' },
      h1: 'Terms of use',
      lead: 'This site introduces our services and lets you contact us.',
      updated: policyDate,
      sections: [
        { h: 'Information', body: 'Information on the site is for general guidance and is not a binding offer. We agree the details of each job with you directly.' },
        { h: 'Brands', body: 'Brand names belong to their owners. We are an independent shop and not affiliated with them.' },
        { h: 'Law', body: 'These terms are governed by the laws of the Kingdom of Saudi Arabia.' },
      ],
    },
    cookies: {
      seo: { title: `Cookie policy | ${name}`, description: 'How we use cookies and measurement tools.' },
      h1: 'Cookie policy',
      lead: 'We measure visits to improve the site, and do not tie them to your name.',
      updated: policyDate,
      sections: [
        { h: 'Measurement', body: 'We use visit measurement tools, and they only start after you interact with the page.' },
        { h: 'Control', body: 'You can block them in your browser settings, and the site works without them.' },
      ],
    },
  },
  blog: {
    seo: { title: `Blog | ${name}`, description: 'Short tips for looking after ACs and washing machines.' },
    h1: 'Blog',
    lead: 'Short tips for looking after your appliances.',
    items: [
      {
        slug: 'ac-repair-in-dammam',
        seo: { title: `When does your AC need a technician? | ${name}`, description: 'Signs your AC needs a technician, and what you can check yourself.' },
        h1: 'When does your AC need a technician?',
        lead: 'A quick check before you call.',
        updated: policyDate,
        sections: [
          { h: 'Check first', body: 'Make sure the remote is set to cooling, the filter is clean and the breaker is on.' },
          { h: 'When to call', body: 'If the AC runs but does not cool, leaks water or makes a strange noise, stop running it and contact us.' },
          { h: 'What to send', body: 'A short video of the fault and a photo of the unit label.' },
        ],
      },
      {
        slug: 'ac-repair-installation-maintenance-in-dammam-the-complete-guide',
        seo: { title: `Looking after your AC before summer | ${name}`, description: 'Simple steps for looking after an AC.' },
        h1: 'Looking after your AC before summer',
        lead: 'Simple steps that cut down faults.',
        updated: policyDate,
        sections: [
          { h: 'Clean the filter', body: 'A dirty filter weakens cooling. Switch the AC off at the power, then wash the filter with water.' },
          { h: 'Try it early', body: 'Run the AC a few days before the heat arrives, so you find a fault without a rush.' },
        ],
      },
      {
        slug: 'washing-machine-maintenance-repair-services-in-dammam',
        seo: { title: `Automatic washer will not spin | ${name}`, description: 'Common reasons a washer will not spin, and what to check yourself.' },
        h1: 'Automatic washer will not spin',
        lead: 'A quick check before you call.',
        updated: policyDate,
        sections: [
          { h: 'Spread the load', body: 'A bunched load on one side stops the spin. Spread it out and restart.' },
          { h: 'Check the drain', body: 'Make sure the drain hose is not kinked or blocked.' },
          { h: 'If it continues', body: 'Send us a video and the error code, if one shows.' },
        ],
      },
    ],
  },
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
