import { DocSectionCode } from '@/components/doc/common/docsectioncode';
import { DocSectionText } from '@/components/doc/common/docsectiontext';

export function RippleDoc(props) {
    const code = {
        basic: `
//_app.js
import { MantleProvider } from 'primereact/api';

export default function MyApp({ Component }) {
    const value = {
        ripple: true,
        ...
    };

    return (
        <MantleProvider value={value}>
            <App />
        </MantleProvider>
    );
}
        `
    };

    return (
        <>
            <DocSectionText {...props}>
                <p>Ripple is an optional animation for the supported components such as buttons. It is disabled by default.</p>
            </DocSectionText>
            <DocSectionCode code={code} hideToggleCode import hideStackBlitz />
        </>
    );
}
