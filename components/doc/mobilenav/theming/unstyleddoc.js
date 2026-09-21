import { DocSectionCode } from '@/components/doc/common/docsectioncode';
import { DocSectionText } from '@/components/doc/common/docsectiontext';
import Link from 'next/link';

export function UnstyledDoc(props) {
    const tailwind = `
const Tailwind = {
    mobilenav: {
        root: 'fixed top-0 left-0 z-[1102] h-full w-72 bg-white/30 text-slate-900 backdrop-blur-xl dark:bg-slate-950/30 dark:text-white',
        nav: 'h-full overflow-auto p-4',
        menu: 'm-0 list-none p-0',
        submenu: 'm-0 ml-4 list-none py-1',
        menuitem: ({ context }) => ({
            className: context.active ? 'text-cyan-500' : undefined
        }),
        action: 'flex w-full items-center rounded-md py-2 font-semibold transition-colors hover:text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400',
        icon: 'mr-2 inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300',
        toggleIcon: 'ml-auto h-3.5 w-3.5',
        submenuWrapper: 'overflow-hidden',
        groupLabel: 'mb-1 flex py-2 text-sm font-semibold tracking-wide',
        separator: 'my-2 h-px bg-slate-200 dark:bg-slate-700'
    }
};
    `;
    const code = {
        basic: tailwind,
        javascript: `${tailwind}
import React, { useState } from 'react';
import { MantleProvider } from '@mantle-ui/react/api';
import { Button } from '@mantle-ui/react/button';
import { MobileNav } from '@mantle-ui/react/mobilenav';

const items = [
    { label: 'Getting Started', icon: 'pi pi-home', items: [{ label: 'Installation', url: '/installation' }] },
    { label: 'Components', icon: 'pi pi-compass', items: [{ label: 'Button', url: '/button' }] }
];

function App() {
    const [visible, setVisible] = useState(false);

    return (
        <MantleProvider value={{ unstyled: true, pt: Tailwind }}>
            <Button label="Menu" icon="pi pi-bars" onClick={() => setVisible(true)} />
            <MobileNav visible={visible} onHide={() => setVisible(false)} model={items} />
        </MantleProvider>
    );
}
        `
    };

    return (
        <DocSectionText {...props}>
            <p>
                Set <i>unstyled</i> to remove MobileNav&apos;s default styles, then use pass-through options to apply your own design. The example below creates a translucent, blurred Tailwind drawer and styles its navigation tree. See{' '}
                <Link href="/tailwind">Tailwind Customization</Link> for more patterns.
            </p>
            <DocSectionCode code={{ basic: code.basic }} hideToggleCode import hideStackBlitz />
            <p>Apply the pass-through configuration globally with MantleProvider.</p>
            <DocSectionCode code={{ javascript: code.javascript }} embedded />
        </DocSectionText>
    );
}
