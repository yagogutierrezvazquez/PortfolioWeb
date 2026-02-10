// src/data/certificates.ts

export interface Certificate {
  name: string;
  issuer: string;
  date: string;
  image: string;
  url: string;
}

export const certificates: Certificate[] = [
  {
    name: "Junior Penetration Tester (eJPT)",
    issuer: "INE Security",
    date: "January 2026",
    image: "/certificates/ejpt.png",
    url: "https://certs.ine.com/9d7755f7-439e-41a6-a978-a8a60e59f65c#acc.fSDbtR1s" 
  },
  {
    name: "IT Specialist - Cybersecurity",
    issuer: "Certiport (Pearson VUE)",
    date: "December 2025",
    image: "/certificates/its-cyber.png",
    url: "https://www.credly.com/badges/cc810567-b64d-4a9c-a07a-a325f0a7fda8/public_url"
  },
  {
    name: "IT Specialist - Network Security",
    issuer: "Certiport (Pearson VUE)",
    date: "December 2025",
    image: "/certificates/its-network.png",
    url: "https://www.credly.com/badges/ff2212c9-d406-4bad-a7d8-bbefe0e11360/public_url"
  },
  {
    name: "Microsoft Certified: Security, Compliance, and Identity Fundamentals (SC-900)",
    issuer: "Microsoft",
    date: "December 2025",
    image: "/certificates/sc-900.png",
    url: "https://www.credly.com/badges/0c51850d-c77d-4893-a660-8b2e4f064814/public_url"
  },
  {
    name: "Junior Cybersecurity Analyst Career Path",
    issuer: "Cisco",
    date: "March 2024",
    image: "/certificates/cisco-jr.png",
    url: "https://www.credly.com/badges/df64e9f3-cd41-48a8-bd1f-f070e3f57bdc/public_url"
  }
];