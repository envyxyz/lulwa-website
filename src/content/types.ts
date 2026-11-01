// Phase 2 adds the page groups (home, services, faults, areas, brands, about, contact,
// reviews, work, legal, blog) and removes `status`. tests/copy-parity.spec.ts stays red until then.
export type Content = {
  status: 'stub' | 'final';
  meta: { title: string; description: string };
  chrome: { skipLink: string };
  actions: { whatsapp: string; call: string };
  icons: { next: string };
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
