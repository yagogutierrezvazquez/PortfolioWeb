/**
 * @file seo.ts
 * @description Central identity & structured data (JSON-LD, schema.org) for search engines.
 * The Person/WebSite graph lets Google connect "Yago Gutiérrez" with this site,
 * LinkedIn and GitHub (sameAs), and lists the earned certifications.
 */

import { certificates } from './certificates';

export const SITE_URL = 'https://yagog.dev';

export const profile = {
  name: 'Yago Gutiérrez',
  fullName: 'Yago Gutiérrez Vázquez',
  jobTitle: 'Cybersecurity Specialist',
  email: 'personal-contact@yagog.dev',
  country: 'ES',
  linkedin: 'https://www.linkedin.com/in/yagogutierrezvazquez',
  github: 'https://github.com/yagogutierrezvazquez',
  knowsAbout: [
    'Cybersecurity',
    'Penetration Testing',
    'Red Team',
    'Vulnerability Assessment',
    'Network Security',
    'Capture The Flag (CTF)',
    'Java',
    'Web Development',
  ],
};

// Stable node identifiers so pages can reference the same entities
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Builds the site-wide JSON-LD graph (Person + WebSite).
 * @param imageUrl - Absolute URL of the profile picture.
 */
export function buildSiteSchema(imageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: profile.name,
        alternateName: profile.fullName,
        url: `${SITE_URL}/`,
        image: imageUrl,
        jobTitle: profile.jobTitle,
        email: `mailto:${profile.email}`,
        address: { '@type': 'PostalAddress', addressCountry: profile.country },
        sameAs: [profile.linkedin, profile.github],
        knowsAbout: profile.knowsAbout,
        hasCredential: certificates.map((cert) => ({
          '@type': 'EducationalOccupationalCredential',
          name: cert.name,
          credentialCategory: 'certification',
          url: cert.url,
          recognizedBy: { '@type': 'Organization', name: cert.issuer },
        })),
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: `${profile.name} — Portfolio`,
        alternateName: 'yagog.dev',
        inLanguage: ['en', 'es'],
        author: { '@id': PERSON_ID },
        publisher: { '@id': PERSON_ID },
      },
    ],
  };
}
