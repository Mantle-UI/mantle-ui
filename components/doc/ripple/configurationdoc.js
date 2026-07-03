import { DocSectionCode } from '@/components/doc/common/docsectioncode';
import { DocSectionText } from '@/components/doc/common/docsectiontext';
import Link from 'next/link';

export function ConfigurationDoc(props) {
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
                <p>
                    To start with, Ripple needs to be enabled globally. See the <Link href="/configuration/#ripple">Configuration API</Link> for details.
                </p>
            </DocSectionText>
            <DocSectionCode code={code} hideToggleCode import hideStackBlitz />
        </>
    );
}
