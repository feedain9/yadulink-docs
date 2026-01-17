// @ts-check
// Docusaurus Configuration pour Yadulink Help Center

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Yadulink Help Center',
  tagline: 'Automatisez votre prospection LinkedIn',
  favicon: 'img/favicon.ico',

  // URL de production
  url: 'https://docs.yadulink.com',
  baseUrl: '/',

  // GitHub Pages deployment config
  organizationName: 'feedain9', // Votre org/user GitHub
  projectName: 'yadulink-docs', // Nom du repo

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Internationalisation (FR par défaut, EN disponible)
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    localeConfigs: {
      fr: {
        label: 'Français',
        htmlLang: 'fr-FR',
      },
      en: {
        label: 'English',
        htmlLang: 'en-US',
      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/', // Docs à la racine (pas /docs/)
          sidebarPath: './sidebars.js',
          // Lien "Modifier cette page" vers GitHub
          editUrl: 'https://github.com/feedain9/yadulink-docs/tree/master/',
        },
        blog: false, // Pas de blog
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Image pour les partages sociaux
      image: 'img/yadulink-social-card.png',

      navbar: {
        title: 'Yadulink',
        logo: {
          alt: 'Yadulink Logo',
          src: 'img/logo.webp',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://app.yadulink.com',
            label: 'Accéder à Yadulink',
            position: 'right',
          },
        ],
      },

      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'Pour commencer',
                to: '/pour-commencer/presentation-de-yadulink',
              },
              {
                label: 'Automatisations',
                to: '/automatisations/introduction',
              },
              {
                label: 'IA',
                to: '/ia/introduction',
              },
            ],
          },
          {
            title: 'Yadulink',
            items: [
              {
                label: 'Application',
                href: 'https://app.yadulink.com',
              },
              {
                label: 'Site web',
                href: 'https://yadulink.com',
              },
              {
                label: 'Contact',
                href: 'https://yadulink.com/contact',
              },
            ],
          },
          {
            title: 'Suivez-nous',
            items: [
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/company/yadulink',
              },
              {
                label: 'YouTube',
                href: 'https://www.youtube.com/@yadulink',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Yadulink. Built with Docusaurus.`,
      },

      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },

      // Couleurs du thème (mode clair/sombre disponible)
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },

      // Barre d'annonces (optionnel)
      // announcementBar: {
      //   id: 'new_feature',
      //   content: '🎉 Nouvelle fonctionnalité : Découvrez les filtres IA !',
      //   backgroundColor: '#10b981',
      //   textColor: '#ffffff',
      //   isCloseable: true,
      // },
    }),

  // Plugins additionnels
  plugins: [
    // Recherche locale (gratuit, sans Algolia)
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['fr', 'en'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],
};

export default config;
