import { DocSectionCode } from '@/components/doc/common/docsectioncode';
import { DocSectionText } from '@/components/doc/common/docsectiontext';
import { Button } from '@/components/lib/button/Button';
import { MobileNav } from '@/components/lib/mobilenav/MobileNav';
import { useState } from 'react';

const items = [
    {
        label: 'Getting Started',
        icon: 'pi pi-home',
        items: [
            { label: 'Installation', url: '#installation' },
            { label: 'Configuration', url: '#configuration' }
        ]
    },
    {
        label: 'Components',
        icon: 'pi pi-compass',
        items: [
            {
                label: 'Form',
                items: [
                    { label: 'Button', url: '#button' },
                    { label: 'InputText', url: '#inputtext' }
                ]
            }
        ]
    }
];

export function BasicDoc(props) {
    const [visible, setVisible] = useState(false);
    const code = {
        basic: `
<Button icon="pi pi-bars" onClick={() => setVisible(true)} aria-controls="mobile-navigation" aria-expanded={visible} />
<MobileNav id="mobile-navigation" visible={visible} onHide={() => setVisible(false)} model={items} />
        `,
        javascript: `
import React, { useState } from 'react';
import { Button } from '@mantle-ui/react/button';
import { MobileNav } from '@mantle-ui/react/mobilenav';

const items = [
    {
        label: 'Getting Started',
        icon: 'pi pi-home',
        items: [{ label: 'Installation', url: '/installation' }]
    }
];

export default function BasicDemo() {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <Button icon="pi pi-bars" onClick={() => setVisible(true)} aria-controls="mobile-navigation" aria-expanded={visible} />
            <MobileNav id="mobile-navigation" visible={visible} onHide={() => setVisible(false)} model={items} />
        </>
    );
}
        `,
        typescript: `
import React, { useState } from 'react';
import { Button } from '@mantle-ui/react/button';
import { MobileNav } from '@mantle-ui/react/mobilenav';
import { MenuItem } from '@mantle-ui/react/menuitem';

const items: MenuItem[] = [
    {
        label: 'Getting Started',
        icon: 'pi pi-home',
        items: [{ label: 'Installation', url: '/installation' }]
    }
];

export default function BasicDemo() {
    const [visible, setVisible] = useState<boolean>(false);

    return (
        <>
            <Button icon="pi pi-bars" onClick={() => setVisible(true)} aria-controls="mobile-navigation" aria-expanded={visible} />
            <MobileNav id="mobile-navigation" visible={visible} onHide={() => setVisible(false)} model={items} />
        </>
    );
}
        `
    };

    return (
        <>
            <DocSectionText {...props}>
                <p>
                    MobileNav is controlled with the <i>visible</i> property. It uses a left-side overlay drawer by default, and closes on mask click, Escape, or after a leaf item is selected.
                </p>
            </DocSectionText>
            <div className="card flex justify-content-center">
                <Button icon="pi pi-bars" onClick={() => setVisible(true)} aria-controls="mobile-navigation" aria-expanded={visible} />
                <MobileNav id="mobile-navigation" visible={visible} onHide={() => setVisible(false)} model={items} />
            </div>
            <DocSectionCode code={code} />
        </>
    );
}
