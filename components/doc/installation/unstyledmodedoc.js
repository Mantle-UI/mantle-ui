import { DocSectionCode } from '@/components/doc/common/docsectioncode';
import { DocSectionText } from '@/components/doc/common/docsectiontext';
import Link from 'next/link';

export function UnstyledModeDoc(props) {
    const code = {
        basic: `
import { MantleProvider } from "@mantle-ui/react/api";
...
return(
    <MantleProvider value={{ unstyled: true }}>
        <App />
    </MantleProvider>
)
`
    };

    return (
        <>
            <DocSectionText {...props}>
                <p>
                    Unstyled mode is disabled by default for all components. Using the MantleContext during installation, set <i>unstyled</i> as true to enable it globally. Visit the <Link href="/unstyled">Unstyled mode</Link> documentation for more
                    information and examples.
                </p>
                <DocSectionCode code={code} hideToggleCode import hideStackBlitz />
            </DocSectionText>
        </>
    );
}
