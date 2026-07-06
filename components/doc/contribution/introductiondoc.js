import { DocSectionText } from '@/components/doc/common/docsectiontext';
import { DocSectionCode } from '../common/docsectioncode';

export function IntroductionDoc(props) {
    const code = {
        code1: {
            basic: `
git clone https://github.com/Mantle-UI/mantle-ui.git
cd mantle-ui
`
        },
        code2: {
            basic: `
npm install
npm run dev
`
        },
        code3: {
            basic: `
- components
    - doc // Documentations
    - lib // Components
- pages // Routing Pages
- styles // Themes and Styles
- service // Demo Services

`
        }
    };

    return (
        <DocSectionText {...props}>
            <p>
                Mantle UI is an independent community-maintained React component library continued from the MIT-licensed PrimeReact v10 codebase. The project focuses on delivering high-quality, versatile, and accessible UI components for React
                applications.
            </p>
            <h3>Development Setup</h3>
            <p>To begin with, clone the MantleUI repository from GitHub</p>
            <DocSectionCode code={code.code1} hideToggleCode hideStackBlitz />
            <p>
                Then run the showcase in your local environment at <i>http://localhost:3000/</i>.
            </p>
            <DocSectionCode code={code.code2} hideToggleCode hideStackBlitz />
            <h3>Project Structure</h3>

            <DocSectionCode code={code.code3} hideToggleCode hideStackBlitz />
        </DocSectionText>
    );
}
