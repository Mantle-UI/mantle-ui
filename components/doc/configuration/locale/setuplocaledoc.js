import { DocSectionCode } from '@/components/doc/common/docsectioncode';
import { DocSectionText } from '@/components/doc/common/docsectiontext';

export function SetupLocaleDoc(props) {
    const code = {
        basic: `
// _app.js
import { MantleProvider } from 'primereact/api';

export default function MyApp({ Component }) {
    const value = {
        locale: 'de',
        ...
    };

    return (
        <MantleProvider value={value}>
            <Component />
        </MantleProvider>
    );
}
        `
    };

    return (
        <>
            <DocSectionText {...props}>
                <p>
                    To establish the default locale for your entire application, you can utilize the
                    <i> MantleProvider</i>.
                </p>

                <p>
                    When <b>MantleProvider</b> is used, it becomes the primary source of locale configuration for all MantleUI components.
                </p>

                <h5>Locale Precedence</h5>
                <p>Locale resolution follows the order below:</p>
                <ul>
                    <li>
                        <code>locale</code> prop defined on a component
                    </li>
                    <li>
                        <code>MantleProvider</code> (<code>context.locale</code>)
                    </li>
                    <li>
                        Global <code>MantleUI.locale</code> set via <code>locale()</code>
                    </li>
                    <li>Browser locale</li>
                </ul>

                <p>
                    This means that once <b>MantleProvider</b> is present, calling
                    <code> locale()</code> alone is not sufficient. The locale must be provided explicitly through the provider.
                </p>
            </DocSectionText>

            <DocSectionCode code={code} hideToggleCode import hideStackBlitz />
        </>
    );
}
