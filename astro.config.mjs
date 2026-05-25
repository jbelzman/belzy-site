import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://belzy.net',
  integrations: [sitemap()],
  build: {
    assets: 'assets',
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
