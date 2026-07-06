import { DocSectionCode } from '@/components/doc/common/docsectioncode';
import { DocSectionText } from '@/components/doc/common/docsectiontext';

export function ImportDoc(props) {
    const code = {
        basic: `
import { Paginator } from '@mantle-ui/react/paginator';
        `
    };

    return (
        <>
            <DocSectionText {...props} />
            <DocSectionCode code={code} hideToggleCode import hideStackBlitz />
        </>
    );
}
