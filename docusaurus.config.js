// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'MASQ Network Documentation',
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
          breadcrumbs: false,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      /** @type {import('@docusaurus/plugin-client-redirects').Options} */
      ({
        createRedirects(existingPath) {
          if (!existingPath.startsWith('/masq-privacy-browser')) {
            return undefined;
          }
          // Old folder names kept working via client redirects
          return [
            existingPath
              .replace('/masq-privacy-browser', '/masq-web3-privacy-browser')
              .replace('/updating-masq-browser', '/updating-masq-web3-browser'),
          ];
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
            href: 'https://www.masqbrowser.com/downloads',
            label: 'Download MASQ Now',
            position: 'right',
          },
          {
            href: 'https://github.com/MASQ-Project',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'MASQ on GitHub',
          },
        ],
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'json', 'rust'],
      },
    }),
};

export default config;
