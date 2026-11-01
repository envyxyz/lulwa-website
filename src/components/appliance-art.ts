// Line drawings on a 200 x 150 grid, geometry only. Stroke and fill come from the <svg>.
// `spots` are where the pearl lands, one per fault in the same order as the content file.
// The fault-to-part mapping is unconfirmed: shown only as "likely" until a technician checks it (docs/FOR-AMEER.md).
type Art = { svg: string; spots: [number, number][] };

const line = (x1: number, y1: number, x2: number, y2: number) => `<path d="M${x1} ${y1}H${x2}V${y2}"/>`;
const louvres = (x1: number, x2: number, ys: number[]) => ys.map((y) => line(x1, y, x2, y)).join('');
const round = `<circle cx="130" cy="26" r="6"/><path d="M50 38H150"/>`;

export const art: Record<string, Art> = {
  'split-ac': {
    svg: `<rect x="20" y="50" width="160" height="52" rx="12"/>${louvres(36, 164, [60, 66])}<path d="M30 86H170"/><circle cx="168" cy="76" r="2"/>`,
    spots: [[100, 63], [165, 94], [168, 76], [60, 76]],
  },
  'window-ac': {
    svg: `<rect x="40" y="28" width="120" height="94" rx="6"/>${louvres(54, 124, [42, 50, 58, 66])}${louvres(54, 124, [84, 92, 100, 108])}<rect x="132" y="42" width="16" height="30" rx="2"/>`,
    spots: [[89, 54], [70, 115], [140, 57], [89, 96]],
  },
  fridge: {
    svg: `<rect x="60" y="8" width="80" height="130" rx="8"/><path d="M60 50H140"/><path d="M72 26V42"/><path d="M72 60V86"/><path d="M60 120H140"/><path d="M70 138V144"/><path d="M130 138V144"/>`,
    spots: [[120, 129], [80, 129], [100, 50], [100, 129]],
  },
  washer: {
    svg: `<rect x="50" y="14" width="100" height="122" rx="8"/>${round}<circle cx="100" cy="86" r="32"/><circle cx="100" cy="86" r="23"/><path d="M60 26H100"/>`,
    spots: [[100, 86], [64, 124], [130, 26], [136, 118]],
  },
  dryer: {
    svg: `<rect x="50" y="14" width="100" height="122" rx="8"/>${round}<circle cx="100" cy="82" r="30"/><path d="M60 26H100"/><rect x="78" y="120" width="44" height="7" rx="3"/>`,
    spots: [[100, 66], [100, 123], [100, 90], [130, 26]],
  },
};
