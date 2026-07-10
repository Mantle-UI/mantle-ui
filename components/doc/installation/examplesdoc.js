import { DocSectionText } from '@/components/doc/common/docsectiontext';

export function ExamplesDoc(props) {
    return (
        <>
            <DocSectionText {...props}>
                <p>Mantle UI works with the usual React application setups, including Vite and Next.js.</p>
                <p>Framework-specific starter examples are being refreshed for the Mantle UI project and will be published in the repository as they are finalized.</p>
            </DocSectionText>
        </>
    );
}
