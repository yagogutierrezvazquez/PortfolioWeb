/**
 * @file certificates.ts
 * @description Centralized data store for professional certifications and badges.
 * This data is consumed by both the Home carousel and the dedicated /certs page.
 */

export interface Certificate {
  name: string;
  issuer: string;
  /** @format "MM YYYY" - Required for i18n date translation logic */
  date: string;
  image: string;
  url: string;
}

/**
 * Global list of earned certifications.
 * To add a new one, ensure the image exists in /public/certificates/
 * and use the "MM YYYY" format for the date.
 */
export const certificates: Certificate[] = [
  {
    name: "Junior Penetration Tester (eJPT)",
    issuer: "INE Security",
    date: "01 2026",
    image: "/certificates/ejpt.png",
    url: "https://certs.ine.com/9d7755f7-439e-41a6-a978-a8a60e59f65c#acc.fSDbtR1s" 
  },
  {
    name: "IT Specialist - Cybersecurity",
    issuer: "Certiport (Pearson VUE)",
    date: "12 2025",
    image: "/certificates/its-cyber.png",
    url: "https://www.credly.com/badges/cc810567-b64d-4a9c-a07a-a325f0a7fda8/public_url"
  },
  {
    name: "IT Specialist - Network Security",
    issuer: "Certiport (Pearson VUE)",
    date: "12 2025",
    image: "/certificates/its-network.png",
    url: "https://www.credly.com/badges/ff2212c9-d406-4bad-a7d8-bbefe0e11360/public_url"
  },
  {
    name: "Microsoft Certified: Security, Compliance, and Identity Fundamentals (SC-900)",
    issuer: "Microsoft",
    date: "12 2025",
    image: "/certificates/sc-900.png",
    url: "https://www.credly.com/badges/0c51850d-c77d-4893-a660-8b2e4f064814/public_url"
  },
  {
    name: "Junior Cybersecurity Analyst Career Path",
    issuer: "Cisco",
    date: "03 2024",
    image: "/certificates/cisco-jr.png",
    url: "https://www.credly.com/badges/df64e9f3-cd41-48a8-bd1f-f070e3f57bdc/public_url"
  }
];