import React from 'react';
import Link from '@docusaurus/Link';
import Content from '@theme-original/DocSidebar/Desktop/Content';

export default function ContentWrapper(props) {
  return (
    <div className="masq-sidebar-content">
      <Content {...props} />
      <div className="masq-sidebar-attribution">
        <Link href="https://docusaurus.io/" target="_blank" rel="noopener noreferrer">
          Built with Docusaurus
        </Link>
      </div>
    </div>
  );
}
