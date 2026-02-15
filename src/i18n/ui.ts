/**
 * @file ui.ts
 * @description Internationalization dictionary and configuration.
 * Defines supported languages, the default locale, and all UI strings for the application.
 */

/**
 * List of supported languages for the portfolio.
 */
export const languages = {
  en: 'English',
  es: 'Español',
};

/**
 * The fallback language when no locale is detected in the URL.
 */
export const defaultLang = 'en';

/**
 * UI Translation Dictionary
 * Organized by component/section for better maintainability.
 */
export const ui = {
  // --- ENGLISH TRANSLATIONS ---
  en: {
    // Navigation Labels
    'nav.home': 'Home',
    'nav.exp': 'Exp',
    'nav.certs': 'Certs',
    'nav.about': 'About',
    'nav.stack': 'Stack',
    'nav.projects': 'Projects',
    'nav.writeups': 'Writeups',

    // Hero Section Strings
    'hero.role': 'Cybersecurity Specialist',
    'hero.description': 'Focused on solving complex challenges and pentesting.',
    'hero.cv': 'Download CV',

    // About Section Strings
    // Note: Use of <strong> with Tailwind classes for highlighted narrative content.
    'about.title': 'Whoami',
    'about.p1': 'I started my journey into IT at 15, tinkering with microcomputer systems and networks. Curiosity led me to Web Development, but I quickly realized that my true endgame was <strong class="text-white font-bold">Cybersecurity</strong>.',
    'about.p2': 'Now at 20, I focus on the <strong class="text-green-500 font-bold">Red Team</strong> side of operations. I love the thrill of solving complex puzzles and understanding how systems break, though I also deeply enjoy the defensive strategy of Blue Teaming. ',
    'about.p3': 'Offline, I keep it simple. You’ll find me grinding video games, going to the gym, or spending quality time with my partner and friends. I’m just a guy who loves to learn, explore, and occasionally break things—ethically, of course.',
  },

  // --- SPANISH TRANSLATIONS ---
  es: {
    // Etiquetas de Navegación
    'nav.home': 'Inicio',
    'nav.exp': 'Exp',
    'nav.certs': 'Certs',
    'nav.about': 'Sobre mí',
    'nav.stack': 'Stack',
    'nav.projects': 'Proyectos',
    'nav.writeups': 'Writeups',

    // Textos de la Sección Hero
    'hero.role': 'Especialista en Ciberseguridad',
    'hero.description': 'Enfocado en resolver desafíos complejos y el pentesting.',
    'hero.cv': 'Descargar CV',

    // Textos de la Sección Sobre Mí (About)
    'about.title': 'Whoami',
    'about.p1': 'Comencé mi camino en la informática a los 15 años, trasteando con sistemas microinformáticos y redes. La curiosidad me llevó al desarrollo web, pero pronto me di cuenta de que mi verdadero objetivo final era la <strong class="text-white font-bold">Ciberseguridad</strong>.',
    'about.p2': 'Ahora a los 20, me enfoco sobretodo en la parte del <strong class="text-green-500 font-bold">Red Team</strong>. Me gusta mucho enfrentarme a los acertijos complejos y entender cómo fallan los sistemas, aunque también disfruto mucho de la estrategia defensiva del Blue Teaming. ',
    'about.p3': 'Fuera del mundo digital, tengo unos gustos simples. Paso el tiempo jugando videojuegos, yendo al gimnasio o teniendo tiempo de calidad con mi pareja y amigos. Soy un chaval al que le gusta aprender, explorar y, a veces, romper cosas, de forma ética, por supuesto.',
  },
} as const;