import { DocSectionCode } from '@/components/doc/common/docsectioncode';
import { DocSectionText } from '@/components/doc/common/docsectiontext';

export function ContextDoc(props) {
    const code = {
        basic: `
import { MantleProvider, MantleContext } from '@mantle-ui/react/api';
        `
    };

    const code2 = {
        basic: `
// _app.js
import { MantleProvider } from '@mantle-ui/react/api';

export default function MyApp({ Component, pageProps }) {
    return (
        <MantleProvider>
            <Component {...pageProps} />
        </MantleProvider>
    );
}
        `
    };

    return (
        <>
            <DocSectionText {...props}>
                <p>
                    Configuration is managed by the <i>MantleProvider</i> and <i>MantleContext</i> imported from <i>@mantle-ui/react/api</i>.
                </p>
            </DocSectionText>
            <DocSectionCode code={code} hideToggleCode import hideStackBlitz />
            <div className="doc-section-description">
                <p>
                    The <i>MantleProvider</i> component is used to wrap the application and the <i>MantleContext</i> is used to access the configuration options.
                </p>
            </div>
            <DocSectionCode code={code2} hideToggleCode import hideStackBlitz />
        </>
    );
}
