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

  url: 'https://docs.masqbrowser.com',
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
        // Explicit maps for paths that no longer exist as live pages
        redirects: [
          {to: '/', from: '/masq'},
          {
            to: '/advanced-use/masq-node-from-cli/configuration-methods',
            from: [
              '/advanced-use/masq-node-from-cli/untitled-1',
              '/masq/advanced-use/masq-node-from-cli/untitled-1',
            ],
          },
          {
            to: '/advanced-use/common-challenges/user-permissions-real-user',
            from: [
              '/advanced-use/common-challenges/untitled-2',
              '/masq/advanced-use/common-challenges/untitled-2',
            ],
          },
          {
            to: '/advanced-use/common-challenges/port-53-problems',
            from: [
              '/advanced-use/common-challenges/untitled-3',
              '/masq/advanced-use/common-challenges/untitled-3',
            ],
          },
        ],
        createRedirects(existingPath) {
          /** @type {string[]} */
          const from = [];

          // Homepage handled via explicit redirect (/masq).
          // Do not also emit /masq/ — same stub file on disk (esp. Windows).
          if (existingPath !== '/') {
            from.push(`/masq${existingPath}`);
          }

          // Privacy-browser folder renames (with and without /masq prefix)
          if (existingPath.startsWith('/masq-privacy-browser')) {
            const web3Path = existingPath
              .replace('/masq-privacy-browser', '/masq-web3-privacy-browser')
              .replace('/updating-masq-browser', '/updating-masq-web3-browser');
            from.push(web3Path, `/masq${web3Path}`);
          }

          return from.length > 0 ? from : undefined;
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
