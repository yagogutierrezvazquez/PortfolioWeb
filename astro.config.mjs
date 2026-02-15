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