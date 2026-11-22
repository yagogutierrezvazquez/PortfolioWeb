// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

/**
 * @description Astro Project Configuration
 * Features: Vite-based Tailwind processing and Automated I18N Sitemap.
 */
export default defineConfig({
  site: 'https://yagog.dev', 

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      /**
       * Exclude ES writeup posts: their content is English-only and their
       * canonical points to the EN URL, so only the original is listed.
       */
      filter: (page) => !/\/es\/writeups\/[^/]+\/?$/.test(new URL(page).pathname),
      /**
       * I18N configuration for sitemap
       * Ensures Google maps the relationship between root (EN) and /es (ES)
       */
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          es: 'es-ES',
        },
      },
    }),
  ],
});