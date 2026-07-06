import { DocSectionCode } from '@/components/doc/common/docsectioncode';
import { DocSectionText } from '@/components/doc/common/docsectiontext';
import { Button } from '@/components/lib/button/Button';
import { IconField } from '@/components/lib/iconfield/IconField';
import { InputIcon } from '@/components/lib/inputicon/InputIcon';
import { InputText } from '@/components/lib/inputtext/InputText';
import { SplitButton } from '@/components/lib/splitbutton/SplitButton';
import { Toolbar } from '@/components/lib/toolbar/Toolbar';
import React from 'react';

export function BasicDoc(props) {
    const items = [
        {
            label: 'Update',
            icon: 'pi pi-refresh'
        },
        {
            label: 'Delete',
            icon: 'pi pi-times'
        }
    ];

    const startContent = (
        <React.Fragment>
            <Button icon="pi pi-plus" className="mr-2" />
            <Button icon="pi pi-print" className="mr-2" />
            <Button icon="pi pi-upload" />
        </React.Fragment>
    );

    const centerContent = (
        <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText placeholder="Search" />
        </IconField>
    );

    const endContent = (
        <React.Fragment>
            <SplitButton label="Save" model={items} icon="pi pi-check" />
        </React.Fragment>
    );

    const code = {
        basic: `
<Toolbar start={startContent} end={endContent} />
        `,
        javascript: `
import React from 'react';
import { Toolbar } from '@mantle-ui/react/toolbar';
import { Button } from '@mantle-ui/react/button';
import { SplitButton } from '@mantle-ui/react/splitbutton';
import { InputText } from '@mantle-ui/react/inputtext';
import { IconField } from '@mantle-ui/react/iconfield';
import { InputIcon } from '@mantle-ui/react/inputicon';

export default function BasicDemo() {
    const items = [
        {
            label: 'Update',
            icon: 'pi pi-refresh'
        },
        {
            label: 'Delete',
            icon: 'pi pi-times'
        }
    ];

    const startContent = (
        <React.Fragment>
            <Button icon="pi pi-plus" className="mr-2" />
            <Button icon="pi pi-print" className="mr-2" />
            <Button icon="pi pi-upload" />
        </React.Fragment>
    );

    const centerContent = (
        <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText placeholder="Search" />
        </IconField>
    );

    const endContent = (
        <React.Fragment>
            <SplitButton label="Save" model={items} icon="pi pi-check"></SplitButton>
        </React.Fragment>
    );

    return (
        <div className="card">
            <Toolbar start={startContent} center={centerContent} end={endContent} />
        </div>
    );
}
        `,
        typescript: `
import React from 'react';
import { Toolbar } from '@mantle-ui/react/toolbar';
import { Button } from '@mantle-ui/react/button';
import { MenuItem } from '@mantle-ui/react/menuitem';
import { SplitButton } from '@mantle-ui/react/splitbutton';
import { InputText } from '@mantle-ui/react/inputtext';
import { IconField } from '@mantle-ui/react/iconfield';
import { InputIcon } from '@mantle-ui/react/inputicon';

export default function BasicDemo() {
    const items: MenuItem[] = [
        {
            label: 'Update',
            icon: 'pi pi-refresh'
        },
        {
            label: 'Delete',
            icon: 'pi pi-times'
        }
    ];

    const startContent = (
        <React.Fragment>
            <Button icon="pi pi-plus" className="mr-2" />
            <Button icon="pi pi-print" className="mr-2" />
            <Button icon="pi pi-upload" />
        </React.Fragment>
    );

    const centerContent = (
        <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText placeholder="Search" />
        </IconField>
    );

    const endContent = (
        <React.Fragment>
            <SplitButton label="Save" model={items} icon="pi pi-check"></SplitButton>
        </React.Fragment>
    );

    return (
        <div className="card">
            <Toolbar start={startContent} center={centerContent} end={endContent} />
        </div>
    );
}
        `
    };

    return (
        <>
            <DocSectionText {...props}>
                <p>
                    Toolbar provides <i>start</i>, <i>center</i> and <i>end</i> properties to place content at these sections.
                </p>
            </DocSectionText>
            <div className="card">
                <Toolbar start={startContent} center={centerContent} end={endContent} />
            </div>
            <DocSectionCode code={code} />
        </>
    );
}
