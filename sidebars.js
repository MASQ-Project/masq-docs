// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'category',
      label: '🌐 MASQ Network',
      link: {type: 'doc', id: 'index'},
      items: [
        'masq-network/what-is-masq',
        'masq-network/official-community-links',
        'masq-network/faqs',
        'masq-network/masq-comparison',
      ],
    },
    {
      type: 'category',
      label: '💻 MASQ Privacy Browser',
      link: {type: 'doc', id: 'masq-privacy-browser/index'},
      items: [
        {
          type: 'category',
          label: 'Install Requirements',
          link: {type: 'doc', id: 'masq-privacy-browser/install-requirements/index'},
          items: [
            'masq-privacy-browser/install-requirements/masq-tokens',
            'masq-privacy-browser/install-requirements/using-installer-files-on-macos-linux',
            'masq-privacy-browser/install-requirements/system-cleanup',
          ],
        },
        'masq-privacy-browser/beta-faqs',
        {
          type: 'category',
          label: 'Updating MASQ Browser',
          link: {
            type: 'doc',
            id: 'masq-privacy-browser/updating-masq-browser/index',
          },
          items: [
            'masq-privacy-browser/updating-masq-browser/breaking-change-releases',
            'masq-privacy-browser/updating-masq-browser/over-the-air-updating',
          ],
        },
        'masq-privacy-browser/providing-feedback',
        {
          type: 'category',
          label: 'Troubleshooting',
          link: {type: 'doc', id: 'masq-privacy-browser/troubleshooting/index'},
          items: [
            'masq-privacy-browser/troubleshooting/checking-masq-browser-version',
            'masq-privacy-browser/troubleshooting/ports-issue',
            'masq-privacy-browser/troubleshooting/port-80-common-to-windows',
            'masq-privacy-browser/troubleshooting/macos-user-startup-issue',
          ],
        },
      ],
    },
    {
      type: 'doc',
      id: 'masq-extension-app',
      label: '🖱️ MASQ Extension App',
    },
    {
      type: 'category',
      label: '📑 Core Concepts',
      link: {type: 'doc', id: 'core-concepts/index'},
      items: [
        'core-concepts/masq-network-dynamics',
        {
          type: 'category',
          label: 'MASQ Neighborhoods',
          link: {type: 'doc', id: 'core-concepts/neighborhoods/index'},
          items: ['core-concepts/neighborhoods/masq-suburbs'],
        },
        'core-concepts/gossip-protocol',
        {
          type: 'category',
          label: 'CORES Packages',
          link: {type: 'doc', id: 'core-concepts/cores-packages/index'},
          items: ['core-concepts/cores-packages/life-of-a-cores-package'],
        },
        'core-concepts/encryption-methods-explained',
        'core-concepts/clandestine-routing',
      ],
    },
    {
      type: 'category',
      label: '👨‍💻 Advanced Use',
      link: {type: 'doc', id: 'advanced-use/index'},
      items: [
        {
          type: 'category',
          label: 'MASQ Node from CLI',
          link: {type: 'doc', id: 'advanced-use/masq-node-from-cli/index'},
          items: [
            'advanced-use/masq-node-from-cli/configuration-methods',
            'advanced-use/masq-node-from-cli/masq-interface',
            'advanced-use/masq-node-from-cli/masq-daemon-commands',
            'advanced-use/masq-node-from-cli/configuring-masq-node',
            'advanced-use/masq-node-from-cli/cli-faq',
          ],
        },
        {
          type: 'category',
          label: 'CLI Startup Guides',
          link: {type: 'doc', id: 'advanced-use/cli-startup-guides/index'},
          items: [
            'advanced-use/cli-startup-guides/masq-cli-windows',
            'advanced-use/cli-startup-guides/masq-cli-linux',
          ],
        },
        'advanced-use/setting-masq-wallets',
        'advanced-use/blockchain-service-endpoint',
        'advanced-use/port-forwarding',
        'advanced-use/compiling-masq-node',
        {
          type: 'category',
          label: 'Common Challenges',
          link: {type: 'doc', id: 'advanced-use/common-challenges/index'},
          items: [
            'advanced-use/common-challenges/firewall-exceptions',
            'advanced-use/common-challenges/port-53-problems',
            'advanced-use/common-challenges/user-permissions-real-user',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '🔷 MASQ Token',
      link: {type: 'doc', id: 'masq-token/index'},
      items: [
        'masq-token/token-economy',
        'masq-token/masqonbase-superbridge',
        'masq-token/masq-erc20',
      ],
    },
    {
      type: 'category',
      label: '📦 Resources',
      link: {type: 'doc', id: 'resources/index'},
      items: [
        'resources/installer-checksums',
        {
          type: 'link',
          label: 'GitHub',
          href: 'https://github.com/MASQ-Project/Node',
        },
        {
          type: 'link',
          label: 'X/Twitter',
          href: 'https://twitter.com/MASQ_ai',
        },
        {
          type: 'link',
          label: 'Telegram',
          href: 'https://t.me/MASQ_ai',
        },
        {
          type: 'link',
          label: 'Discord',
          href: 'https://discord.gg/cdUsjBQrgq',
        },
        {
          type: 'link',
          label: 'Blog',
          href: 'https://masqbrowser.com/blog',
        },
      ],
    },
    {
      type: 'category',
      label: 'Legal',
      link: {type: 'doc', id: 'legal/index'},
      items: ['legal/disclaimer', 'legal/privacy-policy'],
    },
  ],
};

export default sidebars;
