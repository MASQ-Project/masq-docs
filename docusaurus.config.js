// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'MASQ Docs',
  tagline: 'MASQ Network documentation',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://test-docs.masqbrowser.com',
  baseUrl: '/',

  organizationName: 'MASQ-Project',
  projectName: 'masq-docs',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
      onBrokenMarkdownImages: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/MASQ-Project/masq-docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/masq-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'MASQ Docs',
        logo: {
          alt: 'MASQ',
          src: 'img/logo.png',
          href: '/',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://masqbrowser.com',
            label: 'Website',
            position: 'right',
          },
          {
            href: 'https://github.com/MASQ-Project',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {label: 'What is MASQ?', to: '/masq-network/what-is-masq'},
              {label: 'Browser', to: '/masq-web3-privacy-browser'},
              {label: 'Token', to: '/masq-token'},
            ],
          },
          {
            title: 'Community',
            items: [
              {label: 'Discord', href: 'https://discord.gg/cdUsjBQrgq'},
              {label: 'Telegram', href: 'https://t.me/MASQ_ai'},
              {label: 'X', href: 'https://twitter.com/MASQ_ai'},
            ],
          },
          {
            title: 'More',
            items: [
              {label: 'Website', href: 'https://masqbrowser.com'},
              {label: 'GitHub', href: 'https://github.com/MASQ-Project'},
              {label: 'Blog', href: 'https://masqbrowser.com/blog'},
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} MASQ Network. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'json', 'rust'],
      },
    }),
};

export default config;
