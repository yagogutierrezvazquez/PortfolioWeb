/**
 * @file projects.ts
 * @description Centralized data store for featured web/fullstack projects and CLI tools.
 * Leverages i18n keys for localization and Astro ImageMetadata for optimized asset processing.
 */

import type { ImageMetadata } from 'astro';

// --- ASSET IMPORTS ---
import portfolioWeb from '../assets/images/projects/portfolioweb.png';
import successStreet from '../assets/images/projects/successstreet.png';

// --- INTERFACES ---
/** 
 * Defines a featured web or full-stack project with visual representation. 
 */
export interface Project {
  titleKey: string;
  statusKey: string;
  tech: string[];
  descKey: string;
  link: string;
  image: ImageMetadata;
}

/** 
 * Defines a terminal-based CLI, script, or cybersecurity tool. 
 */
export interface Tool {
  titleKey: string;
  descKey: string;
  tech: string[];
  link: string;
}

// --- DATA ---
/** 
 * Main featured projects rendered in the primary grid layout. 
 */
export const projectsData: Project[] = [
  {
    titleKey: 'projects.v1.title',
    statusKey: 'projects.status.live',
    tech: ["Astro", "Tailwind", "TypeScript"],
    descKey: 'projects.v1.desc',
    link: "https://github.com/yagogutierrezvazquez/PortfolioWeb",
    image: portfolioWeb
  },
  {
    titleKey: 'projects.tfg.title',
    statusKey: 'projects.status.archived',
    tech: ["Angular", "NodeJS", "Bootstrap"],
    descKey: 'projects.tfg.desc',
    link: "https://github.com/yagogutierrezvazquez/SuccessStreet",
    image: successStreet
  }
];

/** 
 * Secondary scripts and tools rendered in a list or terminal-style layout. 
 */
export const toolsData: Tool[] = [
  {
    titleKey: 'projects.tool1.title',
    descKey: 'projects.tool1.desc',
    tech: ["Python", "Socket", "CLI"],
    link: "#" 
  },
  {
    titleKey: 'projects.tool2.title',
    descKey: 'projects.tool2.desc',
    tech: ["Bash", "Recon", "Automation"],
    link: "#" 
  }
];