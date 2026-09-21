import { DocSectionText } from '@/components/doc/common/docsectiontext';

export const Wireframe = (props) => (
    <DocSectionText {...props}>
        <pre className="m-0 overflow-auto">{`MobileNav
└─ nav
   └─ menu
      └─ menuitem
         ├─ action
         │  ├─ icon
         │  ├─ label
         │  └─ toggleIcon
         └─ submenuWrapper
            └─ submenu`}</pre>
    </DocSectionText>
);
