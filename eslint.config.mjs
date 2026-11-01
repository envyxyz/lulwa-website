import astro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

const HEX = /(^|[\s"'`(:=\[])#[0-9a-fA-F]{3,8}\b/;
const ARBITRARY = /(^|[\s:])-?[a-z-]*-\[[^\]]+\]|(^|\s)\[[a-z-]+:[^\]]+\]/;
const PHYSICAL = /(^|[\s:])-?(ml|mr|pl|pr|left|right|border-l|border-r|rounded-l|rounded-r|rounded-tl|rounded-tr|rounded-bl|rounded-br|scroll-ml|scroll-mr|text-left|text-right|float-left|float-right|clear-left|clear-right)(-|\s|$)/;
const LETTERS = /\p{L}{2}/u;
// Attributes a visitor reads or a screen reader says. Everything visible goes through src/content.
const COPY_ATTRIBUTES = new Set(['alt', 'title', 'placeholder', 'aria-label', 'aria-description', 'aria-placeholder', 'value', 'label']);

const stringsIn = (node) => {
  if (!node) return [];
  if (node.type === 'Literal' && typeof node.value === 'string') return [[node, node.value]];
  if (node.type === 'TemplateElement') return [[node, node.value.raw]];
  const children = Object.entries(node).filter(([key]) => key !== 'parent');
  return children.flatMap(([, value]) => {
    if (Array.isArray(value)) return value.flatMap((child) => (child?.type ? stringsIn(child) : []));
    return value?.type ? stringsIn(value) : [];
  });
};
const attributeName = (node) => (node.name?.type === 'JSXNamespacedName' ? `${node.name.namespace.name}:${node.name.name.name}` : node.name?.name);

const scanClasses = (pattern, message) => ({
  meta: { type: 'problem', schema: [], messages: { bad: message } },
  create: (context) => ({
    // class strings often live in component frontmatter, so every string with a utility shape is scanned.
    Literal(node) {
      if (typeof node.value === 'string' && pattern.test(node.value) && !node.parent?.type?.startsWith('Import') && attributeName(node.parent ?? {}) !== 'href') context.report({ node, messageId: 'bad' });
    },
    TemplateElement(node) {
      if (pattern.test(node.value.raw)) context.report({ node, messageId: 'bad' });
    },
    AstroRawText() {},
  }),
});

const lulwa = {
  rules: {
    'no-raw-hex': scanClasses(HEX, 'Raw hex colour. Use a token from src/styles/tokens.css.'),
    'no-arbitrary-tailwind': scanClasses(ARBITRARY, 'Arbitrary Tailwind value. Add a token to src/styles/tokens.css.'),
    'no-physical-tailwind': scanClasses(PHYSICAL, 'Physical direction utility. Use ms-, me-, ps-, pe-, start-, end-, text-start, text-end.'),
    'no-literal-copy': {
      meta: { type: 'problem', schema: [], messages: { bad: 'Literal copy in a component. Move it to src/content/.' } },
      create: (context) => ({
        JSXText(node) {
          if (LETTERS.test(node.value)) context.report({ node, messageId: 'bad' });
        },
        JSXAttribute(node) {
          if (!COPY_ATTRIBUTES.has(attributeName(node))) return;
          for (const [found, text] of stringsIn(node.value)) if (LETTERS.test(text)) context.report({ node: found, messageId: 'bad' });
        },
      }),
    },
  },
};

export default [
  { ignores: ['.claude', 'dist', '.wrangler', '.astro', 'node_modules', 'playwright-report', 'test-results', '.lighthouseci', 'docs', 'design', 'scripts', 'public', '*.cjs', '*.mjs'] },
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ['src/**/*.astro', 'src/**/*.ts'],
    plugins: { lulwa },
    rules: {
      'lulwa/no-raw-hex': 'error',
    },
  },
  // Copy may say "left" or "right" in plain words; class shapes are only checked outside it.
  {
    files: ['src/**/*.astro', 'src/**/*.ts'],
    ignores: ['src/content/**'],
    plugins: { lulwa },
    rules: {
      'lulwa/no-arbitrary-tailwind': 'error',
      'lulwa/no-physical-tailwind': 'error',
    },
  },
  // src/content owns copy; site.ts owns facts, and its Arabic strings are not class names.
  {
    files: ['src/components/**/*.astro', 'src/layouts/**/*.astro', 'src/pages/**/*.astro', 'src/dev/**/*.astro'],
    plugins: { lulwa },
    rules: { 'lulwa/no-literal-copy': 'error' },
  },
];
