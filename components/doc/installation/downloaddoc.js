import { DocSectionCode } from '@/components/doc/common/docsectioncode';
import { DocSectionText } from '@/components/doc/common/docsectiontext';

export function DownloadDoc(props) {
    const code = {
        basic: `
// with npm
npm install @mantle-ui/react

// with yarn
yarn add @mantle-ui/react
        `
    };

    return (
        <>
            <DocSectionText {...props}>
                <p>
                    Mantle UI is available on <a href="https://www.npmjs.com/package/@mantle-ui/react">npm</a>.
                </p>
            </DocSectionText>
            <DocSectionCode code={code} hideToggleCode import hideStackBlitz />
        </>
    );
}
