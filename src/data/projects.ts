/**
 * @file projects.ts
 * @description Centralized data store for featured web/fullstack projects and CLI tools.
 * Leverages i18n keys for localization. Video assets live in /public/videos.
 */

// --- INTERFACES ---
/**
 * Self-hosted, muted demo video. Paths are relative to /public.
 */
export interface ProjectVideo {
  mp4: string;
  webm: string;
  poster: string;
}

/**
 * Defines a web, full-stack or system project.
 * The `featured` one is rendered full-width (with its video) above the grid.
 */
export interface Project {
  titleKey: string;
  statusKey: string;
  tech: string[];
  descKey: string;
  links: {
    github: string;
    linkedin?: string;
    reddit?: string;
  };
  featured?: boolean;
  video?: ProjectVideo;
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
    titleKey: 'projects.arch.title',
    statusKey: 'projects.status.live',
    tech: ["Arch Linux", "Hyprland", "Wayland", "Quickshell", "Bash", "Lua"],
    descKey: 'projects.arch.desc',
    links: {
      github: "https://github.com/yagogutierrezvazquez/ArchLinux_Hyprland-Wayland"
    },
    featured: true,
    video: {
      mp4: "/videos/archlinux.mp4",
      webm: "/videos/archlinux.webm",
      poster: "/videos/archlinux-poster.jpg"
    }
  },
  {
    titleKey: 'projects.v1.title',
    statusKey: 'projects.status.live',
    tech: ["Astro", "Tailwind", "TypeScript"],
    descKey: 'projects.v1.desc',
    links: {
      github: "https://github.com/yagogutierrezvazquez/PortfolioWeb"
    }
  },
  {
    titleKey: 'projects.tfg.title',
    statusKey: 'projects.status.archived',
    tech: ["Angular", "NodeJS", "Bootstrap"],
    descKey: 'projects.tfg.desc',
    links: {
      github: "https://github.com/yagogutierrezvazquez/SuccessStreet-TFG"
    }
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