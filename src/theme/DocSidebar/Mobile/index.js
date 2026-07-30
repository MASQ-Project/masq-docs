import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {
  NavbarSecondaryMenuFiller,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import DocSidebarItems from '@theme/DocSidebarItems';

function DocSidebarMobileSecondaryMenu({sidebar, path}) {
  const mobileSidebar = useNavbarMobileSidebar();
  return (
    <div className="masq-sidebar-content masq-sidebar-content--mobile">
      <ul className={clsx(ThemeClassNames.docs.docSidebarMenu, 'menu__list')}>
        <DocSidebarItems
          items={sidebar}
          activePath={path}
          onItemClick={(item) => {
            if (item.type === 'category' && item.href) {
              mobileSidebar.toggle();
            }
            if (item.type === 'link') {
              mobileSidebar.toggle();
            }
          }}
          level={1}
        />
      </ul>
      <div className="masq-sidebar-attribution">
        <Link href="https://docusaurus.io/" target="_blank" rel="noopener noreferrer">
          Built with Docusaurus
        </Link>
      </div>
    </div>
  );
}

function DocSidebarMobile(props) {
  return (
    <NavbarSecondaryMenuFiller
      component={DocSidebarMobileSecondaryMenu}
      props={props}
    />
  );
}

export default React.memo(DocSidebarMobile);
