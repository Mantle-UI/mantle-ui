import { DocSectionCode } from '@/components/doc/common/docsectioncode';
import { DocSectionText } from '@/components/doc/common/docsectiontext';
import { MantleIcons } from '@/components/lib/api/MantleIcons';
import { Menu } from '@/components/lib/menu/Menu';

export function ConstantsDoc(props) {
    const items = [
        {
            label: 'File',
            items: [
                { label: 'New', icon: MantleIcons.PLUS },
                { label: 'Open', icon: MantleIcons.DOWNLOAD }
            ]
        }
    ];

    const code = {
        basic: `
import React from 'react'; 
import { Menu } from 'primereact/menu';
import { MantleIcons } from 'primereact/api';

export default function ConstantsDemo() {
    const items = [
        {
            label: 'File',
            items: [
                { label: 'New', icon: MantleIcons.PLUS },
                { label: 'Open', icon: MantleIcons.DOWNLOAD }
            ]
        }
    ];

    return (
        <Menu model={items} />
    )
}
        `
    };

    return (
        <>
            <DocSectionText {...props}>
                <p>Constants API is available to reference icons easily when used programmatically.</p>
            </DocSectionText>
            <div className="card flex justify-content-center">
                <Menu model={items} />
            </div>
            <DocSectionCode code={code} hideToggleCode import hideStackBlitz />
        </>
    );
}

