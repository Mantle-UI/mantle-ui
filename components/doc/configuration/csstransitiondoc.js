import { DocSectionCode } from '@/components/doc/common/docsectioncode';
import { DocSectionText } from '@/components/doc/common/docsectiontext';

export function CSSTransitionDoc(props) {
    const code = {
        basic: `
//_app.js
import { MantleProvider } from 'primereact/api';

export default function MyApp({ Component }) {
    const value = {
        cssTransition: false,
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
                    MantleUI components utilize <a href="https://www.npmjs.com/package/react-transition-group">react-transition-group</a> internally to implement animations. Setting <i>cssTransition</i> to false disables all animations.
                </p>
            </DocSectionText>
            <DocSectionCode code={code} hideToggleCode import hideStackBlitz />
        </>
    );
}
