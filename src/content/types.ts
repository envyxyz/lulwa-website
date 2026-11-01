// One shape for both languages. A missing key in either file is a type error; array lengths are
// checked by tests/copy-parity.spec.ts. Anything PRODUCT.md does not confirm is left out or empty.
export type Seo = { title: string; description: string };
export type Faq = { q: string; a: string };
export type Section = { h: string; body: string };
export type Intro = { seo: Seo; h1: string; lead: string };

export type Service = Intro & {
  slug: string;
  name: string;
  /** One sentence for the home row and the hub. */
  summary: string;
  units: string[];
  forWho: string;
  send: { h: string; items: string[] };
  faq: Faq[];
};

export type Brand = Intro & { slug: string; name: string };

export type Review = { name: string; text: string; when: string };

export type Post = Intro & { slug: string; updated: string; sections: Section[] };

export type Policy = Intro & { updated: string; sections: Section[] };

export type Content = {
  status: 'final';
  meta: { title: string; description: string };
  chrome: {
    skipLink: string;
    homeLabel: string;
    navLabel: string;
    menu: string;
    /** The other language's name, shown as the language link. */
    language: string;
    nav: { services: string; faults: string; reviews: string; contact: string };
    /** The giant name across the hero and the end of the footer. */
    word: string;
  };
  actions: { whatsapp: string; call: string; directions: string; allServices: string };
  icons: { next: string };
  home: {
    seo: Seo;
    hero: {
      question: string;
      answer: string;
      support: string;
      /** Empty until the client confirms home visits (docs/FOR-AMEER.md). Render nothing when empty. */
      homeVisitLine: string;
      tile: { alt: string };
    };
    picker: { heading: string; lead: string; applianceLabel: string; faultLabel: string; areaLabel: string; send: string; plain: string };
    repair: { heading: string; lead: string };
    steps: { heading: string; items: { title: string; text: string }[] };
    reviews: { heading: string; link: string };
    work: { heading: string; lead: string };
    shop: { heading: string; addressLabel: string; address: string; hoursLabel: string; hours: string; mapLoad: string; legalLabel: string; crLabel: string };
    faq: { heading: string; items: Faq[] };
    close: { heading: string; text: string };
  };
  services: Intro & { items: Service[]; notListed: string };
  faults: Intro & { items: (Intro & { slug: string })[] };
  areas: Intro & { pending: string; items: (Intro & { slug: string; name: string })[] };
  brands: Intro & { disclaimer: string; items: Brand[] };
  about: Intro & { sections: Section[]; factsHeading: string };
  contact: Intro & {
    form: {
      name: string;
      phone: string;
      appliance: string;
      area: string;
      message: string;
      consent: string;
      privacy: string;
      submit: string;
      sent: string;
      fallback: string;
    };
    hoursLabel: string;
    addressLabel: string;
  };
  reviews: Intro & { rating: string; asOf: string; source: string; sourceLink: string; items: Review[] };
  work: Intro & { empty: string };
  legal: { privacy: Policy; terms: Policy; cookies: Policy };
  blog: Intro & { items: Post[] };
  sink: {
    title: string;
    statement: string;
    headLine1: string;
    headLine2: string;
    lead: string;
    body: string;
    small: string;
    quietAction: string;
    cardTitle: string;
    cardBody: string;
    mirrored: string;
    fixed: string;
  };
};
