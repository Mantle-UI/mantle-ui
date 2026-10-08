import { DocSectionCode } from '@/components/doc/common/docsectioncode';
import { DocSectionText } from '@/components/doc/common/docsectiontext';
import { Button } from '@/components/lib/button/Button';
import { Dialog } from '@/components/lib/dialog/Dialog';
import { useState } from 'react';

export function MinimizableDoc(props) {
    const [visible, setVisible] = useState(false);

    const code = {
        basic: `
<Button label="Show" icon="pi pi-external-link" onClick={() => setVisible(true)} />
<Dialog header="Header" visible={visible} minimizable style={{ width: '50vw' }} onHide={() => setVisible(false)}>
    <p className="m-0">Minimize this dialog to keep its content open while working on the page.</p>
</Dialog>
        `,
        javascript: `
import React, { useState } from 'react';
import { Button } from '@mantle-ui/react/button';
import { Dialog } from '@mantle-ui/react/dialog';

export default function MinimizableDemo() {
    const [visible, setVisible] = useState(false);

    return (
        <div className="card flex justify-content-center">
            <Button label="Show" icon="pi pi-external-link" onClick={() => setVisible(true)} />
            <Dialog header="Header" visible={visible} minimizable style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <p className="m-0">Minimize this dialog to keep its content open while working on the page.</p>
            </Dialog>
        </div>
    );
}
        `,
        typescript: `
import React, { useState } from 'react';
import { Button } from '@mantle-ui/react/button';
import { Dialog } from '@mantle-ui/react/dialog';

export default function MinimizableDemo() {
    const [visible, setVisible] = useState<boolean>(false);

    return (
        <div className="card flex justify-content-center">
            <Button label="Show" icon="pi pi-external-link" onClick={() => setVisible(true)} />
            <Dialog header="Header" visible={visible} minimizable style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <p className="m-0">Minimize this dialog to keep its content open while working on the page.</p>
            </Dialog>
        </div>
    );
}
        `
    };

    return (
        <>
            <DocSectionText {...props}>
                <p>
                    Adding <i>minimizable</i> displays a title bar button that toggles between minimize and restore. Minimizing keeps the dialog mounted, retains its state and disables its modal mask, focus trap and scroll blocking so that the page
                    can be used. The minimized titlebar is compact and truncates long titles while retaining accessible restore and close controls. To keep full-screen behavior predictable, the minimize control is unavailable while a dialog is
                    maximized.
                </p>
            </DocSectionText>
            <div className="card flex justify-content-center">
                <Button label="Show" icon="pi pi-external-link" onClick={() => setVisible(true)} />
                <Dialog header="Header" visible={visible} minimizable style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                    <p className="m-0">Minimize this dialog to keep its content open while working on the page.</p>
                </Dialog>
            </div>
            <DocSectionCode code={code} />
        </>
    );
}
