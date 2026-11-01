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

/** art: the appliance drawing (src/components/appliance-art.ts); spot: which pearl spot in that drawing. */
export type Fault = Intro & {
  slug: string;
  service: string;
  art: string;
  spot: number;
  name: string;
  part: string;
  check: string[];
  technician: string[];
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
    nav: { services: string; faults: string; reviews: string; work: string; contact: string };
    /** The giant name across the hero and the end of the footer. */
    word: string;
  };
  footer: { line: string; services: string; company: string; hours: string };
  actions: { whatsapp: string; call: string; directions: string; allServices: string };
  icons: { next: string };
  home: {
    seo: Seo;
    hero: {
      question: string;
      /** Second part of the h1: carries the city, in plain sight. */
      service: string;
      answer: string;
      support: string;
      /** Empty until the client confirms home visits (docs/FOR-AMEER.md). Render nothing when empty. */
      homeVisitLine: string;
      tile: { alt: string };
    };
    picker: {
      heading: string;
      quiet: string;
      lead: string;
      /** Names the carousel and the row of faults for assistive technology. */
      applianceLabel: string;
      faultLabel: string;
      prev: string;
      next: string;
      send: string;
      plain: string;
      /** Shown until a fault is picked. */
      empty: string;
      /** The pill that opens the note field. */
      notSure: string;
      noteLabel: string;
      notePlaceholder: string;
      /** Joins several picked faults. */
      join: string;
      /** Prefix of the part the pearl lands on. The mapping stays "likely" until a technician confirms it (docs/FOR-AMEER.md). */
      likely: string;
      /** Built up as the visitor picks: start always, fault once one is picked, note once written. {appliance}, {fault}, {note} are replaced. */
      message: { start: string; fault: string; note: string };
      appliances: { slug: string; name: string; service: string; faults: { label: string; part: string }[] }[];
    };
    repair: { heading: string; quiet: string; lead: string; callLabel: string; prev: string; next: string };
    statement: { start: string; quiet: string };
    steps: { heading: string; quiet: string; items: { title: string; text: string }[] };
    reviews: { heading: string; quiet: string; link: string };
    work: { heading: string; quiet: string; lead: string; statement: string; items: { photo: string; caption: string }[] };
    shop: { heading: string; addressLabel: string; address: string; hoursLabel: string; hours: string; hoursRange: string; today: string; days: string[]; mapLoad: string; mapLoading: string; legalLabel: string; crLabel: string };
    faq: { heading: string; quiet: string; items: Faq[] };
    close: { heading: string; text: string };
  };
  services: Intro & {
    items: Service[];
    notListed: string;
    labels: { units: string; faults: string; faq: string; art: string };
  };
  faults: Intro & {
    items: Fault[];
    labels: { answer: string; check: string; technician: string; part: string; related: string; closeH: string; closeText: string; appliances: string };
  };
  areas: Intro & { pending: string; servicesLabel: string; items: (Intro & { slug: string; name: string })[] };
  brands: Intro & { disclaimer: string; items: Brand[] };
  about: Intro & { sections: Section[]; factsHeading: string; facts: { label: string; value: string }[] };
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
      sending: string;
      sent: string;
      fallback: string;
      choose: string;
      whatsappFallback: string;
      errors: { required: string; phone: string };
    };
    hoursLabel: string;
    addressLabel: string;
  };
  reviews: Intro & { rating: string; asOf: string; source: string; sourceLink: string; items: Review[] };
  work: Intro & { empty: string };
  legal: { privacy: Policy; terms: Policy; cookies: Policy };
  blog: Intro & { updated: string; items: Post[] };
  notFound: Intro & { home: string };
  thanks: Intro;
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
