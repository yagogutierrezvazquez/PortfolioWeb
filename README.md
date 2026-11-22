# yagog.dev — Portfolio

Personal portfolio of **Yago Gutiérrez**, a cybersecurity specialist focused on pentesting and Red Team work. A static, bilingual (EN/ES) site with a terminal-inspired look. It covers experience, certifications, tech stack and projects, plus an archive of CTF and lab writeups.

Live at **[yagog.dev](https://yagog.dev)**.

## Tech stack

- **[Astro 5](https://astro.build)**: static site generation, content collections, image optimization (`astro:assets`)
- **[Tailwind CSS 4](https://tailwindcss.com)** (via Vite) + `@tailwindcss/typography` for Markdown rendering
- **TypeScript** (strict)
- **@astrojs/sitemap** with i18n-aware sitemap generation

Pages ship almost no JavaScript. Small inline scripts handle the interactive parts: navbar scrollspy, mobile menu, the email "decrypt" effect, the dynamic age, and the writeups search and pagination.

## Getting started

```sh
npm install
npm run dev       # dev server at http://localhost:4321
npm run build     # production build to ./dist
npm run preview   # serve the build locally
```

## Project structure

```text
/
├── public/                  # Static files served as-is
│   ├── cv.pdf, english_cv.pdf   # Downloadable CVs (ES / EN)
│   ├── flags/               # Language switcher flags
│   ├── og-image.png         # 1200×630 social preview image
│   ├── robots.txt           # Crawler rules + sitemap location
│   └── videos/              # Project demo videos + posters
├── src/
│   ├── assets/              # Images optimized at build time (profile, certs, stack icons, project shots)
│   ├── components/
│   │   ├── sections/        # Home page sections: Navbar, Hero, Experience, Certificates,
│   │   │                    #   About, Stack, Projects, Writeups, Footer
│   │   ├── ui/              # Reusable primitives (Section wrapper, Badge)
│   │   └── writeups/        # Writeups views: WriteupsTable, WriteupsIndex, WriteupPost
│   ├── content/
│   │   ├── config.ts        # Content collection schema (writeups)
│   │   └── writeups/        # One folder per writeup: index.md + its screenshots
│   ├── data/                # Typed data stores: certificates, projects, stack, seo (identity + JSON-LD)
│   ├── i18n/                # ui.ts (EN/ES dictionary) + utils.ts (language/path helpers)
│   ├── layouts/             # BaseLayout: <head>, SEO meta, hreflang, OpenGraph, JSON-LD, Navbar
│   ├── pages/               # File-based routes (EN at root, ES under /es) + 404
│   ├── styles/global.css    # Tailwind entry + theme tokens
│   └── utils/writeups.ts    # Writeup helpers (sorting, date format, difficulty colors)
└── astro.config.mjs         # Site URL, Tailwind plugin, sitemap (i18n + filters)
```

## Routes

| Route | EN | ES |
|---|---|---|
| Home (single-page sections) | `/` | `/es` |
| All certificates | `/certs` | `/es/certs` |
| Writeups archive | `/writeups` | `/es/writeups` |
| Single writeup | `/writeups/<slug>` | `/es/writeups/<slug>` |
| Not found | `/404` (any unknown path) | — |

ES pages are thin wrappers around the same components. The language comes from the URL (`getLangFromUrl`).

## Internationalization

- Every UI string lives in `src/i18n/ui.ts`, keyed by section (`nav.*`, `hero.*`, `writeups.*`…). English is the fallback.
- Use `useTranslations(lang)` for strings and `useTranslatedPath(lang)` for links.
- Writeup content is intentionally **English-only**. Only the UI around it is translated.

## Content & data

### Writeups

Each writeup is a folder in `src/content/writeups/<slug>/` with an `index.md` and its images (referenced relatively, e.g. `./photo1.png`). The frontmatter is validated by `src/content/config.ts`:

```yaml
---
title: "BlueKeep (CVE-2019-0708)"
description: "Short summary, used for SEO."
date: 2025-10-27            # unquoted YAML date
platform: "INE Labs"
difficulty: "Medium"        # Easy | Medium | Hard | Insane
tags: ["RDP", "Metasploit", "Windows"]
cover: "./photo1.png"       # optional
---
```

How writeups are displayed:

- **Home**: shows 5 random writeups on each visit (`VISIBLE_WRITEUPS`). Without JS, the 5 newest are shown instead.
- **Archive**: newest first, split into numbered pages you can move through with buttons, arrows or swiping (up to `WRITEUPS_PER_PAGE`). On desktop the page size shrinks to fit the viewport so there is no vertical scroll.
  - Search filters by title and tags; `#term` matches tags only.
  - Tags are clickable and difficulty filters are generated from the data.
  - The current state is kept in the URL (`?q=`, `?diff=`, `?page=`).

### Certificates, projects & stack

These are typed arrays in `src/data/`. To add an entry, add an item and import its image from `src/assets/`.

- Certificate dates use the `"MM YYYY"` format so they can be translated.
- Project texts are i18n keys (`titleKey`, `descKey`…) defined in `ui.ts`. The `featured` project is shown full-width with an optional muted demo video from `public/videos/`.
- Experience entries are defined in `src/components/sections/Experience.astro`.

## SEO

The goal is for searches of **"Yago Gutiérrez"** to surface this site next to LinkedIn and GitHub.

- **Meta & titles**: every page passes a localized `title`/`description` (`seo.*` keys in `ui.ts`) to `BaseLayout`. The layout also renders the canonical URL, `author`, OpenGraph and Twitter tags, plus `og-image.png` as the share preview.
- **Hreflang**: each page links to its EN/ES counterpart, and `x-default` points to the EN version.
- **Structured data (JSON-LD)**: `src/data/seo.ts` builds a site-wide `Person` + `WebSite` graph.
  - `Person` includes name, full name, photo, job title, `sameAs` LinkedIn/GitHub, and every certificate from `certificates.ts` as a credential.
  - Writeups add a `TechArticle` node with author, date and keywords.
- **Duplicate content**: writeup content is English-only, so `/es/writeups/<slug>` declares the EN URL as canonical, has no hreflang, and is excluded from the sitemap (`astro.config.mjs`).
- **Crawling**: `@astrojs/sitemap` generates `sitemap-index.xml`, which `robots.txt` points to. `404.astro` makes unknown paths return a real 404 (`noindex`) instead of falling back to the home page.
- **Props** (`BaseLayout`): `type` (`website`/`article`), `canonical`, `alternates`, `noindex`, `schema` (extra JSON-LD node).

**Off-site checklist** (needed for name searches to work):
1. Verify `yagog.dev` in [Google Search Console](https://search.google.com/search-console) as a Domain property (DNS TXT record in Cloudflare).
2. Submit `https://yagog.dev/sitemap-index.xml` and request indexing of `/` and `/es/`.
3. Link `https://yagog.dev` from LinkedIn (Contact info → Website, Featured) and GitHub (profile and repo "Website").
4. Check progress with `site:yagog.dev`.

## Author

**Yago Gutiérrez** · [GitHub](https://github.com/yagogutierrezvazquez) · [LinkedIn](https://www.linkedin.com/in/yagogutierrezvazquez) · [yagog.dev](https://yagog.dev)
