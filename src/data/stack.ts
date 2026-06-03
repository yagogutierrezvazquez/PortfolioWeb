/**
 * @file stack.ts
 * @description Type-safe data store for the developer & cybersecurity tool stack.
 * Enforces strict typing mapped directly to the i18n UI dictionary.
 */

import type { ImageMetadata } from 'astro';
import { ui } from '../i18n/ui';

/** 
 * Extracts valid translation keys from the English UI dictionary to prevent missing translations. 
 */
type TranslationKey = keyof typeof ui['en'];

// --- ASSET IMPORTS ---
// Cybersecurity Arsenal
import bash from '../assets/images/stack/cyber/bash.png';
import burp from '../assets/images/stack/cyber/burp.png';
import gobuster from '../assets/images/stack/cyber/gobuster.svg';
import hydra from '../assets/images/stack/cyber/hydra.svg';
import john from '../assets/images/stack/cyber/johntheripper.png';
import kali from '../assets/images/stack/cyber/kali.png';
import linux from '../assets/images/stack/cyber/linux.png';
import metasploit from '../assets/images/stack/cyber/metasploit.png';
import nessus from '../assets/images/stack/cyber/nessus.png';
import nmap from '../assets/images/stack/cyber/nmap.png';
import zap from '../assets/images/stack/cyber/owaspzap.png';
import wireshark from '../assets/images/stack/cyber/wireshark.png';

// Web & Development
import astroLogo from '../assets/images/stack/devweb/astro.png';
import css from '../assets/images/stack/devweb/css.png';
import docker from '../assets/images/stack/devweb/docker.png';
import git from '../assets/images/stack/devweb/git.png';
import html from '../assets/images/stack/devweb/html.png';
import java from '../assets/images/stack/devweb/java.png';
import js from '../assets/images/stack/devweb/javascript.svg';
import postman from '../assets/images/stack/devweb/postman.png';
import react from '../assets/images/stack/devweb/react.png';
import spring from '../assets/images/stack/devweb/spring-boot.png';
import sql from '../assets/images/stack/devweb/sql.png';
import tailwind from '../assets/images/stack/devweb/tailwind.png';
import vscode from '../assets/images/stack/devweb/vscode.png';


// --- INTERFACES ---
/** 
 * Represents a single technology or tool within a stack category. 
 */
export interface StackItem {
  name: string;
  icon: ImageMetadata;
}

/** 
 * Represents a grouping of stack items (e.g., Security Arsenal, Web Dev). 
 */
export interface StackCategory {
  categoryKey: TranslationKey;
  id: string;
  items: StackItem[];
}

// --- DATA EXPORT ---
/** 
 * Categorized list of technologies rendered in the Stack accordion UI. 
 */
export const stackData: StackCategory[] = [
  {
    categoryKey: 'stack.arsenal', 
    id: "cyber",
    items: [
        { name: "Kali Linux", icon: kali },
        { name: "Bash Scripting", icon: bash },
        { name: "Nmap", icon: nmap },
        { name: "Burp Suite", icon: burp },
        { name: "John the Ripper", icon: john },
        { name: "Metasploit Framework", icon: metasploit },
        { name: "OWASP ZAP", icon: zap },
        { name: "Nessus", icon: nessus },
        { name: "Wireshark", icon: wireshark },
        { name: "GoBuster", icon: gobuster },
        { name: "Hydra", icon: hydra },
        { name: "Linux", icon: linux },
    ]
  },
  {
    categoryKey: 'stack.dev', 
    id: "dev",
    items: [
      { name: "Git", icon: git },
      { name: "Docker", icon: docker },
      { name: "Visual Studio Code", icon: vscode },
      { name: "Tailwind CSS", icon: tailwind },
      { name: "Java", icon: java },
      { name: "JavaScript", icon: js },
      { name: "React", icon: react },
      { name: "Spring Boot", icon: spring },
      { name: "Postman", icon: postman },
      { name: "HTML", icon: html },
      { name: "CSS", icon: css },
      { name: "SQL", icon: sql },
      { name: "Astro", icon: astroLogo },                                                                                              
    ]
  }
];