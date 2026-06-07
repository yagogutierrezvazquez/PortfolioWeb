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
    // Months
    'month.01': 'January',
    'month.02': 'February',
    'month.03': 'March',
    'month.04': 'April',
    'month.05': 'May',
    'month.06': 'June',
    'month.07': 'July',
    'month.08': 'August',
    'month.09': 'September',
    'month.10': 'October',
    'month.11': 'November',
    'month.12': 'December',

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
    'about.p2': 'Now at <span id="dynamic-age">20</span>, I focus on the <strong class="text-green-500 font-bold">Red Team</strong> side of operations. I love the thrill of solving complex puzzles and understanding how systems break, though I also deeply enjoy the defensive strategy of Blue Teaming. ',
    'about.p3': 'Offline, I keep it simple. You’ll find me grinding video games, going to the gym, or spending quality time with my partner and friends. I’m just a guy who loves to learn, explore, and occasionally break things—ethically, of course.',
  
    // Experience Section Strings
    'exp.title': 'Professional_Exp',
    'exp.ntt.role': 'Junior Java Developer',
    'exp.ntt.period': 'March 2023 - July 2024',
    'exp.ntt.desc': 'Labor contract linked to Dual Vocational Training. Developed backend solutions using Java ecosystems, participating in software lifecycle management and agile workflows.',
    'exp.pulsia.role': 'Microcomputer Systems Technician',
    'exp.pulsia.period': 'March 2022 - June 2022',
    'exp.pulsia.desc': 'Workplace Training (FCT). Focused on hardware maintenance, operating system configuration, network troubleshooting, and technical support.',
    'exp.cv.text': '// For a detailed breakdown, please',
    'exp.cv.link': 'download the CV',

    // Certificates Section Strings
    'certs.title': 'Certified_Credentials',
    'certs.issued': 'Issued',
    'certs.viewAll': 'View all certifications',
    'certs.page.title': 'ALL',
    'certs.page.subtitle': 'CERTIFICATES',
    'certs.page.desc': 'A comprehensive list of verified credentials and badges.',
    'certs.page.title_white': 'ALL',
    'certs.page.title_green': 'CERTIFICATES',
    'certs.page.description': 'A comprehensive list of verified credentials and badges.',
    'certs.page.back': 'cd ..',

    // Stack Section Strings
    'stack.title': 'DEVELOPER_STACK',
    'stack.arsenal': 'Cybersecurity_Arsenal',
    'stack.dev': 'Full_Stack_Dev',

    // Projects Section Strings
    'projects.title': 'Featured_Projects',
    'projects.more': 'View more on GitHub',
    'projects.status.live': 'Live',
    'projects.status.archived': 'Archived',
    'projects.v1.title': 'Portfolio V1',
    'projects.v1.desc': 'Personal folio built with performance and security in mind. Features strict content security policies, zero-js runtime (mostly), and accessible architecture.',
    'projects.tfg.title': 'Success Street (TFG)',
    'projects.tfg.desc': 'Full-stack web application developed for the Higher Technician degree. Implements complex data relationships, user authentication flows, and responsive UI design.',
    'projects.tool1.title': 'Python Port Scanner',
    'projects.tool1.desc': 'Multi-threaded CLI tool for fast port scanning. Faster than standard Nmap scans for specific subnets.',
    'projects.tool2.title': 'Automated Recon Script',
    'projects.tool2.desc': 'Bash script wrapper that automates subdomain enumeration and directory brute-forcing for CTFs.',

    // WriteUps Section Strings
    'writeups.title': 'Write_Ups',
    'writeups.viewAll': '[ View_All_Logs ]',
    'writeups.date': 'Date',
    'writeups.platform': 'Platform',
    'writeups.desc': 'Description / Title',
    'writeups.diff': 'Difficulty',

    // Footer Section Strings
    'footer.status': 'SYSTEM_ONLINE',
    'footer.location': 'LOCATION: SPAIN (ES)',
    'footer.protocol': 'Execute Protocol',
    'footer.ports': 'Open_Ports (Netstat)',
    'footer.session': 'session_id',
    'footer.email_cmd': 'sudo ./email_me',

  },

  // --- SPANISH TRANSLATIONS ---
  es: {
    // Meses
    'month.01': 'Enero',
    'month.02': 'Febrero',
    'month.03': 'Marzo',
    'month.04': 'Abril',
    'month.05': 'Mayo',
    'month.06': 'Junio',
    'month.07': 'Julio',
    'month.08': 'Agosto',
    'month.09': 'Septiembre',
    'month.10': 'Octubre',
    'month.11': 'Noviembre',
    'month.12': 'Diciembre',

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
    'about.p2': 'Ahora a los <span id="dynamic-age">20</span>, me enfoco sobretodo en la parte del <strong class="text-green-500 font-bold">Red Team</strong>. Me gusta mucho enfrentarme a los acertijos complejos y entender cómo fallan los sistemas, aunque también disfruto mucho de la estrategia defensiva del Blue Teaming. ',
    'about.p3': 'Fuera del mundo digital, tengo unos gustos simples. Paso el tiempo jugando videojuegos, yendo al gimnasio o teniendo tiempo de calidad con mi pareja y amigos. Soy un chaval al que le gusta aprender, explorar y, a veces, romper cosas, de forma ética, por supuesto.',
  
    // Texto de la Sección Experiencia
    'exp.title': 'Experiencia_Profesional',
    'exp.ntt.role': 'Desarrollador Java Junior',
    'exp.ntt.period': 'Marzo 2023 - Julio 2024',
    'exp.ntt.desc': 'Contrato laboral vinculado a Formación Profesional Dual. Desarrollo de soluciones backend en ecosistemas Java, participando en la gestión del ciclo de vida del software y flujos de trabajo ágiles.',
    'exp.pulsia.role': 'Técnico de Sistemas Microinformáticos',
    'exp.pulsia.period': 'Marzo 2022 - Junio 2022',
    'exp.pulsia.desc': 'Formación en Centros de Trabajo (FCT). Centrado en mantenimiento de hardware, configuración de sistemas operativos, resolución de problemas de red y soporte técnico.',
    'exp.cv.text': '// Para información más detallada, ',
    'exp.cv.link': 'descarga el CV',

    // Texto de la Sección Certificados
    'certs.title': 'Certificaciones',
    'certs.issued': 'Emitido',
    'certs.viewAll': 'Ver todas las certificaciones',
    'certs.page.title': 'TODOS LOS',
    'certs.page.subtitle': 'CERTIFICADOS',
    'certs.page.desc': 'Una lista detallada de credenciales y insignias verificadas.',
    'certs.page.title_white': 'TODOS LOS',
    'certs.page.title_green': 'CERTIFICADOS',
    'certs.page.description': 'Una lista detallada de credenciales y insignias verificadas.',
    'certs.page.back': 'cd ..',

    // Texto de la Sección Stack
    'stack.title': 'STACK_DESARROLLADOR',
    'stack.arsenal': 'Arsenal_Ciberseguridad',
    'stack.dev': 'Desarrollo_Full_Stack',

    // Texto de la Sección Proyectos
    'projects.title': 'Proyectos_Destacados',
    'projects.more': 'Ver más en GitHub',
    'projects.status.live': 'En vivo',
    'projects.status.archived': 'Archivado',
    'projects.v1.title': 'Portfolio V1',
    'projects.v1.desc': 'Portfolio personal construido con el rendimiento y la seguridad en mente. Incluye políticas de seguridad de contenido estrictas y arquitectura accesible.',
    'projects.tfg.title': 'Success Street (TFG)',
    'projects.tfg.desc': 'Aplicación web full-stack desarrollada para el grado de Técnico Superior. Implementa relaciones de datos complejas y flujos de autenticación.',
    'projects.tool1.title': 'Python Port Scanner',
    'projects.tool1.desc': 'Herramienta CLI multihilo para escaneo rápido de puertos. Más rápido que los escaneos estándar de Nmap para subredes específicas.',
    'projects.tool2.title': 'Script de Recon Automático',
    'projects.tool2.desc': 'Script en Bash que automatiza la enumeración de subdominios y fuerza bruta de directorios para CTFs.',
  
    // Texto de la Sección WriteUps
    'writeups.title': 'Write_Ups',
    'writeups.viewAll': '[ Ver_Logs ]',
    'writeups.date': 'Fecha',
    'writeups.platform': 'Plataforma',
    'writeups.desc': 'Descripción / Título',
    'writeups.diff': 'Dificultad',

    // Texto de la Sección Footer
    'footer.status': 'SISTEMA_ONLINE',
    'footer.location': 'LOCALIZACIÓN: ESPAÑA (ES)',
    'footer.protocol': 'Ejecutar Protocolo',
    'footer.ports': 'Puertos_Abiertos (Netstat)',
    'footer.session': 'id_sesión',
    'footer.email_cmd': 'sudo ./enviar_mail',

  },
} as const;