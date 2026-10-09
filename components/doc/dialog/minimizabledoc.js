import { DocSectionCode } from '@/components/doc/common/docsectioncode';
import { DocSectionText } from '@/components/doc/common/docsectiontext';
import { Button } from '@/components/lib/button/Button';
import { Dialog } from '@/components/lib/dialog/Dialog';
import { useState } from 'react';

export function MinimizableDoc(props) {
    const [visible, setVisible] = useState(false);
    const [combinedVisible, setCombinedVisible] = useState(false);

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
        `,
        combined: `
<Button label="Show both controls" icon="pi pi-external-link" onClick={() => setCombinedVisible(true)} />
<Dialog header="Project notes" visible={combinedVisible} minimizable maximizable style={{ width: '50vw' }} onHide={() => setCombinedVisible(false)}>
    <p className="m-0">Minimize this dialog to keep it nearby, or maximize it to work full screen.</p>
</Dialog>
        `,
        combinedJavascript: `
import React, { useState } from 'react';
import { Button } from '@mantle-ui/react/button';
import { Dialog } from '@mantle-ui/react/dialog';

export default function CombinedDialogDemo() {
    const [visible, setVisible] = useState(false);

    return (
        <div className="card flex justify-content-center">
            <Button label="Show both controls" icon="pi pi-external-link" onClick={() => setVisible(true)} />
            <Dialog header="Project notes" visible={visible} minimizable maximizable style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <p className="m-0">Minimize this dialog to keep it nearby, or maximize it to work full screen.</p>
            </Dialog>
        </div>
    );
}
        `,
        combinedTypescript: `
import React, { useState } from 'react';
import { Button } from '@mantle-ui/react/button';
import { Dialog } from '@mantle-ui/react/dialog';

export default function CombinedDialogDemo() {
    const [visible, setVisible] = useState<boolean>(false);

    return (
        <div className="card flex justify-content-center">
            <Button label="Show both controls" icon="pi pi-external-link" onClick={() => setVisible(true)} />
            <Dialog header="Project notes" visible={visible} minimizable maximizable style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <p className="m-0">Minimize this dialog to keep it nearby, or maximize it to work full screen.</p>
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
                    can be used. The minimized titlebar is compact and truncates long titles while retaining accessible restore and close controls.
                </p>
            </DocSectionText>
            <div className="card flex justify-content-center">
                <Button label="Show" icon="pi pi-external-link" onClick={() => setVisible(true)} />
                <Dialog header="Header" visible={visible} minimizable style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                    <p className="m-0">Minimize this dialog to keep its content open while working on the page.</p>
                </Dialog>
            </div>
            <DocSectionCode code={code} />
            <DocSectionText id="combined" label="Minimizable and Maximizable">
                <p>Minimizing a full-screen dialog preserves its maximized state, so restoring it returns to full screen. Selecting the maximize control from a minimized dialog restores it and toggles full screen in one step.</p>
            </DocSectionText>
            <div className="card flex justify-content-center">
                <Button label="Show both controls" icon="pi pi-external-link" onClick={() => setCombinedVisible(true)} />
                <Dialog
                    header="Project notes"
                    visible={combinedVisible}
                    minimizable
                    maximizable
                    style={{ width: '50vw' }}
                    onHide={() => {
                        if (!combinedVisible) return;
                        setCombinedVisible(false);
                    }}
                >
                    <p className="m-0">Minimize this dialog to keep it nearby, or maximize it to work full screen.</p>
                </Dialog>
            </div>
            <DocSectionCode code={{ basic: code.combined, javascript: code.combinedJavascript, typescript: code.combinedTypescript }} />
        </>
    );
}
