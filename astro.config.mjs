import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { site } from './src/site.ts';

// The kitchen sink exists only under `astro dev`, so it can never reach dist or the sitemap.
const kitchenSink = {
  name: 'dev-kitchen-sink',
  hooks: {
    'astro:config:setup': ({ command, injectRoute }) => {
      if (command !== 'dev') return;
      for (const pattern of ['/dev/kitchen-sink', '/en/dev/kitchen-sink']) {
        injectRoute({ pattern, entrypoint: './src/dev/kitchen-sink.astro' });
      }
    },
  },
};

export default defineConfig({
  site: site.url,
  output: 'static',
  // Old slugs have no trailing slash and must keep their exact URL.
  trailingSlash: 'never',
  build: { format: 'file' },
  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap(), kitchenSink],
  vite: { plugins: [tailwindcss()] },
});
